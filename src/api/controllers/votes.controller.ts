import { Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { voteSchema } from '../schemas/vote.schema';
import { TokenService } from '@/services/token.service';

export class VotesController {
  public static voteForSong = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
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

      // Validate request body
      const validationResult = voteSchema.safeParse(req.body);
      
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

      const { session_id, song_id, token_amount } = validationResult.data;

      if (!session_id || !song_id) {
        return res.status(400).json({
          error: {
            message: 'Session ID and Song ID are required',
            statusCode: 400,
            timestamp: new Date().toISOString(),
          },
        });
      }

      try {
        const result = await TokenService.executeVoteTransaction(
          req.user.id,
          song_id,
          session_id,
          token_amount
        );

        return res.status(201).json({
          success: true,
          message: 'Vote cast successfully',
          data: result,
        });
      } catch (transactionError) {
        const errorMessage = transactionError instanceof Error ? transactionError.message : 'Transaction failed';
        
        // Handle specific business logic errors
        if (errorMessage.includes('Insufficient token balance')) {
          return res.status(400).json({
            error: {
              message: 'Insufficient token balance',
              statusCode: 400,
              timestamp: new Date().toISOString(),
            },
          });
        }

        if (errorMessage.includes('Session song not found') || errorMessage.includes('not active')) {
          return res.status(404).json({
            error: {
              message: 'Session or song not found, or session is not active',
              statusCode: 404,
              timestamp: new Date().toISOString(),
            },
          });
        }

        if (errorMessage.includes('User not found')) {
          return res.status(404).json({
            error: {
              message: 'User not found',
              statusCode: 404,
              timestamp: new Date().toISOString(),
            },
          });
        }

        // Generic transaction error
        console.error('Vote transaction error:', transactionError);
        return res.status(500).json({
          error: {
            message: 'Failed to process vote',
            statusCode: 500,
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error('Vote endpoint error:', error);
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