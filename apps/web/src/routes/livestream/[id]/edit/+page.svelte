<script lang="ts">
	import {PUBLIC_FEATURE_SUGGEST_THUMBNAILS} from '$env/static/public'
	import ChevronLeft from '$lib/components/icons/ChevronLeft.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import {Button} from '$lib/components/ui/button'
	import LivestreamForm from '../../LivestreamForm.svelte'
	import AgendaSection from '../AgendaSection/AgendaSection.svelte'
	import SuggestThumbnailsSection from './SuggestThumbnailsSection.svelte'

	let {data} = $props()
</script>

<main class="container flex grow flex-col gap-4">
	<PageTitle class="text-3xl">Edit Livestream</PageTitle>
	<div class="flex justify-between">
		<Button variant="outline" href="/livestream/{data.livestream.id}">
			<ChevronLeft class="mr-1 w-4" />
			Back
		</Button>
	</div>

	<LivestreamForm id={data.livestream.id} data={data.editForm} />

	{#if PUBLIC_FEATURE_SUGGEST_THUMBNAILS}
		<SuggestThumbnailsSection livestreamId={data.livestream.id} />
	{/if}
	<AgendaSection
		agenda={data.livestream.agenda}
		agendaItemForms={data.updateAgendaItemForms}
	/>
</main>
