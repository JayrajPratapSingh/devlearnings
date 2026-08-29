/**
 * Verifies that every slug an interview track references actually exists.
 *
 * Tracks are a curriculum defined client-side, so nothing type-checks them
 * against the seeded content. A renamed topic or a recall category with no
 * questions behind it produces a dead link or an empty page — which looks like
 * a working feature until you click it. This closes that gap.
 *
 * Run against a seeded database: npm run verify:tracks
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const tracksFile = resolve(here, '../../client/src/data/tracks.ts');
const src = readFileSync(tracksFile, 'utf8');

/** Pulls every quoted string out of `key: [ ... ]` arrays. */
function refs(key) {
  const found = new Set();
  const re = new RegExp(key + ':\\s*\\[([^\\]]*)\\]', 'g');
  let m;
  while ((m = re.exec(src))) {
    for (const s of m[1].matchAll(/'([^']+)'/g)) found.add(s[1]);
  }
  return [...found];
}

const prisma = new PrismaClient();

const [topics, problems, categories] = await Promise.all([
  prisma.topic.findMany({ select: { slug: true } }),
  prisma.dSAProblem.findMany({ select: { slug: true } }),
  prisma.interviewQuestion.findMany({ select: { category: true }, distinct: ['category'] }),
]);

const checks = [
  ['topic slugs   ', refs('topics'), new Set(topics.map((t) => t.slug))],
  ['problem slugs ', refs('problems'), new Set(problems.map((p) => p.slug))],
  ['recall cats   ', refs('recall'), new Set(categories.map((c) => c.category))],
];

let broken = 0;
for (const [label, used, available] of checks) {
  const missing = used.filter((r) => !available.has(r));
  broken += missing.length;
  const status = missing.length ? `MISSING ${missing.join(', ')}` : 'ok';
  console.log(`  ${label} ${String(used.length).padStart(3)} referenced  ${status}`);
}

await prisma.$disconnect();

if (broken) {
  console.error(`\n${broken} track reference(s) point at content that does not exist.`);
  process.exit(1);
}
console.log('\nAll track references resolve.');
