<script lang="ts">
	import {Separator as SeparatorPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'

	type Props = SeparatorPrimitive.Props

	let {
		class: className,
		orientation = 'horizontal',
		...restProps
	}: Props = $props()
</script>

<SeparatorPrimitive.Root
	class={cn(
		'bg-border shrink-0',
		orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
		className,
	)}
	{orientation}
	{...restProps}
/>
