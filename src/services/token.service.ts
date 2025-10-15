import { setupPrisma } from '@/loaders/prisma';

const prisma = setupPrisma();

export class TokenService {
  static async executeVoteTransaction(
    userId: string,
    sessionSongId: string,
    sessionId: number,
    tokensToSpend: number
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1. Get current user balance with lock
      const user = await tx.user.findUnique({
        where: { id: userId, deleted_at: null },
        select: { tokens_balance: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const currentBalance = Number(user.tokens_balance);
      
      if (currentBalance < tokensToSpend) {
        throw new Error('Insufficient token balance');
      }

      // 2. Verify session song exists and session is live
      const sessionSong = await tx.sessionSong.findFirst({
        where: {
          id: sessionSongId,
          session: {
            id: sessionId,
            status: 'LIVE',
          },
        },
        select: { id: true, session_id: true, total_tokens: true },
      });

      if (!sessionSong) {
        throw new Error('Session song not found or session is not active');
      }

      // 3. Create the vote record
      const vote = await tx.vote.create({
        data: {
          session_song_id: sessionSongId,
          user_id: userId,
          tokens_spent: BigInt(tokensToSpend),
        },
      });

      // 4. Update user balance (decrement)
      await tx.user.update({
        where: { id: userId },
        data: {
          tokens_balance: {
            decrement: BigInt(tokensToSpend),
          },
        },
      });

      // 5. Update session song total tokens (increment)
      const updatedSessionSong = await tx.sessionSong.update({
        where: { id: sessionSongId },
        data: {
          total_tokens: {
            increment: BigInt(tokensToSpend),
          },
        },
        select: {
          total_tokens: true,
          track_name: true,
          artist_name: true,
        },
      });

      // 6. Create token transaction record
      const tokenTransaction = await tx.tokenTransaction.create({
        data: {
          user_id: userId,
          direction: 'SPEND',
          amount: BigInt(tokensToSpend),
          reason: 'VOTE',
          session_id: sessionId,
        },
      });

      // 7. Get updated user balance
      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        select: { tokens_balance: true },
      });

      return {
        vote: {
          id: vote.id,
          tokens_spent: vote.tokens_spent.toString(),
          created_at: vote.created_at,
        },
        song: {
          track_name: updatedSessionSong.track_name,
          artist_name: updatedSessionSong.artist_name,
          new_total_tokens: updatedSessionSong.total_tokens.toString(),
        },
        user: {
          new_balance: updatedUser?.tokens_balance.toString() || '0',
        },
        transaction_id: tokenTransaction.id,
      };
    });
  }
}