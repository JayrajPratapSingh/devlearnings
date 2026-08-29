import { Router } from 'express';
import { z } from 'zod';
import { topicController } from '../controllers/topic.controller';
import { asyncHandler } from '../middleware/async-handler';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
router.use(requireAuth);

const slugParam = z.object({ slug: z.string().min(1).max(120) });

router.get('/categories', asyncHandler(topicController.listCategories));
router.get(
  '/categories/:categorySlug',
  validate({ params: z.object({ categorySlug: z.string().min(1).max(120) }) }),
  asyncHandler(topicController.listByCategory),
);
// Above /:slug, otherwise "titles" is captured as a topic slug.
router.get(
  '/titles',
  validate({ query: z.object({ slugs: z.string().max(4000).optional() }) }),
  asyncHandler(topicController.titles),
);
router.get('/:slug', validate({ params: slugParam }), asyncHandler(topicController.getBySlug));
router.patch(
  '/:slug/status',
  validate({
    params: slugParam,
    body: z.object({
      status: z.enum(['NEW', 'LEARNING', 'KNOWN', 'NEEDS_REVISION']),
      confidence: z.number().int().min(0).max(5).optional(),
    }),
  }),
  asyncHandler(topicController.setStatus),
);

export default router;
