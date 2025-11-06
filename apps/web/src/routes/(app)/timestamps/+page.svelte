<script lang="ts">
	import PageTitle from '$lib/components/typography/PageTitle.svelte'
	import Dropzone from '$lib/components/Dropzone.svelte'
	import SegmentsList from '$lib/components/SegmentsList.svelte'
	import {
		parseCsvToSegments,
		type YouTubeSegment,
	} from '$lib/parseCsvToSegments/parseCsvToSegments'

	let files = $state<File[]>([])
	let allSegments = $state<YouTubeSegment[]>([])
	let untrimmedSegments = $state<YouTubeSegment[]>([])
	let isProcessing = $state(false)

	const handleFilesChange = async (newFiles: File[]) => {
		files = newFiles

		if (newFiles.length === 0) {
			allSegments = []
			untrimmedSegments = []
			return
		}

		isProcessing = true

		try {
			const file = newFiles[0]
			const text = await file.text()
			const {raw, trimmed} = parseCsvToSegments(text)

			// Convert Maps to arrays
			allSegments = Array.from(raw.values())
			untrimmedSegments = Array.from(trimmed.values())
		} catch (error) {
			console.error('Error parsing CSV:', error)
			allSegments = []
			untrimmedSegments = []
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
		<div class="text-center">
			<p class="text-muted-foreground">Processing CSV file...</p>
		</div>
	{:else if files.length > 0 && allSegments.length > 0}
		<div class="grid gap-6 md:grid-cols-2">
			<SegmentsList segments={allSegments} title="All Segments" />
			<SegmentsList segments={untrimmedSegments} title="Post-trim Segments" />
		</div>
	{/if}
</main>
