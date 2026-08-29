import type { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { passwordResetService } from '../services/password-reset.service';
import { currentUser } from '../middleware/auth';
import { env, isProd } from '../config/env';
import { Unauthorized } from '../utils/errors';

const REFRESH_COOKIE = 'refreshToken';

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({ user: result.user, accessToken: result.accessToken });
  },

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.json({ user: result.user, accessToken: result.accessToken });
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const token = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    if (!token) throw Unauthorized('No refresh token');
    const result = await authService.refresh(token);
    setRefreshCookie(res, result.refreshToken);
    res.json({ accessToken: result.accessToken });
  },

  async logout(req: Request, res: Response): Promise<void> {
    const token = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    await authService.logout(token);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    res.status(204).send();
  },

  async me(req: Request, res: Response): Promise<void> {
    res.json({ user: await authService.me(currentUser(req).id) });
  },

  /** POST /api/auth/password/forgot — always 200, never reveals if the account exists. */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { identifier } = req.body as { identifier: string };
    res.json(await passwordResetService.requestReset(identifier));
  },

  /** POST /api/auth/password/reset — code + new password. */
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { identifier, code, password } = req.body as {
      identifier: string;
      code: string;
      password: string;
    };
    await passwordResetService.confirmReset(identifier, code, password);
    res.status(204).send();
  },

  /** POST /api/auth/password/change — signed in, requires the current password. */
  async changePassword(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };
    await passwordResetService.changePassword(currentUser(req).id, currentPassword, newPassword);
    // Every session was revoked, including this one — clear the cookie too.
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    res.status(204).send();
  },

  /** PATCH /api/auth/phone — add or clear the recovery number. */
  async setPhone(req: Request, res: Response): Promise<void> {
    const { phone } = req.body as { phone: string | null };
    const user = await authService.setPhone(currentUser(req).id, phone);
    res.json({ user });
  },

  async deleteAccount(req: Request, res: Response): Promise<void> {
    const { password } = req.body as { password: string };
    await authService.deleteAccount(currentUser(req).id, password);
    // The account is gone; make sure the browser's session goes with it.
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    res.status(204).send();
  },
};
