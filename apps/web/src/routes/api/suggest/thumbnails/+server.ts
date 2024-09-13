import {error, json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'

export const POST: RequestHandler = async ({
	request,
	locals: {livestreamsRepo, aiResponseRepo},
}) => {
	const {livestreamId}: {livestreamId: string} = await request.json()

	const livestream = await livestreamsRepo.find({id: livestreamId})

	if (!livestream) {
		error(404, `livestream ${livestreamId} not found`)
	}

	const thumbnailUrls = await aiResponseRepo.suggestThumbnails(livestream)

	return json({thumbnailUrls})
}

export type SuggestThumbnailsResponse = {
	thumbnailUrls: string[]
}
