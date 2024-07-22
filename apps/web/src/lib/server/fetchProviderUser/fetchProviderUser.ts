import type {ProviderId} from '$lib/schemas'
import {fetchGoogleUser} from './fetchGoogleUser'

export type SocialLoginUser = {
	id: string
	name: string
	email: string
	avatarUrl: string
	emailVerified: boolean
}

export const fetchProviderUser = async (
	providerId: ProviderId,
	accessToken: string,
): Promise<SocialLoginUser> => {
	switch (providerId) {
		case 'google': {
			const googleUser = await fetchGoogleUser(accessToken)
			return {
				id: googleUser.sub,
				name: googleUser.name,
				email: googleUser.email,
				avatarUrl: googleUser.picture,
				emailVerified: googleUser.email_verified,
			}
		}
	}
}
