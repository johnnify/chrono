import {describe, expect, it} from 'vitest'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {parseCsvToSegments} from './parseCsvToSegments'

describe('parseCsvToSegments', () => {
	it('returns an object with raw and trimmed maps', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const result = parseCsvToSegments(csvContent)

		expect(result).toHaveProperty('raw')
		expect(result).toHaveProperty('trimmed')
		expect(result.raw).toBeInstanceOf(Map)
		expect(result.trimmed).toBeInstanceOf(Map)
	})

	it('raw map always includes 00:00:00 - Intro as first segment', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const {raw} = parseCsvToSegments(csvContent)

		// Get first entry
		const firstEntry = Array.from(raw.entries())[0]

		expect(firstEntry).toBeDefined()
		expect(firstEntry[1].timestamp).toBe('00:00:00')
		expect(firstEntry[1].description).toBe('Intro')
		expect(firstEntry[1].trimmed).toBe(false)
	})

	it('raw map parses CSV rows and converts timestamps to YouTube format', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const {raw} = parseCsvToSegments(csvContent)

		// Convert to array for easier testing
		const segmentArray = Array.from(raw.values())

		// Should have more than just the intro
		expect(segmentArray.length).toBeGreaterThan(1)

		// Check for a specific segment from the CSV
		const introSegment = segmentArray.find((s) =>
			s.description.includes('astra award victory lap'),
		)
		expect(introSegment).toBeDefined()
		expect(introSegment?.timestamp).toBe('00:14:40')
		expect(introSegment?.description).toBe('intro - astra award victory lap')
	})

	it('raw map marks segments with "ad break" as trimmed', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const {raw} = parseCsvToSegments(csvContent)
		const segmentArray = Array.from(raw.values())

		// Find the "ad break" segment (search in description)
		const adBreakSegment = segmentArray.find((s) => {
			const lower = s.description.toLowerCase()
			return lower.includes('ad break') || lower.startsWith('ad break')
		})

		expect(adBreakSegment).toBeDefined()
		expect(adBreakSegment?.trimmed).toBe(true)
		expect(adBreakSegment?.description).toContain('ad break')
	})

	it('raw map marks segments with "ad" in name as trimmed', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const {raw} = parseCsvToSegments(csvContent)
		const segmentArray = Array.from(raw.values())

		// Find the "uncommon goods ad" segment
		const uncommonGoodsAd = segmentArray.find((s) =>
			s.description.includes('uncommon goods ad'),
		)

		expect(uncommonGoodsAd).toBeDefined()
		expect(uncommonGoodsAd?.trimmed).toBe(true)
	})

	it('raw map does not mark segments with "ad" as part of other words as trimmed', () => {
		// Test that words like "addressing", "roadmap", "iad" don't trigger trimming
		const testCsv = [
			'Marker Name\tDescription\tIn\tOut\tDuration',
			'addressing concerns\t\t00:01:00:00\t00:01:00:00\t00:00:00:00',
			'roadmap discussion\t\t00:02:00:00\t00:02:00:00\t00:00:00:00',
			'nomad lifestyle\t\t00:03:00:00\t00:03:00:00\t00:00:00:00',
		].join('\n')

		const {raw} = parseCsvToSegments(testCsv)
		const segmentArray = Array.from(raw.values())

		// None of these should be trimmed
		const addressingSegment = segmentArray.find((s) =>
			s.description.includes('addressing'),
		)
		const roadmapSegment = segmentArray.find((s) =>
			s.description.includes('roadmap'),
		)
		const nomadSegment = segmentArray.find((s) =>
			s.description.includes('nomad'),
		)

		expect(addressingSegment?.trimmed).toBe(false)
		expect(roadmapSegment?.trimmed).toBe(false)
		expect(nomadSegment?.trimmed).toBe(false)
	})

	it('raw map does not mark segments with "ad end" as trimmed', () => {
		// "ad end" markers should NOT be considered as ads to be trimmed
		const testCsv = [
			'Marker Name\tDescription\tIn\tOut\tDuration',
			'ad break\t\t00:01:00:00\t00:02:00:00\t00:01:00:00',
			'ad end\t\t00:02:00:00\t00:02:30:00\t00:00:30:00',
			'content continues\t\t00:02:30:00\t00:03:00:00\t00:00:30:00',
		].join('\n')

		const {raw} = parseCsvToSegments(testCsv)
		const segmentArray = Array.from(raw.values())

		const adBreakSegment = segmentArray.find((s) =>
			s.description.toLowerCase().includes('ad break'),
		)
		const adEndSegment = segmentArray.find((s) =>
			s.description.toLowerCase().includes('ad end'),
		)

		// "ad break" should be trimmed
		expect(adBreakSegment?.trimmed).toBe(true)

		// "ad end" should NOT be trimmed
		expect(adEndSegment?.trimmed).toBe(false)
	})

	it('trimmed map excludes segments marked as trimmed', () => {
		const testCsv = [
			'Marker Name\tDescription\tIn\tOut\tDuration',
			'intro\tWelcome\t00:00:00:00\t00:01:00:00\t00:01:00:00',
			'ad break\tSponsor message\t00:01:00:00\t00:02:00:00\t00:01:00:00',
			'content\tMain topic\t00:02:00:00\t00:03:00:00\t00:01:00:00',
		].join('\n')

		const {raw, trimmed} = parseCsvToSegments(testCsv)

		// Raw should have 4 segments (intro row + 3 parsed)
		expect(raw.size).toBe(4)

		// Trimmed should have 3 segments (intro row + intro + content, minus ad break)
		expect(trimmed.size).toBe(3)

		// Verify ad break is not in trimmed
		const trimmedArray = Array.from(trimmed.values())
		const hasAdBreak = trimmedArray.some((s) =>
			s.description.toLowerCase().includes('ad break'),
		)
		expect(hasAdBreak).toBe(false)
	})

	it('trimmed map adjusts timestamps when segments are removed', () => {
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

		const {trimmed} = parseCsvToSegments(testCsv)
		const trimmedArray = Array.from(trimmed.values())

		// Find the segments in trimmed
		const welcomeSegment = trimmedArray.find((s) =>
			s.description.includes('welcome'),
		)
		const contentSegment = trimmedArray.find((s) =>
			s.description.includes('main content'),
		)
		const outroSegment = trimmedArray.find((s) =>
			s.description.includes('outro'),
		)

		// Welcome should stay at 00:00:00
		expect(welcomeSegment?.timestamp).toBe('00:00:00')

		// Content should be adjusted from 00:03:00 to 00:02:00 (minus 1 minute ad)
		expect(contentSegment?.timestamp).toBe('00:02:00')

		// Outro should be adjusted from 00:05:00 to 00:04:00 (minus 1 minute ad)
		expect(outroSegment?.timestamp).toBe('00:04:00')
	})

	it('trimmed map adjusts timestamps with multiple removed segments', () => {
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

		const {trimmed} = parseCsvToSegments(testCsv)
		const trimmedArray = Array.from(trimmed.values())

		const introSegment = trimmedArray.find((s) =>
			s.description.includes('intro'),
		)
		const contentSegment = trimmedArray.find((s) =>
			s.description.includes('content'),
		)
		const outroSegment = trimmedArray.find((s) =>
			s.description.includes('outro'),
		)

		// Intro should stay at 00:00:00
		expect(introSegment?.timestamp).toBe('00:00:00')

		// Content should be adjusted from 00:01:30 to 00:01:00 (minus 30 seconds from ad 1)
		expect(contentSegment?.timestamp).toBe('00:01:00')

		// Outro should be adjusted from 00:04:00 to 00:02:30 (minus 30s from ad 1 + 1 minute from ad 2)
		expect(outroSegment?.timestamp).toBe('00:02:30')
	})

	it('trimmed map includes the intro segment', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const csvContent = readFileSync(csvPath, 'utf16le')

		const {trimmed} = parseCsvToSegments(csvContent)

		// Get first entry
		const firstEntry = Array.from(trimmed.entries())[0]

		expect(firstEntry).toBeDefined()
		expect(firstEntry[1].timestamp).toBe('00:00:00')
		expect(firstEntry[1].description).toBe('Intro')
		expect(firstEntry[1].trimmed).toBe(false)
	})
})
