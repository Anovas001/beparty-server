import { PrismaClient } from '@prisma/client';

import { logger } from '@/config/logger';

let prisma: PrismaClient;

export const setupPrisma = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ['warn', 'error'], // Only show warnings and errors, no query logs
    });

    logger.info('Prisma client initialized');
  }

  return prisma;
};

export const closePrisma = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

export { prisma };