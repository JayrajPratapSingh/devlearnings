import { Router } from 'express';
import { z } from 'zod';
import authRoutes from './auth.routes';
import topicRoutes from './topic.routes';
import dsaRoutes from './dsa.routes';
import codeRoutes from './code.routes';
import courseRoutes from './courses.routes';
import { asyncHandler } from '../middleware/async-handler';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  bookmarkController,
  mockController,
  noteController,
  progressController,
  questionController,
  revisionController,
  searchController,
} from '../controllers/misc.controller';

const router = Router();

const idParam = z.object({ id: z.string().min(1).max(60) });
const learningStatus = z.enum(['NEW', 'LEARNING', 'KNOWN', 'NEEDS_REVISION']);

router.use('/auth', authRoutes);
router.use('/topics', topicRoutes);
router.use('/dsa', dsaRoutes);
router.use('/code', codeRoutes);
router.use('/', courseRoutes);

/* ---------------------------------- questions --------------------------------- */
const questions = Router();
questions.use(requireAuth);
questions.get('/categories', asyncHandler(questionController.categories));
questions.get(
  '/',
  validate({
    query: z.object({
      category: z.string().max(60).optional(),
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
      status: learningStatus.optional(),
      search: z.string().max(120).optional(),
    }),
  }),
  asyncHandler(questionController.list),
);
questions.patch(
  '/:id/status',
  validate({ params: idParam, body: z.object({ status: learningStatus }) }),
  asyncHandler(questionController.setStatus),
);
router.use('/questions', questions);

/* ------------------------------------ notes ----------------------------------- */
const notes = Router();
notes.use(requireAuth);
const noteBody = z.object({
  title: z.string().min(1, 'Title is required').max(160),
  content: z.string().min(1, 'Note content is required').max(20_000),
  topicId: z.string().max(60).nullish(),
  problemId: z.string().max(60).nullish(),
  questionId: z.string().max(60).nullish(),
  tags: z.array(z.string().max(30)).max(10).optional(),
});
notes.get(
  '/',
  validate({
    query: z.object({
      search: z.string().max(120).optional(),
      topicId: z.string().max(60).optional(),
      problemId: z.string().max(60).optional(),
    }),
  }),
  asyncHandler(noteController.list),
);
notes.post('/', validate({ body: noteBody }), asyncHandler(noteController.create));
notes.patch(
  '/:id',
  validate({ params: idParam, body: noteBody.partial() }),
  asyncHandler(noteController.update),
);
notes.delete('/:id', validate({ params: idParam }), asyncHandler(noteController.remove));
router.use('/notes', notes);

/* ---------------------------------- bookmarks --------------------------------- */
const bookmarks = Router();
bookmarks.use(requireAuth);
bookmarks.get(
  '/',
  validate({ query: z.object({ kind: z.enum(['TOPIC', 'QUESTION', 'PROBLEM']).optional() }) }),
  asyncHandler(bookmarkController.list),
);
bookmarks.post(
  '/toggle',
  validate({
    body: z.object({
      kind: z.enum(['TOPIC', 'QUESTION', 'PROBLEM']),
      refId: z.string().min(1).max(60),
      label: z.string().min(1).max(200),
      href: z.string().min(1).max(300),
    }),
  }),
  asyncHandler(bookmarkController.toggle),
);
router.use('/bookmarks', bookmarks);

/* ---------------------------------- progress ---------------------------------- */
const progress = Router();
progress.use(requireAuth);
progress.get('/dashboard', asyncHandler(progressController.dashboard));
progress.get('/', asyncHandler(progressController.detail));
progress.post(
  '/heartbeat',
  validate({ body: z.object({ minutes: z.number().int().min(1).max(60) }) }),
  asyncHandler(progressController.heartbeat),
);
router.use('/progress', progress);

/* ---------------------------------- revision ---------------------------------- */
const revision = Router();
revision.use(requireAuth);
revision.get('/due', asyncHandler(revisionController.due));
revision.post(
  '/:id/grade',
  validate({ params: idParam, body: z.object({ grade: z.number().int().min(0).max(5) }) }),
  asyncHandler(revisionController.grade),
);
revision.delete('/:id', validate({ params: idParam }), asyncHandler(revisionController.remove));
router.use('/revision', revision);

/* ------------------------------- mock interview ------------------------------- */
const mock = Router();
mock.use(requireAuth);
mock.get('/', asyncHandler(mockController.history));
mock.post(
  '/',
  validate({
    body: z.object({
      durationMin: z.number().int().min(5).max(120).optional(),
      questionCount: z.number().int().min(3).max(30).optional(),
      categories: z.array(z.string().max(60)).max(12).optional(),
    }),
  }),
  asyncHandler(mockController.start),
);
mock.get('/:id', validate({ params: idParam }), asyncHandler(mockController.get));
mock.post(
  '/:id/answer',
  validate({
    params: idParam,
    body: z.object({ questionId: z.string().min(1).max(60), selfScore: z.number().int().min(0).max(2) }),
  }),
  asyncHandler(mockController.answer),
);
mock.post('/:id/finish', validate({ params: idParam }), asyncHandler(mockController.finish));
router.use('/mock-interview', mock);

/* ----------------------------------- search ----------------------------------- */
router.get(
  '/search',
  requireAuth,
  validate({ query: z.object({ q: z.string().max(120).optional() }) }),
  asyncHandler(searchController.global),
);

export default router;
