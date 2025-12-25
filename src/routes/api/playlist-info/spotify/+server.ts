import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getPlaylistIdFromUrl } from '$lib/app-utils';
import { validateAuthAndPlaylistUrl } from '$lib/server/api-helpers';

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export const GET: RequestHandler = async (event) => {
	const validatedRequest = validateAuthAndPlaylistUrl(event);
	if (validatedRequest instanceof Response) return validatedRequest;

	const { playlistUrl } = validatedRequest;

	try {
		const playlistId = getPlaylistIdFromUrl({ url: playlistUrl, platform: 'spotify' });
		if (!playlistId) {
			return json(
				{ success: false, error: 'Could not extract playlist ID from URL' },
				{ status: 400 }
			);
		}

		const playlistInfo = await getPlaylistInfo(playlistId);
		return json({ success: true, data: playlistInfo });
	} catch (error) {
		if (error instanceof Error) {
			return json({ success: false, error: error.message }, { status: 500 });
		}
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

async function getAccessToken(): Promise<string> {
	if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
		return cachedAccessToken.token;
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`
		},
		body: new URLSearchParams({
			grant_type: 'client_credentials'
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to get Spotify access token: ${error}`);
	}

	const data = await response.json();
	const expiresIn = data.expires_in || 3600;

	cachedAccessToken = {
		token: data.access_token,
		expiresAt: Date.now() + expiresIn * 1000 - 60000
	};

	return cachedAccessToken.token;
}

async function getPlaylistInfo(playlistId: string): Promise<PlaylistInfoResult> {
	const accessToken = await getAccessToken();

	const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to fetch Spotify playlist: ${error}`);
	}

	const data = await response.json();

	return {
		title: data.name,
		description: data.description || '',
		imageUrl: data.images[0]?.url || '',
		songCount: data.tracks.total
	};
}
