import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { usePreferences } from '../hooks/usePreferences';
import { endpoints } from '../services/endpoints';
import { CodeEditor } from '../editor/CodeEditor';
import { Markdown, CodeBlock } from '../components/Markdown';
import { NotesPanel } from '../components/NotesPanel';
import { Celebration } from '../components/Celebration';
import { VisualiserPlayer } from '../visualiser/VisualiserPlayer';
import { demosForProblem } from '../visualiser/algorithms';
import {
  Button,
  DifficultyBadge,
  ErrorState,
  LoadingState,
  Select,
  StatusPill,
  Tag,
  Textarea,
  cx,
} from '../components/ui';
import type { Language, RunResult, SubmitResult, TestCaseResult } from '../types';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'JAVASCRIPT', label: 'JavaScript' },
  { value: 'NODEJS', label: 'Node.js' },
  { value: 'PYTHON', label: 'Python' },
];

type LeftTab = 'description' | 'hints' | 'visualise' | 'approach' | 'solution' | 'notes';
type BottomTab = 'testcases' | 'output';

/* ------------------------------ result rendering ----------------------------- */

function TestCaseCard({ result }: { result: TestCaseResult }) {
  return (
    <div
      className={cx(
        'rounded-lg border p-3',
        result.passed ? 'border-easy/30 bg-easy/5' : 'border-hard/30 bg-hard/5',
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className={cx('text-xs font-semibold', result.passed ? 'text-easy' : 'text-hard')}>
          {result.passed ? 'Passed' : 'Failed'}
        </span>
        <span className="text-[11px] text-content-subtle">
          Case {result.index + 1}
          {result.hidden ? ' · hidden' : ''}
        </span>
        <span className="ml-auto font-mono text-[11px] tabular-nums text-content-subtle">
          {result.executionTime}ms
        </span>
      </div>

      {result.hidden ? (
        <p className="text-xs text-content-subtle">
          Hidden test case — input and expected output are not shown.
        </p>
      ) : (
        <div className="space-y-2">
          {result.input !== undefined && (
            <Field label="Input" value={result.input} />
          )}
          {result.expectedOutput !== undefined && (
            <Field label="Expected" value={result.expectedOutput} />
          )}
          {result.actualOutput !== undefined && (
            <Field
              label="Your output"
              value={result.actualOutput || '(no output)'}
              tone={result.passed ? undefined : 'hard'}
            />
          )}
          {result.stderr ? <Field label="Error" value={result.stderr} tone="hard" /> : null}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: 'hard' }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-content-subtle">{label}</p>
      <pre
        className={cx(
          'overflow-x-auto rounded bg-surface-sunken p-2 font-mono text-[12px] leading-5',
          tone === 'hard' ? 'text-hard' : 'text-content',
        )}
      >
        {value}
      </pre>
    </div>
  );
}

/* ---------------------------------- page ------------------------------------ */

export function DsaProblemPage() {
  const { slug = '' } = useParams();
  const { t } = usePreferences();

  const { data, loading, error, reload } = useApi(() => endpoints.dsa.detail(slug), [slug]);

  const [language, setLanguage] = useState<Language>('JAVASCRIPT');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [leftTab, setLeftTab] = useState<LeftTab>('description');
  const [bottomTab, setBottomTab] = useState<BottomTab>('testcases');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [execError, setExecError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const problem = data?.problem;
  // A problem only shows the tab when a visualiser actually covers its pattern.
  const demos = useMemo(() => (problem ? demosForProblem(problem.slug) : []), [problem]);

  const starterFor = useCallback(
    (lang: Language) => {
      if (!data) return '';
      // Resume the user's last attempt if there is one, else the starter.
      return data.progress.lastCode?.[lang] ?? data.problem.starterCode?.[lang] ?? '';
    },
    [data],
  );

  // Load the editor once the problem arrives, and whenever the language changes.
  useEffect(() => {
    if (data) setCode(starterFor(language));
  }, [data, language, starterFor]);

  const runCode = useCallback(async () => {
    if (!problem || running || submitting) return;
    setRunning(true);
    setExecError(null);
    setSubmitResult(null);
    setBottomTab('output');

    try {
      const result = await endpoints.code.run(problem.slug, {
        language,
        code,
        ...(useCustomInput && customInput ? { input: customInput } : {}),
      });
      setRunResult(result);
    } catch (err) {
      setExecError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setRunning(false);
    }
  }, [problem, running, submitting, language, code, useCustomInput, customInput]);

  const submitCode = useCallback(async () => {
    if (!problem || running || submitting) return;
    setSubmitting(true);
    setExecError(null);
    setRunResult(null);
    setBottomTab('output');

    try {
      const result = await endpoints.code.submit(problem.slug, { language, code });
      setSubmitResult(result);
      // The whole point of the app is this moment — make it land.
      if (result.status === 'ACCEPTED') setCelebrate(true);
      // Refresh progress, submission history and the unlocked solution.
      reload();
    } catch (err) {
      setExecError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [problem, running, submitting, language, code, reload]);

  /**
   * Deliberately not a real formatter — pulling in Prettier plus a Python
   * formatter would be a large dependency for a cosmetic feature. This
   * normalises indentation and trailing whitespace, which covers the common
   * "my paste is ragged" case honestly.
   */
  const formatCode = useCallback(() => {
    setCode((current) =>
      current
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.replace(/\t/g, '  ').trimEnd())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trimEnd() + '\n',
    );
  }, []);

  const resetCode = useCallback(() => {
    if (!problem) return;
    setCode(problem.starterCode?.[language] ?? '');
    setRunResult(null);
    setSubmitResult(null);
    setExecError(null);
  }, [problem, language]);

  const toggleBookmark = useCallback(async () => {
    if (!problem) return;
    const res = await endpoints.bookmarks.toggle({
      kind: 'PROBLEM',
      refId: problem.id,
      label: problem.title,
      href: `/dsa/${problem.slug}`,
    });
    setBookmarked(res.bookmarked);
  }, [problem]);

  const results = submitResult?.results ?? runResult?.results ?? [];

  const summary = useMemo(() => {
    if (submitResult) {
      return {
        tone: submitResult.status === 'ACCEPTED' ? 'easy' : 'hard',
        title:
          submitResult.status === 'ACCEPTED'
            ? 'Accepted'
            : submitResult.status === 'WRONG_ANSWER'
              ? 'Wrong Answer'
              : submitResult.status.replace(/_/g, ' '),
        detail: `Passed ${submitResult.passed}/${submitResult.total}${
          submitResult.wrongAnswers ? ` · ${submitResult.wrongAnswers} failing` : ''
        }`,
        meta: `${submitResult.runtimeMs}ms`,
      } as const;
    }
    if (runResult) {
      return {
        tone: runResult.passed === runResult.total ? 'easy' : 'hard',
        title: runResult.passed === runResult.total ? 'Sample cases passed' : 'Sample cases failed',
        detail: `Passed ${runResult.passed}/${runResult.total}`,
        meta: `${runResult.results[0]?.executionTime ?? 0}ms`,
      } as const;
    }
    return null;
  }, [submitResult, runResult]);

  if (loading) return <LoadingState label="Loading problem" />;
  if (error) return <div className="p-6"><ErrorState message={error} onRetry={reload} /></div>;
  if (!problem || !data) return null;

  return (
    <div className="flex flex-col lg:h-[calc(100vh-3.5rem)] lg:flex-row">
      <Celebration fire={celebrate} onDone={() => setCelebrate(false)} />

      {/* ─────────────────────────── Left: problem ─────────────────────────── */}
      <div className="flex min-h-0 flex-col border-line lg:w-[46%] lg:border-r">
        <div className="shrink-0 border-b border-line px-5 pb-3 pt-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h1 className="text-lg font-semibold text-content">{problem.title}</h1>
            <button
              onClick={() => void toggleBookmark()}
              className={cx(
                'shrink-0 rounded-lg p-1.5 transition-colors',
                bookmarked ? 'text-medium' : 'text-content-subtle hover:text-content',
              )}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this problem'}
              title="Bookmark"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M6 4h12v16l-6-4-6 4V4Z" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge level={problem.difficulty} />
            <Tag>{problem.category}</Tag>
            <StatusPill status={data.progress.status} />
            {data.progress.attempts > 0 && (
              <span className="text-[11px] text-content-subtle">
                {data.progress.attempts} attempt{data.progress.attempts === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-1 border-b border-line px-3 py-1.5">
          {([
            ['description', 'Description'],
            ['hints', 'Hints'],
            ...(demos.length > 0 ? ([['visualise', 'Visualise']] as const) : []),
            ['approach', 'Approach'],
            ['solution', 'Solution'],
            ['notes', 'Notes'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setLeftTab(id)}
              className={cx(
                'rounded-lg px-2.5 py-1 text-[12px] transition-colors',
                leftTab === id ? 'bg-surface-sunken font-medium text-content' : 'text-content-muted hover:text-content',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4" data-lenis-prevent>
          {leftTab === 'description' && (
            <div className="space-y-5">
              <Markdown content={t(problem.description, problem.descriptionHi)} />

              {problem.examples.length > 0 && (
                <div className="space-y-3">
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="rounded-lg border border-line bg-surface-sunken p-3">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-content-subtle">
                        Example {i + 1}
                      </p>
                      <div className="space-y-2">
                        <Field label="Input" value={ex.input} />
                        <Field label="Output" value={ex.output} />
                      </div>
                      {ex.explanation && (
                        <p className="mt-2 text-[13px] leading-6 text-content-muted">{ex.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-content">Constraints</h3>
                  <ul className="space-y-1">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="font-mono text-[12px] text-content-muted">
                        · {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {leftTab === 'hints' && (
            <div className="space-y-3">
              {problem.hints.length === 0 ? (
                <p className="text-sm text-content-muted">No hints for this problem.</p>
              ) : (
                <>
                  {problem.hints.slice(0, revealedHints).map((hint, i) => (
                    <div key={i} className="animate-fade-up rounded-lg border border-line bg-surface-sunken p-3">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-content-subtle">
                        Hint {i + 1}
                      </p>
                      <p className="text-[13px] leading-6 text-content-muted">{hint}</p>
                    </div>
                  ))}
                  {revealedHints < problem.hints.length && (
                    <Button size="sm" onClick={() => setRevealedHints((n) => n + 1)}>
                      Reveal hint {revealedHints + 1} of {problem.hints.length}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {leftTab === 'approach' && (
            <div className="space-y-4">
              <Markdown content={t(problem.approach, problem.approachHi)} />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-line bg-surface-sunken p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-content-subtle">Time</p>
                  <p className="mt-1 font-mono text-sm text-content">{problem.timeComplexity}</p>
                </div>
                <div className="rounded-lg border border-line bg-surface-sunken p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-content-subtle">Space</p>
                  <p className="mt-1 font-mono text-sm text-content">{problem.spaceComplexity}</p>
                </div>
              </div>
              <Markdown content={t(problem.solutionExplanation, problem.solutionExplanationHi)} />
            </div>
          )}

          {leftTab === 'solution' && (
            <div className="space-y-4">
              {problem.solutions ? (
                <>
                  <p className="text-[13px] text-content-muted">
                    Reference solution — compare it with your own approach.
                  </p>
                  <CodeBlock
                    code={problem.solutions[language] ?? problem.solutions['JAVASCRIPT'] ?? ''}
                    label={LANGUAGES.find((l) => l.value === language)?.label}
                  />
                </>
              ) : (
                <div className="rounded-lg border border-line bg-surface-sunken p-4 text-center">
                  <p className="text-sm font-medium text-content">Solution locked</p>
                  <p className="mt-1 text-[13px] text-content-muted">
                    Solve the problem first — the reference solution unlocks once your submission is accepted.
                  </p>
                </div>
              )}
            </div>
          )}

          {leftTab === 'visualise' && (
            <div className="space-y-3">
              <p className="text-[13px] leading-6 text-content-muted">
                Pehle pattern dekho, phir likho. Har step ki wajah neeche likhi hai.
              </p>
              {demos.map((demo) => (
                <VisualiserPlayer key={demo.id} demo={demo} />
              ))}
            </div>
          )}

          {leftTab === 'notes' && <NotesPanel problemId={problem.id} title={problem.title} />}
        </div>

        {data.submissions.length > 0 && (
          <div className="shrink-0 border-t border-line px-5 py-2">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-content-subtle">
              Recent submissions
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {data.submissions.slice(0, 8).map((s) => (
                <span
                  key={s.id}
                  title={`${s.status} · ${s.passed}/${s.total} · ${s.language}`}
                  className={cx(
                    'shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px]',
                    s.status === 'ACCEPTED' ? 'bg-easy/15 text-easy' : 'bg-hard/15 text-hard',
                  )}
                >
                  {s.passed}/{s.total}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────── Right: editor ─────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-2">
          <Select
            value={language}
            onChange={(v) => setLanguage(v as Language)}
            options={LANGUAGES}
            aria-label="Language"
          />
          <div className="ml-auto flex items-center gap-1.5">
            <Button size="sm" variant="ghost" onClick={formatCode} title="Normalise indentation">
              Format
            </Button>
            <Button size="sm" variant="ghost" onClick={resetCode}>
              Reset
            </Button>
            <Button size="sm" onClick={() => void runCode()} loading={running} disabled={submitting}>
              Run
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => void submitCode()}
              loading={submitting}
              disabled={running}
            >
              Submit
            </Button>
          </div>
        </div>

        <div className="min-h-[320px] flex-1 lg:min-h-0">
          <CodeEditor
            value={code}
            language={language}
            onChange={setCode}
            onRun={() => void runCode()}
            onSubmit={() => void submitCode()}
          />
        </div>

        {/* Output panel */}
        <div className="flex h-[38%] min-h-[220px] shrink-0 flex-col border-t border-line">
          <div className="flex shrink-0 items-center gap-1 border-b border-line px-3 py-1.5">
            {([
              ['testcases', 'Test cases'],
              ['output', 'Output'],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setBottomTab(id)}
                className={cx(
                  'rounded-lg px-2.5 py-1 text-[12px] transition-colors',
                  bottomTab === id
                    ? 'bg-surface-sunken font-medium text-content'
                    : 'text-content-muted hover:text-content',
                )}
              >
                {label}
              </button>
            ))}
            <span className="ml-auto hidden items-center gap-2 text-[10px] text-content-subtle sm:flex">
              <span className="kbd">Ctrl ↵</span> run
              <span className="kbd">Ctrl ⇧ ↵</span> submit
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3" data-lenis-prevent>
            {bottomTab === 'testcases' ? (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[13px] text-content-muted">
                  <input
                    type="checkbox"
                    checked={useCustomInput}
                    onChange={(e) => setUseCustomInput(e.target.checked)}
                    className="h-3.5 w-3.5 accent-[rgb(var(--brand))]"
                  />
                  Use custom input
                </label>

                {useCustomInput ? (
                  <Textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    rows={6}
                    placeholder={problem.sampleTestCases[0]?.input ?? 'stdin for your program'}
                    className="font-mono text-[12px]"
                  />
                ) : problem.sampleTestCases.length === 0 ? (
                  <p className="text-sm text-content-muted">This problem has no sample cases.</p>
                ) : (
                  <div className="space-y-2">
                    {problem.sampleTestCases.map((tc, i) => (
                      <div key={tc.id} className="rounded-lg border border-line bg-surface-sunken p-3">
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-content-subtle">
                          Sample {i + 1}
                        </p>
                        <div className="space-y-2">
                          <Field label="Input" value={tc.input} />
                          <Field label="Expected" value={tc.expectedOutput} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {execError ? (
                  <div className="rounded-lg border border-hard/30 bg-hard/10 p-3">
                    <p className="text-[13px] font-medium text-hard">Could not run your code</p>
                    <p className="mt-1 text-[13px] text-content-muted">{execError}</p>
                  </div>
                ) : running || submitting ? (
                  <p className="py-6 text-center text-sm text-content-muted">
                    {submitting ? 'Running every test case…' : 'Running…'}
                  </p>
                ) : !summary ? (
                  <p className="py-6 text-center text-sm text-content-subtle">
                    Run your code to see output here.
                  </p>
                ) : (
                  <>
                    <div
                      className={cx(
                        'flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2.5',
                        summary.tone === 'easy' ? 'border-easy/30 bg-easy/10' : 'border-hard/30 bg-hard/10',
                      )}
                    >
                      <span
                        className={cx(
                          'text-sm font-semibold',
                          summary.tone === 'easy' ? 'text-easy' : 'text-hard',
                        )}
                      >
                        {summary.title}
                      </span>
                      <span className="text-[13px] text-content-muted">{summary.detail}</span>
                      <span className="ml-auto font-mono text-[11px] tabular-nums text-content-subtle">
                        {summary.meta}
                      </span>
                    </div>

                    {submitResult?.errorMessage && (
                      <Field label="Error" value={submitResult.errorMessage} tone="hard" />
                    )}

                    <div className="space-y-2">
                      {results.map((r) => (
                        <TestCaseCard key={`${r.index}-${r.hidden}`} result={r} />
                      ))}
                    </div>

                    {submitResult?.status === 'ACCEPTED' && (
                      <div className="animate-pop-in rounded-lg border border-easy/30 bg-easy/5 p-3 text-center">
                        <p className="mb-1 text-2xl" aria-hidden="true">🎉</p>
                        <p className="text-[13px] text-content">
                          Solved. The reference solution is unlocked on the{' '}
                          <button onClick={() => setLeftTab('solution')} className="font-medium text-brand hover:underline">
                            Solution
                          </button>{' '}
                          tab.
                        </p>
                        <Link to="/dsa" className="mt-1 inline-block text-xs text-content-muted hover:text-content">
                          Back to problem list →
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
