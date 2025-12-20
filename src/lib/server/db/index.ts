import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '$env/dynamic/private';
import { resolve } from 'path';
import * as schema from './schema';

let url = env.DATABASE_URL || 'local.db';
const absolutePath = resolve(url);
url = `file://${absolutePath}`;


export const dbClient = createClient({ url });

export const db = drizzle(dbClient, { schema });