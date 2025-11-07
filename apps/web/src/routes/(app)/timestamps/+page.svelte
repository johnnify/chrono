<script lang="ts">
	import PageTitle from '$lib/components/typography/PageTitle.svelte'
	import Dropzone from '$lib/components/Dropzone.svelte'
	import {
		parseCsvToSegments,
		cutTrimmedSegments,
		type YouTubeSegment,
	} from '$lib/parseCsvToSegments/parseCsvToSegments'
	import {Spinner} from '$lib/components/ui/spinner'
	import SegmentsList from './SegmentsList.svelte'
	import RawSegmentsForm from './RawSegmentsForm.svelte'

	let isProcessing = $state(false)

	let rawSegments = $state<YouTubeSegment[] | null>(null)
	let trimmedSegments = $derived(
		rawSegments ? cutTrimmedSegments(rawSegments) : null,
	)

	const handleFilesChange = async (newFiles: File[]) => {
		if (!newFiles.length) {
			rawSegments = null
			return
		}
		isProcessing = true

		try {
			const file = newFiles[0]
			const fileText = await file.text()
			rawSegments = parseCsvToSegments(fileText)
		} catch (error) {
			console.error('Error parsing CSV:', error)
		} finally {
			isProcessing = false
		}
	}
</script>

<main class="container flex flex-col gap-6">
	<PageTitle>CSV to Timestamps</PageTitle>

	<Dropzone
		maxFiles={1}
		accept=".csv"
		maxFileSize={Number.POSITIVE_INFINITY}
		onFilesChange={handleFilesChange}
	/>

	{#if isProcessing}
		<Spinner class="size-5" />
	{:else if rawSegments && trimmedSegments}
		<div class="grid gap-6 md:grid-cols-2">
			<SegmentsList segments={rawSegments} title="All Segments" />
			<SegmentsList segments={trimmedSegments} title="Post-trim Segments" />
		</div>

		<RawSegmentsForm bind:segments={rawSegments} />
	{/if}
</main>
