<script lang="ts">
	import type {YouTubeSegment} from '$lib/parseCsvToSegments/parseCsvToSegments'
	import * as Field from '$lib/components/ui/field/index.js'
	import {Input} from '$lib/components/ui/input/index.js'
	import {Switch} from '$lib/components/ui/switch'
	import SectionTitle from '$lib/components/typography/SectionTitle.svelte'

	type Props = {
		segments: YouTubeSegment[]
	}

	let {segments = $bindable()}: Props = $props()
</script>

<SectionTitle>Edit Segments</SectionTitle>
<ul class="grid gap-2">
	{#each segments as segment (segment.csvRowIndex)}
		<li>
			<Field.Group>
				<div class="grid grid-cols-6 gap-4">
					<Field.Field class="flex-row items-center">
						<Field.Label class="sr-only" for="timestamp-{segment.csvRowIndex}"
							>Timestamp</Field.Label
						>
						<Input
							bind:value={segment.timestamp}
							id="timestamp-{segment.csvRowIndex}"
							type="text"
							placeholder="00:00:00"
						/>
					</Field.Field>
					<Field.Field class="col-span-4 flex-row items-center">
						<Field.Label class="sr-only" for="description-{segment.csvRowIndex}"
							>Description</Field.Label
						>
						<Input
							id="description-{segment.csvRowIndex}"
							type="text"
							placeholder="Get a load of this!"
							bind:value={segment.description}
						/>
					</Field.Field>

					<div class="flex items-center space-x-2">
						<Switch
							id="trimmed-{segment.csvRowIndex}"
							bind:checked={segment.trimmed}
						/>
						<Field.Label for="trimmed-{segment.csvRowIndex}"
							>Trimmed</Field.Label
						>
					</div>
				</div>
			</Field.Group>
		</li>
	{/each}
</ul>
