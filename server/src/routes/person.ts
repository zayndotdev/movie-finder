import { Router, Request, Response, NextFunction } from 'express';
import { getPersonDetail } from '../services/tmdbShared';

const router = Router();

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Person ID must be a valid number', timestamp: new Date().toISOString() }
      });
      return;
    }

    const person = await getPersonDetail(id);
    if (!person) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Person not found', timestamp: new Date().toISOString() }
      });
      return;
    }

    res.json({
      success: true,
      data: person,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/combined-credits', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Person ID must be a valid number', timestamp: new Date().toISOString() }
      });
      return;
    }

    const person = await getPersonDetail(id);
    if (!person) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Person not found', timestamp: new Date().toISOString() }
      });
      return;
    }

    res.json({
      success: true,
      data: person.combinedCredits,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
