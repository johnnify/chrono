<script lang="ts">
	import {page} from '$app/stores'
	import {Button} from '$lib/components/ui/button'

	type Props = {
		currentPage: number
		perPage: number
		totalCount: number
	}

	let {perPage, totalCount, currentPage}: Props = $props()

	let hasPrev = $derived(currentPage > 1)
	let hasNext = $derived(currentPage < Math.ceil(totalCount / perPage))
	let nextPageHref = $derived.by(() => {
		const url = new URL($page.url)
		url.searchParams.set('page', `${currentPage + 1}`)

		return url.toString()
	})
	let prevPageHref = $derived.by(() => {
		const url = new URL($page.url)
		url.searchParams.set('page', `${currentPage - 1}`)

		return url.toString()
	})
</script>

<nav class="flex items-center gap-2 place-self-end" aria-label="pagination">
	<div>
		showing <strong
			>{perPage * currentPage - perPage + 1} - {perPage * currentPage}</strong
		>
		out of
		<strong>{totalCount}</strong>
	</div>

	{#if hasPrev}
		<Button href={prevPageHref} size="sm" variant="outline">Previous</Button>
	{/if}

	{#if hasNext}
		<Button href={nextPageHref} size="sm" variant="outline">Next</Button>
	{/if}
</nav>
