// Global test setup
import 'dotenv/config';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test?schema=public';
process.env.JWT_SECRET = 'test-jwt-secret';