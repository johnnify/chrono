import {test, expect} from '@playwright/test'

test('has all the expected login options', async ({page}) => {
	await page.goto('/login')
	await expect(page.getByTestId('hydrated')).toBeVisible()

	await expect(
		page.getByRole('heading', {name: 'Login', level: 1}),
	).toBeVisible()

	await expect(
		page.getByRole('button', {name: 'Login with Google'}),
	).toBeVisible()
})
