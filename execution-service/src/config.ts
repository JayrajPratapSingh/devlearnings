import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Shares the repo-root .env with the API server so EXECUTION_SERVICE_TOKEN
// always matches on both sides. Local first: dotenv never overwrites an
// already-set variable, so the service-local file wins where it defines one.
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  EXECUTION_PORT: z.coerce.number().int().positive().default(4001),

  /** Shared secret the API server presents on every execution request. */
  EXECUTION_SERVICE_TOKEN: z.string().min(8).default('dev-execution-token'),

  /**
   * docker = every submission runs in a throwaway container (safe, the default).
   * local  = spawn the runtime directly on this host. DEVELOPMENT ONLY: it has
   *          no filesystem or network isolation and must never be used in prod.
   */
  SANDBOX_DRIVER: z.enum(['docker', 'local']).default('docker'),

  WORKSPACE_ROOT: z.string().default(''),
  MAX_CONCURRENT_EXECUTIONS: z.coerce.number().int().positive().default(4),
  QUEUE_MAX_DEPTH: z.coerce.number().int().positive().default(100),
  QUEUE_WAIT_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),

  EXECUTION_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  MAX_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  EXECUTION_MAX_OUTPUT_BYTES: z.coerce.number().int().positive().default(64_000),
  MAX_CODE_BYTES: z.coerce.number().int().positive().default(200_000),

  MEMORY_LIMIT_MB: z.coerce.number().int().positive().default(256),
  CPU_LIMIT: z.coerce.number().positive().default(0.5),
  PIDS_LIMIT: z.coerce.number().int().positive().default(64),

  NODE_IMAGE: z.string().default('devprep-runner-node:1'),
  PYTHON_IMAGE: z.string().default('devprep-runner-python:1'),
  DOCKER_BIN: z.string().default('docker'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    'Invalid execution-service configuration:\n' +
      parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n'),
  );
  process.exit(1);
}

export const config = parsed.data;

if (config.SANDBOX_DRIVER === 'local' && config.NODE_ENV === 'production') {
  console.error(
    'FATAL: SANDBOX_DRIVER=local runs untrusted code without isolation and is ' +
      'forbidden in production. Set SANDBOX_DRIVER=docker.',
  );
  process.exit(1);
}
