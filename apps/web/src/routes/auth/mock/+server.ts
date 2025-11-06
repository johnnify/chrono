import {error} from '@sveltejs/kit'

import type {RequestHandler} from './$types'
import {generateSessionToken} from '$lib/server/auth'
import {setSessionTokenCookie} from '$lib/server/auth'
import {MOCK_AUTH_SECRET} from '$env/static/private'

const mockUser = {
	id: 'c2b3f3d4-13e2-4262-ae1c-acaf4dfcaf60',
	name: 'Mock, Makis (Playwright)',
	email: 'playwright@example.com',
	isEmailVerified: true,
	isAdmin: true,
}

export const POST: RequestHandler = async ({
	request,
	cookies,
	locals: {usersRepo},
}) => {
	if (!MOCK_AUTH_SECRET || MOCK_AUTH_SECRET.length < 32) {
		error(400, 'Mock auth not enabled')
	}

	const authorization = request.headers.get('Authorization')

	if (!authorization || !authorization.startsWith('Basic ')) {
		error(400, 'Bad request')
	}

	const base64Credentials = authorization.split(' ')[1]
	const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
	const expectedCredentials = `mock-auth:${MOCK_AUTH_SECRET}`

	if (credentials !== expectedCredentials) {
		error(400, 'Bad request')
	}

	await usersRepo.upsertUser(mockUser)

	const sessionToken = generateSessionToken()
	const session = await usersRepo.createSession(sessionToken, mockUser.id)

	setSessionTokenCookie(cookies, sessionToken, session.expiresAt)

	return new Response('logged in', {status: 200})
}
