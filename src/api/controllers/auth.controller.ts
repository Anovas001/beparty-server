import { Request, Response } from 'express';

import { loginSchema } from '../schemas/auth.schema';
import { AuthService } from '@/services/auth.service';

export class AuthController {
  public static login = async (req: Request, res: Response): Promise<Response> => {
    try {
      // Validate request body
      const validationResult = loginSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: {
            message: 'Validation failed',
            details: validationResult.error.errors,
            statusCode: 400,
            timestamp: new Date().toISOString(),
          },
        });
      }

      const { email, password } = validationResult.data;

      try {
        const authResponse = await AuthService.login({ email, password });
        
        return res.status(200).json({
          success: true,
          data: authResponse,
        });
      } catch (authError) {
        // Don't expose specific auth errors for security
        return res.status(401).json({
          error: {
            message: 'Invalid email or password',
            statusCode: 401,
            timestamp: new Date().toISOString(),
          },
        });
      }
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