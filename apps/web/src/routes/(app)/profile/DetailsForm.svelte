<script lang="ts">
	import {toast} from 'svelte-sonner'

	import {Input} from '$lib/components/ui/input'
	import * as Field from '$lib/components/ui/field'
	import {Button} from '$lib/components/ui/button'
	import {Spinner} from '$lib/components/ui/spinner'
	import type {User} from '$lib/repos/users/UsersRepoInterface'
	import {updateProfile} from './profile.remote'

	type Props = {
		user: User
	}

	let {user}: Props = $props()

	let hasChanges = $derived(updateProfile.fields.name.value() !== user.name)

	updateProfile.fields.name.set(user.name)
</script>

<form
	{...updateProfile.enhance(async ({submit, data}) => {
		try {
			await submit()
			toast.success(
				`Public details updated${data.name ? `, ${data.name}` : ''}!`,
			)
		} catch (e) {
			toast.error('Failed to update profile details. Please try again.')
		}
	})}
>
	<div class="mb-4">
		<Field.Field>
			<div class="flex flex-wrap gap-2">
				<Field.Label for="name">What should we call you?</Field.Label>
				<Field.Description>
					(for example, when we send you mail)
				</Field.Description>
			</div>
			<Input
				{...updateProfile.fields.name.as('text')}
				id="name"
				placeholder="Elena Example"
			/>
		</Field.Field>

		{#each updateProfile.fields.name.issues() as issue (issue.message)}
			<p class="text-destructive mt-1 text-sm">{issue.message}</p>
		{/each}
	</div>
	<Button disabled={!hasChanges || !!updateProfile.pending} class="w-22">
		{#if updateProfile.pending}
			<Spinner class="text-white" />
		{:else}
			Submit
		{/if}
	</Button>
</form>
