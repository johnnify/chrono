<script lang="ts">
	// Based on this example by @SikandarJODD
	// https://animation-svelte.vercel.app/luxe/button-animated-border
	import {cn} from '$lib/utils'
	import {Button, type ButtonProps} from '$lib/components/ui/button'

	let {children, class: className = '', ...restProps}: ButtonProps = $props()
</script>

<Button
	class={cn(
		'group relative grid overflow-hidden rounded-xl text-lg transition-colors',
		className,
	)}
	{...restProps}
>
	<span>
		<span
			class="mask-gradient animate-flip before:animate-kitrotate absolute inset-0 h-full w-full overflow-hidden rounded-xl [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]"
		></span>
	</span>
	<span
		class="backdrop absolute inset-px rounded-[11px] bg-inherit transition-colors group-hover:bg-inherit"
	></span>
	<span class="z-10 h-full w-full">
		{@render children()}
	</span>
</Button>
