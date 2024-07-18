<script lang="ts">
	import type {Snippet} from 'svelte'
	import type {HTMLAnchorAttributes} from 'svelte/elements'

	type Props = {
		children: Snippet
	} & HTMLAnchorAttributes
	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<a {...restProps} class={`${className} btn btn-primary shadow hover:shadow-md`}>
	{@render children()}
</a>
