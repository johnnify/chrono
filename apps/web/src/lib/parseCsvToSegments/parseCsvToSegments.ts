export type YouTubeSegment = {
	timestamp: string
	description: string
	trimmed: boolean
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
const INTRO_SEGMENT = {
	timestamp: '00:00:00',
	description: 'Intro',
	trimmed: false,
} as const

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

const createYouTubeSegment = (row: CsvRow): YouTubeSegment => {
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
	}
}

type ParseResult = {
	raw: Map<string, YouTubeSegment>
	trimmed: Map<string, YouTubeSegment>
}

// Create trimmed map with adjusted timestamps
const createTrimmedMap = (
	rawSegments: Map<string, YouTubeSegment>,
): Map<string, YouTubeSegment> => {
	const trimmed = new Map<string, YouTubeSegment>()
	const segmentArray = Array.from(rawSegments.entries())

	let cumulativeAdjustment = 0

	for (let i = 0; i < segmentArray.length; i++) {
		const [key, segment] = segmentArray[i]!

		if (segment.trimmed) {
			// Calculate duration of this trimmed segment
			const currentSeconds = timestampToSeconds(segment.timestamp)
			const nextSegment = segmentArray[i + 1]
			if (nextSegment) {
				const nextSeconds = timestampToSeconds(nextSegment[1].timestamp)
				const duration = nextSeconds - currentSeconds
				cumulativeAdjustment += duration
			}
			// Skip this segment - don't add it to trimmed map
		} else {
			// Include this segment with adjusted timestamp
			const originalSeconds = timestampToSeconds(segment.timestamp)
			const adjustedSeconds = originalSeconds - cumulativeAdjustment
			const adjustedTimestamp = secondsToTimestamp(adjustedSeconds)

			trimmed.set(key, {
				...segment,
				timestamp: adjustedTimestamp,
			})
		}
	}

	return trimmed
}

export const parseCsvToSegments = (csvContent: string): ParseResult => {
	const segments = new Map<string, YouTubeSegment>()

	// Always start with the intro segment
	segments.set('intro-row', INTRO_SEGMENT)

	const lines = csvContent.split('\n')
	if (lines.length === 0) {
		return {
			raw: segments,
			trimmed: new Map(segments),
		}
	}

	// Parse header to find column positions
	const indices = parseHeaderIndices(lines[0] || '')

	// Parse data rows with multi-line field support
	let i = 1
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
			continue
		}

		// Create and store segment
		const segment = createYouTubeSegment(rowData)
		const key = `${segment.timestamp}-${rowData.markerName}`
		segments.set(key, segment)

		// Skip any lines that were merged
		const linesMerged = (mergedLine.match(/\n/g) || []).length
		i += linesMerged + 1
	}

	return {
		raw: segments,
		trimmed: createTrimmedMap(segments),
	}
}
