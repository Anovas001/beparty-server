import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .transform(email => email.toLowerCase()),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export const authResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    display_name: z.string(),
    role: z.enum(['DJ', 'USER']),
    tokens_balance: z.string(),
  }),
  token: z.string(),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;