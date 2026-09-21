import { Router, Request, Response } from 'express';
import { GENRE_MAP } from '../utils/moodMapper';
import { ADULT_CERTIFICATIONS } from '../services/adultFilter';
import { hasTMDBKey } from '../services/tmdbShared';

const router = Router();

router.get('/genres', (req: Request, res: Response) => {
  const genres = Object.entries(GENRE_MAP).map(([id, name]) => ({
    id: parseInt(id, 10),
    name
  }));

  res.json({
    success: true,
    data: genres,
    meta: { timestamp: new Date().toISOString() }
  });
});

router.get('/certifications', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: ADULT_CERTIFICATIONS,
    meta: { timestamp: new Date().toISOString() }
  });
});

router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      uptime: process.uptime(),
      apis: {
        tmdb: hasTMDBKey(),
        gemini: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5),
        groq: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 5)
      },
      environment: process.env.NODE_ENV || 'development'
    },
    meta: { timestamp: new Date().toISOString() }
  });
});

export default router;
