import pino from 'pino';
import pinoPretty from 'pino-pretty';

import { env, isDevelopment } from './env';

const logger = pino(
  {
    level: isDevelopment ? 'debug' : 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
    },
  },
  isDevelopment
    ? pinoPretty({
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      })
    : undefined
);

export { logger };

export const createRequestLogger = () => {
  return pino({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    transport: env.NODE_ENV === 'development' 
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          },
        }
      : undefined,
  });
};