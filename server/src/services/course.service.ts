/**
 * Course Service
 * Business logic for course operations.
 *
 * NOTE: currently unused — `courses.routes.ts` queries Prisma directly. Kept as
 * the extraction target for when those handlers get thinned out; delete it if
 * that refactor is not planned, rather than letting two copies of this logic drift.
 */

import { Language } from '@prisma/client';
import { BadRequest, NotFound } from '../utils/errors';
import { prisma } from '../config/prisma';

export class CourseService {
  /**
   * Get all courses with optional filtering
   */
  static async getAllCourses(options?: {
    level?: string;
    published?: boolean;
    limit?: number;
    offset?: number;
  }) {
    return prisma.course.findMany({
      where: {
        isPublished: options?.published !== false,
        ...(options?.level && { level: options.level }),
      },
      orderBy: { order: 'asc' },
      take: options?.limit || 100,
      skip: options?.offset || 0,
      include: {
        modules: { select: { id: true, name: true } },
        topics: { select: { id: true, title: true } },
        problems: { select: { id: true, title: true } },
      },
    });
  }

  /**
   * Get course by slug
   */
  static async getCourseBySlug(slug: string) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            topics: { orderBy: { order: 'asc' } },
            problems: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    if (!course) {
      throw NotFound('Course');
    }

    return course;
  }

  /**
   * Get user's course progress
   */
  static async getUserCourseProgress(userId: string, courseId: string) {
    let progress = await prisma.userCourseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        moduleProgress: true,
      },
    });

    // Create if doesn't exist
    if (!progress) {
      progress = await prisma.userCourseProgress.create({
        data: {
          userId,
          courseId,
          totalProblems: 0,
          solvedProblems: 0,
        },
        include: { moduleProgress: true },
      });
    }

    return progress;
  }

  /**
   * Get problem with test cases (hide hidden ones for users)
   */
  static async getProblemDetails(problemId: string, userId?: string) {
    const problem = await prisma.courseProblem.findUnique({
      where: { id: problemId },
      include: {
        testCases: {
          where: { isHidden: false },
          orderBy: { order: 'asc' },
        },
        userProgress: userId
          ? {
              where: { userId },
              select: {
                status: true,
                attempts: true,
                solved: true,
                hintsUsed: true,
                maxHints: true,
              },
            }
          : undefined,
      },
    });

    if (!problem) {
      throw NotFound('Problem');
    }

    return problem;
  }

  /**
   * Submit problem solution
   */
  static async submitSolution(
    userId: string,
    problemId: string,
    code: string,
    language: string
  ) {
    // TODO: Integrate with code execution service
    // For now, just create submission record

    // The column is an enum, so reject anything outside it rather than letting
    // an unknown language reach the database as a raw string.
    const normalised = language.toUpperCase();
    if (!Object.values(Language).includes(normalised as Language)) {
      throw BadRequest(`Unsupported language: ${language}`);
    }

    const submission = await prisma.courseSubmission.create({
      data: {
        userId,
        problemId,
        code,
        language: normalised as Language,
        status: 'ACCEPTED', // TODO: Change based on test results
      },
    });

    // Update user progress
    await this.updateProblemProgress(userId, problemId, true);

    return submission;
  }

  /**
   * Update problem progress
   */
  static async updateProblemProgress(
    userId: string,
    problemId: string,
    solved: boolean
  ) {
    const problem = await prisma.courseProblem.findUnique({
      where: { id: problemId },
      select: { courseId: true, xpReward: true },
    });

    if (!problem) {
      throw NotFound('Problem');
    }

    // Update problem progress
    const progress = await prisma.userCourseProblemProgress.upsert({
      where: { userId_problemId: { userId, problemId } },
      create: {
        userId,
        problemId,
        status: solved ? 'SOLVED' : 'ATTEMPTED',
        attempts: 1,
        solved,
        solvedAt: solved ? new Date() : null,
      },
      update: {
        attempts: { increment: 1 },
        status: solved ? 'SOLVED' : undefined,
        solved: solved ? true : undefined,
        solvedAt: solved ? new Date() : undefined,
      },
    });

    // Update course progress if solved
    if (solved) {
      const courseProgress = await prisma.userCourseProgress.findFirst({
        where: {
          userId,
          courseId: problem.courseId,
        },
      });

      if (courseProgress) {
        await prisma.userCourseProgress.update({
          where: { id: courseProgress.id },
          data: {
            solvedProblems: { increment: 1 },
            totalXpEarned: { increment: problem.xpReward },
          },
        });
      }

      // Update user stats
      await this.updateUserStats(userId, problem.xpReward);
    }

    return progress;
  }

  /**
   * Use hint for problem
   */
  static async useHint(userId: string, problemId: string) {
    const progress = await prisma.userCourseProblemProgress.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    if (!progress) {
      throw NotFound('Problem progress');
    }

    if (progress.hintsUsed >= progress.maxHints) {
      throw BadRequest('No hints remaining');
    }

    return prisma.userCourseProblemProgress.update({
      where: { userId_problemId: { userId, problemId } },
      data: {
        hintsUsed: { increment: 1 },
      },
    });
  }

  /**
   * Get user's earned badges
   */
  static async getUserBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
    });
  }

  /**
   * Award badge to user
   */
  static async awardBadge(userId: string, badgeSlug: string) {
    const badge = await prisma.badge.findUnique({
      where: { slug: badgeSlug },
    });

    if (!badge) {
      throw NotFound('Badge');
    }

    // Check if user already has badge
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });

    if (existing) {
      return existing;
    }

    return prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    });
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string) {
    let stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      stats = await prisma.userStats.create({
        data: {
          userId,
          totalXp: 0,
          totalProblems: 0,
          totalCourses: 0,
          level: 1,
          nextLevelXp: 1000,
          lastUpdated: new Date(),
        },
      });
    }

    return stats;
  }

  /**
   * Update user statistics
   */
  static async updateUserStats(userId: string, xpGained: number) {
    const stats = await this.getUserStats(userId);

    const newXp = stats.totalXp + xpGained;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const nextLevelXp = newLevel * 1000;

    return prisma.userStats.update({
      where: { userId },
      data: {
        totalXp: newXp,
        level: newLevel,
        nextLevelXp,
        totalProblems: { increment: 1 },
        lastUpdated: new Date(),
      },
    });
  }

  /**
   * Get course leaderboard
   */
  static async getCourseLeaderboard(
    courseId: string,
    limit: number = 10,
    offset: number = 0
  ) {
    return prisma.courseLeaderboard.findMany({
      where: { courseId },
      orderBy: { rank: 'asc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get global leaderboard
   */
  static async getGlobalLeaderboard(limit: number = 10, offset: number = 0) {
    return prisma.userStats.findMany({
      orderBy: { totalXp: 'desc' },
      take: limit,
      skip: offset,
      select: {
        userId: true,
        totalXp: true,
        level: true,
        totalProblems: true,
        totalCourses: true,
      },
    });
  }

  /**
   * Search courses
   */
  static async searchCourses(query: string, limit: number = 20) {
    return prisma.course.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
  }

  /**
   * Search problems
   */
  static async searchProblems(
    query: string,
    category?: string,
    limit: number = 20
  ) {
    return prisma.courseProblem.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        ...(category && { category }),
      },
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
        category: true,
        xpReward: true,
      },
      take: limit,
    });
  }
}
