import type { Request, Response } from 'express';
import { topicService } from '../services/topic.service';
import { currentUser } from '../middleware/auth';

export const topicController = {
  async listCategories(req: Request, res: Response): Promise<void> {
    res.json({ categories: await topicService.listCategories(currentUser(req).id) });
  },

  async listByCategory(req: Request, res: Response): Promise<void> {
    const slug = String(req.params['categorySlug']);
    res.json(await topicService.listByCategory(currentUser(req).id, slug));
  },

  async titles(req: Request, res: Response): Promise<void> {
    const slugs = String(req.query['slugs'] ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    res.json({ topics: slugs.length ? await topicService.titlesFor(slugs) : [] });
  },

  async getBySlug(req: Request, res: Response): Promise<void> {
    const slug = String(req.params['slug']);
    res.json({ topic: await topicService.getBySlug(currentUser(req).id, slug) });
  },

  async setStatus(req: Request, res: Response): Promise<void> {
    const slug = String(req.params['slug']);
    const { status, confidence } = req.body as { status: never; confidence?: number };
    res.json(await topicService.setStatus(currentUser(req).id, slug, status, confidence));
  },
};
