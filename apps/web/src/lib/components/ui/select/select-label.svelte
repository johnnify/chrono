<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Select as SelectPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'

	type Props = {children: Snippet} & SelectPrimitive.LabelProps

	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<SelectPrimitive.Label
	class={cn('px-2 py-1.5 text-sm font-semibold', className)}
	{...restProps}
>
	{@render children()}
</SelectPrimitive.Label>
