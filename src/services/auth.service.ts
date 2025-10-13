import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env';
import { setupPrisma } from '@/loaders/prisma';

const prisma = setupPrisma();

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    display_name: string;
    role: string;
    tokens_balance: string; // BigInt as string for JSON
  };
  token: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase(),
        deleted_at: null,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const tokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
      expiresIn: '24h',
      issuer: 'beparty-api',
      audience: 'beparty-client',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
        tokens_balance: user.tokens_balance.toString(),
      },
      token,
    };
  }

  static async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET, {
        issuer: 'beparty-api',
        audience: 'beparty-client',
      }) as JwtPayload;

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async getUserFromToken(token: string) {
    const payload = await this.verifyToken(token);
    
    const user = await prisma.user.findUnique({
      where: { 
        id: payload.userId,
        deleted_at: null,
      },
      select: {
        id: true,
        email: true,
        display_name: true,
        role: true,
        tokens_balance: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user,
      tokens_balance: user.tokens_balance.toString(),
    };
  }

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }
}