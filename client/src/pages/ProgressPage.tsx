import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { YearHeatmap } from '../components/YearHeatmap';
import { ShareCard } from '../components/ShareCard';
import { endpoints } from '../services/endpoints';
import {
  Button,
  DifficultyBadge,
  EmptyState,
  ErrorState,
  LoadingState,
  ProgressBar,
  SectionHeading,
  StatCard,
  cx,
} from '../components/ui';

export function ProgressPage() {
  const { user } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const { data, loading, error, reload } = useApi(() => endpoints.progress.detail(), []);

  if (loading) return <LoadingState label="Loading progress" />;
  if (error) return <div className="p-6"><ErrorState message={error} onRetry={reload} /></div>;
  if (!data) return null;

  const totalMinutes = data.activity.reduce((sum, day) => sum + day.minutes, 0);
  const activeDays = data.activity.filter((d) => d.problemsSolved + d.topicsRead > 0).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">Progress</h1>
          <p className="mt-1 text-sm text-content-muted">
            Where you actually stand, and what is worth your next hour.
          </p>
        </div>
        <Button size="sm" onClick={() => setShareOpen(true)}>
          Share progress
        </Button>
      </div>

      <ShareCard
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        stats={{
          name: user?.name?.split(' ')[0] ?? 'You',
          overall: data.overall,
          solved: data.dsa.solved,
          totalProblems: data.dsa.total,
          topicsKnown: data.topics.completed,
          accuracy: data.accuracy,
          streak: data.streak,
          longestStreak: data.longestStreak,
        }}
      />

      {/* A year of activity — the 28-day strip answers "am I going right now";
          this answers "have I been consistent". */}
      <section className="mb-6">
        <SectionHeading title="This year" />
        <div className="card p-4">
          <YearHeatmap activity={data.yearActivity} />
        </div>
      </section>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Overall" value={`${data.overall}%`} percent={data.overall} />
        <StatCard label="Accuracy" value={`${data.accuracy}%`} percent={data.accuracy} tone={data.accuracy >= 70 ? 'easy' : 'medium'} />
        <StatCard label="Active days" value={`${activeDays}/28`} hint={`${totalMinutes} min tracked`} />
        <StatCard label="Longest streak" value={data.longestStreak} hint={`Current ${data.streak}`} />
      </div>

      {/* DSA by difficulty */}
      <section className="mb-6">
        <SectionHeading title="DSA by difficulty" />
        <div className="card grid gap-4 p-4 sm:grid-cols-3">
          {data.difficulty.map((row) => {
            const percent = row.total ? Math.round((row.solved / row.total) * 100) : 0;
            const tone = row.difficulty === 'EASY' ? 'easy' : row.difficulty === 'MEDIUM' ? 'medium' : 'hard';
            return (
              <div key={row.difficulty}>
                <div className="mb-2 flex items-center justify-between">
                  <DifficultyBadge level={row.difficulty} />
                  <span className="font-mono text-[13px] tabular-nums text-content">
                    {row.solved}/{row.total}
                  </span>
                </div>
                <ProgressBar percent={percent} tone={tone} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology breakdown */}
      <section className="mb-6">
        <SectionHeading title="Technology coverage" />
        <div className="card divide-y divide-line">
          {data.byCategory.map((cat) => (
            <Link
              key={cat.slug}
              to={`/topics/${cat.slug}`}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-sunken/60"
            >
              <span className="w-40 shrink-0 truncate text-[13px] text-content">{cat.name}</span>
              <ProgressBar
                percent={cat.percent}
                tone={cat.percent >= 70 ? 'easy' : cat.percent >= 34 ? 'medium' : 'hard'}
              />
              <span className="w-20 shrink-0 text-right font-mono text-xs tabular-nums text-content-muted">
                {cat.completed}/{cat.total} · {cat.percent}%
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Weak areas */}
      <section className="mb-6">
        <SectionHeading title="Revision priorities" />
        {data.weakTopics.length === 0 ? (
          <div className="card px-4 py-6 text-center text-sm text-content-muted">
            No weak areas right now.
          </div>
        ) : (
          <div className="space-y-2">
            {data.weakTopics.map((cat, index) => (
              <Link
                key={cat.slug}
                to={`/topics/${cat.slug}`}
                className="card flex items-center gap-3 p-3 transition-colors hover:border-content-subtle"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hard/10 font-mono text-[11px] font-semibold text-hard">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] text-content">{cat.name}</span>
                  <span className="block text-[11px] text-content-subtle">
                    {cat.completed} of {cat.total} topics known
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[13px] tabular-nums text-hard">{cat.percent}%</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Mock interview history */}
      <section>
        <SectionHeading title="Mock interview scores" />
        {data.mockInterviews.length === 0 ? (
          <EmptyState
            title="No completed interviews"
            description="Finish a mock interview to start tracking scores over time."
          />
        ) : (
          <div className="card divide-y divide-line">
            {data.mockInterviews.map((mock) => {
              const percent =
                mock.score !== null && mock.totalScore
                  ? Math.round((mock.score / mock.totalScore) * 100)
                  : 0;
              return (
                <div key={mock.id} className="flex items-center gap-4 px-4 py-3">
                  <span className="w-28 shrink-0 text-[13px] text-content-muted">
                    {new Date(mock.startedAt).toLocaleDateString()}
                  </span>
                  <ProgressBar
                    percent={percent}
                    tone={percent >= 75 ? 'easy' : percent >= 45 ? 'medium' : 'hard'}
                  />
                  <span
                    className={cx(
                      'w-16 shrink-0 text-right font-mono text-[13px] tabular-nums',
                      percent >= 75 ? 'text-easy' : percent >= 45 ? 'text-medium' : 'text-hard',
                    )}
                  >
                    {mock.score}/{mock.totalScore}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
