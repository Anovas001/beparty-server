import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from '@/config/env';
import { logger } from '@/config/logger';

import { errorMiddleware } from '../api/middlewares/error.middleware';
import { notFoundMiddleware } from '../api/middlewares/notFound.middleware';
import { routes } from '../api/routes';

export const setupExpress = (): express.Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }));

  // Rate limiting
  app.use(rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: {
      error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  }));

  // Simple request logging
  app.use((req, res, next) => {
    res.on('finish', () => {
      const url = req.url.replace('/api', ''); // Remove /api prefix for cleaner logs
      logger.info(`${req.method} ${url} - ${res.statusCode}`);
    });
    
    next();
  });

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Routes
  app.use('/api', routes);

  // Error handling middleware (must be last)
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};