import type { Difficulty, LearningStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { NotFound } from '../utils/errors';
import { revisionService } from './revision.service';
import { progressService } from './progress.service';

export const questionService = {
  async categories(userId: string) {
    const [grouped, progress, questions] = await Promise.all([
      prisma.interviewQuestion.groupBy({
        by: ['category'],
        _count: { _all: true },
        orderBy: { category: 'asc' },
      }),
      prisma.userQuestionProgress.findMany({ where: { userId, status: 'KNOWN' } }),
      prisma.interviewQuestion.findMany({ select: { id: true, category: true } }),
    ]);
    const knownIds = new Set(progress.map((p) => p.questionId));

    return grouped.map((g) => {
      const inCategory = questions.filter((q) => q.category === g.category);
      const known = inCategory.filter((q) => knownIds.has(q.id)).length;
      return {
        category: g.category,
        total: g._count._all,
        known,
        percent: g._count._all ? Math.round((known / g._count._all) * 100) : 0,
      };
    });
  },

  async list(
    userId: string,
    filter: { category?: string; difficulty?: Difficulty; status?: LearningStatus; search?: string },
  ) {
    const questions = await prisma.interviewQuestion.findMany({
      where: {
        ...(filter.category ? { category: filter.category } : {}),
        ...(filter.difficulty ? { difficulty: filter.difficulty } : {}),
        ...(filter.search
          ? {
              OR: [
                { question: { contains: filter.search, mode: 'insensitive' as const } },
                { shortAnswer: { contains: filter.search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: [{ category: 'asc' }, { difficulty: 'asc' }],
    });

    const progress = await prisma.userQuestionProgress.findMany({
      where: { userId, questionId: { in: questions.map((q) => q.id) } },
    });
    const byQuestion = new Map(progress.map((p) => [p.questionId, p]));

    const merged = questions.map((q) => ({
      ...q,
      status: byQuestion.get(q.id)?.status ?? ('NEW' as LearningStatus),
      timesSeen: byQuestion.get(q.id)?.timesSeen ?? 0,
    }));

    return filter.status ? merged.filter((q) => q.status === filter.status) : merged;
  },

  async setStatus(userId: string, questionId: string, status: LearningStatus) {
    const question = await prisma.interviewQuestion.findUnique({ where: { id: questionId } });
    if (!question) throw NotFound('Question');

    await prisma.userQuestionProgress.upsert({
      where: { userId_questionId: { userId, questionId } },
      create: { userId, questionId, status, timesSeen: 1 },
      update: { status, timesSeen: { increment: 1 } },
    });

    if (status === 'NEEDS_REVISION') {
      await revisionService.schedule(userId, {
        questionId,
        reason: `Interview question flagged: ${question.category}`,
      });
    }
    await progressService.recordActivity(userId, { questionsAnswered: 1 });

    return { questionId, status };
  },

  async randomForMock(categories: string[], count: number) {
    const pool = await prisma.interviewQuestion.findMany({
      where: categories.length ? { category: { in: categories } } : {},
      select: {
        id: true,
        category: true,
        question: true,
        shortAnswer: true,
        difficulty: true,
      },
    });

    // Fisher–Yates, then take the first `count`.
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = pool[i]!;
      const b = pool[j]!;
      pool[i] = b;
      pool[j] = a;
    }
    return pool.slice(0, count);
  },

  search: (query: string, limit: number) =>
    prisma.interviewQuestion.findMany({
      where: { question: { contains: query, mode: 'insensitive' } },
      take: limit,
      select: { id: true, question: true, category: true, difficulty: true, slug: true },
    }),
};
