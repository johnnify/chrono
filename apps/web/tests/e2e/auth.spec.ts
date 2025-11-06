import {test, expect} from '@playwright/test'

test.describe('protected routes', () => {
	test('redirects to login page for unauthorised access', async ({page}) => {
		await page.goto('/admin')
		await expect(page.getByTestId('hydrated')).toBeVisible()

		await expect(
			page.getByRole('heading', {
				name: 'Login',
				level: 1,
			}),
		).toBeVisible()
		await expect(page).toHaveTitle(/Login/)
		await expect(page).toHaveURL('/login')
	})
})

test.describe('login page', () => {
	test('has the Google login option', async ({page}) => {
		await page.goto('/login')
		await expect(page.getByTestId('hydrated')).toBeVisible()

		await expect(
			page.getByRole('heading', {name: 'Login', level: 1}),
		).toBeVisible()

		await expect(
			page.getByRole('button', {name: 'Login with Google'}),
		).toBeVisible()
	})
})
