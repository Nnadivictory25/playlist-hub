<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Playlist } from '$lib/server/db/schema';
	import { ArrowUpRightIcon, Clock, Music, Play } from '@lucide/svelte';
	import { useMutateLike } from '$lib/hooks/useMutateLike';
	import { page } from '$app/state';
	import { formatTime, getQueryParams, platformImages } from '$lib/app-utils';
	import type { Platform } from '$lib/filters';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	const queryClient = useQueryClient();

	type PlaylistCardProps = {
		playlist: Playlist;
		userId: string;
		isLiked: boolean;
		isUser?: boolean;
	};

	let { playlist, userId, isLiked, isUser = false }: PlaylistCardProps = $props();

	const { mutate: toggleLike } = useMutateLike({
		playlistId: playlist.id,
		userId,
		queryParams: getQueryParams(page.url),
		queryClient
	});

	let isAnimating = $state(false);

	const handleLike = () => {
		if (!userId) {
			toast.error('You must be logged in to like a playlist');
			return;
		}
		isAnimating = true;
		toggleLike();
		setTimeout(() => (isAnimating = false), 600);
	};

	const truncateDescription = (text: string, maxLength = 85) => {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + '...';
	};
</script>

<Card.Root class="h-full overflow-hidden p-0 shadow-none! fade-in-100">
	<div class="relative flex h-full flex-col px-0">
		<img
			src={platformImages[playlist.platform as Platform]}
			alt={playlist.platform}
			class="absolute top-2 right-2 size-8 rounded-full bg-white p-1 shadow-md"
			loading="lazy"
		/>
		<div class="h-[190px]">
			<img
				src={playlist.imageUrl}
				alt={playlist.name}
				class="h-full w-full object-cover"
				loading="lazy"
			/>
		</div>
		<div class="flex flex-1 flex-col justify-between p-3">
			<div>
				<p class="text-base font-medium">{playlist.name}</p>
				<p class="text-sm text-gray-700">{truncateDescription(playlist.description ?? '')}</p>
			</div>

			<div class="mt-auto pt-5">
				<!-- Middle Row -->
				<div class="flex justify-between p-0">
					<div
						class="flex items-center gap-1 rounded-lg bg-primary/5 px-3 py-2 text-xs text-primary"
					>
						<Music size={16} />
						<p class="font-medium">{playlist.songCount} songs</p>
					</div>

					<p class="flex items-center gap-1 text-xs text-gray-500">
						<Clock size={15} />
						{formatTime(new Date(playlist.createdAt))}
					</p>
				</div>

				<!-- Bottom Row -->
				<div class="mt-3 grid grid-cols-2 gap-2">
					<div class="flex items-center gap-1 text-xs">
						<button
							aria-label="Like playlist"
							title={isLiked ? 'Unlike playlist' : 'Like playlist'}
							class="group cursor-pointer rounded-sm bg-primary/5 px-2 py-1"
							onclick={handleLike}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill={isLiked ? 'currentColor' : 'none'}
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class={`text-red-500 transition-all duration-150 hover:scale-110 hover:text-red-600 active:scale-75 ${isAnimating ? 'animate-heart-pop' : ''}`}
							>
								<path
									d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
								/>
							</svg>
						</button>
						<p>{playlist.likes} likes</p>
					</div>

					<a
						href={playlist.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-primary px-2 py-1 text-xs font-medium text-primary transition-all duration-150 hover:bg-primary hover:text-primary-foreground"
					>
						View Playlist
						<ArrowUpRightIcon
							size={14}
							strokeWidth={2.5}
							class="group-hover:text-primary-foreground"
						/>
					</a>
				</div>
			</div>
		</div>
	</div>
</Card.Root>
