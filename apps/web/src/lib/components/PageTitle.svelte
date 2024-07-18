<script lang="ts">
	import {cn} from '$lib/utils'
	import type {Snippet} from 'svelte'
	import type {HTMLAttributes} from 'svelte/elements'

	type Props = {
		children: Snippet
	} & HTMLAttributes<HTMLHeadingElement>
	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<h1
	class={cn(
		className,
		'font-fancy text-primary scroll-m-20 text-5xl font-black tracking-tight lg:text-6xl',
	)}
	{...restProps}
>
	{@render children()}
</h1>
