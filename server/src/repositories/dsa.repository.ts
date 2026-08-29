import type { Difficulty, Prisma, ProblemStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface ProblemFilter {
  category?: string;
  difficulty?: Difficulty;
  status?: ProblemStatus;
  search?: string;
}

/** Fields safe to send to the client — deliberately excludes solutions. */
const listSelect = {
  id: true,
  slug: true,
  title: true,
  category: true,
  difficulty: true,
  order: true,
} satisfies Prisma.DSAProblemSelect;

export const dsaRepository = {
  list: (filter: ProblemFilter) =>
    prisma.dSAProblem.findMany({
      where: {
        ...(filter.category ? { category: filter.category } : {}),
        ...(filter.difficulty ? { difficulty: filter.difficulty } : {}),
        ...(filter.search
          ? {
              OR: [
                { title: { contains: filter.search, mode: 'insensitive' as const } },
                { description: { contains: filter.search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      select: listSelect,
      orderBy: [{ order: 'asc' }],
    }),

  findBySlug: (slug: string) =>
    prisma.dSAProblem.findUnique({
      where: { slug },
      include: {
        // Only non-hidden cases ever leave the repository for problem pages.
        testCases: { where: { isHidden: false }, orderBy: { order: 'asc' } },
      },
    }),

  findBySlugWithAllTests: (slug: string) =>
    prisma.dSAProblem.findUnique({
      where: { slug },
      include: { testCases: { orderBy: { order: 'asc' } } },
    }),

  categories: () =>
    prisma.dSAProblem.groupBy({ by: ['category'], _count: { _all: true }, orderBy: { category: 'asc' } }),

  progressForUser: (userId: string, problemIds?: string[]) =>
    prisma.userProblemProgress.findMany({
      where: { userId, ...(problemIds ? { problemId: { in: problemIds } } : {}) },
    }),

  findProgress: (userId: string, problemId: string) =>
    prisma.userProblemProgress.findUnique({ where: { userId_problemId: { userId, problemId } } }),

  upsertProgress: (
    userId: string,
    problemId: string,
    data: {
      status?: ProblemStatus;
      solved?: boolean;
      incrementAttempts?: boolean;
      bestTimeMs?: number | null;
      lastCode?: Prisma.InputJsonValue;
    },
  ) =>
    prisma.userProblemProgress.upsert({
      where: { userId_problemId: { userId, problemId } },
      create: {
        userId,
        problemId,
        status: data.status ?? 'ATTEMPTED',
        solved: data.solved ?? false,
        attempts: data.incrementAttempts ? 1 : 0,
        bestTimeMs: data.bestTimeMs ?? null,
        lastAttempt: new Date(),
        solvedAt: data.solved ? new Date() : null,
        lastCode: data.lastCode ?? {},
      },
      update: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.solved !== undefined ? { solved: data.solved } : {}),
        ...(data.incrementAttempts ? { attempts: { increment: 1 } } : {}),
        ...(data.bestTimeMs !== undefined ? { bestTimeMs: data.bestTimeMs } : {}),
        ...(data.solved ? { solvedAt: new Date() } : {}),
        ...(data.lastCode ? { lastCode: data.lastCode } : {}),
        lastAttempt: new Date(),
      },
    }),

  createSubmission: (data: Prisma.SubmissionUncheckedCreateInput) =>
    prisma.submission.create({ data }),

  submissionsForProblem: (userId: string, problemId: string, take = 20) =>
    prisma.submission.findMany({
      where: { userId, problemId },
      orderBy: { createdAt: 'desc' },
      take,
      select: {
        id: true,
        language: true,
        status: true,
        passed: true,
        total: true,
        runtimeMs: true,
        memoryKb: true,
        createdAt: true,
      },
    }),

  recentSubmissions: (userId: string, take = 10) =>
    prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take,
      include: { problem: { select: { slug: true, title: true, difficulty: true } } },
    }),

  count: () => prisma.dSAProblem.count(),

  countByDifficulty: () =>
    prisma.dSAProblem.groupBy({ by: ['difficulty'], _count: { _all: true } }),

  search: (query: string, limit: number) =>
    prisma.dSAProblem.findMany({
      where: { title: { contains: query, mode: 'insensitive' } },
      select: listSelect,
      take: limit,
    }),
};
