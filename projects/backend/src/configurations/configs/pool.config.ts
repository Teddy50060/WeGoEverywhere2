import { PoolConfig } from 'pg';
import { config } from 'dotenv';

config();

export const poolConfig: PoolConfig = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT!) || 5432,
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'root',
    database: process.env.POSTGRES_DB || 'db',
    // Security settings
    //   ssl: process.env.NODE_ENV === 'production' ? {
    //     rejectUnauthorized: false,
    //   } : false,
    
    // Connection pool settings
    //   min: process.env.NODE_ENV === 'production' ? 2 : 1,
    //   max: process.env.NODE_ENV === 'production' ? 20 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
};

console.log('🔍 Database Config:', {
  host: poolConfig.host,
  port: poolConfig.port,
  user: poolConfig.user,
  database: poolConfig.database,
  from: 'POSTGRES_DB env var: ' + process.env.POSTGRES_DB,
});