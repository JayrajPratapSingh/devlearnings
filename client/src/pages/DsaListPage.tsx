import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, useDebounced } from '../hooks/useApi';
import { endpoints } from '../services/endpoints';
import {
  DifficultyBadge,
  EmptyState,
  ErrorState,
  Input,
  ProgressBar,
  Select,
  StatusPill,
  cx,
} from '../components/ui';
import { SkeletonRows } from '../components/ui/Skeleton';
import type { Difficulty, ProblemStatus } from '../types';

const DIFFICULTIES = [
  { value: '', label: 'All difficulties' },
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'NOT_STARTED', label: 'Not started' },
  { value: 'ATTEMPTED', label: 'Attempted' },
  { value: 'SOLVED', label: 'Solved' },
  { value: 'NEEDS_REVISION', label: 'Needs revision' },
];

export function DsaListPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounced(search, 250);

  const { data: categoryData } = useApi(() => endpoints.dsa.categories(), []);

  const { data, loading, error, reload } = useApi(
    () =>
      endpoints.dsa.list({
        ...(category ? { category } : {}),
        ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
        ...(status ? { status: status as ProblemStatus } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      }),
    [category, difficulty, status, debouncedSearch],
  );

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'All categories' },
      ...(categoryData?.categories ?? []).map((c) => ({
        value: c.category,
        label: `${c.category} (${c.solved}/${c.total})`,
      })),
    ],
    [categoryData],
  );

  const filtersActive = Boolean(category || difficulty || status || debouncedSearch);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">DSA Problems</h1>
          <p className="mt-1 text-sm text-content-muted">
            Every problem reads stdin and writes stdout, so the same solution runs in all three languages.
          </p>
        </div>
        {data && (
          <div className="flex items-center gap-3 text-sm">
            <span className="font-mono tabular-nums text-content">
              {data.stats.solved}/{data.stats.total}
            </span>
            <ProgressBar
              percent={data.stats.total ? (data.stats.solved / data.stats.total) * 100 : 0}
              className="w-28"
              tone="easy"
            />
          </div>
        )}
      </div>

      {/* Category chips — quick access without opening the select */}
      {categoryData && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory('')}
            className={cx(
              'rounded-lg px-2.5 py-1 text-[12px] transition-colors',
              category === '' ? 'bg-brand text-white' : 'bg-surface-raised text-content-muted hover:text-content',
            )}
          >
            All
          </button>
          {categoryData.categories.map((c) => (
            <button
              key={c.category}
              onClick={() => setCategory((prev) => (prev === c.category ? '' : c.category))}
              className={cx(
                'rounded-lg px-2.5 py-1 text-[12px] transition-colors',
                category === c.category
                  ? 'bg-brand text-white'
                  : 'bg-surface-raised text-content-muted hover:text-content',
              )}
            >
              {c.category}
              <span className="ml-1.5 font-mono text-[10px] opacity-70">
                {c.solved}/{c.total}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems…"
          className="h-9 max-w-xs flex-1 text-[13px]"
          aria-label="Search problems"
        />
        <Select value={difficulty} onChange={setDifficulty} options={DIFFICULTIES} aria-label="Filter by difficulty" />
        <Select value={status} onChange={setStatus} options={STATUSES} aria-label="Filter by status" />
        <Select value={category} onChange={setCategory} options={categoryOptions} aria-label="Filter by category" />
      </div>

      {loading ? (
        <SkeletonRows rows={10} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.problems.length === 0 ? (
        <EmptyState
          title="No problems match"
          description={
            filtersActive
              ? 'Try clearing a filter or searching for something else.'
              : 'Run the seed script to load the problem set.'
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wider text-content-subtle">
                <th className="w-10 px-4 py-2.5 font-medium" />
                <th className="px-2 py-2.5 font-medium">Problem</th>
                <th className="hidden px-2 py-2.5 font-medium sm:table-cell">Category</th>
                <th className="px-2 py-2.5 font-medium">Difficulty</th>
                <th className="hidden px-4 py-2.5 text-right font-medium md:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.problems.map((problem) => (
                <tr key={problem.id} className="group transition-colors hover:bg-surface-sunken/60">
                  <td className="px-4 py-2.5">
                    <span
                      className={cx(
                        'flex h-4 w-4 items-center justify-center rounded-full border text-[9px]',
                        problem.solved
                          ? 'border-easy bg-easy/15 text-easy'
                          : problem.status === 'ATTEMPTED'
                            ? 'border-medium bg-medium/15 text-medium'
                            : 'border-line text-transparent',
                      )}
                      aria-label={problem.solved ? 'Solved' : problem.status}
                    >
                      ✓
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <Link
                      to={`/dsa/${problem.slug}`}
                      className="text-[13px] text-content transition-colors group-hover:text-brand"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="hidden px-2 py-2.5 text-[13px] text-content-muted sm:table-cell">
                    {problem.category}
                  </td>
                  <td className="px-2 py-2.5">
                    <DifficultyBadge level={problem.difficulty} />
                  </td>
                  <td className="hidden px-4 py-2.5 text-right md:table-cell">
                    <StatusPill status={problem.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
