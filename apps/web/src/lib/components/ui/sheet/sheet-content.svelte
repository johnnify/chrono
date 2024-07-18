<script lang="ts">
	import {Dialog as SheetPrimitive} from 'bits-ui'
	import {fly} from 'svelte/transition'
	import {
		SheetOverlay,
		SheetPortal,
		type Side,
		sheetTransitions,
		sheetVariants,
	} from './'
	import {cn} from '$lib/utils'
	import Cross from '$lib/components/icons/Cross.svelte'
	import type {Snippet} from 'svelte'

	type Props = {
		children: Snippet
		side?: Side
	} & SheetPrimitive.ContentProps

	let {
		children,
		class: className = '',
		side = 'right',
		inTransition = fly,
		inTransitionConfig = sheetTransitions[side ?? 'right'].in,
		outTransition = fly,
		outTransitionConfig = sheetTransitions[side ?? 'right'].out,
		...restProps
	}: Props = $props()
</script>

<SheetPortal>
	<SheetOverlay />
	<SheetPrimitive.Content
		{inTransition}
		{inTransitionConfig}
		{outTransition}
		{outTransitionConfig}
		class={cn(sheetVariants({side}), className)}
		{...restProps}
	>
		{@render children()}
		<SheetPrimitive.Close
			class="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
		>
			<Cross class="h-4 w-4" />
			<span class="sr-only">Close</span>
		</SheetPrimitive.Close>
	</SheetPrimitive.Content>
</SheetPortal>
