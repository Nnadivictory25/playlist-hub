<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '../utils';
	import { capitalize, platformImages } from '$lib/app-utils';
	import { Plus } from '@lucide/svelte';
	import { platforms, genres, type Platform, type Genre } from '$lib/filters';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { XIcon } from '@lucide/svelte';
	import Badge from './ui/badge/badge.svelte';
	import { usePlaylistInfo } from '$lib/hooks/usePlaylistInfo';

	type PlaylistUploadFormData = {
		playlistName: string;
		playlistUrl: string;
		selectedGenres: Genre[];
		selectedPlatform: Platform | undefined;
	};

	let formData = $state<PlaylistUploadFormData>({
		playlistName: '',
		playlistUrl: '',
		selectedGenres: [],
		selectedPlatform: undefined
	});

	let genreDropdownOpen = $state(false);

	function toggleGenre(genre: Genre) {
		if (formData.selectedGenres.includes(genre)) {
			formData.selectedGenres = formData.selectedGenres.filter((g) => g !== genre);
		} else {
			formData.selectedGenres = [...formData.selectedGenres, genre];
		}
	}

	// const { data: playlistInfo } = usePlaylistInfo({
	// 	playlistId: playlistId,
	// 	platform: selectedPlatform
	// });
</script>

<Dialog.Root open={true}>
	<form>
		<Dialog.Trigger class={cn(buttonVariants({ variant: 'default' }), 'h-8 cursor-pointer px-4!')}>
			<Plus size={17} strokeWidth={2.5} class="" />
			Upload Playlist
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Upload Playlist</Dialog.Title>
				<Dialog.Description>Upload your playlist for others to discover.</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4">
				<div class="grid gap-3">
					<Label for="name-1">Name</Label>
					<Input
						id="name-1"
						name="name"
						placeholder="Enter playlist name"
						bind:value={formData.playlistName}
					/>
				</div>
				<div class="grid gap-3">
					<Label for="platform-1">Platform</Label>
					<Select.Root bind:value={formData.selectedPlatform} type="single">
						<Select.Trigger id="platform-1" class="w-full">
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
					<Label for="genre-1">Genre</Label>
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
								<Input id="genre-1" readonly placeholder="Select genre(s)" class="cursor-pointer" />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="max-h-60 w-56 overflow-y-auto">
								{#each genres as genre (genre)}
									<DropdownMenu.Item
										class="cursor-pointer justify-between"
										onclick={(e) => {
											e.preventDefault();
											toggleGenre(genre);
										}}
									>
										{genre}
										{#if formData.selectedGenres.includes(genre)}
											<CheckIcon size={17} strokeWidth={2} class="text-primary" />
										{/if}
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Button type="submit">Save changes</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>
