import { Router, Request, Response, NextFunction } from 'express';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieDetail
} from '../services/tmdbMovie';
import { ApiResponse } from '../types/api';

const router = Router();

router.get('/trending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timeWindow = req.query.timeWindow === 'week' ? 'week' : 'day';
    const page = parseInt(req.query.page as string, 10) || 1;
    const adult = req.query.adult === 'true';

    const result = await getTrendingMovies(timeWindow, page, adult);
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

    const result = await getPopularMovies(page, adult);
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

    const result = await getTopRatedMovies(page, adult);
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

router.get('/now-playing', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const adult = req.query.adult === 'true';

    const result = await getNowPlayingMovies(page, adult);
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

router.get('/upcoming', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const adult = req.query.adult === 'true';

    const result = await getUpcomingMovies(page, adult);
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
        error: { code: 'INVALID_ID', message: 'Movie ID must be a valid number', timestamp: new Date().toISOString() }
      });
      return;
    }

    const movie = await getMovieDetail(id);
    if (!movie) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Movie not found', timestamp: new Date().toISOString() }
      });
      return;
    }

    res.json({
      success: true,
      data: movie,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
