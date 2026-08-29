import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { config } from '../config';
import { getRunner } from '../runners';
import type { ExecutionJob, ExecutionResult, Sandbox } from './types';

interface DockerRun {
  code: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Runs each submission in a single-use Docker container.
 *
 * Every guarantee the platform makes about untrusted code lives here:
 *   --network none                    no outbound traffic, cannot reach the API or DB
 *   --memory / --memory-swap          hard RAM cap, swap disabled so it cannot cheat
 *   --cpus                            CPU share cap
 *   --pids-limit                      fork-bomb protection
 *   --read-only + tmpfs /tmp          immutable rootfs, small writable scratch only
 *   --cap-drop ALL                    no Linux capabilities whatsoever
 *   --security-opt no-new-privileges  setuid binaries cannot escalate
 *   --user 1000:1000                  never root inside the container
 *   no host mounts                    the source file is copied in with `docker cp`,
 *                                     so no host directory is ever visible to the code
 *   scrubbed env                      the child docker CLI inherits only PATH, so this
 *                                     service's token and the API's secrets are unreachable
 *
 * Copying the file in rather than bind-mounting it also keeps the driver correct
 * when the service itself runs inside a container talking to the host daemon —
 * a bind-mount path would resolve on the host, not in this process's filesystem.
 */
export class DockerSandbox implements Sandbox {
  readonly name = 'docker';

  async preflight(): Promise<{ ok: boolean; detail: string }> {
    const version = await this.docker(['version', '--format', '{{.Server.Version}}'], 8000);
    if (version.code !== 0) {
      return { ok: false, detail: 'Docker daemon is not reachable — is Docker Desktop running?' };
    }

    const images = await this.docker(['images', '--format', '{{.Repository}}:{{.Tag}}'], 8000);
    const available = new Set(images.stdout.split('\n').map((l) => l.trim()));
    const missing = [config.NODE_IMAGE, config.PYTHON_IMAGE].filter((i) => !available.has(i));

    if (missing.length) {
      return {
        ok: false,
        detail: `Missing runner images: ${missing.join(', ')} — run "npm run images:build" in execution-service/`,
      };
    }
    return { ok: true, detail: `docker ${version.stdout.trim()}, runner images ready` };
  }

  async run(job: ExecutionJob): Promise<ExecutionResult> {
    const runner = getRunner(job.language);
    const started = Date.now();
    let workspace: string | null = null;
    let containerId: string | null = null;

    try {
      workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'devprep-exec-'));
      const sourcePath = path.join(workspace, runner.filename);
      await fs.writeFile(sourcePath, job.code, 'utf8');

      const created = await this.docker(
        [
          'create',
          '-i',
          '--network', 'none',
          '--memory', `${config.MEMORY_LIMIT_MB}m`,
          '--memory-swap', `${config.MEMORY_LIMIT_MB}m`,
          '--cpus', String(config.CPU_LIMIT),
          '--pids-limit', String(config.PIDS_LIMIT),
          '--read-only',
          '--tmpfs', '/tmp:rw,noexec,nosuid,size=32m',
          '--cap-drop', 'ALL',
          '--security-opt', 'no-new-privileges',
          '--user', '1000:1000',
          '--workdir', '/sandbox',
          '--env', 'HOME=/tmp',
          config.NODE_ENV === 'production' ? '--log-driver=none' : '--log-driver=json-file',
          runner.image,
          runner.command,
          ...runner.args(`/sandbox/${runner.filename}`),
        ],
        15_000,
      );

      if (created.code !== 0) {
        return this.failure(
          `Could not create sandbox container: ${created.stderr.trim()}`,
          Date.now() - started,
        );
      }
      containerId = created.stdout.trim();

      const copied = await this.docker(['cp', sourcePath, `${containerId}:/sandbox/${runner.filename}`], 15_000);
      if (copied.code !== 0) {
        return this.failure(
          `Could not stage source into sandbox: ${copied.stderr.trim()}`,
          Date.now() - started,
        );
      }

      const result = await this.start(containerId, job);
      const executionTime = Date.now() - started;

      // Ask the daemon whether the kernel OOM-killed it; exit 137 alone is
      // ambiguous (a SIGKILL from our own timeout looks identical).
      if (result.exitCode === 137 && !result.timedOut) {
        const inspect = await this.docker(
          ['inspect', containerId, '--format', '{{.State.OOMKilled}}'],
          8000,
        );
        if (inspect.stdout.trim() === 'true') {
          return {
            status: 'memory_limit',
            stdout: result.stdout,
            stderr: `Memory limit of ${config.MEMORY_LIMIT_MB}MB exceeded.`,
            exitCode: 137,
            executionTime,
            memoryUsage: config.MEMORY_LIMIT_MB * 1024,
            truncated: result.truncated,
          };
        }
      }

      if (result.timedOut) {
        return {
          status: 'timeout',
          stdout: result.stdout,
          stderr: `Execution timed out after ${job.timeoutMs}ms. Check for an infinite loop.`,
          exitCode: null,
          executionTime,
          memoryUsage: 0,
          truncated: result.truncated,
        };
      }

      if (result.truncated) {
        return {
          status: 'output_limit',
          stdout: result.stdout,
          stderr: `Output exceeded ${job.maxOutputBytes} bytes and was truncated.`,
          exitCode: result.exitCode,
          executionTime,
          memoryUsage: 0,
          truncated: true,
        };
      }

      return {
        status: result.exitCode === 0 ? 'success' : 'runtime_error',
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        executionTime,
        memoryUsage: 0,
        truncated: false,
      };
    } catch (err) {
      return this.failure(
        err instanceof Error ? err.message : 'Sandbox failure',
        Date.now() - started,
      );
    } finally {
      // Nothing survives a request: container destroyed, temp files deleted.
      if (containerId) {
        void this.docker(['rm', '-f', containerId], 10_000).catch(() => undefined);
      }
      if (workspace) {
        await fs.rm(workspace, { recursive: true, force: true }).catch(() => undefined);
      }
    }
  }

  /** `docker start -a -i` streams the program's stdio and returns its exit code. */
  private start(
    containerId: string,
    job: ExecutionJob,
  ): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number | null;
    truncated: boolean;
    timedOut: boolean;
  }> {
    return new Promise((resolve) => {
      const child = spawn(config.DOCKER_BIN, ['start', '-a', '-i', containerId], {
        // Scrubbed environment — no secrets reach the container or the CLI.
        env: { PATH: process.env['PATH'] ?? '' },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';
      let truncated = false;
      let timedOut = false;
      let settled = false;

      const capture = (chunk: Buffer, target: 'out' | 'err'): void => {
        const current = target === 'out' ? stdout : stderr;
        if (current.length >= job.maxOutputBytes) {
          if (!truncated) {
            truncated = true;
            void this.docker(['kill', containerId], 8000).catch(() => undefined);
          }
          return;
        }
        const room = job.maxOutputBytes - current.length;
        const text = chunk.toString('utf8');
        if (text.length > room) truncated = true;
        if (target === 'out') stdout += text.slice(0, room);
        else stderr += text.slice(0, room);
        if (truncated) void this.docker(['kill', containerId], 8000).catch(() => undefined);
      };

      child.stdout.on('data', (c: Buffer) => capture(c, 'out'));
      child.stderr.on('data', (c: Buffer) => capture(c, 'err'));

      const timer = setTimeout(() => {
        timedOut = true;
        // Kill the container, not just the CLI — otherwise the process keeps
        // burning CPU on the host after we've stopped listening.
        void this.docker(['kill', containerId], 8000).catch(() => undefined);
        setTimeout(() => child.kill('SIGKILL'), 1500).unref();
      }, job.timeoutMs);

      child.stdin.on('error', () => undefined);
      child.stdin.end(job.input);

      child.on('close', (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({ stdout, stderr, exitCode: code, truncated, timedOut });
      });

      child.on('error', (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          stdout,
          stderr: `Failed to start sandbox: ${err.message}`,
          exitCode: null,
          truncated,
          timedOut,
        });
      });
    });
  }

  private failure(message: string, executionTime: number): ExecutionResult {
    return {
      status: 'internal_error',
      stdout: '',
      stderr: message,
      exitCode: null,
      executionTime,
      memoryUsage: 0,
      truncated: false,
    };
  }

  private docker(args: string[], timeoutMs: number): Promise<DockerRun> {
    return new Promise((resolve) => {
      const child = spawn(config.DOCKER_BIN, args, { env: { PATH: process.env['PATH'] ?? '' } });
      let stdout = '';
      let stderr = '';
      const timer = setTimeout(() => child.kill('SIGKILL'), timeoutMs);

      child.stdout.on('data', (c: Buffer) => {
        stdout += c.toString('utf8');
      });
      child.stderr.on('data', (c: Buffer) => {
        stderr += c.toString('utf8');
      });
      child.on('close', (code) => {
        clearTimeout(timer);
        resolve({ code, stdout, stderr });
      });
      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({ code: null, stdout, stderr: err.message });
      });
    });
  }
}
