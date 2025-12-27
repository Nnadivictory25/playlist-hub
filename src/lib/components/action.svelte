<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Ellipsis, Pencil, Trash } from '@lucide/svelte';
	import type { Playlist } from '$lib/server/db/schema';
	import { authClient } from '$lib/auth-client';
	import { usePlaylistModal } from '$lib/hooks/usePlaylistModal.svelte';
	import { buttonVariants } from './ui/button/index.js';
	import { Spinner } from './ui/spinner/index.js';
	import { cn } from '../utils';
	import { useDeletePlaylist } from '$lib/hooks/useDeletePlaylist';
	import { toast } from 'svelte-sonner';

	const session = authClient.useSession();

	let { playlist } = $props<{ playlist: Playlist }>();

	const playlistModal = usePlaylistModal();
	const { mutateAsync: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

	const isUserPlaylist = $derived($session.data?.user?.id === playlist.userId);

	let actionModalOpen = $state(false);

	async function handleDelete() {
		try {
			await deletePlaylist(playlist.id);
			actionModalOpen = false;
			toast.success('Playlist deleted');
		} catch (error) {
			toast.error((error as Error).message);
		}
	}
</script>

{#if isUserPlaylist}
	<DropdownMenu.Root bind:open={actionModalOpen}>
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
			<AlertDialog.Root onOpenChange={(open) => !open && (actionModalOpen = false)}>
				<AlertDialog.Trigger
					class="group flex w-full items-center gap-2 rounded-md px-2 py-1 text-red-500! transition-all hover:bg-red-500 hover:text-white!"
				>
					<Trash size={16} strokeWidth={2} class="text-red-500! group-hover:text-white!" />
					<p>Delete</p>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
						<AlertDialog.Description>
							This action cannot be undone. This will permanently delete this playlist.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<AlertDialog.Action
							class={cn(buttonVariants({ variant: 'destructive' }))}
							onclick={handleDelete}
							disabled={isDeleting}
						>
							{#if isDeleting}
								<Spinner size="sm" /> Deleting
							{:else}
								Delete
							{/if}
						</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}

<style>
	@import 'tailwindcss/theme';

	:global(.action-trigger-btn) {
		@apply absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-white p-1 shadow-md transition-opacity duration-150 group-hover:opacity-100 lg:opacity-0;
	}
</style>
