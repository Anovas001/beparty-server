import { Request, Response } from 'express';

export const notFoundMiddleware = (req: Request, res: Response): Response => {
  return res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    },
  });
};