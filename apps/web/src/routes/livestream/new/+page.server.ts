import {fail, superValidate} from 'sveltekit-superforms'
import {zod} from 'sveltekit-superforms/adapters'

import type {PageServerLoad} from './$types'
import {livestreamSchema} from './schema'
import {redirect} from '@sveltejs/kit'

export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(livestreamSchema)),
	meta: {
		title: 'Create new Livestream',
		description: 'Create a new livestream and start managing your agenda!',
	},
})

export const actions = {
	async default({request, locals}) {
		const form = await superValidate(request, zod(livestreamSchema))

		const userId = locals.user?.id
		if (!userId) {
			return fail(401, {form, message: 'Somehow, you are not logged in'})
		}

		if (!form.valid) {
			return fail(400, {form})
		}

		const {title} = form.data

		const id = await locals.livestreamsRepo.create({userId, title})

		redirect(307, `/livestream/${id}`)
	},
}
