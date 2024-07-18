<script lang="ts">
	import type {Snippet} from 'svelte'
	import type {HTMLAnchorAttributes} from 'svelte/elements'

	import Link from './Link.svelte'

	type Props = {
		children: Snippet
	} & Omit<HTMLAnchorAttributes, 'target' | 'rel'>

	let {children, ...restProps}: Props = $props()
</script>

<Link {...restProps} target="_blank" rel="noopener noreferrer">
	{@render children()}
</Link>
