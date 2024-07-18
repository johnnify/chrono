import type {PageServerLoad} from './$types'

export const prerender = true

export const load: PageServerLoad = async () => ({
	meta: {
		title: 'About',
		description:
			'Learn more about the Chrono, but also the SvelteKit app made for educational purposes!',
	},
})
