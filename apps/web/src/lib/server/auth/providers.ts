import {Google, decodeIdToken} from 'arctic'
import type {AuthProviderId} from '@repo/db'

import {PUBLIC_GOOGLE_CLIENT_ID} from '$env/static/public'
import {GOOGLE_CLIENT_SECRET} from '$env/static/private'

export const createGoogleProvider = (rootUrl: string) =>
	new Google(
		PUBLIC_GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		`${rootUrl}/auth/callback/google`,
	)

export const validateAuthorizationCode = async ({
	providerId,
	code,
	codeVerifier,
	rootUrl,
}: {
	providerId: AuthProviderId
	code: string
	codeVerifier: string
	rootUrl: string
}) => {
	switch (providerId) {
		case 'google': {
			const google = createGoogleProvider(rootUrl)
			const tokens = await google.validateAuthorizationCode(code, codeVerifier)

			return {idToken: tokens.idToken()}
		}
		default:
			throw new Error(`Unknown provider: ${String(providerId)}`)
	}
}

export type GoogleIdTokenUser = {
	// Expiration time on or after which the ID token must not be accepted. Represented in Unix epoch time (integer seconds).
	exp: number
	// An identifier for the user, unique among all Google Accounts and never reused. A Google Account can have multiple email addresses at different points in time, but the sub value is never changed. Use sub within your application as the unique-identifier key for the user. Maximum length of 255 case-sensitive ASCII characters.
	sub: string
	// The user's email address. Provided only if you included the email scope in your request. The value of this claim may not be unique to this account and could change over time, therefore you shouldn't use this value as the primary identifier to link to your user record. You also can't rely on the domain of the email claim to identify users of Google Workspace or Cloud organizations; use the hd claim instead.
	email: string
	// True if the user's email address has been verified; otherwise false.
	email_verified: boolean
	// The user's full name, in a displayable form. Might be provided when:
	// - The request scope included the string "profile"
	// - The ID token is returned from a token refresh
	name: string
	// The URL of the user's profile picture. Might be provided when:
	// - The request scope included the string "profile"
	// - The ID token is returned from a token refresh
	picture: string
}

export const parseProviderUserFromToken = (
	providerId: AuthProviderId,
	idToken: string,
) => {
	switch (providerId) {
		case 'google': {
			const tokenUser = decodeIdToken(idToken) as GoogleIdTokenUser

			return {
				id: tokenUser.sub,
				email: tokenUser.email_verified ? tokenUser.email : null,
				name: tokenUser.name,
				avatarUrl: tokenUser.picture,
			}
		}
		default:
			throw new Error(`Unknown provider: ${String(providerId)}`)
	}
}
