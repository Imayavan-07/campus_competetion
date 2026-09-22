import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Unhandled Error]', err);

  const statusCode = err.statusCode || (err.name === 'MulterError' ? 400 : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
    ...(ENV.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
