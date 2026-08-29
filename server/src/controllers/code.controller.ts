import type { Request, Response } from 'express';
import type { Language } from '@prisma/client';
import { codeService } from '../services/code.service';
import { currentUser } from '../middleware/auth';

export const codeController = {
  /** POST /api/code/run — free-form execution against user-supplied stdin. */
  async run(req: Request, res: Response): Promise<void> {
    const { language, code, input } = req.body as {
      language: Language;
      code: string;
      input?: string;
    };
    const result = await codeService.run({ language, code, stdin: input ?? '' });
    res.json(result);
  },

  /** POST /api/code/run/:slug — run against a problem's sample cases. */
  async runProblem(req: Request, res: Response): Promise<void> {
    const { language, code, input } = req.body as {
      language: Language;
      code: string;
      input?: string;
    };
    res.json(
      await codeService.runProblem(currentUser(req).id, String(req.params['slug']), {
        language,
        code,
        input,
      }),
    );
  },

  /** POST /api/code/submit/:slug — graded run over every test case. */
  async submit(req: Request, res: Response): Promise<void> {
    const { language, code } = req.body as { language: Language; code: string };
    res.json(
      await codeService.submit(currentUser(req).id, String(req.params['slug']), { language, code }),
    );
  },

  async health(_req: Request, res: Response): Promise<void> {
    res.json(await codeService.health());
  },
};
