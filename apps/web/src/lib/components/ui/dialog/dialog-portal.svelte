<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Dialog as DialogPrimitive} from 'bits-ui'

	type Props = {
		children: Snippet
	} & DialogPrimitive.PortalProps

	let {children, ...restProps}: Props = $props()
</script>

<DialogPrimitive.Portal {...restProps}>
	{@render children()}
</DialogPrimitive.Portal>
