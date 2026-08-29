import type { Language, SubmissionStatus } from '@prisma/client';
import { dsaRepository } from '../repositories/dsa.repository';
import { executionProvider, type ExecLanguage, type ExecutionResult } from './execution.client';
import { progressService } from './progress.service';
import { revisionService } from './revision.service';
import { env } from '../config/env';
import { BadRequest, NotFound, TooLarge } from '../utils/errors';

const LANGUAGE_MAP: Record<Language, ExecLanguage> = {
  JAVASCRIPT: 'javascript',
  NODEJS: 'nodejs',
  PYTHON: 'python',
};

/** Trailing whitespace and line-ending differences should not fail a correct answer. */
function normalise(output: string): string {
  return output
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

function guardCode(code: string): void {
  if (!code.trim()) throw BadRequest('Code cannot be empty');
  if (code.length > env.MAX_CODE_LENGTH) {
    throw TooLarge(`Code exceeds the ${env.MAX_CODE_LENGTH} character limit`);
  }
}

function toSubmissionStatus(result: ExecutionResult): SubmissionStatus | null {
  switch (result.status) {
    case 'timeout':
      return 'TIMEOUT';
    case 'memory_limit':
      return 'MEMORY_LIMIT';
    case 'runtime_error':
      return 'RUNTIME_ERROR';
    case 'internal_error':
      return 'INTERNAL_ERROR';
    default:
      return null;
  }
}

export interface TestCaseResult {
  index: number;
  hidden: boolean;
  passed: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  stderr?: string;
  executionTime: number;
  memoryUsage: number;
}

export const codeService = {
  /** Free-form run — stdin comes from the user, nothing is graded or stored. */
  async run(input: { language: Language; code: string; stdin: string }) {
    guardCode(input.code);
    const result = await executionProvider.execute({
      language: LANGUAGE_MAP[input.language],
      code: input.code,
      input: input.stdin,
    });
    return result;
  },

  /** Run against the problem's sample cases only — quick feedback loop. */
  async runProblem(userId: string, slug: string, input: { language: Language; code: string; input?: string }) {
    guardCode(input.code);
    const problem = await dsaRepository.findBySlug(slug);
    if (!problem) throw NotFound('Problem');

    // Custom stdin wins; otherwise use the sample cases.
    const cases =
      input.input !== undefined && input.input !== ''
        ? [{ input: input.input, expectedOutput: '', isHidden: false, custom: true }]
        : problem.testCases.map((t) => ({
            input: t.input,
            expectedOutput: t.expectedOutput,
            isHidden: false,
            custom: false,
          }));

    if (cases.length === 0) throw BadRequest('This problem has no sample test cases to run');

    const results: TestCaseResult[] = [];
    for (const [index, testCase] of cases.entries()) {
      const execution = await executionProvider.execute({
        language: LANGUAGE_MAP[input.language],
        code: input.code,
        input: testCase.input,
      });

      const actual = normalise(execution.stdout);
      const expected = normalise(testCase.expectedOutput);
      results.push({
        index,
        hidden: false,
        passed: testCase.custom ? execution.status === 'success' : execution.status === 'success' && actual === expected,
        input: testCase.input,
        expectedOutput: testCase.custom ? undefined : testCase.expectedOutput,
        actualOutput: execution.stdout,
        stderr: execution.stderr,
        executionTime: execution.executionTime,
        memoryUsage: execution.memoryUsage,
      });

      // Stop early on a crash — the remaining cases will fail the same way.
      if (execution.status !== 'success') break;
    }

    await dsaRepository.upsertProgress(userId, problem.id, {
      lastCode: { [input.language]: input.code },
    });

    return {
      results,
      passed: results.filter((r) => r.passed).length,
      total: results.length,
    };
  },

  /** Graded submission — runs every case including hidden ones. */
  async submit(userId: string, slug: string, input: { language: Language; code: string }) {
    guardCode(input.code);
    const problem = await dsaRepository.findBySlugWithAllTests(slug);
    if (!problem) throw NotFound('Problem');
    if (problem.testCases.length === 0) throw BadRequest('This problem has no test cases');

    const results: TestCaseResult[] = [];
    let status: SubmissionStatus = 'ACCEPTED';
    let errorMessage: string | null = null;
    let slowestMs = 0;
    let peakMemory = 0;

    for (const [index, testCase] of problem.testCases.entries()) {
      const execution = await executionProvider.execute({
        language: LANGUAGE_MAP[input.language],
        code: input.code,
        input: testCase.input,
      });

      slowestMs = Math.max(slowestMs, execution.executionTime);
      peakMemory = Math.max(peakMemory, execution.memoryUsage);

      const failure = toSubmissionStatus(execution);
      const passed =
        !failure && normalise(execution.stdout) === normalise(testCase.expectedOutput);

      results.push({
        index,
        hidden: testCase.isHidden,
        passed,
        // Hidden test cases never expose their input or expected output.
        input: testCase.isHidden ? undefined : testCase.input,
        expectedOutput: testCase.isHidden ? undefined : testCase.expectedOutput,
        actualOutput: testCase.isHidden ? undefined : execution.stdout,
        stderr: testCase.isHidden ? undefined : execution.stderr,
        executionTime: execution.executionTime,
        memoryUsage: execution.memoryUsage,
      });

      if (failure) {
        status = failure;
        errorMessage = execution.stderr.slice(0, 2000) || failure;
        break;
      }
      if (!passed && status === 'ACCEPTED') {
        status = 'WRONG_ANSWER';
      }
    }

    const passedCount = results.filter((r) => r.passed).length;
    const total = problem.testCases.length;
    const accepted = status === 'ACCEPTED' && passedCount === total;

    await dsaRepository.createSubmission({
      userId,
      problemId: problem.id,
      language: input.language,
      code: input.code,
      status: accepted ? 'ACCEPTED' : status === 'ACCEPTED' ? 'WRONG_ANSWER' : status,
      passed: passedCount,
      total,
      runtimeMs: slowestMs,
      memoryKb: peakMemory,
      errorMessage,
    });

    const existing = await dsaRepository.findProgress(userId, problem.id);
    await dsaRepository.upsertProgress(userId, problem.id, {
      status: accepted ? 'SOLVED' : 'ATTEMPTED',
      solved: accepted || existing?.solved === true,
      incrementAttempts: true,
      bestTimeMs:
        accepted && (existing?.bestTimeMs == null || slowestMs < existing.bestTimeMs)
          ? slowestMs
          : undefined,
      lastCode: { [input.language]: input.code },
    });

    if (accepted) {
      await progressService.recordActivity(userId, { problemsSolved: 1 });
      await revisionService.schedule(userId, {
        problemId: problem.id,
        reason: 'Solved — revisit to keep the pattern fresh',
      });
    } else {
      await revisionService.schedule(userId, {
        problemId: problem.id,
        reason: 'Failed submission — needs another attempt',
      });
    }

    return {
      status: accepted ? ('ACCEPTED' as const) : status === 'ACCEPTED' ? ('WRONG_ANSWER' as const) : status,
      passed: passedCount,
      total,
      wrongAnswers: total - passedCount,
      runtimeMs: slowestMs,
      memoryKb: peakMemory,
      errorMessage,
      // Only public results carry detail; hidden ones report pass/fail alone.
      results,
    };
  },

  health: () => executionProvider.health(),
};
