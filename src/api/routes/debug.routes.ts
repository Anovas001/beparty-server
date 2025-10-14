import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @openapi
 * /routes:
 *   get:
 *     summary: List all available routes
 *     description: Development endpoint to list all registered API routes
 *     tags: [Development]
 *     responses:
 *       '200':
 *         description: List of available routes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       method:
 *                         type: string
 *                       path:
 *                         type: string
 */
router.get('/routes', (req: Request, res: Response) => {
  const routes: Array<{ method: string; path: string }> = [];
  
  // Helper function to extract routes from Express app
  const extractRoutes = (layer: any, basePath = '') => {
    if (layer.route) {
      // Regular route
      const methods = Object.keys(layer.route.methods);
      methods.forEach(method => {
        routes.push({
          method: method.toUpperCase(),
          path: basePath + layer.route.path
        });
      });
    } else if (layer.name === 'router' && layer.handle?.stack) {
      // Router middleware
      const routerPath = layer.regexp.source
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '')
        .replace(/\\\//g, '/')
        .replace(/\$.*/, '')
        .replace(/^\^/, '');
      
      layer.handle.stack.forEach((nestedLayer: any) => {
        extractRoutes(nestedLayer, basePath + routerPath);
      });
    }
  };

  // Extract routes from the main app
  const app = req.app;
  if (app._router && app._router.stack) {
    app._router.stack.forEach((layer: any) => {
      extractRoutes(layer, '/api');
    });
  }

  // Sort routes for better presentation
  routes.sort((a, b) => {
    if (a.path === b.path) {
      return a.method.localeCompare(b.method);
    }
    return a.path.localeCompare(b.path);
  });

  return res.status(200).json({
    message: 'Available API routes',
    total: routes.length,
    routes: routes,
    documentation: '/api/docs',
    health: '/api/health',
    realtime: '/realtime'
  });
});

export { router as debugRoutes };