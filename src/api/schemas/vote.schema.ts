import { z } from 'zod';

export const voteSchema = z.object({
  session_id: z
    .number()
    .int('Session ID must be an integer')
    .positive('Session ID must be positive'),
  song_id: z
    .string()
    .regex(/^[a-z0-9]{25}$/, 'Song ID must be a valid CUID'),
  token_amount: z
    .number()
    .int('Token amount must be an integer')
    .min(1, 'Token amount must be at least 1')
    .max(1000, 'Token amount must not exceed 1000'),
});

export type VoteRequest = z.infer<typeof voteSchema>;