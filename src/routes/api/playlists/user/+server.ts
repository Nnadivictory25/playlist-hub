import type { RequestHandler } from '../$types';
import { getUserPlaylists } from '$lib/server/db/utils';
import { json } from '@sveltejs/kit';
import { unauthorized } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return unauthorized();
		}

		const playlists = await getUserPlaylists(user.id);
		return json({ success: true, playlists });
	} catch (error) {
		console.error('API Error:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
