<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Dialog as SheetPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'

	type Props = {
		children: Snippet
	} & SheetPrimitive.PortalProps

	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<SheetPrimitive.Portal class={cn(className)} {...restProps}>
	{@render children()}
</SheetPrimitive.Portal>
