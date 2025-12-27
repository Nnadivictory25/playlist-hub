import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updatePlaylist, deletePlaylist } from '$lib/server/db/utils';
import { unauthorized } from '$lib/server/api-helpers';
import type { Playlist } from '$lib/server/db/schema';

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	const { user } = locals;
	if (!user) return unauthorized();

	const playlistId = Number(params.playlistId);
	if (isNaN(playlistId)) {
		return json({ success: false, error: 'Invalid playlist ID format' }, { status: 400 });
	}

	try {
		const updateData: Partial<Playlist> = await request.json();

		await updatePlaylist({
			playlist: { ...updateData, id: playlistId } as Playlist,
			userId: user.id
		});

		return json({ success: true, message: 'Playlist updated successfully' });
	} catch (error: any) {
		console.error('Error updating playlist:', error);
		return json(
			{
				success: false,
				error: error?.message || 'Failed to update playlist'
			},
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user } = locals;
	if (!user) return unauthorized();

	const playlistId = Number(params.playlistId);
	if (isNaN(playlistId)) {
		return json({ success: false, error: 'Invalid playlist ID format' }, { status: 400 });
	}

	try {
		await deletePlaylist({ id: playlistId, userId: user.id });
		return json({ success: true, message: 'Playlist deleted successfully' });
	} catch (error) {
		console.error('Error deleting playlist:', error);
		return json({ success: false, error: 'Failed to delete playlist' }, { status: 500 });
	}
};
