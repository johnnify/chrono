<script lang="ts">
	import {Dialog as SheetPrimitive} from 'bits-ui'
	import type {Snippet} from 'svelte'
	import {cn} from '$lib/utils'

	type Props = {
		children: Snippet
	} & SheetPrimitive.DescriptionProps

	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<SheetPrimitive.Description
	class={cn('text-muted-foreground text-sm', className)}
	{...restProps}
>
	{@render children()}
</SheetPrimitive.Description>
