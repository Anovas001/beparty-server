import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { healthRoutes } from './health.routes';
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

export { router as routes };