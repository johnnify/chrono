<script lang="ts">
	import {Popover as PopoverPrimitive} from 'bits-ui'
	import {cn, flyAndScale} from '$lib/utils'
	import type {Snippet} from 'svelte'

	type Props = {
		children: Snippet
	} & PopoverPrimitive.ContentProps

	let {
		children,
		class: className = '',
		transition = flyAndScale,
		transitionConfig = 'default',
		align = 'center',
		sideOffset = 4,
		...restProps
	}: Props = $props()
</script>

<PopoverPrimitive.Content
	{transition}
	{transitionConfig}
	{align}
	{sideOffset}
	{...restProps}
	class={cn(
		'bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-none',
		className,
	)}
>
	{@render children()}
</PopoverPrimitive.Content>
