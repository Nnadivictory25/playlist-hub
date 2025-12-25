import type { RequestHandler } from './$types';
import { toggleLike } from '$lib/server/db/utils';
import { json } from '@sveltejs/kit';
import { unauthorized } from '$lib/server/api-helpers';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return unauthorized();
		}

		const { playlistId } = (await request.json()) as { playlistId: number };

		if (!playlistId) {
			return json({ success: false, error: 'playlistId required' }, { status: 400 });
		}

		const action = await toggleLike({ playlistId, userId: user.id });
		return json({ success: true, action });
	} catch (error) {
		console.error('Like error:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
