import {test, expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {join} from 'node:path'

import {authCredentialsFile} from '../constants'

test.use({storageState: authCredentialsFile})

let routes: string[]

test.beforeAll(async ({request}) => {
	// Dynamically fetch all UI routes
	const response = await request.get('/api/sitemap')
	routes = await response.json()
})

test('accessibility', async ({page}) => {
	// Each page needs about half a second!
	test.setTimeout(routes.length * 1_000)

	for (const route of routes) {
		await test.step(`"${route}" has no accessibility violations`, async () => {
			await page.goto(route)
			await expect(page.getByTestId('hydrated')).toBeVisible()
			await expect(page.getByRole('heading', {level: 1})).toBeVisible()

			const accessibilityScanResults = await new AxeBuilder({page}).analyze()
			expect(accessibilityScanResults.violations).toEqual([])
		})
	}
})

const testCsv = join(
	import.meta.dirname,
	'../../src/lib/parseCsvToSegments/test-segments.csv',
)

test('`/timestamps` after file drop has no accessibility violations', async ({
	page,
}) => {
	await page.goto('/timestamps')
	await expect(page.getByTestId('hydrated')).toBeVisible()
	await expect(
		page.getByRole('heading', {name: 'CSV to Timestamps', level: 1}),
	).toBeVisible()

	await page.locator('input[type="file"]').setInputFiles(testCsv)
	await expect(page.getByRole('region', {name: 'All Segments'})).toBeVisible()
	const fileDroppedAccessibilityScanResults = await new AxeBuilder({
		page,
	}).analyze()
	expect(fileDroppedAccessibilityScanResults.violations).toEqual([])
})
