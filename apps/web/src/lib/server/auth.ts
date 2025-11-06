import type {Cookies} from '@sveltejs/kit'
import {encodeBase32LowerCase} from '@oslojs/encoding'

import {dev} from '$app/environment'
import {MOCK_AUTH_SECRET} from '$env/static/private'

export const sessionCookieName = 'auth-session'

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(20))
	const token = encodeBase32LowerCase(bytes)
	return token
}

export function setSessionTokenCookie(
	cookies: Cookies,
	token: string,
	expiresAt: Date,
) {
	cookies.set(sessionCookieName, token, {
		path: '/',
		expires: expiresAt,
		secure: !dev && (!MOCK_AUTH_SECRET || MOCK_AUTH_SECRET.length < 32),
		httpOnly: true,
		sameSite: 'lax',
	})
}

export function deleteSessionTokenCookie(cookies: Cookies) {
	cookies.delete(sessionCookieName, {
		path: '/',
	})
}
