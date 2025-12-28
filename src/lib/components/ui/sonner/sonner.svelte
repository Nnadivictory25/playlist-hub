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
			success: 'bg-green-700! text-white! border-green-600! w-fit!',
			error: 'bg-red-700! text-white! border-red-600! w-fit!'
		}
	}}
	{...restProps}
/>
