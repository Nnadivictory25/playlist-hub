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

	type PlaylistInfoResult = {
		title: string;
		description: string;
		imageUrl: string;
		songCount: number;
	};

	// YouTube Music API Types
	type YouTubePlaylistItem = {
		id: string;
		snippet: {
			title: string;
			description: string;
			thumbnails: {
				medium: {
					url: string;
				};
			};
		};
		contentDetails: {
			itemCount: number;
		};
	};

	type YouTubePlaylistListResponse = {
		items: YouTubePlaylistItem[];
	};
}

export {};
