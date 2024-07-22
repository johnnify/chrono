import {error, fail, redirect} from '@sveltejs/kit'
import {message, superValidate} from 'sveltekit-superforms'
import {zod} from 'sveltekit-superforms/adapters'

import type {Actions, PageServerLoad} from './$types'
import {lucia} from '$lib/server/db/auth/lucia'
import {formSchema} from './schema'

export const load: PageServerLoad = async ({locals}) => {
	if (!locals.user) {
		error(401, 'Somehow, you are not logged in')
	}

	const form = await superValidate({name: locals.user.name}, zod(formSchema))

	return {
		form,
		user: locals.user,
		meta: {
			title: 'Profile',
			description: 'See & manage your profile',
		},
	}
}

export const actions: Actions = {
	async update({request, locals}) {
		const form = await superValidate(request, zod(formSchema))

		const userId = locals.user?.id
		if (!userId) {
			return fail(401, {form, message: 'Somehow, you are not logged in'})
		}

		if (!form.valid) {
			return fail(400, {form})
		}

		await locals.usersRepo.updateUserProfile({
			id: userId,
			name: form.data.name,
		})

		return message(form, {
			type: 'success',
			text: `Public details updated${form.data.name ? `, ${form.data.name}` : ''}!`,
		})
	},
	async logout({cookies, locals}) {
		if (!locals.session) {
			return fail(401)
		}
		await lucia.invalidateSession(locals.session.id)
		const sessionCookie = lucia.createBlankSessionCookie()
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes,
		})

		redirect(302, '/')
	},
}
