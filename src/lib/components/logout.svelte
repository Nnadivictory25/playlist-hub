<script lang="ts">
	import { authClient } from '@/lib/auth-client';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Spinner } from './ui/spinner/index.js';
	import { cn } from '$lib/utils';
	import { buttonVariants } from './ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';

	let isLoading = $state(false);
	let dialogOpen = $state(false);

	async function handleLogout() {
		isLoading = true;
		try {
			await authClient.signOut();
			await goto('/playlists', { invalidateAll: true, replaceState: true });
			toast.success('Logged out');
		} catch (error) {
			console.error('Logout failed:', error);
			toast.error('Failed to logout');
		} finally {
			isLoading = false;
			dialogOpen = false;
		}
	}
</script>

<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Trigger>
		<Button variant="destructive" class="h-8">Logout</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure you want to logout?</AlertDialog.Title>
			<AlertDialog.Description>
				You will be signed out of your account and redirected to the playlists page.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class={cn(buttonVariants({ variant: 'destructive' }))}
				onclick={handleLogout}
				disabled={isLoading}
			>
				{#if isLoading}
					<Spinner size="sm" />
					Logging out...
				{:else}
					Logout
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
