/**
 * Seed-data self-check.
 *
 *   npx tsx prisma/seed-data/verify.ts
 *
 * Runs every reference solution (JavaScript and Python) against every test case
 * for every problem and reports mismatches. Seeding a problem whose own answer
 * key is wrong is worse than not seeding it at all, so this runs in CI-style
 * fashion before `npm run seed`.
 *
 * It executes trusted, repo-owned code on the host on purpose — this is the one
 * place that is allowed to, and it never touches user submissions.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { dsaProblems } from './dsa';

const PY = process.platform === 'win32' ? 'python' : 'python3';

function run(cmd: string, args: string[], input: string): { out: string; err: string; code: number } {
  const res = spawnSync(cmd, args, { input, encoding: 'utf8', timeout: 20_000 });
  return { out: res.stdout ?? '', err: res.stderr ?? '', code: res.status ?? -1 };
}

function normalise(s: string): string {
  return s.replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd()).join('\n').trim();
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'devprep-verify-'));
let checks = 0;
let failures = 0;
const skipped: string[] = [];

const pythonAvailable = run(PY, ['--version'], '').code === 0;
if (!pythonAvailable) skipped.push('python (interpreter not found on PATH)');

for (const problem of dsaProblems) {
  const jsFile = path.join(dir, `${problem.slug}.js`);
  const pyFile = path.join(dir, `${problem.slug}.py`);
  fs.writeFileSync(jsFile, problem.solution.js);
  fs.writeFileSync(pyFile, problem.solution.py);

  for (const [index, tc] of problem.testCases.entries()) {
    const targets: Array<[string, string[], string]> = [['js', [jsFile], problem.solution.js]];
    if (pythonAvailable) targets.push(['py', ['-I', '-u', pyFile], problem.solution.py]);

    for (const [lang, args] of targets) {
      checks += 1;
      const cmd = lang === 'js' ? process.execPath : PY;
      const result = run(cmd, args, tc.input);
      const actual = normalise(result.out);
      const expected = normalise(tc.expectedOutput);

      if (result.code !== 0) {
        failures += 1;
        console.error(
          `FAIL ${problem.slug} [${lang}] case ${index} — exit ${result.code}\n${result.err.trim().slice(0, 400)}`,
        );
      } else if (actual !== expected) {
        failures += 1;
        console.error(
          `FAIL ${problem.slug} [${lang}] case ${index}\n  input:    ${JSON.stringify(tc.input)}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`,
        );
      }
    }
  }
}

fs.rmSync(dir, { recursive: true, force: true });

console.log(
  `\n${dsaProblems.length} problems, ${checks} solution runs, ${failures} failure${failures === 1 ? '' : 's'}.`,
);
for (const s of skipped) console.log(`Skipped: ${s}`);
process.exit(failures === 0 ? 0 : 1);
