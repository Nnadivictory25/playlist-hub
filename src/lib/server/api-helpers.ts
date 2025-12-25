import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export interface ValidatedRequest {
	user: RequestEvent['locals']['user'];
	session: RequestEvent['locals']['session'];
	playlistUrl: string;
}

export function unauthorized() {
	return json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

export function validateAuthAndPlaylistUrl(event: RequestEvent): Response | ValidatedRequest {
	const { user, session } = event.locals;
	if (!user || !session) {
		return unauthorized();
	}

	const playlistUrl = event.url.searchParams.get('playlistUrl');
	if (!playlistUrl) {
		return json({ success: false, error: 'playlistUrl is required' }, { status: 400 });
	}

	return { user, session, playlistUrl };
}
