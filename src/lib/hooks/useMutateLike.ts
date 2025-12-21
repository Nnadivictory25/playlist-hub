import { QueryClient, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';

type UseMutateLikeProps = {
	playlistId: number;
	userId: string;
	queryParams: Record<string, string>;
	queryClient: QueryClient;
};

export function useMutateLike({
	playlistId,
	userId,
	queryParams,
	queryClient
}: UseMutateLikeProps) {
	const queryKey = ['playlists', userId, queryParams];

	return createMutation(() => ({
		mutationFn: async () => {
			const res = await fetch(`/api/playlists/like`, {
				method: 'POST',
				body: JSON.stringify({ playlistId, userId })
			});
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			return json.data as 'liked' | 'unliked';
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey }); // Cancel any outgoing refetches

			// Get the previous data for rollback
			const previousData = queryClient.getQueryData(queryKey);

			// Optimistically update the UI
			queryClient.setQueryData(queryKey, (oldData: GetPlaylistsResult | undefined) => {
				if (!oldData) return;

				const isLiked = oldData.userLikedPlaylists.includes(playlistId);

				return {
					...oldData,
					userLikedPlaylists: isLiked
						? oldData.userLikedPlaylists.filter((id) => id !== playlistId)
						: [...oldData.userLikedPlaylists, playlistId],
					playlists: oldData.playlists.map((p) => {
						if (p.id === playlistId) {
							return {
								...p,
								likes: isLiked ? p.likes - 1 : p.likes + 1
							};
						}
						return p;
					})
				};
			});

			return { previousData };
		},
		onError: (error, _variables, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(queryKey, context.previousData);
			}
			toast.error(error.message);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey });
		}
	}));
}
