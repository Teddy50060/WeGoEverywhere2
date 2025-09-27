import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { poolConfig } from '../configurations/configs';
import { schema } from './schema';

const pool = new Pool(poolConfig);

// Export drizzle instance with schema
export const db = drizzle(pool, {
  schema
});

export type DbType = typeof db;

// Error handling
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});