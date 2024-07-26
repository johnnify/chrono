<script lang="ts">
	import {Button} from '$lib/components/ui/button'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import Plus from '$lib/components/icons/Plus.svelte'

	let {data} = $props()
</script>

<main class="container grid gap-6">
	<PageTitle class="text-foreground">Livestreams</PageTitle>

	{#if data.livestreams.length}
		<ul>
			{#each data.livestreams as livestream}
				<li>
					<a href="/livestream/{livestream.id}">
						<h2
							class="font-fancy text-primary pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0 sm:col-span-2 sm:text-3xl"
						>
							{livestream.title}
						</h2>
					</a>
				</li>
			{/each}
		</ul>
		<Button class="place-self-start" variant="outline" href="/livestream/new">
			<Plus class="mr-1 w-4" />
			Create new livestream
		</Button>
	{:else}
		<div class="mb-4 text-xl">You haven’t created any livestreams yet!</div>
		<Button href="/livestream/new">Create a livestream!</Button>
	{/if}
</main>
