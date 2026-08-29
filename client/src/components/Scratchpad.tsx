import { useCallback, useEffect, useRef, useState } from 'react';
import { CodeEditor } from '../editor/CodeEditor';
import { endpoints } from '../services/endpoints';
import { Button, Select, cx } from './ui';
import type { ExecutionResult, Language } from '../types';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'JAVASCRIPT', label: 'JavaScript' },
  { value: 'NODEJS', label: 'Node.js' },
  { value: 'PYTHON', label: 'Python' },
];

const STARTERS: Record<Language, string> = {
  JAVASCRIPT: `// Scratchpad — try anything, nothing is graded.\nconsole.log([1, 2, 3].map(n => n * 2));\n`,
  NODEJS: `// Scratchpad — try anything, nothing is graded.\nconsole.log(process.version);\n`,
  PYTHON: `# Scratchpad — try anything, nothing is graded.\nprint([n * 2 for n in [1, 2, 3]])\n`,
};

const STORAGE_KEY = 'devprep:scratchpad';

/**
 * A scratch editor available on every page.
 *
 * The point is "I want to check one thing right now" — mid-topic, mid-question,
 * without losing your place. So it is a panel rather than a route: the page
 * behind it stays exactly where it was.
 *
 * Code persists in localStorage per language, because the most annoying thing a
 * scratchpad can do is forget what you were testing when you navigated.
 *
 * It runs through the same sandbox as graded submissions — nothing here gets a
 * shortcut around the isolation.
 */
export function Scratchpad({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [language, setLanguage] = useState<Language>('JAVASCRIPT');
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [height, setHeight] = useState(420);
  const dragging = useRef(false);

  // Restore whatever was last being tested, per language.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<Record<Language, string>>;
      setCode(saved[language] ?? STARTERS[language]);
    } catch {
      setCode(STARTERS[language]);
    }
  }, [language]);

  useEffect(() => {
    if (!open || !code) return;
    const id = setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, string>;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, [language]: code }));
      } catch {
        /* private mode — the scratchpad just will not persist */
      }
    }, 500);
    return () => clearTimeout(id);
  }, [code, language, open]);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setError(null);
    try {
      setResult(await endpoints.code.scratch({ language, code, input: stdin }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not run that');
      setResult(null);
    } finally {
      setRunning(false);
    }
  }, [running, language, code, stdin]);

  // Drag the top edge to resize.
  useEffect(() => {
    if (!open) return;
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setHeight(Math.min(Math.max(window.innerHeight - e.clientY, 220), window.innerHeight - 80));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const output = result?.stdout?.trim() || '';
  const stderr = result?.stderr?.trim() || '';
  const failed = result && result.status !== 'success';

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[65] flex flex-col border-t border-line bg-surface-raised shadow-2xl"
      style={{ height }}
      role="dialog"
      aria-label="Scratchpad"
    >
      {/* Resize handle */}
      <div
        onMouseDown={() => {
          dragging.current = true;
          document.body.style.userSelect = 'none';
        }}
        className="group absolute inset-x-0 -top-1 h-2 cursor-ns-resize"
        aria-hidden="true"
      >
        <div className="mx-auto mt-0.5 h-1 w-16 rounded-full bg-line transition-colors group-hover:bg-brand" />
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        <span className="font-display text-[13px] font-semibold text-content">Scratchpad</span>
        <span className="hidden text-[11px] text-content-subtle sm:inline">
          Kuch bhi test karo — kahin save nahi hota
        </span>

        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <Select
            value={language}
            onChange={(v) => setLanguage(v as Language)}
            options={LANGUAGES}
            aria-label="Language"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowStdin((s) => !s)}
            className={cx(showStdin && 'text-brand')}
          >
            stdin
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setCode(STARTERS[language])}>
            Reset
          </Button>
          <Button size="sm" variant="primary" onClick={() => void run()} loading={running}>
            Run
          </Button>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-content-subtle transition-colors hover:text-content"
            aria-label="Close scratchpad"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="min-h-[140px] flex-1 border-line md:border-r">
          <CodeEditor value={code} language={language} onChange={setCode} onRun={() => void run()} />
        </div>

        <div className="flex min-h-0 w-full flex-col md:w-[38%]" data-lenis-prevent>
          {showStdin && (
            <div className="shrink-0 border-b border-line p-2">
              <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-content-subtle">
                stdin
              </label>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                rows={3}
                placeholder="input for your program"
                className="w-full rounded-lg border border-line bg-surface p-2 font-mono text-[12px] text-content focus:border-brand focus:outline-none"
              />
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-content-subtle">
              Output
            </p>

            {error ? (
              <p className="text-[12px] leading-5 text-hard">{error}</p>
            ) : running ? (
              <p className="text-[12px] text-content-muted">Running…</p>
            ) : !result ? (
              <p className="text-[12px] text-content-subtle">
                Press Run, or <span className="kbd">Ctrl ↵</span>
              </p>
            ) : (
              <div className="space-y-2">
                {output && (
                  <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-5 text-content">
                    {output}
                  </pre>
                )}
                {stderr && (
                  <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-5 text-hard">
                    {stderr}
                  </pre>
                )}
                {!output && !stderr && (
                  <p className="text-[12px] text-content-subtle">(no output)</p>
                )}
                <p
                  className={cx(
                    'font-mono text-[11px]',
                    failed ? 'text-hard' : 'text-content-subtle',
                  )}
                >
                  {result.status} · {result.executionTime}ms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
