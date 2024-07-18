<script lang="ts">
	import type {HTMLInputAttributes} from 'svelte/elements'
	import {cn} from '$lib/utils'

	type Props = {
		files: FileList | undefined | null
	} & Omit<HTMLInputAttributes, 'type'>
	let {
		class: className = '',
		files = $bindable<Props['files']>(),
		...restProps
	}: Props = $props()
</script>

<input
	class={cn(
		'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:mt-0.5 file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
		className,
	)}
	type="file"
	bind:files
	{...restProps}
/>
