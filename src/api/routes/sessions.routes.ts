import { Router } from 'express';

import { SessionsController } from '../controllers/sessions.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /sessions:
 *   get:
 *     summary: List active sessions
 *     description: Get all LIVE sessions where users can vote for songs
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           started_at:
 *                             type: string
 *                             format: date-time
 *                           dj:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               display_name:
 *                                 type: string
 *                           songs_count:
 *                             type: number
 *       401:
 *         description: Authentication required
 */
router.get('/', authMiddleware, SessionsController.getSessions);

/**
 * @openapi
 * /sessions/{id}/songs:
 *   get:
 *     summary: Get session songs with vote totals
 *     description: Get all songs in a session ordered by vote totals (scoreboard)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session songs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     session:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         dj:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             display_name:
 *                               type: string
 *                     songs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           spotify_track_id:
 *                             type: string
 *                           track_name:
 *                             type: string
 *                           artist_name:
 *                             type: string
 *                           total_tokens:
 *                             type: string
 *       404:
 *         description: Session not found or not active
 *       401:
 *         description: Authentication required
 */
router.get('/:id/songs', authMiddleware, SessionsController.getSessionSongs);

export { router as sessionsRoutes };