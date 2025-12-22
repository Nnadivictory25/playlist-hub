import { getQueryParams } from '$lib/app-utils';
import { getPlaylists } from '$lib/server/db/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const user = locals.user;
	const queryParams = getQueryParams(url);
	const playlistsResult = await getPlaylists({ ...queryParams, userId: user?.id });
	return { playlistsResult, user };
}) satisfies PageServerLoad;
