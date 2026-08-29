import { useEffect, useRef, useState } from 'react';
import { cx } from './index';

/** Honours the OS setting once, at mount — motion should never fight the user. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Counts a number up when it first appears.
 *
 * A number that animates into place reads as *earned* — it turns "you solved 12"
 * from a fact into a small event. Eased so it decelerates rather than ticking
 * linearly, which is what makes it feel like a scoreboard and not a stopwatch.
 */
export function CountUp({
  value,
  duration = 900,
  suffix = '',
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  const frameRef = useRef(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    startedAt.current = null;

    const tick = (now: number): void => {
      startedAt.current ??= now;
      const elapsed = now - startedAt.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(value * eased));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration, reduced]);

  return (
    <span className={cx('tabular-nums', className)}>
      {display}
      {suffix}
    </span>
  );
}

/**
 * Circular progress. Used where a number deserves more weight than a bar —
 * the dashboard's headline "overall preparation" reads as a dial, not a row.
 */
export function ProgressRing({
  percent,
  size = 76,
  stroke = 7,
  tone = 'brand',
  label,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  tone?: 'brand' | 'easy' | 'medium' | 'hard';
  label?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const colors = {
    brand: 'rgb(var(--brand))',
    easy: 'rgb(var(--easy))',
    medium: 'rgb(var(--medium))',
    hard: 'rgb(var(--hard))',
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--surface-sunken))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={reduced ? undefined : { transition: 'stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-lg font-semibold tabular-nums text-content">
          <CountUp value={clamped} suffix="%" />
        </span>
        {label && <span className="text-[9px] uppercase tracking-wider text-content-subtle">{label}</span>}
      </div>
    </div>
  );
}

/**
 * Streak flame. Grows and glows with the streak length, so a 30-day streak
 * visibly outranks a 2-day one — the whole point of showing a streak at all.
 */
export function StreakFlame({ days }: { days: number }) {
  const reduced = usePrefersReducedMotion();
  const hot = days >= 7;
  const blazing = days >= 30;

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors',
        blazing
          ? 'bg-medium/15 text-medium'
          : hot
            ? 'bg-medium/10 text-medium'
            : 'bg-surface-raised text-content',
      )}
      title={
        days === 0
          ? 'No streak yet — solve a problem or read a topic today'
          : `${days}-day streak${blazing ? ' — blazing' : hot ? ' — on fire' : ''}`
      }
    >
      <span
        aria-hidden="true"
        className={cx(!reduced && days > 0 && 'inline-block animate-flicker')}
        style={{ fontSize: blazing ? 16 : 14, filter: hot ? 'saturate(1.3)' : 'grayscale(0.4)' }}
      >
        🔥
      </span>
      <span className="font-mono text-[13px] font-semibold tabular-nums">{days}</span>
    </span>
  );
}
