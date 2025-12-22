<script lang="ts">
	import { playlistsQueryParser } from '$lib/app-utils';
	import SearchFilter from '$lib/components/search-filter.svelte';
	import PlaylistCard from '@/lib/components/playlist-card.svelte';
	import { usePlaylists } from '@/lib/hooks/usePlaylists';
	import { useQueryStates } from 'nuqs-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { playlistsResult, user } = data;

	let queryParams = useQueryStates(playlistsQueryParser, {
		shallow: false
	});

	const playlistsQuery = usePlaylists({
		initialData: playlistsResult,
		user,
		queryParams: () => ({
			limit: queryParams.limit.current,
			offset: queryParams.offset.current,
			search: queryParams.search.current,
			genres: queryParams.genres.current
		})
	});
</script>

<section class="pt-20">
	<h1 class="text-2xl font-bold">Playlists</h1>
	<p class="text-sm text-gray-500">Discover and share your favorite playlists.</p>

	<SearchFilter query={queryParams} />

	{#if playlistsQuery.isLoading}
		<p>Getting Playlists...</p>
	{:else if playlistsQuery.error}
		<p>Something went wrong: {playlistsQuery.error.message}</p>
	{:else if playlistsQuery.data?.playlists.length && playlistsQuery.data.playlists.length > 0}
		{@const { userLikedPlaylists, playlists } = playlistsQuery.data}
		<div class="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each playlists as playlist, index (index)}
				{@const isLiked = userLikedPlaylists.includes(playlist.id)}
				<PlaylistCard {playlist} userId={user?.id ?? ''} {isLiked} />
			{/each}
		</div>
	{:else}
		<p>No playlists found</p>
	{/if}
</section>
