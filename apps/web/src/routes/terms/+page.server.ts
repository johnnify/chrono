import type {PageServerLoad} from './$types'

export const prerender = true

export const load: PageServerLoad = async () => ({
	meta: {
		title: 'Terms of Service',
		description: 'Find out more about our legal terms of service',
	},
})
