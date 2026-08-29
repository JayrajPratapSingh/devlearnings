import { prisma } from '../config/prisma';

/**
 * SM-2 style spaced repetition.
 * grade: 0-2 = failed (reset), 3-5 = recalled (interval grows).
 */
function nextInterval(repetitions: number, intervalDays: number, ease: number, grade: number) {
  if (grade < 3) {
    return { repetitions: 0, intervalDays: 1, easeFactor: Math.max(1.3, ease - 0.2) };
  }
  const reps = repetitions + 1;
  const interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(intervalDays * ease);
  const easeFactor = Math.max(
    1.3,
    ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)),
  );
  return { repetitions: reps, intervalDays: Math.min(interval, 120), easeFactor };
}

interface Target {
  topicId?: string;
  problemId?: string;
  questionId?: string;
  reason: string;
}

async function findExisting(userId: string, target: Target) {
  return prisma.revision.findFirst({
    where: {
      userId,
      topicId: target.topicId ?? null,
      problemId: target.problemId ?? null,
      questionId: target.questionId ?? null,
    },
  });
}

export const revisionService = {
  /** Queue an item for revision (idempotent — re-queuing just pulls the due date forward). */
  async schedule(userId: string, target: Target) {
    const existing = await findExisting(userId, target);
    if (existing) {
      return prisma.revision.update({
        where: { id: existing.id },
        data: { dueAt: new Date(), reason: target.reason, repetitions: 0, intervalDays: 1 },
      });
    }
    return prisma.revision.create({
      data: {
        userId,
        topicId: target.topicId ?? null,
        problemId: target.problemId ?? null,
        questionId: target.questionId ?? null,
        reason: target.reason,
        dueAt: new Date(),
      },
    });
  },

  async grade(userId: string, revisionId: string, grade: number) {
    const revision = await prisma.revision.findFirst({ where: { id: revisionId, userId } });
    if (!revision) return null;

    const next = nextInterval(
      revision.repetitions,
      revision.intervalDays,
      revision.easeFactor,
      grade,
    );
    const dueAt = new Date(Date.now() + next.intervalDays * 24 * 60 * 60 * 1000);

    return prisma.revision.update({
      where: { id: revisionId },
      data: { ...next, dueAt, lastReviewedAt: new Date() },
    });
  },

  async gradeTopic(userId: string, topicId: string, grade: number) {
    const revision = await prisma.revision.findFirst({ where: { userId, topicId } });
    if (!revision) return null;
    return this.grade(userId, revision.id, grade);
  },

  /** Everything due today or overdue, newest problems first. */
  async due(userId: string, limit = 30) {
    const items = await prisma.revision.findMany({
      where: { userId, dueAt: { lte: new Date() } },
      orderBy: { dueAt: 'asc' },
      take: limit,
      include: {
        topic: { select: { slug: true, title: true, summary: true, summaryHi: true } },
        problem: { select: { slug: true, title: true, difficulty: true, category: true } },
      },
    });

    return items.map((r) => ({
      id: r.id,
      reason: r.reason,
      dueAt: r.dueAt,
      repetitions: r.repetitions,
      intervalDays: r.intervalDays,
      kind: r.topicId ? ('TOPIC' as const) : r.problemId ? ('PROBLEM' as const) : ('QUESTION' as const),
      topic: r.topic,
      problem: r.problem,
    }));
  },

  async countDue(userId: string) {
    return prisma.revision.count({ where: { userId, dueAt: { lte: new Date() } } });
  },

  async remove(userId: string, revisionId: string) {
    await prisma.revision.deleteMany({ where: { id: revisionId, userId } });
  },
};
