import { z } from 'zod';

export const sessionSongsSchema = z.object({
  session_id: z
    .number()
    .int('Session ID must be an integer')
    .positive('Session ID must be positive'),
});

export const sessionSongsQuerySchema = z.object({
  session_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'Session ID must be a positive integer'),
});

export type SessionSongsRequest = z.infer<typeof sessionSongsSchema>;
export type SessionSongsQueryRequest = z.infer<typeof sessionSongsQuerySchema>;