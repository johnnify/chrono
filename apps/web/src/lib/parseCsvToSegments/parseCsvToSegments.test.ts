import {describe, expect, it} from 'vitest'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {parseCsvToSegments, cutTrimmedSegments} from './parseCsvToSegments'

describe('parseCsvToSegments', () => {
	it('returns an array of YouTubeSegment', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const result = parseCsvToSegments(csvContent)

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)
	})

	it('always includes 00:00:00 - Intro as first segment', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const segments = parseCsvToSegments(csvContent)

		// Get first entry
		const firstSegment = segments[0]

		expect(firstSegment).toBeDefined()
		expect(firstSegment?.timestamp).toBe('00:00:00')
		expect(firstSegment?.description).toBe('Intro')
		expect(firstSegment?.trimmed).toBe(false)
		expect(firstSegment?.csvRowIndex).toBe(0)
	})

	it('parses CSV rows and converts timestamps to YouTube format', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const segments = parseCsvToSegments(csvContent)

		// Should have more than just the intro
		expect(segments.length).toBeGreaterThan(1)

		// Check for a specific segment from the CSV
		const introSegment = segments.find((s) =>
			s.description.includes('astra award victory lap'),
		)
		expect(introSegment).toBeDefined()
		expect(introSegment?.timestamp).toBe('00:14:40')
		expect(introSegment?.description).toBe('intro - astra award victory lap')
	})

	it('marks segments with "ad break" as trimmed', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const segments = parseCsvToSegments(csvContent)

		// Find the "ad break" segment (search in description)
		const adBreakSegment = segments.find((s) => {
			const lower = s.description.toLowerCase()
			return lower.includes('ad break') || lower.startsWith('ad break')
		})

		expect(adBreakSegment).toBeDefined()
		expect(adBreakSegment?.trimmed).toBe(true)
		expect(adBreakSegment?.description).toContain('ad break')
	})

	it('marks segments with "ad" in name as trimmed', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const segments = parseCsvToSegments(csvContent)

		// Find the "uncommon goods ad" segment
		const uncommonGoodsAd = segments.find((s) =>
			s.description.includes('uncommon goods ad'),
		)

		expect(uncommonGoodsAd).toBeDefined()
		expect(uncommonGoodsAd?.trimmed).toBe(true)
	})

	it('does not mark segments with "ad" as part of other words as trimmed', () => {
		// Test that words like "addressing", "roadmap", "iad" don't trigger trimming
		const testCsv = [
			'Marker Name\tDescription\tIn\tOut\tDuration',
			'addressing concerns\t\t00:01:00:00\t00:01:00:00\t00:00:00:00',
			'roadmap discussion\t\t00:02:00:00\t00:02:00:00\t00:00:00:00',
			'nomad lifestyle\t\t00:03:00:00\t00:03:00:00\t00:00:00:00',
		].join('\n')

		const segments = parseCsvToSegments(testCsv)

		// None of these should be trimmed
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
		// "ad end" markers should NOT be considered as ads to be trimmed
		const testCsv = [
			'Marker Name\tDescription\tIn\tOut\tDuration',
			'ad break\t\t00:01:00:00\t00:02:00:00\t00:01:00:00',
			'ad end\t\t00:02:00:00\t00:02:30:00\t00:00:30:00',
			'content continues\t\t00:02:30:00\t00:03:00:00\t00:00:30:00',
		].join('\n')

		const segments = parseCsvToSegments(testCsv)

		const adBreakSegment = segments.find((s) =>
			s.description.toLowerCase().includes('ad break'),
		)
		const adEndSegment = segments.find((s) =>
			s.description.toLowerCase().includes('ad end'),
		)

		// "ad break" should be trimmed
		expect(adBreakSegment?.trimmed).toBe(true)

		// "ad end" should NOT be trimmed
		expect(adEndSegment?.trimmed).toBe(false)
	})

	it('includes csvRowIndex for each segment', () => {
		const testCsv = [
			'Marker Name\tDescription\tIn\tOut\tDuration',
			'intro\tWelcome\t00:00:00:00\t00:01:00:00\t00:01:00:00',
			'content\tMain topic\t00:02:00:00\t00:03:00:00\t00:01:00:00',
		].join('\n')

		const segments = parseCsvToSegments(testCsv)

		// Intro segment has csvRowIndex 0
		expect(segments[0]?.csvRowIndex).toBe(0)

		// First parsed segment should have csvRowIndex 1
		const firstParsed = segments.find((s) => s.description.includes('Welcome'))
		expect(firstParsed?.csvRowIndex).toBe(1)

		// Second parsed segment should have csvRowIndex 2
		const secondParsed = segments.find((s) => s.description.includes('Main'))
		expect(secondParsed?.csvRowIndex).toBe(2)
	})
})

describe('cutTrimmedSegments', () => {
	it('excludes segments marked as trimmed', () => {
		const testCsv = [
			'Marker Name\tDescription\tIn\tOut\tDuration',
			'intro\tWelcome\t00:00:00:00\t00:01:00:00\t00:01:00:00',
			'ad break\tSponsor message\t00:01:00:00\t00:02:00:00\t00:01:00:00',
			'content\tMain topic\t00:02:00:00\t00:03:00:00\t00:01:00:00',
		].join('\n')

		const raw = parseCsvToSegments(testCsv)
		const trimmed = cutTrimmedSegments(raw)

		// Raw should have 4 segments (intro row + 3 parsed)
		expect(raw.length).toBe(4)

		// Trimmed should have 3 segments (intro row + intro + content, minus ad break)
		expect(trimmed.length).toBe(3)

		// Verify ad break is not in trimmed
		const hasAdBreak = trimmed.some((s) =>
			s.description.toLowerCase().includes('ad break'),
		)
		expect(hasAdBreak).toBe(false)
	})

	it('adjusts timestamps when segments are removed', () => {
		// Create a CSV with an ad segment in the middle
		// Segment 1: 00:00:00 - Welcome
		// Segment 2: 00:02:00 - Ad (should be removed, duration = 1 minute)
		// Segment 3: 00:03:00 - Content (should become 00:02:00 in trimmed)
		// Segment 4: 00:05:00 - Outro (should become 00:04:00 in trimmed)
		const testCsv = [
			'Marker Name\tDescription\tIn\tOut\tDuration',
			'welcome\t\t00:00:00:00\t00:02:00:00\t00:02:00:00',
			'ad\tSponsor\t00:02:00:00\t00:03:00:00\t00:01:00:00',
			'main content\t\t00:03:00:00\t00:05:00:00\t00:02:00:00',
			'outro\t\t00:05:00:00\t00:06:00:00\t00:01:00:00',
		].join('\n')

		const raw = parseCsvToSegments(testCsv)
		const trimmed = cutTrimmedSegments(raw)

		// Find the segments in trimmed
		const welcomeSegment = trimmed.find((s) =>
			s.description.includes('welcome'),
		)
		const contentSegment = trimmed.find((s) =>
			s.description.includes('main content'),
		)
		const outroSegment = trimmed.find((s) => s.description.includes('outro'))

		// Welcome should stay at 00:00:00
		expect(welcomeSegment?.timestamp).toBe('00:00:00')

		// Content should be adjusted from 00:03:00 to 00:02:00 (minus 1 minute ad)
		expect(contentSegment?.timestamp).toBe('00:02:00')

		// Outro should be adjusted from 00:05:00 to 00:04:00 (minus 1 minute ad)
		expect(outroSegment?.timestamp).toBe('00:04:00')
	})

	it('adjusts timestamps with multiple removed segments', () => {
		// Create a CSV with multiple ad segments
		// Segment 1: 00:00:00 - Intro
		// Segment 2: 00:01:00 - Ad 1 (duration = 30 seconds)
		// Segment 3: 00:01:30 - Content
		// Segment 4: 00:03:00 - Ad 2 (duration = 1 minute)
		// Segment 5: 00:04:00 - Outro
		const testCsv = [
			'Marker Name\tDescription\tIn\tOut\tDuration',
			'intro\t\t00:00:00:00\t00:01:00:00\t00:01:00:00',
			'ad\tFirst sponsor\t00:01:00:00\t00:01:30:00\t00:00:30:00',
			'content\t\t00:01:30:00\t00:03:00:00\t00:01:30:00',
			'ad break\tSecond sponsor\t00:03:00:00\t00:04:00:00\t00:01:00:00',
			'outro\t\t00:04:00:00\t00:05:00:00\t00:01:00:00',
		].join('\n')

		const raw = parseCsvToSegments(testCsv)
		const trimmed = cutTrimmedSegments(raw)

		const introSegment = trimmed.find((s) => s.description.includes('intro'))
		const contentSegment = trimmed.find((s) =>
			s.description.includes('content'),
		)
		const outroSegment = trimmed.find((s) => s.description.includes('outro'))

		// Intro should stay at 00:00:00
		expect(introSegment?.timestamp).toBe('00:00:00')

		// Content should be adjusted from 00:01:30 to 00:01:00 (minus 30 seconds from ad 1)
		expect(contentSegment?.timestamp).toBe('00:01:00')

		// Outro should be adjusted from 00:04:00 to 00:02:30 (minus 30s from ad 1 + 1 minute from ad 2)
		expect(outroSegment?.timestamp).toBe('00:02:30')
	})

	it('includes the intro segment', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const raw = parseCsvToSegments(csvContent)
		const trimmed = cutTrimmedSegments(raw)

		// Get first entry
		const firstSegment = trimmed[0]

		expect(firstSegment).toBeDefined()
		expect(firstSegment?.timestamp).toBe('00:00:00')
		expect(firstSegment?.description).toBe('Intro')
		expect(firstSegment?.trimmed).toBe(false)
	})
})
