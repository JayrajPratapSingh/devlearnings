import { useEffect, useRef, useState } from 'react';
import { usePreferences } from '../hooks/usePreferences';
import { endpoints } from '../services/endpoints';
import { CodeBlock } from './Markdown';
import { Button, DifficultyBadge, Textarea, cx } from './ui';
import type { InterviewQuestion, LearningStatus } from '../types';

/**
 * Active recall.
 *
 * The normal question list reveals the answer as soon as you expand it, which
 * feels productive and retains badly — recognising an answer is not the same as
 * being able to produce one. Here you must commit first: write (or say) your
 * answer, *then* the real one appears and you grade yourself honestly.
 *
 * That self-grade is also a far better signal for the spaced-revision queue
 * than "the user clicked expand", which is all the reveal flow could offer.
 */

type Phase = 'recall' | 'compare';

const GRADES: { status: LearningStatus; label: string; hint: string; variant: 'danger' | 'secondary' | 'success' }[] = [
  { status: 'NEEDS_REVISION', label: 'Missed it', hint: 'comes back tomorrow', variant: 'danger' },
  { status: 'LEARNING', label: 'Roughly', hint: 'comes back soon', variant: 'secondary' },
  { status: 'KNOWN', label: 'Nailed it', hint: 'pushed further out', variant: 'success' },
];

export function RecallCard({
  question,
  index,
  total,
  onGraded,
}: {
  question: InterviewQuestion;
  index: number;
  total: number;
  onGraded: (status: LearningStatus) => void;
}) {
  const { t } = usePreferences();
  const [phase, setPhase] = useState<Phase>('recall');
  const [answer, setAnswer] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startedAt = useRef(Date.now());

  // Reset for each new question.
  useEffect(() => {
    setPhase('recall');
    setAnswer('');
    setElapsed(0);
    startedAt.current = Date.now();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [question.id]);

  // A visible timer nudges you to answer rather than stare. It never runs out —
  // this is a study tool, and a hard cut-off would just add anxiety.
  useEffect(() => {
    if (phase !== 'recall') return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [phase, question.id]);

  const reveal = () => setPhase('compare');

  const grade = async (status: LearningStatus) => {
    onGraded(status);
    try {
      await endpoints.questions.setStatus(question.id, status);
    } catch {
      /* the parent already advanced; a failed write is not worth blocking on */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter reveals — the same shortcut as running code elsewhere.
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      reveal();
    }
  };

  return (
    <div className="card animate-fade-up overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
        <span className="font-mono text-[11px] tabular-nums text-content-subtle">
          {index + 1} / {total}
        </span>
        <DifficultyBadge level={question.difficulty} />
        <span className="text-[11px] text-content-subtle">{question.category}</span>
        {phase === 'recall' && (
          <span className="ml-auto font-mono text-[11px] tabular-nums text-content-subtle">
            {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
          </span>
        )}
      </div>

      <div className="px-5 py-5">
        <h2 className="text-[17px] leading-8 text-content">{question.question}</h2>

        {phase === 'recall' ? (
          <div className="mt-5">
            <label htmlFor="recall-answer" className="mb-2 block text-[13px] text-content-muted">
              Bina dekhe jawab likho — ya bol kar phir type karo. Commit karna hi asli faayda hai.
            </label>
            <Textarea
              id="recall-answer"
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={onKeyDown}
              rows={5}
              placeholder="Your answer…"
              className="text-[14px]"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button variant="primary" onClick={reveal}>
                Show the answer
              </Button>
              <span className="text-[11px] text-content-subtle">
                <span className="kbd">Ctrl ↵</span>
              </span>
              <button
                onClick={reveal}
                className="ml-auto text-[12px] text-content-subtle transition-colors hover:text-content"
              >
                No idea — skip to the answer
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {answer.trim() && (
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-content-subtle">
                  What you wrote
                </p>
                <p className="whitespace-pre-wrap rounded-lg border border-line bg-surface-sunken p-3 text-[13px] leading-6 text-content-muted">
                  {answer}
                </p>
              </div>
            )}

            <div className="animate-fade-up">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                Model answer
              </p>
              <p className="text-[14px] leading-7 text-content">
                {t(question.shortAnswer, question.shortAnswerHi)}
              </p>
              <p className="mt-3 text-[13px] leading-7 text-content-muted">
                {t(question.detailedAnswer, question.detailedAnswerHi)}
              </p>
            </div>

            {question.codeExample && <CodeBlock code={question.codeExample} label="Example" />}

            {question.followUps.length > 0 && (
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-content-subtle">
                  They will follow up with
                </p>
                <ul className="space-y-1.5">
                  {question.followUps.map((f, i) => (
                    <li key={i} className="flex gap-2 text-[13px] leading-6 text-content-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-line pt-4">
              <p className="mb-3 text-[13px] text-content-muted">
                Honestly — how close were you? Isi se agla review tay hota hai.
              </p>
              <div className="flex flex-wrap gap-2">
                {GRADES.map((g) => (
                  <Button
                    key={g.status}
                    variant={g.variant}
                    onClick={() => void grade(g.status)}
                    title={g.hint}
                  >
                    {g.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Small helper so the parent can show progress through a recall session. */
export function RecallProgress({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
        <div
          className={cx('h-full rounded-full bg-brand transition-[width] duration-500')}
          style={{ width: `${total ? (done / total) * 100 : 0}%` }}
        />
      </div>
      <span className="font-mono text-[11px] tabular-nums text-content-subtle">
        {done}/{total}
      </span>
    </div>
  );
}
