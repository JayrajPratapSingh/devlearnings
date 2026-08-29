import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { getRunner } from '../runners';
import type { ExecutionJob, ExecutionResult, Sandbox } from './types';

/**
 * Variables the runtime itself needs in order to start. Everything else — this
 * service's token, the database URL, the JWT secrets — is dropped.
 *
 * Windows needs more than PATH: without SYSTEMROOT a process cannot load system
 * DLLs, without PATHEXT the shell cannot resolve `python` to `python.exe`, and
 * the PEP-514 Python launcher re-downloads an entire interpreter if LOCALAPPDATA
 * is missing. This is a dev-only driver, so passing these through is acceptable;
 * DockerSandbox gives the container no host environment at all.
 */
const ENV_ALLOWLIST =
  process.platform === 'win32'
    ? ['PATH', 'PATHEXT', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'LOCALAPPDATA', 'APPDATA', 'USERPROFILE', 'NUMBER_OF_PROCESSORS', 'PROCESSOR_ARCHITECTURE']
    : ['PATH'];

function runtimeEnv(workspace: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  for (const key of ENV_ALLOWLIST) {
    const value = process.env[key];
    if (value !== undefined) env[key] = value;
  }
  // Point scratch space at the throwaway workspace, not the user's real temp dir.
  env['HOME'] = workspace;
  env['TMPDIR'] = workspace;
  env['TEMP'] = workspace;
  env['TMP'] = workspace;
  env['PYTHONDONTWRITEBYTECODE'] = '1';
  return env;
}

/**
 * DEVELOPMENT-ONLY fallback for machines without Docker.
 *
 * It still enforces a timeout, an output cap and a scrubbed environment, and it
 * runs from a throwaway temp directory — but the process shares the host kernel,
 * filesystem and network. It is NOT a security boundary. `config.ts` refuses to
 * boot with this driver when NODE_ENV=production.
 *
 * It exists so the app is runnable on day one; DockerSandbox is the real thing.
 */
export class LocalSandbox implements Sandbox {
  readonly name = 'local-unsafe';

  async preflight(): Promise<{ ok: boolean; detail: string }> {
    return {
      ok: true,
      detail: 'LOCAL DRIVER — no container isolation. Development use only.',
    };
  }

  async run(job: ExecutionJob): Promise<ExecutionResult> {
    const runner = getRunner(job.language);
    const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'devprep-local-'));
    const file = path.join(workspace, runner.filename);
    const started = Date.now();

    try {
      await fs.writeFile(file, job.code, 'utf8');
      const result = await this.spawnProcess(runner.command, runner.args(runner.filename), workspace, job);
      return { ...result, executionTime: Date.now() - started };
    } catch (err) {
      return {
        status: 'internal_error',
        stdout: '',
        stderr: err instanceof Error ? err.message : 'Local sandbox failure',
        exitCode: null,
        executionTime: Date.now() - started,
        memoryUsage: 0,
        truncated: false,
      };
    } finally {
      await fs.rm(workspace, { recursive: true, force: true }).catch(() => undefined);
    }
  }

  private spawnProcess(
    command: string,
    args: string[],
    cwd: string,
    job: ExecutionJob,
  ): Promise<Omit<ExecutionResult, 'executionTime'>> {
    return new Promise((resolve) => {
      // python3 is not on PATH under that name on most Windows installs.
      const bin = process.platform === 'win32' && command === 'python3' ? 'python' : command;

      const child = spawn(bin, args, {
        cwd,
        // Allowlisted env only — submitted code cannot read this service's secrets.
        env: runtimeEnv(cwd),
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
          truncated = true;
          child.kill('SIGKILL');
          return;
        }
        const room = job.maxOutputBytes - current.length;
        const text = chunk.toString('utf8');
        if (text.length > room) truncated = true;
        if (target === 'out') stdout += text.slice(0, room);
        else stderr += text.slice(0, room);
      };

      child.stdout.on('data', (c: Buffer) => capture(c, 'out'));
      child.stderr.on('data', (c: Buffer) => capture(c, 'err'));

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, job.timeoutMs);

      child.stdin.on('error', () => undefined);
      child.stdin.end(job.input);

      child.on('close', (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);

        if (timedOut) {
          resolve({
            status: 'timeout',
            stdout,
            stderr: `Execution timed out after ${job.timeoutMs}ms. Check for an infinite loop.`,
            exitCode: null,
            memoryUsage: 0,
            truncated,
          });
          return;
        }
        if (truncated) {
          resolve({
            status: 'output_limit',
            stdout,
            stderr: `Output exceeded ${job.maxOutputBytes} bytes and was truncated.`,
            exitCode: code,
            memoryUsage: 0,
            truncated: true,
          });
          return;
        }
        resolve({
          status: code === 0 ? 'success' : 'runtime_error',
          stdout,
          stderr,
          exitCode: code,
          memoryUsage: 0,
          truncated,
        });
      });

      child.on('error', (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          status: 'internal_error',
          stdout,
          stderr:
            err.message.includes('ENOENT')
              ? `Runtime "${bin}" is not installed on this machine.`
              : err.message,
          exitCode: null,
          memoryUsage: 0,
          truncated,
        });
      });
    });
  }
}

