import {test, expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {join} from 'node:path'

import {authCredentialsFile} from '../constants'

const testCsv = join(
	import.meta.dirname,
	'../../src/lib/parseCsvToSegments/test-segments.csv',
)

test.use({storageState: authCredentialsFile})

test.describe('accessibility', () => {
	test.describe('user-facing routes', () => {
		test('home page has no accessibility violations', async ({page}) => {
			await page.goto('/')
			await expect(page.getByTestId('hydrated')).toBeVisible()

			const accessibilityScanResults = await new AxeBuilder({page}).analyze()
			expect(accessibilityScanResults.violations).toEqual([])
		})

		test('`/login` has no accessibility violations', async ({page}) => {
			await page.goto('/login')
			await expect(page.getByTestId('hydrated')).toBeVisible()

			const accessibilityScanResults = await new AxeBuilder({page}).analyze()
			expect(accessibilityScanResults.violations).toEqual([])
		})

		test('`/timestamps` has no accessibility violations', async ({page}) => {
			await page.goto('/timestamps')
			await expect(page.getByTestId('hydrated')).toBeVisible()

			const emptyStateAccessibilityScanResults = await new AxeBuilder({
				page,
			}).analyze()
			expect(emptyStateAccessibilityScanResults.violations).toEqual([])

			await page.locator('input[type="file"]').setInputFiles(testCsv)
			await expect(
				page.getByRole('region', {name: 'All Segments'}),
			).toBeVisible()
			const fileDroppedAccessibilityScanResults = await new AxeBuilder({
				page,
			}).analyze()
			expect(fileDroppedAccessibilityScanResults.violations).toEqual([])
		})

		test('`/profile` has no accessibility violations', async ({page}) => {
			await page.goto('/profile')
			await expect(page.getByTestId('hydrated')).toBeVisible()

			const accessibilityScanResults = await new AxeBuilder({page}).analyze()
			expect(accessibilityScanResults.violations).toEqual([])
		})

		test('`/terms` has no accessibility violations', async ({page}) => {
			await page.goto('/terms')
			await expect(page.getByTestId('hydrated')).toBeVisible()

			const accessibilityScanResults = await new AxeBuilder({page}).analyze()
			expect(accessibilityScanResults.violations).toEqual([])
		})

		test('`/privacy-policy` has no accessibility violations', async ({
			page,
		}) => {
			await page.goto('/privacy-policy')
			await expect(page.getByTestId('hydrated')).toBeVisible()

			const accessibilityScanResults = await new AxeBuilder({page}).analyze()
			expect(accessibilityScanResults.violations).toEqual([])
		})
	})
})
