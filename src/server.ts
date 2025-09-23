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
});