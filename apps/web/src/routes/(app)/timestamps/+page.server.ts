import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async () => {
	return {
		meta: {
			title: 'Timestamps',
			description: 'Generate YouTube timestamps from your video segments CSV',
		},
	}
}
