<script lang="ts">
	import {cn} from '$lib/utils'
	import Button from '$lib/components/ui/button/button.svelte'
	import CsvIcon from '~icons/hugeicons/csv-01'

	import CloseIcon from '~icons/material-symbols/close'
	import DescriptionIcon from '~icons/material-symbols/description'

	type FileWithPreview = {
		file: File
		preview: string | null
		errors: string[]
	}

	type Props = {
		class?: string
		maxFiles?: number
		maxFileSize?: number
		accept?: string
		onFilesChange?: (files: File[]) => void
	}

	let {
		class: className,
		maxFiles = 5,
		maxFileSize = 10 * 1024 * 1024, // 10MB default
		accept,
		onFilesChange,
	}: Props = $props()

	let files = $state<FileWithPreview[]>([])
	let isDragActive = $state(false)
	let isDragReject = $state(false)
	let inputRef: HTMLInputElement | null = $state(null)

	const formatBytes = (
		bytes: number,
		decimals = 2,
		size?: 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB',
	) => {
		const k = 1000
		const dm = decimals < 0 ? 0 : decimals
		const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

		if (bytes === 0 || bytes === undefined)
			return size !== undefined ? `0 ${size}` : '0 bytes'
		const i =
			size !== undefined
				? sizes.indexOf(size)
				: Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
	}

	const validateFile = (file: File): string[] => {
		const errors: string[] = []

		if (file.size > maxFileSize) {
			errors.push(
				`File is larger than ${formatBytes(maxFileSize, 2)} (Size: ${formatBytes(file.size, 2)})`,
			)
		}

		if (accept) {
			const acceptedTypes = accept.split(',').map((type) => type.trim())
			const fileType = file.type
			const fileName = file.name
			const fileExtension = `.${fileName.split('.').pop()}`

			const isAccepted = acceptedTypes.some((acceptedType) => {
				if (acceptedType.startsWith('.')) {
					return fileExtension === acceptedType
				}
				if (acceptedType.endsWith('/*')) {
					return fileType.startsWith(acceptedType.replace('/*', ''))
				}
				return fileType === acceptedType
			})

			if (!isAccepted) {
				errors.push('File type not accepted')
			}
		}

		return errors
	}

	const createFileWithPreview = (file: File): FileWithPreview => {
		const errors = validateFile(file)
		let preview: string | null = null

		if (file.type.startsWith('image/')) {
			preview = URL.createObjectURL(file)
		}

		return {file, preview, errors}
	}

	const handleFiles = (fileList: FileList | null) => {
		if (!fileList) return

		const newFiles = Array.from(fileList).map(createFileWithPreview)
		files = [...files, ...newFiles]

		if (onFilesChange) {
			onFilesChange(files.map((f) => f.file))
		}
	}

	const handleRemoveFile = (index: number) => {
		const fileToRemove = files[index]
		if (fileToRemove?.preview) {
			URL.revokeObjectURL(fileToRemove.preview)
		}
		files = files.filter((_, i) => i !== index)

		if (!files.length && inputRef) {
			inputRef.value = ''
		}

		if (onFilesChange) {
			onFilesChange(files.map((f) => f.file))
		}
	}

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		isDragActive = true
	}

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		isDragActive = true

		// Check if dragged items are files
		if (e.dataTransfer) {
			const hasFiles = Array.from(e.dataTransfer.items).some(
				(item) => item.kind === 'file',
			)
			isDragReject = !hasFiles
		}
	}

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault()
		e.stopPropagation()

		// Only reset if we're leaving the dropzone entirely
		const target = e.currentTarget as HTMLElement
		const relatedTarget = e.relatedTarget as HTMLElement

		if (!target.contains(relatedTarget)) {
			isDragActive = false
			isDragReject = false
		}
	}

	const handleDrop = (e: DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		isDragActive = false
		isDragReject = false

		const droppedFiles = e.dataTransfer?.files ?? null
		handleFiles(droppedFiles)
	}

	const handleInputChange = (e: Event) => {
		const input = e.target as HTMLInputElement
		handleFiles(input.files)
	}

	const handleClick = () => {
		inputRef?.click()
	}

	const exceedMaxFiles = $derived(files.length > maxFiles)
	const hasErrors = $derived(
		files.some((f) => f.errors.length > 0) || exceedMaxFiles,
	)
	const isInvalid = $derived((isDragActive && isDragReject) || hasErrors)
</script>

<div
	class={cn(
		'bg-card text-card-foreground border-border rounded-lg border p-6 text-center',
		className,
		files.length > 0 ? 'border-solid' : 'border-2 border-dashed',
		isDragActive && 'border-primary bg-primary/10',
		isInvalid && 'border-destructive bg-destructive/10',
	)}
	ondragenter={handleDragEnter}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="region"
	aria-label="File upload drop zone"
>
	<input
		bind:this={inputRef}
		type="file"
		multiple={maxFiles !== 1}
		{accept}
		onchange={handleInputChange}
		class="hidden"
		aria-label="CSV file input"
	/>

	{#if files.length === 0}
		<!-- Empty State -->
		<div class="flex flex-col items-center gap-y-2 py-1">
			<CsvIcon class="text-muted-foreground size-5" />
			<p class="text-sm">
				Drop CSV {!!maxFiles && maxFiles > 1 ? ` ${maxFiles}` : ''} file{!maxFiles ||
				maxFiles > 1
					? 's'
					: ''}
			</p>
			<div class="flex flex-col items-center gap-y-1">
				<p class="text-muted-foreground text-xs">
					Drag and drop or <Button
						onclick={handleClick}
						variant="link"
						size="inline"
						type="button">select {maxFiles === 1 ? 'file' : 'files'}</Button
					> to process
				</p>
				{#if maxFileSize !== Number.POSITIVE_INFINITY}
					<p class="text-muted-foreground text-xs">
						Maximum file size: {formatBytes(maxFileSize, 0)}
					</p>
				{/if}
			</div>
		</div>
	{:else}
		<!-- File List -->
		<div class="flex flex-col">
			{#each files as fileWithPreview, idx (fileWithPreview.file.name + idx)}
				{@const {file, preview, errors: fileErrors} = fileWithPreview}
				<div
					class="border-border flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4"
				>
					{#if file.type.startsWith('image/') && preview}
						<div
							class="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border"
						>
							<img src={preview} alt={file.name} class="object-cover" />
						</div>
					{:else}
						<div
							class="bg-muted border-border flex h-10 w-10 items-center justify-center rounded border"
						>
							<DescriptionIcon />
						</div>
					{/if}

					<div class="flex shrink grow flex-col items-start truncate">
						<p title={file.name} class="max-w-full truncate text-sm">
							{file.name}
						</p>
						{#if fileErrors.length > 0}
							<p class="text-destructive text-xs">
								{fileErrors.join(', ')}
							</p>
						{:else}
							<p class="text-muted-foreground text-xs">
								{formatBytes(file.size, 2)}
							</p>
						{/if}
					</div>

					<Button
						size="icon"
						variant="link"
						class="text-muted-foreground hover:text-foreground shrink-0 justify-self-end"
						onclick={() => handleRemoveFile(idx)}
						type="button"
						aria-label="Remove file {file.name}"
					>
						<CloseIcon />
					</Button>
				</div>
			{/each}
			{#if exceedMaxFiles}
				<p class="text-destructive mt-2 text-left text-sm">
					You may attach only up to {maxFiles} files, please remove {files.length -
						maxFiles} file{files.length - maxFiles > 1 ? 's' : ''}.
				</p>
			{/if}
		</div>
	{/if}
</div>
