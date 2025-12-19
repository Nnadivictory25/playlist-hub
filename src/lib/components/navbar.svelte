<script lang="ts">
    import logo from '$lib/assets/playlisthub-logo.png';
	import { Music } from '@lucide/svelte';
    let { isSignedIn }: { isSignedIn: boolean } = $props();
</script>

<nav class="flex fixed top-10 left-1/2 -translate-x-1/2 items-center justify-between w-[90%] mx-auto max-w-[550px] px-8 py-3 rounded-full bg-white/20 z-20">
    <a href="/" class="flex items-center gap-1">
       <div class="bg-primary text-white rounded-md size-9 flex items-center justify-center">
        <Music size={25} />
       </div>
        <span class="font-medium text-lg hidden lg:block">PlaylistHub</span>
    </a>
    <ul class="flex items-center gap-4 text-sm font-medium z-20">
        <li><a href="/" class="hover:underline">Playlists</a></li>
        {#if isSignedIn}
            <li><a href="/dashboard" class="primary rounded-full">Dashboard</a></li>
        {:else}
            <li><a href="/sign-in" class="primary rounded-full px-4! w-full">Sign In</a></li>
        {/if}
    </ul>
</nav>


<style>
    @import 'tailwindcss/theme';

    nav {
        box-shadow: 0 4px 55px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    a {
        @apply hover:opacity-80 transition-all duration-100; 
    }

</style>
