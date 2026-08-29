import { prisma } from '../config/prisma';
import { questionService } from './question.service';
import { revisionService } from './revision.service';
import { BadRequest, NotFound } from '../utils/errors';

const DEFAULT_CATEGORIES = [
  'JavaScript',
  'React',
  'Node.js',
  'SQL',
  'MongoDB',
  'System Design',
  'Authentication',
];

export const mockInterviewService = {
  async start(
    userId: string,
    input: { durationMin?: number; questionCount?: number; categories?: string[] },
  ) {
    const categories = input.categories?.length ? input.categories : DEFAULT_CATEGORIES;
    const count = input.questionCount ?? 10;
    const picked = await questionService.randomForMock(categories, count);

    if (picked.length === 0) {
      throw BadRequest('No questions available for the selected categories');
    }

    const interview = await prisma.mockInterview.create({
      data: {
        userId,
        title: `Mock Interview — ${new Date().toLocaleDateString()}`,
        durationMin: input.durationMin ?? 30,
        totalScore: picked.length * 2,
        questions: {
          create: picked.map((q, index) => ({
            questionId: q.id,
            category: q.category,
            prompt: q.question,
            shortAnswer: q.shortAnswer,
            order: index,
          })),
        },
      },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    return {
      id: interview.id,
      title: interview.title,
      durationMin: interview.durationMin,
      startedAt: interview.startedAt,
      questions: interview.questions.map((q) => ({
        id: q.id,
        order: q.order,
        category: q.category,
        prompt: q.prompt,
        // The model answer is only revealed after the user self-scores.
      })),
    };
  },

  async get(userId: string, id: string) {
    const interview = await prisma.mockInterview.findFirst({
      where: { id, userId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!interview) throw NotFound('Mock interview');
    return interview;
  },

  async answer(userId: string, id: string, questionId: string, selfScore: number) {
    const interview = await prisma.mockInterview.findFirst({ where: { id, userId } });
    if (!interview) throw NotFound('Mock interview');

    const question = await prisma.mockInterviewQuestion.findFirst({
      where: { id: questionId, interviewId: id },
    });
    if (!question) throw NotFound('Question');

    await prisma.mockInterviewQuestion.update({
      where: { id: questionId },
      data: { selfScore, answeredAt: new Date() },
    });

    // Reveal the model answer once the user has committed to a score.
    return { shortAnswer: question.shortAnswer, selfScore };
  },

  async finish(userId: string, id: string) {
    const interview = await prisma.mockInterview.findFirst({
      where: { id, userId },
      include: { questions: true },
    });
    if (!interview) throw NotFound('Mock interview');

    const score = interview.questions.reduce((sum, q) => sum + (q.selfScore ?? 0), 0);
    const totalScore = interview.questions.length * 2;

    // Any category where the user averaged below 1.5/2 is a weak area.
    const byCategory = new Map<string, { score: number; count: number }>();
    for (const q of interview.questions) {
      const entry = byCategory.get(q.category) ?? { score: 0, count: 0 };
      entry.score += q.selfScore ?? 0;
      entry.count += 1;
      byCategory.set(q.category, entry);
    }
    const weakTopics = [...byCategory.entries()]
      .filter(([, v]) => v.score / (v.count * 2) < 0.75)
      .map(([category]) => category);

    // Queue everything answered poorly for revision.
    for (const q of interview.questions) {
      if ((q.selfScore ?? 0) < 2) {
        await revisionService.schedule(userId, {
          questionId: q.questionId,
          reason: `Mock interview miss — ${q.category}`,
        });
      }
    }

    const updated = await prisma.mockInterview.update({
      where: { id },
      data: { status: 'COMPLETED', score, totalScore, weakTopics, finishedAt: new Date() },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    return {
      id: updated.id,
      score,
      totalScore,
      percent: totalScore ? Math.round((score / totalScore) * 100) : 0,
      weakTopics,
      correct: updated.questions.filter((q) => q.selfScore === 2).length,
      partial: updated.questions.filter((q) => q.selfScore === 1).length,
      wrong: updated.questions.filter((q) => (q.selfScore ?? 0) === 0).length,
      retry: updated.questions
        .filter((q) => (q.selfScore ?? 0) < 2)
        .map((q) => ({ id: q.id, prompt: q.prompt, category: q.category, shortAnswer: q.shortAnswer })),
    };
  },

  history: (userId: string) =>
    prisma.mockInterview.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        status: true,
        score: true,
        totalScore: true,
        startedAt: true,
        finishedAt: true,
        weakTopics: true,
      },
    }),
};
