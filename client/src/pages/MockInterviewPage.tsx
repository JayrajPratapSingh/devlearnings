import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { endpoints } from '../services/endpoints';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  ProgressBar,
  SectionHeading,
  Select,
  cx,
} from '../components/ui';
import type { MockInterview, MockResult } from '../types';

const CATEGORY_CHOICES = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Database',
  'Authentication',
  'WebSockets',
  'System Design',
  'Git',
  'Docker',
  'Testing',
];

const SCORE_LABELS = [
  { score: 0, label: 'Missed it', variant: 'danger' as const },
  { score: 1, label: 'Partly', variant: 'secondary' as const },
  { score: 2, label: 'Nailed it', variant: 'success' as const },
];

function formatTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function MockInterviewPage() {
  const { data: history, loading, error, reload } = useApi(() => endpoints.mock.history(), []);

  const [interview, setInterview] = useState<MockInterview | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [result, setResult] = useState<MockResult | null>(null);
  const [starting, setStarting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [duration, setDuration] = useState('30');
  const [count, setCount] = useState('10');
  const [selected, setSelected] = useState<string[]>([]);
  const [startError, setStartError] = useState<string | null>(null);

  const finish = useCallback(async () => {
    if (!interview) return;
    setFinishing(true);
    try {
      const res = await endpoints.mock.finish(interview.id);
      setResult(res);
      setInterview(null);
      reload();
    } finally {
      setFinishing(false);
    }
  }, [interview, reload]);

  // Countdown. Auto-submits when it runs out, so the timer is real.
  useEffect(() => {
    if (!interview) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          void finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [interview, finish]);

  const start = async () => {
    setStarting(true);
    setStartError(null);
    setResult(null);
    try {
      const res = await endpoints.mock.start({
        durationMin: Number(duration),
        questionCount: Number(count),
        ...(selected.length ? { categories: selected } : {}),
      });
      setInterview(res);
      setIndex(0);
      setRevealed(null);
      setSecondsLeft(Number(duration) * 60);
    } catch (err) {
      setStartError(err instanceof Error ? err.message : 'Could not start the interview');
    } finally {
      setStarting(false);
    }
  };

  const answer = async (score: number) => {
    if (!interview) return;
    const question = interview.questions[index];
    if (!question) return;
    const res = await endpoints.mock.answer(interview.id, question.id, score);
    setRevealed(res.shortAnswer);
  };

  const next = () => {
    if (!interview) return;
    setRevealed(null);
    if (index + 1 >= interview.questions.length) void finish();
    else setIndex((i) => i + 1);
  };

  /* ------------------------------ in progress ------------------------------ */
  if (interview) {
    const question = interview.questions[index];
    const progress = ((index + 1) / interview.questions.length) * 100;
    const lowTime = secondsLeft < 60;

    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[13px] text-content-muted">
            Question {index + 1} of {interview.questions.length}
          </span>
          <span
            className={cx(
              'rounded-lg px-2.5 py-1 font-mono text-sm tabular-nums',
              lowTime ? 'bg-hard/15 text-hard' : 'bg-surface-raised text-content',
            )}
            role="timer"
          >
            {formatTime(secondsLeft)}
          </span>
        </div>

        <ProgressBar percent={progress} className="mb-6" />

        <div className="card animate-fade-up p-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-brand">
            {question?.category}
          </p>
          <h2 className="text-lg leading-8 text-content">{question?.prompt}</h2>

          {revealed ? (
            <div className="mt-6 animate-fade-up border-t border-line pt-5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-content-subtle">
                Model answer
              </p>
              <p className="text-[14px] leading-7 text-content-muted">{revealed}</p>
              <Button variant="primary" className="mt-5 w-full" onClick={next} loading={finishing}>
                {index + 1 >= interview.questions.length ? 'Finish interview' : 'Next question'}
              </Button>
            </div>
          ) : (
            <div className="mt-6 border-t border-line pt-5">
              <p className="mb-3 text-[13px] text-content-muted">
                Answer out loud first, then score yourself honestly. The model answer appears after.
              </p>
              <div className="flex flex-wrap gap-2">
                {SCORE_LABELS.map((s) => (
                  <Button key={s.score} variant={s.variant} onClick={() => void answer(s.score)}>
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => void finish()}
            className="text-[13px] text-content-subtle transition-colors hover:text-content"
          >
            End interview early
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------- results -------------------------------- */
  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="card animate-fade-up p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-content-subtle">Score</p>
          <p className="mt-2 font-mono text-4xl font-semibold tabular-nums text-content">
            {result.score}
            <span className="text-xl text-content-subtle">/{result.totalScore}</span>
          </p>
          <ProgressBar
            percent={result.percent}
            className="mx-auto mt-4 max-w-xs"
            tone={result.percent >= 75 ? 'easy' : result.percent >= 45 ? 'medium' : 'hard'}
          />

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-mono text-xl font-semibold text-easy">{result.correct}</p>
              <p className="text-[11px] text-content-subtle">Nailed</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-medium">{result.partial}</p>
              <p className="text-[11px] text-content-subtle">Partial</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-hard">{result.wrong}</p>
              <p className="text-[11px] text-content-subtle">Missed</p>
            </div>
          </div>
        </div>

        {result.weakTopics.length > 0 && (
          <div className="mt-6">
            <SectionHeading title="Weak topics from this round" />
            <div className="flex flex-wrap gap-2">
              {result.weakTopics.map((topic) => (
                <span key={topic} className="rounded-lg bg-hard/10 px-3 py-1.5 text-[13px] text-hard">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.retry.length > 0 && (
          <div className="mt-6">
            <SectionHeading title="Questions to retry" />
            <div className="space-y-2">
              {result.retry.map((q) => (
                <div key={q.id} className="card p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">{q.category}</p>
                  <p className="mt-1 text-[14px] text-content">{q.prompt}</p>
                  <p className="mt-2 text-[13px] leading-6 text-content-muted">{q.shortAnswer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-2">
          <Button variant="primary" onClick={() => setResult(null)}>
            New interview
          </Button>
          <Link to="/revision">
            <Button>Revise the misses</Button>
          </Link>
        </div>
      </div>
    );
  }

  /* --------------------------------- setup --------------------------------- */
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">Mock Interview</h1>
        <p className="mt-1 text-sm text-content-muted">
          One question at a time, on a timer. Score yourself honestly — every miss is queued for revision.
        </p>
      </div>

      <div className="card space-y-4 p-5">
        <div className="flex flex-wrap gap-3">
          <label className="flex-1">
            <span className="mb-1.5 block text-[13px] font-medium text-content">Duration</span>
            <Select
              value={duration}
              onChange={setDuration}
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '45', label: '45 minutes' },
                { value: '60', label: '60 minutes' },
              ]}
              className="w-full"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1.5 block text-[13px] font-medium text-content">Questions</span>
            <Select
              value={count}
              onChange={setCount}
              options={[
                { value: '5', label: '5 questions' },
                { value: '10', label: '10 questions' },
                { value: '15', label: '15 questions' },
                { value: '20', label: '20 questions' },
              ]}
              className="w-full"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-[13px] font-medium text-content">
            Topics <span className="font-normal text-content-subtle">(none selected = mixed)</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_CHOICES.map((c) => {
              const active = selected.includes(c);
              return (
                <button
                  key={c}
                  onClick={() =>
                    setSelected((prev) => (active ? prev.filter((x) => x !== c) : [...prev, c]))
                  }
                  className={cx(
                    'rounded-lg px-2.5 py-1 text-[12px] transition-colors',
                    active ? 'bg-brand text-white' : 'bg-surface-sunken text-content-muted hover:text-content',
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {startError && (
          <div className="rounded-lg border border-hard/30 bg-hard/10 px-3 py-2 text-[13px] text-hard">
            {startError}
          </div>
        )}

        <Button variant="primary" onClick={() => void start()} loading={starting} className="w-full">
          Start interview
        </Button>
      </div>

      <div className="mt-8">
        <SectionHeading title="Past interviews" />
        {loading ? (
          <LoadingState label="Loading history" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !history || history.interviews.length === 0 ? (
          <EmptyState title="No interviews yet" description="Your scores and weak topics will build up here." />
        ) : (
          <div className="card divide-y divide-line">
            {history.interviews.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-content">{item.title}</p>
                  <p className="text-[11px] text-content-subtle">
                    {new Date(item.startedAt).toLocaleDateString()}
                    {item.weakTopics.length > 0 && ` · weak: ${item.weakTopics.join(', ')}`}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[13px] tabular-nums text-content">
                  {item.score ?? '—'}/{item.totalScore ?? '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
