import {OAuth2RequestError} from 'arctic'
import {error, redirect} from '@sveltejs/kit'

import type {RequestHandler} from './$types'
import {validateAuthorizationCode} from '$lib/server/db/auth/providers'
import {lucia} from '$lib/server/db/auth/lucia'
import {fetchProviderUser} from '$lib/server/fetchProviderUser/fetchProviderUser'
import {ProvidersEnum} from '$lib/schemas'

export const GET: RequestHandler = async ({
	url,
	cookies,
	params,
	locals: {usersRepo},
}) => {
	const validation = ProvidersEnum.safeParse(params.providerId)

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
		const accessToken = await validateAuthorizationCode({
			providerId,
			rootUrl: url.origin,
			code,
			codeVerifier: storedCodeVerifier,
		})
		const providerUser = await fetchProviderUser(providerId, accessToken)

		const existingUserId = await usersRepo.findByProvider({
			providerId,
			providerUserId: providerUser.id,
		})

		if (existingUserId) {
			const session = await lucia.createSession(existingUserId, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes,
			})
		} else {
			const existingUserId = await usersRepo.findByEmail(providerUser.email)

			let userId: string
			if (existingUserId) {
				userId = existingUserId
				if (!providerUser.emailVerified) {
					throw Error(`email not verified with ${providerId}`)
				}

				await usersRepo.addProviderToUser(userId, {
					providerId,
					providerUserId: providerUser.id,
				})
			} else {
				userId = await usersRepo.createUser(
					{
						email: providerUser.email,
						name: providerUser.name,
						avatarUrl: providerUser.avatarUrl,
						emailVerified: providerUser.emailVerified,
					},
					{
						providerId,
						providerUserId: providerUser.id,
					},
				)
			}

			const session = await lucia.createSession(userId, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes,
			})
		}
	} catch (err) {
		if (err instanceof OAuth2RequestError) {
			error(400, 'bad OAuth2Request, could not complete login flow')
		}
		if (err instanceof Error && err.message.includes('email not verified')) {
			error(400, err.message)
		}

		console.error(err)
		error(500, 'Unexpected error creating or validating user')
	}

	redirect(302, '/livestreams')
}
