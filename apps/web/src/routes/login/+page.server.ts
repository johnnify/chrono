import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async () => ({
	meta: {
		title: 'Login',
		description: 'Sign-in with your Google account',
	},
})
