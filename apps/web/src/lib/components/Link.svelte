<script lang="ts">
	import type {Snippet} from 'svelte'
	import type {HTMLAnchorAttributes} from 'svelte/elements'

	type Props = {
		children: Snippet
	} & HTMLAnchorAttributes

	let {children, class: className = '', ...restProps}: Props = $props()
</script>

<a
	{...restProps}
	class={`${className} decoration-primary focus-visible:ring-ring underline transition hover:brightness-150 focus-visible:outline-none focus-visible:ring-1 dark:hover:brightness-125`}
>
	{@render children()}
</a>
