import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async () => ({
	meta: {
		title: '👨‍💻 Admin Dashboard',
		description: 'Review stats & user activity',
	},
})
