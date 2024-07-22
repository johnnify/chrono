import {generateCodeVerifier, generateState} from 'arctic'
import {fail, superValidate} from 'sveltekit-superforms'
import {zod} from 'sveltekit-superforms/adapters'

import type {Actions, PageServerLoad} from './$types'
import {magicLoginSchema, socialLoginSchema} from './schema'
import {createGoogleProvider} from '$lib/server/db/auth/providers'
import {redirect} from '@sveltejs/kit'
import {dev} from '$app/environment'

export const load: PageServerLoad = async () => {
	return {
		socialLoginForm: await superValidate(zod(socialLoginSchema)),
		magicLoginForm: await superValidate(zod(magicLoginSchema)),
		meta: {
			title: 'Login',
			description:
				'Sign-up / log in, to record your puzzles, create your own, and see stats!',
		},
	}
}

export const actions: Actions = {
	async social({request, url, cookies}) {
		const form = await superValidate(request, zod(socialLoginSchema))
		if (!form.valid) {
			return fail(400, {form})
		}

		const provider = form.data.provider

		const state = generateState()
		const codeVerifier = generateCodeVerifier()

		let redirectUrl: URL
		switch (provider) {
			case 'google': {
				const google = createGoogleProvider(url.origin)
				redirectUrl = await google.createAuthorizationURL(state, codeVerifier, {
					scopes: ['profile', 'email'],
				})

				break
			}
		}

		cookies.set('oauth_state', state, {
			path: '/',
			secure: !dev,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax',
		})
		cookies.set('oauth_code_verifier', codeVerifier, {
			path: '/',
			secure: !dev,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax',
		})

		redirect(302, redirectUrl.toString())
	},
}
