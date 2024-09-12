import {error, redirect} from '@sveltejs/kit'
import {superValidate} from 'sveltekit-superforms'
import {zod} from 'sveltekit-superforms/adapters'
import type {Actions, PageServerLoad} from './$types'
import {updateAgendaItemSchema} from './schema'
import {livestreamItemActions} from './livestreamItemActions'

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
		updateAgendaItemForms: await Promise.all(
			livestream.agenda.map((item) =>
				superValidate(item, zod(updateAgendaItemSchema), {
					id: item.id,
				}),
			),
		),
		meta: {
			title: livestream.title,
			description: 'Check out and modify the agenda for this livestream!',
		},
	}
}

export const actions: Actions = {
	...livestreamItemActions,
}
