import type { Session, User } from 'better-auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: Session;
			user?: User;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type GetPlaylistsResult = {
		playlists: Playlist[];
		userLikedPlaylists: number[];
		totalLikes: number;
	};
}

export { };
