import {test as teardown} from '@playwright/test'

teardown('teardown', async () => {
	console.info('Done!')
})
