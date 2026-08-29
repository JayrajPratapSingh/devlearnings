import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`DevPrep API listening on http://localhost:${env.PORT}`, {
    env: env.NODE_ENV,
    executionService: env.EXECUTION_SERVICE_URL,
  });
});

async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} received — shutting down`);
  server.close(() => {
    void prisma.$disconnect().then(() => process.exit(0));
  });
  // Do not hang forever if a connection refuses to drain.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
