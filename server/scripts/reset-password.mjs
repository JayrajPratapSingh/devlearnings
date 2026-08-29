#!/usr/bin/env node
/**
 * Resets a user's password from the command line.
 *
 *   npm run user:password -- someone@example.com newpassword123
 *
 * There is no self-service "forgot password" flow yet (it needs an email
 * provider), so this exists for the single-user local setup: if you cannot get
 * back in, reset it here rather than creating a duplicate account.
 *
 * It hashes with the same bcrypt cost the register endpoint uses, so the
 * resulting row is indistinguishable from a normal signup.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../.env') });
dotenv.config({ path: path.resolve(here, '../../.env') });

const [emailArg, passwordArg] = process.argv.slice(2);

if (!emailArg || !passwordArg) {
  console.error('usage: npm run user:password -- <email> <new-password>');
  process.exit(1);
}

if (passwordArg.length < 8 || !/[a-zA-Z]/.test(passwordArg) || !/[0-9]/.test(passwordArg)) {
  console.error('Password must be at least 8 characters and contain a letter and a number.');
  process.exit(1);
}

const prisma = new PrismaClient();
const email = emailArg.toLowerCase().trim();

try {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const all = await prisma.user.findMany({ select: { email: true }, orderBy: { createdAt: 'asc' } });
    console.error(`No account with email "${email}".`);
    console.error(`\nAccounts that do exist:\n${all.map((u) => `  ${u.email}`).join('\n') || '  (none)'}`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { email },
    data: { passwordHash: await bcrypt.hash(passwordArg, 12) },
  });

  // Old refresh tokens must die with the old password, or a stolen one would
  // outlive the reset — the same thing a real password-change flow has to do.
  const { count } = await prisma.refreshToken.updateMany({
    where: { userId: user.id, revoked: false },
    data: { revoked: true },
  });

  console.log(`Password updated for ${email}.`);
  if (count > 0) console.log(`Revoked ${count} existing session${count === 1 ? '' : 's'}.`);
} catch (err) {
  console.error('Could not reset the password:', err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
