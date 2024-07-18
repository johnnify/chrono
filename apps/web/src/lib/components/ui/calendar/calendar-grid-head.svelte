<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Calendar as CalendarPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'

	type Props = {
		children: Snippet
	} & CalendarPrimitive.GridHeadProps

	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<CalendarPrimitive.GridHead class={cn(className)} {...restProps}>
	{@render children()}
</CalendarPrimitive.GridHead>
