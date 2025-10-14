import { Router } from 'express';

import { VotesController } from '../controllers/votes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /sessions/{sessionId}/songs/{songId}/vote:
 *   post:
 *     summary: Vote for a song with tokens
 *     description: Spend tokens to vote for a song in an active session. Validates user token balance, creates vote record, and updates balances atomically.
 *     tags: [Voting System]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session Song ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoteRequest'
 *     responses:
 *       201:
 *         description: Vote cast successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Vote cast successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     vote:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         tokens_spent:
 *                           type: string
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                     song:
 *                       type: object
 *                       properties:
 *                         track_name:
 *                           type: string
 *                         artist_name:
 *                           type: string
 *                         new_total_tokens:
 *                           type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         new_balance:
 *                           type: string
 *       400:
 *         description: Validation error or insufficient balance
 *       404:
 *         description: Session or song not found
 *       401:
 *         description: Authentication required
 */
router.post('/:sessionId/songs/:songId/vote', authMiddleware, VotesController.voteForSong);

export { router as votesRoutes };