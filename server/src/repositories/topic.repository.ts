import type { LearningStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export const topicRepository = {
  listCategories: () =>
    prisma.topicCategory.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { topics: true } } },
    }),

  findCategoryBySlug: (slug: string) => prisma.topicCategory.findUnique({ where: { slug } }),

  listByCategory: (categorySlug: string) =>
    prisma.topic.findMany({
      where: { category: { slug: categorySlug } },
      orderBy: { order: 'asc' },
    }),

  listAll: () => prisma.topic.findMany({ orderBy: [{ categoryId: 'asc' }, { order: 'asc' }] }),

  findBySlug: (slug: string) =>
    prisma.topic.findUnique({ where: { slug }, include: { category: true } }),

  findManyBySlugs: (slugs: string[]) =>
    prisma.topic.findMany({ where: { slug: { in: slugs } }, include: { category: true } }),

  progressForUser: (userId: string, topicIds?: string[]) =>
    prisma.userTopicProgress.findMany({
      where: { userId, ...(topicIds ? { topicId: { in: topicIds } } : {}) },
    }),

  upsertProgress: (
    userId: string,
    topicId: string,
    data: { status?: LearningStatus; confidence?: number; completedAt?: Date | null; touchView?: boolean },
  ) =>
    prisma.userTopicProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      create: {
        userId,
        topicId,
        status: data.status ?? 'LEARNING',
        confidence: data.confidence ?? 0,
        completedAt: data.completedAt ?? null,
        viewCount: data.touchView ? 1 : 0,
      },
      update: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.confidence !== undefined ? { confidence: data.confidence } : {}),
        ...(data.completedAt !== undefined ? { completedAt: data.completedAt } : {}),
        ...(data.touchView ? { viewCount: { increment: 1 }, lastViewedAt: new Date() } : {}),
      },
    }),

  countTopics: () => prisma.topic.count(),

  countTopicsByStatus: (userId: string, status: LearningStatus) =>
    prisma.userTopicProgress.count({ where: { userId, status } }),

  search: (query: string, limit: number) =>
    prisma.topic.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query.toLowerCase()] } },
        ],
      },
      take: limit,
      include: { category: true },
    }),
};
