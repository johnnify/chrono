import {test, expect} from '@playwright/test'

import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const testCsvFile = path.join(
	__dirname,
	'../../src/lib/parseCsvToSegments/test-segments.csv',
)

test('CSV to YouTube timestamps workflow', async ({page}) => {
	await page.goto('/timestamps')
	await expect(page.getByTestId('hydrated')).toBeVisible()

	await expect(
		page.getByRole('heading', {name: 'CSV to Timestamps', level: 1}),
	).toBeVisible()
	await expect(page).toHaveTitle(/Timestamps/)

	await expect(page.getByText('Drop CSV file')).toBeVisible()

	await page.locator('input[type="file"]').setInputFiles(testCsvFile)

	// Verify both segment lists appear
	await expect(
		page.getByRole('heading', {name: 'All Segments', level: 2}),
	).toBeVisible()
	await expect(
		page.getByRole('heading', {name: 'Post-trim Segments', level: 2}),
	).toBeVisible()

	// Verify edit form appears, with the correct number of segments
	await expect(
		page.getByRole('heading', {name: 'Edit Segments', level: 2}),
	).toBeVisible()

	const segments = page.getByRole('listitem')
	await expect(segments).toHaveCount(12)

	// Verify each segment has inputs for editing
	const timestampInputs = segments.getByLabel('timestamp')
	await expect(timestampInputs.first()).toBeVisible()
	const descriptionInputs = segments.getByLabel('description')
	await expect(descriptionInputs.first()).toBeVisible()
	const trimmedSwitches = segments.getByLabel('trimmed')
	await expect(trimmedSwitches.first()).toBeVisible()

	await descriptionInputs.first().fill('Renoir theme mentioned!')

	const copyButtons = page.getByRole('button', {
		name: 'Copy segments to clipboard',
	})
	await expect(copyButtons).toHaveCount(2)
})
