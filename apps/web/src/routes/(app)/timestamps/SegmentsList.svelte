<script lang="ts">
	import {toast} from 'svelte-sonner'
	import type {YouTubeSegment} from '$lib/parseCsvToSegments/parseCsvToSegments'
	import {Button} from '$lib/components/ui/button'
	import CopyIcon from '~icons/material-symbols/content-copy'
	import CheckIcon from '~icons/material-symbols/check'

	type Props = {
		segments: YouTubeSegment[]
		title: string
		class?: string
	}

	let {segments, title, class: className}: Props = $props()

	let justCopied = $state(false)

	const formatSegmentsForYouTube = (segments: YouTubeSegment[]): string =>
		segments
			.map((segment) => `${segment.timestamp} - ${segment.description}`)
			.join('\n')

	const copyToClipboard = async () => {
		const text = formatSegmentsForYouTube(segments)

		try {
			await navigator.clipboard.writeText(text)
			justCopied = true

			setTimeout(() => {
				justCopied = false
			}, 2000)
		} catch (err) {
			toast.error('Failed to copy to clipboard')
		}
	}

	let id = $derived(`${title.toLowerCase().replace(/\s+/g, '-')}-heading`)
</script>

<section class={className} aria-labelledby={id}>
	<div class="mb-4 flex items-center justify-between">
		<h2 {id} class="scroll-m-20 text-2xl font-semibold tracking-tight">
			{title}
		</h2>
		<Button
			variant="outline"
			size="sm"
			onclick={copyToClipboard}
			disabled={segments.length === 0}
		>
			{#if justCopied}
				<CheckIcon />
				Copied!
			{:else}
				<CopyIcon />
				Copy
			{/if}
		</Button>
	</div>

	{#if segments.length === 0}
		<p class="text-muted-foreground text-sm italic">No segments to display</p>
	{:else}
		<div class="bg-muted border-border rounded-lg border p-4">
			<ul class="space-y-1 font-mono text-sm">
				{#each segments as segment (segment.csvRowIndex)}
					<li class="flex gap-2">
						<span class="font-semibold">{segment.timestamp}</span>
						<span>-</span>
						<span class="flex-1">{segment.description}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>
