<script lang="ts">
	import AlertIcon from '~icons/mdi/alert-outline'

	import {page} from '$app/state'
	import {dev} from '$app/environment'
	import PageTitle from '$lib/components/typography/PageTitle.svelte'
	import * as Alert from '$lib/components/ui/alert'
	import FieldDescription from '$lib/components/ui/field/field-description.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import OAuthLoginForm from './OAuthLoginForm.svelte'
	import MockLoginForm from './MockLoginForm.svelte'

	let hasAuthError = $derived(page.url.searchParams.get('error') === 'auth')
</script>

<main class="container flex max-w-prose grow flex-col justify-center">
	<PageTitle class="mb-6">Login</PageTitle>

	{#if hasAuthError}
		<Alert.Root variant="destructive" class="mb-6">
			<AlertIcon class="size-5" />
			<Alert.Title>There was a problem login you in</Alert.Title>
			<Alert.Description>
				Please try again. If the problem persists, reach out!
			</Alert.Description>
		</Alert.Root>
	{/if}

	<section class="mb-8 flex flex-col gap-4">
		<p>Login or sign-up with your Google account:</p>

		<OAuthLoginForm />

		{#if dev}
			<MockLoginForm />
		{/if}
	</section>
	<FieldDescription class="text-center">
		By logging in, you agree to our <Button
			size="inline"
			variant="link"
			href="/terms">Terms of Service</Button
		>
		and
		<Button size="inline" variant="link" href="/privacy-policy"
			>Privacy Policy</Button
		>.
	</FieldDescription>
</main>
