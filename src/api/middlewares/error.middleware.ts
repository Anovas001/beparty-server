import { NextFunction, Request, Response } from 'express';

import { logger } from '@/config/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error
  logger.error({
    error: {
      message: err.message,
      stack: err.stack,
      statusCode,
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    },
  }, 'API Error');

  // Don't expose internal errors in production
  const responseMessage = statusCode >= 500 && process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : message;

  return res.status(statusCode).json({
    error: {
      message: responseMessage,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  });
};