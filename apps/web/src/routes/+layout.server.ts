import type {LayoutServerLoad} from './$types'

export const load: LayoutServerLoad = async ({
	locals: {userRole, rng},
	request: {headers},
}) => ({
	userRole,
	rng,
	locale: headers.get('Accept-Language')?.split(',')[0] ?? 'en-GB',
})
