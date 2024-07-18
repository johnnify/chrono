<script lang="ts">
	import type {SVGAttributes} from 'svelte/elements'

	let {...restProps}: SVGAttributes<EventTarget> = $props()
</script>

<svg {...restProps} viewBox="0 0 24 24">
	<path
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M5 12h7m7 0h-7m0 0V5m0 7v7"
	/>
</svg>
