import type { Difficulty, ProblemStatus } from '@prisma/client';
import { dsaRepository, type ProblemFilter } from '../repositories/dsa.repository';
import { NotFound } from '../utils/errors';

export const dsaService = {
  async list(userId: string, filter: ProblemFilter) {
    const problems = await dsaRepository.list(filter);
    const progress = await dsaRepository.progressForUser(
      userId,
      problems.map((p) => p.id),
    );
    const byProblem = new Map(progress.map((p) => [p.problemId, p]));

    const merged = problems.map((p) => {
      const own = byProblem.get(p.id);
      return {
        ...p,
        status: (own?.status ?? 'NOT_STARTED') as ProblemStatus,
        attempts: own?.attempts ?? 0,
        solved: own?.solved ?? false,
      };
    });

    const filtered = filter.status ? merged.filter((p) => p.status === filter.status) : merged;

    return {
      problems: filtered,
      stats: {
        total: merged.length,
        solved: merged.filter((p) => p.solved).length,
        attempted: merged.filter((p) => p.status === 'ATTEMPTED').length,
      },
    };
  },

  async categories(userId: string) {
    const [grouped, problems, progress] = await Promise.all([
      dsaRepository.categories(),
      dsaRepository.list({}),
      dsaRepository.progressForUser(userId),
    ]);
    const solvedIds = new Set(progress.filter((p) => p.solved).map((p) => p.problemId));

    return grouped.map((g) => {
      const inCategory = problems.filter((p) => p.category === g.category);
      const solved = inCategory.filter((p) => solvedIds.has(p.id)).length;
      return {
        category: g.category,
        total: g._count._all,
        solved,
        percent: g._count._all ? Math.round((solved / g._count._all) * 100) : 0,
      };
    });
  },

  async getBySlug(userId: string, slug: string) {
    const problem = await dsaRepository.findBySlug(slug);
    if (!problem) throw NotFound('Problem');

    const [progress, submissions] = await Promise.all([
      dsaRepository.findProgress(userId, problem.id),
      dsaRepository.submissionsForProblem(userId, problem.id, 10),
    ]);

    const solved = progress?.solved ?? false;
    const { testCases, solutions, ...rest } = problem;

    return {
      problem: {
        ...rest,
        // Sample cases are public; hidden ones are counted but never revealed.
        sampleTestCases: testCases.map((t) => ({
          id: t.id,
          input: t.input,
          expectedOutput: t.expectedOutput,
        })),
        // Reference solution unlocks only once the user has solved it themselves.
        solutions: solved ? solutions : null,
      },
      progress: {
        status: (progress?.status ?? 'NOT_STARTED') as ProblemStatus,
        attempts: progress?.attempts ?? 0,
        solved,
        bestTimeMs: progress?.bestTimeMs ?? null,
        lastCode: (progress?.lastCode ?? {}) as Record<string, string>,
      },
      submissions,
    };
  },

  async setStatus(userId: string, slug: string, status: ProblemStatus) {
    const problem = await dsaRepository.findBySlug(slug);
    if (!problem) throw NotFound('Problem');
    await dsaRepository.upsertProgress(userId, problem.id, {
      status,
      solved: status === 'SOLVED' ? true : undefined,
    });
    return { slug, status };
  },

  async difficultyBreakdown(userId: string) {
    const [byDifficulty, problems, progress] = await Promise.all([
      dsaRepository.countByDifficulty(),
      dsaRepository.list({}),
      dsaRepository.progressForUser(userId),
    ]);
    const solvedIds = new Set(progress.filter((p) => p.solved).map((p) => p.problemId));

    return (['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((difficulty) => {
      const total = byDifficulty.find((d) => d.difficulty === difficulty)?._count._all ?? 0;
      const solved = problems.filter(
        (p) => p.difficulty === difficulty && solvedIds.has(p.id),
      ).length;
      return { difficulty, total, solved };
    });
  },
};
