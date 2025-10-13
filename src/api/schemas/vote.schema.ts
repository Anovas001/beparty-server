import { z } from 'zod';

export const voteSchema = z.object({
  tokens_spent: z
    .number()
    .int('Tokens must be an integer')
    .min(1, 'Must spend at least 1 token')
    .max(1000, 'Cannot spend more than 1000 tokens at once'),
});

export type VoteRequest = z.infer<typeof voteSchema>;