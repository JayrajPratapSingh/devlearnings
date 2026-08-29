import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { usePreferences } from '../hooks/usePreferences';
import { endpoints } from '../services/endpoints';
import {
  Button,
  DifficultyBadge,
  EmptyState,
  ErrorState,
  cx,
} from '../components/ui';
import { SkeletonCards } from '../components/ui/Skeleton';
import { Stagger } from '../components/motion';

/**
 * SM-2 grades, phrased the way a person actually thinks about recall rather
 * than as numbers. The grade drives how far out the next review is scheduled.
 */
const GRADES = [
  { grade: 1, label: 'Forgot', variant: 'danger' as const, hint: 'shows again tomorrow' },
  { grade: 3, label: 'Shaky', variant: 'secondary' as const, hint: 'shows again soon' },
  { grade: 5, label: 'Solid', variant: 'success' as const, hint: 'pushed further out' },
];

export function RevisionPage() {
  const { t } = usePreferences();
  const { data, loading, error, reload, setData } = useApi(() => endpoints.revision.due(), []);
  const [busy, setBusy] = useState<string | null>(null);

  const grade = async (id: string, value: number) => {
    setBusy(id);
    // Remove locally so the queue visibly shrinks as the user works through it.
    setData((current) => (current ? { items: current.items.filter((i) => i.id !== id) } : current));
    try {
      await endpoints.revision.grade(id, value);
    } catch {
      reload();
    } finally {
      setBusy(null);
    }
  };

  const dismiss = async (id: string) => {
    setBusy(id);
    setData((current) => (current ? { items: current.items.filter((i) => i.id !== id) } : current));
    try {
      await endpoints.revision.remove(id);
    } catch {
      reload();
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <SkeletonCards count={4} />
      </div>
    );
  }
  if (error) return <div className="p-6"><ErrorState message={error} onRetry={reload} /></div>;

  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">Revise Today</h1>
        <p className="mt-1 text-sm text-content-muted">
          Built from what you got wrong, flagged, or have not seen in a while. Grading an item schedules
          the next review automatically.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Nothing due right now"
          description="Items land here when you fail a submission, flag a topic, or miss a mock interview question."
          action={
            <div className="flex gap-2">
              <Link to="/dsa">
                <Button size="sm" variant="primary">
                  Solve a problem
                </Button>
              </Link>
              <Link to="/questions">
                <Button size="sm">Run through questions</Button>
              </Link>
            </div>
          }
        />
      ) : (
        <>
          <p className="mb-3 text-[13px] text-content-muted">
            <span className="font-mono font-semibold text-content">{items.length}</span> item
            {items.length === 1 ? '' : 's'} due
          </p>

          <Stagger className="space-y-2">
            {items.map((item) => {
              const href = item.topic
                ? `/topic/${item.topic.slug}`
                : item.problem
                  ? `/dsa/${item.problem.slug}`
                  : '/questions';
              const title = item.topic?.title ?? item.problem?.title ?? 'Interview question';

              return (
                <div
                  key={item.id}
                  className={cx('card animate-fade-up p-4 transition-opacity', busy === item.id && 'opacity-50')}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-surface-sunken px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-content-subtle">
                      {item.kind}
                    </span>
                    {item.problem && <DifficultyBadge level={item.problem.difficulty} />}
                    {item.repetitions > 0 && (
                      <span className="text-[11px] text-content-subtle">
                        reviewed {item.repetitions}× · next gap {item.intervalDays}d
                      </span>
                    )}
                  </div>

                  <Link to={href} className="text-[15px] font-medium text-content hover:text-brand">
                    {title}
                  </Link>

                  {item.topic?.summary && (
                    <p className="mt-1 text-[13px] leading-6 text-content-muted">
                      {t(item.topic.summary, item.topic.summaryHi)}
                    </p>
                  )}

                  <p className="mt-2 text-[12px] text-content-subtle">{item.reason}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                    <span className="text-[12px] text-content-subtle">How well did you recall it?</span>
                    {GRADES.map((g) => (
                      <Button
                        key={g.grade}
                        size="sm"
                        variant={g.variant}
                        onClick={() => void grade(item.id, g.grade)}
                        disabled={busy === item.id}
                        title={g.hint}
                      >
                        {g.label}
                      </Button>
                    ))}
                    <button
                      onClick={() => void dismiss(item.id)}
                      disabled={busy === item.id}
                      className="ml-auto text-[12px] text-content-subtle transition-colors hover:text-hard"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </Stagger>
        </>
      )}
    </div>
  );
}
