import type {PageServerLoad} from './$types'

export const prerender = true

export const load: PageServerLoad = async ({locals}) => {
	const {livestreams} = await locals.livestreamsRepo.list()

	return {
		livestreams,
		meta: {
			title: 'Livestreams',
			description: 'See all your latest livestreams!',
		},
	}
}
