<script lang="ts">
	import {cn} from '$lib/utils'
	import type {Snippet} from 'svelte'

	type Props = {
		children: Snippet
		class?: string
		style?: string
	}
	let {children, style, class: className = ''}: Props = $props()
</script>

<h2
	{style}
	class={cn(
		'font-fancy text-primary scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
		className,
	)}
>
	{@render children()}
</h2>
