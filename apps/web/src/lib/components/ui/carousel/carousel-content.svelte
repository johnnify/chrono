<script lang="ts">
	import type {Snippet} from 'svelte'
	import type {HTMLAttributes} from 'svelte/elements'
	import emblaCarouselSvelte from 'embla-carousel-svelte'
	import {getEmblaContext} from './context'
	import {cn} from '$lib/utils'

	type Props = {
		children: Snippet
	} & HTMLAttributes<HTMLDivElement>

	let {children, class: className, ...restProps}: Props = $props()

	const {orientation, options, plugins, onInit} = getEmblaContext(
		'<Carousel.Content/>',
	)
</script>

<div
	class="overflow-hidden"
	use:emblaCarouselSvelte={{
		options: {
			container: '[data-embla-container]',
			slides: '[data-embla-slide]',
			...$options,
			axis: $orientation === 'horizontal' ? 'x' : 'y',
		},
		plugins: $plugins,
	}}
	on:emblaInit={onInit}
>
	<div
		class={cn(
			'flex',
			$orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
			className,
		)}
		data-embla-container=""
		{...restProps}
	>
		{@render children()}
	</div>
</div>
