<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Calendar as CalendarPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'

	type Props = {
		children: Snippet
	} & CalendarPrimitive.CellProps

	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<CalendarPrimitive.Cell
	class={cn(
		'[&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50 relative p-0 text-center focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md',
		className,
	)}
	{...restProps}
>
	{@render children()}
</CalendarPrimitive.Cell>
