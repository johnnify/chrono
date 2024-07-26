<script lang="ts">
	import type {HTMLTextareaAttributes} from 'svelte/elements'
	import {cn} from '$lib/utils'

	type Props = HTMLTextareaAttributes

	let {class: className, value = $bindable(), ...restProps}: Props = $props()
</script>

<textarea
	class={cn(
		'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
		className,
	)}
	bind:value
	{...restProps}
></textarea>
