<script lang="ts">
	import {Dialog as SheetPrimitive} from 'bits-ui'
	import {fade} from 'svelte/transition'
	import {cn} from '$lib/utils'

	type Props = SheetPrimitive.OverlayProps

	let {
		children,
		class: className = '',
		transition = fade,
		transitionConfig = {
			duration: 150,
		},
		...restProps
	}: Props = $props()
</script>

<SheetPrimitive.Overlay
	{transition}
	{transitionConfig}
	class={cn('bg-background/80 fixed inset-0 z-50 backdrop-blur-sm', className)}
	{...restProps}
/>
