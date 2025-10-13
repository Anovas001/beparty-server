import { Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class UsersController {
  public static getMe = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            message: 'Authentication required',
            statusCode: 401,
            timestamp: new Date().toISOString(),
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: {
          message: 'Internal server error',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };
}