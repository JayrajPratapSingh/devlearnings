import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DEMOS } from '../visualiser/algorithms';
import { VisualiserPlayer } from '../visualiser/VisualiserPlayer';
import { cx } from '../components/ui';

/**
 * Browse every visualiser. The list is grouped by nothing clever — the demos
 * are already ordered from the pattern you meet first to the one you meet last.
 */
export function VisualiserPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('demo');
  const [activeId, setActiveId] = useState(
    () => DEMOS.find((d) => d.id === initial)?.id ?? DEMOS[0]!.id,
  );

  const demo = DEMOS.find((d) => d.id === activeId) ?? DEMOS[0]!;

  const select = (id: string) => {
    setActiveId(id);
    setParams({ demo: id }, { replace: true });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">Algorithm Visualiser</h1>
        <p className="mt-1 text-sm text-content-muted">
          Step through the pattern before you write it. Har step ki wajah neeche likhi hai — play
          dabao ya arrow keys se khud chalao.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {DEMOS.map((d) => (
          <button
            key={d.id}
            onClick={() => select(d.id)}
            className={cx(
              'rounded-lg px-3 py-1.5 text-[12px] transition-colors',
              d.id === activeId
                ? 'bg-brand text-white'
                : 'bg-surface-raised text-content-muted hover:text-content',
            )}
          >
            {d.title}
          </button>
        ))}
      </div>

      <VisualiserPlayer demo={demo} />

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-content-muted">
        <span>Practise it:</span>
        {demo.problemSlugs.map((slug) => (
          <Link
            key={slug}
            to={`/dsa/${slug}`}
            className="rounded-lg border border-line bg-surface-raised px-2.5 py-1 text-[12px] transition-colors hover:border-brand hover:text-brand"
          >
            {slug.replace(/-/g, ' ')}
          </Link>
        ))}
      </div>
    </div>
  );
}
