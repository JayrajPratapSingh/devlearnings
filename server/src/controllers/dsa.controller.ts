import type { Request, Response } from 'express';
import type { Difficulty, ProblemStatus } from '@prisma/client';
import { dsaService } from '../services/dsa.service';
import { dailyService } from '../services/daily.service';
import { currentUser } from '../middleware/auth';

export const dsaController = {
  async list(req: Request, res: Response): Promise<void> {
    const q = req.query as {
      category?: string;
      difficulty?: Difficulty;
      status?: ProblemStatus;
      search?: string;
    };
    res.json(await dsaService.list(currentUser(req).id, q));
  },

  async categories(req: Request, res: Response): Promise<void> {
    res.json({ categories: await dsaService.categories(currentUser(req).id) });
  },

  async getBySlug(req: Request, res: Response): Promise<void> {
    res.json(await dsaService.getBySlug(currentUser(req).id, String(req.params['slug'])));
  },

  async setStatus(req: Request, res: Response): Promise<void> {
    const { status } = req.body as { status: ProblemStatus };
    res.json(await dsaService.setStatus(currentUser(req).id, String(req.params['slug']), status));
  },

  /** GET /api/dsa/daily — same problem for everyone, derived from the date. */
  async daily(req: Request, res: Response): Promise<void> {
    res.json({ daily: await dailyService.today(currentUser(req).id) });
  },

  async difficultyBreakdown(req: Request, res: Response): Promise<void> {
    res.json({ breakdown: await dsaService.difficultyBreakdown(currentUser(req).id) });
  },
};
