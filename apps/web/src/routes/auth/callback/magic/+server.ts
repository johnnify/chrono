import {error, redirect} from '@sveltejs/kit'

import {lucia} from '$lib/server/db/auth/lucia'
import type {RequestHandler} from './$types'

export const GET: RequestHandler = async ({
	url,
	cookies,
	locals: {usersRepo},
}) => {
	const code = url.searchParams.get('code')

	if (!code) {
		error(400, 'No verification code!')
	}

	const userId = await usersRepo.findByVerificationCode(code)

	if (!userId) {
		error(400, 'invalid code')
	}

	await lucia.invalidateUserSessions(userId)

	const session = await lucia.createSession(userId, {})
	const sessionCookie = lucia.createSessionCookie(session.id)
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '/',
		...sessionCookie.attributes,
	})

	redirect(302, '/livestreams')
}
