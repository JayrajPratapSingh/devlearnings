import { useMemo } from 'react';
import { cx } from './ui';

export interface ActivityDay {
  day: string;
  problemsSolved: number;
  topicsRead: number;
  minutes: number;
}

/**
 * A year of activity as a GitHub-style grid.
 *
 * The 28-day strip on the dashboard answers "am I going right now"; this
 * answers "have I been consistent", which is the question that makes a streak
 * feel worth protecting. Same data, different span, different job.
 *
 * Weeks run down each column and forward across, matching every other
 * contribution grid people have seen — a novel layout here would cost
 * recognisability for nothing.
 */

const LEVEL_CLASS = [
  'bg-surface-sunken',
  'bg-brand/25',
  'bg-brand/45',
  'bg-brand/70',
  'bg-brand',
];

function levelFor(total: number): number {
  if (total <= 0) return 0;
  if (total === 1) return 1;
  if (total <= 3) return 2;
  if (total <= 6) return 3;
  return 4;
}

function isoDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function YearHeatmap({ activity, weeks = 53 }: { activity: ActivityDay[]; weeks?: number }) {
  const { columns, monthLabels, totals } = useMemo(() => {
    const byDay = new Map(activity.map((a) => [a.day, a]));

    // End on the most recent Saturday so the last column is never a stub.
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + (6 - end.getDay()));

    const start = new Date(end);
    start.setDate(start.getDate() - (weeks * 7 - 1));

    const cols: { date: Date; day: string; total: number; entry?: ActivityDay }[][] = [];
    const labels: { index: number; label: string }[] = [];
    let lastMonth = -1;

    for (let w = 0; w < weeks; w += 1) {
      const column: { date: Date; day: string; total: number; entry?: ActivityDay }[] = [];
      for (let d = 0; d < 7; d += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        const key = isoDay(date);
        const entry = byDay.get(key);
        column.push({
          date,
          day: key,
          total: (entry?.problemsSolved ?? 0) + (entry?.topicsRead ?? 0),
          ...(entry ? { entry } : {}),
        });
      }
      // Label a column when its first day starts a new month.
      const first = column[0]!.date;
      if (first.getMonth() !== lastMonth) {
        lastMonth = first.getMonth();
        labels.push({ index: w, label: first.toLocaleString(undefined, { month: 'short' }) });
      }
      cols.push(column);
    }

    const flat = cols.flat();
    const active = flat.filter((c) => c.total > 0);

    // Longest run of consecutive active days, computed over the rendered range.
    let longest = 0;
    let run = 0;
    for (const cell of flat) {
      if (cell.date > new Date()) break;
      if (cell.total > 0) {
        run += 1;
        longest = Math.max(longest, run);
      } else {
        run = 0;
      }
    }

    return {
      columns: cols,
      monthLabels: labels,
      totals: {
        activeDays: active.length,
        solved: flat.reduce((s, c) => s + (c.entry?.problemsSolved ?? 0), 0),
        topics: flat.reduce((s, c) => s + (c.entry?.topicsRead ?? 0), 0),
        longestRun: longest,
      },
    };
  }, [activity, weeks]);

  const today = isoDay(new Date());

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[12px] text-content-muted">
        <span>
          <span className="font-mono font-semibold text-content">{totals.activeDays}</span> active days
        </span>
        <span>
          <span className="font-mono font-semibold text-content">{totals.solved}</span> solved
        </span>
        <span>
          <span className="font-mono font-semibold text-content">{totals.topics}</span> topics
        </span>
        <span>
          longest run{' '}
          <span className="font-mono font-semibold text-content">{totals.longestRun}</span>
        </span>
      </div>

      {/* Scrolls on its own so the page never scrolls sideways. */}
      <div className="overflow-x-auto pb-1" data-lenis-prevent>
        <div className="inline-block min-w-full">
          <div className="relative mb-1 h-3" style={{ width: columns.length * 13 }}>
            {monthLabels.map((m) => (
              <span
                key={`${m.label}-${m.index}`}
                className="absolute text-[9px] text-content-subtle"
                style={{ left: m.index * 13 }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]" role="img" aria-label="Activity over the last year">
            {columns.map((column, ci) => (
              <div key={ci} className="flex flex-col gap-[3px]">
                {column.map((cell) => {
                  const future = cell.date > new Date();
                  return (
                    <div
                      key={cell.day}
                      className={cx(
                        'h-[10px] w-[10px] rounded-[2px] transition-colors',
                        future ? 'bg-transparent' : LEVEL_CLASS[levelFor(cell.total)],
                        cell.day === today && 'ring-1 ring-content-subtle',
                      )}
                      title={
                        future
                          ? ''
                          : `${cell.day}: ${cell.entry?.problemsSolved ?? 0} solved, ${cell.entry?.topicsRead ?? 0} topics`
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-content-subtle">
        <span>Less</span>
        {LEVEL_CLASS.map((cls, i) => (
          <span key={i} className={cx('h-[10px] w-[10px] rounded-[2px]', cls)} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
