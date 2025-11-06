import {redirect} from '@sveltejs/kit'
import {generateCodeVerifier, generateState} from 'arctic'
import {z} from 'zod/v4'
import {form, getRequestEvent} from '$app/server'
import {dev} from '$app/environment'
import {createGoogleProvider} from '$lib/server/auth/providers'
import {
	generateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie,
} from '$lib/server/auth'
import {AuthProvidersEnum} from '$lib/schemas'

const oAuthLoginSchema = z.object({
	provider: AuthProvidersEnum,
})

const devOnlyMockUser = {
	id: '04ff471d-682c-4436-a6b7-fb1feaf8c45d',
	name: 'Developer, Dave (Mock login)',
	email: 'developer@example.com',
	isEmailVerified: true,
	isAdmin: true,
}

export const oAuthLogin = form(oAuthLoginSchema, async ({provider}) => {
	const {url, cookies} = getRequestEvent()

	const state = generateState()
	const codeVerifier = generateCodeVerifier()

	let redirectUrl: URL
	switch (provider) {
		case 'google': {
			const google = createGoogleProvider(url.origin)

			const scopes = ['openid', 'profile', 'email']
			redirectUrl = google.createAuthorizationURL(state, codeVerifier, scopes)

			break
		}
		default:
			throw new Error('Unhandled OAuth provider!')
	}

	const secure = !dev
	cookies.set('oauth_state', state, {
		secure,
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	})
	cookies.set('oauth_code_verifier', codeVerifier, {
		secure,
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	})

	redirect(302, redirectUrl.toString())
})

// Only use this locally, if the OAuth flow does not work
const mockLoginSchema = z.object({})

export const mockLogin = form(mockLoginSchema, async () => {
	const {cookies, locals} = getRequestEvent()

	if (!dev) {
		throw new Error(
			'Mock login is only available when running the dev server locally',
		)
	}

	await locals.usersRepo.upsertUser(devOnlyMockUser)

	const sessionToken = generateSessionToken()
	const session = await locals.usersRepo.createSession(
		sessionToken,
		devOnlyMockUser.id,
	)

	setSessionTokenCookie(cookies, sessionToken, session.expiresAt)

	redirect(302, '/')
})

const logoutSchema = z.object({})

export const logout = form(logoutSchema, async () => {
	const {cookies, locals} = getRequestEvent()

	if (!locals.session) {
		throw new Error('No active session')
	}

	await locals.usersRepo.invalidateSession(locals.session.id)
	deleteSessionTokenCookie(cookies)

	redirect(302, '/')
})
