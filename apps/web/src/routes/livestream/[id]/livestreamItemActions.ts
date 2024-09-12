import {fail, redirect} from '@sveltejs/kit'
import {message, superValidate} from 'sveltekit-superforms'
import {zod} from 'sveltekit-superforms/adapters'
import type {Actions} from './$types'
import {deleteAgendaItemSchema, updateAgendaItemSchema} from './schema'

export const livestreamItemActions: Actions = {
	async createAgendaItem({params: {id}, locals}) {
		const userId = locals.user?.id
		if (!userId) {
			redirect(307, '/login')
		}

		await locals.livestreamsRepo.createAgendaItem(id, userId)
	},
	async updateAgendaItem({request, locals}) {
		const userId = locals.user?.id
		if (!userId) {
			redirect(307, '/login')
		}

		const form = await superValidate(request, zod(updateAgendaItemSchema))

		if (!form.valid) {
			return fail(400, {form})
		}

		const {id, label, status} = form.data

		await locals.livestreamsRepo.updateAgendaItem(id, {label, status}, userId)

		return message(form, {
			type: 'success',
			text: 'Agenda item updated!',
		})
	},
	async deleteAgendaItem({request, locals}) {
		const userId = locals.user?.id
		if (!userId) {
			redirect(307, '/login')
		}

		const form = await superValidate(request, zod(deleteAgendaItemSchema))

		if (!form.valid) {
			return fail(400, {form})
		}

		const {id} = form.data

		await locals.livestreamsRepo.deleteAgendaItem(id, userId)
	},
}
