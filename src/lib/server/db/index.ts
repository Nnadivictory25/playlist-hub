
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

const url = process.env.DATABASE_URL || 'local.db';

if (!url) {
    throw new Error('DATABASE_URL is not set');
}

export const dbClient = new Database(url);

export const db = drizzle(dbClient, { schema });
