#!/usr/bin/env node
/**
 * Lists the accounts in the database.
 *
 *   npm run user:list
 *
 * Useful when a login fails: the API deliberately returns the same error for
 * "no such email" and "wrong password" so it cannot be used to discover which
 * emails are registered — which means the UI cannot tell you which one it was.
 * This shows you, locally, whether the account exists at all.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../.env') });
dotenv.config({ path: path.resolve(here, '../../.env') });

const prisma = new PrismaClient();

try {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      currentStreak: true,
      createdAt: true,
      _count: { select: { submissions: true, notes: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (users.length === 0) {
    console.log('No accounts yet. Register at http://localhost:5173/register');
  } else {
    console.log(`${users.length} account${users.length === 1 ? '' : 's'}:\n`);
    for (const u of users) {
      console.log(
        `  ${u.email.padEnd(38)} ${u.name.padEnd(24)} ` +
          `${String(u._count.submissions).padStart(3)} submissions  ` +
          `${u.createdAt.toISOString().slice(0, 10)}`,
      );
    }
    console.log('\nForgot a password?  npm run user:password -- <email> <new-password>');
  }
} catch (err) {
  console.error('Could not read users:', err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
