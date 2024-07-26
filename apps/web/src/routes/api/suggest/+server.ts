import {error, json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'

export const POST: RequestHandler = async ({
	request,
	locals: {livestreamsRepo, aiResponseRepo},
}) => {
	const {livestreamId}: {livestreamId: string} = await request.json()

	const livestream = await livestreamsRepo.find(livestreamId)

	if (!livestream) {
		error(404, `livestream ${livestreamId} not found`)
	}

	const response = await aiResponseRepo.suggest(livestream)

	return json(response)
}
