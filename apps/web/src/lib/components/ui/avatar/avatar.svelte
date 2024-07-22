<script lang="ts">
	import {Avatar as AvatarPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'
	import type {Snippet} from 'svelte'

	type Props = {
		children: Snippet
	} & AvatarPrimitive.Props
	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<AvatarPrimitive.Root
	class={cn(
		'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
		className,
	)}
	{...restProps}
>
	{@render children()}
</AvatarPrimitive.Root>
