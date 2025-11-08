<script lang="ts">
	import {fade, fly} from 'svelte/transition'
	import {toast} from 'svelte-sonner'
	import PageTitle from '$lib/components/typography/PageTitle.svelte'
	import Dropzone from '$lib/components/Dropzone.svelte'
	import {
		parseCsvToSegments,
		cutTrimmedSegments,
		type YouTubeSegment,
	} from '$lib/parseCsvToSegments/parseCsvToSegments'
	import {decodeFile} from '$lib/parseCsvToSegments/decodeFile'
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
			const [file] = newFiles
			rawSegments = await parseCsvToSegments(file)
		} catch (error) {
			toast.error('Failed to parse your file... Check it & try again?')
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
		<div in:fly={{duration: 300, y: 100}} out:fade={{duration: 100}}>
			<div class="mb-6 grid gap-6 md:grid-cols-2">
				<SegmentsList segments={rawSegments} title="All Segments" />
				<SegmentsList segments={trimmedSegments} title="Post-trim Segments" />
			</div>

			<RawSegmentsForm bind:segments={rawSegments} />
		</div>
	{/if}
</main>
