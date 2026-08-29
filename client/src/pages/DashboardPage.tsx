import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { endpoints } from '../services/endpoints';
import {
  Button,
  DifficultyBadge,
  EmptyState,
  ErrorState,
  ProgressBar,
  SectionHeading,
  StatCard,
  cx,
} from '../components/ui';
import { CountUp, ProgressRing, StreakFlame } from '../components/ui/Motion';
import { SkeletonRows, SkeletonStats, Skeleton } from '../components/ui/Skeleton';
import type { Dashboard } from '../types';

/** 28-day activity strip. A bar chart would be heavier and say less. */
function ActivityStrip({ activity }: { activity: Dashboard['activity'] }) {
  const max = Math.max(1, ...activity.map((a) => a.problemsSolved + a.topicsRead));

  return (
    <div className="flex items-end gap-1" role="img" aria-label="Activity over the last 28 days">
      {activity.map((day) => {
        const total = day.problemsSolved + day.topicsRead;
        const height = total === 0 ? 4 : Math.max(8, Math.round((total / max) * 44));
        return (
          <div
            key={day.day}
            className={cx(
              'flex-1 rounded-sm transition-colors',
              total === 0 ? 'bg-surface-sunken' : 'bg-brand/70 hover:bg-brand',
            )}
            style={{ height }}
            title={`${day.day}: ${day.problemsSolved} solved, ${day.topicsRead} topics`}
          />
        );
      })}
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi(() => endpoints.progress.dashboard(), []);
  const { data: dailyData } = useApi(() => endpoints.dsa.daily(), []);
  const daily = dailyData?.daily ?? null;

  // Skeletons mirror the real layout, so nothing jumps when the data lands.
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-3 w-64" />
        <div className="mt-6">
          <SkeletonStats />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkeletonRows rows={8} />
          </div>
          <SkeletonRows rows={4} />
        </div>
      </div>
    );
  }
  if (error) return <div className="p-6"><ErrorState message={error} onRetry={reload} /></div>;
  if (!data) return null;

  const hasActivity = data.dsa.attempted > 0 || data.topics.completed > 0;

  // "Today's tasks" is derived, not stored — it always reflects current state.
  const tasks: { label: string; href: string; tone: 'hard' | 'medium' | 'brand' }[] = [];
  if (data.revisionDue > 0) {
    tasks.push({ label: `Revise ${data.revisionDue} item${data.revisionDue === 1 ? '' : 's'} due today`, href: '/revision', tone: 'hard' });
  }
  if (data.weakTopics.length > 0) {
    tasks.push({ label: `Strengthen ${data.weakTopics[0]!.name} — ${data.weakTopics[0]!.percent}% done`, href: `/topics/${data.weakTopics[0]!.slug}`, tone: 'medium' });
  }
  if (data.dsa.solved < data.dsa.total) {
    tasks.push({ label: 'Solve one more DSA problem', href: '/dsa', tone: 'brand' });
  }
  if (data.questions.known < data.questions.total) {
    tasks.push({ label: 'Test yourself with active recall', href: '/recall', tone: 'brand' });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Hero — the ring gives the headline number the weight it deserves */}
      <div className="card mb-6 flex flex-wrap items-center gap-5 p-5">
        <ProgressRing percent={data.overall} size={88} label="ready" />

        <div className="min-w-[180px] flex-1">
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">
            {user?.name ? `Hey ${user.name.split(' ')[0]}` : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-content-muted">
            {data.streak > 0
              ? `${data.streak}-day streak. Keep it going.`
              : 'Solve a problem or read a topic to start a streak.'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StreakFlame days={data.streak} />
            <span className="rounded-lg bg-surface-raised px-2.5 py-1.5 text-[13px] text-content-muted">
              <CountUp value={data.dsa.solved} className="font-mono font-semibold text-content" /> solved
            </span>
            {data.revisionDue > 0 && (
              <Link
                to="/revision"
                className="rounded-lg bg-hard/10 px-2.5 py-1.5 text-[13px] text-hard transition-colors hover:bg-hard/20"
              >
                <CountUp value={data.revisionDue} className="font-mono font-semibold" /> due today
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link to="/mock-interview">
            <Button size="sm">Mock interview</Button>
          </Link>
          <Link to="/dsa">
            <Button size="sm" variant="primary">
              Start solving
            </Button>
          </Link>
        </div>
      </div>

      {/* Daily challenge — the reason to open the app today rather than someday */}
      {daily && (
        <Link
          to={`/dsa/${daily.problem.slug}`}
          className={cx(
            'card mb-6 flex flex-wrap items-center gap-4 p-4 transition-colors',
            daily.solvedToday ? 'border-easy/40' : 'hover:border-brand/50',
          )}
        >
          <div
            className={cx(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg',
              daily.solvedToday ? 'bg-easy/15 text-easy' : 'bg-brand/15 text-brand',
            )}
            aria-hidden="true"
          >
            {daily.solvedToday ? '✓' : '◆'}
          </div>

          <div className="min-w-[200px] flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
              Today's challenge
            </p>
            <p className="mt-0.5 text-[15px] font-medium text-content">{daily.problem.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <DifficultyBadge level={daily.problem.difficulty} />
              <span className="text-[11px] text-content-subtle">{daily.problem.category}</span>
              {daily.solvedPreviously && !daily.solvedToday && (
                <span className="text-[11px] text-content-subtle">
                  solved before — do it again from memory
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            {daily.streak > 0 && (
              <p className="font-mono text-lg font-semibold tabular-nums text-medium">
                {daily.streak}🔥
              </p>
            )}
            <p className="text-[11px] text-content-subtle">
              {daily.solvedToday
                ? 'Done today'
                : daily.streak > 0
                  ? 'Keep the run alive'
                  : 'Start a run'}
            </p>
          </div>
        </Link>
      )}

      {/* Headline numbers */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="DSA solved"
          value={`${data.dsa.solved}/${data.dsa.total}`}
          percent={data.dsa.percent}
          tone="easy"
          hint={`${data.dsa.attempted} attempted`}
        />
        <StatCard
          label="Accuracy"
          value={`${data.accuracy}%`}
          percent={data.accuracy}
          tone={data.accuracy >= 70 ? 'easy' : data.accuracy >= 40 ? 'medium' : 'hard'}
          hint={`${data.totalSubmissions} submissions`}
        />
        <StatCard
          label="Topics known"
          value={`${data.topics.completed}/${data.topics.total}`}
          percent={data.topics.percent}
          hint={`${data.questions.known} questions known`}
        />
        <StatCard
          label="Longest streak"
          value={data.longestStreak}
          hint={`Current ${data.streak} day${data.streak === 1 ? '' : 's'}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Technology progress */}
          <section>
            <SectionHeading title="Progress by technology" />
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
                  <span className="w-16 shrink-0 text-right font-mono text-xs tabular-nums text-content-muted">
                    {cat.completed}/{cat.total}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Activity */}
          <section>
            <SectionHeading title="Last 28 days" />
            <div className="card p-4">
              <ActivityStrip activity={data.activity} />
              <div className="mt-2 flex justify-between text-[11px] text-content-subtle">
                <span>4 weeks ago</span>
                <span>Today</span>
              </div>
            </div>
          </section>

          {/* Recent submissions */}
          <section>
            <SectionHeading
              title="Recent submissions"
              action={
                <Link to="/progress" className="text-xs text-brand hover:underline">
                  View all
                </Link>
              }
            />
            {data.recentSubmissions.length === 0 ? (
              <EmptyState
                title="No submissions yet"
                description="Run and submit your first DSA solution to see results here."
                action={
                  <Link to="/dsa">
                    <Button size="sm" variant="primary">
                      Browse problems
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="card divide-y divide-line">
                {data.recentSubmissions.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/dsa/${sub.problem.slug}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-sunken/60"
                  >
                    <span
                      className={cx(
                        'h-2 w-2 shrink-0 rounded-full',
                        sub.status === 'ACCEPTED' ? 'bg-easy' : 'bg-hard',
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate text-[13px] text-content">
                      {sub.problem.title}
                    </span>
                    <DifficultyBadge level={sub.problem.difficulty} />
                    <span className="w-14 shrink-0 text-right font-mono text-xs tabular-nums text-content-muted">
                      {sub.passed}/{sub.total}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {/* Today's tasks */}
          <section>
            <SectionHeading title="Today" />
            <div className="card divide-y divide-line">
              {tasks.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-content-muted">
                  Everything is up to date. Nice.
                </p>
              ) : (
                tasks.map((task) => (
                  <Link
                    key={task.href + task.label}
                    to={task.href}
                    className="flex items-center gap-3 px-4 py-3 text-[13px] transition-colors hover:bg-surface-sunken/60"
                  >
                    <span
                      className={cx(
                        'h-1.5 w-1.5 shrink-0 rounded-full',
                        task.tone === 'hard' ? 'bg-hard' : task.tone === 'medium' ? 'bg-medium' : 'bg-brand',
                      )}
                    />
                    <span className="flex-1 text-content-muted">{task.label}</span>
                    <span className="text-content-subtle">→</span>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Weak areas */}
          <section>
            <SectionHeading title="Weak areas" />
            {data.weakTopics.length === 0 ? (
              <div className="card px-4 py-6 text-center text-sm text-content-muted">
                {hasActivity
                  ? 'No weak areas — everything is above a third complete.'
                  : 'Study a few topics and weak areas will appear here.'}
              </div>
            ) : (
              <div className="card divide-y divide-line">
                {data.weakTopics.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/topics/${cat.slug}`}
                    className="block px-4 py-3 transition-colors hover:bg-surface-sunken/60"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[13px] text-content">{cat.name}</span>
                      <span className="font-mono text-xs tabular-nums text-hard">{cat.percent}%</span>
                    </div>
                    <ProgressBar percent={cat.percent} tone="hard" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Secondary counters */}
          <section>
            <SectionHeading title="Coverage" />
            <div className="card space-y-3 p-4">
              {[
                { label: 'Topics known', value: `${data.topics.completed}/${data.topics.total}`, percent: data.topics.percent },
                { label: 'Questions known', value: `${data.questions.known}/${data.questions.total}`, percent: data.questions.percent },
                { label: 'Due for revision', value: String(data.revisionDue), percent: undefined },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="text-content-muted">{row.label}</span>
                    <span className="font-mono tabular-nums text-content">{row.value}</span>
                  </div>
                  {row.percent !== undefined && <ProgressBar percent={row.percent} />}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
