import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { endpoints } from '../services/endpoints';
import { EmptyState, ErrorState, cx } from '../components/ui';
import { SkeletonRows } from '../components/ui/Skeleton';
import type { BookmarkKind } from '../types';

const FILTERS: { value: '' | BookmarkKind; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'TOPIC', label: 'Topics' },
  { value: 'PROBLEM', label: 'Problems' },
  { value: 'QUESTION', label: 'Questions' },
];

const KIND_STYLE: Record<BookmarkKind, string> = {
  TOPIC: 'text-brand bg-brand/10',
  PROBLEM: 'text-medium bg-medium/10',
  QUESTION: 'text-easy bg-easy/10',
};

export function BookmarksPage() {
  const [kind, setKind] = useState<'' | BookmarkKind>('');
  const { data, loading, error, reload, setData } = useApi(
    () => endpoints.bookmarks.list(kind || undefined),
    [kind],
  );

  const remove = async (bookmark: { id: string; kind: BookmarkKind; refId: string; label: string; href: string }) => {
    setData((current) =>
      current ? { bookmarks: current.bookmarks.filter((b) => b.id !== bookmark.id) } : current,
    );
    try {
      // The endpoint is a toggle, so calling it on an existing bookmark removes it.
      await endpoints.bookmarks.toggle({
        kind: bookmark.kind,
        refId: bookmark.refId,
        label: bookmark.label,
        href: bookmark.href,
      });
    } catch {
      reload();
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">Bookmarks</h1>
        <p className="mt-1 text-sm text-content-muted">
          The things you flagged as worth coming back to.
        </p>
      </div>

      <div className="mb-4 flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setKind(f.value)}
            className={cx(
              'rounded-lg px-3 py-1.5 text-[13px] transition-colors',
              kind === f.value ? 'bg-brand text-white' : 'bg-surface-raised text-content-muted hover:text-content',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonRows rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.bookmarks.length === 0 ? (
        <EmptyState
          title="Nothing bookmarked yet"
          description="Use the bookmark icon on any topic, problem or interview question."
        />
      ) : (
        <div className="card divide-y divide-line">
          {data.bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="group flex items-center gap-3 px-4 py-3">
              <span
                className={cx(
                  'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold',
                  KIND_STYLE[bookmark.kind],
                )}
              >
                {bookmark.kind}
              </span>
              <Link
                to={bookmark.href}
                className="min-w-0 flex-1 truncate text-[13px] text-content transition-colors hover:text-brand"
              >
                {bookmark.label}
              </Link>
              <button
                onClick={() => void remove(bookmark)}
                className="shrink-0 text-[12px] text-content-subtle opacity-0 transition-opacity hover:text-hard group-hover:opacity-100"
                aria-label={`Remove bookmark ${bookmark.label}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
