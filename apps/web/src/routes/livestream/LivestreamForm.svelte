<script lang="ts">
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from 'sveltekit-superforms'
	import {toast} from 'svelte-sonner'
	import {zodClient} from 'sveltekit-superforms/adapters'
	import Spinner from '$lib/components/icons/Spinner.svelte'
	import * as Form from '$lib/components/ui/form'
	import {Input} from '$lib/components/ui/input'
	import {livestreamSchema, type LivestreamSchema} from './schema'
	import {Textarea} from '$lib/components/ui/textarea'
	import AiSuggestDescription from './AiSuggestDescription.svelte'

	type Props = {
		id?: string
		data: SuperValidated<Infer<LivestreamSchema>>
	}

	let {id, data}: Props = $props()

	const form = superForm(data, {
		validators: zodClient(livestreamSchema),
		resetForm: false,
		onUpdated({form}) {
			if (form.valid && form.message) {
				toast.success(form.message.text)
			}
		},
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

<form method="POST" use:enhance action="?/{id ? 'update' : 'create'}">
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
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<div class="grid gap-2">
				<Form.Label class="flex items-end gap-1">
					Description
					<Form.Description>
						(YouTube will do some magic with this, according to whether you are
						a partner!)
					</Form.Description>
				</Form.Label>
				{#if id}
					<AiSuggestDescription livestreamId={id} />
				{/if}
			</div>
			<Textarea
				{...attrs}
				{...$constraints.description}
				bind:value={$formData.description}
				placeholder="Don’t forget to like 💜 subscribe!"
				rows={10}
			/>
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-24" disabled={!isTainted($tainted)}>
		{#if $delayed}
			<Spinner class="text-white" />
		{:else}
			Save
		{/if}
	</Form.Button>
</form>
