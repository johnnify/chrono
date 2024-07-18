<script lang="ts">
	import type {SVGAttributes} from 'svelte/elements'

	let {...restProps}: SVGAttributes<EventTarget> = $props()
</script>

<svg
	fill="currentColor"
	fill-rule="evenodd"
	{...restProps}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
>
	<path d="M4 11h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2" />
</svg>
