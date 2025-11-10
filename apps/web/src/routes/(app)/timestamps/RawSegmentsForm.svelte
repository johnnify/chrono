<script lang="ts">
	import type {YouTubeSegment} from '$lib/parseCsvToSegments/parseCsvToSegments'
	import * as Field from '$lib/components/ui/field/index.js'
	import {Input} from '$lib/components/ui/input/index.js'
	import {Switch} from '$lib/components/ui/switch'
	import SectionTitle from '$lib/components/typography/SectionTitle.svelte'
	import {alertVariants} from '$lib/components/ui/alert'
	import {cn} from '$lib/utils'

	type Props = {
		segments: YouTubeSegment[]
	}

	let {segments = $bindable()}: Props = $props()

	const id = 'edit-segments-heading'
</script>

<section aria-labelledby={id}>
	<SectionTitle {id} class="mb-6">Edit Segments</SectionTitle>
	<ul class="grid gap-2">
		{#each segments as segment (segment.csvRowIndex)}
			<li class={cn(alertVariants(), 'flex')}>
				<Field.Group>
					<div class="grid grid-cols-6 gap-4">
						<Field.Field
							class="col-span-3 flex-row items-center font-mono md:col-span-1"
						>
							<Field.Label class="sr-only" for="timestamp-{segment.csvRowIndex}"
								>Timestamp</Field.Label
							>
							<!-- TODO: This could help transform input into HH:MM:SS -->
							<Input
								bind:value={segment.timestamp}
								id="timestamp-{segment.csvRowIndex}"
								type="text"
								placeholder="00:00:00"
							/>
						</Field.Field>

						<div
							class="order-2 col-span-3 flex items-center space-x-2 md:order-3 md:col-span-1"
						>
							<Switch
								id="trimmed-{segment.csvRowIndex}"
								bind:checked={segment.trimmed}
							/>
							<Field.Label for="trimmed-{segment.csvRowIndex}"
								>Trimmed</Field.Label
							>
						</div>

						<Field.Field
							class="order-3 col-span-6 flex-row items-center md:order-2 md:col-span-4"
						>
							<Field.Label
								class="sr-only"
								for="description-{segment.csvRowIndex}">Description</Field.Label
							>
							<Input
								id="description-{segment.csvRowIndex}"
								type="text"
								placeholder="Get a load of this!"
								bind:value={segment.description}
							/>
						</Field.Field>
					</div>
				</Field.Group>
			</li>
		{/each}
	</ul>
</section>
