const BASE_URL = (import.meta.env['VITE_API_URL'] as string | undefined) ?? '/api';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * The access token lives in memory only, never in localStorage — an XSS payload
 * can read localStorage, but not a module-scoped variable. The refresh token is
 * an httpOnly cookie the browser sends automatically and JS cannot read at all.
 */
let accessToken: string | null = null;
let onUnauthenticated: (() => void) | null = null;

export const tokenStore = {
  set: (token: string | null) => {
    accessToken = token;
  },
  get: () => accessToken,
  onExpired: (handler: () => void) => {
    onUnauthenticated = handler;
  },
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Internal: prevents an endless refresh loop. */
  retrying?: boolean;
}

// A single in-flight refresh shared by every 401, so ten parallel requests
// failing at once produce one refresh call rather than ten.
let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  refreshInFlight ??= (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { accessToken: string };
      accessToken = data.accessToken;
      return true;
    } catch {
      return false;
    } finally {
      // Release the lock on the next tick so concurrent callers all see the result.
      setTimeout(() => {
        refreshInFlight = null;
      }, 0);
    }
  })();

  return refreshInFlight;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, retrying, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  // Only the endpoints that would loop are excluded. `/auth/me` must be allowed
  // to retry: on a page reload the in-memory access token is gone but the
  // httpOnly refresh cookie is still valid, and that first `/auth/me` is exactly
  // what has to trigger the refresh — otherwise every reload signs the user out.
  const noRetry = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/logout'];

  if (res.status === 401 && !retrying && !noRetry.includes(path)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request<T>(path, { ...options, retrying: true });
    accessToken = null;
    onUnauthenticated?.();
  }

  if (res.status === 204) return undefined as T;

  const payload: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const error = (payload as { error?: { code?: string; message?: string; details?: unknown } })
      ?.error;
    throw new ApiError(
      res.status,
      error?.code ?? 'UNKNOWN',
      error?.message ?? `Request failed with status ${res.status}`,
      error?.details,
    );
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/** Builds a query string, skipping empty values so filters stay clean. */
export function qs(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : '';
}
