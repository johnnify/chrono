import type {LayoutServerLoad} from './$types'

export const load: LayoutServerLoad = async ({
	locals: {user, rng},
	request: {headers},
}) => ({
	user,
	rng,
	locale: headers.get('Accept-Language')?.split(',')[0] ?? 'en-GB',
})
