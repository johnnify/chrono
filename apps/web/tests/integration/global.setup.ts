import {test as setup, expect} from '@playwright/test'

import {authCredentialsFile} from '../constants'

const credentials = Buffer.from(
	`mock-auth:${process.env.MOCK_AUTH_SECRET}`,
).toString('base64')

setup('authenticate', async ({request}) => {
	console.info('🔐 Authenticating...')
	const response = await request.post('/auth/mock', {
		headers: {
			Authorization: `Basic ${credentials}`,
		},
	})

	if (!response.ok()) {
		throw new Error(
			`Playwright failed to go through the mock auth flow: ${response.statusText()}`,
		)
	}
	await request.storageState({path: authCredentialsFile})
	console.info('✅ Logged-in credentials set!')
})

setup.describe(() => {
	setup.use({storageState: authCredentialsFile})

	setup('can load the home page', async ({page}) => {
		// dev server may take a while to build the first page load
		setup.setTimeout(0)
		await page.goto('/')

		await expect(page.getByTestId('hydrated')).toBeVisible()
	})
})
