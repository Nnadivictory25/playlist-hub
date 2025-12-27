import type { Playlist } from './server/db/schema';

export const uploadModalStore = $state({
	open: false,
	mode: 'upload' as 'upload' | 'edit',
	playlist: undefined as Playlist | undefined
});
