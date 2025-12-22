<script lang="ts">
	import { debounce, playlistsQueryParser } from '$lib/app-utils';
	import { useQueryStates } from 'nuqs-svelte';
	import { Input } from './ui/input';

	const { query }: { query: ReturnType<typeof useQueryStates<typeof playlistsQueryParser>> } =
		$props();

	let searchInput = $state('');

	$effect(() => {
		searchInput = query.search.current;
	});

	const debouncedSearchUpdate = debounce((value: string) => {
		query.search.current = value;
	}, 500);
</script>

<div>
	<Input
		type="search"
		placeholder="Search Playlists..."
		bind:value={searchInput}
		oninput={(e) => debouncedSearchUpdate(e.currentTarget.value)}
		class="shadow-none focus-visible:border focus-visible:border-primary focus-visible:ring-0"
	/>
</div>
