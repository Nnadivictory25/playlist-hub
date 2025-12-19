import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const session = locals.session;

    if (session) {
        throw redirect(302, '/playlists');
    }


}) satisfies PageServerLoad;