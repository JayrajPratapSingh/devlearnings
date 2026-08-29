import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { endpoints } from '../services/endpoints';
import { AuthShowcase } from '../components/AuthShowcase';
import { Button, Input, cx } from '../components/ui';

type Step = 'identify' | 'verify' | 'done';

interface SentInfo {
  sentToMasked: string | null;
  channel: 'EMAIL' | 'SMS';
  expiresInMinutes: number;
  devCode?: string;
  devNote?: string;
}

/**
 * Two-step reset: prove you can receive a code, then set a new password.
 *
 * Step one always advances, even for an identifier that has no account — the
 * API deliberately cannot say whether it exists, so the UI must not either.
 * A wrong email simply never receives a code.
 */
export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('identify');
  const [identifier, setIdentifier] = useState('');
  const [sent, setSent] = useState<SentInfo | null>(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const requestCode = async (e: FormEvent) => {
    e.preventDefault();
    if (identifier.trim().length < 3) {
      setError('Apna email ya phone number likhein');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const res = await endpoints.auth.forgotPassword(identifier.trim());
      setSent(res);
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code');
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await endpoints.auth.resetPassword(identifier.trim(), code.trim(), password);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset the password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AuthShowcase />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand font-mono text-lg font-bold text-white">
              ⌘
            </div>
            <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">
              {step === 'done' ? 'Password badal gaya' : 'Password bhool gaye?'}
            </h1>
            <p className="mt-1.5 text-sm text-content-muted">
              {step === 'identify' && 'Email ya phone daalein — 6-digit code bhejenge.'}
              {step === 'verify' && 'Code daalein aur naya password set karein.'}
              {step === 'done' && 'Ab naye password se sign in karein.'}
            </p>
          </div>

          {/* Step indicator — two steps, so show them rather than hide the shape */}
          {step !== 'done' && (
            <div className="mb-4 flex items-center gap-2">
              {(['identify', 'verify'] as const).map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-2">
                  <span
                    className={cx(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                      step === s || (s === 'identify' && step === 'verify')
                        ? 'bg-brand text-white'
                        : 'bg-surface-sunken text-content-subtle',
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cx(
                      'h-0.5 flex-1 rounded-full',
                      step === 'verify' && i === 0 ? 'bg-brand' : 'bg-surface-sunken',
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 'identify' && (
            <form onSubmit={requestCode} className="card animate-fade-up space-y-4 p-6" noValidate>
              <div>
                <label htmlFor="identifier" className="mb-1.5 block text-[13px] font-medium text-content">
                  Email ya phone
                </label>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com ya 9876543210"
                  autoComplete="username"
                />
                <p className="mt-1.5 text-xs text-content-subtle">
                  Phone tabhi chalega jab aapne account mein add kiya ho.
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-hard/30 bg-hard/10 px-3 py-2 text-[13px] text-hard">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" loading={busy} className="w-full">
                Code bhejein
              </Button>

              <p className="text-center text-[13px] text-content-muted">
                <Link to="/login" className="font-medium text-brand hover:underline">
                  Wapas sign in par
                </Link>
              </p>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={submitReset} className="card animate-fade-up space-y-4 p-6" noValidate>
              <div className="rounded-lg border border-line bg-surface-sunken px-3 py-2.5">
                <p className="text-[13px] text-content-muted">
                  {sent?.sentToMasked ? (
                    <>
                      Code bheja gaya{' '}
                      <span className="font-mono text-content">{sent.sentToMasked}</span> par.
                    </>
                  ) : (
                    'Agar is email/phone ka account hai, to code bhej diya gaya hai.'
                  )}{' '}
                  {sent?.expiresInMinutes} minute tak valid.
                </p>
              </div>

              {/* Console driver: show the code so the flow is usable with no SMS account */}
              {sent?.devCode && (
                <div className="rounded-lg border border-medium/30 bg-medium/10 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-medium">
                    Development
                  </p>
                  <p className="mt-1 font-mono text-xl font-semibold tracking-[0.3em] text-content">
                    {sent.devCode}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-content-muted">{sent.devNote}</p>
                </div>
              )}

              <div>
                <label htmlFor="code" className="mb-1.5 block text-[13px] font-medium text-content">
                  6-digit code
                </label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="text-center font-mono text-lg tracking-[0.4em]"
                />
              </div>

              <div>
                <label htmlFor="new-password" className="mb-1.5 block text-[13px] font-medium text-content">
                  Naya password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kam se kam 8 characters"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-hard/30 bg-hard/10 px-3 py-2 text-[13px] text-hard">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                loading={busy}
                disabled={code.length !== 6 || password.length < 8}
                className="w-full"
              >
                Password reset karein
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep('identify');
                  setCode('');
                  setError(null);
                }}
                className="w-full text-center text-[13px] text-content-muted hover:text-content"
              >
                Doosra email/phone try karein
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="card animate-fade-up space-y-4 p-6 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-easy/15 text-xl text-easy">
                ✓
              </div>
              <p className="text-[13px] leading-6 text-content-muted">
                Password update ho gaya. Saari purani sessions bhi logout kar di gayi hain —
                agar kisi aur ke paas access tha, ab nahi hai.
              </p>
              <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
                Sign in
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
