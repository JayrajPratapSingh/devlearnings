import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/async-handler';
import { requireAuth } from '../middleware/auth';
import { isProd } from '../config/env';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

/**
 * Credential endpoints get tighter budgets than the rest of the API, but not
 * one shared budget — a user fumbling their password should not also lock
 * themselves out of the reset flow that fixes it. So sign-in and recovery are
 * counted separately.
 *
 * Development gets a much larger allowance: it is a single user on localhost,
 * and a shared 20-per-15-minutes made the test suite trip over itself.
 */
function credentialLimiter(productionLimit: number, message: string) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: isProd ? productionLimit : productionLimit * 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // Per account where we can see one, so one noisy client cannot lock out
    // everybody sharing an IP (office, college, NAT).
    keyGenerator: (req) => {
      const body = req.body as { email?: string; identifier?: string } | undefined;
      const who = body?.email ?? body?.identifier;
      return who ? `${req.ip}:${who.toLowerCase()}` : (req.ip ?? 'anonymous');
    },
    message: { error: { code: 'RATE_LIMITED', message } },
  });
}

const authLimiter = credentialLimiter(10, 'Too many sign-in attempts. Try again in a few minutes.');

const recoveryLimiter = credentialLimiter(
  6,
  'Too many password reset requests. Try again in a few minutes.',
);

router.post('/register', authLimiter, validate({ body: registerSchema }), asyncHandler(authController.register));
router.post('/login', authLimiter, validate({ body: loginSchema }), asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', requireAuth, asyncHandler(authController.me));

/* ------------------------------ password reset ----------------------------- */

const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100)
  .regex(/[a-zA-Z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number');

// Email or phone. Both endpoints are brute-force targets, so they share the
// tighter credential limiter rather than the general API budget.
router.post(
  '/password/forgot',
  recoveryLimiter,
  validate({ body: z.object({ identifier: z.string().min(3).max(180) }) }),
  asyncHandler(authController.forgotPassword),
);

router.post(
  '/password/reset',
  recoveryLimiter,
  validate({
    body: z.object({
      identifier: z.string().min(3).max(180),
      code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
      password: strongPassword,
    }),
  }),
  asyncHandler(authController.resetPassword),
);

router.post(
  '/password/change',
  recoveryLimiter,
  requireAuth,
  validate({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: strongPassword,
    }),
  }),
  asyncHandler(authController.changePassword),
);

router.patch(
  '/phone',
  requireAuth,
  validate({ body: z.object({ phone: z.string().max(20).nullable() }) }),
  asyncHandler(authController.setPhone),
);

// Destructive and irreversible, so it re-checks the password and shares the
// tighter credential rate limit rather than the general API budget.
router.delete(
  '/me',
  recoveryLimiter,
  requireAuth,
  validate({ body: z.object({ password: z.string().min(1, 'Password is required') }) }),
  asyncHandler(authController.deleteAccount),
);

export default router;
