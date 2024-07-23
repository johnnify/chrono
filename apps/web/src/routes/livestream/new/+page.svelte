<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte'
	import CreateLivestreamForm from './CreateLivestreamForm.svelte'

	let {data} = $props()
</script>

<main class="container grow">
	<PageTitle class="mb-6 text-3xl">Create new Livestream</PageTitle>

	<CreateLivestreamForm data={data.form} />
</main>
