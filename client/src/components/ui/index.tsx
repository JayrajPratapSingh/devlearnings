import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import type { Difficulty, LearningStatus, ProblemStatus } from '../../types';

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/* ---------------------------------- Button ---------------------------------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand/90 disabled:hover:bg-brand',
  secondary: 'bg-surface-raised text-content border border-line hover:border-content-subtle',
  ghost: 'text-content-muted hover:bg-surface-raised hover:text-content',
  danger: 'bg-hard/15 text-hard border border-hard/30 hover:bg-hard/25',
  success: 'bg-easy/15 text-easy border border-easy/30 hover:bg-easy/25',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-10 px-4 text-sm',
        BUTTON_VARIANTS[variant],
        className,
      )}
    >
      {loading ? <Spinner size={14} /> : icon}
      {children}
    </button>
  );
}

/* ---------------------------------- Spinner --------------------------------- */

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cx('animate-spin', className)}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ----------------------------------- Badge ---------------------------------- */

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    EASY: 'text-easy bg-easy/10 border-easy/25',
    MEDIUM: 'text-medium bg-medium/10 border-medium/25',
    HARD: 'text-hard bg-hard/10 border-hard/25',
  };
  const label = level.charAt(0) + level.slice(1).toLowerCase();
  return (
    <span
      className={cx(
        'inline-flex h-[22px] items-center rounded-md border px-2 text-[11px] font-semibold tracking-wide',
        styles[level],
      )}
    >
      {label}
    </span>
  );
}

export function StatusPill({ status }: { status: ProblemStatus | LearningStatus }) {
  const map: Record<string, { label: string; className: string }> = {
    NOT_STARTED: { label: 'Not started', className: 'text-content-subtle bg-surface-sunken' },
    NEW: { label: 'New', className: 'text-content-subtle bg-surface-sunken' },
    ATTEMPTED: { label: 'Attempted', className: 'text-medium bg-medium/10' },
    LEARNING: { label: 'Learning', className: 'text-medium bg-medium/10' },
    SOLVED: { label: 'Solved', className: 'text-easy bg-easy/10' },
    KNOWN: { label: 'Known', className: 'text-easy bg-easy/10' },
    NEEDS_REVISION: { label: 'Needs revision', className: 'text-hard bg-hard/10' },
  };
  const entry = map[status] ?? map['NEW']!;
  return (
    <span className={cx('inline-flex h-[22px] items-center rounded-md px-2 text-[11px] font-medium', entry.className)}>
      {entry.label}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[22px] items-center rounded-md bg-surface-sunken px-2 font-mono text-[11px] text-content-subtle">
      {children}
    </span>
  );
}

/* ---------------------------------- Progress -------------------------------- */

export function ProgressBar({
  percent,
  className,
  tone = 'brand',
}: {
  percent: number;
  className?: string;
  tone?: 'brand' | 'easy' | 'medium' | 'hard';
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const tones = { brand: 'bg-brand', easy: 'bg-easy', medium: 'bg-medium', hard: 'bg-hard' };
  return (
    <div
      className={cx('h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken', className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cx('h-full rounded-full transition-[width] duration-500', tones[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* ------------------------------- Page states -------------------------------- */

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-sm text-content-muted">
      <Spinner />
      {label}…
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card animate-fade-up flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hard/10 text-lg text-hard">!</div>
      <div>
        <p className="font-medium text-content">Something went wrong</p>
        <p className="mt-1 max-w-md text-sm text-content-muted">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card animate-fade-up flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-content-subtle">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-content">{title}</p>
        {description && <p className="mt-1 max-w-md text-sm text-content-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------------------------- Inputs ---------------------------------- */

/** forwardRef so callers can focus it — dialogs need to place the caret. */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        {...rest}
        ref={ref}
        className={cx(
          'h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-content',
          'placeholder:text-content-subtle focus:border-brand focus:outline-none',
          className,
        )}
      />
    );
  },
);

/** forwardRef so recall/dialog flows can put the caret where it belongs. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea
        {...rest}
        ref={ref}
        className={cx(
          'w-full rounded-lg border border-line bg-surface p-3 text-sm text-content',
          'placeholder:text-content-subtle focus:border-brand focus:outline-none',
          className,
        )}
      />
    );
  },
);

export function Select({
  value,
  onChange,
  options,
  className,
  'aria-label': ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cx(
        'h-9 rounded-lg border border-line bg-surface px-2.5 text-[13px] text-content',
        'focus:border-brand focus:outline-none',
        className,
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* ----------------------------------- Card ----------------------------------- */

export function StatCard({
  label,
  value,
  hint,
  percent,
  tone = 'brand',
}: {
  label: string;
  value: string | number;
  hint?: string;
  percent?: number;
  tone?: 'brand' | 'easy' | 'medium' | 'hard';
}) {
  return (
    <div className="card animate-fade-up p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-content-subtle">{label}</p>
      <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-content">{value}</p>
      {percent !== undefined && <ProgressBar percent={percent} className="mt-3" tone={tone} />}
      {hint && <p className="mt-2 text-xs text-content-muted">{hint}</p>}
    </div>
  );
}

export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-content">{title}</h2>
      {action}
    </div>
  );
}
