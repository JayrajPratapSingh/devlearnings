import { api, qs, request } from './api';
import type {
  Bookmark,
  DailyChallenge,
  ExecutionResult,
  BookmarkKind,
  Dashboard,
  Difficulty,
  InterviewQuestion,
  Language,
  LearningStatus,
  MockInterview,
  MockResult,
  Note,
  Problem,
  ProblemListItem,
  ProblemProgress,
  ProblemStatus,
  ProgressDetail,
  RevisionItem,
  RunResult,
  SearchHit,
  SubmissionSummary,
  SubmitResult,
  Topic,
  TopicCategorySummary,
  TopicListItem,
  User,
} from '../types';

/** All server calls in one place — pages never build URLs themselves. */
export const endpoints = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      api.post<{ user: User; accessToken: string }>('/auth/register', body),
    login: (body: { email: string; password: string }) =>
      api.post<{ user: User; accessToken: string }>('/auth/login', body),
    logout: () => api.post<void>('/auth/logout'),
    me: () => api.get<{ user: User }>('/auth/me'),
    deleteAccount: (password: string) =>
      request<void>('/auth/me', { method: 'DELETE', body: { password } }),

    forgotPassword: (identifier: string) =>
      api.post<{
        sent: true;
        sentToMasked: string | null;
        channel: 'EMAIL' | 'SMS';
        expiresInMinutes: number;
        devCode?: string;
        devNote?: string;
      }>('/auth/password/forgot', { identifier }),

    resetPassword: (identifier: string, code: string, password: string) =>
      api.post<void>('/auth/password/reset', { identifier, code, password }),

    changePassword: (currentPassword: string, newPassword: string) =>
      api.post<void>('/auth/password/change', { currentPassword, newPassword }),

    setPhone: (phone: string | null) => api.patch<{ user: User }>('/auth/phone', { phone }),
  },

  topics: {
    categories: () => api.get<{ categories: TopicCategorySummary[] }>('/topics/categories'),
    byCategory: (slug: string) =>
      api.get<{ category: { slug: string; name: string; description: string; icon: string }; topics: TopicListItem[] }>(
        `/topics/categories/${slug}`,
      ),
    detail: (slug: string) => api.get<{ topic: Topic }>(`/topics/${slug}`),
    /** Resolves slugs to real titles — used where only a slug is known. */
    titles: (slugs: string[]) =>
      api.get<{ topics: { slug: string; title: string }[] }>(
        `/topics/titles?slugs=${encodeURIComponent(slugs.join(','))}`,
      ),
    setStatus: (slug: string, status: LearningStatus, confidence?: number) =>
      api.patch<{ slug: string; status: LearningStatus }>(`/topics/${slug}/status`, {
        status,
        ...(confidence !== undefined ? { confidence } : {}),
      }),
  },

  dsa: {
    list: (filter: { category?: string; difficulty?: Difficulty; status?: ProblemStatus; search?: string }) =>
      api.get<{ problems: ProblemListItem[]; stats: { total: number; solved: number; attempted: number } }>(
        `/dsa${qs(filter)}`,
      ),
    categories: () =>
      api.get<{ categories: { category: string; total: number; solved: number; percent: number }[] }>(
        '/dsa/categories',
      ),
    detail: (slug: string) =>
      api.get<{ problem: Problem; progress: ProblemProgress; submissions: SubmissionSummary[] }>(
        `/dsa/${slug}`,
      ),
    setStatus: (slug: string, status: ProblemStatus) =>
      api.patch<{ slug: string; status: ProblemStatus }>(`/dsa/${slug}/status`, { status }),
    daily: () => api.get<{ daily: DailyChallenge | null }>('/dsa/daily'),
  },

  code: {
    health: () => api.get<{ ok: boolean; sandbox: string }>('/code/health'),
    run: (slug: string, body: { language: Language; code: string; input?: string }) =>
      api.post<RunResult>(`/code/run/${slug}`, body),
    /** Free-form run for the scratchpad — not tied to any problem, nothing stored. */
    scratch: (body: { language: Language; code: string; input?: string }) =>
      api.post<ExecutionResult>('/code/run', body),
    submit: (slug: string, body: { language: Language; code: string }) =>
      api.post<SubmitResult>(`/code/submit/${slug}`, body),
  },

  questions: {
    categories: () =>
      api.get<{ categories: { category: string; total: number; known: number; percent: number }[] }>(
        '/questions/categories',
      ),
    list: (filter: { category?: string; difficulty?: Difficulty; status?: LearningStatus; search?: string }) =>
      api.get<{ questions: InterviewQuestion[] }>(`/questions${qs(filter)}`),
    setStatus: (id: string, status: LearningStatus) =>
      api.patch<{ questionId: string; status: LearningStatus }>(`/questions/${id}/status`, { status }),
  },

  notes: {
    list: (filter: { search?: string; topicId?: string; problemId?: string } = {}) =>
      api.get<{ notes: Note[] }>(`/notes${qs(filter)}`),
    create: (body: {
      title: string;
      content: string;
      topicId?: string | null;
      problemId?: string | null;
      questionId?: string | null;
      tags?: string[];
    }) => api.post<{ note: Note }>('/notes', body),
    update: (id: string, body: { title?: string; content?: string; tags?: string[] }) =>
      api.patch<{ note: Note }>(`/notes/${id}`, body),
    remove: (id: string) => api.delete<void>(`/notes/${id}`),
  },

  bookmarks: {
    list: (kind?: BookmarkKind) => api.get<{ bookmarks: Bookmark[] }>(`/bookmarks${qs({ kind })}`),
    toggle: (body: { kind: BookmarkKind; refId: string; label: string; href: string }) =>
      api.post<{ bookmarked: boolean }>('/bookmarks/toggle', body),
  },

  progress: {
    dashboard: () => api.get<Dashboard>('/progress/dashboard'),
    detail: () => api.get<ProgressDetail>('/progress'),
    heartbeat: (minutes: number) => api.post<void>('/progress/heartbeat', { minutes }),
  },

  revision: {
    due: () => api.get<{ items: RevisionItem[] }>('/revision/due'),
    grade: (id: string, grade: number) => api.post<unknown>(`/revision/${id}/grade`, { grade }),
    remove: (id: string) => api.delete<void>(`/revision/${id}`),
  },

  mock: {
    history: () =>
      api.get<{
        interviews: {
          id: string;
          title: string;
          status: string;
          score: number | null;
          totalScore: number | null;
          startedAt: string;
          finishedAt: string | null;
          weakTopics: string[];
        }[];
      }>('/mock-interview'),
    start: (body: { durationMin?: number; questionCount?: number; categories?: string[] }) =>
      api.post<MockInterview>('/mock-interview', body),
    answer: (id: string, questionId: string, selfScore: number) =>
      api.post<{ shortAnswer: string; selfScore: number }>(`/mock-interview/${id}/answer`, {
        questionId,
        selfScore,
      }),
    finish: (id: string) => api.post<MockResult>(`/mock-interview/${id}/finish`),
  },

  search: (q: string) => api.get<{ results: SearchHit[] }>(`/search${qs({ q })}`),
};
