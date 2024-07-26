import {error, fail, redirect} from '@sveltejs/kit'
import {message, superValidate} from 'sveltekit-superforms'
import {zod} from 'sveltekit-superforms/adapters'
import type {PageServerLoad} from './$types'
import {labelAgendaItemSchema} from '../schema'
import {livestreamSchema} from '../../schema'

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
		labelAgendaItemForms: await Promise.all(
			livestream.agenda.map(({label}, index) =>
				superValidate({index, label}, zod(labelAgendaItemSchema), {
					id: `${index}`,
				}),
			),
		),
		meta: {
			title: 'Livestreams',
			description: 'See all your latest livestreams!',
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
	async createAgendaItem({params: {id}, locals}) {
		const userId = locals.user?.id
		if (!userId) {
			redirect(307, '/login')
		}

		await locals.livestreamsRepo.createAgendaItem(id)
	},
	async toggleAgendaItem({request, params: {id}, locals}) {
		const userId = locals.user?.id
		if (!userId) {
			redirect(307, '/login')
		}

		const formData = await request.formData()
		const index = formData.get('index')
		if (typeof index !== 'string') {
			return fail(400, {message: 'Invalid index'})
		}

		await locals.livestreamsRepo.toggleAgendaItem(id, parseInt(index, 10))
	},
	async deleteAgendaItem({request, params: {id}, locals}) {
		const userId = locals.user?.id
		if (!userId) {
			redirect(307, '/login')
		}

		const formData = await request.formData()
		const index = formData.get('index')
		if (typeof index !== 'string') {
			return fail(400, {message: 'Invalid index'})
		}

		await locals.livestreamsRepo.deleteAgendaItem(id, parseInt(index, 10))
	},
	async labelAgendaItem({request, params: {id}, locals}) {
		const userId = locals.user?.id
		if (!userId) {
			redirect(307, '/login')
		}

		const form = await superValidate(request, zod(labelAgendaItemSchema))

		if (!form.valid) {
			return fail(400, {form})
		}

		const {index, label} = form.data

		await locals.livestreamsRepo.labelAgendaItem(id, {index, label})

		return message(form, {
			type: 'success',
			text: 'Agenda item updated!',
		})
	},
}
