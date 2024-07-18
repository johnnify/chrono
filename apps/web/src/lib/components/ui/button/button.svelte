<script lang="ts">
	import {Button as ButtonPrimitive} from 'bits-ui'
	import {buttonVariants, type ButtonProps} from '.'
	import {cn} from '$lib/utils'

	let {
		children,
		class: className = '',
		variant = 'default',
		size = 'default',
		builders = [],
		...restProps
	}: ButtonProps = $props()
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({variant, size, className}))}
	{...restProps}
>
	{@render children()}
</ButtonPrimitive.Root>
