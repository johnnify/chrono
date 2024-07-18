<script lang="ts">
	import type {Snippet} from 'svelte'
	import {scale} from 'svelte/transition'
	import {Select as SelectPrimitive} from 'bits-ui'
	import {cn, flyAndScale} from '$lib/utils'

	type Props = {children: Snippet} & SelectPrimitive.ContentProps
	let {
		children,
		class: className = '',
		sideOffset = 4,
		inTransition = flyAndScale,
		inTransitionConfig = undefined,
		outTransition = scale,
		outTransitionConfig = {
			start: 0.95,
			opacity: 0,
			duration: 50,
		},
		...restProps
	}: Props = $props()
</script>

<SelectPrimitive.Content
	{inTransition}
	{inTransitionConfig}
	{outTransition}
	{outTransitionConfig}
	{sideOffset}
	class={cn(
		'bg-popover text-popover-foreground relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md focus:outline-none',
		className,
	)}
	{...restProps}
>
	<div class="w-full p-1">
		{@render children()}
	</div>
</SelectPrimitive.Content>
