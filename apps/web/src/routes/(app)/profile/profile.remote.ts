import {z} from 'zod'
import {form, getRequestEvent} from '$app/server'

const profileSchema = z.object({
	name: z.string(),
})

export const updateProfile = form(profileSchema, async ({name}) => {
	const {locals} = getRequestEvent()

	const userId = locals.user?.id
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
