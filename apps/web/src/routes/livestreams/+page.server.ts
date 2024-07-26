import {redirect} from '@sveltejs/kit'
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({
	locals: {livestreamsRepo, user},
}) => {
	const userId = user?.id
	if (!userId) {
		redirect(307, '/login')
	}

	const {livestreams} = await livestreamsRepo.list(userId)

	return {
		livestreams,
		meta: {
			title: 'Livestreams',
			description: 'See all your latest livestreams!',
		},
	}
}
