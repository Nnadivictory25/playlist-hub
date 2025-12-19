<script lang="ts">
	import './layout.css';
	import logo from '$lib/assets/playlisthub-logo.png';
    import '@fontsource-variable/rubik';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import Navbar from '$lib/components/navbar.svelte';
	import type { LayoutProps } from './$types';

	let { data, children}: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>


<Toaster />
<main class="mx-auto max-w-6xl px-5 pt-16 pb-10">
	<Navbar isSignedIn={data.isSignedIn} />
	
	{@render children()}
</main>
