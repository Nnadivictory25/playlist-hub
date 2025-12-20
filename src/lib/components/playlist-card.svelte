<script lang="ts">
    import * as Card from '$lib/components/ui/card/index.js';
    import type { Playlist } from '$lib/server/db/schema';
	import { Music } from '@lucide/svelte';
    import { useMutateLike } from '$lib/hooks/useMutateLike';
    import { page } from '$app/state';
    import { getQueryParams } from '$lib/app-utils';
    import { useQueryClient } from '@tanstack/svelte-query';
    const queryClient = useQueryClient();

    type PlaylistCardProps = {
        playlist: Playlist;
        userId: string;
        isLiked: boolean;
    }

    let { playlist, userId, isLiked }: PlaylistCardProps = $props();

    

    let images = {
        spotify: '/icons8-spotify-48.png',
        youtube: '/icons8-youtube-music-48.png',
        apple: '/icons8-apple-music-48.png',
    }

    const {mutate: toggleLike} = useMutateLike({ playlistId: playlist.id, userId, queryParams: getQueryParams(page.url), queryClient });
</script>

<Card.Root class="p-0 overflow-hidden shadow-none! h-full">
    <div class="px-0 relative">
        <img src={images[playlist.source as keyof typeof images]} alt={playlist.source} class="absolute top-2 right-2 size-8 bg-white p-1 rounded-full shadow-md" loading="lazy" />
        <div class="h-[190px]">
            <img src={playlist.imageUrl} alt={playlist.name} class="w-full h-full object-cover " loading="lazy" />
        </div>
        <div class="p-3">
                <p class="font-medium text-base">{playlist.name}</p>
                <p class="text-sm text-gray-500">{playlist.description}</p>


                <!-- Bottom Row -->
              <div class="p-0 flex justify-between mt-5">
                <div class="flex items-center gap-1 text-xs">
                    <Music size={16} class="text-primary" />
                    <p>{playlist.songCount} songs</p>
                </div>

                <div class="flex items-center gap-1 text-xs">
                    <button aria-label="Like playlist" title="Like playlist" class="cursor-pointer group" onclick={() => toggleLike()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 hover:text-red-600 hover:scale-110 active:scale-95 transition-all duration-150">
                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                        </svg>
                    </button>
                    <p>{playlist.likes} likes</p>
                </div>
              </div>
            </div>
    </div>
</Card.Root>