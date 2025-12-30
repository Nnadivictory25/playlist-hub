import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { db } from '$lib/server/db';
migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations applied ✅');
