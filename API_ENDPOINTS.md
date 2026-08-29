# Course API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 📚 Course Endpoints

### Get All Courses
```
GET /courses
Query Parameters:
  - level?: "beginner" | "intermediate" | "advanced"
  - difficulty?: "EASY" | "MEDIUM" | "HARD"

Response: Array of courses with modules, topics, and problems
```

**Example:**
```bash
curl http://localhost:5000/api/courses?level=beginner
```

---

### Get Course Details
```
GET /courses/:slug
Path Parameters:
  - slug: Course slug (e.g., "javascript-complete")

Response: Course with all modules, topics, and user progress
```

**Example:**
```bash
curl http://localhost:5000/api/courses/javascript-complete
```

---

### Get Module Details
```
GET /courses/:courseSlug/modules/:moduleSlug
Path Parameters:
  - courseSlug: Course slug
  - moduleSlug: Module slug

Response: Module with topics, problems, and user progress
```

**Example:**
```bash
curl http://localhost:5000/api/courses/javascript-complete/modules/module-1-fundamentals
```

---

## 🎯 Problem Endpoints

### Get Problem Details
```
GET /courses/:courseSlug/problems/:problemSlug
Path Parameters:
  - courseSlug: Course slug
  - problemSlug: Problem slug

Response: Problem with description, hints, examples, test cases, and user progress
```

**Example:**
```bash
curl http://localhost:5000/api/courses/javascript-complete/problems/js-var-basics
```

---

### Submit Problem Solution
```
POST /courses/:courseSlug/problems/:problemSlug/submit
Authentication: Required (Bearer token)

Request Body:
{
  "code": "console.log('hello');",
  "language": "javascript"
}

Response: Submission record and updated progress
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/courses/javascript-complete/problems/js-var-basics/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const x = 5;",
    "language": "javascript"
  }'
```

---

## 👤 User Progress Endpoints

### Get Course Progress
```
GET /courses/:courseSlug/progress
Authentication: Required

Path Parameters:
  - courseSlug: Course slug

Response: User's progress in the course
```

**Example:**
```bash
curl http://localhost:5000/api/courses/javascript-complete/progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Get User Badges
```
GET /user/badges
Authentication: Required

Response: Array of earned badges with details
```

**Example:**
```bash
curl http://localhost:5000/api/user/badges \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Get User Statistics
```
GET /user/stats
Authentication: Required

Response: User's overall statistics (XP, level, problems solved, etc.)
```

**Example:**
```bash
curl http://localhost:5000/api/user/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🏆 Leaderboard Endpoints

### Get Course Leaderboard
```
GET /courses/:courseSlug/leaderboard
Query Parameters:
  - limit?: number (default: 10)
  - offset?: number (default: 0)

Path Parameters:
  - courseSlug: Course slug

Response: Array of top performers in the course
```

**Example:**
```bash
curl "http://localhost:5000/api/courses/javascript-complete/leaderboard?limit=20"
```

---

### Get Global Leaderboard
```
GET /leaderboard/global
Query Parameters:
  - limit?: number (default: 10)
  - offset?: number (default: 0)

Response: Array of top performers globally
```

**Example:**
```bash
curl "http://localhost:5000/api/leaderboard/global?limit=20"
```

---

## 🔍 Search Endpoints

### Search Courses
```
GET /courses/search
Query Parameters:
  - q: Search query (required)
  - difficulty?: "EASY" | "MEDIUM" | "HARD"
  - level?: "beginner" | "intermediate" | "advanced"

Response: Array of matching courses
```

**Example:**
```bash
curl "http://localhost:5000/api/courses/search?q=javascript&difficulty=EASY"
```

---

### Search Problems
```
GET /problems/search
Query Parameters:
  - q: Search query (required)
  - difficulty?: "EASY" | "MEDIUM" | "HARD"
  - category?: string

Response: Array of matching problems
```

**Example:**
```bash
curl "http://localhost:5000/api/problems/search?q=closure&difficulty=MEDIUM"
```

---

## 📊 Response Examples

### Course Response
```json
{
  "id": "cxxxx",
  "slug": "javascript-complete",
  "name": "JavaScript Complete Course",
  "nameHi": "JavaScript Complete Course - आपका सीखने का सफर",
  "description": "Comprehensive JavaScript learning...",
  "icon": "🚀",
  "color": "#F59E0B",
  "level": "beginner",
  "totalXpReward": 5000,
  "estimatedHours": 150,
  "modules": [
    {
      "id": "mxxxx",
      "slug": "module-1-fundamentals",
      "name": "Module 1: Fundamentals",
      "topics": [...]
    }
  ],
  "userProgress": {
    "solvedProblems": 3,
    "totalProblems": 6,
    "totalXpEarned": 225,
    "currentStreak": 5
  }
}
```

---

### Problem Response
```json
{
  "id": "pxxxx",
  "slug": "js-var-basics",
  "title": "Variable Declaration Basics",
  "description": "Declare and use variables...",
  "difficulty": "EASY",
  "xpReward": 50,
  "hints": [
    "Try using the right variable type",
    "Check the scope rules"
  ],
  "testCases": [
    {
      "input": "test input",
      "expectedOutput": "expected output",
      "isSample": true
    }
  ],
  "userProgress": {
    "status": "NOT_STARTED",
    "attempts": 0,
    "solved": false,
    "hintsUsed": 0
  }
}
```

---

### User Stats Response
```json
{
  "id": "uxxxx",
  "userId": "user123",
  "totalXp": 1250,
  "level": 2,
  "nextLevelXp": 2000,
  "totalProblems": 15,
  "totalCourses": 2,
  "longestCodeStreak": 7,
  "totalTimeMin": 480
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Code and language are required",
  "code": 400
}
```

### 404 Not Found
```json
{
  "error": "Course not found",
  "code": 404
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "code": 401
}
```

---

## Authentication

All authenticated endpoints require a Bearer token in the `Authorization` header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

Get token from `/auth/login` or `/auth/register` endpoints.

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Authenticated users: 1000 requests per 15 minutes per user

---

## Pagination

Endpoints with `limit` and `offset` support pagination:

```bash
# Get 20 courses, skip first 40
curl "http://localhost:5000/api/courses?limit=20&offset=40"
```

---

## Testing

### Using cURL
```bash
# Get all courses
curl http://localhost:5000/api/courses

# Get course details
curl http://localhost:5000/api/courses/javascript-complete

# Submit solution (requires auth)
curl -X POST http://localhost:5000/api/courses/javascript-complete/problems/js-var-basics/submit \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "const x = 5;", "language": "javascript"}'
```

### Using Postman
1. Import these endpoints into Postman
2. Set environment variable: `BASE_URL = http://localhost:5000/api`
3. Set variable: `TOKEN = your_jwt_token`
4. Use `{{BASE_URL}}` and `Authorization: Bearer {{TOKEN}}` in requests

---

## Integration with Frontend

### React Hook Example
```typescript
// useCourseFetch.ts
import { useEffect, useState } from 'react';

export function useCourse(courseSlug: string) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/courses/${courseSlug}`)
      .then(r => r.json())
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [courseSlug]);

  return { course, loading, error };
}
```

---

## Service Functions

The `CourseService` class provides business logic for:
- `getAllCourses()` - Get courses with filtering
- `getCourseBySlug()` - Get single course details
- `getUserCourseProgress()` - Get user progress
- `getProblemDetails()` - Get problem with test cases
- `submitSolution()` - Submit and evaluate solution
- `updateProblemProgress()` - Update progress after solving
- `useHint()` - Use hint for problem
- `getUserBadges()` - Get user's earned badges
- `awardBadge()` - Award badge to user
- `getUserStats()` - Get user statistics
- `updateUserStats()` - Update XP and level
- `getCourseLeaderboard()` - Get course rankings
- `getGlobalLeaderboard()` - Get global rankings
- `searchCourses()` - Search courses
- `searchProblems()` - Search problems

---

## Next Steps

1. ✅ API Routes Created
2. ⏳ Frontend Components (Next)
3. ⏳ Code Execution Service (For testing solutions)
4. ⏳ WebSocket for real-time updates
5. ⏳ Email notifications for milestones

---

**Last Updated**: 2026-08-23
**Status**: Ready for Frontend Integration
