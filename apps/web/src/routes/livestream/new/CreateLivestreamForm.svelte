<script lang="ts">
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from 'sveltekit-superforms'
	import {zodClient} from 'sveltekit-superforms/adapters'
	import Spinner from '$lib/components/icons/Spinner.svelte'
	import * as Form from '$lib/components/ui/form'
	import {Input} from '$lib/components/ui/input'
	import {livestreamSchema, type LivestreamSchema} from './schema'

	type Props = {
		data: SuperValidated<Infer<LivestreamSchema>>
	}
	let {data}: Props = $props()

	const form = superForm(data, {
		validators: zodClient(livestreamSchema),
	})

	const {
		form: formData,
		constraints,
		delayed,
		enhance,
		isTainted,
		tainted,
	} = form
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label class="flex items-end gap-1">
				Title
				<Form.Description>(how it’ll be called on YouTube!)</Form.Description>
			</Form.Label>
			<Input
				{...attrs}
				{...$constraints.title}
				bind:value={$formData.title}
				placeholder="React vs Svelte FITE 😤"
			/>
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-24" disabled={!isTainted($tainted)}>
		{#if $delayed}
			<Spinner class="text-white" />
		{:else}
			Submit
		{/if}
	</Form.Button>
</form>
