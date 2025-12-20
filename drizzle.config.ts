import { defineConfig } from 'drizzle-kit';
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: DATABASE_URL },
});
