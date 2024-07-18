<script lang="ts">
	import type {Snippet} from 'svelte'
	import type {HTMLAttributes} from 'svelte/elements'
	import type {HeadingLevel} from './index'
	import {cn} from '$lib/utils'

	type Props = {
		children: Snippet
		tag?: HeadingLevel
	} & HTMLAttributes<HTMLDivElement>

	let {
		children,
		tag = 'h3',
		class: className = '',
		...restProps
	}: Props = $props()
</script>

<svelte:element
	this={tag}
	class={cn('font-semibold leading-none tracking-tight', className)}
	{...restProps}
>
	{@render children()}
</svelte:element>
