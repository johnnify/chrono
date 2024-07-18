<script lang="ts">
	import type {VariantProps} from 'tailwind-variants'
	import {getEmblaContext} from './context'
	import {cn} from '$lib/utils'
	import {
		Button,
		type Props,
		type buttonVariants,
	} from '$lib/components/ui/button'
	import ChevronLeft from '$lib/components/icons/ChevronLeft.svelte'

	let {
		variant = 'outline',
		size = 'icon',
		class: className,
		...restProps
	}: Props = $props()

	const {orientation, canScrollPrev, scrollPrev, handleKeyDown} =
		getEmblaContext('<Carousel.Previous/>')
</script>

<Button
	{variant}
	{size}
	class={cn(
		'absolute h-8 w-8 touch-manipulation rounded-full active:translate-y-0',
		$orientation === 'horizontal'
			? '-left-12 top-1/2 -translate-y-1/2 active:-translate-y-1/2'
			: '-top-12 left-1/2 -translate-x-1/2 rotate-90 active:-translate-x-1/2',
		className,
	)}
	disabled={!$canScrollPrev}
	onclick={scrollPrev}
	onkeydown={handleKeyDown}
	{...restProps}
>
	<ChevronLeft class="h-4 w-4" />
	<span class="sr-only">Previous slide</span>
</Button>
