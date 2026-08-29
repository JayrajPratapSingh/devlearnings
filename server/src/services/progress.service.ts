import { prisma } from '../config/prisma';
import { dsaRepository } from '../repositories/dsa.repository';
import { topicRepository } from '../repositories/topic.repository';
import { userRepository } from '../repositories/user.repository';
import { revisionService } from './revision.service';

function startOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000);
}

export const progressService = {
  /** Records daily activity and keeps the study streak honest. */
  async recordActivity(
    userId: string,
    delta: { minutes?: number; problemsSolved?: number; topicsRead?: number; questionsAnswered?: number },
  ) {
    const day = startOfDay();

    await prisma.studySession.upsert({
      where: { userId_day: { userId, day } },
      create: {
        userId,
        day,
        minutes: delta.minutes ?? 0,
        problemsSolved: delta.problemsSolved ?? 0,
        topicsRead: delta.topicsRead ?? 0,
        questionsAnswered: delta.questionsAnswered ?? 0,
      },
      update: {
        minutes: { increment: delta.minutes ?? 0 },
        problemsSolved: { increment: delta.problemsSolved ?? 0 },
        topicsRead: { increment: delta.topicsRead ?? 0 },
        questionsAnswered: { increment: delta.questionsAnswered ?? 0 },
      },
    });

    const user = await userRepository.findById(userId);
    if (!user) return;

    const gap = user.lastActiveDay ? daysBetween(day, user.lastActiveDay) : null;
    if (gap === 0) return; // already counted today

    const currentStreak = gap === 1 ? user.currentStreak + 1 : 1;
    await userRepository.updateStreak(
      userId,
      currentStreak,
      Math.max(currentStreak, user.longestStreak),
      day,
    );
  },

  /** Everything the dashboard needs, in one round trip. */
  async dashboard(userId: string) {
    const [
      user,
      totalProblems,
      problemProgress,
      totalTopics,
      topicProgress,
      submissions,
      recentSubmissions,
      dueCount,
      sessions,
      categories,
      questionProgress,
      totalQuestions,
    ] = await Promise.all([
      userRepository.findById(userId),
      dsaRepository.count(),
      dsaRepository.progressForUser(userId),
      topicRepository.countTopics(),
      topicRepository.progressForUser(userId),
      prisma.submission.findMany({ where: { userId }, select: { status: true } }),
      dsaRepository.recentSubmissions(userId, 6),
      revisionService.countDue(userId),
      prisma.studySession.findMany({
        where: { userId, day: { gte: new Date(Date.now() - 27 * 86_400_000) } },
        orderBy: { day: 'asc' },
      }),
      topicRepository.listCategories(),
      prisma.userQuestionProgress.findMany({ where: { userId }, select: { status: true } }),
      prisma.interviewQuestion.count(),
    ]);

    const solved = problemProgress.filter((p) => p.solved).length;
    const attempted = problemProgress.filter((p) => p.attempts > 0).length;
    const accepted = submissions.filter((s) => s.status === 'ACCEPTED').length;
    const accuracy = submissions.length ? Math.round((accepted / submissions.length) * 100) : 0;

    const knownTopics = topicProgress.filter((p) => p.status === 'KNOWN').length;
    const knownQuestions = questionProgress.filter((p) => p.status === 'KNOWN').length;

    // Per-technology progress, driven by topic categories.
    const allTopics = await topicRepository.listAll();
    const knownTopicIds = new Set(
      topicProgress.filter((p) => p.status === 'KNOWN').map((p) => p.topicId),
    );
    const byCategory = categories.map((c) => {
      const inCategory = allTopics.filter((t) => t.categoryId === c.id);
      const done = inCategory.filter((t) => knownTopicIds.has(t.id)).length;
      return {
        slug: c.slug,
        name: c.name,
        total: inCategory.length,
        completed: done,
        percent: inCategory.length ? Math.round((done / inCategory.length) * 100) : 0,
      };
    });

    // Weak areas: categories with real material where less than a third is solid.
    const weakTopics = byCategory
      .filter((c) => c.total >= 3 && c.percent < 34)
      .sort((a, b) => a.percent - b.percent)
      .slice(0, 5);

    const dsaPercent = totalProblems ? Math.round((solved / totalProblems) * 100) : 0;
    const topicPercent = totalTopics ? Math.round((knownTopics / totalTopics) * 100) : 0;
    const questionPercent = totalQuestions
      ? Math.round((knownQuestions / totalQuestions) * 100)
      : 0;
    const overall = Math.round(dsaPercent * 0.4 + topicPercent * 0.4 + questionPercent * 0.2);

    // 28-day activity strip, zero-filled so the chart never has gaps.
    const sessionByDay = new Map(
      sessions.map((s) => [startOfDay(s.day).toISOString(), s]),
    );
    const activity = Array.from({ length: 28 }, (_, i) => {
      const day = startOfDay(new Date(Date.now() - (27 - i) * 86_400_000));
      const session = sessionByDay.get(day.toISOString());
      return {
        day: day.toISOString().slice(0, 10),
        problemsSolved: session?.problemsSolved ?? 0,
        topicsRead: session?.topicsRead ?? 0,
        minutes: session?.minutes ?? 0,
      };
    });

    return {
      overall,
      streak: user?.currentStreak ?? 0,
      longestStreak: user?.longestStreak ?? 0,
      dsa: { solved, attempted, total: totalProblems, percent: dsaPercent },
      topics: { completed: knownTopics, total: totalTopics, percent: topicPercent },
      questions: { known: knownQuestions, total: totalQuestions, percent: questionPercent },
      accuracy,
      totalSubmissions: submissions.length,
      revisionDue: dueCount,
      byCategory,
      weakTopics,
      activity,
      recentSubmissions: recentSubmissions.map((s) => ({
        id: s.id,
        status: s.status,
        language: s.language,
        passed: s.passed,
        total: s.total,
        createdAt: s.createdAt,
        problem: s.problem,
      })),
    };
  },

  /**
   * A full year of daily activity, for the heatmap.
   *
   * Only days with activity exist as rows, so this returns a sparse list and the
   * client fills the gaps — sending 365 mostly-zero rows would be wasteful.
   */
  async yearActivity(userId: string) {
    const sessions = await prisma.studySession.findMany({
      where: { userId, day: { gte: new Date(Date.now() - 371 * 86_400_000) } },
      orderBy: { day: 'asc' },
      select: { day: true, problemsSolved: true, topicsRead: true, minutes: true },
    });

    return sessions.map((s) => ({
      day: startOfDay(s.day).toISOString().slice(0, 10),
      problemsSolved: s.problemsSolved,
      topicsRead: s.topicsRead,
      minutes: s.minutes,
    }));
  },

  /** Detail view for the Progress page. */
  async detail(userId: string) {
    const [dashboard, difficulty, mocks, yearActivity] = await Promise.all([
      this.dashboard(userId),
      (await import('./dsa.service')).dsaService.difficultyBreakdown(userId),
      prisma.mockInterview.findMany({
        where: { userId, status: 'COMPLETED' },
        orderBy: { startedAt: 'desc' },
        take: 10,
        select: { id: true, title: true, score: true, totalScore: true, startedAt: true },
      }),
      this.yearActivity(userId),
    ]);

    return { ...dashboard, difficulty, mockInterviews: mocks, yearActivity };
  },
};
