-- AddCourseSystem Migration
-- Adds complete course management system with gamification

-- ============================================================================
-- COURSE MODELS
-- ============================================================================

-- Course table
CREATE TABLE "Course" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "nameHi" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "descriptionHi" TEXT,
  "icon" TEXT NOT NULL DEFAULT '📚',
  "color" TEXT NOT NULL DEFAULT '#6366f1',
  "level" TEXT NOT NULL DEFAULT 'beginner',
  "totalXpReward" INTEGER NOT NULL DEFAULT 0,
  "estimatedHours" INTEGER NOT NULL DEFAULT 50,
  "maxDifficulty" TEXT NOT NULL DEFAULT 'HARD',
  "order" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE INDEX "Course_slug_idx" ON "Course"("slug");
CREATE INDEX "Course_level_order_idx" ON "Course"("level", "order");

-- CourseModule table
CREATE TABLE "CourseModule" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameHi" TEXT,
  "description" TEXT,
  "descriptionHi" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE,
  UNIQUE("courseId", "slug")
);

CREATE INDEX "CourseModule_courseId_order_idx" ON "CourseModule"("courseId", "order");

-- CourseTopic table
CREATE TABLE "CourseTopic" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseId" TEXT NOT NULL,
  "moduleId" TEXT,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "titleHi" TEXT,
  "description" TEXT NOT NULL,
  "descriptionHi" TEXT,
  "simple" TEXT,
  "simpleHi" TEXT,
  "content" TEXT NOT NULL,
  "contentHi" TEXT,
  "codeExample" TEXT,
  "expectedOutput" TEXT,
  "difficulty" TEXT NOT NULL DEFAULT 'EASY',
  "order" INTEGER NOT NULL DEFAULT 0,
  "duration" INTEGER NOT NULL DEFAULT 15,
  "keyTakeaways" TEXT NOT NULL DEFAULT '[]',
  "relatedTopics" TEXT NOT NULL DEFAULT '[]',
  "tags" TEXT NOT NULL DEFAULT '[]',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE,
  FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id") ON DELETE CASCADE,
  UNIQUE("courseId", "slug")
);

CREATE INDEX "CourseTopic_courseId_moduleId_order_idx" ON "CourseTopic"("courseId", "moduleId", "order");

-- CourseProblem table
CREATE TABLE "CourseProblem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseId" TEXT NOT NULL,
  "moduleId" TEXT,
  "topicId" TEXT,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "difficulty" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "descriptionHi" TEXT,
  "examples" TEXT NOT NULL DEFAULT '[]',
  "constraints" TEXT NOT NULL DEFAULT '[]',
  "hints" TEXT NOT NULL DEFAULT '[]',
  "approach" TEXT NOT NULL,
  "approachHi" TEXT,
  "timeComplexity" TEXT NOT NULL,
  "spaceComplexity" TEXT NOT NULL,
  "solutionExplanation" TEXT NOT NULL,
  "solutionExplanationHi" TEXT,
  "solutions" TEXT NOT NULL DEFAULT '{}',
  "starterCode" TEXT NOT NULL DEFAULT '{}',
  "supportedLanguages" TEXT NOT NULL DEFAULT 'JAVASCRIPT,NODEJS,PYTHON',
  "xpReward" INTEGER NOT NULL DEFAULT 100,
  "testCasesCount" INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE,
  FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id") ON DELETE CASCADE,
  FOREIGN KEY ("topicId") REFERENCES "CourseTopic"("id") ON DELETE CASCADE,
  UNIQUE("courseId", "slug")
);

CREATE INDEX "CourseProblem_courseId_difficulty_idx" ON "CourseProblem"("courseId", "difficulty");
CREATE INDEX "CourseProblem_moduleId_order_idx" ON "CourseProblem"("moduleId", "order");

-- CourseProblemTestCase table
CREATE TABLE "CourseProblemTestCase" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "problemId" TEXT NOT NULL,
  "input" TEXT NOT NULL,
  "expectedOutput" TEXT NOT NULL,
  "explanation" TEXT,
  "isHidden" BOOLEAN NOT NULL DEFAULT false,
  "isSample" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY ("problemId") REFERENCES "CourseProblem"("id") ON DELETE CASCADE
);

CREATE INDEX "CourseProblemTestCase_problemId_isHidden_idx" ON "CourseProblemTestCase"("problemId", "isHidden");

-- CourseSubmission table
CREATE TABLE "CourseSubmission" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "problemId" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "passed" INTEGER NOT NULL DEFAULT 0,
  "total" INTEGER NOT NULL DEFAULT 0,
  "runtimeMs" INTEGER,
  "memoryKb" INTEGER,
  "errorMessage" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("problemId") REFERENCES "CourseProblem"("id") ON DELETE CASCADE
);

CREATE INDEX "CourseSubmission_userId_problemId_idx" ON "CourseSubmission"("userId", "problemId");
CREATE INDEX "CourseSubmission_userId_createdAt_idx" ON "CourseSubmission"("userId", "createdAt");

-- ============================================================================
-- USER PROGRESS TRACKING
-- ============================================================================

-- UserCourseProgress table
CREATE TABLE "UserCourseProgress" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "totalProblems" INTEGER NOT NULL DEFAULT 0,
  "solvedProblems" INTEGER NOT NULL DEFAULT 0,
  "totalXpEarned" INTEGER NOT NULL DEFAULT 0,
  "timeSpentMin" INTEGER NOT NULL DEFAULT 0,
  "longestStreak" INTEGER NOT NULL DEFAULT 0,
  "currentStreak" INTEGER NOT NULL DEFAULT 0,
  "lastActiveDay" DATETIME,
  "completedAt" DATETIME,
  "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE,
  UNIQUE("userId", "courseId")
);

CREATE INDEX "UserCourseProgress_userId_updatedAt_idx" ON "UserCourseProgress"("userId", "updatedAt");

-- UserCourseModuleProgress table
CREATE TABLE "UserCourseModuleProgress" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "moduleId" TEXT NOT NULL,
  "topicsCompleted" INTEGER NOT NULL DEFAULT 0,
  "problemsSolved" INTEGER NOT NULL DEFAULT 0,
  "timeSpentMin" INTEGER NOT NULL DEFAULT 0,
  "xpEarned" INTEGER NOT NULL DEFAULT 0,
  "completedAt" DATETIME,
  "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE,
  FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id") ON DELETE CASCADE,
  UNIQUE("userId", "moduleId")
);

CREATE INDEX "UserCourseModuleProgress_userId_courseId_idx" ON "UserCourseModuleProgress"("userId", "courseId");

-- UserCourseProblemProgress table
CREATE TABLE "UserCourseProblemProgress" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "problemId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "solved" BOOLEAN NOT NULL DEFAULT false,
  "bestTimeMs" INTEGER,
  "hintsUsed" INTEGER NOT NULL DEFAULT 0,
  "maxHints" INTEGER NOT NULL DEFAULT 3,
  "lastAttempt" DATETIME,
  "solvedAt" DATETIME,
  "lastCode" TEXT NOT NULL DEFAULT '{}',
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("problemId") REFERENCES "CourseProblem"("id") ON DELETE CASCADE,
  UNIQUE("userId", "problemId")
);

CREATE INDEX "UserCourseProblemProgress_userId_status_idx" ON "UserCourseProblemProgress"("userId", "status");

-- ============================================================================
-- GAMIFICATION
-- ============================================================================

-- Badge table
CREATE TABLE "Badge" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "nameHi" TEXT,
  "description" TEXT NOT NULL,
  "descriptionHi" TEXT,
  "icon" TEXT NOT NULL,
  "color" TEXT NOT NULL DEFAULT '#6366f1',
  "category" TEXT NOT NULL DEFAULT 'achievement',
  "requirementType" TEXT NOT NULL DEFAULT 'count',
  "requirementValue" INTEGER NOT NULL DEFAULT 0,
  "xpReward" INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isSecret" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Badge_category_order_idx" ON "Badge"("category", "order");

-- UserBadge table
CREATE TABLE "UserBadge" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "badgeId" TEXT NOT NULL,
  "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE,
  UNIQUE("userId", "badgeId")
);

CREATE INDEX "UserBadge_userId_earnedAt_idx" ON "UserBadge"("userId", "earnedAt");

-- ============================================================================
-- LEADERBOARD & STATISTICS
-- ============================================================================

-- CourseLeaderboard table
CREATE TABLE "CourseLeaderboard" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "rank" INTEGER NOT NULL DEFAULT 0,
  "xpEarned" INTEGER NOT NULL DEFAULT 0,
  "problemsSolved" INTEGER NOT NULL DEFAULT 0,
  "timeSpentMin" INTEGER NOT NULL DEFAULT 0,
  "lastUpdated" DATETIME NOT NULL,
  UNIQUE("userId", "courseId")
);

CREATE INDEX "CourseLeaderboard_courseId_rank_idx" ON "CourseLeaderboard"("courseId", "rank");

-- UserStats table
CREATE TABLE "UserStats" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "totalXp" INTEGER NOT NULL DEFAULT 0,
  "totalProblems" INTEGER NOT NULL DEFAULT 0,
  "totalCourses" INTEGER NOT NULL DEFAULT 0,
  "longestCodeStreak" INTEGER NOT NULL DEFAULT 0,
  "totalTimeMin" INTEGER NOT NULL DEFAULT 0,
  "level" INTEGER NOT NULL DEFAULT 1,
  "nextLevelXp" INTEGER NOT NULL DEFAULT 1000,
  "lastUpdated" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "UserStats_userId_idx" ON "UserStats"("userId");
