import type {PageServerLoad} from './$types'

export const prerender = true

export const load: PageServerLoad = async () => ({
	meta: {
		title: 'Livestreams',
		description: 'See all your latest livestreams!',
	},
})
