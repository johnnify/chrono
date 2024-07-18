<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Select as SelectPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'
	import CaretSort from '$lib/components/icons/CaretSort.svelte'

	type Props = {children: Snippet} & SelectPrimitive.TriggerProps

	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<SelectPrimitive.Trigger
	class={cn(
		'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
		className,
	)}
	{...restProps}
>
	{@render children()}

	<div>
		<CaretSort class="h-4 w-4 opacity-50" />
	</div>
</SelectPrimitive.Trigger>
