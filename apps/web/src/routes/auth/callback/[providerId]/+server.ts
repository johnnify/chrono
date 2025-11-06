import {ArcticFetchError, OAuth2RequestError} from 'arctic'
import {error, redirect} from '@sveltejs/kit'

import type {RequestHandler} from './$types'
import {
	parseProviderUserFromToken,
	validateAuthorizationCode,
} from '$lib/server/auth/providers'
import {generateSessionToken, setSessionTokenCookie} from '$lib/server/auth'
import {AuthProvidersEnum} from '$lib/schemas'

export const GET: RequestHandler = async ({
	url,
	cookies,
	params,
	locals: {usersRepo},
}) => {
	const validation = AuthProvidersEnum.safeParse(params.providerId)

	if (!validation.success) {
		error(400, `${params.providerId} is not an available login provider`)
	}

	const providerId = validation.data

	const code = url.searchParams.get('code')
	const state = url.searchParams.get('state')
	const storedState = cookies.get('oauth_state') ?? null
	const storedCodeVerifier = cookies.get('oauth_code_verifier') ?? null

	if (
		!code ||
		!state ||
		!storedState ||
		!storedCodeVerifier ||
		state !== storedState
	) {
		error(400, 'bad parameters, could not complete login flow')
	}

	try {
		const {idToken} = await validateAuthorizationCode({
			providerId,
			rootUrl: url.origin,
			code,
			codeVerifier: storedCodeVerifier,
		})

		const tokenUser = parseProviderUserFromToken(providerId, idToken)

		// Create or update user linked to OAuth provider
		const userId = await usersRepo.upsertOAuthUser({
			provider: providerId,
			providerUserId: tokenUser.id,
			user: {
				name: tokenUser.name,
				email: tokenUser.email,
				avatarUrl: tokenUser.avatarUrl,
			},
		})

		const sessionToken = generateSessionToken()
		const session = await usersRepo.createSession(sessionToken, userId)

		setSessionTokenCookie(cookies, sessionToken, session.expiresAt)
	} catch (err) {
		if (err instanceof OAuth2RequestError) {
			console.error('Invalid authorization code, credentials, or redirect URI')
			const code = err.code
			console.error('bad OAuth2Request', code)

			error(
				400,
				'Could not complete login flow. Please try again and contact the engineering team if the problem persists.',
			)
		}
		if (err instanceof ArcticFetchError) {
			const cause = err.cause
			console.error('Arctic error trying to use Fetch API', cause)
			error(
				500,
				`Could not complete server-side validation for ${providerId} sign-in`,
			)
		}

		console.error(err)
		error(500, `Unexpected error validating user for ${providerId}`)
	}

	redirect(302, '/')
}
