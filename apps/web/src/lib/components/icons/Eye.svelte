<script lang="ts">
	import type {SVGAttributes} from 'svelte/elements'

	let {...restProps}: SVGAttributes<EventTarget> = $props()
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-linecap="round"
	stroke-linejoin="round"
	{...restProps}
	xmlns="http://www.w3.org/2000/svg"
>
	<path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
	<path
		d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7"
	/>
</svg>
