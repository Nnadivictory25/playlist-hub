import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getPlaylistIdFromUrl } from '$lib/app-utils';
import { validateAuthAndPlaylistUrl } from '$lib/server/api-helpers';

export const GET: RequestHandler = async (event) => {
	const validatedRequest = validateAuthAndPlaylistUrl(event);
	if (validatedRequest instanceof Response) return validatedRequest;
	const { playlistUrl } = validatedRequest;

	try {
		const playlistId = getPlaylistIdFromUrl({
			url: playlistUrl,
			platform: 'youtube music'
		});

		if (!playlistId) {
			return json(
				{ success: false, error: 'Could not extract playlist ID from URL' },
				{ status: 400 }
			);
		}

		const data = await getPlaylist(playlistId);
		const playlistInfo: PlaylistInfoResult = {
			title: data.items[0].snippet.title,
			description: data.items[0].snippet.description,
			imageUrl: data.items[0].snippet.thumbnails.medium.url,
			songCount: data.items[0].contentDetails.itemCount
		};

		return json({ success: true, data: playlistInfo });
	} catch (error) {
		if (error instanceof Error) {
			return json({ success: false, error: error.message }, { status: 500 });
		}
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

async function getPlaylist(playlistId: string) {
	const searchParams = {
		part: 'snippet,contentDetails',
		id: playlistId,
		key: env.YT_MUSIC_KEY
	};
	const url = new URL(
		`https://www.googleapis.com/youtube/v3/playlists`,
		'https://www.googleapis.com/youtube/v3'
	);
	url.search = new URLSearchParams(searchParams).toString();
	const response = await fetch(url);
	const data = await response.json();
	return data as YouTubePlaylistListResponse;
}
