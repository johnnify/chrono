import {describe, expect, it} from 'vitest'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {
	mapCsvRowsToSegments,
	cutTrimmedSegments,
	parseCsvToSegments,
} from './parseCsvToSegments'
import type {CsvRow} from './parseCsvToSegments'

describe('mapCsvRowsToSegments', () => {
	it('returns an array of YouTubeSegment', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'intro', description: 'Welcome', in: '00:00:00:00'},
		]

		const result = mapCsvRowsToSegments(csvRows)

		expect(result.length).toBeGreaterThan(0)
		expect(result[0]).toHaveProperty('timestamp')
		expect(result[0]).toHaveProperty('description')
		expect(result[0]).toHaveProperty('trimmed')
		expect(result[0]).toHaveProperty('csvRowIndex')
	})

	it('auto-adds an intro as the first segment at 00:00:00', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'First topic', description: '', in: '00:10:00:00'},
		]

		const segments = mapCsvRowsToSegments(csvRows)

		const firstSegment = segments[0]
		expect(firstSegment).toBeDefined()
		expect(firstSegment?.timestamp).toBe('00:00:00')
		expect(firstSegment?.description).toBe('Intro')
		expect(firstSegment?.trimmed).toBe(false)
		expect(firstSegment?.csvRowIndex).toBe(0)
	})

	it('parses CSV rows and converts timestamps to YouTube format', () => {
		const csvRows: CsvRow[] = [
			{
				'marker name': 'intro',
				description: 'astra award victory lap',
				in: '00:14:40:37',
			},
		]

		const segments = mapCsvRowsToSegments(csvRows)

		expect(segments.length).toBeGreaterThan(1)

		const introSegment = segments.find((s) =>
			s.description.includes('astra award victory lap'),
		)
		expect(introSegment).toBeDefined()
		expect(introSegment?.timestamp).toBe('00:14:40')
		expect(introSegment?.description).toBe('intro - astra award victory lap')
	})

	it('marks segments with "ad break" as trimmed', () => {
		const csvRows: CsvRow[] = [
			{
				'marker name': 'ad break',
				description: 'lola blanket',
				in: '00:47:17:39',
			},
		]

		const segments = mapCsvRowsToSegments(csvRows)

		const adBreakSegment = segments.find((s) => {
			const lower = s.description.toLowerCase()
			return lower.includes('ad break') || lower.startsWith('ad break')
		})

		expect(adBreakSegment).toBeDefined()
		expect(adBreakSegment?.trimmed).toBe(true)
		expect(adBreakSegment?.description).toContain('ad break')
	})

	it('marks segments with "ad" in name as trimmed', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'uncommon goods ad', description: '', in: '01:32:51:29'},
		]

		const segments = mapCsvRowsToSegments(csvRows)

		const uncommonGoodsAd = segments.find((s) =>
			s.description.includes('uncommon goods ad'),
		)

		expect(uncommonGoodsAd).toBeDefined()
		expect(uncommonGoodsAd?.trimmed).toBe(true)
	})

	it('does not mark segments with "ad" as part of other words as trimmed', () => {
		const csvRows: CsvRow[] = [
			{
				'marker name': 'addressing concerns',
				description: '',
				in: '00:01:00:00',
			},
			{
				'marker name': 'roadmap discussion',
				description: '',
				in: '00:02:00:00',
			},
			{'marker name': 'nomad lifestyle', description: '', in: '00:03:00:00'},
		]

		const segments = mapCsvRowsToSegments(csvRows)

		const addressingSegment = segments.find((s) =>
			s.description.includes('addressing'),
		)
		const roadmapSegment = segments.find((s) =>
			s.description.includes('roadmap'),
		)
		const nomadSegment = segments.find((s) => s.description.includes('nomad'))

		expect(addressingSegment?.trimmed).toBe(false)
		expect(roadmapSegment?.trimmed).toBe(false)
		expect(nomadSegment?.trimmed).toBe(false)
	})

	it('does not mark segments with "ad end" as trimmed', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'ad break', description: '', in: '00:01:00:00'},
			{'marker name': 'ad end', description: '', in: '00:02:00:00'},
			{
				'marker name': 'content continues',
				description: '',
				in: '00:02:30:00',
			},
		]

		const segments = mapCsvRowsToSegments(csvRows)

		const adBreakSegment = segments.find((s) =>
			s.description.toLowerCase().includes('ad break'),
		)
		const adEndSegment = segments.find((s) =>
			s.description.toLowerCase().includes('ad end'),
		)

		expect(adBreakSegment?.trimmed).toBe(true)
		expect(adEndSegment?.trimmed).toBe(false)
	})

	it('includes csvRowIndex for each segment', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'intro', description: 'Welcome', in: '00:00:10:00'},
			{'marker name': 'content', description: 'Main topic', in: '00:02:00:00'},
		]

		const segments = mapCsvRowsToSegments(csvRows)

		// Auto intro at 00:00:00
		expect(segments[0]?.csvRowIndex).toBe(0)
		expect(segments[0]?.description).toBe('Intro')

		const firstParsed = segments.find((s) => s.description.includes('Welcome'))
		expect(firstParsed?.csvRowIndex).toBe(1)

		const secondParsed = segments.find((s) => s.description.includes('Main'))
		expect(secondParsed?.csvRowIndex).toBe(2)
	})

	it('does not add auto INTRO segment if CSV already has one at 00:00:00', () => {
		const csvRows: CsvRow[] = [
			{
				'marker name': 'Intro',
				description: 'hello & welcome',
				in: '00:00:00:13',
			},
			{'marker name': 'Main content', description: '', in: '00:10:00:00'},
		]

		const segments = mapCsvRowsToSegments(csvRows)

		expect(segments.length).toBe(csvRows.length)

		// First segment should be the one from CSV
		expect(segments[0]?.description).toBe('Intro - hello & welcome')
		expect(segments[0]?.timestamp).toBe('00:00:00')
		expect(segments[0]?.csvRowIndex).toBe(1)
	})

	it('adds auto INTRO segment if CSV starts later than 00:00:00', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'First segment', description: '', in: '00:10:00:00'},
			{'marker name': 'Second segment', description: '', in: '00:20:00:00'},
		]

		const segments = mapCsvRowsToSegments(csvRows)

		expect(segments.length).toBe(csvRows.length + 1)

		// First segment should be auto intro
		expect(segments[0]?.description).toBe('Intro')
		expect(segments[0]?.timestamp).toBe('00:00:00')
		expect(segments[0]?.csvRowIndex).toBe(0)
	})
})

describe('cutTrimmedSegments', () => {
	it('excludes segments marked as trimmed', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'intro', description: 'Welcome', in: '00:00:10:00'},
			{
				'marker name': 'ad break',
				description: 'Sponsor message',
				in: '00:01:00:00',
			},
			{'marker name': 'content', description: 'Main topic', in: '00:02:00:00'},
		]

		const raw = mapCsvRowsToSegments(csvRows)
		const trimmed = cutTrimmedSegments(raw)

		expect(raw.length).toBe(4)
		expect(trimmed.length).toBe(3)

		const hasAdBreak = trimmed.some((s) =>
			s.description.toLowerCase().includes('ad break'),
		)
		expect(hasAdBreak).toBe(false)
	})

	it('adjusts timestamps when segments are removed', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'welcome', description: '', in: '00:00:00:00'},
			{'marker name': 'ad', description: 'Sponsor', in: '00:02:00:00'},
			{'marker name': 'main content', description: '', in: '00:03:00:00'},
			{'marker name': 'outro', description: '', in: '00:05:00:00'},
		]

		const raw = mapCsvRowsToSegments(csvRows)
		const trimmed = cutTrimmedSegments(raw)

		const welcomeSegment = trimmed.find((s) =>
			s.description.includes('welcome'),
		)
		const contentSegment = trimmed.find((s) =>
			s.description.includes('main content'),
		)
		const outroSegment = trimmed.find((s) => s.description.includes('outro'))

		expect(welcomeSegment?.timestamp).toBe('00:00:00')
		expect(contentSegment?.timestamp).toBe('00:02:00')
		expect(outroSegment?.timestamp).toBe('00:04:00')
	})

	it('adjusts timestamps with multiple removed segments', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'intro', description: '', in: '00:00:00:00'},
			{'marker name': 'ad', description: 'First sponsor', in: '00:01:00:00'},
			{'marker name': 'content', description: '', in: '00:01:30:00'},
			{
				'marker name': 'ad break',
				description: 'Second sponsor',
				in: '00:03:00:00',
			},
			{'marker name': 'outro', description: '', in: '00:04:00:00'},
		]

		const raw = mapCsvRowsToSegments(csvRows)
		const trimmed = cutTrimmedSegments(raw)

		const introSegment = trimmed.find((s) => s.description.includes('intro'))
		const contentSegment = trimmed.find((s) =>
			s.description.includes('content'),
		)
		const outroSegment = trimmed.find((s) => s.description.includes('outro'))

		expect(introSegment?.timestamp).toBe('00:00:00')
		expect(contentSegment?.timestamp).toBe('00:01:00')
		expect(outroSegment?.timestamp).toBe('00:02:30')
	})

	it('includes the intro segment', () => {
		const csvRows: CsvRow[] = [
			{'marker name': 'content', description: 'Welcome', in: '00:00:10:00'},
		]

		const raw = mapCsvRowsToSegments(csvRows)
		const trimmed = cutTrimmedSegments(raw)

		const firstSegment = trimmed[0]

		expect(firstSegment).toBeDefined()
		expect(firstSegment?.timestamp).toBe('00:00:00')
		expect(firstSegment?.description).toBe('Intro')
		expect(firstSegment?.trimmed).toBe(false)
	})
})

describe('parseCsvToSegments', () => {
	const csvPath = join(import.meta.dirname, 'test-segments.csv')
	const nodeBuffer = readFileSync(csvPath)
	const arrayBuffer = nodeBuffer.buffer.slice(
		nodeBuffer.byteOffset,
		nodeBuffer.byteOffset + nodeBuffer.byteLength,
	)
	const minnMaxTestFile = new File([arrayBuffer], 'test-segments.csv', {
		type: 'text/csv',
	})

	it('parses a real CSV file and returns YouTube segments', async () => {
		const segments = await parseCsvToSegments(minnMaxTestFile)

		expect(segments.length).toBeGreaterThan(0)
		expect(segments[0]?.timestamp).toBe('00:00:00')
		expect(segments[0]?.description).toBe('Intro')
	})

	it('handles UTF-16LE encoded CSV files', async () => {
		const segments = await parseCsvToSegments(minnMaxTestFile)

		// Should successfully parse the UTF-16LE file
		expect(segments.length).toBeGreaterThan(1)

		// Check for a known segment from the test file
		const astraSegment = segments.find((s) =>
			s.description.includes('astra award victory lap'),
		)
		expect(astraSegment).toBeDefined()
		expect(astraSegment?.timestamp).toBe('00:14:40')
	})

	it('correctly identifies and marks ad segments', async () => {
		const segments = await parseCsvToSegments(minnMaxTestFile)

		// Find ad break segment
		const adBreakSegment = segments.find((s) =>
			s.description.toLowerCase().includes('ad break'),
		)
		expect(adBreakSegment).toBeDefined()
		expect(adBreakSegment?.trimmed).toBe(true)

		// Find uncommon goods ad
		const uncommonGoodsAd = segments.find((s) =>
			s.description.includes('uncommon goods ad'),
		)
		expect(uncommonGoodsAd).toBeDefined()
		expect(uncommonGoodsAd?.trimmed).toBe(true)
	})

	it('does not mark "ad end" as an ad to be trimmed', async () => {
		const segments = await parseCsvToSegments(minnMaxTestFile)

		// The test file has "(LoL) ad end" which should NOT be trimmed
		const adEndSegment = segments.find((s) =>
			s.description.toLowerCase().includes('ad end'),
		)
		expect(adEndSegment).toBeDefined()
		expect(adEndSegment?.trimmed).toBe(false)
	})

	it('converts editing software timestamps to YouTube format', async () => {
		const segments = await parseCsvToSegments(minnMaxTestFile)

		// All timestamps should be in HH:MM:SS format (not HH:MM:SS:FF)
		for (const segment of segments) {
			expect(segment.timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/)
		}
	})

	it('handles a CSV exported from Google Sheets', async () => {
		const googleSheetsPath = join(
			import.meta.dirname,
			'google-sheets-export.csv',
		)
		const nodeBuffer = readFileSync(googleSheetsPath)
		const arrayBuffer = nodeBuffer.buffer.slice(
			nodeBuffer.byteOffset,
			nodeBuffer.byteOffset + nodeBuffer.byteLength,
		)
		const googleSheetsFile = new File(
			[arrayBuffer],
			'google-sheets-export.csv',
			{
				type: 'text/csv',
			},
		)

		const segments = await parseCsvToSegments(googleSheetsFile)

		// Should have 7 segments total (no auto intro since CSV starts at 00:00:00)
		expect(segments.length).toBe(7)

		// First segment should be from CSV (Intro at 00:00:00)
		expect(segments[0]?.description).toContain('Intro')
		expect(segments[0]?.timestamp).toBe('00:00:00')

		// Should have 1 ad segment
		const adSegments = segments.filter((s) => s.trimmed)
		expect(adSegments.length).toBe(1)
		expect(adSegments[0]?.description).toContain('Johnnify Premium ad')
	})
})
