import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { usePreferences } from '../hooks/usePreferences';
import { endpoints } from '../services/endpoints';
import { Celebration } from '../components/Celebration';
import { Button, DifficultyBadge, EmptyState, ErrorState, cx } from '../components/ui';
import { SkeletonCards } from '../components/ui/Skeleton';
import type { InterviewQuestion, LearningStatus } from '../types';

const DURATIONS = [
  { seconds: 120, label: '2 min' },
  { seconds: 300, label: '5 min' },
  { seconds: 600, label: '10 min' },
];

const BEST_KEY = 'devprep:blitz-best';

/**
 * Blitz — rapid-fire recognition against a clock.
 *
 * Deliberately *not* the same exercise as /recall. Recall makes you produce an
 * answer in writing, untimed, which is the deep version. Blitz is the shallow,
 * fast one: flip, judge yourself in a second, move on. Both are useful, and
 * they are useful for different reasons — one builds the answer, the other
 * keeps a lot of material warm the week before an interview.
 *
 * You compete against your own previous best, never a global leaderboard: a
 * leaderboard rewards grinding easy questions, which is the opposite of the
 * point.
 */

type Phase = 'setup' | 'playing' | 'done';

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = out[i]!;
    const b = out[j]!;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

function readBest(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

export function BlitzPage() {
  const { t } = usePreferences();
  const { data, loading, error, reload } = useApi(() => endpoints.questions.list({}), []);

  const [phase, setPhase] = useState<Phase>('setup');
  const [duration, setDuration] = useState(300);
  const [left, setLeft] = useState(0);
  const [deck, setDeck] = useState<InterviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [best, setBest] = useState<Record<string, number>>(() => readBest());
  const [isRecord, setIsRecord] = useState(false);
  const tick = useRef<number>(0);

  const pool = data?.questions ?? [];

  const finish = useCallback(
    (finalHits: number) => {
      window.clearInterval(tick.current);
      setPhase('done');

      const key = String(duration);
      const previous = readBest()[key] ?? 0;
      if (finalHits > previous) {
        const next = { ...readBest(), [key]: finalHits };
        try {
          localStorage.setItem(BEST_KEY, JSON.stringify(next));
        } catch {
          /* private mode — the score just will not persist */
        }
        setBest(next);
        setIsRecord(finalHits > 0);
      } else {
        setIsRecord(false);
      }
    },
    [duration],
  );

  const start = useCallback(() => {
    setDeck(shuffle(pool));
    setIndex(0);
    setFlipped(false);
    setHits(0);
    setMisses(0);
    setLeft(duration);
    setPhase('playing');
  }, [pool, duration]);

  // The clock. Reading hits from a ref-free closure would freeze the final
  // score at 0, so the tally is passed through the functional updater.
  useEffect(() => {
    if (phase !== 'playing') return;
    tick.current = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(tick.current);
          setHits((h) => {
            finish(h);
            return h;
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick.current);
  }, [phase, finish]);

  const grade = useCallback(
    (knew: boolean) => {
      const question = deck[index];
      if (!question) return;

      if (knew) setHits((h) => h + 1);
      else setMisses((m) => m + 1);

      // Fire and forget — a slow write must never stall a timed round, and the
      // grade is still worth feeding into the revision queue.
      const status: LearningStatus = knew ? 'KNOWN' : 'NEEDS_REVISION';
      void endpoints.questions.setStatus(question.id, status).catch(() => undefined);

      setFlipped(false);
      setIndex((i) => (i + 1 < deck.length ? i + 1 : 0)); // wrap rather than end early
    },
    [deck, index],
  );

  // Keyboard: the whole point is speed, so hands never leave the keys.
  useEffect(() => {
    if (phase !== 'playing') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      } else if (flipped && (e.key === '1' || e.key === 'ArrowLeft')) {
        e.preventDefault();
        grade(false);
      } else if (flipped && (e.key === '2' || e.key === 'ArrowRight')) {
        e.preventDefault();
        grade(true);
      } else if (e.key === 'Escape') {
        setHits((h) => {
          finish(h);
          return h;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, flipped, grade, finish]);

  const bestForDuration = best[String(duration)] ?? 0;
  const answered = hits + misses;
  const accuracy = answered ? Math.round((hits / answered) * 100) : 0;

  const timeLabel = useMemo(() => {
    const m = Math.floor(left / 60);
    const s = left % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }, [left]);

  /* ─────────────────────────────── playing ─────────────────────────────── */
  if (phase === 'playing') {
    const question = deck[index];
    const low = left <= 15;

    return (
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <span
            className={cx(
              'rounded-lg px-3 py-1.5 font-mono text-lg font-semibold tabular-nums transition-colors',
              low ? 'bg-hard/15 text-hard' : 'bg-surface-raised text-content',
            )}
            role="timer"
          >
            {timeLabel}
          </span>
          <span className="font-mono text-[13px] tabular-nums text-easy">{hits} ✓</span>
          <span className="font-mono text-[13px] tabular-nums text-hard">{misses} ✕</span>
          <span className="ml-auto text-[11px] text-content-subtle">
            best {bestForDuration}
          </span>
        </div>

        <div
          className="card min-h-[260px] cursor-pointer select-none p-6"
          onClick={() => !flipped && setFlipped(true)}
          role="button"
          tabIndex={0}
        >
          <div className="mb-3 flex items-center gap-2">
            <DifficultyBadge level={question?.difficulty ?? 'EASY'} />
            <span className="text-[11px] text-content-subtle">{question?.category}</span>
          </div>

          <p className="text-[17px] leading-8 text-content">{question?.question}</p>

          {flipped ? (
            <div className="mt-5 animate-fade-up border-t border-line pt-4">
              <p className="text-[14px] leading-7 text-content-muted">
                {t(question?.shortAnswer ?? '', question?.shortAnswerHi ?? null)}
              </p>
            </div>
          ) : (
            <p className="mt-6 text-[13px] text-content-subtle">
              Jawab socho, phir <span className="kbd">space</span> dabao
            </p>
          )}
        </div>

        {flipped && (
          <div className="mt-3 flex gap-2">
            <Button variant="danger" className="flex-1" onClick={() => grade(false)}>
              Missed <span className="kbd ml-1.5">1</span>
            </Button>
            <Button variant="success" className="flex-1" onClick={() => grade(true)}>
              Knew it <span className="kbd ml-1.5">2</span>
            </Button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => finish(hits)}
            className="text-[13px] text-content-subtle transition-colors hover:text-content"
          >
            End early <span className="kbd ml-1">esc</span>
          </button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────── done ───────────────────────────────── */
  if (phase === 'done') {
    return (
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <Celebration fire={isRecord} onDone={() => setIsRecord(false)} />

        <div className="card animate-fade-up p-6 text-center">
          {isRecord && (
            <p className="mb-2 animate-pop-in text-[13px] font-semibold text-medium">
              New personal best 🎉
            </p>
          )}
          <p className="text-[11px] font-semibold uppercase tracking-wider text-content-subtle">
            Time up
          </p>
          <p className="mt-2 font-mono text-5xl font-semibold tabular-nums text-content">{hits}</p>
          <p className="mt-1 text-sm text-content-muted">answered correctly</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div>
              <p className="font-mono text-xl font-semibold text-easy">{hits}</p>
              <p className="text-[11px] text-content-subtle">Knew</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-hard">{misses}</p>
              <p className="text-[11px] text-content-subtle">Missed</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-content">{accuracy}%</p>
              <p className="text-[11px] text-content-subtle">Accuracy</p>
            </div>
          </div>

          <p className="mt-5 text-[13px] text-content-muted">
            Personal best at {DURATIONS.find((d) => d.seconds === duration)?.label}:{' '}
            <span className="font-mono font-semibold text-content">{bestForDuration}</span>
          </p>

          <p className="mt-4 text-[12px] leading-6 text-content-subtle">
            Jo miss hue wo revision queue mein chale gaye hain.
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <Button variant="primary" onClick={start}>
              Go again
            </Button>
            <Link to="/revision">
              <Button>Review the misses</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────── setup ───────────────────────────────── */
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">
          Blitz
        </h1>
        <p className="mt-1 text-sm leading-6 text-content-muted">
          Ghadi ke against rapid fire. Sawaal dekho, jawab socho, flip karo, khud ko judge karo —
          ek second mein. Bahut sara material garam rakhne ke liye, interview se pehle wale hafte mein.
        </p>
      </div>

      <div className="card space-y-4 p-5">
        <div>
          <p className="mb-2 text-[13px] font-medium text-content">How long?</p>
          <div className="flex gap-1.5">
            {DURATIONS.map((d) => (
              <button
                key={d.seconds}
                onClick={() => setDuration(d.seconds)}
                className={cx(
                  'flex-1 rounded-lg px-3 py-2 text-[13px] transition-colors',
                  duration === d.seconds
                    ? 'bg-brand text-white'
                    : 'bg-surface-sunken text-content-muted hover:text-content',
                )}
              >
                {d.label}
                {(best[String(d.seconds)] ?? 0) > 0 && (
                  <span className="ml-1.5 font-mono text-[10px] opacity-70">
                    best {best[String(d.seconds)]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface-sunken px-3 py-2.5">
          <p className="text-[12px] leading-6 text-content-muted">
            <span className="kbd">space</span> reveal ·{' '}
            <span className="kbd">1</span> missed · <span className="kbd">2</span> knew it ·{' '}
            <span className="kbd">esc</span> end
          </p>
        </div>

        {loading ? (
          <SkeletonCards count={1} />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : pool.length === 0 ? (
          <EmptyState title="No questions yet" description="Run the seed script to load the bank." />
        ) : (
          <>
            <p className="text-[13px] text-content-muted">
              <span className="font-mono font-semibold text-content">{pool.length}</span> questions
              in the pool, shuffled
            </p>
            <Button variant="primary" onClick={start} className="w-full">
              Start blitz
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
