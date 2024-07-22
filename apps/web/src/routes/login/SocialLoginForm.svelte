<script lang="ts">
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from 'sveltekit-superforms'
	import {zodClient} from 'sveltekit-superforms/adapters'

	import Google from '$lib/components/icons/Google.svelte'
	import {Button} from '$lib/components/ui/button'
	import {socialLoginSchema, type SocialLoginSchema} from './schema'

	type Props = {
		data: SuperValidated<Infer<SocialLoginSchema>>
	}
	let {data}: Props = $props()

	const form = superForm(data, {
		validators: zodClient(socialLoginSchema),
	})

	const {enhance, delayed} = form
</script>

<form
	method="POST"
	class="flex flex-col gap-2 lg:gap-4"
	action="?/social"
	use:enhance
>
	<Button disabled={$delayed} name="provider" value="google" class="relative">
		<Google class="absolute left-8 w-5" />
		Login with Google
	</Button>
</form>
