export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ProblemStatus = 'NOT_STARTED' | 'ATTEMPTED' | 'SOLVED' | 'NEEDS_REVISION';
export type LearningStatus = 'NEW' | 'LEARNING' | 'KNOWN' | 'NEEDS_REVISION';
export type Language = 'JAVASCRIPT' | 'NODEJS' | 'PYTHON';
export type BookmarkKind = 'TOPIC' | 'QUESTION' | 'PROBLEM';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
  currentStreak: number;
  longestStreak?: number;
  /** Optional recovery number, E.164. Only used for password reset. */
  phone?: string | null;
}

export interface TopicCategorySummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  group: string;
  order: number;
  totalTopics: number;
  completedTopics: number;
  percent: number;
}

export interface TopicListItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  summaryHi: string | null;
  difficulty: Difficulty;
  order: number;
  tags: string[];
  status: LearningStatus;
  confidence: number;
  hasSimple?: boolean;
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  summary: string;
  summaryHi: string | null;
  content: string;
  contentHi: string | null;
  /** Beginner-level explanation. Null when not written yet. */
  simple: string | null;
  simpleHi: string | null;
  /** Mnemonics and memory hooks — a third view alongside simple and deep. */
  tricks: string | null;
  tricksHi: string | null;
  codeExample: string | null;
  expectedOutput: string | null;
  commonMistakes: string[];
  interviewQuestions: string[];
  practiceQuestions: string[];
  relatedProblemSlugs: string[];
  tags: string[];
  status: LearningStatus;
  confidence: number;
  category: { slug: string; name: string };
}

export interface ProblemListItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  order: number;
  status: ProblemStatus;
  attempts: number;
  solved: boolean;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  description: string;
  descriptionHi: string | null;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  approach: string;
  approachHi: string | null;
  timeComplexity: string;
  spaceComplexity: string;
  solutionExplanation: string;
  solutionExplanationHi: string | null;
  starterCode: Partial<Record<Language, string>>;
  solutions: Partial<Record<Language, string>> | null;
  supportedLanguages: Language[];
  sampleTestCases: { id: string; input: string; expectedOutput: string }[];
}

export interface ProblemProgress {
  status: ProblemStatus;
  attempts: number;
  solved: boolean;
  bestTimeMs: number | null;
  lastCode: Partial<Record<Language, string>>;
}

export interface SubmissionSummary {
  id: string;
  language: Language;
  status: string;
  passed: number;
  total: number;
  runtimeMs: number | null;
  memoryKb: number | null;
  createdAt: string;
}

export interface ExecutionResult {
  status: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTime: number;
  memoryUsage: number;
  truncated: boolean;
}

export interface TestCaseResult {
  index: number;
  hidden: boolean;
  passed: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  stderr?: string;
  executionTime: number;
  memoryUsage: number;
}

export interface RunResult {
  results: TestCaseResult[];
  passed: number;
  total: number;
}

export interface SubmitResult {
  status: string;
  passed: number;
  total: number;
  wrongAnswers: number;
  runtimeMs: number;
  memoryKb: number;
  errorMessage: string | null;
  results: TestCaseResult[];
}

export interface InterviewQuestion {
  id: string;
  slug: string;
  category: string;
  question: string;
  shortAnswer: string;
  shortAnswerHi: string | null;
  detailedAnswer: string;
  detailedAnswerHi: string | null;
  codeExample: string | null;
  followUps: string[];
  difficulty: Difficulty;
  tags: string[];
  status: LearningStatus;
  timesSeen: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  topicId: string | null;
  problemId: string | null;
  questionId: string | null;
  createdAt: string;
  updatedAt: string;
  topic?: { slug: string; title: string } | null;
  problem?: { slug: string; title: string } | null;
}

export interface Bookmark {
  id: string;
  kind: BookmarkKind;
  refId: string;
  label: string;
  href: string;
  createdAt: string;
}

export interface CategoryProgress {
  slug: string;
  name: string;
  total: number;
  completed: number;
  percent: number;
}

export interface Dashboard {
  overall: number;
  streak: number;
  longestStreak: number;
  dsa: { solved: number; attempted: number; total: number; percent: number };
  topics: { completed: number; total: number; percent: number };
  questions: { known: number; total: number; percent: number };
  accuracy: number;
  totalSubmissions: number;
  revisionDue: number;
  byCategory: CategoryProgress[];
  weakTopics: CategoryProgress[];
  activity: { day: string; problemsSolved: number; topicsRead: number; minutes: number }[];
  recentSubmissions: {
    id: string;
    status: string;
    language: Language;
    passed: number;
    total: number;
    createdAt: string;
    problem: { slug: string; title: string; difficulty: Difficulty };
  }[];
}

export interface ProgressDetail extends Dashboard {
  difficulty: { difficulty: Difficulty; total: number; solved: number }[];
  /** Sparse — only days with activity. The heatmap fills the gaps. */
  yearActivity: { day: string; problemsSolved: number; topicsRead: number; minutes: number }[];
  mockInterviews: {
    id: string;
    title: string;
    score: number | null;
    totalScore: number | null;
    startedAt: string;
  }[];
}

export interface RevisionItem {
  id: string;
  reason: string;
  dueAt: string;
  repetitions: number;
  intervalDays: number;
  kind: 'TOPIC' | 'PROBLEM' | 'QUESTION';
  topic: { slug: string; title: string; summary: string; summaryHi: string | null } | null;
  problem: { slug: string; title: string; difficulty: Difficulty; category: string } | null;
}

export interface MockQuestion {
  id: string;
  order: number;
  category: string;
  prompt: string;
}

export interface MockInterview {
  id: string;
  title: string;
  durationMin: number;
  startedAt: string;
  questions: MockQuestion[];
}

export interface MockResult {
  id: string;
  score: number;
  totalScore: number;
  percent: number;
  weakTopics: string[];
  correct: number;
  partial: number;
  wrong: number;
  retry: { id: string; prompt: string; category: string; shortAnswer: string }[];
}

export interface DailyChallenge {
  day: string;
  problem: { slug: string; title: string; category: string; difficulty: Difficulty };
  solvedToday: boolean;
  solvedPreviously: boolean;
  attempts: number;
  streak: number;
}

export interface SearchHit {
  type: 'topic' | 'problem' | 'question' | 'note';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}
