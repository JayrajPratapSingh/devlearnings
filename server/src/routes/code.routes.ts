import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { codeController } from '../controllers/code.controller';
import { asyncHandler } from '../middleware/async-handler';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { env } from '../config/env';

const router = Router();
router.use(requireAuth);

// Execution is the most expensive thing this API does — cap it per user.
const executionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  keyGenerator: (req) => req.user?.id ?? req.ip ?? 'anonymous',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: { code: 'RATE_LIMITED', message: 'Slow down — too many executions in the last minute' },
  },
});

const runBody = z.object({
  language: z.enum(['JAVASCRIPT', 'NODEJS', 'PYTHON']),
  code: z.string().min(1, 'Code is required').max(env.MAX_CODE_LENGTH),
  input: z.string().max(20_000).optional(),
});

const submitBody = z.object({
  language: z.enum(['JAVASCRIPT', 'NODEJS', 'PYTHON']),
  code: z.string().min(1, 'Code is required').max(env.MAX_CODE_LENGTH),
});

const slugParam = z.object({ slug: z.string().min(1).max(120) });

router.get('/health', asyncHandler(codeController.health));
router.post('/run', executionLimiter, validate({ body: runBody }), asyncHandler(codeController.run));
router.post(
  '/run/:slug',
  executionLimiter,
  validate({ params: slugParam, body: runBody }),
  asyncHandler(codeController.runProblem),
);
router.post(
  '/submit/:slug',
  executionLimiter,
  validate({ params: slugParam, body: submitBody }),
  asyncHandler(codeController.submit),
);

export default router;
