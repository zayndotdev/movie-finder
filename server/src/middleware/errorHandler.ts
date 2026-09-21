import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../types/api';

export function errorHandler(
  err: any,
  req: Request,
  res: Response<ApiErrorResponse>,
  next: NextFunction
): void {
  console.error(`[API Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      timestamp: new Date().toISOString()
    }
  });
}
