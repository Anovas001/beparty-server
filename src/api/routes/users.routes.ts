import { Router } from 'express';

import { UsersController } from '../controllers/users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Get authenticated user's profile information including token balance
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         display_name:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [DJ, USER]
 *                         tokens_balance:
 *                           type: string
 *       401:
 *         description: Authentication required
 */
router.get('/me', authMiddleware, UsersController.getMe);

export { router as usersRoutes };