<script lang="ts">
	import type {SVGAttributes} from 'svelte/elements'

	type Props = {
		title?: string
	} & SVGAttributes<EventTarget>
	let {title, ...restProps}: Props = $props()
</script>

<svg
	fill="none"
	stroke="currentColor"
	{...restProps}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
>
	{#if title}
		<title>{title}</title>
	{/if}
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="1.5"
		d="M22 12 3 20l3.563-8L3 4zM6.5 12H22"
	/>
</svg>
