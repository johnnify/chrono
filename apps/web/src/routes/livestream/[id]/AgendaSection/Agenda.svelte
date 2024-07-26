<script lang="ts">
	import type {Infer, SuperValidated} from 'sveltekit-superforms'
	import {enhance} from '$app/forms'
	import Delete from '$lib/components/icons/Delete.svelte'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import * as Form from '$lib/components/ui/form'
	import type {AgendaItem} from '$lib/repos/livestreams/LivestreamsRepoInterface'
	import AgendaItemLabelForm from './AgendaItemLabelForm.svelte'
	import type {LabelAgendaItemSchema} from '../schema'

	type Props = {
		agenda: AgendaItem[]
		agendaItemForms: SuperValidated<Infer<LabelAgendaItemSchema>>[]
	}
	let {agenda, agendaItemForms}: Props = $props()
</script>

<ul class="grid gap-2">
	{#each agenda as { isDone }, index (index)}
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

			<AgendaItemLabelForm data={agendaItemForms[index]} />

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
