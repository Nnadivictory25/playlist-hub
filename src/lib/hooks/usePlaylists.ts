import { createQuery } from '@tanstack/svelte-query';
import type { User } from 'better-auth';
import { objectToQueryParams } from '../app-utils';
import type { Genre, Platform } from '../filters';

export type QueryParams = {
	limit?: number;
	offset?: number;
	search?: string;
	genres?: Genre[];
	platforms?: Platform[];
};

type UsePlaylistsParams = {
	initialData: GetPlaylistsResult;
	user?: User;
	queryParams: QueryParams | (() => QueryParams);
};

export function usePlaylists({ initialData, user, queryParams }: UsePlaylistsParams) {
	// Helper to resolve params whether passed as object or function
	const resolveParams = () => (typeof queryParams === 'function' ? queryParams() : queryParams);

	// Capture the initial params to determine when to use initialData
	const initialParams = resolveParams();

	return createQuery(() => {
		const params = resolveParams();

		// Only use initialData if the current params match the initial params
		// We use JSON.stringify for a simple deep equality check
		const isInitial = JSON.stringify(params) === JSON.stringify(initialParams);

		return {
			queryKey: ['playlists', user?.id, params],
			queryFn: async () => {
				const fetchParams = {
					...params,
					userId: user?.id ?? ''
				};
				const res = await fetch(`/api/playlists?${encodeURI(objectToQueryParams(fetchParams))}`);
				const json = await res.json();
				if (!json.success) throw new Error(json.error);
				return json.data as GetPlaylistsResult;
			},
			initialData: isInitial ? initialData : undefined,
			staleTime: 1000 * 60 * 5 // 5 minutes
		};
	});
}
