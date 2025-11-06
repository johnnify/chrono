<script lang="ts">
	import PageTitle from '$lib/components/typography/PageTitle.svelte'
	import Lead from '$lib/components/typography/Lead.svelte'
</script>

<main class="flex flex-col gap-6 px-(--padding-inline)">
	<PageTitle>Admin Dashboard</PageTitle>

	<Lead>Review user activity in the app</Lead>

	<div>TODO: Show some user stats!</div>
</main>

<style>
	main {
		view-transition-name: admin-dashboard;
	}
</style>
