#!/usr/bin/env node
/**
 * Runs a command with the repo-root .env loaded.
 *
 * The application code loads the root .env itself (see src/config/env.ts), but
 * the Prisma CLI only looks in the schema directory and the cwd — it has no way
 * to reach a parent .env. Without this wrapper `prisma db push`, `migrate`,
 * `studio` and the seed all fail with "Environment variable not found:
 * DATABASE_URL", even though the variable is right there one level up.
 *
 * Keeping one .env at the root is what stops the JWT secrets and the execution
 * token drifting between the API and the execution service, so the wrapper
 * exists to preserve that rather than duplicating secrets into server/.env.
 *
 *   node scripts/with-env.mjs prisma db push
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));

// Local first so a service-specific override wins: dotenv never overwrites a
// variable that is already set, so whichever file is loaded first takes effect.
dotenv.config({ path: path.resolve(here, '../.env') });
dotenv.config({ path: path.resolve(here, '../../.env') });

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error('usage: node scripts/with-env.mjs <command> [args...]');
  process.exit(1);
}

if (!process.env['DATABASE_URL']) {
  console.error(
    'DATABASE_URL is not set.\n' +
      'Copy .env.example to .env in the repo root and fill it in:\n' +
      '  cp .env.example .env',
  );
  process.exit(1);
}

/**
 * Resolves a package's bin entry to a real file so the child can be launched
 * with this same Node binary. That avoids depending on npm having put
 * node_modules/.bin on PATH, and avoids spawning through a shell — Windows
 * .cmd shims otherwise force shell:true, which Node now warns about.
 */
function resolveBin(name) {
  try {
    const pkgJsonPath = require.resolve(`${name}/package.json`);
    const pkg = require(pkgJsonPath);
    const entry = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.[name];
    if (!entry) return null;
    return path.resolve(path.dirname(pkgJsonPath), entry);
  } catch {
    return null;
  }
}

const bin = resolveBin(command);

const child = bin
  ? spawn(process.execPath, [bin, ...args], { stdio: 'inherit', env: process.env })
  : // Not a resolvable node package — fall back to PATH lookup.
    spawn(command, args, {
      stdio: 'inherit',
      env: process.env,
      shell: process.platform === 'win32',
    });

child.on('error', (err) => {
  console.error(`Could not run "${command}": ${err.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0));
});
