<script lang="ts">
	import PlaylistCard from '@/lib/components/playlist-card.svelte';
	import type { PageProps } from './$types';
	import { createQuery } from '@tanstack/svelte-query';
	import { usePlaylists } from '@/lib/hooks/usePlaylists';

    let { data }: PageProps = $props();

    const { playlistsResult, user, queryParams } = data;

    const playlistsQuery = usePlaylists({
        initialData: playlistsResult,
        user,
        queryParams
    });

</script>

<section class="pt-20">
    <h1 class="text-2xl font-bold">Playlists</h1>
    <p class="text-sm text-gray-500">Discover and share your favorite playlists.</p>

    {#if playlistsQuery.isLoading}
        <p>Getting Playlists...</p>
    {:else if playlistsQuery.error}
        <p>Something went wrong: {playlistsQuery.error.message}</p>
    {:else if playlistsQuery.data?.playlists?.length > 0}
        {@const {userLikedPlaylists, playlists} = playlistsQuery.data}
        <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
            {#each playlists as playlist, index (index)}
            {@const isLiked = userLikedPlaylists.includes(playlist.id)}
                <PlaylistCard {playlist} userId={user?.id ?? ''} {isLiked} />
            {/each}
        </div>
    {:else}
        <p>No playlists found</p>
    {/if}
</section>
