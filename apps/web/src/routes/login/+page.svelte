<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte'
	import Warning from '$lib/components/icons/Warning.svelte'
	import * as Alert from '$lib/components/ui/alert'

	import {page} from '$app/stores'
	import SocialLoginForm from './SocialLoginForm.svelte'

	let hasAuthError = $derived($page.url.searchParams.get('error') === 'auth')

	let {data} = $props()
</script>

<main class="container max-w-prose">
	<PageTitle class="mb-6">Login</PageTitle>

	{#if hasAuthError}
		<Alert.Root variant="destructive" class="mb-6">
			<Warning class="h-5 w-5" />
			<Alert.Title>There was a problem login you in</Alert.Title>
			<Alert.Description>
				Please try again, maybe with a different method?
			</Alert.Description>
		</Alert.Root>
	{/if}

	<section class="mb-8 flex flex-col gap-4">
		<p class="max-w-prose">Sign-up or login, all with the same button:</p>

		<SocialLoginForm data={data.socialLoginForm} />
	</section>
</main>
