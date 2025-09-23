import { createServer } from 'http';

import { env } from './config/env';
import { logger } from './config/logger';
import { setupExpress } from './loaders/express';
import { closePrisma, setupPrisma } from './loaders/prisma';
import { setupSocket } from './loaders/socket';

export const createApp = () => {
  // Initialize Prisma
  setupPrisma();
  
  // Create Express app
  const app = setupExpress();
  
  // Create HTTP server
  const server = createServer(app);
  
  // Setup Socket.IO
  setupSocket(server);
  
  return { app, server };
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  
  try {
    await closePrisma();
    logger.info('Database connections closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { setupExpress, setupPrisma, setupSocket };