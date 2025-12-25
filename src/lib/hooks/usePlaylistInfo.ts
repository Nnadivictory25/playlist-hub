import { createQuery } from '@tanstack/svelte-query';
import { platformToUrl, type Platform, isValidPlatform } from '../filters';

export function usePlaylistInfo(options: { url: string; platform: Platform }) {
	return createQuery(() => ({
		queryKey: ['playlist-info', options.url, options.platform],
		queryFn: async () => {
			const res = await fetch(
				`/api/playlist-info/${platformToUrl(options.platform)}?playlistUrl=${encodeURIComponent(options.url)}`
			);
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			return json.data as PlaylistInfoResult;
		},
		enabled: !!options.url && isValidPlatform(options.platform),
		staleTime: 1000 * 60 * 60 * 24,
		gcTime: 1000 * 60 * 60 * 24
	}));
}
