import Papa from 'papaparse'
import {decodeFile} from './decodeFile'

export type YouTubeSegment = {
	timestamp: string
	description: string
	trimmed: boolean
	csvRowIndex: number
}

// Common export columns from Non-Liner Editing software,
// but with lowercased and trimmed keys: Papaparse can do this easily
export type CsvRow = {
	'marker name'?: string
	description?: string
	in?: string
	out?: string
	duration?: string
	'marker type'?: string
}

// Constants
const INTRO_SEGMENT: YouTubeSegment = {
	timestamp: '00:00:00',
	description: 'Intro',
	trimmed: false,
	csvRowIndex: 0,
}

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

	return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
}

const isValidRow = (row: CsvRow): boolean => {
	const timestamp = row.in?.trim() || ''

	return timestamp.length > 0
}

const createYouTubeSegment = (
	row: CsvRow,
	csvRowIndex: number,
): YouTubeSegment => {
	const markerName = row['marker name']?.trim() || ''
	const description = row.description?.trim() || ''
	const timestamp = row.in?.trim() || ''

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
			// We "skip" trimmed segments,
			// but still need to calculate their duration
			// to adjust following segments accordingly
			const currentSeconds = timestampToSeconds(segment.timestamp)
			const nextSegment = rawSegments[i + 1]
			if (nextSegment) {
				const nextSeconds = timestampToSeconds(nextSegment.timestamp)
				const duration = nextSeconds - currentSeconds
				cumulativeAdjustment += duration
			}
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

export const mapCsvRowsToSegments = (csvRows: CsvRow[]): YouTubeSegment[] => {
	const segments: YouTubeSegment[] = []

	// Always start with the intro segment
	segments.push(INTRO_SEGMENT)

	// Process each CSV row
	for (let i = 0; i < csvRows.length; i++) {
		const row = csvRows[i]!

		// Skip invalid rows
		if (!isValidRow(row)) {
			continue
		}

		// Create and store segment (csvRowIndex is 1-based, starting after the intro)
		const segment = createYouTubeSegment(row, i + 1)
		segments.push(segment)
	}

	return segments
}

export const parseCsvToSegments = async (
	file: File,
): Promise<YouTubeSegment[]> => {
	const arrayBuffer = await file.arrayBuffer()
	const fileText = decodeFile(arrayBuffer)

	const csvRows = Papa.parse<CsvRow>(fileText, {
		header: true,
		skipEmptyLines: true,
		transformHeader: (header) => header.toLowerCase().trim(),
	})

	return mapCsvRowsToSegments(csvRows.data)
}
