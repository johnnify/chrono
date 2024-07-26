<script lang="ts">
	import ChevronLeft from '$lib/components/icons/ChevronLeft.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import {Button} from '$lib/components/ui/button'
	import LivestreamForm from '../../LivestreamForm.svelte'
	import AgendaSection from '../AgendaSection/AgendaSection.svelte'

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

	<AgendaSection
		agenda={data.livestream.agenda}
		agendaItemForms={data.labelAgendaItemForms}
	/>
</main>
