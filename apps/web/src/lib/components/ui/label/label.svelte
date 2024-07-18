<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Label as LabelPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'

	type Props = {
		children: Snippet
	} & LabelPrimitive.Props

	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<LabelPrimitive.Root
	class={cn(
		'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className,
	)}
	{...restProps}
>
	{@render children()}
</LabelPrimitive.Root>
