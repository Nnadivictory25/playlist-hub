<script lang="ts">
	import './layout.css';
	import logo from '$lib/assets/playlisthub-logo.png';
	import { NuqsAdapter } from 'nuqs-svelte/adapters/svelte-kit';
	import '@fontsource-variable/rubik';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Navbar from '$lib/components/navbar.svelte';
	import type { LayoutProps } from './$types';
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import Clarity from '@microsoft/clarity';
	import { onMount } from 'svelte';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	let { data, children }: LayoutProps = $props();
	const title = 'PlaylistHub - Discover and share your favorite playlists';
	const description =
		'Explore new music, get inspired by others, and add your own playlists to the community.';

	onMount(() => {
		Clarity.init('utmccmsjwo');
	});
</script>

<svelte:head>
	<link rel="icon" href={logo} />
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="https://playlisthub.online/og.png" />
	<meta property="og:url" content="https://playlisthub.online" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://playlisthub.online/og.png" />
	<link rel="canonical" href="https://playlisthub.online" />
</svelte:head>

<Toaster />
<main class="mx-auto max-w-7xl px-7 pt-10 pb-10">
	<Navbar isSignedIn={data.isSignedIn} />
	<Tooltip.Provider>
		<NuqsAdapter>
			<QueryClientProvider client={queryClient}>
				{@render children()}
			</QueryClientProvider>
		</NuqsAdapter>
	</Tooltip.Provider>
</main>
