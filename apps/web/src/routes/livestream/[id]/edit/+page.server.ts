import {error, fail, redirect} from '@sveltejs/kit'
import {message, superValidate} from 'sveltekit-superforms'
import {zod} from 'sveltekit-superforms/adapters'
import type {PageServerLoad} from './$types'

import {livestreamSchema} from '../../schema'
import {updateAgendaItemSchema} from '../schema'
import {livestreamItemActions} from '../livestreamItemActions'

export const load: PageServerLoad = async ({locals, params: {id}}) => {
	const userId = locals.user?.id
	if (!userId) {
		redirect(307, '/login')
	}
	const livestream = await locals.livestreamsRepo.find({id, userId})

	if (!livestream) {
		error(404, `Livestream ${id} not found`)
	}

	return {
		livestream,
		editForm: await superValidate(
			{
				title: livestream.title,
				description: livestream.description,
			},
			zod(livestreamSchema),
		),
		updateAgendaItemForms: await Promise.all(
			livestream.agenda.map((item) =>
				superValidate(item, zod(updateAgendaItemSchema), {
					id: item.id,
				}),
			),
		),
		meta: {
			title: `Edit livestream ${livestream.title}`,
			description: 'Modify this selected livestream.',
		},
	}
}

export const actions = {
	async update({request, params: {id}, locals}) {
		const form = await superValidate(request, zod(livestreamSchema))

		const userId = locals.user?.id
		if (!userId) {
			return fail(401, {form, message: 'Somehow, you are not logged in'})
		}

		if (!form.valid) {
			return fail(400, {form})
		}

		const {title, description} = form.data

		await locals.livestreamsRepo.update({id, userId, title, description})

		return message(form, {
			type: 'success',
			text: 'Livestream updated!',
		})
	},
	...livestreamItemActions,
}
