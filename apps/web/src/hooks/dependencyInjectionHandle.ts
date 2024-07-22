import type {Handle} from '@sveltejs/kit'

import {db} from '$lib/server/db/db'
import {LivestreamsDbRepo} from '$lib/repos/livestreams/LivestreamsDbRepo'
import {DbUsersRepo} from '$lib/repos/users/DbUsersRepo'

export const dependencyInjectionHandle: Handle = async ({event, resolve}) => {
	event.locals.usersRepo = new DbUsersRepo(db)
	event.locals.livestreamsRepo = new LivestreamsDbRepo(db)
	return resolve(event)
}
