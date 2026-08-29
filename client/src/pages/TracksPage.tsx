import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { endpoints } from '../services/endpoints';
import { TRACKS, trackBySlug, type Track, type TrackDay } from '../data/tracks';
import { Button, ProgressBar, cx } from '../components/ui';
import { SkeletonCards } from '../components/ui/Skeleton';

const START_KEY = 'devprep:track-start';

/**
 * Interview tracks.
 *
 * Progress is *derived* from what you have already marked known or solved
 * elsewhere — a track never stores its own copy. That means starting a track
 * halfway through your preparation immediately shows the days you have already
 * covered, and it can never disagree with the rest of the app.
 *
 * The only thing stored locally is which track you picked and when you started,
 * so "Day 6" means something.
 */
export function TracksPage() {
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState<string | null>(params.get('track'));

  const { data: problemData, loading: problemsLoading } = useApi(
    () => endpoints.dsa.list({}),
    [],
  );

  // Solved problems are the source of truth for track progress. Topics are not
  // used here on purpose: "read a topic" is a self-report, so ticking a day off
  // for it would make the plan look further along than it is.
  const solvedProblems = useMemo(
    () => new Set((problemData?.problems ?? []).filter((p) => p.solved).map((p) => p.slug)),
    [problemData],
  );

  const problemTitles = useMemo(
    () => new Map((problemData?.problems ?? []).map((p) => [p.slug, p.title])),
    [problemData],
  );

  const track = active ? trackBySlug(active) : null;

  // Tracks store only slugs, so labels have to be resolved. Deriving them from
  // the slug gives "vs sql"; the real titles come from the API in one call.
  const topicSlugs = useMemo(
    () => (track ? [...new Set(track.plan.flatMap((d) => d.topics ?? []))] : []),
    [track],
  );
  const { data: titleData } = useApi(
    () => (topicSlugs.length ? endpoints.topics.titles(topicSlugs) : Promise.resolve({ topics: [] })),
    [topicSlugs.join(',')],
  );
  const topicTitles = useMemo(
    () => new Map((titleData?.topics ?? []).map((t) => [t.slug, t.title])),
    [titleData],
  );

  const select = (slug: string | null) => {
    setActive(slug);
    setParams(slug ? { track: slug } : {}, { replace: true });
  };

  const startedAt = (slug: string): string | null => {
    try {
      return (JSON.parse(localStorage.getItem(START_KEY) ?? '{}') as Record<string, string>)[slug] ?? null;
    } catch {
      return null;
    }
  };

  const startTrack = (slug: string) => {
    try {
      const all = JSON.parse(localStorage.getItem(START_KEY) ?? '{}') as Record<string, string>;
      all[slug] = new Date().toISOString().slice(0, 10);
      localStorage.setItem(START_KEY, JSON.stringify(all));
    } catch {
      /* private mode — the day counter just will not persist */
    }
    select(slug);
  };

  const currentDay = (slug: string): number | null => {
    const start = startedAt(slug);
    if (!start) return null;
    const days = Math.floor((Date.now() - new Date(`${start}T00:00:00`).getTime()) / 86_400_000);
    return days + 1;
  };

  /* ───────────────────────────── one track ───────────────────────────── */
  if (track) {
    const day = currentDay(track.slug);
    const started = day !== null;

    const dayDone = (d: TrackDay): boolean => {
      const problems = d.problems ?? [];
      // Only problems can be verified objectively; a topic being "read" is a
      // self-report, so a day with no problems is never auto-ticked.
      return problems.length > 0 && problems.every((p) => solvedProblems.has(p));
    };

    const doneCount = track.plan.filter(dayDone).length;

    // Each day carries the phase it belongs to, forward-filled from the last
    // day that named one. Computed once here rather than re-derived per row.
    const phaseOf = new Map<number, string>();
    let currentPhase = '';
    for (const d of track.plan) {
      if (d.phase) currentPhase = d.phase;
      if (currentPhase) phaseOf.set(d.day, currentPhase);
    }
    const daysInPhase = (phase: string) => track.plan.filter((d) => phaseOf.get(d.day) === phase);

    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <button
          onClick={() => select(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-content-muted transition-colors hover:text-content"
        >
          ← All tracks
        </button>

        <div className="mb-5">
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">
            {track.name}
          </h1>
          <p className="mt-1 text-sm leading-6 text-content-muted">{track.blurb}</p>
        </div>

        <div className="card mb-5 flex flex-wrap items-center gap-4 p-4">
          <div className="min-w-[160px] flex-1">
            <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
              <span className="text-content-muted">
                {started ? `Day ${Math.min(day, track.days)} of ${track.days}` : `${track.days}-day plan`}
              </span>
              <span className="font-mono tabular-nums text-content-subtle">
                {doneCount}/{track.plan.length} days with problems done
              </span>
            </div>
            <ProgressBar percent={started ? Math.min((day / track.days) * 100, 100) : 0} />
          </div>
          {!started ? (
            <Button variant="primary" size="sm" onClick={() => startTrack(track.slug)}>
              Start this track
            </Button>
          ) : (
            <span className="rounded-lg bg-easy/10 px-2.5 py-1.5 text-[12px] text-easy">
              Started {startedAt(track.slug)}
            </span>
          )}
        </div>

        {problemsLoading ? (
          <SkeletonCards count={5} />
        ) : (
          <div className="space-y-2">
            {track.plan.map((d) => {
              const done = dayDone(d);
              const isToday = started && d.day === Math.min(day, track.days);

              // A phase heading renders above the day that opens it, so a
              // sixty-day plan reads as eight stages rather than sixty rows.
              const phaseDays = d.phase ? daysInPhase(d.phase) : [];
              const phaseDone = phaseDays.length > 0 && phaseDays.every(dayDone);

              return (
                <div key={`wrap-${d.day}`}>
                {d.phase && (
                  <div className="mb-2 mt-6 flex items-center gap-2 first:mt-0">
                    <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-content-subtle">
                      {d.phase}
                    </h2>
                    <span className="h-px flex-1 bg-line" />
                    <span className="font-mono text-[11px] text-content-subtle">
                      {phaseDays.length} days
                    </span>
                    {phaseDone && (
                      <span className="rounded bg-easy/15 px-1.5 py-0.5 text-[10px] font-semibold text-easy">
                        DONE
                      </span>
                    )}
                  </div>
                )}
                <div
                  className={cx(
                    'card p-4 transition-colors',
                    isToday && 'border-brand/50',
                    done && 'border-easy/40',
                  )}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cx(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold',
                        done
                          ? 'bg-easy/15 text-easy'
                          : isToday
                            ? 'bg-brand text-white'
                            : 'bg-surface-sunken text-content-subtle',
                      )}
                    >
                      {done ? '✓' : d.day}
                    </span>
                    <span className="text-[15px] font-medium text-content">{d.title}</span>
                    {isToday && (
                      <span className="rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                        TODAY
                      </span>
                    )}
                    {d.mock && (
                      <span className="rounded bg-medium/15 px-1.5 py-0.5 text-[10px] font-semibold text-medium">
                        MOCK
                      </span>
                    )}
                  </div>

                  {d.note && (
                    <p className="mb-2.5 text-[12px] leading-6 text-content-subtle">{d.note}</p>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {(d.topics ?? []).map((slug) => (
                      <Link
                        key={slug}
                        to={`/topic/${slug}`}
                        className="rounded-lg border border-line bg-surface-sunken px-2.5 py-1 text-[12px] text-content-muted transition-colors hover:border-brand hover:text-brand"
                      >
                        {topicTitles.get(slug) ?? slug.replace(/-/g, ' ')}
                      </Link>
                    ))}

                    {(d.problems ?? []).map((slug) => (
                      <Link
                        key={slug}
                        to={`/dsa/${slug}`}
                        className={cx(
                          'rounded-lg border px-2.5 py-1 text-[12px] transition-colors',
                          solvedProblems.has(slug)
                            ? 'border-easy/40 bg-easy/10 text-easy'
                            : 'border-line bg-surface-sunken text-content-muted hover:border-medium hover:text-medium',
                        )}
                      >
                        {solvedProblems.has(slug) ? '✓ ' : '◆ '}
                        {problemTitles.get(slug) ?? slug.replace(/-/g, ' ')}
                      </Link>
                    ))}

                    {(d.recall ?? []).map((category) => (
                      <Link
                        key={category}
                        to={`/recall?mode=category&category=${encodeURIComponent(category)}`}
                        className="rounded-lg border border-line bg-surface-sunken px-2.5 py-1 text-[12px] text-content-muted transition-colors hover:border-brand hover:text-brand"
                      >
                        recall: {category}
                      </Link>
                    ))}

                    {d.mock && (
                      <Link
                        to="/mock-interview"
                        className="rounded-lg border border-medium/40 bg-medium/10 px-2.5 py-1 text-[12px] text-medium"
                      >
                        run a mock interview
                      </Link>
                    )}
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

  /* ─────────────────────────── track picker ─────────────────────────── */
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">
          Interview Tracks
        </h1>
        <p className="mt-1 text-sm leading-6 text-content-muted">
          Library batati hai kya maujood hai. Track batata hai <em>aaj kya karna hai</em> aur kab
          khatam hoga. Progress wahi se aata hai jo aapne pehle se solve ya known mark kiya hai.
        </p>
      </div>

      <div className="space-y-3">
        {TRACKS.map((t: Track) => {
          const day = currentDay(t.slug);
          return (
            <button
              key={t.slug}
              onClick={() => select(t.slug)}
              className="card w-full p-5 text-left transition-colors hover:border-brand/50"
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="font-display text-[17px] font-semibold text-content">{t.name}</span>
                <span className="rounded-lg bg-surface-sunken px-2 py-0.5 text-[11px] text-content-subtle">
                  {t.role}
                </span>
                {day !== null && (
                  <span className="rounded-lg bg-brand/15 px-2 py-0.5 text-[11px] font-semibold text-brand">
                    Day {Math.min(day, t.days)}/{t.days}
                  </span>
                )}
              </div>
              <p className="text-[13px] leading-6 text-content-muted">{t.blurb}</p>
              <p className="mt-2 font-mono text-[11px] text-content-subtle">
                {t.days} days ·{' '}
                {t.plan.reduce((n, d) => n + (d.problems?.length ?? 0), 0)} problems ·{' '}
                {t.plan.reduce((n, d) => n + (d.topics?.length ?? 0), 0)} topics ·{' '}
                {t.plan.filter((d) => d.mock).length} mocks
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
