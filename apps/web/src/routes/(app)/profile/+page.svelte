<script lang="ts">
	import AlertIcon from '~icons/mdi/alert-outline'
	import * as Alert from '$lib/components/ui/alert'
	import {Button} from '$lib/components/ui/button'
	import PageTitle from '$lib/components/typography/PageTitle.svelte'
	import {Spinner} from '$lib/components/ui/spinner'
	import {getProfile} from './profile.remote'
	import Profile from './Profile.svelte'
</script>

<main class="container max-w-prose">
	<PageTitle class="mb-6">Profile</PageTitle>
	<p class="mb-6">Manage your account and update your details</p>

	<svelte:boundary>
		{#snippet pending()}
			<Spinner class="size-5" />
		{/snippet}

		{#snippet failed()}
			<PageTitle class="mb-8">Whoops!</PageTitle>
			<Alert.Root variant="destructive" class="mb-6">
				<AlertIcon class="size-5" />
				<Alert.Title>There was a problem getting your profile!</Alert.Title>
				<Alert.Description>Maybe login again?</Alert.Description>
			</Alert.Root>
			<Button href="/login">Login</Button>
		{/snippet}

		<Profile user={await getProfile()} />
	</svelte:boundary>
</main>
