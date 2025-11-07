import type {Handle} from '@sveltejs/kit'
import {createDrizzleDb} from '@repo/db'

import {CloudflareUsersRepo} from '$lib/repos/users/CloudflareUsersRepo'
import {Rng} from '$lib/Rng'

export const dependencyInjectionHandle: Handle = async ({event, resolve}) => {
	if (!event.platform?.env) {
		throw new Error('Cloudflare Platform not available')
	}
	if (!event.platform.env.DB) {
		throw new Error('Cloudflare D1 DB not available')
	}
	if (!event.platform.env.SESSIONS_KV) {
		throw new Error('Cloudflare KV SESSIONS_KV not available')
	}

	const db = createDrizzleDb(event.platform.env.DB)
	event.locals.usersRepo = new CloudflareUsersRepo(
		db,
		event.platform.env.SESSIONS_KV,
	)

	const seed = event.url.searchParams.get('seed') ?? Date.now().toString()
	event.locals.rng = new Rng(seed)

	return resolve(event)
}
