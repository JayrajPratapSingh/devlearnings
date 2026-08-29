import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi, useDebounced } from '../hooks/useApi';
import { usePreferences } from '../hooks/usePreferences';
import { endpoints } from '../services/endpoints';
import { CodeBlock } from '../components/Markdown';
import {
  Button,
  DifficultyBadge,
  EmptyState,
  ErrorState,
  Input,
  Select,
  StatusPill,
  cx,
} from '../components/ui';
import { SkeletonCards } from '../components/ui/Skeleton';
import { Stagger } from '../components/motion';
import { scrollToElement } from '../hooks/useSmoothScroll';
import type { Difficulty, InterviewQuestion, LearningStatus } from '../types';

const DIFFICULTIES = [
  { value: '', label: 'All difficulties' },
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'KNOWN', label: 'Known' },
  { value: 'NEEDS_REVISION', label: 'Needs revision' },
];

function QuestionCard({
  question,
  onStatus,
  defaultExpanded = false,
}: {
  question: InterviewQuestion;
  onStatus: (id: string, status: LearningStatus) => void;
  /** True when the URL points at this question, so it opens and scrolls itself. */
  defaultExpanded?: boolean;
}) {
  const { t } = usePreferences();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [bookmarked, setBookmarked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!defaultExpanded) return;
    setExpanded(true);
    // Called directly rather than inside requestAnimationFrame: the body is
    // already laid out because `expanded` starts true, and rAF does not run in
    // a background tab — a bookmark opened there would never scroll at all.
    if (ref.current) scrollToElement(ref.current);
  }, [defaultExpanded]);

  const toggleBookmark = async () => {
    const res = await endpoints.bookmarks.toggle({
      kind: 'QUESTION',
      refId: question.id,
      label: question.question,
      href: `/questions?question=${question.slug}`,
    });
    setBookmarked(res.bookmarked);
  };

  return (
    <div ref={ref} className="card animate-fade-up overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-surface-sunken/50"
        aria-expanded={expanded}
      >
        <span
          className={cx(
            'mt-1 shrink-0 text-content-subtle transition-transform',
            expanded && 'rotate-90',
          )}
          aria-hidden="true"
        >
          ›
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-medium text-content">{question.question}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-2">
            <DifficultyBadge level={question.difficulty} />
            <span className="text-[11px] text-content-subtle">{question.category}</span>
            <StatusPill status={question.status} />
          </span>
        </span>
      </button>

      {expanded && (
        <div className="animate-fade-up space-y-4 border-t border-line px-4 py-4">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-content-subtle">
              Short answer
            </p>
            <p className="text-[14px] leading-7 text-content">
              {t(question.shortAnswer, question.shortAnswerHi)}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-content-subtle">
              Detail
            </p>
            <p className="text-[13px] leading-7 text-content-muted">
              {t(question.detailedAnswer, question.detailedAnswerHi)}
            </p>
          </div>

          {question.codeExample && <CodeBlock code={question.codeExample} label="Example" />}

          {question.followUps.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-content-subtle">
                Follow-ups they will ask
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

          <div className="flex flex-wrap gap-2 border-t border-line pt-3">
            <Button size="sm" variant="success" onClick={() => onStatus(question.id, 'KNOWN')}>
              Mark known
            </Button>
            <Button size="sm" variant="danger" onClick={() => onStatus(question.id, 'NEEDS_REVISION')}>
              Needs revision
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void toggleBookmark()}>
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function QuestionsPage() {
  // Filters live in the URL so a filtered view can be bookmarked, shared, and
  // survives a reload — and so a link from elsewhere in the app can point at
  // one category. The dropdowns are still the only way to change them; the URL
  // just mirrors what they hold.
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? '');
  const [difficulty, setDifficulty] = useState(params.get('difficulty') ?? '');
  const [status, setStatus] = useState(params.get('status') ?? '');
  const debouncedSearch = useDebounced(search, 250);

  // Read once: after the first render this is a filter like any other, and
  // re-reading it would re-open the card every time the URL changed.
  const [deepLinked] = useState(() => params.get('question') ?? '');

  const { data: categoryData } = useApi(() => endpoints.questions.categories(), []);

  const { data, loading, error, reload, setData } = useApi(
    () =>
      endpoints.questions.list({
        ...(category ? { category } : {}),
        ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
        ...(status ? { status: status as LearningStatus } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      }),
    [category, difficulty, status, debouncedSearch],
  );

  useEffect(() => {
    const next: Record<string, string> = {};
    if (debouncedSearch) next['search'] = debouncedSearch;
    if (category) next['category'] = category;
    if (difficulty) next['difficulty'] = difficulty;
    if (status) next['status'] = status;
    if (deepLinked) next['question'] = deepLinked;
    // replace, not push — filtering is not a navigation step, and pushing would
    // make Back walk through every keystroke.
    setParams(next, { replace: true });
  }, [debouncedSearch, category, difficulty, status, deepLinked, setParams]);

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'All categories' },
      ...(categoryData?.categories ?? []).map((c) => ({
        value: c.category,
        label: `${c.category} (${c.known}/${c.total})`,
      })),
    ],
    [categoryData],
  );

  const onStatus = async (id: string, next: LearningStatus) => {
    // Optimistic — the pill flips immediately, the request confirms it.
    setData((current) =>
      current
        ? { questions: current.questions.map((q) => (q.id === id ? { ...q, status: next } : q)) }
        : current,
    );
    try {
      await endpoints.questions.setStatus(id, next);
    } catch {
      reload();
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">Interview Questions</h1>
        <p className="mt-1 text-sm text-content-muted">
          Rapid-fire bank. Expand, answer out loud, then mark it honestly — that feeds Revise Today.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="h-9 max-w-xs flex-1 text-[13px]"
          aria-label="Search questions"
        />
        <Select value={category} onChange={setCategory} options={categoryOptions} aria-label="Filter by category" />
        <Select value={difficulty} onChange={setDifficulty} options={DIFFICULTIES} aria-label="Filter by difficulty" />
        <Select value={status} onChange={setStatus} options={STATUSES} aria-label="Filter by status" />
      </div>

      {loading ? (
        <SkeletonCards count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.questions.length === 0 ? (
        <EmptyState
          title="No questions match"
          description="Try a different filter, or run the seed script to load the question bank."
        />
      ) : (
        <Stagger className="space-y-2">
          {data.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onStatus={(id, s) => void onStatus(id, s)}
              defaultExpanded={!!deepLinked && question.slug === deepLinked}
            />
          ))}
        </Stagger>
      )}
    </div>
  );
}
