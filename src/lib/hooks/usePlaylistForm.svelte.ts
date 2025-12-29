import { toast } from 'svelte-sonner';
import { useQueryClient } from '@tanstack/svelte-query';
import { uploadModalStore } from '$lib/store.svelte';
import { usePlaylistInfo } from '$lib/hooks/usePlaylistInfo';
import { useUpload } from '$lib/hooks/useUpload';
import { useUpdatePlaylist } from '$lib/hooks/useUpdatePlaylist';
import type { Platform, Genre } from '$lib/filters';

type PlaylistUploadFormData = {
	playlistName: string;
	playlistDescription: string;
	playlistUrl: string;
	selectedGenres: Genre[];
	selectedPlatform: Platform | undefined;
};

export function usePlaylistForm(userId: string) {
	const queryClient = useQueryClient();

	let formData = $state<PlaylistUploadFormData>({
		playlistName: '',
		playlistDescription: '',
		playlistUrl: '',
		selectedGenres: [],
		selectedPlatform: undefined
	});

	let genreDropdownOpen = $state(false);
	let isSubmitting = $state(false);

	const isEdit = $derived(uploadModalStore.mode === 'edit');

	$effect(() => {
		if (uploadModalStore.playlist && isEdit) {
			formData = {
				playlistName: uploadModalStore.playlist.name,
				playlistDescription: uploadModalStore.playlist.description,
				playlistUrl: uploadModalStore.playlist.url,
				selectedPlatform: uploadModalStore.playlist.platform as Platform,
				selectedGenres: uploadModalStore.playlist.genre
			};
		} else {
			// if not edit, reset form 
			resetForm();
		}
	});

	// Using $derived to ensure the playlistInfo query is re-run when the formData changes
	const { data: playlistInfo, isLoading: isLoadingPlaylistInfo, error: playlistInfoError } = $derived(usePlaylistInfo({
		url: formData.playlistUrl,
		platform: formData.selectedPlatform!,
		isEdit
	}));

	$effect(() => {
		if (playlistInfo && !isEdit) {
			formData.playlistName = playlistInfo.title;
			formData.playlistDescription = playlistInfo.description;
		}

		if (playlistInfoError) {
			toast.error(playlistInfoError.message);
		}
	});

	function toggleGenre(genre: Genre) {
		if (formData.selectedGenres.includes(genre)) {
			formData.selectedGenres = formData.selectedGenres.filter((g) => g !== genre);
		} else {
			formData.selectedGenres = [...formData.selectedGenres, genre];
		}
	}

	function isGenreSelected(genre: Genre): boolean {
		return formData.selectedGenres.includes(genre);
	}

	const canSubmit = $derived(
		formData.playlistName.length > 0 &&
		formData.playlistUrl.length > 0 &&
		formData.selectedPlatform &&
		formData.selectedGenres.length > 0
	);

	const { mutateAsync: upload } = useUpload();
	const { mutateAsync: update } = useUpdatePlaylist();

	function resetForm() {
		uploadModalStore.playlist = undefined;
		formData = {
			playlistName: '',
			playlistDescription: '',
			playlistUrl: '',
			selectedGenres: [],
			selectedPlatform: undefined
		};
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!userId) {
			toast.error('Please login to continue');
			return;
		}

		isSubmitting = true;

		try {
			if (isEdit && uploadModalStore.playlist) {
				await update({
					playlistId: uploadModalStore.playlist.id,
					name: formData.playlistName,
					description: formData.playlistDescription,
					genres: formData.selectedGenres
				});
				toast.success('Playlist updated successfully');
			} else if (playlistInfo) {
				await upload({
					formData,
					userId,
					playlistInfo
				});
				toast.success('Playlist uploaded successfully');
			}

			// Invalidate both playlist queries
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['playlists'] }),
				queryClient.invalidateQueries({ queryKey: ['user-dashboard'] })
			]);
			uploadModalStore.open = false;
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			isSubmitting = false;
			resetForm();
		}
	}

	return {
		// Using getters to maintain reactivity when sharing state across modules.
		// Since Svelte's compiler only operates on one file at a time, directly exporting
		// $state variables would lose their reactivity when imported elsewhere.
		// Getters ensure the reactive references are preserved when accessed from other files.
		get formData() { return formData; },
		get isEdit() { return isEdit; },
		get playlistInfo() { return playlistInfo; },
		get isLoadingPlaylistInfo() { return isLoadingPlaylistInfo; },
		get canSubmit() { return canSubmit; },
		get isSubmitting() { return isSubmitting; },
		get genreDropdownOpen() { return genreDropdownOpen; },
		set genreDropdownOpen(value: boolean) { genreDropdownOpen = value; },
		toggleGenre,
		isGenreSelected,
		handleSubmit
	};
}
