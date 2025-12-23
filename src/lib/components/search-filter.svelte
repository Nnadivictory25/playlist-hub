<script lang="ts">
	import { capitalize, debounce, playlistsQueryParser } from '$lib/app-utils';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { AudioLines, ListFilter, Music4 } from '@lucide/svelte';
	import { useQueryStates } from 'nuqs-svelte';
	import { Input } from './ui/input';
	import { genres } from '../genres';
	import { cn } from '../utils';
	import Badge from './ui/badge/badge.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { fade } from 'svelte/transition';

	type FilterOption = {
		label: string;
		value: 'genres' | 'platforms';
		icon: any;
		options: { label: string; value: string }[];
		selectedOptions: string[];
	};

	const { query }: { query: ReturnType<typeof useQueryStates<typeof playlistsQueryParser>> } =
		$props();

	let searchInput = $state('');

	$effect(() => {
		searchInput = query.search.current;
	});

	const debouncedSearchUpdate = debounce((value: string) => {
		query.search.current = value;
	}, 500);

	const filterOptions = $state<FilterOption[]>([
		{
			label: 'Genres',
			value: 'genres',
			icon: Music4,
			options: genres.map((genre) => ({
				label: genre,
				value: genre
			})),
			selectedOptions: []
		},
		{
			label: 'Platforms',
			value: 'platforms',
			icon: AudioLines,
			options: [
				{
					label: 'Spotify',
					value: 'spotify'
				},
				{
					label: 'YouTube Music',
					value: 'youtube-music'
				},
				{
					label: 'Apple Music',
					value: 'apple-music'
				},
				{
					label: 'SoundCloud',
					value: 'soundcloud'
				}
			],
			selectedOptions: []
		}
	]);

	let selectedFilters = $state<('genres' | 'platforms')[]>([]);

	function toggleFilter(filterType: 'genres' | 'platforms') {
		if (selectedFilters.includes(filterType)) {
			selectedFilters = selectedFilters.filter((f) => f !== filterType);
		} else {
			selectedFilters = [...selectedFilters, filterType];
		}
	}

	function toggleSelectedOptions(filterType: 'genres' | 'platforms', option: string) {
		const filterOption = filterOptions.find((opt) => opt.value === filterType);
		if (!filterOption) return;

		if (filterOption.selectedOptions.includes(option)) {
			filterOption.selectedOptions = filterOption.selectedOptions.filter((o) => o !== option);
		} else {
			filterOption.selectedOptions = [...filterOption.selectedOptions, option];
		}
	}

	const filterDropdownStates = $state<Record<'genres' | 'platforms', boolean>>({
		genres: true,
		platforms: true
	});
</script>

<div class="mt-5 space-y-4">
	<div class="flex items-center gap-2">
		<!-- Filters Dropdown -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				aria-label="Filter Playlists"
				title="Filter Playlists"
				aria-haspopup="menu"
				class={cn(
					'flex size-9 cursor-pointer items-center justify-center rounded-lg',
					selectedFilters.length
						? 'bg-primary/10 text-primary transition-colors duration-150 hover:bg-primary/20'
						: ''
				)}
			>
				<ListFilter size={17} strokeWidth={3} class="font-bold" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					{#each filterOptions as option}
						<DropdownMenu.Item
							class="cursor-pointer text-sm"
							onclick={() => toggleFilter(option.value as 'genres' | 'platforms')}
						>
							<option.icon size={17} strokeWidth={2} />
							{option.label}
							{#if selectedFilters.includes(option.value as 'genres' | 'platforms')}
								<CheckIcon size={17} strokeWidth={2} class="text-primary" />
							{/if}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<!-- Search Input -->
		<Input
			type="search"
			placeholder="Search Playlists..."
			bind:value={searchInput}
			oninput={(e) => debouncedSearchUpdate(e.currentTarget.value)}
			class="shadow-none focus-visible:border focus-visible:border-primary focus-visible:ring-0"
		/>
	</div>

	<!-- Selected Filters Pill + Dropdown -->
	{#if selectedFilters.length > 0}
		<div class="flex items-center gap-2">
			{#each selectedFilters as filter}
				{@const filterOption = filterOptions.find((option) => option.value === filter)}
				{@const isGenres = filter === 'genres'}
				{@const selectedOptions = filterOption?.selectedOptions ?? []}
				<DropdownMenu.Root bind:open={filterDropdownStates[filter]}>
					<DropdownMenu.Trigger class="cursor-pointer">
						<Badge
							variant="outline"
							class={cn(
								'text-sm',
								selectedOptions.length > 0 ? 'border border-primary bg-primary/10 text-primary' : ''
							)}
						>
							{capitalize(filter)}
						</Badge>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="custom-scrollbar relative ml-1 max-h-50 w-50 overflow-y-auto lg:ml-25"
						data-filter={filter}
					>
						<DropdownMenu.Label class="text-xs! font-medium!"
							>{filterOption?.options.length}
							{isGenres ? 'Genres' : 'Platforms'}
							{#if isGenres}
								<span class="text-gray-500">(scroll for more)</span>
							{/if}
						</DropdownMenu.Label>
						<DropdownMenu.Separator />

						<!-- Options for the selected filter -->
						{#each filterOption?.options as option}
							<DropdownMenu.Item
								class="cursor-pointer justify-between"
								onclick={(e) => {
									// prevent the dropdown from closing
									e.preventDefault();
									toggleSelectedOptions(filter, option.value);
								}}
							>
								{option.label}
								{#if selectedOptions.includes(option.value)}
									<CheckIcon size={17} strokeWidth={2} class="text-primary" />
								{/if}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/each}
		</div>
	{/if}
</div>

<style>
	:global(.custom-scrollbar) {
		scrollbar-width: thin;
		scrollbar-color: #cbd5e1 #f1f5f9;
	}

	:global(.custom-scrollbar::-webkit-scrollbar) {
		width: 6px;
	}

	:global(.custom-scrollbar::-webkit-scrollbar-thumb) {
		background: #cbd5e1;
		border-radius: 3px;
	}

	:global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) {
		background: #94a3b8;
	}
</style>
