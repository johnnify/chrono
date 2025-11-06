import {test, expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

import {authCredentialsFile} from '../constants'

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
