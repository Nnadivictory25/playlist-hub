<script lang="ts">
	import { ArrowRight, ArrowUpRight, Star } from "@lucide/svelte";
</script>

<div class="fixed inset-0 grid-bg -z-20"></div>
<section class="pt-35 relative">
    <div class="images">
        <img src="/spotify-logo-3d.webp" alt="Spotify 3d" class="floating-1">
        <img src="/youtube-music-3d.webp" alt="YouTube Music 3d" class="floating-2">
        <img src="/apple-music-3d.webp" alt="Apple Music 3d" class="floating-3">
    </div>
    <div class="flex items-center justify-center gap-2 w-fit mx-auto px-4 py-2 text-sm font-medium text-amber-700 bg-linear-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full">
        <span>No. 1 Playlist sharing platform</span>
        <Star size={16} class="text-amber-500 fill-amber-500" />
    </div>
<div class="max-w-3xl mx-auto mt-4">
    <h1 class="text-4xl lg:text-7xl font-bold text-center">
        Discover and share your favorite playlists.
    </h1>
    <p class="mt-6  text-center text-gray-600 max-w-xl mx-auto">
        Explore new music, get inspired by others, and add your own playlists to the community.
    </p>

    <div class="mt-6 flex justify-center gap-4">
            <a href="/playlists" class="primary rounded-full">
                Explore Playlists
                <ArrowRight size={16} />
            </a>
            <a href="/sign-in" class="secondary rounded-full">
                Sign Up
                <ArrowUpRight size={16} />
            </a>
    </div>
</div>
</section>


<style>
    @import 'tailwindcss/theme';

    .images {
        @apply absolute inset-0 w-full h-full pointer-events-none;
    }

    .images img:first-child {
        @apply size-16 absolute top-24 -left-3 lg:left-1/4;
    }

    .images img:nth-child(2) {
        @apply size-14 absolute top-25 -right-3 lg:right-1/4;
    }

    .images img:last-child {
        @apply size-10 lg:size-14 absolute bottom-6 lg:bottom-1 -left-2 lg:left-1/4;
    }

    @keyframes float {
        0%, 100% {
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
        background-size: 70px 70px, 70px 70px;
    }

    .grid-bg::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, color-mix(in oklch, var(--primary), transparent 78%) 0%, transparent 50%);
        filter: blur(0px);
    }
</style>