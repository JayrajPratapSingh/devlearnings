import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { prisma } from '../config/prisma';
import { env, isProd } from '../config/env';
import { userRepository } from '../repositories/user.repository';
import { messageProvider, isConsoleProvider } from './messaging';
import { BadRequest, Unauthorized } from '../utils/errors';
import { logger } from '../utils/logger';

/** Masks a destination so the UI can confirm where it went without leaking it. */
function mask(value: string): string {
  if (value.includes('@')) {
    const [name = '', domain = ''] = value.split('@');
    const head = name.slice(0, 2);
    return `${head}${'•'.repeat(Math.max(1, name.length - 2))}@${domain}`;
  }
  return `${'•'.repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

/** 6 digits, from a CSPRNG — Math.random is predictable and not acceptable here. */
function generateCode(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

export interface ForgotResult {
  /** Always true. The caller must not learn whether the account exists. */
  sent: true;
  sentToMasked: string | null;
  channel: 'EMAIL' | 'SMS';
  expiresInMinutes: number;
  /** Development only, with the console driver: lets the UI complete the flow. */
  devCode?: string;
  devNote?: string;
}

export const passwordResetService = {
  /**
   * Starts a reset. Deliberately returns the same shape whether or not the
   * account exists — otherwise this endpoint becomes a way to enumerate which
   * emails and phone numbers are registered.
   */
  async requestReset(identifier: string): Promise<ForgotResult> {
    const value = identifier.trim();
    const isEmail = value.includes('@');

    const user = isEmail
      ? await userRepository.findByEmail(value.toLowerCase())
      : await userRepository.findByPhone(normalisePhone(value));

    const base: ForgotResult = {
      sent: true,
      sentToMasked: null,
      channel: isEmail ? 'EMAIL' : 'SMS',
      expiresInMinutes: env.RESET_CODE_TTL_MINUTES,
    };

    if (!user) {
      // Burn roughly the same time as the real path so timing does not leak.
      await bcrypt.hash(generateCode(), 10);
      logger.info('Password reset requested for an unknown identifier');
      return base;
    }

    const destination = isEmail ? user.email : (user.phone ?? '');
    if (!destination) return base;

    // Any earlier code becomes useless the moment a new one is issued.
    await prisma.passwordResetCode.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + env.RESET_CODE_TTL_MINUTES * 60_000);

    await prisma.passwordResetCode.create({
      data: {
        userId: user.id,
        codeHash: await bcrypt.hash(code, 10),
        channel: isEmail ? 'EMAIL' : 'SMS',
        sentTo: destination,
        expiresAt,
      },
    });

    const delivery = await messageProvider.sendOtp(destination, code, env.RESET_CODE_TTL_MINUTES);
    if (!delivery.ok) logger.error('Reset code delivery failed', { detail: delivery.detail });

    return {
      ...base,
      sentToMasked: mask(destination),
      // Never expose the code in production, whatever the driver says.
      ...(!isProd && isConsoleProvider() && delivery.devCode
        ? {
            devCode: delivery.devCode,
            devNote: 'Development only — SMS_PROVIDER is "console", so the code is shown here and in the server log.',
          }
        : {}),
    };
  },

  /** Completes a reset. Throws only on a genuinely bad code. */
  async confirmReset(identifier: string, code: string, newPassword: string): Promise<void> {
    const value = identifier.trim();
    const isEmail = value.includes('@');

    const user = isEmail
      ? await userRepository.findByEmail(value.toLowerCase())
      : await userRepository.findByPhone(normalisePhone(value));

    if (!user) throw BadRequest('That code is not valid or has expired');

    const record = await prisma.passwordResetCode.findFirst({
      where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw BadRequest('That code is not valid or has expired');

    if (record.attempts >= env.RESET_MAX_ATTEMPTS) {
      await prisma.passwordResetCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
      throw BadRequest('Too many incorrect attempts. Request a new code.');
    }

    const matches = await bcrypt.compare(code.trim(), record.codeHash);
    if (!matches) {
      await prisma.passwordResetCode.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      const left = env.RESET_MAX_ATTEMPTS - (record.attempts + 1);
      throw BadRequest(
        left > 0
          ? `That code is not correct. ${left} attempt${left === 1 ? '' : 's'} left.`
          : 'Too many incorrect attempts. Request a new code.',
      );
    }

    await prisma.$transaction([
      prisma.passwordResetCode.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await bcrypt.hash(newPassword, 12) },
      }),
      // A reset must end every existing session, or a stolen refresh token
      // would survive the very thing the user did to lock the attacker out.
      prisma.refreshToken.updateMany({
        where: { userId: user.id, revoked: false },
        data: { revoked: true },
      }),
    ]);
  },

  /** Changing a password while signed in still requires the current one. */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) throw Unauthorized();

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw Unauthorized('Current password is incorrect');

    if (await bcrypt.compare(newPassword, user.passwordHash)) {
      throw BadRequest('New password must be different from the current one');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash: await bcrypt.hash(newPassword, 12) },
      }),
      prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
      }),
    ]);
  },
};

/**
 * Normalises to E.164. A bare 10-digit number is assumed to be Indian, which is
 * the common case here; anything already carrying a country code is preserved.
 */
export function normalisePhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return `+${digits}`;
}
