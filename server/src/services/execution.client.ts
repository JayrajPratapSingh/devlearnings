import { env } from '../config/env';
import { logger } from '../utils/logger';
import { ServiceUnavailable } from '../utils/errors';

export type ExecLanguage = 'javascript' | 'nodejs' | 'python';

export type ExecStatus =
  | 'success'
  | 'runtime_error'
  | 'timeout'
  | 'memory_limit'
  | 'output_limit'
  | 'internal_error';

export interface ExecutionRequest {
  language: ExecLanguage;
  code: string;
  input: string;
  timeoutMs?: number;
}

export interface ExecutionResult {
  status: ExecStatus;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTime: number;
  memoryUsage: number;
  truncated: boolean;
}

/**
 * Abstraction over "somewhere that runs untrusted code".
 * The API server NEVER executes submitted code in-process — it only speaks HTTP
 * to the isolated execution service, which is the only component allowed to
 * spawn a runtime. Swapping Docker for Firecracker/nsjail/a remote grader later
 * means implementing this one interface again; nothing else changes.
 */
export interface ExecutionProvider {
  readonly name: string;
  execute(request: ExecutionRequest): Promise<ExecutionResult>;
  health(): Promise<{ ok: boolean; sandbox: string }>;
}

class HttpExecutionProvider implements ExecutionProvider {
  readonly name = 'http-execution-service';

  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
  ) {}

  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    // Give the transport a little more headroom than the sandbox timeout so the
    // service always wins the race and can report a proper "timeout" status.
    const budget = (request.timeoutMs ?? env.EXECUTION_TIMEOUT_MS) + 5000;
    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), budget);

    try {
      const response = await fetch(`${this.baseUrl}/execute`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-execution-token': this.token,
        },
        body: JSON.stringify({
          language: request.language,
          code: request.code,
          input: request.input,
          timeoutMs: request.timeoutMs ?? env.EXECUTION_TIMEOUT_MS,
          maxOutputBytes: env.EXECUTION_MAX_OUTPUT_BYTES,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        logger.error('Execution service returned an error', { status: response.status, text });
        throw ServiceUnavailable('Code execution service is unavailable');
      }

      return (await response.json()) as ExecutionResult;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          status: 'timeout',
          stdout: '',
          stderr: 'Execution exceeded the allowed time budget.',
          exitCode: null,
          executionTime: budget,
          memoryUsage: 0,
          truncated: false,
        };
      }
      logger.error('Execution service unreachable', {
        message: err instanceof Error ? err.message : String(err),
      });
      throw ServiceUnavailable(
        'Code execution service is not running. Start it with: docker compose up execution-service',
      );
    } finally {
      clearTimeout(abortTimer);
    }
  }

  async health(): Promise<{ ok: boolean; sandbox: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) return { ok: false, sandbox: 'unknown' };
      return (await response.json()) as { ok: boolean; sandbox: string };
    } catch {
      return { ok: false, sandbox: 'unreachable' };
    }
  }
}

export const executionProvider: ExecutionProvider = new HttpExecutionProvider(
  env.EXECUTION_SERVICE_URL,
  env.EXECUTION_SERVICE_TOKEN,
);
