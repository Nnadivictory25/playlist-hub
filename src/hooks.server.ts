import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Fetch current session from Better Auth
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	// Make session and user available on server
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const response = await svelteKitHandler({ event, resolve, auth, building });

	// Cache images and static assets for 1 year
	if (event.url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	}

	return response;
};
