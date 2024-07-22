<script lang="ts">
	import {toast} from 'svelte-sonner'
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from 'sveltekit-superforms'
	import {zodClient} from 'sveltekit-superforms/adapters'
	import Spinner from '$lib/components/icons/Spinner.svelte'
	import * as Form from '$lib/components/ui/form'
	import {Input} from '$lib/components/ui/input'
	import {formSchema, type FormSchema} from './schema'

	type Props = {
		data: SuperValidated<Infer<FormSchema>>
	}
	let {data}: Props = $props()

	const form = superForm(data, {
		validators: zodClient(formSchema),
		resetForm: false,
		onUpdated({form}) {
			if (form.valid && form.message) {
				toast.success(form.message.text)
			}
		},
	})

	const {form: formData, delayed, enhance, isTainted, tainted} = form
</script>

<form method="POST" use:enhance action="?/update">
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label class="flex items-end gap-1">
				What should we call you?
				<Form.Description>
					(for example, when we send you mail)
				</Form.Description>
			</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.name}
				placeholder="Elena Example"
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
