import {error} from '@sveltejs/kit'

import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals}) => {
	if (!locals.session) {
		error(401, 'Somehow, you are not logged in')
	}

	const user = await locals.usersRepo.getUserById(locals.session.userId)
	if (!user) {
		error(401, 'User not found')
	}

	return {
		user,
		meta: {
			title: 'Profile',
			description: 'See & manage your profile',
		},
	}
}
