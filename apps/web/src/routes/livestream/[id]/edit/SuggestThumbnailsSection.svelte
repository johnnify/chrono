<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte'
	import AiSuggestThumbnails from '../../AiSuggestThumbnails.svelte'

	type Props = {livestreamId: string}

	let {livestreamId}: Props = $props()
</script>

<section class="grid gap-6">
	<SectionTitle class="text-foreground">Thumbnail</SectionTitle>

	<AiSuggestThumbnails {livestreamId} />
</section>
