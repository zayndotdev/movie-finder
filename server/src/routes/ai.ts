import { Router, Request, Response, NextFunction } from 'express';
import { processAIChat } from '../services/aiAgent';

const router = Router();

router.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, adultMode, history } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_QUERY', message: 'Query must be a non-empty string', timestamp: new Date().toISOString() }
      });
      return;
    }

    const chatResponse = await processAIChat(query.trim(), Boolean(adultMode), history);

    res.json({
      success: true,
      data: chatResponse,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
