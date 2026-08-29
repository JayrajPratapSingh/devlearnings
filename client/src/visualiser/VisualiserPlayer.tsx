import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePreferences } from '../hooks/usePreferences';
import { Button, cx } from '../components/ui';
import { ArrayTrack, GridPanel, MapPanel, StackPanel, TablePanel, VarChips } from './panels';
import type { AlgorithmDemo } from './types';

const SPEEDS = [
  { label: '0.5×', ms: 2200 },
  { label: '1×', ms: 1200 },
  { label: '2×', ms: 600 },
  { label: '4×', ms: 300 },
];

/**
 * Walks an algorithm's frames.
 *
 * Frames are full snapshots, so scrubbing to any position is just an index
 * change — no replaying from the start, and the timeline can be dragged freely.
 * Autoplay stops at the last frame rather than looping: the final state is the
 * conclusion, and yanking it away mid-read would be hostile.
 */
export function VisualiserPlayer({ demo, compact = false }: { demo: AlgorithmDemo; compact?: boolean }) {
  const { t } = usePreferences();
  const frames = useMemo(() => demo.build(), [demo]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<number>(0);

  const frame = frames[index] ?? frames[0]!;
  const atEnd = index >= frames.length - 1;

  // Reset when the algorithm changes.
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [demo.id]);

  useEffect(() => {
    if (!playing) return;
    if (atEnd) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(
      () => setIndex((i) => Math.min(i + 1, frames.length - 1)),
      SPEEDS[speed]?.ms ?? 1200,
    );
    return () => window.clearTimeout(timer.current);
  }, [playing, index, atEnd, frames.length, speed]);

  const toggle = useCallback(() => {
    // Pressing play on the final frame restarts, which is what people expect.
    if (atEnd) setIndex(0);
    setPlaying((p) => !p);
  }, [atEnd]);

  const step = useCallback(
    (delta: number) => {
      setPlaying(false);
      setIndex((i) => Math.max(0, Math.min(frames.length - 1, i + delta)));
    },
    [frames.length],
  );

  // Arrow keys drive the timeline, space toggles playback.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className="card overflow-hidden focus-within:border-brand/40"
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      {!compact && (
        <div className="border-b border-line px-4 py-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-[15px] font-semibold text-content">{demo.title}</h3>
            <span className="text-[12px] text-brand">{demo.pattern}</span>
            <span className="ml-auto font-mono text-[11px] text-content-subtle">
              {demo.complexity.time} time · {demo.complexity.space} space
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-content-subtle">{demo.inputLabel}</p>
        </div>
      )}

      {/* Stage */}
      <div className="space-y-4 px-4 py-5">
        <ArrayTrack frame={frame} />

        {(frame.map || frame.stack || frame.table || frame.grid) && (
          <div className={cx('grid gap-3', frame.map && frame.stack ? 'sm:grid-cols-2' : '')}>
            {frame.map && <MapPanel map={frame.map} />}
            {frame.stack && <StackPanel stack={frame.stack} />}
            {frame.table && <TablePanel table={frame.table} />}
            {frame.grid && <GridPanel grid={frame.grid} />}
          </div>
        )}

        {frame.vars && frame.vars.length > 0 && <VarChips vars={frame.vars} />}
      </div>

      {/* Narration — the part that actually teaches */}
      <div className="border-t border-line bg-surface-sunken px-4 py-3">
        <p key={index} className="animate-fade-up text-[13px] leading-6 text-content">
          {t(frame.note, frame.noteHi)}
        </p>
        {frame.result && (
          <p className="mt-2 inline-flex animate-pop-in items-center gap-1.5 rounded-md bg-easy/15 px-2 py-1 text-[12px] font-semibold text-easy">
            ✓ {t(frame.result, frame.resultHi ?? null)}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-2.5">
        <Button size="sm" variant="primary" onClick={toggle} className="w-[86px]">
          {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
        </Button>

        <div className="flex gap-1">
          <button
            onClick={() => step(-1)}
            disabled={index === 0}
            className="rounded-lg border border-line px-2 py-1.5 text-[13px] text-content-muted transition-colors hover:text-content disabled:opacity-40"
            aria-label="Previous step"
          >
            ←
          </button>
          <button
            onClick={() => step(1)}
            disabled={atEnd}
            className="rounded-lg border border-line px-2 py-1.5 text-[13px] text-content-muted transition-colors hover:text-content disabled:opacity-40"
            aria-label="Next step"
          >
            →
          </button>
        </div>

        {/* Scrubber — snapshots make this free */}
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={index}
          onChange={(e) => {
            setPlaying(false);
            setIndex(Number(e.target.value));
          }}
          className="h-1.5 min-w-[120px] flex-1 cursor-pointer appearance-none rounded-full bg-surface-sunken accent-[rgb(var(--brand))]"
          aria-label="Step through the algorithm"
        />

        <span className="font-mono text-[11px] tabular-nums text-content-subtle">
          {index + 1}/{frames.length}
        </span>

        <div className="flex overflow-hidden rounded-lg border border-line">
          {SPEEDS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSpeed(i)}
              className={cx(
                'px-2 py-1.5 font-mono text-[11px] transition-colors',
                speed === i ? 'bg-brand text-white' : 'text-content-muted hover:bg-surface-sunken',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
