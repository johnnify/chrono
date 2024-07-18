<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Dialog as DialogPrimitive} from 'bits-ui'

	import {cn} from '$lib/utils'

	type Props = {children: Snippet} & DialogPrimitive.TitleProps
	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<DialogPrimitive.Title
	class={cn('text-lg font-semibold leading-none tracking-tight', className)}
	{...restProps}
>
	{@render children()}
</DialogPrimitive.Title>
