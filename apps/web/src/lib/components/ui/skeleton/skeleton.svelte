<script lang="ts">
	import type {HTMLAttributes} from 'svelte/elements'

	import {cn} from '$lib/utils'

	let {class: className = '', ...restProps}: HTMLAttributes<HTMLDivElement> =
		$props()
</script>

<div
	class={cn('bg-primary/30 animate-pulse rounded-md', className)}
	{...restProps}
></div>
