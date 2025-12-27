import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseHTML } from 'linkedom';
import { validateAuthAndPlaylistUrl } from '$lib/server/api-helpers';

const browserHeaders = {
	'User-Agent':
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'Accept-Language': 'en-US,en;q=0.5',
	'Accept-Encoding': 'gzip, deflate, br',
	Connection: 'keep-alive',
	'Cache-Control': 'max-age=0'
};

export const GET: RequestHandler = async (event) => {
	const validatedRequest = validateAuthAndPlaylistUrl(event);
	if (validatedRequest instanceof Response) return validatedRequest;
	const { playlistUrl } = validatedRequest;

	try {
		const html = await fetch(playlistUrl, { headers: browserHeaders }).then((res) => res.text());
		const playlistInfo = extractPlaylistInfo(html);
		return json({ success: true, data: playlistInfo });
	} catch (error) {
		if (error instanceof Error) {
			return json({ success: false, error: error.message }, { status: 500 });
		}
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

function extractPlaylistInfo(html: string): PlaylistInfoResult {
	const { document } = parseHTML(html);

	// ----- Playlist title -----
	const rawTitle = document.querySelector('title')?.textContent?.trim();
	const title = rawTitle?.split(' - ')[0] ?? 'Unknown';

	// ----- Description -----
	let description =
		document.querySelector('[data-testid="content-modal-text"]')?.textContent?.trim() ||
		document.querySelector('[data-testid="truncate-text"]')?.textContent?.trim() ||
		'';

	// ----- Track count -----
	const countText = document
		.querySelector('[data-testid="tracklist-footer-description"]')
		?.textContent?.trim();

	const songCount = countText ? Number(countText.match(/^(\d+)/)?.[1]) : 0;

	// ----- Cover image -----
	const srcset = document
		.querySelector('picture source[type="image/webp"]')
		?.getAttribute('srcset');

	let imageUrl: string | null = null;

	if (srcset) {
		imageUrl =
			srcset
				.split(',')
				.map((s) => s.trim().split(' ')[0])
				.pop() ?? null;

		// Optional: upscale to 1000x1000
		imageUrl = imageUrl?.replace(/\/\d+x\d+cc\.\w+$/, '/1000x1000cc.webp') as string | null;
	}

	return {
		title,
		description,
		imageUrl: imageUrl ?? '',
		songCount
	};
}
