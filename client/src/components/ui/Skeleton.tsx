import { cx } from './index';

/**
 * Skeletons instead of a spinner.
 *
 * A spinner says "wait"; a skeleton says "here is what is coming" — the layout
 * does not jump when data lands, and the wait *feels* shorter because the eye
 * already has structure to read.
 */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cx('animate-pulse rounded bg-line/60', className)} style={style} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cx('space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cx('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

/** Matches the dashboard's four stat cards. */
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card p-4">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="mt-3 h-7 w-16" />
          <Skeleton className="mt-3 h-1.5 w-full" />
        </div>
      ))}
    </div>
  );
}

/** Matches a list of rows (problems, questions, notes). */
export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="card divide-y divide-line">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
          <Skeleton className="h-3 flex-1" style={{ maxWidth: `${45 + ((i * 13) % 35)}%` }} />
          <Skeleton className="ml-auto h-[22px] w-14 shrink-0 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card p-4">
          <Skeleton className="h-4 w-2/5" />
          <SkeletonText lines={2} className="mt-3" />
        </div>
      ))}
    </div>
  );
}
