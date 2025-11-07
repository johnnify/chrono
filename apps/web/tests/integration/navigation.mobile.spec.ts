import {test, expect} from '@playwright/test'

import {authCredentialsFile} from '../constants'

test.use({storageState: authCredentialsFile})

test('navigation smoke test', async ({page}) => {
	await page.goto('/')
	await expect(page.getByTestId('hydrated')).toBeVisible()

	await expect(
		page.getByRole('heading', {
			name: 'Chrono',
			level: 1,
		}),
	).toBeVisible()
	await expect(page).toHaveTitle(/Chrono/)

	// Navigate to Profile page using the sidenav
	const toggleSideNavElement = page.getByRole('button', {
		name: 'Open navigation menu',
	})
	await toggleSideNavElement.click()
	const sideNavElement = page.getByRole('dialog', {name: 'Navigation'})
	await sideNavElement.getByRole('link', {name: 'Profile'}).click()
	await expect(
		page.getByRole('heading', {level: 1, name: 'Profile'}),
	).toBeVisible()
	await expect(page).toHaveTitle(/Profile/)
	await expect(sideNavElement).toBeHidden()

	// Navigate to Timestamps page using the sidenav
	await toggleSideNavElement.click()
	await sideNavElement.getByRole('link', {name: 'Profile'}).click()
	await expect(
		page.getByRole('heading', {level: 1, name: 'Profile'}),
	).toBeVisible()
	await expect(page).toHaveTitle(/Profile/)
	await expect(sideNavElement).toBeHidden()
})
