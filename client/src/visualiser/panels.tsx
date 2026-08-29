import { cx } from '../components/ui';
import type { Frame, Range, Tone } from './types';

/**
 * Renderers for whatever a frame happens to contain. Each panel is independent
 * and only appears when its slice of the frame is present, so a new algorithm
 * composes existing panels rather than needing new UI.
 *
 * Depth is done with a lift-and-shadow on the active cell rather than real 3D:
 * a rotated scene would fight legibility, and legibility is the entire point.
 */

const TONE_CELL: Record<Tone, string> = {
  idle: 'border-line bg-surface-raised text-content',
  active: 'border-brand bg-brand/15 text-content',
  good: 'border-easy bg-easy/15 text-easy',
  bad: 'border-hard bg-hard/15 text-hard',
  warn: 'border-medium bg-medium/15 text-medium',
  done: 'border-line bg-surface-sunken text-content-muted',
  dim: 'border-line/60 bg-surface text-content-subtle',
};

const TONE_TEXT: Record<Tone, string> = {
  idle: 'text-content-muted',
  active: 'text-brand',
  good: 'text-easy',
  bad: 'text-hard',
  warn: 'text-medium',
  done: 'text-content-muted',
  dim: 'text-content-subtle',
};

const TONE_RANGE: Record<Tone, string> = {
  idle: 'bg-line/40',
  active: 'bg-brand/15 ring-1 ring-brand/40',
  good: 'bg-easy/15 ring-1 ring-easy/40',
  bad: 'bg-hard/15 ring-1 ring-hard/40',
  warn: 'bg-medium/15 ring-1 ring-medium/40',
  done: 'bg-surface-sunken',
  dim: 'bg-surface-sunken/60',
};

const CELL = 46;
const GAP = 6;

/* ─────────────────────────────── Array track ─────────────────────────────── */

export function ArrayTrack({ frame }: { frame: Frame }) {
  const cells = frame.cells ?? [];
  if (cells.length === 0) return null;

  const width = cells.length * CELL + (cells.length - 1) * GAP;
  const pointerRows = groupPointers(frame.pointers ?? []);

  const rangeStyle = (r: Range) => ({
    left: r.from * (CELL + GAP),
    width: (r.to - r.from + 1) * CELL + (r.to - r.from) * GAP,
  });

  return (
    <div className="overflow-x-auto pb-1">
      <div className="relative mx-auto" style={{ width, minWidth: width }}>
        {/* Ranges sit behind the cells so they read as a backdrop, not a border */}
        <div className="relative" style={{ height: 22 }}>
          {(frame.ranges ?? []).map((r, i) => (
            <div
              key={`${r.from}-${r.to}-${i}`}
              className={cx(
                'absolute bottom-0 rounded-t-md transition-all duration-300 ease-out',
                TONE_RANGE[r.tone],
              )}
              style={{ ...rangeStyle(r), height: 22 }}
            >
              {r.label && (
                <span
                  className={cx(
                    'absolute inset-x-0 top-0.5 truncate px-1 text-center text-[10px] font-medium',
                    TONE_TEXT[r.tone],
                  )}
                >
                  {r.label}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex" style={{ gap: GAP }}>
          {cells.map((value, i) => {
            const tone = frame.cellTones?.[i] ?? 'idle';
            const lifted = tone === 'active' || tone === 'good' || tone === 'bad';
            return (
              <div
                key={i}
                className={cx(
                  'flex shrink-0 flex-col items-center justify-center rounded-lg border font-mono',
                  'transition-all duration-300 ease-out',
                  TONE_CELL[tone],
                  lifted && 'shadow-lg',
                )}
                style={{
                  width: CELL,
                  height: CELL,
                  transform: lifted ? 'translateY(-4px) scale(1.06)' : 'none',
                }}
              >
                <span className="text-[15px] font-semibold tabular-nums">{value}</span>
              </div>
            );
          })}
        </div>

        {/* Index ruler */}
        <div className="mt-1 flex" style={{ gap: GAP }}>
          {cells.map((_, i) => (
            <span
              key={i}
              className="shrink-0 text-center font-mono text-[10px] text-content-subtle"
              style={{ width: CELL }}
            >
              {i}
            </span>
          ))}
        </div>

        {/* Pointer rows — stacked so two pointers on one index do not overlap */}
        {pointerRows.map((row, rowIndex) => (
          <div key={rowIndex} className="mt-1 flex" style={{ gap: GAP }}>
            {cells.map((_, i) => {
              const p = row.find((x) => x.index === i);
              return (
                <span
                  key={i}
                  className="shrink-0 text-center"
                  style={{ width: CELL }}
                >
                  {p && (
                    <span
                      className={cx(
                        'inline-block animate-fade-up font-mono text-[11px] font-semibold',
                        TONE_TEXT[p.tone],
                      )}
                    >
                      ▲{p.name}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two pointers on the same index would collide, so give each its own row. */
function groupPointers(pointers: Frame['pointers'] = []) {
  const rows: NonNullable<Frame['pointers']>[] = [];
  for (const p of pointers) {
    const row = rows.find((r) => !r.some((x) => x.index === p.index));
    if (row) row.push(p);
    else rows.push([p]);
  }
  return rows;
}

/* ──────────────────────────────── Hash map ───────────────────────────────── */

export function MapPanel({ map }: { map: NonNullable<Frame['map']> }) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunken p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-content-subtle">
        {map.title}
      </p>
      {map.entries.length === 0 ? (
        <p className="py-2 text-center text-[12px] text-content-subtle">empty</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {map.entries.map((e) => (
            <span
              key={e.key}
              className={cx(
                'rounded-md border px-2 py-1 font-mono text-[11px] transition-all duration-300',
                e.hit
                  ? 'border-easy bg-easy/20 text-easy shadow-md'
                  : e.fresh
                    ? 'animate-pop-in border-brand bg-brand/15 text-brand'
                    : 'border-line bg-surface text-content-muted',
              )}
            >
              {e.key} <span className="opacity-60">→</span> {e.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────── Stack ────────────────────────────────── */

export function StackPanel({ stack }: { stack: NonNullable<Frame['stack']> }) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunken p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-content-subtle">
        {stack.title}
      </p>
      <div className="flex min-h-[64px] flex-col-reverse items-start gap-1">
        {stack.items.length === 0 ? (
          <p className="w-full py-4 text-center text-[12px] text-content-subtle">empty</p>
        ) : (
          stack.items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className={cx(
                'rounded-md border px-3 py-1 font-mono text-[13px]',
                i === stack.items.length - 1
                  ? 'animate-pop-in border-brand bg-brand/15 text-brand shadow-md'
                  : 'border-line bg-surface text-content-muted',
              )}
            >
              {item}
            </span>
          ))
        )}
      </div>
      {stack.poppedLabel && (
        <p className="mt-2 font-mono text-[11px] text-content-subtle">
          popped <span className="text-hard">{stack.poppedLabel}</span>
        </p>
      )}
    </div>
  );
}

/* ──────────────────────────────── DP table ───────────────────────────────── */

export function TablePanel({ table }: { table: NonNullable<Frame['table']> }) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunken p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-content-subtle">
        {table.title}
      </p>
      <div className="overflow-x-auto">
        <table className="border-separate" style={{ borderSpacing: 4 }}>
          {table.colLabels && (
            <thead>
              <tr>
                {table.rowLabels && <th className="w-10" />}
                {table.colLabels.map((c) => (
                  <th
                    key={c}
                    className="w-10 pb-0.5 text-center font-mono text-[10px] font-normal text-content-subtle"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {table.rowLabels && (
                  <td className="pr-1 text-right font-mono text-[10px] text-content-subtle">
                    {table.rowLabels[r]}
                  </td>
                )}
                {row.map((cell, c) => {
                  const tone = cell.tone ?? 'idle';
                  const lifted = tone === 'active' || tone === 'good';
                  return (
                    <td key={c}>
                      <div
                        className={cx(
                          'flex h-10 w-10 items-center justify-center rounded-md border font-mono text-[13px] font-semibold tabular-nums',
                          'transition-all duration-300 ease-out',
                          TONE_CELL[tone],
                          lifted && 'shadow-lg',
                        )}
                        style={{ transform: lifted ? 'translateY(-3px) scale(1.06)' : 'none' }}
                      >
                        {cell.value}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ────────────────────────────────── Grid ─────────────────────────────────── */

export function GridPanel({ grid }: { grid: NonNullable<Frame['grid']> }) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunken p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-content-subtle">
        {grid.title}
      </p>
      <div className="flex flex-col items-center gap-1">
        {grid.rows.map((row, r) => (
          <div key={r} className="flex gap-1">
            {row.map((value, c) => {
              const tone = grid.tones[`${r},${c}`];
              const isLand = value === '1';
              return (
                <div
                  key={c}
                  className={cx(
                    'flex h-9 w-9 items-center justify-center rounded-md border font-mono text-[12px] font-semibold',
                    'transition-all duration-300 ease-out',
                    tone
                      ? 'border-easy bg-easy/20 text-easy shadow-md'
                      : isLand
                        ? 'border-line bg-surface-raised text-content'
                        : 'border-line/50 bg-surface text-content-subtle',
                  )}
                  style={{ transform: tone ? 'translateY(-2px) scale(1.05)' : 'none' }}
                >
                  {value}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Variable chips ──────────────────────────── */

export function VarChips({ vars }: { vars: NonNullable<Frame['vars']> }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {vars.map((v) => (
        <span
          key={v.label}
          className={cx(
            'rounded-md border px-2 py-1 font-mono text-[11px] transition-colors duration-300',
            v.tone ? TONE_CELL[v.tone] : 'border-line bg-surface-sunken text-content-muted',
          )}
        >
          {v.label} <span className="opacity-50">=</span>{' '}
          <span className="font-semibold tabular-nums">{v.value}</span>
        </span>
      ))}
    </div>
  );
}
