<script lang="ts">
	import type {Snippet} from 'svelte'
	import {Select as SelectPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'
	import Check from '$lib/components/icons/Check.svelte'

	type Props = {children: Snippet<[string]>} & SelectPrimitive.ItemProps

	let {
		children,
		class: className = '',
		value,
		label = undefined,
		disabled = undefined,
		...restProps
	}: Props = $props()
</script>

<SelectPrimitive.Item
	{value}
	{disabled}
	{label}
	class={cn(
		'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className,
	)}
	{...restProps}
>
	<span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
		<SelectPrimitive.ItemIndicator>
			<Check class="h-4 w-4" />
		</SelectPrimitive.ItemIndicator>
	</span>
	{@render children((label || value) as string)}
</SelectPrimitive.Item>
