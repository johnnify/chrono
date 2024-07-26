<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte'
	import {cn} from '$lib/utils'

	type Props = {
		description: string | null
	}
	let {description}: Props = $props()
</script>

<section class="grid gap-6">
	<SectionTitle class="text-foreground">Description</SectionTitle>

	<p class={cn('text-lg', {'text-muted-foreground italic': !description})}>
		{description ?? 'No description added yet'}
	</p>
</section>
