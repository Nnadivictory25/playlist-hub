import { uploadModalStore } from '$lib/store.svelte';
import type { Playlist } from '$lib/server/db/schema';

export function usePlaylistModal() {
	function openUploadModal() {
		uploadModalStore.mode = 'upload';
		uploadModalStore.playlist = undefined;
		uploadModalStore.open = true;
	}

	function openEditModal(playlist: Playlist) {
		uploadModalStore.mode = 'edit';
		uploadModalStore.playlist = playlist;
		uploadModalStore.open = true;
	}

	function closeModal() {
		uploadModalStore.open = false;
	}


	return {
		openUploadModal,
		openEditModal,
		closeModal
	};
}
