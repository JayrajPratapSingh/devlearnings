import type { Request, Response } from 'express';
import type { BookmarkKind, Difficulty, LearningStatus } from '@prisma/client';
import { currentUser } from '../middleware/auth';
import { questionService } from '../services/question.service';
import { noteService } from '../services/note.service';
import { bookmarkService } from '../services/bookmark.service';
import { progressService } from '../services/progress.service';
import { revisionService } from '../services/revision.service';
import { mockInterviewService } from '../services/mock-interview.service';
import { searchService } from '../services/search.service';

export const questionController = {
  async categories(req: Request, res: Response): Promise<void> {
    res.json({ categories: await questionService.categories(currentUser(req).id) });
  },
  async list(req: Request, res: Response): Promise<void> {
    const q = req.query as {
      category?: string;
      difficulty?: Difficulty;
      status?: LearningStatus;
      search?: string;
    };
    res.json({ questions: await questionService.list(currentUser(req).id, q) });
  },
  async setStatus(req: Request, res: Response): Promise<void> {
    const { status } = req.body as { status: LearningStatus };
    res.json(await questionService.setStatus(currentUser(req).id, String(req.params['id']), status));
  },
};

export const noteController = {
  async list(req: Request, res: Response): Promise<void> {
    const q = req.query as { search?: string; topicId?: string; problemId?: string };
    res.json({ notes: await noteService.list(currentUser(req).id, q) });
  },
  async create(req: Request, res: Response): Promise<void> {
    res.status(201).json({ note: await noteService.create(currentUser(req).id, req.body) });
  },
  async update(req: Request, res: Response): Promise<void> {
    res.json({ note: await noteService.update(currentUser(req).id, String(req.params['id']), req.body) });
  },
  async remove(req: Request, res: Response): Promise<void> {
    await noteService.remove(currentUser(req).id, String(req.params['id']));
    res.status(204).send();
  },
};

export const bookmarkController = {
  async list(req: Request, res: Response): Promise<void> {
    const kind = (req.query as { kind?: BookmarkKind }).kind;
    res.json({ bookmarks: await bookmarkService.list(currentUser(req).id, kind) });
  },
  async toggle(req: Request, res: Response): Promise<void> {
    res.json(await bookmarkService.toggle(currentUser(req).id, req.body));
  },
};

export const progressController = {
  async dashboard(req: Request, res: Response): Promise<void> {
    res.json(await progressService.dashboard(currentUser(req).id));
  },
  async detail(req: Request, res: Response): Promise<void> {
    res.json(await progressService.detail(currentUser(req).id));
  },
  async heartbeat(req: Request, res: Response): Promise<void> {
    const { minutes } = req.body as { minutes: number };
    await progressService.recordActivity(currentUser(req).id, { minutes });
    res.status(204).send();
  },
};

export const revisionController = {
  async due(req: Request, res: Response): Promise<void> {
    res.json({ items: await revisionService.due(currentUser(req).id) });
  },
  async grade(req: Request, res: Response): Promise<void> {
    const { grade } = req.body as { grade: number };
    res.json({ revision: await revisionService.grade(currentUser(req).id, String(req.params['id']), grade) });
  },
  async remove(req: Request, res: Response): Promise<void> {
    await revisionService.remove(currentUser(req).id, String(req.params['id']));
    res.status(204).send();
  },
};

export const mockController = {
  async start(req: Request, res: Response): Promise<void> {
    res.status(201).json(await mockInterviewService.start(currentUser(req).id, req.body));
  },
  async get(req: Request, res: Response): Promise<void> {
    res.json(await mockInterviewService.get(currentUser(req).id, String(req.params['id'])));
  },
  async answer(req: Request, res: Response): Promise<void> {
    const { questionId, selfScore } = req.body as { questionId: string; selfScore: number };
    res.json(
      await mockInterviewService.answer(
        currentUser(req).id,
        String(req.params['id']),
        questionId,
        selfScore,
      ),
    );
  },
  async finish(req: Request, res: Response): Promise<void> {
    res.json(await mockInterviewService.finish(currentUser(req).id, String(req.params['id'])));
  },
  async history(req: Request, res: Response): Promise<void> {
    res.json({ interviews: await mockInterviewService.history(currentUser(req).id) });
  },
};

export const searchController = {
  async global(req: Request, res: Response): Promise<void> {
    const { q } = req.query as { q?: string };
    res.json(await searchService.global(currentUser(req).id, q ?? ''));
  },
};
