import {type Handle} from '@sveltejs/kit'

import {
	setSessionTokenCookie,
	deleteSessionTokenCookie,
	sessionCookieName,
} from '$lib/server/auth'

export const authHandle: Handle = async ({event, resolve}) => {
	const sessionToken = event.cookies.get(sessionCookieName)
	if (!sessionToken) {
		event.locals.session = null
		event.locals.userRole = 'guest'
		return resolve(event)
	}

	const session =
		await event.locals.usersRepo.validateSessionToken(sessionToken)
	if (session) {
		setSessionTokenCookie(event.cookies, sessionToken, session.expiresAt)
	} else {
		console.info(`invalid session token ${sessionToken}`)
		deleteSessionTokenCookie(event.cookies)
	}

	event.locals.session = session
	event.locals.userRole = session?.userRole || 'guest'

	return resolve(event)
}
