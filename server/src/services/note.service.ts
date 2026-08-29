import { prisma } from '../config/prisma';
import { NotFound } from '../utils/errors';

export interface NoteInput {
  title: string;
  content: string;
  topicId?: string | null;
  problemId?: string | null;
  questionId?: string | null;
  tags?: string[];
}

export const noteService = {
  list: (userId: string, filter: { search?: string; topicId?: string; problemId?: string }) =>
    prisma.note.findMany({
      where: {
        userId,
        ...(filter.topicId ? { topicId: filter.topicId } : {}),
        ...(filter.problemId ? { problemId: filter.problemId } : {}),
        ...(filter.search
          ? {
              OR: [
                { title: { contains: filter.search, mode: 'insensitive' as const } },
                { content: { contains: filter.search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        topic: { select: { slug: true, title: true } },
        problem: { select: { slug: true, title: true } },
      },
    }),

  create: (userId: string, input: NoteInput) =>
    prisma.note.create({
      data: {
        userId,
        title: input.title,
        content: input.content,
        topicId: input.topicId ?? null,
        problemId: input.problemId ?? null,
        questionId: input.questionId ?? null,
        tags: input.tags ?? [],
      },
    }),

  async update(userId: string, id: string, input: Partial<NoteInput>) {
    const existing = await prisma.note.findFirst({ where: { id, userId } });
    if (!existing) throw NotFound('Note');
    return prisma.note.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.content !== undefined ? { content: input.content } : {}),
        ...(input.tags !== undefined ? { tags: input.tags } : {}),
      },
    });
  },

  async remove(userId: string, id: string) {
    const { count } = await prisma.note.deleteMany({ where: { id, userId } });
    if (count === 0) throw NotFound('Note');
  },

  search: (userId: string, query: string, limit: number) =>
    prisma.note.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: { id: true, title: true, topicId: true, problemId: true },
    }),
};
