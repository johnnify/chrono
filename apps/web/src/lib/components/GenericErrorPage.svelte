<script lang="ts">
	import {page} from '$app/stores'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import {Button} from '$lib/components/ui/button'
	import ErrorImage from './error-detectives.webp?&enhanced'
</script>

<div class="mb-4 grid grid-cols-3 items-center gap-4 lg:mb-8">
	<PageTitle class="col-span-2">Something went wrong!</PageTitle>
	<enhanced:img
		src={ErrorImage}
		class="rounded-lg shadow"
		alt="Our best detective duo is on the trail!"
	></enhanced:img>
</div>

<section class="flex flex-col gap-4 text-xl">
	<p>Whoops! Apologies for the error.</p>
	<p>Our best detectives are on the job looking into it!</p>
	{#if $page.error?.message}
		<p class="italics">{$page.error?.message}</p>
	{/if}
	<Button
		class="self-start"
		onclick={() => {
			location.reload()
		}}
	>
		Try refreshing?
	</Button>
</section>
