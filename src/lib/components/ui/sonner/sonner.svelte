<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';
	import { mode } from 'mode-watcher';

	let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
	theme={mode.current}
	class="toaster group"
	style="--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);"
	position="top-center"
	toastOptions={{
		classes: {
			success:
				'bg-green-100! text-green-900! border-green-200! dark:bg-green-900/60! dark:text-green-100! dark:border-green-800!',
			error:
				'bg-red-100! text-red-900! border-red-200! dark:bg-red-900/60! dark:text-red-100! dark:border-red-800!'
		}
	}}
	{...restProps}
/>
