import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Unhandled Error]', err);

  let statusCode = err.statusCode || (err.name === 'MulterError' ? 400 : 500);
  let message = err.message || 'An unexpected error occurred while processing your request.';

  // Format Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'The uploaded file exceeds the allowed file size limit (maximum 15MB).';
    } else {
      message = `Upload failed: ${err.message}`;
    }
  }

  // Format database errors
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'A record with this information already exists in the campus database.';
  } else if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ECONNREFUSED') {
    message = 'Campus database connectivity issue. Please check the database server.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(ENV.NODE_ENV === 'development' ? { details: err.code || undefined } : {}),
  });
}

