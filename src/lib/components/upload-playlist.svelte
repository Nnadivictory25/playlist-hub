<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn } from '../utils';
	import { capitalize, platformImages } from '$lib/app-utils';
	import { Plus } from '@lucide/svelte';
	import { platforms, genres, type Platform, type Genre } from '$lib/filters';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { XIcon } from '@lucide/svelte';
	import Badge from './ui/badge/badge.svelte';
	import Spinner from './ui/spinner/spinner.svelte';
	import { authClient } from '$lib/auth-client';
	import { usePlaylistForm } from '$lib/hooks/usePlaylistForm.svelte';
	import { usePlaylistModal } from '$lib/hooks/usePlaylistModal.svelte';
	import { uploadModalStore } from '$lib/store.svelte';

	const session = authClient.useSession();
	const userId = $derived($session.data?.user?.id || '');

	let {
		formData,
		isEdit,
		playlistInfo,
		isLoadingPlaylistInfo,
		canSubmit,
		isSubmitting,
		genreDropdownOpen,
		toggleGenre,
		isGenreSelected,
		resetForm,
		handleSubmit
	} = $derived(usePlaylistForm(userId));

	const playlistModal = usePlaylistModal();

	function handleOpenChange(open: boolean) {
		if (open) {
			resetForm();
			playlistModal.openUploadModal();
		}
	}

	$inspect({ formData });
</script>

<Dialog.Root bind:open={uploadModalStore.open} onOpenChange={handleOpenChange}>
	<Dialog.Trigger
		title={!$session.data?.user ? 'Please login to upload a playlist' : 'Upload your Playlist'}
		disabled={!$session.data?.user}
		class={cn(buttonVariants({ variant: 'default' }), 'h-8 cursor-pointer px-4')}
	>
		<Plus size={17} strokeWidth={2.5} />
		Upload Playlist
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<form onsubmit={handleSubmit}>
			<Dialog.Header>
				<Dialog.Title>{isEdit ? 'Edit Playlist' : 'Upload Playlist'}</Dialog.Title>
				<Dialog.Description
					>{isEdit
						? 'Edit your playlist information.'
						: 'Upload your playlist for others to discover.'}</Dialog.Description
				>
			</Dialog.Header>
			<div class="mt-5 grid gap-4">
				<div class="grid gap-3">
					<Label for="platform"
						>Platform
						<span class="text-red-500">*</span>
					</Label>
					<Select.Root disabled={isEdit} bind:value={formData.selectedPlatform} type="single">
						<Select.Trigger id="platform" class="w-full disabled:cursor-not-allowed">
							{#if formData.selectedPlatform}
								<div class="flex items-center gap-2">
									<img
										src={platformImages[formData.selectedPlatform]}
										alt={formData.selectedPlatform}
										class="size-5 rounded"
									/>
									{capitalize(formData.selectedPlatform as Platform)}
								</div>
							{:else}
								Select platform
							{/if}
						</Select.Trigger>
						<Select.Content>
							{#each platforms as platform (platform)}
								<Select.Item value={platform} label={capitalize(platform)}>
									<div class="flex items-center gap-2">
										<img src={platformImages[platform]} alt={platform} class="size-5 rounded" />
										{capitalize(platform)}
									</div>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid gap-3">
					<Label for="genre">
						Genre
						<span class="text-red-500">*</span>
					</Label>
					<div class="relative space-y-2">
						{#if formData.selectedGenres.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each formData.selectedGenres as genre (genre)}
									<Badge
										variant="outline"
										class="active-badge cursor-pointer px-3 text-sm"
										onclick={() => toggleGenre(genre)}
									>
										{genre}
										<XIcon size={14} strokeWidth={2} class="ml-1" />
									</Badge>
								{/each}
							</div>
						{/if}
						<DropdownMenu.Root bind:open={genreDropdownOpen}>
							<DropdownMenu.Trigger class="w-full">
								<Input
									id="genre"
									readonly
									placeholder={`Select ${formData.selectedGenres.length > 0 ? 'more' : ''} genre(s)`}
									class="relative cursor-pointer"
								/>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content
								class="max-h-60 min-w-(--bits-dropdown-menu-anchor-width) overflow-y-auto"
								align="start"
							>
								{#each genres as genre (genre)}
									<DropdownMenu.Item
										class="cursor-pointer justify-between"
										onclick={(e) => {
											e.preventDefault();
											toggleGenre(genre);
										}}
									>
										{genre}
										{#if isGenreSelected(genre)}
											<CheckIcon size={17} strokeWidth={2} class="text-primary" />
										{/if}
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>

				<div class="grid gap-3">
					<Label for="url">
						URL
						<span class="text-red-500">*</span>
					</Label>
					<Input
						disabled={isLoadingPlaylistInfo || isEdit}
						id="url"
						name="url"
						type="url"
						placeholder="Enter playlist URL"
						bind:value={formData.playlistUrl}
					/>
					{#if isLoadingPlaylistInfo}
						<div class="flex animate-pulse items-center gap-1 text-sm text-primary">
							<Spinner /> Loading playlist info...
						</div>
					{/if}
				</div>

				{#if playlistInfo || isEdit}
					<div class="grid gap-3">
						<Label for="name">
							Playlist Name
							<span class="text-red-500">*</span>
						</Label>
						<Input
							id="name"
							placeholder="Enter playlist name"
							required
							bind:value={formData.playlistName}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="description">
							Description
							<span class="text-red-500">*</span>
						</Label>
						<Textarea
							id="description"
							placeholder="Enter playlist description"
							required
							bind:value={formData.playlistDescription}
						/>
					</div>
				{/if}
			</div>
			<Dialog.Footer class="mt-4">
				<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}
					>Cancel</Dialog.Close
				>
				<Button
					disabled={isLoadingPlaylistInfo || !canSubmit || !$session.data?.user}
					type="submit"
				>
					{#if isSubmitting}
						<Spinner size="sm" /> {isEdit ? 'Updating...' : 'Uploading...'}
					{:else}
						{isEdit ? 'Update' : 'Upload'}
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
