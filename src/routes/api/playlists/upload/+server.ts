import type { NewPlaylist } from '@/lib/server/db/schema';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { storePlaylist } from '@/lib/server/db/utils';
import { unauthorized } from '$lib/server/api-helpers';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user, session } = locals;
	if (!user || !session) {
		return unauthorized();
	}

	const data = (await request.json()) as NewPlaylist;
	if (user.id !== data.userId) {
		return unauthorized();
	}

	try {
		await storePlaylist(data);
		return json({ success: true, message: 'Playlist uploaded successfully' });
	} catch (error) {
		console.error('Error uploading playlist:', error);
		return json({ success: false, error: 'Failed to upload playlist' }, { status: 500 });
	}
};
