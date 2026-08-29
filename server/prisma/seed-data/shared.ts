/** Shapes used by every seed file. Kept separate so the data files stay readable. */

export type Diff = 'EASY' | 'MEDIUM' | 'HARD';

export interface SeedTestCase {
  input: string;
  expectedOutput: string;
  /** Shown on the problem page and used by "Run". */
  isSample?: boolean;
  /** Only ever used by "Submit" — never serialised to the client. */
  isHidden?: boolean;
}

export interface SeedExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface SeedProblem {
  slug: string;
  title: string;
  category: string;
  difficulty: Diff;
  description: string;
  descriptionHi: string;
  examples: SeedExample[];
  constraints: string[];
  hints: string[];
  approach: string;
  approachHi: string;
  timeComplexity: string;
  spaceComplexity: string;
  solutionExplanation: string;
  solutionExplanationHi: string;
  /** Body the user starts from, per language. */
  starter: { js: string; py: string };
  /** Reference solution, unlocked only after the user solves it. */
  solution: { js: string; py: string };
  testCases: SeedTestCase[];
}

/**
 * Every problem reads stdin and writes stdout, which keeps the grader completely
 * language-agnostic: no per-language function signature, no serialisation layer,
 * no reflection. These headers hand the user parsed input so they can spend their
 * time on the algorithm rather than on `split('\n')`.
 */
export const JS_IO = `const _in = require('fs').readFileSync(0, 'utf8').split('\\n');
const line = (i) => (_in[i] ?? '').trim();
const num = (i) => Number(line(i));
const nums = (i) => line(i).split(/\\s+/).filter(Boolean).map(Number);
const words = (i) => line(i).split(/\\s+/).filter(Boolean);
`;

export const PY_IO = `import sys
_in = sys.stdin.read().split("\\n")
line = lambda i: (_in[i] if i < len(_in) else "").strip()
num = lambda i: int(line(i))
nums = lambda i: [int(x) for x in line(i).split()]
words = lambda i: line(i).split()
`;

/** Builds the two starter bodies with the I/O header already attached. */
export function starter(js: string, py: string): { js: string; py: string } {
  return { js: JS_IO + '\n' + js.trim() + '\n', py: PY_IO + '\n' + py.trim() + '\n' };
}

export function solution(js: string, py: string): { js: string; py: string } {
  return { js: JS_IO + '\n' + js.trim() + '\n', py: PY_IO + '\n' + py.trim() + '\n' };
}

export function sample(input: string, expectedOutput: string): SeedTestCase {
  return { input, expectedOutput, isSample: true, isHidden: false };
}

export function hidden(input: string, expectedOutput: string): SeedTestCase {
  return { input, expectedOutput, isSample: false, isHidden: true };
}
