import {test, expect} from '@playwright/test'

import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const testCsv = path.join(
	__dirname,
	'../../src/lib/parseCsvToSegments/test-segments.csv',
)

const sheetsExportCsv = path.join(
	__dirname,
	'../../src/lib/parseCsvToSegments/google-sheets-export.csv',
)

test('CSV to YouTube timestamps workflow', async ({page}) => {
	await page.goto('/timestamps')
	await expect(page.getByTestId('hydrated')).toBeVisible()

	await expect(
		page.getByRole('heading', {name: 'CSV to Timestamps', level: 1}),
	).toBeVisible()
	await expect(page).toHaveTitle(/Timestamps/)

	await expect(page.getByText('Drop CSV file')).toBeVisible()

	await page.locator('input[type="file"]').setInputFiles(testCsv)

	// Verify "All Segments" region has all 12 segments
	const allSegmentsRegion = page.getByRole('region', {name: 'All Segments'})
	await expect(allSegmentsRegion).toBeVisible()
	const allSegmentsItems = allSegmentsRegion.getByRole('listitem')
	await expect(allSegmentsItems).toHaveCount(12)

	// Chrome does not allow the clipboard operation, so we just check the button exists
	await expect(
		allSegmentsRegion.getByRole('button', {name: 'Copy'}),
	).toBeVisible()

	// Verify "Post-trim Segments" region has 10/12 segments
	const postTrimRegion = page.getByRole('region', {name: 'Post-trim Segments'})
	await expect(postTrimRegion).toBeVisible()
	const postTrimSegmentsItems = postTrimRegion.getByRole('listitem')
	await expect(postTrimSegmentsItems).toHaveCount(10)

	// Chrome does not allow the clipboard operation, so we just check the button exists
	await expect(postTrimRegion.getByRole('button', {name: 'Copy'})).toBeVisible()

	// Verify "Edit Segments" region has all 12 segments
	const editSegmentsRegion = page.getByRole('region', {name: 'Edit Segments'})
	await expect(editSegmentsRegion).toBeVisible()
	const editSegmentsItems = editSegmentsRegion.getByRole('listitem')
	await expect(editSegmentsItems).toHaveCount(12)

	// Verify each segments do have the correct inputs for editing
	const timestampInputs = editSegmentsItems.getByLabel('timestamp')
	await expect(timestampInputs.first()).toBeVisible()
	const descriptionInputs = editSegmentsItems.getByLabel('description')
	await expect(descriptionInputs.first()).toBeVisible()
	const trimmedSwitches = editSegmentsItems.getByLabel('trimmed')
	await expect(trimmedSwitches.first()).toBeVisible()

	await descriptionInputs.first().fill('Renoir theme mentioned!')
})

test('handles Google Sheets export CSV', async ({page}) => {
	await page.goto('/timestamps')
	await expect(page.getByTestId('hydrated')).toBeVisible()

	await expect(
		page.getByRole('heading', {name: 'CSV to Timestamps', level: 1}),
	).toBeVisible()
	await expect(page).toHaveTitle(/Timestamps/)

	await expect(page.getByText('Drop CSV file')).toBeVisible()

	await page.locator('input[type="file"]').setInputFiles(sheetsExportCsv)

	// Verify "All Segments" region has all 12 segments
	const allSegmentsRegion = page.getByRole('region', {name: 'All Segments'})
	await expect(allSegmentsRegion).toBeVisible()
	const allSegmentsItems = allSegmentsRegion.getByRole('listitem')
	await expect(allSegmentsItems).toHaveCount(8)

	// Verify "Post-trim Segments" region has 10/12 segments
	const postTrimRegion = page.getByRole('region', {name: 'Post-trim Segments'})
	await expect(postTrimRegion).toBeVisible()
	const postTrimSegmentsItems = postTrimRegion.getByRole('listitem')
	await expect(postTrimSegmentsItems).toHaveCount(7)
})
