<script lang="ts">
	import logo from '$lib/assets/playlisthub-logo.png';
	import { Music } from '@lucide/svelte';
	let { isSignedIn }: { isSignedIn: boolean } = $props();
</script>

<nav
	class="fixed top-10 left-1/2 z-20 mx-auto flex w-[90%] max-w-[550px] -translate-x-1/2 items-center justify-between rounded-full bg-white/20 px-8 py-3"
>
	<a href="/" class="flex items-center gap-1">
		<div class="flex size-9 items-center justify-center rounded-md bg-primary text-white">
			<Music size={25} />
		</div>
		<span class="hidden text-lg font-medium lg:block">PlaylistHub</span>
	</a>
	<ul class="z-20 flex items-center gap-4 text-sm font-medium">
		<li><a href="/playlists" class="hover:underline">Playlists</a></li>
		{#if isSignedIn}
			<li><a href="/dashboard" class="primary rounded-full">Dashboard</a></li>
		{:else}
			<li><a href="/sign-in" class="primary w-full rounded-full px-4!">Sign In</a></li>
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
		@apply transition-all duration-100 hover:opacity-80;
	}
</style>
