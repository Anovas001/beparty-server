import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

import { HealthResponse } from '../schemas/health.schema';

export class HealthController {
  public static getHealth = (req: Request, res: Response): Response<HealthResponse> => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    );

    const healthData: HealthResponse = {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      version: packageJson.version || '1.0.0',
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(healthData);
  };
}