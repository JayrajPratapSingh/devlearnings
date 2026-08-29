import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { endpoints } from '../services/endpoints';
import { Button, Input, cx } from './ui';

/**
 * Account settings: recovery phone and password change.
 *
 * Both are security-sensitive, so both are honest about consequences —
 * changing the password signs every session out, and the dialog says so before
 * you press the button rather than after.
 */
export function AccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout, refreshUser } = useAuth();
  const [tab, setTab] = useState<'phone' | 'password'>('phone');

  const [phone, setPhone] = useState('');
  const [phoneBusy, setPhoneBusy] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwDone, setPwDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPhone(user?.phone ?? '');
    setPhoneMsg(null);
    setCurrent('');
    setNext('');
    setPwError(null);
    setPwDone(false);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, user?.phone]);

  if (!open) return null;

  const savePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneBusy(true);
    setPhoneMsg(null);
    try {
      await endpoints.auth.setPhone(phone.trim() || null);
      await refreshUser();
      setPhoneMsg({
        ok: true,
        text: phone.trim() ? 'Phone number save ho gaya.' : 'Phone number hata diya.',
      });
    } catch (err) {
      setPhoneMsg({ ok: false, text: err instanceof Error ? err.message : 'Could not save' });
    } finally {
      setPhoneBusy(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwBusy(true);
    setPwError(null);
    try {
      await endpoints.auth.changePassword(current, next);
      setPwDone(true);
      // Every session was revoked server-side, including this one.
      setTimeout(() => void logout(), 1800);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Could not change the password');
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="card animate-scale-in w-full max-w-md overflow-hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-dialog-title"
      >
        <div className="border-b border-line px-5 pt-4">
          <h2 id="account-dialog-title" className="text-base font-semibold text-content">
            Account settings
          </h2>
          <p className="mt-0.5 truncate text-[13px] text-content-muted">{user?.email}</p>

          <div className="mt-3 flex gap-1">
            {([
              ['phone', 'Recovery phone'],
              ['password', 'Change password'],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cx(
                  '-mb-px border-b-2 px-3 py-2 text-[13px] transition-colors',
                  tab === id
                    ? 'border-brand font-medium text-content'
                    : 'border-transparent text-content-muted hover:text-content',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'phone' && (
          <form onSubmit={savePhone} className="space-y-4 px-5 py-4">
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-[13px] font-medium text-content">
                Phone number
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                inputMode="tel"
                autoComplete="tel"
              />
              <p className="mt-1.5 text-xs leading-5 text-content-subtle">
                Sirf password reset ke liye. 10-digit number apne aap +91 ban jayega. Khaali chhod
                kar save karein to hat jayega.
              </p>
            </div>

            {phoneMsg && (
              <div
                className={cx(
                  'rounded-lg border px-3 py-2 text-[13px]',
                  phoneMsg.ok
                    ? 'border-easy/30 bg-easy/10 text-easy'
                    : 'border-hard/30 bg-hard/10 text-hard',
                )}
              >
                {phoneMsg.text}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" loading={phoneBusy}>
                Save
              </Button>
            </div>
          </form>
        )}

        {tab === 'password' && (
          <form onSubmit={savePassword} className="space-y-4 px-5 py-4">
            {pwDone ? (
              <div className="rounded-lg border border-easy/30 bg-easy/10 px-3 py-3 text-center">
                <p className="text-[13px] text-easy">Password badal gaya.</p>
                <p className="mt-1 text-[12px] text-content-muted">
                  Saari sessions logout ho gayi — dobara sign in karein.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="current-pw" className="mb-1.5 block text-[13px] font-medium text-content">
                    Current password
                  </label>
                  <Input
                    id="current-pw"
                    type="password"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <div>
                  <label htmlFor="next-pw" className="mb-1.5 block text-[13px] font-medium text-content">
                    New password
                  </label>
                  <Input
                    id="next-pw"
                    type="password"
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    placeholder="Kam se kam 8 characters"
                    autoComplete="new-password"
                  />
                </div>

                <p className="text-xs leading-5 text-content-subtle">
                  Password badalne par har device se logout ho jayega — ye jaanbujh kar hai, taaki
                  kisi purani session ka access khatam ho jaye.
                </p>

                {pwError && (
                  <div className="rounded-lg border border-hard/30 bg-hard/10 px-3 py-2 text-[13px] text-hard">
                    {pwError}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={pwBusy}
                    disabled={!current || next.length < 8}
                  >
                    Change password
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
