/**
 * Course Detail — modules, topics, and progress for one course.
 *
 * Rewritten onto the shared design system (was standalone course-detail.css
 * with a hardcoded navy gradient — same disconnected-from-theme problem the
 * course list page had). Also fixes a real bug: progress was
 * `solvedProblems / totalProblems`, which is NaN for any course with zero
 * problems (every course except DSA, since they're lesson-based, not
 * problem-based) — the percent now guards against that, and the primary
 * stat switches to "Topics" for courses where "problems" isn't a real metric.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Clock, Flame, Star } from 'lucide-react';
import { usePreferences } from '../../hooks/usePreferences';
import { useStaggerIn } from '../../hooks/useStaggerIn';
import { Button, ErrorState, ProgressBar, cx } from '../../components/ui';
import { Skeleton } from '../../components/ui/Skeleton';
import { courseIcon } from './courseIcons';

interface Topic {
  id: string;
  slug: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  difficulty: string;
  duration: number;
  order: number;
  problems: { slug: string }[];
}

interface Module {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  description: string;
  order: number;
  topics: Topic[];
}

interface CourseData {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  description: string;
  icon: string;
  color: string;
  estimatedHours: number;
  totalXpReward: number;
  modules: Module[];
  userProgress?: {
    solvedProblems: number;
    totalProblems: number;
    totalXpEarned: number;
    currentStreak: number;
    completedAt?: string;
  };
}

const DIFFICULTY_TONE: Record<string, string> = {
  EASY: 'text-easy bg-easy/10 border-easy/25',
  MEDIUM: 'text-medium bg-medium/10 border-medium/25',
  HARD: 'text-hard bg-hard/10 border-hard/25',
  BEGINNER: 'text-easy bg-easy/10 border-easy/25',
  INTERMEDIATE: 'text-medium bg-medium/10 border-medium/25',
  ADVANCED: 'text-hard bg-hard/10 border-hard/25',
};

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const { t } = usePreferences();
  const rootRef = useStaggerIn<HTMLDivElement>([course]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${slug}`);
        if (!response.ok) {
          throw new Error(t("This course wandered off somewhere.", 'Ye course kahin bhatak gaya.'));
        }
        const data = (await response.json()) as CourseData;
        if (!cancelled) {
          setCourse(data);
          setError(null);
          setExpandedModule(data.modules[0]?.id ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : t('Could not load this course.', 'Ye course load nahi hua.'),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Skeleton className="h-4 w-24" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <Skeleton className="h-7 w-64" />
        </div>
        <Skeleton className="mt-6 h-24 w-full" />
        <Skeleton className="mt-4 h-16 w-full" />
        <Skeleton className="mt-2 h-16 w-full" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <ErrorState message={error ?? t('Course not found', 'Course nahi mila')} onRetry={() => navigate('/courses')} />
      </div>
    );
  }

  const progress = course.userProgress;
  // Real fix: totalProblems is legitimately 0 for lesson-based courses (every
  // course except DSA), so dividing by it unguarded produced NaN%. Falls back
  // to a "topics read" ratio for those courses instead of a fake 0/0.
  const totalTopics = course.modules.reduce((n, m) => n + m.topics.length, 0);
  const usesProblems = (progress?.totalProblems ?? 0) > 0;
  const percent = !progress
    ? 0
    : usesProblems
      ? Math.min(100, Math.round((progress.solvedProblems / progress.totalProblems) * 100))
      : totalTopics > 0
        ? Math.min(100, Math.round((progress.solvedProblems / totalTopics) * 100))
        : 0;

  return (
    <div ref={rootRef} className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <button
        onClick={() => navigate('/courses')}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-content-muted transition-colors hover:text-content"
      >
        ← {t('Back to courses', 'Courses par wapas')}
      </button>

      <div data-in className="card p-5">
        <div className="flex flex-wrap items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-[26px]"
            style={{
              color: course.color,
              backgroundColor: `${course.color}1a`,
              borderColor: `${course.color}40`,
            }}
          >
            {courseIcon(course.slug)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.015em] text-content sm:text-[28px]">
              {t(course.name, course.nameHi)}
            </h1>
            <p className="mt-1 text-sm text-content-muted">{course.description}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-line bg-surface-sunken px-3 py-2.5">
            <p className="text-[11px] text-content-subtle">
              {usesProblems ? t('Problems solved', 'Problems solve hue') : t('Topics covered', 'Topics cover hue')}
            </p>
            <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-content">
              {usesProblems ? `${progress?.solvedProblems ?? 0}/${progress?.totalProblems}` : `${progress?.solvedProblems ?? 0}/${totalTopics}`}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface-sunken px-3 py-2.5">
            <p className="text-[11px] text-content-subtle">{t('XP earned', 'XP mila')}</p>
            <p className="mt-0.5 flex items-center gap-1 font-mono text-lg font-semibold tabular-nums text-content">
              <Star size={14} className="text-medium" />
              {progress?.totalXpEarned ?? 0}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface-sunken px-3 py-2.5">
            <p className="text-[11px] text-content-subtle">{t('Streak', 'Streak')}</p>
            <p className="mt-0.5 flex items-center gap-1 font-mono text-lg font-semibold tabular-nums text-content">
              <Flame size={14} className="text-medium" />
              {progress?.currentStreak ?? 0}
            </p>
          </div>
        </div>

        {progress && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[12px]">
              <span className="text-content-muted">{t('Course progress', 'Course progress')}</span>
              <span className="font-mono tabular-nums text-content">{percent}%</span>
            </div>
            <ProgressBar percent={percent} tone={percent >= 70 ? 'easy' : percent >= 34 ? 'medium' : 'hard'} />
          </div>
        )}
      </div>

      <div data-in className="mt-6 flex items-center justify-between font-mono text-[11px] text-content-subtle">
        <span className="flex items-center gap-1.5">
          <Clock size={13} /> ~{course.estimatedHours}h
        </span>
        <span>{course.modules.length} {t('modules', 'modules')}</span>
        <span>{totalTopics} {t('topics', 'topics')}</span>
        <span className="flex items-center gap-1"><Star size={13} className="text-medium" /> {course.totalXpReward} XP</span>
      </div>

      <div className="mt-6 space-y-2">
        {course.modules.map((module, index) => {
          const open = expandedModule === module.id;
          return (
            <div key={module.id} data-in className="card overflow-hidden">
              <button
                onClick={() => setExpandedModule(open ? null : module.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-sunken/60"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-sunken font-mono text-[11px] font-semibold text-content-subtle">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-content">
                  {t(module.name, module.nameHi)}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-content-subtle">
                  {module.topics.length} {t('topics', 'topics')}
                </span>
                <ChevronDown
                  size={16}
                  className={cx('shrink-0 text-content-subtle transition-transform duration-200', open && 'rotate-180')}
                />
              </button>

              {open && (
                <div className="border-t border-line px-4 py-3">
                  {module.description && (
                    <p className="mb-3 text-[13px] leading-5 text-content-muted">{module.description}</p>
                  )}
                  <div className="divide-y divide-line">
                    {module.topics.map((topic) => (
                      <div key={topic.id} className="flex items-center gap-3 py-2.5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-medium text-content">
                            {t(topic.title, topic.titleHi)}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-content-subtle">
                            <span
                              className={cx(
                                'inline-flex h-4.5 items-center rounded border px-1.5 font-semibold uppercase tracking-wide',
                                DIFFICULTY_TONE[topic.difficulty?.toUpperCase()] ?? 'text-content-subtle bg-surface-sunken border-line',
                              )}
                            >
                              {topic.difficulty}
                            </span>
                            <span>{topic.duration}m</span>
                            {topic.problems?.length > 0 && (
                              <span>
                                {topic.problems.length} {t('practice', 'practice')}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/courses/${slug}/topics/${topic.slug}`)}
                        >
                          {t('Learn', 'Seekho')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
