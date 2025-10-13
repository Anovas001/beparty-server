import { Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { setupPrisma } from '@/loaders/prisma';

const prisma = setupPrisma();

export class SessionsController {
  public static getSessions = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const sessions = await prisma.session.findMany({
        where: {
          status: 'LIVE',
        },
        select: {
          id: true,
          name: true,
          started_at: true,
          dj_user: {
            select: {
              id: true,
              display_name: true,
            },
          },
          _count: {
            select: {
              session_songs: true,
            },
          },
        },
        orderBy: {
          started_at: 'desc',
        },
      });

      const sessionsWithStats = sessions.map(session => ({
        id: session.id,
        name: session.name,
        started_at: session.started_at.toISOString(),
        dj: {
          id: session.dj_user.id,
          display_name: session.dj_user.display_name,
        },
        songs_count: session._count.session_songs,
      }));

      return res.status(200).json({
        success: true,
        data: {
          sessions: sessionsWithStats,
        },
      });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).json({
        error: {
          message: 'Internal server error',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };

  public static getSessionSongs = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      // First verify the session exists and is LIVE
      const session = await prisma.session.findFirst({
        where: {
          id,
          status: 'LIVE',
        },
        select: {
          id: true,
          name: true,
          dj_user: {
            select: {
              id: true,
              display_name: true,
            },
          },
        },
      });

      if (!session) {
        return res.status(404).json({
          error: {
            message: 'Session not found or not active',
            statusCode: 404,
            timestamp: new Date().toISOString(),
          },
        });
      }

      // Get songs with vote totals
      const songs = await prisma.sessionSong.findMany({
        where: {
          session_id: id,
        },
        select: {
          id: true,
          spotify_track_id: true,
          track_name: true,
          artist_name: true,
          album_name: true,
          cover_url: true,
          duration_ms: true,
          total_tokens: true,
          created_at: true,
        },
        orderBy: {
          total_tokens: 'desc',
        },
      });

      const songsWithStringTokens = songs.map(song => ({
        ...song,
        total_tokens: song.total_tokens.toString(),
        created_at: song.created_at.toISOString(),
      }));

      return res.status(200).json({
        success: true,
        data: {
          session: {
            id: session.id,
            name: session.name,
            dj: session.dj_user,
          },
          songs: songsWithStringTokens,
        },
      });
    } catch (error) {
      console.error('Error fetching session songs:', error);
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