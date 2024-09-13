<script lang="ts">
	import Sparkle from '$lib/components/icons/Sparkle.svelte'
	import Spinner from '$lib/components/icons/Spinner.svelte'
	import {Button} from '$lib/components/ui/button'
	import type {SuggestThumbnailsResponse} from '../api/suggest/thumbnails/+server'
	import Download from '$lib/components/icons/Download.svelte'

	type Props = {
		livestreamId: string
	}

	let {livestreamId}: Props = $props()
	let generationState = $state<'idle' | 'loading' | 'delayed' | Error>('idle')
	let generationDelayedTimeout = $state<number | null>(null)

	let thumbnailUrls: string[] = $state([])
	const handleClick = async () => {
		if (generationState === 'loading' || generationState === 'delayed') {
			return
		}

		thumbnailUrls = []
		generationState = 'loading'
		generationDelayedTimeout = setTimeout(() => {
			generationState = 'delayed'
		}, 500) as unknown as number

		const response = await fetch('/api/suggest/thumbnails', {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify({livestreamId}),
		})

		clearTimeout(generationDelayedTimeout)
		generationDelayedTimeout = null

		if (response.ok) {
			generationState = 'idle'
			thumbnailUrls = await (
				response.json() as Promise<SuggestThumbnailsResponse>
			).then((data) => data.thumbnailUrls)
		} else {
			generationState = new Error('Could not generate thumbnails!')
		}
	}

	$effect(() => {
		return () => {
			generationDelayedTimeout && clearTimeout(generationDelayedTimeout)
		}
	})
</script>

<div class="flex flex-col gap-4">
	{#if thumbnailUrls.length > 0}
		<div class="grid gap-4">
			{#each thumbnailUrls as thumbnailUrl, index}
				<div class="relative">
					<Button
						download="livestream thumbnail {index + 1}"
						href={thumbnailUrl}
						size="icon"
						variant="outline"
						class="absolute right-2 top-2"
					>
						<Download class="w-4" />
					</Button>
					<img
						src={thumbnailUrl}
						alt="Proposed thumbnail #{index + 1}"
						width={1792}
						height={1024}
						class="rounded-lg"
					/>
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex gap-2">
		<Button onclick={handleClick} variant="outline" size="sm">
			<Sparkle class="mr-1 w-4" />
			Suggest a thumbnail!
		</Button>
		{#if generationState === 'delayed'}
			<Spinner class="w-6" />
		{/if}
	</div>
</div>
