import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { authRoutes } from './auth.routes';
import { healthRoutes } from './health.routes';
import { sessionsRoutes } from './sessions.routes';
import { usersRoutes } from './users.routes';
import { votesRoutes } from './votes.routes';
import { openApiSpec } from '../docs/openapi';

const router = Router();

// API Documentation
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(openApiSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'BePARTy API Documentation',
}));

// Health routes
router.use('/', healthRoutes);

// Authentication routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', usersRoutes);

// Session routes
router.use('/sessions', sessionsRoutes);

// Vote routes
router.use('/sessions', votesRoutes);

export { router as routes };