import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { userRepository } from '../repositories/user.repository';
import { Conflict, Unauthorized } from '../utils/errors';
import { normalisePhone } from './password-reset.service';
import type { AccessTokenPayload, AuthUser } from '../types/auth';

const AVATAR_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

export interface AuthResult {
  user: AuthUser & { avatarColor: string; currentStreak: number };
  accessToken: string;
  refreshToken: string;
}

function signAccessToken(user: { id: string; email: string; name: string }): string {
  const payload: AccessTokenPayload = { sub: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL,
  } as jwt.SignOptions);
}

async function issueRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await userRepository.saveRefreshToken(userId, token, expiresAt);
  return token;
}

export const authService = {
  async register(input: { email: string; name: string; password: string }): Promise<AuthResult> {
    const email = input.email.toLowerCase().trim();
    const existing = await userRepository.findByEmail(email);
    if (existing) throw Conflict('An account with this email already exists');

    const passwordHash = await bcrypt.hash(input.password, 12);
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)] ?? '#6366f1';

    const user = await userRepository.create({
      email,
      name: input.name.trim(),
      passwordHash,
      avatarColor,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarColor: user.avatarColor,
        currentStreak: user.currentStreak,
      },
      accessToken: signAccessToken(user),
      refreshToken: await issueRefreshToken(user.id),
    };
  },

  async login(input: { email: string; password: string }): Promise<AuthResult> {
    const user = await userRepository.findByEmail(input.email.toLowerCase().trim());
    // Same error for "no such user" and "bad password" — do not leak which accounts exist.
    if (!user) throw Unauthorized('Invalid email or password');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw Unauthorized('Invalid email or password');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarColor: user.avatarColor,
        currentStreak: user.currentStreak,
      },
      accessToken: signAccessToken(user),
      refreshToken: await issueRefreshToken(user.id),
    };
  },

  async refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const record = await userRepository.findRefreshToken(token);
    if (!record || record.revoked || record.expiresAt < new Date()) {
      throw Unauthorized('Refresh token is invalid or expired');
    }

    // Rotate: the presented token is burned and a fresh one issued.
    await userRepository.revokeRefreshToken(token);

    return {
      accessToken: signAccessToken(record.user),
      refreshToken: await issueRefreshToken(record.userId),
    };
  },

  async logout(token: string | undefined): Promise<void> {
    if (token) await userRepository.revokeRefreshToken(token);
  },

  /**
   * Permanently deletes the account and everything attached to it.
   *
   * Re-checks the password even though the caller is already authenticated: an
   * unattended open tab should not be enough to wipe someone's history. Every
   * relation is `onDelete: Cascade`, so the single delete takes progress,
   * submissions, notes, bookmarks, revisions and sessions with it.
   */
  async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) throw Unauthorized();

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw Unauthorized('Password is incorrect');

    await userRepository.deleteById(userId);
  },

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw Unauthorized();
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarColor: user.avatarColor,
      phone: user.phone,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      createdAt: user.createdAt,
    };
  },

  /** Adds or clears the recovery phone number. */
  async setPhone(userId: string, phone: string | null) {
    const normalised = phone ? normalisePhone(phone) : null;

    if (normalised) {
      if (!/^\+\d{10,15}$/.test(normalised)) {
        throw Conflict('Enter a valid phone number, e.g. 9876543210 or +919876543210');
      }
      const existing = await userRepository.findByPhone(normalised);
      if (existing && existing.id !== userId) {
        throw Conflict('That phone number is already linked to another account');
      }
    }

    const user = await userRepository.setPhone(userId, normalised);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarColor: user.avatarColor,
      phone: user.phone,
      currentStreak: user.currentStreak,
    };
  },
};
