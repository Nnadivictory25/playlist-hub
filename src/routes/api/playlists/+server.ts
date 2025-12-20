import type { RequestHandler } from '../$types';
import { getQueryParams } from '$lib/app-utils';
import { getPlaylists, getUserPlaylists } from '$lib/server/db/utils';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const params = getQueryParams(url);
		const { userId, limit, offset, isUser } = params;

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
