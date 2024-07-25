<script lang="ts">
	import {enhance} from '$app/forms'
	import Plus from '$lib/components/icons/Plus.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import SectionTitle from '$lib/components/SectionTitle.svelte'
	import * as Form from '$lib/components/ui/form'
	import Agenda from './Agenda.svelte'

	let {data} = $props()
</script>

<main class="container flex grow flex-col gap-4">
	<PageTitle class="mb-6 text-3xl">
		{data.livestream.title}
	</PageTitle>

	<SectionTitle class="text-foreground">Agenda</SectionTitle>

	{#if data.livestream.agenda.length}
		<Agenda
			agenda={data.livestream.agenda}
			agendaItemForms={data.labelAgendaItemForms}
		/>
	{/if}

	<form method="POST" action="?/createAgendaItem" use:enhance>
		<Form.Button><Plus class="mr-1 w-4" /> New item</Form.Button>
	</form>
</main>
