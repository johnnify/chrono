import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async () => {
	// use this route to easily customise and test our error page
	throw new Error('This is a test error. No cause for alarm.')
}
