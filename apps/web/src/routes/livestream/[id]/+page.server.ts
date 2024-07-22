import {error} from '@sveltejs/kit'
import type {PageServerLoad} from '../$types'

export const load: PageServerLoad = async ({locals, params: {id}}) => {
	const livestream = await locals.livestreamsRepo.find(id)

	if (!livestream) {
		error(404, `Livestream ${id} not found`)
	}

	return {
		livestream,
		meta: {
			title: 'Livestreams',
			description: 'See all your latest livestreams!',
		},
	}
}
