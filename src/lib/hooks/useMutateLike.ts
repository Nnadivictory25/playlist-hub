import { QueryClient, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';
import type { PlaylistsQueryParams } from '$lib/app-utils';

type UseMutateLikeProps = {
	userId: string;
	queryClient: QueryClient;
};

// Helper function to update playlist data in any query result
function updatePlaylistInQueryData(
	data: GetPlaylistsResult | GetUserDashboardResult | undefined,
	playlistId: number
): GetPlaylistsResult | GetUserDashboardResult | undefined {
	if (!data) return;

	// Check if it's GetUserDashboardResult
	if ('userPlaylists' in data) {
		const dashboardData = data as GetUserDashboardResult;
		const isLiked = dashboardData.userLikedPlaylistsIds.includes(playlistId);

		const updatedUserLikedPlaylistsIds = isLiked
			? dashboardData.userLikedPlaylistsIds.filter((id: number) => id !== playlistId)
			: [...dashboardData.userLikedPlaylistsIds, playlistId];

		const updatePlaylistLikes = (playlists: typeof dashboardData.userPlaylists) =>
			playlists.map((p) => {
				if (p.id === playlistId) {
					return {
						...p,
						likes: isLiked ? p.likes - 1 : p.likes + 1
					};
				}
				return p;
			});

		return {
			...dashboardData,
			userLikedPlaylistsIds: updatedUserLikedPlaylistsIds,
			userPlaylists: updatePlaylistLikes(dashboardData.userPlaylists),
			likedPlaylists: updatePlaylistLikes(dashboardData.likedPlaylists)
		};
	}

	// It's GetPlaylistsResult
	const playlistsData = data as GetPlaylistsResult;
	const isLiked = playlistsData.userLikedPlaylistsIds.includes(playlistId);

	const updatedUserLikedPlaylistsIds = isLiked
		? playlistsData.userLikedPlaylistsIds.filter((id: number) => id !== playlistId)
		: [...playlistsData.userLikedPlaylistsIds, playlistId];

	const updatedPlaylists = playlistsData.playlists.map((p) => {
		if (p.id === playlistId) {
			return {
				...p,
				likes: isLiked ? p.likes - 1 : p.likes + 1
			};
		}
		return p;
	});

	return {
		...playlistsData,
		userLikedPlaylistsIds: updatedUserLikedPlaylistsIds,
		playlists: updatedPlaylists
	};
}

export function useMutateLike({ userId, queryClient }: UseMutateLikeProps) {
	// All playlist-related query key patterns
	const playlistQueryPatterns = [['playlists'], ['user-dashboard']];

	return createMutation(() => ({
		mutationFn: async (playlistId: number) => {
			const res = await fetch(`/api/playlists/like`, {
				method: 'POST',
				body: JSON.stringify({ playlistId, userId })
			});
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			return json.data as 'liked' | 'unliked';
		},
		onMutate: async (playlistId: number) => {
			// Cancel all playlist-related queries
			for (const pattern of playlistQueryPatterns) {
				await queryClient.cancelQueries({ queryKey: pattern });
			}

			// Store previous data for all affected queries
			const previousDataMap = new Map();
			for (const pattern of playlistQueryPatterns) {
				const queries = queryClient.getQueriesData({ queryKey: pattern });
				queries.forEach(([queryKey, data]) => {
					previousDataMap.set(JSON.stringify(queryKey), data);
				});
			}

			// Optimistically update all playlist-related queries
			for (const pattern of playlistQueryPatterns) {
				queryClient.setQueriesData(
					{ queryKey: pattern },
					(oldData: GetPlaylistsResult | GetUserDashboardResult | undefined) => {
						return updatePlaylistInQueryData(oldData, playlistId);
					}
				);
			}

			return { previousDataMap };
		},
		onError: (error, _variables, context) => {
			// Rollback all affected queries
			if (context?.previousDataMap) {
				context.previousDataMap.forEach((data, keyString) => {
					const queryKey = JSON.parse(keyString);
					queryClient.setQueryData(queryKey, data);
				});
			}
			toast.error(error.message);
		},

		onSettled: () => {
			// For playlists queries sorted by 'popular', don't invalidate or re-sort
			// This keeps the playlist in place while the like count updates
			// The list will naturally re-sort on the next fetch (filter change, pagination, etc.)
			const playlistsQueries = queryClient.getQueriesData({ queryKey: ['playlists'] });

			playlistsQueries.forEach(([queryKey]) => {
				// Extract sortBy from query key (format: ['playlists', userId, params])
				const params = (queryKey as unknown[])[2] as { sortBy?: 'latest' | 'popular' } | undefined;
				const sortBy = params?.sortBy;

				// Only invalidate if NOT sorted by 'popular'
				// When sorted by 'popular', we keep the optimistic update but don't re-sort
				// This prevents playlists from jumping around immediately after liking
				if (sortBy !== 'popular') {
					queryClient.invalidateQueries({ queryKey });
				}
			});

			// Always invalidate user-dashboard queries
			queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
		}
	}));
}
