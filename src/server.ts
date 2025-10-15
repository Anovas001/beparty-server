import 'dotenv/config';

import { env } from './config/env';
import { logger } from './config/logger';
import { createApp } from './app';

const { server } = createApp();

server.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${env.PORT}/api/docs`);
  logger.info(`💚 Health Check: http://localhost:${env.PORT}/api/health`);
  logger.info(`🔌 Socket.IO: http://localhost:${env.PORT}/realtime`);
  logger.info(`📋 All Routes: http://localhost:${env.PORT}/api/routes`);
  
  // Log available endpoints
  logger.info('');
  logger.info('🎯 Available API Endpoints:');
  logger.info('  POST   /api/auth/login       - User authentication');
  logger.info('  GET    /api/users/me         - Get user profile');
  logger.info('  GET    /api/sessions         - List active sessions');
  logger.info('  GET    /api/sessions/songs   - Get session songs (?session_id=1)');
  logger.info('  POST   /api/vote             - Vote for song');
  logger.info('  GET    /api/health           - Health check');
  logger.info('  GET    /api/routes           - List all routes (debug)');
  logger.info('');
});