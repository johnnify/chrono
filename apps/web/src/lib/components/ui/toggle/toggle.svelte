<script lang="ts">
	import {Toggle as TogglePrimitive} from 'bits-ui'
	import {type Size, type Variant, toggleVariants} from './index.js'
	import {cn} from '$lib/utils'
	import type {Snippet} from 'svelte'

	type Props = {
		children: Snippet
		variant?: Variant
		size?: Size
	} & TogglePrimitive.Props

	let {
		children,
		class: className = '',
		variant = 'default',
		size = 'default',
		pressed = $bindable(),
		...restProps
	}: Props = $props()
</script>

<TogglePrimitive.Root
	bind:pressed
	class={cn(toggleVariants({variant, size, className}))}
	{...restProps}
>
	{@render children()}
</TogglePrimitive.Root>
