<script lang="ts">
	import { capitalize, debounce, playlistsQueryParser, platformImages } from '$lib/app-utils';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import {
		ArrowUpDownIcon,
		AudioLines,
		Clock,
		Flame,
		ListFilter,
		Music4,
		XIcon
	} from '@lucide/svelte';
	import { useQueryStates } from 'nuqs-svelte';
	import { Input } from './ui/input';
	import { genres, platforms, type Genre, type Platform } from '$lib/filters';
	import { cn } from '$lib/utils';
	import Badge from './ui/badge/badge.svelte';
	import CreatePlaylist from './create-playlist.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';

	const { query }: { query: ReturnType<typeof useQueryStates<typeof playlistsQueryParser>> } =
		$props();

	let searchInput = $derived(query.search.current);

	const debouncedSearchUpdate = debounce((value: string) => {
		query.search.current = value;
	}, 500);

	const filterOptions = $state([
		{
			label: 'Genres',
			value: 'genres',
			icon: Music4,
			options: genres
		},
		{
			label: 'Platforms',
			value: 'platforms',
			icon: AudioLines,
			options: platforms
		}
	]);

	let selectedFilters = $derived(getSelectedFilters());

	function getSelectedFilters() {
		const filters: ('genres' | 'platforms')[] = [];
		if (query.genres.current.length > 0) {
			filters.push('genres');
		}
		if (query.platforms.current.length > 0) {
			filters.push('platforms');
		}
		return filters;
	}

	let selectedGenres = $derived(query.genres.current);
	let selectedPlatforms = $derived(query.platforms.current);
	let selectedSortBy = $derived(query.sortBy.current as 'latest' | 'popular');

	const filterDropdownStates = $state<Record<'genres' | 'platforms', boolean>>({
		genres: false,
		platforms: false
	});

	function toggleFilter(filterType: 'genres' | 'platforms') {
		filterDropdownStates[filterType] = true;

		if (selectedFilters.includes(filterType)) {
			selectedFilters = selectedFilters.filter((f) => f !== filterType);
		} else {
			selectedFilters = [...selectedFilters, filterType];
		}
	}

	function toggleSelectedOptions(filterType: 'genres' | 'platforms', option: string) {
		if (filterType === 'genres') {
			if (selectedGenres.includes(option as Genre)) {
				query.genres.current = selectedGenres.filter((g) => g !== option);
			} else {
				query.genres.current = [...selectedGenres, option as Genre];
			}
		} else {
			if (selectedPlatforms.includes(option as Platform)) {
				query.platforms.current = selectedPlatforms.filter((p) => p !== option);
			} else {
				query.platforms.current = [...selectedPlatforms, option as Platform];
			}
		}
	}

	function toggleSortBy(sortOption: 'latest' | 'popular') {
		query.sortBy.current = sortOption;
	}

	function clearAllFilters() {
		selectedFilters = [];
		query.genres.current = [];
		query.platforms.current = [];
		query.sortBy.current = 'popular';
	}

	let sortOptions = ['popular', 'latest'];
</script>

<div class="relative mt-5 space-y-4">
	<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
		<div class="flex flex-1 items-center gap-2">
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
						{#each filterOptions as option (option.value)}
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
				class="max-w-xl shadow-none focus-visible:border focus-visible:border-primary focus-visible:ring-0"
			/>
		</div>

		<div class="flex items-center gap-2">
			{#each sortOptions as sortOption, i (sortOption)}
				<Badge
					variant="outline"
					class={cn(
						'cursor-pointer px-3 text-sm font-normal hover:bg-primary/10',
						selectedSortBy === sortOption ? 'active-badge' : ''
					)}
					onclick={() => toggleSortBy(sortOption as 'latest' | 'popular')}
				>
					{#if i === 0}
						<Flame size={25} strokeWidth={2.5} class="text-primary" />
					{:else}
						<Clock size={25} strokeWidth={2.5} class="text-primary" />
					{/if}
					{capitalize(sortOption)}
				</Badge>
			{/each}
			<CreatePlaylist />
		</div>
	</div>

	<!-- Selected Filters Pill + Dropdown -->
	{#if selectedFilters.length > 0}
		<div class="absolute flex items-center gap-2">
			{#each selectedFilters as filter (filter)}
				{@const filterOption = filterOptions.find((option) => option.value === filter)}
				{@const isGenres = filter === 'genres'}
				{@const selectedOptions = isGenres ? selectedGenres : selectedPlatforms}
				<DropdownMenu.Root bind:open={filterDropdownStates[filter]}>
					<DropdownMenu.Trigger class="cursor-pointer">
						<Badge
							variant="outline"
							class={cn('px-3 text-sm', selectedOptions.length > 0 ? 'active-badge' : '')}
						>
							{capitalize(filter)} ({selectedOptions.length})
						</Badge>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="custom-scrollbar relative ml-1 max-h-50 w-55 overflow-y-auto lg:ml-25"
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
						{#each filterOption?.options as option (option)}
							<DropdownMenu.Item
								class="cursor-pointer justify-between"
								onclick={(e) => {
									// prevent the dropdown from closing
									e.preventDefault();
									toggleSelectedOptions(filter, option);
								}}
							>
								<div class="flex items-center gap-2">
									{#if !isGenres}
										<img
											src={platformImages[option as Platform]}
											alt={option}
											class="size-5 rounded"
										/>
									{/if}
									{capitalize(option)}
								</div>
								{#if isGenres ? selectedGenres.includes(option as Genre) : selectedPlatforms.includes(option as Platform)}
									<CheckIcon size={17} strokeWidth={2} class="text-primary" />
								{/if}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/each}
			<Badge
				variant="outline"
				class="cursor-pointer px-3 text-sm font-normal text-gray-600 hover:bg-primary/10"
				onclick={clearAllFilters}
				aria-label="Clear all filters"
				title="Clear all filters"
				aria-describedby="clear-all-filters-description"
			>
				<XIcon size={20} strokeWidth={2} aria-hidden="true" />
				Clear
			</Badge>
			<span id="clear-all-filters-description" class="sr-only">Clear all filters</span>
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
