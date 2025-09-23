import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { env } from '@/config/env';
import { logger } from '@/config/logger';

export const setupSocket = (server: Server): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io/',
  });

  // Realtime namespace
  const realtimeNamespace = io.of('/realtime');

  realtimeNamespace.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'Client connected to realtime namespace');

    // Health check event
    socket.on('ping', (callback) => {
      logger.debug({ socketId: socket.id }, 'Received ping');
      
      if (typeof callback === 'function') {
        callback('pong');
      } else {
        socket.emit('pong');
      }
    });

    socket.on('disconnect', (reason) => {
      logger.info({ socketId: socket.id, reason }, 'Client disconnected from realtime namespace');
    });
  });

  // Global error handling
  io.engine.on('connection_error', (err) => {
    logger.error({ error: err.message, context: err.context }, 'Socket.IO connection error');
  });

  logger.info('Socket.IO server initialized with realtime namespace');
  
  return io;
};