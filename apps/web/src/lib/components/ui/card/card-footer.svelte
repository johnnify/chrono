<script lang="ts">
	import type {Snippet} from 'svelte'
	import type {HTMLAttributes} from 'svelte/elements'
	import {cn} from '$lib/utils'

	type Props = {children: Snippet} & HTMLAttributes<HTMLDivElement>
	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<div class={cn('flex items-center p-6 pt-0', className)} {...restProps}>
	{@render children()}
</div>
