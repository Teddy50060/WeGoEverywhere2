import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import * as path from 'path';

config();

export default defineConfig({
  schema: path.join(__dirname, './schema/*'),
  out: path.join(__dirname, './migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT!) || 5432,
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'root',
    database: process.env.POSTGRES_DB || 'WEGO_EVERYWHERE_DB',
    ssl: false,
  },
  verbose: true,
  strict: true,
});
