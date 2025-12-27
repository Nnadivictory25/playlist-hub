<script lang="ts">
	import { ArrowRight, ArrowUpRight, Star } from '@lucide/svelte';
</script>

<div class="grid-bg fixed inset-0 -z-20"></div>
<section class="relative pt-35">
	<div class="images">
		<img src="/spotify-logo-3d.webp" alt="Spotify 3d" class="floating-1" />
		<img src="/youtube-music-3d.webp" alt="YouTube Music 3d" class="floating-2" />
		<img src="/apple-music-3d.webp" alt="Apple Music 3d" class="floating-3" />
	</div>
	<div
		class="mx-auto flex w-fit items-center justify-center gap-2 rounded-full border border-amber-200 bg-linear-to-r from-amber-50 to-yellow-50 px-4 py-2 text-sm font-medium text-amber-700"
	>
		<span>No. 1 Playlist sharing platform</span>
		<Star size={16} class="fill-amber-500 text-amber-500" />
	</div>
	<div class="mx-auto mt-4 max-w-3xl">
		<h1 class="text-center text-4xl font-bold lg:text-7xl">
			Discover and share your favorite playlists.
		</h1>
		<p class="mx-auto mt-6 max-w-xl text-center text-gray-600">
			Explore new music, get inspired by others, and add your own playlists to the community.
		</p>

		<div class="mt-6 flex justify-center gap-4">
			<a href="/playlists" class="primary rounded-full">
				Explore Playlists
				<ArrowRight size={16} />
			</a>
		</div>
	</div>

	<footer
		class="fixed right-0 bottom-0 left-0 flex items-center justify-center border-t bg-white py-2"
	>
		<p>
			Built with ❤️ by <a
				class="font-medium text-primary transition-all hover:underline"
				href="https://x.com/nnvictory001"
				target="_blank">@Victory</a
			>
		</p>
	</footer>
</section>

<style>
	@import 'tailwindcss/theme';

	.images {
		@apply pointer-events-none absolute inset-0 h-full w-full;
	}

	.images img:first-child {
		@apply absolute top-24 -left-3 size-16 lg:left-1/4;
	}

	.images img:nth-child(2) {
		@apply absolute top-25 -right-3 size-14 lg:right-1/4;
	}

	.images img:last-child {
		@apply absolute bottom-6 -left-2 size-10 lg:bottom-1 lg:left-1/4 lg:size-14;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.floating-1 {
		animation: float 2s ease-in-out infinite;
	}

	.floating-2 {
		animation: float 2.5s ease-in-out infinite 0.5s;
	}

	.floating-3 {
		animation: float 3s ease-in-out infinite 1s;
	}

	.grid-bg {
		background:
			linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
		background-size:
			70px 70px,
			70px 70px;
	}

	.grid-bg::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			color-mix(in oklch, var(--primary), transparent 78%) 0%,
			transparent 50%
		);
		filter: blur(0px);
	}
</style>
