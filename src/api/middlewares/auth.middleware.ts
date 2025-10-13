import { NextFunction, Request, Response } from 'express';

import { AuthService } from '@/services/auth.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    display_name: string;
    role: string;
    tokens_balance: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          message: 'Authorization token required',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const user = await AuthService.getUserFromToken(token);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        error: {
          message: 'Invalid or expired token',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Internal server error',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

export const requireRole = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json({
        error: {
          message: `Access denied. ${requiredRole} role required`,
          statusCode: 403,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    next();
  };
};

export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          message: `Access denied. One of these roles required: ${allowedRoles.join(', ')}`,
          statusCode: 403,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    next();
  };
};