#!/usr/bin/env node
/**
 * Repoints DATABASE_URL in the repo-root .env at a host that actually works.
 *
 * Why this exists: on this machine Docker Desktop's port-forwarding proxy binds
 * 127.0.0.1:5433 and accepts TCP connections but never forwards them to the
 * container, so Postgres never completes its handshake and Prisma reports a
 * misleading "connection pool timeout". Only the machine's current LAN IP
 * reaches the container — and that IP changes whenever the network does, which
 * silently breaks every Prisma command until someone edits .env by hand.
 *
 * Rather than hard-coding an address that expires, this probes each candidate
 * and writes back the first one that genuinely answers.
 *
 *   node scripts/fix-db-host.mjs          # detect and update
 *   node scripts/fix-db-host.mjs --check  # report only, change nothing
 *
 * If loopback ever starts working (restarting Docker Desktop usually restores
 * it), this will prefer 127.0.0.1 and the problem stops recurring.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(here, '../../.env');
const checkOnly = process.argv.includes('--check');

const PORT = 5433;
const URL_RE = /^(DATABASE_URL=".*?@)([^:]+)(:\d+\/.*)$/m;

/**
 * Every IPv4 address on this machine, ordered by how stable it is.
 *
 * A virtual adapter (Docker's or WSL's vEthernet) keeps its address when you
 * move between Wi-Fi networks, whereas a DHCP-assigned Wi-Fi address does not —
 * and that churn is exactly what keeps breaking DATABASE_URL. So prefer the
 * virtual adapter, fall back to the physical one, and try link-local last
 * because it never carries real traffic.
 */
function localAddresses() {
  const out = [];
  for (const [name, addrs] of Object.entries(networkInterfaces())) {
    for (const a of addrs ?? []) {
      if (a.family === 'IPv4' && !a.internal) out.push({ name, address: a.address });
    }
  }

  const rank = ({ name, address }) => {
    if (address.startsWith('169.254')) return 3; // link-local: last resort
    if (/vEthernet|WSL|Docker/i.test(name)) return 0; // survives network changes
    return 1; // physical adapter, DHCP-assigned
  };

  return out.sort((a, b) => rank(a) - rank(b)).map((i) => i.address);
}

/**
 * A TCP connect is not enough here — the broken proxy accepts and then stalls.
 * Postgres greets a client only after the client speaks, so instead we send a
 * deliberately malformed startup packet and require *any* reply. A working
 * server answers with an error; the stalled proxy answers with nothing.
 */
function probe(host, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port: PORT });
    let settled = false;

    const done = (ok) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(ok);
    };

    socket.setTimeout(timeout, () => done(false));
    socket.on('error', () => done(false));
    socket.on('data', () => done(true));
    socket.on('connect', () => {
      // Length-prefixed packet with an invalid protocol version: any real
      // Postgres replies immediately with an ErrorResponse.
      const packet = Buffer.alloc(8);
      packet.writeInt32BE(8, 0);
      packet.writeInt32BE(0, 4);
      socket.write(packet);
    });
  });
}

const env = readFileSync(envPath, 'utf8');
const match = env.match(URL_RE);
if (!match) {
  console.error('Could not find DATABASE_URL in', envPath);
  process.exit(1);
}

const currentHost = match[2];
const candidates = ['127.0.0.1', ...localAddresses()].filter(
  (h, i, all) => all.indexOf(h) === i,
);

console.log(`DATABASE_URL host is currently: ${currentHost}`);
console.log(`Probing port ${PORT}…`);

let working = null;
for (const host of candidates) {
  const ok = await probe(host);
  console.log(`  ${ok ? 'OK  ' : 'dead'}  ${host}`);
  if (ok && !working) working = host;
}

if (!working) {
  console.error('\nNothing answered. Is the container running?  docker ps');
  process.exit(1);
}

if (working === currentHost) {
  console.log(`\nAlready correct (${working}). Nothing to do.`);
  process.exit(0);
}

if (checkOnly) {
  console.log(`\nWould change ${currentHost} -> ${working}  (--check, so not written)`);
  process.exit(0);
}

writeFileSync(envPath, env.replace(URL_RE, `$1${working}$3`), 'utf8');
console.log(`\nUpdated .env: ${currentHost} -> ${working}`);
