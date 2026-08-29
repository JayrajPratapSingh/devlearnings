import { config } from '../config';
import { JobQueue, QueueOverflowError, QueueTimeoutError } from '../queue/job-queue';
import { DockerSandbox } from '../sandbox/docker.sandbox';
import { LocalSandbox } from '../sandbox/local.sandbox';
import type { ExecutionJob, ExecutionResult, Sandbox } from '../sandbox/types';

const sandbox: Sandbox =
  config.SANDBOX_DRIVER === 'docker' ? new DockerSandbox() : new LocalSandbox();

const queue = new JobQueue(
  config.MAX_CONCURRENT_EXECUTIONS,
  config.QUEUE_MAX_DEPTH,
  config.QUEUE_WAIT_TIMEOUT_MS,
);

export const executionWorker = {
  sandboxName: sandbox.name,

  preflight: () => sandbox.preflight(),

  stats: () => queue.stats,

  /** Queues a job and always resolves with a result — never throws at the caller. */
  async submit(job: ExecutionJob): Promise<ExecutionResult> {
    try {
      return await queue.add(() => sandbox.run(job));
    } catch (err) {
      if (err instanceof QueueOverflowError || err instanceof QueueTimeoutError) {
        return {
          status: 'internal_error',
          stdout: '',
          stderr: err.message,
          exitCode: null,
          executionTime: 0,
          memoryUsage: 0,
          truncated: false,
        };
      }
      return {
        status: 'internal_error',
        stdout: '',
        stderr: err instanceof Error ? err.message : 'Unknown execution failure',
        exitCode: null,
        executionTime: 0,
        memoryUsage: 0,
        truncated: false,
      };
    }
  },
};
