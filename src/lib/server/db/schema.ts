import { platforms, type Genre } from '../../filters';
import { relations, sql } from 'drizzle-orm';
import {
	customType,
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';

const jsonArray = <TData>(name: string) =>
	customType<{ data: TData[]; driverData: string }>({
		dataType() {
			return 'text';
		},
		toDriver(value: TData[]): string {
			return JSON.stringify(value);
		},
		fromDriver(value: string): TData[] {
			return JSON.parse(value);
		}
	})(name);

const timestamps = {
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
};

export const playlists = sqliteTable(
	'playlists',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		name: text('name').notNull(),
		description: text('description').notNull(),
		likes: integer('likes').notNull().default(0),
		songCount: integer('song_count').notNull().default(0),
		imageUrl: text('image_url').notNull(),
		platform: text('platform', { enum: platforms as [string, ...string[]] }).notNull(),
		genre: jsonArray('genre').$type<Genre[]>().notNull(),
		url: text('url').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		...timestamps
	},
	(table) => [
		index('playlists_name_idx').on(table.name),
		index('playlists_description_idx').on(table.description)
	]
);

export type Playlist = typeof playlists.$inferSelect;
export type NewPlaylist = typeof playlists.$inferInsert;

export const playlistLikes = sqliteTable(
	'playlist_likes',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		playlistId: integer('playlist_id')
			.notNull()
			.references(() => playlists.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		...timestamps
	},
	(table) => [
		uniqueIndex('playlist_likes_playlistId_userId_unique').on(table.playlistId, table.userId),
		index('playlist_likes_playlistId_idx').on(table.playlistId)
	]
);

export type PlaylistLike = typeof playlistLikes.$inferSelect;
export type NewPlaylistLike = typeof playlistLikes.$inferInsert;

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	country: text('country'),
	emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
	image: text('image'),
	...timestamps
});

export const sessions = sqliteTable(
	'sessions',
	{
		id: text('id').primaryKey(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		token: text('token').notNull().unique(),
		...timestamps,
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' })
	},
	(table) => [index('session_userId_idx').on(table.userId)]
);

export const accounts = sqliteTable(
	'accounts',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: integer('access_token_expires_at', {
			mode: 'timestamp_ms'
		}),
		refreshTokenExpiresAt: integer('refresh_token_expires_at', {
			mode: 'timestamp_ms'
		}),
		scope: text('scope'),
		password: text('password'),
		...timestamps
	},
	(table) => [index('account_userId_idx').on(table.userId)]
);

export const verifications = sqliteTable(
	'verifications',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		...timestamps
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const playlistsRelations = relations(playlists, ({ many, one }) => ({
	likes: many(playlistLikes),
	user: one(users, {
		fields: [playlists.userId],
		references: [users.id]
	})
}));

export const playlistLikesRelations = relations(playlistLikes, ({ one }) => ({
	playlist: one(playlists, {
		fields: [playlistLikes.playlistId],
		references: [playlists.id]
	}),
	user: one(users, {
		fields: [playlistLikes.userId],
		references: [users.id]
	})
}));

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	accounts: many(accounts),
	playlists: many(playlists),
	playlistLikes: many(playlistLikes)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));
