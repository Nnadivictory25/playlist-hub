<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Ellipsis, Pencil } from '@lucide/svelte';
	import type { Playlist } from '$lib/server/db/schema';
	import { authClient } from '$lib/auth-client';
	import { usePlaylistModal } from '$lib/hooks/usePlaylistModal.svelte';

	const session = authClient.useSession();

	let { playlist } = $props<{ playlist: Playlist }>();

	const playlistModal = usePlaylistModal();

	const isUserPlaylist = $derived($session.data?.user?.id === playlist.userId);
</script>

{#if isUserPlaylist}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="action-trigger-btn">
			<Ellipsis size={16} strokeWidth={2} class="cursor-pointer text-primary" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="mr-5 lg:mr-20">
			<DropdownMenu.Item
				class="cursor-pointer"
				onclick={() => playlistModal.openEditModal(playlist)}
			>
				<Pencil size={16} strokeWidth={2} class="text-primary" />
				<p>Edit</p>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}

<style>
	@import 'tailwindcss/theme';

	:global(.action-trigger-btn) {
		@apply absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-white p-1 shadow-md transition-opacity duration-150 group-hover:opacity-100 lg:opacity-0;
	}
</style>
