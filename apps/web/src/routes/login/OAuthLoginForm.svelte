<script lang="ts">
	import GoogleIcon from '~icons/mdi/google'

	import {oAuthLogin} from '$lib/auth.remote'
	import {Button} from '$lib/components/ui/button'

	type Props = {
		disabled?: boolean
	}
	let {disabled}: Props = $props()

	let {name, value} = $derived(
		oAuthLogin.fields.provider.as('hidden', 'google'),
	)
</script>

<form {...oAuthLogin} class="flex flex-col gap-2 lg:gap-4">
	<Button
		disabled={disabled || !!oAuthLogin.pending}
		class="relative"
		{name}
		{value}
	>
		<GoogleIcon class="absolute left-8 w-5" />
		Login with Google
	</Button>
</form>
