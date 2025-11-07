import {error, redirect} from '@sveltejs/kit'
import {z} from 'zod'
import {deleteSessionTokenCookie} from '$lib/server/auth'
import {form, getRequestEvent, query} from '$app/server'

export const getProfile = query(async () => {
	const {
		cookies,
		locals: {session, usersRepo},
	} = getRequestEvent()

	if (!session) {
		error(401, 'Somehow, you are not logged in')
	}

	const user = await usersRepo.getUserById(session.userId)

	if (!user) {
		await usersRepo.invalidateSession(session.id)
		deleteSessionTokenCookie(cookies)

		redirect(302, '/')
	}

	return user
})

const profileSchema = z.object({
	name: z.string(),
})

export const updateProfile = form(profileSchema, async ({name}) => {
	const {locals} = getRequestEvent()

	const userId = locals.session?.userId
	if (!userId) {
		throw new Error('Somehow, you are not logged in')
	}

	await locals.usersRepo.updateUserProfile({
		id: userId,
		name,
	})

	return {
		success: true,
		message: `Public details updated${name ? `, ${name}` : ''}!`,
	}
})
