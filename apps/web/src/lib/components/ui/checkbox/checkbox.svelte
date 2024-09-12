<script lang="ts">
	import {Checkbox as CheckboxPrimitive} from 'bits-ui'
	import {cn} from '$lib/utils'
	import Check from '$lib/components/icons/Check.svelte'
	import Minus from '$lib/components/icons/Minus.svelte'

	let {
		class: className = '',
		checked = $bindable(),
		value = $bindable(),
		...restProps
	}: CheckboxPrimitive.Props = $props()
</script>

<CheckboxPrimitive.Root
	class={cn(
		'border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer box-content h-8 w-8 shrink-0 rounded-sm border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
		className,
	)}
	bind:checked
	bind:value
	{...restProps}
>
	<CheckboxPrimitive.Indicator
		class={cn('flex h-8 w-8 items-center justify-center text-current')}
		let:isChecked
		let:isIndeterminate
	>
		{#if isIndeterminate}
			<Minus class="h-6 w-6" />
		{:else}
			<Check class={cn('h-6 w-6', !isChecked && 'text-transparent')} />
		{/if}
	</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
