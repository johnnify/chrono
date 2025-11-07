<script lang="ts">
	import type {User} from '$lib/repos/users/UsersRepoInterface'

	const getInitials = (name?: string | null): string => {
		if (!name) return '?'

		const nameParts = name.trim().split(/\s+/)
		if (nameParts.length === 1) {
			return nameParts[0][0]?.toUpperCase() || '?'
		}

		return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
	}

	type Props = {
		user: User
	}

	let {user}: Props = $props()

	let initials = $derived(getInitials(user.name))
</script>

<span
	class="bg-card outline-border inline-flex size-10 items-center justify-center rounded-full outline outline-offset-1"
>
	{#if user.avatarUrl}
		<img
			class="aspect-square size-full rounded-full"
			src={user.avatarUrl}
			alt="your public avatar"
			referrerpolicy="no-referrer"
		/>
	{:else}
		{initials}
	{/if}
</span>
