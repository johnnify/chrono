<script lang="ts">
	import type {Infer, SuperValidated} from 'sveltekit-superforms'
	import {enhance} from '$app/forms'
	import Delete from '$lib/components/icons/Delete.svelte'
	import * as Form from '$lib/components/ui/form'
	import type {AgendaItem} from '$lib/repos/livestreams/LivestreamsRepoInterface'
	import UpdateAgendaItemForm from './UpdateAgendaItemForm.svelte'
	import type {UpdateAgendaItemSchema} from '../schema'

	type Props = {
		agenda: AgendaItem[]
		agendaItemForms: SuperValidated<Infer<UpdateAgendaItemSchema>>[]
	}
	let {agenda, agendaItemForms}: Props = $props()
</script>

<ul class="grid gap-2">
	{#each agenda as { id }, index (id)}
		<li class="flex gap-2">
			<UpdateAgendaItemForm data={agendaItemForms[index]} />

			<form method="POST" action="?/deleteAgendaItem" use:enhance>
				<input type="hidden" name="id" value={id} />
				<Form.Button variant="outline" size="icon">
					<span class="sr-only">delete agenda item {index + 1}</span>
					<Delete class="w-4" />
				</Form.Button>
			</form>
		</li>
	{/each}
</ul>
