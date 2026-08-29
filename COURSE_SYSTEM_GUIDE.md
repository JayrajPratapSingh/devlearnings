# JavaScript Learning Course System - Complete Guide

A full-stack interactive learning platform for teaching JavaScript with gamification, multi-language support, and real-time progress tracking.

---

## 🎯 System Overview

This course system consists of:

1. **Database Schema** - Comprehensive PostgreSQL models for courses, problems, user progress, and gamification
2. **RESTful API** - 20+ endpoints for course data, submissions, and user statistics
3. **React Components** - Interactive UI pages for browsing, learning, and tracking progress
4. **Gamification System** - XP, levels, badges, streaks, and leaderboards

---

## 📚 Database Architecture

### Core Course Hierarchy
```
Course (e.g., "JavaScript Complete")
  └── Module (e.g., "Fundamentals", "Advanced")
      └── Topic (e.g., "Variables", "Functions")
          └── Problem (e.g., "Variable Declaration Basics")
              └── TestCase (Input/Output pairs)
```

### Key Models

**Course**
- `slug`, `name`, `nameHi` (bilingual)
- `description`, `icon`, `color`
- `level` (beginner/intermediate/advanced)
- `totalXpReward`, `estimatedHours`

**CourseProblem**
- `slug`, `title`, `titleHi`
- `description`, `descriptionHi` (bilingual)
- `difficulty` (EASY/MEDIUM/HARD)
- `xpReward`, `timeComplexity`, `spaceComplexity`
- `hints` (array), `approach`, `approachHi`
- `testCases` (many-to-many with TestCase model)

**Progress Tracking** (3 levels)
- `UserCourseProgress` - Course-level completion (%)
- `UserCourseModuleProgress` - Module-level completion
- `UserCourseProblemProgress` - Individual problem attempts

**Gamification**
- `Badge` - Achievement definitions
- `UserBadge` - Earned badges with timestamps
- `CourseLeaderboard` - Per-course rankings
- `UserStats` - XP, level, streaks, total problems solved

---

## 🌐 API Endpoints

### Course Endpoints

#### Get All Courses
```
GET /api/courses?level=beginner
```
Returns paginated list of courses with user progress.

#### Get Course Details
```
GET /api/courses/javascript-complete
```
Returns complete course with all modules, topics, and problems.

#### Get Course Progress
```
GET /api/courses/javascript-complete/progress
Authentication: Required
```
Returns user's progress in the course.

### Problem Endpoints

#### Get Problem Details
```
GET /api/courses/javascript-complete/problems/js-var-basics
```
Returns problem with description, hints, test cases, approach, and user progress.

#### Submit Problem Solution
```
POST /api/courses/javascript-complete/problems/js-var-basics/submit
Authentication: Required

Body:
{
  "code": "const x = 5;",
  "language": "javascript"
}
```
Executes code against test cases and returns submission result.

### User Progress Endpoints

#### Get User Statistics
```
GET /api/user/stats
Authentication: Required
```
Response:
```json
{
  "totalXp": 1250,
  "level": 2,
  "nextLevelXp": 2000,
  "totalProblems": 15,
  "longestCodeStreak": 7,
  "totalTimeMin": 480
}
```

#### Get User Badges
```
GET /api/user/badges
Authentication: Required
```
Returns array of earned badges with name, icon, description, and XP reward.

### Leaderboard Endpoints

#### Global Leaderboard
```
GET /api/leaderboard/global?limit=50
```

#### Course Leaderboard
```
GET /api/courses/javascript-complete/leaderboard?limit=50
```

---

## 🎨 React Pages

### 1. Courses Page (`/courses`)
**File:** `client/src/pages/courses/index.tsx`

Features:
- Grid view of all courses
- Search and filter by difficulty level
- Progress visualization
- Course statistics (modules, topics, problems, XP, time)
- Click to navigate to course detail

**Styling:** `client/src/pages/styles/courses.css`

### 2. Course Detail Page (`/courses/:slug`)
**File:** `client/src/pages/courses/CourseDetail.tsx`

Features:
- Full course information with icon and theme color
- Expandable module sections
- Topic listing with difficulty and duration
- Progress bar showing completion %
- Start/Continue buttons for each topic
- Course statistics summary

**Styling:** `client/src/pages/styles/course-detail.css`

### 3. Problem Solver Page (`/courses/:courseSlug/problems/:problemSlug`)
**File:** `client/src/pages/courses/ProblemSolver.tsx`

Features:
- **Problem Panel** (left side)
  - Problem description (bilingual toggle)
  - Sample test cases with input/output
  - Hints with navigation (previous/next)
  - Solution approach with complexity analysis

- **Editor Panel** (right side)
  - Monaco code editor
  - Language selection (JavaScript/Python/Java)
  - Submit and Reset buttons
  - Submission result display
  - Attempt counter and solved status

**Styling:** `client/src/pages/styles/problem-solver.css`

**Dependencies:**
- `@monaco-editor/react` - Code editor component

### 4. Progress Dashboard (`/dashboard/progress`)
**File:** `client/src/pages/dashboard/ProgressDashboard.tsx`

Features:
- **Stats Cards**
  - Level and XP progress with visual bar
  - Total XP earned
  - Problems solved count
  - Courses started
  - Longest streak
  - Total study time

- **Badges Section**
  - Grid of earned badges
  - Badge name, description, XP reward
  - Earned date

- **Quick Actions**
  - Browse Courses
  - View Leaderboard
  - View Achievements

**Styling:** `client/src/pages/styles/dashboard.css`

### 5. Leaderboard Page (`/leaderboard` and `/leaderboard/:courseSlug`)
**File:** `client/src/pages/leaderboard/Leaderboard.tsx`

Features:
- Toggle between global and course-specific rankings
- **Your Rank Card** - Shows current user's rank and stats
- **Leaderboard Table**
  - Rank with medals (🥇🥈🥉) for top 3
  - User avatar and name
  - Level badge
  - Total XP (color-coded by amount)
  - Problems solved
  - Current streak
  - Badge count
  - Responsive table (mobile-friendly)

- **How Ranking Works** - Information section

**Styling:** `client/src/pages/styles/leaderboard.css`

---

## 🎨 Design System

### Color Scheme
```css
Primary: #f59e0b (Amber - Actions, highlights)
Background: #1a1a2e (Dark Navy)
Surface: #0f3460 (Darker Navy)
Accent: #f97316 (Orange gradient)
Success: #10b981 (Green)
Warning: #fbbf24 (Yellow)
Error: #ef4444 (Red)
Text Primary: #ffffff (White)
Text Secondary: #cbd5e0 (Light Gray)
Text Muted: #718096 (Darker Gray)
```

### Difficulty Colors
- **EASY**: #10b981 (Green)
- **MEDIUM**: #f59e0b (Amber)
- **HARD**: #ef4444 (Red)

### Typography
- Headers: Bold, size 1.2rem - 2.5rem
- Body: 0.95rem - 1rem, line-height 1.6
- Labels: 0.85rem - 0.9rem

### Spacing
- Grid gap: 1.5rem
- Padding: 1rem - 2rem
- Card border-radius: 8px - 12px

---

## 🔄 Data Flow

### Course Browsing
1. User visits `/courses`
2. CoursesPage fetches `GET /api/courses` with filters
3. Displays course cards with progress if user has started
4. Click card → navigate to `/courses/:slug`
5. CourseDetail fetches `GET /api/courses/:slug`
6. Shows modules, topics, and user progress

### Problem Solving
1. User clicks "Start" on a topic
2. Navigate to `/courses/:courseSlug/problems/:problemSlug`
3. ProblemSolver fetches problem details
4. User writes code and clicks "Submit"
5. POST `/api/courses/:courseSlug/problems/:problemSlug/submit`
6. Backend executes code against test cases
7. Display ACCEPTED/REJECTED result
8. Update user progress, XP, streaks, badges

### Progress Tracking
1. User progress tracked at 3 levels:
   - Problem level: Attempts, solved status, time spent
   - Module level: % problems solved
   - Course level: % problems solved, total XP earned
2. Updates trigger:
   - Level-up when XP crosses thresholds (1000 XP per level)
   - Badge awards for achievements
   - Streak updates (daily problem solving)
   - Leaderboard position updates

---

## 📝 Bilingual Support

All content supports English and Hindi (Hinglish):

```typescript
// Database fields
{
  name: "String in English",
  nameHi: "String in हिंदी"
}
```

### React Implementation
```typescript
const [language, setLanguage] = useState('en');
const text = language === 'hi' ? problem.descriptionHi : problem.description;
```

### Components with Language Toggle
- CoursesPage (course names)
- CourseDetail (module and course names)
- ProblemSolver (problem description and approach)

---

## 🎮 Gamification System

### XP & Levels
- Each problem has `xpReward` (varies by difficulty)
- User total XP determines level
- Progression: 1000 XP = 1 Level
- Displayed in dashboard and leaderboard

### Badges
**Built-in Badges:**
1. **First Step** 🌱 - Solve 1st problem (10 XP)
2. **Closure Master** 🔐 - Solve all closure problems (50 XP)
3. **Async Expert** ⚡ - Solve all async problems (50 XP)

### Streaks
- Track consecutive days of problem solving
- Reset if user misses a day
- Display on course detail and dashboard

### Leaderboards
- **Global** - All users by total XP
- **Per-Course** - Users by XP in specific course
- Ranking factors:
  1. Total XP (primary)
  2. Problems solved
  3. Badges earned
  4. Active streak

---

## 🛠️ Implementation Details

### API Integration Example
```typescript
// Fetch course data
const [course, setCourse] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`/api/courses/${courseSlug}`)
    .then(r => r.json())
    .then(data => setCourse(data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, [courseSlug]);
```

### Authentication
- All user-specific endpoints require Bearer token
- Token stored in `localStorage.getItem('token')`
- Header: `Authorization: Bearer ${token}`

### State Management
- Each page manages its own state with `useState`
- No global state management needed
- API calls on component mount with `useEffect`
- Error handling with try-catch

---

## 🚀 Getting Started

### Running the Platform

1. **Start Backend** (Express server)
```bash
cd server
npm run dev
```

2. **Start Frontend** (React dev server)
```bash
cd client
npm run dev
```

3. **Access**
```
http://localhost:5173/courses
```

### Creating Sample Data

Run the seed script to populate database with courses:
```bash
cd server
npx prisma db seed
```

This creates:
- 1 Course: "JavaScript Complete"
- 3 Modules: Fundamentals, Advanced, Practices
- 6 Topics with problems
- 3 Badges
- Test data for progression

---

## 📋 Seed Data

The `seedJavaScriptCourse()` function creates:

**Course**
- Name: JavaScript Complete Course
- Level: Beginner → Advanced progression
- 150 hours estimated
- 5000 total XP

**Modules**
1. **Module 1: Fundamentals** - Variables, scope
2. **Module 2: Advanced** - Closures, prototypes
3. **Module 3: Practices** - Design patterns, async

**Topics** (6 total)
- Variables & Scope (EASY, 10m)
- Functions (EASY, 15m)
- Async/Await (MEDIUM, 25m)
- Closures (MEDIUM, 20m)
- Prototypes (HARD, 30m)
- Design Patterns (HARD, 35m)

**Problems** (6 total)
- Variable Declaration (EASY, 50 XP)
- Function Parameters (EASY, 75 XP)
- Async Functions (MEDIUM, 150 XP)
- Closure Counter (MEDIUM, 175 XP)
- Prototype Chain (HARD, 250 XP)
- Observer Pattern (HARD, 300 XP)

**Badges**
- First Step (1st problem)
- Closure Master (all closure problems)
- Async Expert (all async problems)

---

## 📊 Performance Optimization

### Lazy Loading
- Course pages lazy-loaded with Suspense
- Monaco editor only loaded when problem page opens
- Images lazy-loaded in leaderboards

### Pagination
- Leaderboard supports limit/offset
- Courses can be paginated
- Default 50 entries per page

### Caching
- Course data cached until manual refresh
- User stats updated on each submission
- Progress bar cached until navigation away

---

## 🔒 Security Features

- Authentication required for:
  - Problem submissions
  - Progress viewing
  - Badge endpoints
  - User statistics

- No sensitive data in frontend state
- Token-based authentication
- Rate limiting on API (100 req/15min for unauthenticated)

---

## 🎯 Future Enhancements

Possible additions:
1. **Code Execution Service**
   - Real test case execution
   - Support for multiple languages
   - Timeout protection

2. **Real-time Features**
   - WebSocket for live leaderboard updates
   - Collaborative coding (pair programming)
   - Notifications for badges/achievements

3. **Advanced Analytics**
   - Time spent per problem
   - Success rate by difficulty
   - Learning path recommendations

4. **Social Features**
   - User profiles
   - Following other learners
   - Problem discussions/comments

5. **Content Expansion**
   - More courses (Python, React, etc.)
   - Video tutorials per topic
   - Community-contributed problems

---

## 📞 Support

For issues or questions:
1. Check API_ENDPOINTS.md for endpoint details
2. Review database schema in prisma/schema.prisma
3. Check component props and state structure
4. Review error messages in browser console

---

**Status**: ✅ Complete and Ready for Use
**Last Updated**: 2026-08-23
**Version**: 1.0.0
