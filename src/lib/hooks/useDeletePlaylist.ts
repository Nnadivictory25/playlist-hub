import { createMutation } from '@tanstack/svelte-query';
import { useQueryClient } from '@tanstack/svelte-query';

export function useDeletePlaylist() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (playlistId: number) => {
			const res = await fetch(`/api/playlists/${playlistId}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Failed to delete playlist');
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['playlists'] });
		}
	}));
}
