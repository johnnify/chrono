<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Command as CommandPrimitive} from 'cmdk-sv'
	import {cn} from '$lib/utils'

	type Props = {children: Snippet} & CommandPrimitive.EmptyProps
	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<CommandPrimitive.Empty
	class={cn('py-6 text-center text-sm', className)}
	{...restProps}
>
	{@render children()}
</CommandPrimitive.Empty>
