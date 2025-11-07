import {error} from '@sveltejs/kit'

import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals}) => {
	if (!locals.session) {
		error(401, 'Somehow, you are not logged in')
	}

	return {
		meta: {
			title: 'Profile',
			description: 'See & manage your profile',
		},
	}
}
