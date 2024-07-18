import {defineConfig, devices, Project} from '@playwright/test'

/* Configure projects for major browsers */
const projects: Project[] = [
	{
		name: 'chromium',
		use: {...devices['Desktop Chrome']},
		testIgnore: /.*mobile.spec.ts/,
	},

	{
		name: 'firefox',
		use: {...devices['Desktop Firefox']},
		testIgnore: /.*mobile.spec.ts/,
	},

	{
		name: 'Mobile Safari',
		use: {
			...devices['iPhone 14 Pro'],
			contextOptions: {reducedMotion: 'reduce'},
		},
		testIgnore: /.*desktop.spec.ts/,
	},

	// {
	// 	name: 'webkit',
	// 	use: {...devices['Desktop Safari']},
	// },

	/* Test against mobile viewports. */
	// {
	//   name: 'Mobile Chrome',
	//   use: { ...devices['Pixel 5'] },
	// },

	/* Test against branded browsers. */
	// {
	//   name: 'Microsoft Edge',
	//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
	// },
	// {
	//   name: 'Google Chrome',
	//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
	// },
]

if (process.env.MSW_ENABLED === 'true') {
	projects.forEach((project) => {
		project.dependencies = ['setup db']
	})
	projects.push(
		{
			name: 'setup db',
			testMatch: /global\.setup\.ts/,
			teardown: 'cleanup db',
		},
		{
			name: 'cleanup db',
			testMatch: /global\.teardown\.ts/,
		},
	)
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	/* Lower timeout for BDD */
	timeout: process.env.CI ? 30_000 : 5_000,
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	// reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: process.env.PUBLIC_ROOT_URL || 'http://localhost:5173',

		launchOptions: {
			slowMo: parseInt(process.env.SLOW_MO || '0'),
		},

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
		video: process.env.VIDEO ? 'on' : 'retain-on-failure',
	},

	projects,

	/* Run your local dev server before starting the tests */
	webServer: !process.env.PUBLIC_ROOT_URL
		? {
				command: 'bun dev',
				port: 5173,
				reuseExistingServer: true,
			}
		: undefined,
})
