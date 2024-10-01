<script lang="ts">
	import Sparkle from '$lib/components/icons/Sparkle.svelte'
	import Spinner from '$lib/components/icons/Spinner.svelte'
	import {Button} from '$lib/components/ui/button'
	import type {SuggestionsResponseSchema} from '$lib/repos/aiResponse/schema'
	import {toast} from 'svelte-sonner'

	type Props = {
		livestreamId: string
	}

	let {livestreamId}: Props = $props()
	let suggestions: SuggestionsResponseSchema['suggestions'] = $state([])
	let completionState = $state<'idle' | 'loading' | 'delayed' | Error>('idle')
	let completionDelayedTimeout = $state<number | null>(null)

	const handleClick = async () => {
		if (completionState === 'loading' || completionState === 'delayed') {
			return
		}

		completionState = 'loading'
		completionDelayedTimeout = setTimeout(() => {
			completionState = 'delayed'
		}, 500) as unknown as number

		const response = await fetch('/api/suggest', {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify({livestreamId}),
		})

		clearTimeout(completionDelayedTimeout)
		completionDelayedTimeout = null

		if (response.ok) {
			completionState = 'idle'
			const json: SuggestionsResponseSchema = await response.json()
			suggestions = json.suggestions
		} else {
			completionState = new Error('Could not get your suggestions!')
		}
	}

	$effect(() => {
		return () => {
			if (completionDelayedTimeout) {
				clearTimeout(completionDelayedTimeout)
			}
		}
	})
</script>

{#snippet aiSuggestion(suggestion: string)}
	<li
		class="bg-card text-card-foreground max-w-prose rounded-xl border px-6 py-4 text-sm shadow"
	>
		<button
			type="button"
			class="block text-left"
			onclick={() => {
				navigator.clipboard.writeText(suggestion)
				toast('Suggestion copied to clipboard!')
			}}
		>
			{@html suggestion}
		</button>
	</li>
{/snippet}

<div>
	{#if completionState === 'idle' && suggestions.length}
		<ul class="mb-2 grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
			{#each suggestions as suggestion}
				{@render aiSuggestion(suggestion)}
			{/each}
		</ul>
	{/if}

	<div class="flex gap-2">
		<Button onclick={handleClick} type="button" variant="outline" size="sm">
			<Sparkle class="mr-1 w-4" />
			Suggest!
		</Button>
		{#if completionState === 'delayed'}
			<Spinner class="w-6" />
		{/if}
	</div>
</div>
