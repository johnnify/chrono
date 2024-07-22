import {Google} from 'arctic'
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from '$env/static/private'
import type {ProviderId} from '$lib/schemas'

export const createGoogleProvider = (rootUrl: string) =>
	new Google(
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		`${rootUrl}/auth/callback/google`,
	)

export const validateAuthorizationCode = async ({
	providerId,
	code,
	codeVerifier,
	rootUrl,
}: {
	providerId: ProviderId
	code: string
	codeVerifier: string
	rootUrl: string
}): Promise<string> => {
	switch (providerId) {
		case 'google': {
			const google = createGoogleProvider(rootUrl)
			const tokens = await google.validateAuthorizationCode(code, codeVerifier)
			return tokens.accessToken
		}
		default:
			throw new Error(`Unknown provider: ${providerId}`)
	}
}
