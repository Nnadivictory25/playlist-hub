import { createQuery } from '@tanstack/svelte-query';
import type { User } from 'better-auth';

type UseUserPlaylistsParams = {
	initialData?: GetUserPlaylistsResult;
	user?: User;
};

export function useUserPlaylists({ initialData, user }: UseUserPlaylistsParams = {}) {
	return createQuery(() => ({
		queryKey: ['user-playlists', user?.id],
		queryFn: async () => {
			const res = await fetch('/api/playlists/user');
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			return json.data as GetUserPlaylistsResult;
		},
		enabled: !!user,
		initialData,
		staleTime: 1000 * 60 * 5 // 5 minutes
	}));
}
