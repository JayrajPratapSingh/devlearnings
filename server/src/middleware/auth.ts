import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Unauthorized } from '../utils/errors';
import type { AccessTokenPayload, AuthUser } from '../types/auth';

function readToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  const cookie = (req.cookies as Record<string, string> | undefined)?.['accessToken'];
  return cookie ?? null;
}

/** Rejects the request unless a valid access token is present. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = readToken(req);
  if (!token) return next(Unauthorized());

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    const user: AuthUser = { id: payload.sub, email: payload.email, name: payload.name };
    req.user = user;
    next();
  } catch {
    next(Unauthorized('Session expired, please sign in again'));
  }
}

/** Attaches the user when a token is present, but never rejects. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = readToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
      req.user = { id: payload.sub, email: payload.email, name: payload.name };
    } catch {
      /* ignore — treated as anonymous */
    }
  }
  next();
}

/** Narrow helper so controllers get a non-optional user without repeating guards. */
export function currentUser(req: Request): AuthUser {
  if (!req.user) throw Unauthorized();
  return req.user;
}
