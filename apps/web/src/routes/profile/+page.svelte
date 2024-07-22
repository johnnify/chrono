<script lang="ts">
	import {enhance} from '$app/forms'
	import {page} from '$app/stores'
	import {Button} from '$lib/components/ui/button'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import SectionTitle from '$lib/components/SectionTitle.svelte'
	import * as Avatar from '$lib/components/ui/avatar'
	import DetailsForm from './DetailsForm.svelte'

	let {data} = $props()
</script>

<main class="container max-w-prose">
	<PageTitle class="mb-6">Profile</PageTitle>
	<p class="mb-6">Manage your account and update your details</p>

	<section class="mb-8 flex flex-col gap-4">
		<SectionTitle>Public Details</SectionTitle>

		<Avatar.Root>
			<Avatar.Image src={$page.data.user?.avatarUrl} alt="your public avatar" />
			<Avatar.Fallback
				>{$page.data.user?.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback
			>
		</Avatar.Root>

		<DetailsForm data={data.form} />
	</section>

	<section class="mb-8 flex flex-col gap-4">
		<SectionTitle>Session Management</SectionTitle>
		<p>You are logged in as <strong>{$page.data.user?.email}</strong></p>

		<form method="POST" use:enhance action="?/logout">
			<Button variant="outline">Sign out</Button>
		</form>
	</section>
</main>
