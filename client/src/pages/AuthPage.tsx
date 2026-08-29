import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Spinner } from '../components/ui';
import { AuthShowcase, AuthStatStrip } from '../components/AuthShowcase';
import { ApiError } from '../services/api';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

/** Client-side checks mirror the server's Zod rules — UX only, never trusted. */
function validate(mode: 'login' | 'register', values: { name: string; email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};

  if (mode === 'register' && values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (mode === 'register') {
    if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/[a-zA-Z]/.test(values.password)) errors.password = 'Include at least one letter';
    else if (!/[0-9]/.test(values.password)) errors.password = 'Include at least one number';
  } else if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
}

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { user, loading, login, register } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Spinner size={22} className="text-content-subtle" />
      </div>
    );
  }
  if (user) {
    const from = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const found = validate(mode, values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      if (mode === 'login') await login(values.email, values.password);
      else await register(values.name, values.email, values.password);
    } catch (err) {
      if (err instanceof ApiError && Array.isArray(err.details)) {
        // Surface server field errors on the matching input.
        const serverErrors: FieldErrors = {};
        for (const issue of err.details as { path: string; message: string }[]) {
          if (issue.path === 'name' || issue.path === 'email' || issue.path === 'password') {
            serverErrors[issue.path] = issue.message;
          }
        }
        setErrors(serverErrors);
        setFormError(Object.keys(serverErrors).length ? null : err.message);
      } else {
        setFormError(err instanceof Error ? err.message : 'Something went wrong');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof FieldErrors) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
  });

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
              {mode === 'login' ? 'Welcome back' : 'Create your workspace'}
            </h1>
            <p className="mt-1.5 text-sm text-content-muted">
              {mode === 'login'
                ? 'Pick up where you left off.'
                : 'Your private Full Stack interview preparation IDE.'}
            </p>
          </div>

          <div className="mb-6">
            <AuthStatStrip />
          </div>

          <form onSubmit={onSubmit} className="card animate-fade-up space-y-4 p-6" noValidate>
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-content">
                Name
              </label>
              <Input id="name" autoComplete="name" placeholder="Jay" {...field('name')} />
              {errors.name && <p className="mt-1.5 text-xs text-hard">{errors.name}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-content">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...field('email')}
            />
            {errors.email && <p className="mt-1.5 text-xs text-hard">{errors.email}</p>}
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="password" className="block text-[13px] font-medium text-content">
                Password
              </label>
              {mode === 'login' && (
                <Link to="/forgot-password" className="text-[12px] text-brand hover:underline">
                  Bhool gaye?
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
              {...field('password')}
            />
            {errors.password && <p className="mt-1.5 text-xs text-hard">{errors.password}</p>}
          </div>

          {formError && (
            <div className="rounded-lg border border-hard/30 bg-hard/10 px-3 py-2">
              <p className="text-[13px] text-hard">{formError}</p>
              {/* The API deliberately cannot say WHICH of the two was wrong —
                  that would let anyone probe which emails have accounts. So the
                  UI explains the ambiguity rather than leaving it confusing. */}
              {mode === 'login' && (
                <p className="mt-1.5 text-[12px] leading-5 text-content-muted">
                  Email aur password dono saath check hote hain — ye message tab bhi aata hai jab is
                  email ka account hi na bana ho.{' '}
                  <Link to="/register" className="font-medium text-brand hover:underline">
                    Naya account banayein
                  </Link>
                  .
                </p>
              )}
            </div>
          )}

          <Button type="submit" variant="primary" loading={submitting} className="w-full">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>

            <p className="text-center text-[13px] text-content-muted">
              {mode === 'login' ? (
                <>
                  New here?{' '}
                  <Link to="/register" className="font-medium text-brand hover:underline">
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-brand hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </form>

          <p className="mt-5 text-center text-[11px] text-content-subtle">
            Sab kuch aapke apne machine par — koi data bahar nahi jata.
          </p>
        </div>
      </div>
    </div>
  );
}
