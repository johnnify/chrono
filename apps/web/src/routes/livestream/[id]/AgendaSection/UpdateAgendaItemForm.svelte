<script lang="ts">
	import {
		superForm,
		type Infer,
		type SuperValidated,
	} from 'sveltekit-superforms'
	import {zodClient} from 'sveltekit-superforms/adapters'
	import {Input} from '$lib/components/ui/input'
	import {updateAgendaItemSchema, type UpdateAgendaItemSchema} from '../schema'
	import {Checkbox} from '$lib/components/ui/checkbox'

	type Props = {
		data: SuperValidated<Infer<UpdateAgendaItemSchema>>
	}
	let {data}: Props = $props()

	const form = superForm(data, {
		id: data.id,
		validators: zodClient(updateAgendaItemSchema),
		resetForm: false,
	})

	const {form: formData, constraints, enhance, submit} = form
	let timeout: number | null = $state(null)

	// keepfocus only works with GET forms (and links)
	// https://kit.svelte.dev/docs/link-options#data-sveltekit-keepfocus
	let isBeingEdited = $state(false)

	$effect(() => {
		return () => {
			timeout && clearTimeout(timeout)
		}
	})
</script>

<form
	method="POST"
	action="?/updateAgendaItem"
	use:enhance
	data-sveltekit-keepfocus
	data-sveltekit-noscroll
	class="flex grow gap-2"
>
	<input type="hidden" name="id" bind:value={$formData.id} />
	<input type="hidden" name="status" bind:value={$formData.status} />
	<Checkbox
		onCheckedChange={(isChecked) => {
			$formData.status = isChecked ? 'done' : 'pending'

			timeout && clearTimeout(timeout)

			// Little buffer against a twitchy toggle
			timeout = setTimeout(() => {
				submit()
			}, 300) as unknown as number
		}}
		checked={$formData.status === 'done'}
		aria-labelledby="label-{$formData.id}"
	/>

	<Input
		{...$constraints.label}
		id="label-{data.id}"
		name="label"
		bind:value={$formData.label}
		placeholder="Something exciting 🎉"
		onfocusin={() => {
			isBeingEdited = true
		}}
		onfocusout={() => {
			isBeingEdited = false
		}}
		autofocus={isBeingEdited ? true : undefined}
		oninput={() => {
			timeout && clearTimeout(timeout)

			timeout = setTimeout(() => {
				submit()
			}, 2_000) as unknown as number
		}}
	/>
</form>
