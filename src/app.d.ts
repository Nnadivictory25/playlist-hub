import type { Session, User } from 'better-auth';
import type { Playlist } from './lib/server/db/schema';

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

	type GetUserPlaylistsResult = {
		playlists: Playlist[];
	};
}

export {};
