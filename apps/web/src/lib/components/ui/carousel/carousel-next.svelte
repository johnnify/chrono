<script lang="ts">
	import type {VariantProps} from 'tailwind-variants'
	import {getEmblaContext} from './context'
	import {cn} from '$lib/utils'
	import {
		Button,
		type Props,
		type buttonVariants,
	} from '$lib/components/ui/button'
	import ChevronRight from '$lib/components/icons/ChevronRight.svelte'

	let {
		variant = 'outline',
		size = 'icon',
		class: className,
		...restProps
	}: Props = $props()

	const {orientation, canScrollNext, scrollNext, handleKeyDown} =
		getEmblaContext('<Carousel.Next/>')
</script>

<Button
	{variant}
	{size}
	class={cn(
		'absolute h-8 w-8 touch-manipulation rounded-full',
		$orientation === 'horizontal'
			? '-right-12 top-1/2 -translate-y-1/2 active:-translate-y-1/2'
			: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90 active:-translate-x-1/2',
		className,
	)}
	disabled={!$canScrollNext}
	onclick={scrollNext}
	onkeydown={handleKeyDown}
	{...restProps}
>
	<ChevronRight class="h-4 w-4" />
	<span class="sr-only">Next slide</span>
</Button>
