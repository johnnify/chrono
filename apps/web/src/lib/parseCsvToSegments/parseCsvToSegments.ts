export type YouTubeSegment = {
	timestamp: string
	description: string
	trimmed: boolean
	csvRowIndex: number
}

type CsvColumnIndices = {
	markerName: number
	description: number
	timestamp: number
}

type CsvRow = {
	markerName: string
	description: string
	timestamp: string
}

// Constants
const INTRO_SEGMENT: YouTubeSegment = {
	timestamp: '00:00:00',
	description: 'Intro',
	trimmed: false,
	csvRowIndex: 0,
}

const MIN_MARKER_NAME_LENGTH = 2

const AD_REGEX = /(?:^|\s)ad(?!\s*end)(?:\s|$)/i

const isAdSegment = (text: string): boolean => AD_REGEX.test(text)

// Convert timestamp string (HH:MM:SS) to total seconds
const timestampToSeconds = (timestamp: string): number => {
	const parts = timestamp.split(':')
	const hours = Number.parseInt(parts[0] || '0', 10)
	const minutes = Number.parseInt(parts[1] || '0', 10)
	const seconds = Number.parseInt(parts[2] || '0', 10)
	return hours * 3600 + minutes * 60 + seconds
}

// Convert seconds back to timestamp string (HH:MM:SS)
const secondsToTimestamp = (totalSeconds: number): string => {
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = Math.floor(totalSeconds % 60)

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Parse timestamp from editing software format (HH:MM:SS:FF) to YouTube format (HH:MM:SS)
const convertTimestampToYouTubeFormat = (timestamp: string): string => {
	const parts = timestamp.split(':')
	const hours = Number.parseInt(parts[0] || '0', 10)
	const minutes = Number.parseInt(parts[1] || '0', 10)
	const seconds = Number.parseInt(parts[2] || '0', 10)

	const paddedHours = hours.toString().padStart(2, '0')
	const paddedMinutes = minutes.toString().padStart(2, '0')
	const paddedSeconds = seconds.toString().padStart(2, '0')

	// Always format as HH:MM:SS
	return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
}

const parseHeaderIndices = (headerLine: string): CsvColumnIndices => {
	const columns = headerLine.split('\t')

	return {
		markerName: columns.findIndex((col) =>
			col.toLowerCase().includes('marker name'),
		),
		description: columns.findIndex((col) =>
			col.toLowerCase().includes('description'),
		),
		timestamp: columns.findIndex((col) => col.toLowerCase().trim() === 'in'),
	}
}

const extractRowData = (
	line: string,
	indices: CsvColumnIndices,
): CsvRow | null => {
	const columns = line.split('\t')

	const markerName = columns[indices.markerName]?.trim() || ''
	let description = columns[indices.description]?.trim() || ''
	const timestamp = columns[indices.timestamp]?.trim() || ''

	// Clean up newlines and carriage returns
	description = description.replace(/[\r\n]+/g, ' ').trim()

	return {
		markerName,
		description,
		timestamp,
	}
}

// Validate if a row has required data
const isValidRow = (row: CsvRow): boolean => {
	const {markerName, timestamp} = row

	return (
		markerName.length >= MIN_MARKER_NAME_LENGTH &&
		timestamp.length > 0 &&
		/[a-zA-Z]/.test(markerName)
	)
}

// Merge multi-line CSV fields (handles quoted fields with newlines)
const mergeMultiLineFields = (lines: string[], startIndex: number): string => {
	let mergedLine = lines[startIndex] || ''
	let currentIndex = startIndex

	// Check if next lines are continuations of a quoted field
	while (currentIndex + 1 < lines.length) {
		const nextLine = lines[currentIndex + 1] || ''
		if (nextLine.match(/^"\t/)) {
			currentIndex++
			mergedLine = mergedLine + '\n' + nextLine
		} else {
			break
		}
	}

	return mergedLine
}

const createYouTubeSegment = (
	row: CsvRow,
	csvRowIndex: number,
): YouTubeSegment => {
	const {markerName, description, timestamp} = row

	const fullDescription = description
		? `${markerName} - ${description}`
		: markerName

	const youtubeTimestamp = convertTimestampToYouTubeFormat(timestamp)
	const isTrimmed = isAdSegment(fullDescription)

	return {
		timestamp: youtubeTimestamp,
		description: fullDescription,
		trimmed: isTrimmed,
		csvRowIndex,
	}
}

// Create segments with adjusted timestamps after trimming
export const cutTrimmedSegments = (
	rawSegments: YouTubeSegment[],
): YouTubeSegment[] => {
	const trimmed: YouTubeSegment[] = []
	let cumulativeAdjustment = 0

	for (let i = 0; i < rawSegments.length; i++) {
		const segment = rawSegments[i]!

		if (segment.trimmed) {
			// Calculate duration of this trimmed segment
			const currentSeconds = timestampToSeconds(segment.timestamp)
			const nextSegment = rawSegments[i + 1]
			if (nextSegment) {
				const nextSeconds = timestampToSeconds(nextSegment.timestamp)
				const duration = nextSeconds - currentSeconds
				cumulativeAdjustment += duration
			}
			// Skip this segment - don't add it to trimmed array
		} else {
			// Include this segment with adjusted timestamp
			const originalSeconds = timestampToSeconds(segment.timestamp)
			const adjustedSeconds = originalSeconds - cumulativeAdjustment
			const adjustedTimestamp = secondsToTimestamp(adjustedSeconds)

			trimmed.push({
				...segment,
				timestamp: adjustedTimestamp,
			})
		}
	}

	return trimmed
}

export const parseCsvToSegments = (csvContent: string): YouTubeSegment[] => {
	const segments: YouTubeSegment[] = []

	// Always start with the intro segment
	segments.push(INTRO_SEGMENT)

	const lines = csvContent.split('\n')
	if (lines.length === 0) {
		return segments
	}

	// Parse header to find column positions
	const indices = parseHeaderIndices(lines[0] || '')

	// Parse data rows with multi-line field support
	let i = 1
	let csvRowIndex = 1
	while (i < lines.length) {
		const line = lines[i]

		// Skip empty lines
		if (!line?.trim()) {
			i++
			continue
		}

		// Handle multi-line quoted fields
		const mergedLine = mergeMultiLineFields(lines, i)

		// Extract row data
		const rowData = extractRowData(mergedLine, indices)
		if (!rowData || !isValidRow(rowData)) {
			i++
			csvRowIndex++
			continue
		}

		// Create and store segment
		const segment = createYouTubeSegment(rowData, csvRowIndex)
		segments.push(segment)

		// Skip any lines that were merged
		const linesMerged = (mergedLine.match(/\n/g) || []).length
		i += linesMerged + 1
		csvRowIndex++
	}

	return segments
}
