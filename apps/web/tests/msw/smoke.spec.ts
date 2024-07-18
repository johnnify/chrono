import {test, expect} from '@playwright/test'

test('smoke test (can run with MSW enabled)', async ({page}) => {
	await page.goto('/')
	await expect(page.getByTestId('hydrated')).toBeVisible()
})
