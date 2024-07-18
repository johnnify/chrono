<script lang="ts">
	import {Dialog as SheetPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'
	import type {Snippet} from 'svelte'

	type Props = {
		children: Snippet
	} & SheetPrimitive.TitleProps

	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<SheetPrimitive.Title
	class={cn('text-foreground text-lg font-semibold', className)}
	{...restProps}
>
	{@render children()}
</SheetPrimitive.Title>
