import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './index.js';
await migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations applied ✅');
