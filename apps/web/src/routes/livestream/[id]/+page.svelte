<script lang="ts">
	import ChevronLeft from '$lib/components/icons/ChevronLeft.svelte'
	import Pencil from '$lib/components/icons/Pencil.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import {Button} from '$lib/components/ui/button'
	import AgendaSection from './AgendaSection/AgendaSection.svelte'
	import DescriptionSection from './DescriptionSection.svelte'

	let {data} = $props()
</script>

<main class="container flex grow flex-col gap-4">
	<PageTitle class="text-3xl">
		{data.livestream.title}
	</PageTitle>
	<div class="flex justify-between">
		<Button variant="outline" href="/livestreams">
			<ChevronLeft class="mr-1 w-4" />
			Back
		</Button>
		<Button variant="outline" href="/livestream/{data.livestream.id}/edit">
			<Pencil class="mr-1 w-3.5" />
			Edit
		</Button>
	</div>

	<DescriptionSection description={null} />

	<AgendaSection
		agenda={data.livestream.agenda}
		agendaItemForms={data.labelAgendaItemForms}
	/>
</main>
