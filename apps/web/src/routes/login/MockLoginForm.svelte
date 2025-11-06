<script lang="ts">
	import DevLogin from '~icons/fluent/window-dev-tools-16-regular'

	import {mockLogin} from '$lib/auth.remote'
	import {Button} from '$lib/components/ui/button'
</script>

<form {...mockLogin} class="flex flex-col gap-2 lg:gap-4">
	<Button disabled={!!mockLogin.pending} class="relative">
		<DevLogin class="absolute left-8 w-5" />
		Login with MOCK (dev-only!)
	</Button>
</form>
