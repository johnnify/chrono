<script lang="ts">
	import {enhance} from '$app/forms'
	import Delete from '$lib/components/icons/Delete.svelte'
	import Plus from '$lib/components/icons/Plus.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import SectionTitle from '$lib/components/SectionTitle.svelte'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import * as Form from '$lib/components/ui/form'
	import AgendaItemLabelForm from './AgendaItemLabelForm.svelte'

	let {data} = $props()
</script>

<main class="container flex grow flex-col gap-4">
	<PageTitle class="mb-6 text-3xl">
		{data.livestream.title}
	</PageTitle>

	<SectionTitle class="text-foreground">Agenda</SectionTitle>

	{#if data.livestream.agenda.length}
		<ul class="grid gap-2">
			{#each data.livestream.agenda as { isDone }, index (index)}
				<li class="flex justify-between gap-2">
					<form method="POST" use:enhance action="?/toggleAgendaItem">
						<input type="hidden" name="index" value={index} />

						<Checkbox
							id="checkbox-{index}"
							onclick={({currentTarget}) => {
								currentTarget.form?.requestSubmit()
							}}
							checked={isDone}
							aria-labelledby="label-{index}"
						/>
					</form>

					<AgendaItemLabelForm data={data.labelAgendaItemForms[index]} />

					<form method="POST" action="?/deleteAgendaItem" use:enhance>
						<input type="hidden" name="index" value={index} />
						<Form.Button variant="outline" size="icon">
							<span class="sr-only">delete agenda item {index + 1}</span>
							<Delete class="w-4" />
						</Form.Button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
	<form method="POST" action="?/createAgendaItem" use:enhance>
		<Form.Button><Plus class="mr-1 w-4" /> New item</Form.Button>
	</form>
</main>
