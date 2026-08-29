import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../services/endpoints';
import { useDebounced } from '../hooks/useApi';
import { Spinner, cx } from './ui';
import type { SearchHit } from '../types';

const QUICK_LINKS: SearchHit[] = [
  { type: 'topic', id: 'nav-dashboard', title: 'Dashboard', subtitle: 'Go to', href: '/' },
  { type: 'problem', id: 'nav-dsa', title: 'DSA Problems', subtitle: 'Go to', href: '/dsa' },
  { type: 'question', id: 'nav-questions', title: 'Interview Questions', subtitle: 'Go to', href: '/questions' },
  { type: 'topic', id: 'nav-mock', title: 'Mock Interview', subtitle: 'Go to', href: '/mock-interview' },
  { type: 'topic', id: 'nav-revision', title: 'Revise Today', subtitle: 'Go to', href: '/revision' },
  { type: 'note', id: 'nav-notes', title: 'Notes', subtitle: 'Go to', href: '/notes' },
  { type: 'topic', id: 'nav-bookmarks', title: 'Bookmarks', subtitle: 'Go to', href: '/bookmarks' },
  { type: 'topic', id: 'nav-progress', title: 'Progress', subtitle: 'Go to', href: '/progress' },
];

const TYPE_LABEL: Record<SearchHit['type'], { label: string; className: string }> = {
  topic: { label: 'Topic', className: 'text-brand bg-brand/10' },
  problem: { label: 'DSA', className: 'text-medium bg-medium/10' },
  question: { label: 'Q&A', className: 'text-easy bg-easy/10' },
  note: { label: 'Note', className: 'text-content-muted bg-surface-sunken' },
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebounced(query, 220);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setActive(0);
      // Focus after the dialog has painted, or the caret lands nowhere.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const term = debounced.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    endpoints
      .search(term)
      .then((res) => {
        if (!cancelled) {
          setResults(res.results);
          setActive(0);
        }
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, open]);

  const visible = useMemo(() => {
    if (query.trim().length < 2) {
      return QUICK_LINKS.filter((l) => l.title.toLowerCase().includes(query.trim().toLowerCase()));
    }
    return results;
  }, [query, results]);

  if (!open) return null;

  const go = (hit: SearchHit) => {
    navigate(hit.href);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (visible.length ? (i + 1) % visible.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (visible.length ? (i - 1 + visible.length) % visible.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = visible[active];
      if (hit) go(hit);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className="card animate-scale-in w-full max-w-xl overflow-hidden shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search everything"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-subtle">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search topics, problems, questions, notes…"
            className="h-12 flex-1 bg-transparent text-sm text-content outline-none placeholder:text-content-subtle"
          />
          {loading && <Spinner size={14} className="text-content-subtle" />}
          <button onClick={onClose} className="kbd" aria-label="Close">
            esc
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-1.5" data-lenis-prevent>
          {visible.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-content-subtle">
              {query.trim().length < 2 ? 'Type at least 2 characters' : 'No matches'}
            </p>
          ) : (
            visible.map((hit, index) => (
              <button
                key={`${hit.type}-${hit.id}`}
                onClick={() => go(hit)}
                onMouseEnter={() => setActive(index)}
                className={cx(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                  index === active ? 'bg-surface-sunken' : 'hover:bg-surface-sunken/60',
                )}
              >
                <span
                  className={cx(
                    'inline-flex h-[20px] shrink-0 items-center rounded px-1.5 text-[10px] font-semibold',
                    TYPE_LABEL[hit.type].className,
                  )}
                >
                  {TYPE_LABEL[hit.type].label}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-content">{hit.title}</span>
                  <span className="block truncate text-xs text-content-subtle">{hit.subtitle}</span>
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[11px] text-content-subtle">
          <span className="flex items-center gap-1">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span> navigate
          </span>
          <span className="flex items-center gap-1">
            <span className="kbd">↵</span> open
          </span>
        </div>
      </div>
    </div>
  );
}
