export type Diff = 'EASY' | 'MEDIUM' | 'HARD';

export interface SeedTopic {
  slug: string;
  title: string;
  difficulty: Diff;
  summary: string;
  summaryHi: string;
  /** Markdown. Keep it tight — this is revision material, not a textbook. */
  content: string;
  contentHi: string;
  codeExample?: string;
  expectedOutput?: string;
  commonMistakes: string[];
  interviewQuestions: string[];
  practiceQuestions: string[];
  relatedProblemSlugs?: string[];
  tags: string[];
}

export interface SeedCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  group: 'core' | 'backend' | 'data' | 'practice';
  topics: SeedTopic[];
}
