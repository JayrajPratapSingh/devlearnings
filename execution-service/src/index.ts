import express from 'express';
import { z } from 'zod';
import { config } from './config';
import { executionWorker } from './workers/execution.worker';

const app = express();
app.use(express.json({ limit: '1mb' }));

const executeSchema = z.object({
  language: z.enum(['javascript', 'nodejs', 'python']),
  code: z.string().min(1).max(config.MAX_CODE_BYTES),
  input: z.string().max(100_000).default(''),
  timeoutMs: z.coerce.number().int().min(100).max(config.MAX_TIMEOUT_MS).optional(),
  maxOutputBytes: z.coerce.number().int().min(1000).max(config.EXECUTION_MAX_OUTPUT_BYTES).optional(),
});

/** Only the API server may reach this service — it is never exposed publicly. */
function requireServiceToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  const token = req.header('x-execution-token');
  if (token !== config.EXECUTION_SERVICE_TOKEN) {
    res.status(401).json({ error: 'Invalid execution service token' });
    return;
  }
  next();
}

app.get('/health', async (_req, res) => {
  const preflight = await executionWorker.preflight();
  res.json({
    ok: preflight.ok,
    sandbox: executionWorker.sandboxName,
    detail: preflight.detail,
    queue: executionWorker.stats(),
    limits: {
      timeoutMs: config.EXECUTION_TIMEOUT_MS,
      memoryMb: config.MEMORY_LIMIT_MB,
      cpus: config.CPU_LIMIT,
      pids: config.PIDS_LIMIT,
      maxOutputBytes: config.EXECUTION_MAX_OUTPUT_BYTES,
    },
  });
});

app.post('/execute', requireServiceToken, (req, res, next) => {
  const parsed = executeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid execution request',
      details: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    });
    return;
  }

  executionWorker
    .submit({
      language: parsed.data.language,
      code: parsed.data.code,
      input: parsed.data.input,
      timeoutMs: parsed.data.timeoutMs ?? config.EXECUTION_TIMEOUT_MS,
      maxOutputBytes: parsed.data.maxOutputBytes ?? config.EXECUTION_MAX_OUTPUT_BYTES,
    })
    .then((result) => res.json(result))
    .catch(next);
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Malformed JSON is the caller's fault, not ours — do not report it as a 500.
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Request body is not valid JSON' });
    return;
  }
  console.error('execution-service error', err);
  res.status(500).json({ error: 'Execution service failure' });
});

const server = app.listen(config.EXECUTION_PORT, async () => {
  const preflight = await executionWorker.preflight();
  console.log(`[execution-service] listening on http://localhost:${config.EXECUTION_PORT}`);
  console.log(`[execution-service] sandbox driver: ${executionWorker.sandboxName}`);
  if (!preflight.ok) {
    console.warn(`[execution-service] PREFLIGHT WARNING: ${preflight.detail}`);
  } else {
    console.log(`[execution-service] ${preflight.detail}`);
  }
  if (config.SANDBOX_DRIVER === 'local') {
    console.warn(
      '[execution-service] Running WITHOUT container isolation. Development only — ' +
        'set SANDBOX_DRIVER=docker before exposing this to anyone else.',
    );
  }
});

const shutdown = (signal: string): void => {
  console.log(`[execution-service] ${signal} received — shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
