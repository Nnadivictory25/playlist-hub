import { createMutation } from '@tanstack/svelte-query';
import type { Genre } from '$lib/filters';

type UpdateData = {
	playlistId: number;
	name: string;
	description: string;
	genres: Genre[];
};

export function useUpdatePlaylist() {
	return createMutation(() => ({
		mutationFn: async (data: UpdateData) => {
			const updateData = {
				name: data.name,
				description: data.description,
				genre: data.genres
			};

			const res = await fetch(`/api/playlists/${data.playlistId}`, {
				method: 'PUT',
				body: JSON.stringify(updateData)
			});

			if (!res.ok) throw new Error('Failed to update playlist');
			return res.json();
		}
	}));
}
