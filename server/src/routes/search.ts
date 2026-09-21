import { Router, Request, Response, NextFunction } from 'express';
import { multiSearch } from '../services/tmdbShared';

const router = Router();

router.get('/multi', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = (req.query.query as string) || '';
    const page = parseInt(req.query.page as string, 10) || 1;
    const adult = req.query.adult === 'true';

    if (!query.trim()) {
      res.json({
        success: true,
        data: [],
        meta: { page: 1, totalPages: 0, totalResults: 0, timestamp: new Date().toISOString() }
      });
      return;
    }

    const result = await multiSearch(query, page, adult);
    res.json({
      success: true,
      data: result.items,
      meta: {
        page,
        totalPages: result.totalPages,
        totalResults: result.totalResults,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
