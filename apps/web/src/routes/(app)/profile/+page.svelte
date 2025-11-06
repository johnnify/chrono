<script lang="ts">
	import LogoutIcon from '~icons/material-symbols-light/logout'
	import {Button} from '$lib/components/ui/button'
	import PageTitle from '$lib/components/typography/PageTitle.svelte'
	import SectionTitle from '$lib/components/typography/SectionTitle.svelte'
	import * as Avatar from '$lib/components/ui/avatar'
	import {logout} from '$lib/auth.remote'

	import DetailsForm from './DetailsForm.svelte'

	let {data} = $props()

	const getInitials = (name?: string | null): string => {
		if (!name) return '?'

		const nameParts = name.trim().split(/\s+/)
		if (nameParts.length === 1) {
			return nameParts[0][0]?.toUpperCase() || '?'
		}

		return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
	}
</script>

<main class="container max-w-prose">
	<PageTitle class="mb-6">Profile</PageTitle>
	<p class="mb-6">Manage your account and update your details</p>

	<section class="mb-8 flex flex-col gap-4">
		<SectionTitle>Public Details</SectionTitle>

		<Avatar.Root>
			<Avatar.Image src={data.user.avatarUrl} alt="your public avatar" />
			<Avatar.Fallback>{getInitials(data.user.name)}</Avatar.Fallback>
		</Avatar.Root>

		<DetailsForm />
	</section>

	<section class="mb-8 flex flex-col gap-4">
		<SectionTitle>Session Management</SectionTitle>
		<p>You are logged in as <strong>{data.user.email}</strong></p>

		<form {...logout}>
			<Button variant="outline" disabled={!!logout.pending}>
				<LogoutIcon />
				Sign out
			</Button>
		</form>
	</section>
</main>
