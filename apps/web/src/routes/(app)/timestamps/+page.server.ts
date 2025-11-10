import {HOUR_IN_SECONDS} from '$lib/constants'
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({setHeaders}) => {
	setHeaders({'Cache-Control': `public, max-age=${HOUR_IN_SECONDS}`})

	return {
		meta: {
			title: 'Timestamps',
			description:
				'Generate YouTube timestamps from the CSV exported by your non-linear video editing software!',
		},
	}
}
