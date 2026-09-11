/**
 * Courses Page — every learning path, as a grid of real-icon cards.
 *
 * Rewritten onto the shared design system (was a standalone courses.css with
 * hardcoded colors, disconnected from the app's theme tokens — it never
 * re-themed with the rest of the app). Icons are real brand marks (react-icons/si)
 * or a purposeful generic icon (lucide-react) for the courses that cover more
 * than one technology, not emoji.
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SiDjango,
  SiJavascript,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTypescript,
} from 'react-icons/si';
import { ArrowUpRight, Database, Infinity as InfinityIcon, Palette, Puzzle } from 'lucide-react';
import { Button, EmptyState, ErrorState, ProgressBar, cx } from '../../components/ui';
import { Skeleton } from '../../components/ui/Skeleton';
import { useStaggerIn } from '../../hooks/useStaggerIn';
import { usePreferences } from '../../hooks/usePreferences';

interface Course {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  description: string;
  icon: string;
  color: string;
  level: string;
  totalXpReward: number;
  estimatedHours: number;
  stats: {
    modulesCount: number;
    topicsCount: number;
    problemsCount: number;
    userProgress?: {
      solvedProblems: number;
      totalXpEarned: number;
      completedAt?: string;
    };
  };
}

/**
 * Real marks, not emoji. Brand logos where the course teaches one specific
 * technology; a purposeful generic icon where it deliberately spans several
 * (Databases covers Postgres/Mongo/Redis/SQLite — no single logo is honest;
 * DevOps is a discipline, not a product).
 */
const COURSE_ICON: Record<string, ReactNode> = {
  'javascript-complete': <SiJavascript />,
  'css-html-complete': <Palette />,
  'typescript-complete': <SiTypescript />,
  'react-complete': <SiReact />,
  'node-complete': <SiNodedotjs />,
  'dsa-complete': <Puzzle />,
  'python-complete': <SiPython />,
  'django-complete': <SiDjango />,
  'databases-complete': <Database />,
  'devops-complete': <InfinityIcon />,
};

const LEVEL_TONE: Record<string, { en: string; hi: string; cls: string }> = {
  beginner: { en: 'Beginner', hi: 'Shuruaati', cls: 'text-easy bg-easy/10 border-easy/25' },
  intermediate: { en: 'Intermediate', hi: 'Darmiyana', cls: 'text-medium bg-medium/10 border-medium/25' },
  advanced: { en: 'Advanced', hi: 'Advanced', cls: 'text-hard bg-hard/10 border-hard/25' },
};

const FILTERS = ['all', 'beginner', 'intermediate', 'advanced'] as const;
type FilterLevel = (typeof FILTERS)[number];
const FILTER_LABEL: Record<FilterLevel, { en: string; hi: string }> = {
  all: { en: 'All', hi: 'Sab' },
  beginner: { en: 'Beginner', hi: 'Shuruaati' },
  intermediate: { en: 'Intermediate', hi: 'Darmiyana' },
  advanced: { en: 'Advanced', hi: 'Advanced' },
};

function CourseCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-4/5" />
      <Skeleton className="mt-5 h-8 w-full" />
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const { t } = usePreferences();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterLevel>('all');
  const [search, setSearch] = useState('');
  const gridRef = useStaggerIn<HTMLDivElement>([courses, loading]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const url = new URL('/api/courses', window.location.origin);
        if (filter !== 'all') url.searchParams.set('level', filter);
        const response = await fetch(url);
        if (!response.ok) throw new Error(t('The course list took a wrong turn.', 'Course list rasta bhatak gayi.'));
        const data = (await response.json()) as Course[];
        if (!cancelled) {
          setCourses(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : t('Could not load the courses — probably not your fault.', 'Courses load nahi hue — shayad tumhari galti nahi hai.'),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const filtered = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase()),
      ),
    [courses, search],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.015em] text-content sm:text-[32px]">
          {t('Learning paths', 'Learning paths')}
        </h1>
        <p className="mt-2 text-sm text-content-muted">
          {t(
            'Structured courses, module by module — pick one and keep going where you left off.',
            'Structured courses, module by module — ek chuno aur wahin se aage badho jahan chhoda tha.',
          )}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-subtle"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder={t('Search courses…', 'Courses dhoondo…')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-line bg-surface-raised pl-9 pr-3 text-[13px] text-content placeholder:text-content-subtle focus:border-brand/60 focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5">
          {FILTERS.map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={cx(
                'rounded-lg px-3 py-1.5 text-[13px] font-medium capitalize transition-colors',
                filter === level
                  ? 'bg-brand text-surface'
                  : 'bg-surface-raised text-content-muted hover:text-content',
              )}
            >
              {t(FILTER_LABEL[level].en, FILTER_LABEL[level].hi)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => setFilter((f) => f)} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('Nothing matches that — yet', 'Abhi kuch match nahi hua')}
          description={t(
            'Every course worth taking is hiding somewhere in here. Try a shorter search, or clear the filter.',
            'Har achha course yahin kahin chhupa baitha hai. Search chhota karo, ya filter hata do.',
          )}
        />
      ) : (
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const level = LEVEL_TONE[course.level] ?? LEVEL_TONE.beginner!;
            const progress = course.stats.userProgress;
            const percent = progress
              ? Math.min(100, Math.round((progress.solvedProblems / Math.max(1, course.stats.problemsCount)) * 100))
              : 0;
            const icon = COURSE_ICON[course.slug] ?? <Puzzle />;

            return (
              <div
                key={course.id}
                data-in
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/courses/${course.slug}`)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/courses/${course.slug}`)}
                className="card card-interactive group relative flex cursor-pointer flex-col overflow-hidden p-5"
              >
                {/* Hover affordance — a corner arrow is the smallest possible
                    "this card navigates" signal, and it costs nothing at rest. */}
                <ArrowUpRight
                  size={16}
                  className="absolute right-4 top-4 -translate-y-1 text-content-subtle opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                />

                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-[22px] transition-transform duration-300 ease-smooth group-hover:scale-105 group-hover:-rotate-3"
                    style={{
                      color: course.color,
                      backgroundColor: `${course.color}1a`,
                      borderColor: `${course.color}40`,
                    }}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1 pr-5">
                    <h2 className="truncate text-[15px] font-semibold text-content">
                      {t(course.name, course.nameHi)}
                    </h2>
                    <span
                      className={cx(
                        'mt-1 inline-flex h-5 items-center rounded-md border px-1.5 text-[10px] font-semibold uppercase tracking-wide',
                        level.cls,
                      )}
                    >
                      {t(level.en, level.hi)}
                    </span>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-[13px] leading-5 text-content-muted">
                  {course.description}
                </p>

                <div className="mt-4 flex items-center gap-4 font-mono text-[11px] text-content-subtle">
                  <span>{course.stats.modulesCount} {t('modules', 'modules')}</span>
                  <span>{course.stats.topicsCount} {t('topics', 'topics')}</span>
                  <span>~{course.estimatedHours}h</span>
                </div>

                {progress && (
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className="text-content-muted">{t('Progress', 'Progress')}</span>
                      <span className="font-mono tabular-nums text-content">{percent}%</span>
                    </div>
                    <ProgressBar percent={percent} tone={percent >= 70 ? 'easy' : percent >= 34 ? 'medium' : 'hard'} />
                  </div>
                )}

                {/* Hover action bar — slides up from the card's own bottom
                    edge rather than appearing as a separate floating layer,
                    so it reads as part of the card, not an overlay on top of it. */}
                <div className="relative mt-4 h-9 overflow-hidden">
                  <div className="absolute inset-0 flex translate-y-full items-center gap-2 transition-transform duration-200 ease-smooth group-hover:translate-y-0">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/courses/${course.slug}`);
                      }}
                    >
                      {progress ? t('Continue', 'Aage badho') : t('Start course', 'Course shuru karo')}
                    </Button>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-between text-[11px] text-content-subtle transition-opacity duration-150 group-hover:opacity-0">
                    <span>{course.stats.problemsCount} {t('problems', 'problems')}</span>
                    <span className="font-mono">{course.totalXpReward} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
