<script lang="ts">
	import type {Infer, SuperValidated} from 'sveltekit-superforms'
	import {enhance} from '$app/forms'
	import Plus from '$lib/components/icons/Plus.svelte'
	import SectionTitle from '$lib/components/SectionTitle.svelte'
	import * as Form from '$lib/components/ui/form'
	import type {AgendaItem} from '$lib/repos/livestreams/LivestreamsRepoInterface'
	import Agenda from './Agenda.svelte'
	import type {LabelAgendaItemSchema} from '../schema'

	type Props = {
		agenda: AgendaItem[]
		agendaItemForms: SuperValidated<Infer<LabelAgendaItemSchema>>[]
	}
	let {agenda, agendaItemForms}: Props = $props()
</script>

<section class="grid gap-6">
	<SectionTitle class="text-foreground">Agenda</SectionTitle>

	{#if agenda.length}
		<Agenda {agenda} {agendaItemForms} />
	{/if}

	<form method="POST" action="?/createAgendaItem" use:enhance>
		<Form.Button><Plus class="mr-1 w-4" /> New item</Form.Button>
	</form>
</section>
