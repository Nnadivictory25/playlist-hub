import { createQuery } from "@tanstack/svelte-query";
import type { User } from "better-auth";
import { objectToQueryParams } from "../app-utils";

type QueryParams = {
    limit?: string;
    offset?: string;
};

export function usePlaylists({ initialData, user, queryParams }: { initialData: GetPlaylistsResult, user?: User, queryParams: QueryParams }) {
    return createQuery(() => ({
        queryKey: ['playlists', user?.id, queryParams],
        queryFn: async () => {
            const res = await fetch(`/api/playlists?${objectToQueryParams({ ...queryParams, userId: user?.id ?? '' })}`);
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data as GetPlaylistsResult;
        },
        initialData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    }))
}