<script lang="ts">
	import type {HTMLAttributes} from 'svelte/elements'
	import type {Snippet} from 'svelte'

	import {cn} from '$lib/utils'
	import type {HeadingLevel} from '.'

	type Props = {children: Snippet} & HTMLAttributes<HTMLHeadingElement> & {
			level?: HeadingLevel
		}
	let {
		children,
		level = 'h5',
		class: className = '',
		...restProps
	}: Props = $props()
</script>

<svelte:element
	this={level}
	class={cn('mb-1 font-medium leading-none tracking-tight', className)}
	{...restProps}
>
	{@render children()}
</svelte:element>
