import {type Handle} from '@sveltejs/kit'

import {
	setSessionTokenCookie,
	deleteSessionTokenCookie,
	sessionCookieName,
} from '$lib/server/auth'

export const authHandle: Handle = async ({event, resolve}) => {
	const sessionToken = event.cookies.get(sessionCookieName)
	if (!sessionToken) {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	const {session, user} =
		await event.locals.usersRepo.validateSessionToken(sessionToken)
	if (session) {
		setSessionTokenCookie(event.cookies, sessionToken, session.expiresAt)
	} else {
		console.info(`invalid session token ${sessionToken}`)
		deleteSessionTokenCookie(event.cookies)
	}

	event.locals.user = user
	event.locals.session = session

	return resolve(event)
}
