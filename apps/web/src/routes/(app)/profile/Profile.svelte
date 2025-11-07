<script lang="ts">
	import LogoutIcon from '~icons/material-symbols-light/logout'
	import type {User} from '$lib/repos/users/UsersRepoInterface'
	import {Button} from '$lib/components/ui/button'
	import SectionTitle from '$lib/components/typography/SectionTitle.svelte'
	import UserAvatar from '$lib/components/UserAvatar.svelte'
	import {logout} from '$lib/auth.remote'
	import DetailsForm from './DetailsForm.svelte'

	type Props = {
		user: User
	}

	let {user}: Props = $props()
</script>

<section class="mb-8 flex flex-col gap-4">
	<SectionTitle>Public Details</SectionTitle>

	<UserAvatar {user} />

	<DetailsForm {user} />
</section>

<section class="mb-8 flex flex-col gap-4">
	<SectionTitle>Session Management</SectionTitle>
	<p>You are logged in as <strong>{user.email}</strong></p>

	<form {...logout.for('profile')}>
		<Button variant="outline" disabled={!!logout.pending}>
			<LogoutIcon />
			Sign out
		</Button>
	</form>
</section>
