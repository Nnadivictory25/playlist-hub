import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { resolve } from 'path';

const url = process.env.DATABASE_URL || 'local.db';

if (!url) {
    throw new Error('DATABASE_URL is not set');
}

const dbClient = new Database(url);
const db = drizzle(dbClient);

// Resolve drizzle folder path - works in both dev and production
// In production, we're at /app, in dev we're at project root
const migrationsFolder = resolve(process.cwd(), 'drizzle');

migrate(db, { migrationsFolder });
console.log('Migrations applied ✅');

