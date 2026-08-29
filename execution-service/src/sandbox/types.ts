export type ExecLanguage = 'javascript' | 'nodejs' | 'python';

export type ExecStatus =
  | 'success'
  | 'runtime_error'
  | 'timeout'
  | 'memory_limit'
  | 'output_limit'
  | 'internal_error';

export interface ExecutionJob {
  language: ExecLanguage;
  code: string;
  input: string;
  timeoutMs: number;
  maxOutputBytes: number;
}

export interface ExecutionResult {
  status: ExecStatus;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  /** Wall-clock milliseconds spent inside the sandbox. */
  executionTime: number;
  /** Peak memory in KB — 0 when the driver cannot measure it. */
  memoryUsage: number;
  truncated: boolean;
}

/**
 * A Sandbox is anything that can run one job in isolation and always return a
 * result rather than throwing. Implementations are responsible for enforcing
 * the timeout, memory/CPU caps and output limits themselves.
 */
export interface Sandbox {
  readonly name: string;
  run(job: ExecutionJob): Promise<ExecutionResult>;
  /** Confirms the driver's prerequisites (images pulled, runtimes present). */
  preflight(): Promise<{ ok: boolean; detail: string }>;
}
