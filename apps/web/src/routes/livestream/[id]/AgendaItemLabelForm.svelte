<script lang="ts">
	import {
		superForm,
		type Infer,
		type SuperValidated,
	} from 'sveltekit-superforms'
	import {zodClient} from 'sveltekit-superforms/adapters'
	import {labelAgendaItemSchema, type LabelAgendaItemSchema} from './schema'
	import {Input} from '$lib/components/ui/input'

	type Props = {
		data: SuperValidated<Infer<LabelAgendaItemSchema>>
	}
	let {data}: Props = $props()

	const form = superForm(data, {
		validators: zodClient(labelAgendaItemSchema),
		resetForm: false,
	})

	const {form: formData, constraints, enhance} = form
	let timeout: number | null = $state(null)

	$effect(() => {
		return () => {
			timeout && clearTimeout(timeout)
		}
	})
</script>

<form
	method="POST"
	action="?/labelAgendaItem"
	use:enhance
	data-sveltekit-keepfocus
	data-sveltekit-noscroll
	class="grow"
>
	<input type="hidden" name="index" value={$formData.index} />
	<Input
		{...$constraints.label}
		id="label-{$formData.index}"
		name="label"
		bind:value={$formData.label}
		placeholder="Something exciting 🎉"
		oninput={({currentTarget}) => {
			timeout && clearTimeout(timeout)
			const form = currentTarget.form
			if (form) {
				timeout = setTimeout(() => {
					form.requestSubmit()
				}, 2_000) as unknown as number
			}
		}}
	/>
</form>
