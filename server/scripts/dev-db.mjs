#!/usr/bin/env node
/**
 * Portable PostgreSQL for local development — no Docker, no admin rights.
 *
 * Downloads a self-contained Postgres on first run and keeps its data in
 * server/.pgdata, so it behaves like a normal database across restarts.
 *
 *   npm run db:local          # start (stays in the foreground)
 *   npm run db:local:reset    # wipe the data directory and start fresh
 *
 * This is a development convenience. Real deployments use the Postgres in
 * docker-compose.yml (`npm run db:up`) — same engine, same schema, so nothing
 * about the application changes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import EmbeddedPostgres from 'embedded-postgres';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../.env') });
dotenv.config({ path: path.resolve(here, '../../.env') });

const dataDir = path.resolve(here, '../.pgdata');

if (process.argv.includes('--reset') && fs.existsSync(dataDir)) {
  console.log('Removing existing data directory…');
  fs.rmSync(dataDir, { recursive: true, force: true });
}

// Credentials come from the same DATABASE_URL the app uses, so the two can
// never disagree about the port, user or database name.
const url = new URL(process.env['DATABASE_URL'] ?? '');
const user = decodeURIComponent(url.username) || 'devprep';
const password = decodeURIComponent(url.password) || 'devprep';
const port = Number(url.port || 5433);
const database = url.pathname.replace(/^\//, '') || 'devprep';

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user,
  password,
  port,
  persistent: true,
  // initdb otherwise inherits the Windows system locale, which gives a WIN1252
  // cluster — and WIN1252 cannot store the arrows and em-dashes in the seeded
  // notes ("no equivalent in encoding WIN1252"). Force UTF-8 so local dev
  // matches the Postgres in docker-compose.yml, which is UTF-8 by default.
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  onLog: () => {}, // Postgres is chatty on boot; errors still surface below.
});

let shuttingDown = false;

async function stop(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${signal} — stopping PostgreSQL…`);
  try {
    await pg.stop();
  } catch {
    /* already gone */
  }
  process.exit(0);
}

process.on('SIGINT', () => void stop('SIGINT'));
process.on('SIGTERM', () => void stop('SIGTERM'));

try {
  const firstRun = !fs.existsSync(dataDir);
  if (firstRun) {
    console.log('First run — downloading and initialising PostgreSQL (one time, ~1 min)…');
    await pg.initialise();
  }

  await pg.start();

  // initdb only creates postgres/template0/template1, so the database named in
  // DATABASE_URL has to be created explicitly — including when it happens to
  // share its name with the user, which is the common case.
  try {
    await pg.createDatabase(database);
  } catch (err) {
    if (!String(err).includes('already exists')) throw err;
  }

  // Fail loudly rather than halfway through seeding with a cryptic 22P05.
  const client = pg.getPgClient(database);
  await client.connect();
  const { rows } = await client.query('SHOW server_encoding');
  const encoding = rows[0]?.server_encoding;
  await client.end();

  if (encoding !== 'UTF8') {
    console.error(
      `\nDatabase encoding is ${encoding}, not UTF8.\n` +
        'Seed content contains characters WIN1252 cannot store.\n' +
        'Recreate the cluster:  npm run db:local:reset',
    );
    process.exit(1);
  }

  console.log('\n  PostgreSQL is running');
  console.log(`  postgresql://${user}:***@localhost:${port}/${database}`);
  console.log(`  data: ${dataDir}`);
  console.log('\n  Next, in another terminal:');
  console.log('    npm run db:push');
  console.log('    npm run seed');
  console.log('\n  Ctrl+C to stop.\n');
} catch (err) {
  console.error('\nCould not start PostgreSQL:', err instanceof Error ? err.message : err);
  console.error(
    '\nIf the port is busy, change POSTGRES_PORT and DATABASE_URL in .env.\n' +
      'To start over: npm run db:local:reset',
  );
  process.exit(1);
}
