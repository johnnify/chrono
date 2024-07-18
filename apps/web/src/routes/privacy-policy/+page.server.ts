import type {PageServerLoad} from './$types'

export const prerender = true

export const load: PageServerLoad = async () => ({
	meta: {
		title: 'Privacy Policy',
		description:
			'Read our Privacy Policy and learn more about how we use your data, and keep it safe.',
	},
})
