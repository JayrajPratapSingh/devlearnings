import { useEffect, useRef, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { endpoints } from '../services/endpoints';
import { Button, Input } from './ui';

/**
 * Deleting an account is irreversible, so the dialog makes the user do two
 * deliberate things: type their own email, and re-enter their password. The
 * email box is the "are you sure" (you cannot do it by muscle memory) and the
 * password is the "are you you" (an unattended tab is not enough).
 *
 * It also shows exactly what will be destroyed, using the user's real numbers —
 * a vague "this cannot be undone" tells them nothing.
 */
export function DeleteAccountDialog({
  email,
  open,
  onClose,
  onDeleted,
}: {
  email: string;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Only fetched while the dialog is open — no cost on every page load.
  const { data: stats } = useApi(
    () => (open ? endpoints.progress.dashboard() : Promise.resolve(null)),
    [open],
  );

  useEffect(() => {
    if (!open) return;
    setConfirmEmail('');
    setPassword('');
    setError(null);
    requestAnimationFrame(() => firstFieldRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const emailMatches = confirmEmail.trim().toLowerCase() === email.toLowerCase();
  const canDelete = emailMatches && password.length > 0 && !deleting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canDelete) return;

    setDeleting(true);
    setError(null);
    try {
      await endpoints.auth.deleteAccount(password);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the account');
      setDeleting(false);
    }
  };

  const losing = stats
    ? [
        { n: stats.dsa.solved, label: `problem${stats.dsa.solved === 1 ? '' : 's'} solved` },
        { n: stats.totalSubmissions, label: `submission${stats.totalSubmissions === 1 ? '' : 's'}` },
        { n: stats.topics.completed, label: 'topics marked known' },
        { n: stats.streak, label: 'day streak' },
      ].filter((x) => x.n > 0)
    : [];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        className="card animate-scale-in w-full max-w-md overflow-hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
      >
        <div className="border-b border-line px-5 py-4">
          <h2 id="delete-account-title" className="text-base font-semibold text-content">
            Delete your account
          </h2>
          <p className="mt-1 text-[13px] leading-6 text-content-muted">
            Ye permanently delete ho jayega — wapas nahi aayega.
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          {losing.length > 0 && (
            <div className="rounded-lg border border-hard/25 bg-hard/5 px-3 py-2.5">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-hard">
                You will lose
              </p>
              <ul className="space-y-0.5">
                {losing.map((x) => (
                  <li key={x.label} className="text-[13px] text-content-muted">
                    <span className="font-mono font-semibold tabular-nums text-content">{x.n}</span>{' '}
                    {x.label}
                  </li>
                ))}
                <li className="text-[13px] text-content-muted">
                  plus all notes, bookmarks and revision progress
                </li>
              </ul>
            </div>
          )}

          <div>
            <label htmlFor="confirm-email" className="mb-1.5 block text-[13px] font-medium text-content">
              Confirm karne ke liye apna email likhein
            </label>
            <Input
              id="confirm-email"
              ref={firstFieldRef}
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={email}
              autoComplete="off"
              spellCheck={false}
            />
            {confirmEmail.length > 0 && !emailMatches && (
              <p className="mt-1.5 text-xs text-content-subtle">Email match nahi kar raha.</p>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-[13px] font-medium text-content">
              Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-hard/30 bg-hard/10 px-3 py-2 text-[13px] text-hard">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-5 py-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={deleting} disabled={!canDelete}>
            Delete account
          </Button>
        </div>
      </form>
    </div>
  );
}
