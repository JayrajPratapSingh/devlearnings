import { Router } from 'express';
import { z } from 'zod';
import { dsaController } from '../controllers/dsa.controller';
import { asyncHandler } from '../middleware/async-handler';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
router.use(requireAuth);

const slugParam = z.object({ slug: z.string().min(1).max(120) });

router.get(
  '/',
  validate({
    query: z.object({
      category: z.string().max(60).optional(),
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
      status: z.enum(['NOT_STARTED', 'ATTEMPTED', 'SOLVED', 'NEEDS_REVISION']).optional(),
      search: z.string().max(120).optional(),
    }),
  }),
  asyncHandler(dsaController.list),
);
router.get('/categories', asyncHandler(dsaController.categories));
// Above /:slug, otherwise "daily" is captured as a problem slug.
router.get('/daily', asyncHandler(dsaController.daily));
router.get('/stats/difficulty', asyncHandler(dsaController.difficultyBreakdown));
router.get('/:slug', validate({ params: slugParam }), asyncHandler(dsaController.getBySlug));
router.patch(
  '/:slug/status',
  validate({
    params: slugParam,
    body: z.object({ status: z.enum(['NOT_STARTED', 'ATTEMPTED', 'SOLVED', 'NEEDS_REVISION']) }),
  }),
  asyncHandler(dsaController.setStatus),
);

export default router;
