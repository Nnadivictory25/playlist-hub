import { createQuery } from '@tanstack/svelte-query';
import { platformToUrl, type Platform, isValidPlatform } from '../filters';

export function usePlaylistInfo({ url, platform }: { url: string; platform: Platform }) {
	return createQuery(() => ({
		queryKey: ['playlist-info', url, platform],
		queryFn: async () => {
			const res = await fetch(
				`/api/playlist-info/${platformToUrl(platform)}?playlistUrl=${encodeURIComponent(url)}`
			);
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			return json.data as PlaylistInfoResult;
		},
		enabled: !!url && isValidPlatform(platform),
		staleTime: 1000 * 60 * 60 * 24 // 24 hours
	}));
}
