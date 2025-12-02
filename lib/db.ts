import { neon } from '@neondatabase/serverless';

// Lazy connection - solo se conecta cuando se usa
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}
