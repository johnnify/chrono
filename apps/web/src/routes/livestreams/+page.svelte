<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte'

	let {data} = $props()
</script>

<main class="container">
	<PageTitle class="text-foreground mb-6">Livestreams</PageTitle>

	<ul>
		{#each data.livestreams as livestream}
			<li>
				<a href="/livestream/{livestream.id}" class="grid gap-4 sm:grid-cols-3">
					<img
						class="rounded"
						src={livestream.thumbnail}
						alt="Stream thumbnail"
					/>
					<h2
						class="font-fancy text-primary pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0 sm:col-span-2 sm:text-3xl"
					>
						{livestream.title}
					</h2>
				</a>
			</li>
		{/each}
	</ul>
</main>
