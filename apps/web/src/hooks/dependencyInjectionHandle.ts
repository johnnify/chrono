import type {Handle} from '@sveltejs/kit'

import {db} from '$lib/server/db/db'
import {openai} from '$lib/server/llm/openai'
import {LivestreamsDbRepo} from '$lib/repos/livestreams/LivestreamsDbRepo'
import {DbUsersRepo} from '$lib/repos/users/DbUsersRepo'
import {AiResponseDbRepo} from '$lib/repos/aiResponse/AiResponseDbRepo'

export const dependencyInjectionHandle: Handle = async ({event, resolve}) => {
	event.locals.usersRepo = new DbUsersRepo(db)
	event.locals.livestreamsRepo = new LivestreamsDbRepo(db)
	event.locals.aiResponseRepo = new AiResponseDbRepo({db, openai})

	return resolve(event)
}
