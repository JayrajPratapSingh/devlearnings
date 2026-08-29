import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Single shared Prisma client. In dev the module is re-evaluated by tsx on every
 * reload, so the instance is cached on globalThis to avoid connection-pool leaks.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
