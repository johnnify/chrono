<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte'

	let {data} = $props()
</script>

<main class="container grow">
	<PageTitle class="mb-6 text-3xl">
		{data.livestream.title}
	</PageTitle>
	<img class="rounded" src={data.livestream.thumbnail} alt="Stream thumbnail" />

	<div>TODO: Implement agenda functionality here!</div>
</main>
