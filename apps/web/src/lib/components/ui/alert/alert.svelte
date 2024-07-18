<script lang="ts">
	import type {Snippet} from 'svelte'
	import type {HTMLAttributes} from 'svelte/elements'

	import {cn} from '$lib/utils'
	import {type Variant, alertVariants} from '.'

	type Props = {children: Snippet} & HTMLAttributes<HTMLDivElement> & {
			variant?: Variant
		}
	let {
		children,
		variant = 'default',
		class: className = '',
		role = 'alert',
		...restProps
	}: Props = $props()
</script>

<div {role} class={cn(alertVariants({variant}), className)} {...restProps}>
	{@render children()}
</div>
