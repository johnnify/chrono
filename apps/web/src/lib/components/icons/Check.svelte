<script lang="ts">
	import type {SVGAttributes} from 'svelte/elements'

	let {...restProps}: SVGAttributes<EventTarget> = $props()
</script>

<svg
	fill="none"
	stroke="currentColor"
	{...restProps}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M20 7 10 17l-5-5"
	/>
</svg>
