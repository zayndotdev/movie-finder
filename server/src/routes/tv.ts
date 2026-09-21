import { Router, Request, Response, NextFunction } from 'express';
import {
  getTrendingTV,
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
  getTVDetail,
  getTVSeasonDetail
} from '../services/tmdbTV';

const router = Router();

router.get('/trending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timeWindow = req.query.timeWindow === 'week' ? 'week' : 'day';
    const page = parseInt(req.query.page as string, 10) || 1;
    const adult = req.query.adult === 'true';

    const result = await getTrendingTV(timeWindow, page, adult);
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

router.get('/popular', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const adult = req.query.adult === 'true';

    const result = await getPopularTV(page, adult);
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

router.get('/top-rated', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const adult = req.query.adult === 'true';

    const result = await getTopRatedTV(page, adult);
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

router.get('/airing-today', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const adult = req.query.adult === 'true';

    const result = await getAiringTodayTV(page, adult);
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

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'TV Show ID must be a valid number', timestamp: new Date().toISOString() }
      });
      return;
    }

    const show = await getTVDetail(id);
    if (!show) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'TV Show not found', timestamp: new Date().toISOString() }
      });
      return;
    }

    res.json({
      success: true,
      data: show,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/season/:seasonNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const seasonNumber = parseInt(req.params.seasonNumber, 10);

    if (isNaN(id) || isNaN(seasonNumber)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_PARAMS', message: 'TV ID and Season Number must be valid numbers', timestamp: new Date().toISOString() }
      });
      return;
    }

    const seasonDetail = await getTVSeasonDetail(id, seasonNumber);
    if (!seasonDetail) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Season not found', timestamp: new Date().toISOString() }
      });
      return;
    }

    res.json({
      success: true,
      data: seasonDetail,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
