import { db } from '.';
import { playlists, playlistLikes, type Playlist, type NewPlaylist } from './schema';
import { eq, and, inArray, count, like, sql, or } from 'drizzle-orm';
import type { Genre } from '$lib/genres';
import { DEFAULT_LIMIT } from '$lib/app-utils';

type GetPlaylistsParams = {
	userId?: string;
	search?: string;
	genres?: Genre[];
	limit?: number;
	offset?: number;
};

export async function getPlaylists(params: GetPlaylistsParams) {
	const { limit, offset, userId, search, genres } = params;

	// Build search conditions
	let whereConditions = undefined;
	const conditions = [];

	// Add genre filter
	if (genres && genres.length > 0) {
		// Filter playlists that have at least one of the specified genres
		// Using exact JSON array matching - more efficient than LIKE
		const genreConditions = genres.map((genre) =>
			sql.raw(
				`EXISTS (SELECT 1 FROM json_each(genre) WHERE json_each.value = '${genre.replace(/'/g, "''")}')`
			)
		);
		conditions.push(or(...genreConditions));
	}

	// Add search conditions
	if (search) {
		const searchTerm = `%${search}%`;
		const searchConditions = or(
			like(playlists.name, searchTerm),
			like(playlists.description, searchTerm),
			// Search within JSON array for genres
			sql`${playlists.genre} LIKE ${searchTerm}`
		);
		conditions.push(searchConditions);
	}

	if (conditions.length > 0) {
		whereConditions = and(...conditions);
	}

	const [playlistsData, userLikedLikes, [totalLikes]] = await Promise.all([
		db
			.select()
			.from(playlists)
			.where(whereConditions)
			.limit(limit ?? DEFAULT_LIMIT)
			.offset(offset ?? 0),
		userId
			? db
					.select({ playlistId: playlistLikes.playlistId })
					.from(playlistLikes)
					.where(eq(playlistLikes.userId, userId))
			: Promise.resolve([]),
		db.select({ count: count() }).from(playlistLikes)
	]);

	const userLikedPlaylists = userLikedLikes.map((like) => like.playlistId);

	return { playlists: playlistsData, userLikedPlaylists, totalLikes: totalLikes.count };
}

export async function getUserPlaylists(userId: string) {
	return await db.select().from(playlists).where(eq(playlists.userId, userId));
}

export async function storePlaylist(playlist: NewPlaylist) {
	await db.insert(playlists).values(playlist);
}

export async function updatePlaylist(playlist: Playlist) {
	await db.update(playlists).set(playlist).where(eq(playlists.id, playlist.id));
}

export async function deletePlaylist(id: number) {
	await db.delete(playlists).where(eq(playlists.id, id));
}

export async function toggleLike({
	playlistId,
	userId
}: {
	playlistId: number;
	userId: string;
}): Promise<'liked' | 'unliked'> {
	const existing = await db
		.select()
		.from(playlistLikes)
		.where(and(eq(playlistLikes.playlistId, playlistId), eq(playlistLikes.userId, userId)));

	if (existing.length > 0) {
		await db
			.delete(playlistLikes)
			.where(and(eq(playlistLikes.playlistId, playlistId), eq(playlistLikes.userId, userId)));
		return 'unliked';
	} else {
		await db.insert(playlistLikes).values({ playlistId, userId });
		return 'liked';
	}
}
