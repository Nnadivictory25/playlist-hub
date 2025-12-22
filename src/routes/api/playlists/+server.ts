import type { RequestHandler } from '../$types';
import { getQueryParams } from '$lib/app-utils';
import { getPlaylists, getUserPlaylists } from '$lib/server/db/utils';
import { json } from '@sveltejs/kit';
import { isValidGenre, type Genre } from '$lib/genres';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const params = getQueryParams(url);
		const { userId, limit, offset, isUser, search, genres } = params;
		// Validate and filter genres to ensure they are valid Genre types
		const validGenres: Genre[] = [];
		if (genres) {
			for (const genre of genres.split(',')) {
				if (isValidGenre(genre)) {
					validGenres.push(genre);
				}
			}
		}
		let data;
		if (isUser === 'true') {
			if (!userId) {
				return json(
					{ success: false, error: 'userId required for user playlists' },
					{ status: 400 }
				);
			}
			data = { playlists: await getUserPlaylists(userId), likedPlaylistIds: [] };
		} else {
			data = await getPlaylists({
				userId,
				search,
				genres: validGenres.length > 0 ? validGenres : undefined,
				limit: limit ? parseInt(limit) : undefined,
				offset: offset ? parseInt(offset) : undefined
			});
		}

		return json({ success: true, data });
	} catch (error) {
		console.error('API Error:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
