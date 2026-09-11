/**
 * Course API Routes
 * Handles all course-related endpoints
 */

import { Router, Request, Response } from 'express';
import { Difficulty } from '@prisma/client';
import { asyncHandler } from '../middleware/async-handler';
import { requireAuth, optionalAuth, currentUser } from '../middleware/auth';
import { BadRequest, NotFound } from '../utils/errors';
import { prisma } from '../config/prisma';

const router = Router();

// ============================================================================
// COURSE ENDPOINTS
// ============================================================================

/**
 * GET /api/courses
 * Get all published courses with stats
 */
router.get(
  '/courses',
  asyncHandler(async (req: Request, res: Response) => {
    const { level, difficulty } = req.query;

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        ...(level && { level: level as string }),
        ...(difficulty && { maxDifficulty: difficulty as Difficulty }),
      },
      orderBy: { order: 'asc' },
      include: {
        modules: {
          select: { id: true, name: true },
        },
        topics: {
          select: { id: true, title: true },
        },
        problems: {
          select: { id: true, title: true },
        },
        userProgress: {
          where: { userId: (req as any).user?.id },
          select: {
            solvedProblems: true,
            totalXpEarned: true,
            timeSpentMin: true,
            completedAt: true,
          },
        },
      },
    });

    const enriched = courses.map((course) => ({
      ...course,
      stats: {
        modulesCount: course.modules.length,
        topicsCount: course.topics.length,
        problemsCount: course.problems.length,
        userProgress: course.userProgress[0] || null,
      },
    }));

    res.json(enriched);
  })
);

/**
 * GET /api/courses/:slug
 * Get course details with modules and topics
 */
router.get(
  '/courses/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            topics: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                slug: true,
                title: true,
                titleHi: true,
                description: true,
                descriptionHi: true,
                difficulty: true,
                duration: true,
                order: true,
                problems: {
                  select: { slug: true },
                  take: 1,
                },
              },
            },
            problems: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
                xpReward: true,
              },
            },
          },
        },
        userProgress: {
          where: { userId: (req as any).user?.id },
          select: {
            id: true,
            solvedProblems: true,
            totalProblems: true,
            totalXpEarned: true,
            timeSpentMin: true,
            currentStreak: true,
            completedAt: true,
          },
        },
      },
    });

    if (!course) {
      throw NotFound('Course');
    }

    // Prisma returns the filtered relation as an array (0 or 1 rows, since
    // `where: { userId }` narrows it to this user) — collapse it to a single
    // object/null here, matching the list endpoint above and the client's
    // CourseData type. Sending the raw array left `course.userProgress`
    // truthy even with zero progress (an empty array is truthy in JS), so
    // the client read `.solvedProblems`/`.totalProblems` off an array and
    // got `undefined`, and every percentage on this page rendered as NaN%.
    res.json({ ...course, userProgress: course.userProgress[0] ?? null });
  })
);

/**
 * GET /api/courses/:courseSlug/topics/:topicSlug
 * One lesson, plus enough of its neighbours to render prev/next navigation.
 */
router.get(
  '/courses/:courseSlug/topics/:topicSlug',
  asyncHandler(async (req: Request, res: Response) => {
    const { courseSlug, topicSlug } = req.params;

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true, slug: true, name: true, nameHi: true, icon: true, color: true },
    });

    if (!course) {
      throw NotFound('Course');
    }

    const topic = await prisma.courseTopic.findFirst({
      where: { courseId: course.id, slug: topicSlug },
      include: {
        module: { select: { slug: true, name: true, nameHi: true, order: true } },
        problems: {
          orderBy: { order: 'asc' },
          select: { slug: true, title: true, difficulty: true, xpReward: true },
        },
      },
    });

    if (!topic) {
      throw NotFound('Lesson');
    }

    // Prev/next run across the whole course, not just the module, so a learner
    // can walk the syllabus end to end without bouncing back to the index.
    const siblings = await prisma.courseTopic.findMany({
      where: { courseId: course.id },
      orderBy: [{ module: { order: 'asc' } }, { order: 'asc' }],
      select: { slug: true, title: true, titleHi: true },
    });

    const position = siblings.findIndex((s) => s.slug === topic.slug);

    res.json({
      course,
      topic,
      prev: position > 0 ? siblings[position - 1] : null,
      next: position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null,
      position: position + 1,
      total: siblings.length,
    });
  })
);

/**
 * GET /api/courses/:courseSlug/modules/:moduleSlug
 * Get module with topics and problems
 */
router.get(
  '/courses/:courseSlug/modules/:moduleSlug',
  asyncHandler(async (req: Request, res: Response) => {
    const { courseSlug, moduleSlug } = req.params;

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      throw NotFound('Course');
    }

    const module = await prisma.courseModule.findFirst({
      where: {
        courseId: course.id,
        slug: moduleSlug,
      },
      include: {
        topics: {
          orderBy: { order: 'asc' },
          include: {
            problems: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
                xpReward: true,
              },
            },
          },
        },
        userProgress: {
          where: { userId: (req as any).user?.id },
          select: {
            problemsSolved: true,
            timeSpentMin: true,
            xpEarned: true,
            completedAt: true,
          },
        },
      },
    });

    if (!module) {
      throw NotFound('Module');
    }

    res.json(module);
  })
);

// ============================================================================
// PROBLEM ENDPOINTS
// ============================================================================

/**
 * GET /api/courses/:courseSlug/problems/:problemSlug
 * Get problem details with examples, hints, and solutions
 */
router.get(
  '/courses/:courseSlug/problems/:problemSlug',
  asyncHandler(async (req: Request, res: Response) => {
    const { courseSlug, problemSlug } = req.params;
    const userId = (req as any).user?.id;

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      throw NotFound('Course');
    }

    const problem = await prisma.courseProblem.findFirst({
      where: {
        courseId: course.id,
        slug: problemSlug,
      },
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
                solvedAt: true,
                lastCode: true,
              },
            }
          : undefined,
      },
    });

    if (!problem) {
      throw NotFound('Problem');
    }

    res.json(problem);
  })
);

/**
 * POST /api/courses/:courseSlug/problems/:problemSlug/submit
 * Submit problem solution
 */
router.post(
  '/courses/:courseSlug/problems/:problemSlug/submit',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { courseSlug, problemSlug } = req.params;
    const { code, language } = req.body;
    const userId = currentUser(req).id;

    // Validate input
    if (!code || !language) {
      throw BadRequest('Code and language are required');
    }

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      throw NotFound('Course');
    }

    const problem = await prisma.courseProblem.findFirst({
      where: {
        courseId: course.id,
        slug: problemSlug,
      },
      include: {
        testCases: { where: { isHidden: false } },
      },
    });

    if (!problem) {
      throw NotFound('Problem');
    }

    // TODO: Implement code execution and test running
    // For now, create submission record
    const submission = await prisma.courseSubmission.create({
      data: {
        userId,
        problemId: problem.id,
        language: language.toUpperCase(),
        code,
        status: 'ACCEPTED', // TODO: Change based on actual test results
        passed: problem.testCases.length,
        total: problem.testCases.length,
      },
    });

    // Update problem progress
    await prisma.userCourseProblemProgress.upsert({
      where: { userId_problemId: { userId, problemId: problem.id } },
      create: {
        userId,
        problemId: problem.id,
        status: 'SOLVED',
        attempts: 1,
        solved: true,
        solvedAt: new Date(),
        lastCode: { code, language },
      },
      update: {
        status: 'SOLVED',
        attempts: { increment: 1 },
        solved: true,
        solvedAt: new Date(),
        lastCode: { code, language },
      },
    });

    res.json({
      submission,
      message: 'Solution submitted successfully',
    });
  })
);

// ============================================================================
// USER PROGRESS ENDPOINTS
// ============================================================================

/**
 * GET /api/courses/:courseSlug/progress
 * Get user's progress in a course
 */
router.get(
  '/courses/:courseSlug/progress',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { courseSlug } = req.params;
    const userId = currentUser(req).id;

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      throw NotFound('Course');
    }

    const progress = await prisma.userCourseProgress.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
      include: {
        moduleProgress: {
          include: {
            module: {
              select: { id: true, name: true, order: true },
            },
          },
        },
      },
    });

    // If no progress, create initial record
    if (!progress) {
      const newProgress = await prisma.userCourseProgress.create({
        data: {
          userId,
          courseId: course.id,
          totalProblems: 0,
          solvedProblems: 0,
        },
      });

      return res.json(newProgress);
    }

    res.json(progress);
  })
);

/**
 * GET /api/user/badges
 * Get user's earned badges
 */
router.get(
  '/user/badges',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = currentUser(req).id;

    const badges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: {
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            icon: true,
            xpReward: true,
          },
        },
      },
      orderBy: { earnedAt: 'desc' },
    });

    res.json(badges);
  })
);

/**
 * GET /api/user/stats
 * Get user's overall statistics
 */
router.get(
  '/user/stats',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = currentUser(req).id;

    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    // If no stats, create initial record
    if (!stats) {
      const newStats = await prisma.userStats.create({
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

      return res.json(newStats);
    }

    res.json(stats);
  })
);

// ============================================================================
// LEADERBOARD ENDPOINTS
// ============================================================================

/**
 * Both leaderboard rows carry only a `userId` — Prisma has no declared
 * relation from CourseLeaderboard/UserStats to User (userId is a plain
 * string column, not a `@relation`), so the name/avatar for the rows this
 * page just fetched has to come from a second, explicit query rather than
 * an `include`. Small (`limit` rows), and it's what fixes the frontend's
 * `entry.user.name` from crashing on an undefined `user`.
 */
async function attachUsers<T extends { userId: string }>(
  rows: T[],
): Promise<(T & { user: { id: string; name: string; avatarColor: string } })[]> {
  const users = await prisma.user.findMany({
    where: { id: { in: rows.map((r) => r.userId) } },
    select: { id: true, name: true, avatarColor: true },
  });
  const byId = new Map(users.map((u) => [u.id, u]));
  return rows.map((row) => ({
    ...row,
    user: byId.get(row.userId) ?? { id: row.userId, name: 'Someone', avatarColor: '#6366f1' },
  }));
}

/** Badge count per user, for the rows currently on the page — same reasoning as attachUsers. */
async function attachBadgeCounts<T extends { userId: string }>(
  rows: T[],
): Promise<(T & { badges: number })[]> {
  const counts = await prisma.userBadge.groupBy({
    by: ['userId'],
    where: { userId: { in: rows.map((r) => r.userId) } },
    _count: { _all: true },
  });
  const byId = new Map(counts.map((c) => [c.userId, c._count._all]));
  return rows.map((row) => ({ ...row, badges: byId.get(row.userId) ?? 0 }));
}

/**
 * GET /api/courses/:courseSlug/leaderboard
 * Get course leaderboard
 */
router.get(
  '/courses/:courseSlug/leaderboard',
  asyncHandler(async (req: Request, res: Response) => {
    const { courseSlug, limit = '10', offset = '0' } = req.query;

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug as string },
      select: { id: true },
    });

    if (!course) {
      throw NotFound('Course');
    }

    const rows = await prisma.courseLeaderboard.findMany({
      where: { courseId: course.id },
      orderBy: { rank: 'asc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const withUsers = await attachUsers(rows);
    const withBadges = await attachBadgeCounts(withUsers);

    // This model doesn't track a per-course streak — 0 is an honest "not
    // tracked here", not a fabricated value; the global leaderboard is where
    // a real streak (from UserStats) applies.
    res.json(
      withBadges.map((row) => ({
        rank: row.rank,
        user: row.user,
        xp: row.xpEarned,
        level: undefined,
        problemsSolved: row.problemsSolved,
        streak: 0,
        badges: row.badges,
      })),
    );
  })
);

/**
 * GET /api/leaderboard/global
 * Get global leaderboard
 */
router.get(
  '/leaderboard/global',
  asyncHandler(async (req: Request, res: Response) => {
    const { limit = '10', offset = '0' } = req.query;
    const skip = parseInt(offset as string);

    const rows = await prisma.userStats.findMany({
      orderBy: { totalXp: 'desc' },
      take: parseInt(limit as string),
      skip,
      select: {
        userId: true,
        totalXp: true,
        level: true,
        totalProblems: true,
        longestCodeStreak: true,
      },
    });

    const withUsers = await attachUsers(rows);
    const withBadges = await attachBadgeCounts(withUsers);

    res.json(
      withBadges.map((row, i) => ({
        rank: skip + i + 1,
        user: row.user,
        xp: row.totalXp,
        level: row.level,
        problemsSolved: row.totalProblems,
        streak: row.longestCodeStreak,
        badges: row.badges,
      })),
    );
  })
);

// ============================================================================
// SEARCH & FILTER ENDPOINTS
// ============================================================================

/**
 * GET /api/courses/search
 * Search courses by name or description
 */
router.get(
  '/courses/search',
  asyncHandler(async (req: Request, res: Response) => {
    const { q, difficulty, level } = req.query;

    if (!q || typeof q !== 'string') {
      throw BadRequest('Search query is required');
    }

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
        ...(difficulty && { maxDifficulty: difficulty as Difficulty }),
        ...(level && { level: level as string }),
      },
      take: 20,
    });

    res.json(courses);
  })
);

/**
 * GET /api/problems/search
 * Search problems by title or description
 */
router.get(
  '/problems/search',
  asyncHandler(async (req: Request, res: Response) => {
    const { q, difficulty, category } = req.query;

    if (!q || typeof q !== 'string') {
      throw BadRequest('Search query is required');
    }

    const problems = await prisma.courseProblem.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
        ...(difficulty && { difficulty: difficulty as Difficulty }),
        // Express types a repeated query param as an array, so narrow it.
        ...(typeof category === 'string' && { category }),
      },
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
        category: true,
        xpReward: true,
      },
      take: 20,
    });

    res.json(problems);
  })
);

export default router;
