import type {Handle} from '@sveltejs/kit'
import {createDrizzleDb} from '@repo/db'

import {DbUsersRepo} from '$lib/repos/users/DbUsersRepo'
import {Rng} from '$lib/Rng'

export const dependencyInjectionHandle: Handle = async ({event, resolve}) => {
	if (!event.platform?.env) {
		throw new Error('Cloudflare Platform not available')
	}
	if (!event.platform.env.DB) {
		throw new Error('Cloudflare D1 DB not available')
	}

	const db = createDrizzleDb(event.platform.env.DB)
	event.locals.usersRepo = new DbUsersRepo(db)

	const seed = event.url.searchParams.get('seed') ?? Date.now().toString()
	event.locals.rng = new Rng(seed)

	return resolve(event)
}
