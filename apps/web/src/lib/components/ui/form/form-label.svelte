<script lang="ts">
	import type {Snippet} from 'svelte'
	import type {Label as LabelPrimitive} from 'bits-ui'
	import {getFormControl} from 'formsnap'
	import {Label} from '$lib/components/ui/label'
	import {cn} from '$lib/utils'

	type Props = {children: Snippet} & LabelPrimitive.Props
	let {children, class: className = '', ...restProps}: Props = $props()

	const {labelAttrs} = getFormControl()
</script>

<Label
	{...$labelAttrs}
	class={cn('data-[fs-error]:text-destructive', className)}
	{...restProps}
>
	{@render children()}
</Label>
