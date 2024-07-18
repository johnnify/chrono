<script lang="ts">
	import {Command as CommandPrimitive} from 'cmdk-sv'

	import MagnifyingGlass from '$lib/components/icons/MagnifyingGlass.svelte'
	import {cn} from '$lib/utils'

	type Props = CommandPrimitive.InputProps
	let {
		value = $bindable(''),
		class: className = '',
		...restProps
	}: Props = $props()
</script>

<label
	for={restProps.id}
	class="flex items-center border-b px-3"
	data-cmdk-input-wrapper=""
>
	<MagnifyingGlass class="pointer-events mr-2 h-4 w-4 shrink-0 opacity-50" />
	<CommandPrimitive.Input
		class={cn(
			'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 outline-none disabled:cursor-not-allowed disabled:opacity-50',
			className,
		)}
		{...restProps}
		bind:value
	/>
</label>
