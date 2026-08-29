import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { endpoints } from '../services/endpoints';
import { RecallCard, RecallProgress } from '../components/RecallCard';
import { Button, EmptyState, ErrorState, Select, cx } from '../components/ui';
import { SkeletonCards } from '../components/ui/Skeleton';
import type { InterviewQuestion, LearningStatus } from '../types';

type Mode = 'weak' | 'all' | 'category';

const MODES: { value: Mode; label: string; blurb: string }[] = [
  { value: 'weak', label: 'Weak spots', blurb: 'Sirf wahi jo aapne miss kiye ya abhi tak nahi dekhe' },
  { value: 'all', label: 'Everything', blurb: 'Poora question bank, shuffled' },
  { value: 'category', label: 'One topic', blurb: 'Ek category par focus' },
];

/** Fisher–Yates. A fixed order would let you memorise the sequence, not the answers. */
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

/**
 * A recall session.
 *
 * Deliberately one question at a time with no list visible: seeing the next
 * question while answering this one is exactly the kind of shortcut that turns
 * recall back into recognition.
 */
export function RecallPage() {
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>((params.get('mode') as Mode) ?? 'weak');
  const [category, setCategory] = useState(params.get('category') ?? '');
  const [started, setStarted] = useState(false);
  const [deck, setDeck] = useState<InterviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [tally, setTally] = useState({ KNOWN: 0, LEARNING: 0, NEEDS_REVISION: 0 });

  const { data: categoryData } = useApi(() => endpoints.questions.categories(), []);
  const { data, loading, error, reload } = useApi(
    () => endpoints.questions.list(mode === 'category' && category ? { category } : {}),
    [mode, category],
  );

  const pool = useMemo(() => {
    const all = data?.questions ?? [];
    if (mode === 'weak') {
      // Anything you have not proven you know — never seen, or explicitly missed.
      return all.filter((q) => q.status === 'NEW' || q.status === 'NEEDS_REVISION' || q.status === 'LEARNING');
    }
    return all;
  }, [data, mode]);

  const start = useCallback(() => {
    setDeck(shuffle(pool).slice(0, 20));
    setIndex(0);
    setTally({ KNOWN: 0, LEARNING: 0, NEEDS_REVISION: 0 });
    setStarted(true);
    setParams(
      { mode, ...(mode === 'category' && category ? { category } : {}) },
      { replace: true },
    );
  }, [pool, mode, category, setParams]);

  const onGraded = useCallback((status: LearningStatus) => {
    setTally((t) => ({ ...t, [status]: (t[status as keyof typeof t] ?? 0) + 1 }));
    setIndex((i) => i + 1);
  }, []);

  // Scroll back up between questions — a long answer leaves you at the bottom.
  useEffect(() => {
    if (started) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [index, started]);

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'Choose a topic…' },
      ...(categoryData?.categories ?? []).map((c) => ({
        value: c.category,
        label: `${c.category} (${c.total})`,
      })),
    ],
    [categoryData],
  );

  /* ───────────────────────────── in a session ───────────────────────────── */
  if (started && index < deck.length) {
    const question = deck[index]!;
    return (
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-4">
          <RecallProgress done={index} total={deck.length} />
        </div>
        <RecallCard question={question} index={index} total={deck.length} onGraded={onGraded} />
        <div className="mt-4 text-center">
          <button
            onClick={() => setStarted(false)}
            className="text-[13px] text-content-subtle transition-colors hover:text-content"
          >
            End session
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────── finished ─────────────────────────────── */
  if (started && deck.length > 0) {
    const total = deck.length;
    const solid = tally.KNOWN;
    const percent = Math.round((solid / total) * 100);

    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="card animate-fade-up p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-content-subtle">
            Session complete
          </p>
          <p className="mt-2 font-mono text-4xl font-semibold tabular-nums text-content">
            {solid}
            <span className="text-xl text-content-subtle">/{total}</span>
          </p>
          <p className="mt-1 text-sm text-content-muted">nailed without looking</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div>
              <p className="font-mono text-xl font-semibold text-easy">{tally.KNOWN}</p>
              <p className="text-[11px] text-content-subtle">Nailed</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-medium">{tally.LEARNING}</p>
              <p className="text-[11px] text-content-subtle">Roughly</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-hard">{tally.NEEDS_REVISION}</p>
              <p className="text-[11px] text-content-subtle">Missed</p>
            </div>
          </div>

          <p className="mt-6 text-[13px] leading-6 text-content-muted">
            {percent >= 80
              ? 'Strong. The missed ones are already queued for review.'
              : percent >= 50
                ? 'Decent. Everything you missed will come back tomorrow.'
                : 'That is what recall is for — you now know exactly what to study.'}
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <Button variant="primary" onClick={start}>
              Another round
            </Button>
            <Link to="/revision">
              <Button>Review the misses</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────── setup ───────────────────────────────── */
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">
          Active Recall
        </h1>
        <p className="mt-1 text-sm leading-6 text-content-muted">
          Answer pehle likho, phir dekho. Padh kar "haan pata hai" lagna aur khud likh paana — dono
          alag cheezein hain, aur interview mein doosri wali chahiye.
        </p>
      </div>

      <div className="card space-y-4 p-5">
        <div className="flex flex-wrap gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={cx(
                'rounded-lg px-3 py-1.5 text-[13px] transition-colors',
                mode === m.value
                  ? 'bg-brand text-white'
                  : 'bg-surface-sunken text-content-muted hover:text-content',
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <p className="text-[13px] text-content-muted">
          {MODES.find((m) => m.value === mode)?.blurb}
        </p>

        {mode === 'category' && (
          <Select
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            aria-label="Category"
            className="w-full"
          />
        )}

        {loading ? (
          <SkeletonCards count={1} />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : pool.length === 0 ? (
          <EmptyState
            title={mode === 'weak' ? 'Nothing weak right now' : 'No questions here'}
            description={
              mode === 'weak'
                ? 'You have marked everything as known. Try "Everything" to keep them fresh.'
                : 'Pick a different topic, or run the seed script.'
            }
          />
        ) : (
          <>
            <p className="text-[13px] text-content-muted">
              <span className="font-mono font-semibold text-content">
                {Math.min(pool.length, 20)}
              </span>{' '}
              questions in this round
              {pool.length > 20 && (
                <span className="text-content-subtle"> (of {pool.length}, shuffled)</span>
              )}
            </p>
            <Button variant="primary" onClick={start} className="w-full">
              Start recall
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
