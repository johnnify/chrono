import type {Handle} from '@sveltejs/kit'
import PocketBase from 'pocketbase'
import type {TypedPocketBase} from '$lib/generated/pocketbase-types'
import {PB_API_URL} from '$env/static/private'
import {LivestreamsPocketbaseRepo} from '$lib/repos/livestreams/LivestreamsPocketbaseRepo'

export const dependencyInjectionHandle: Handle = async ({event, resolve}) => {
	const pb = new PocketBase(PB_API_URL) as TypedPocketBase
	event.locals.livestreamsRepo = new LivestreamsPocketbaseRepo(pb)
	return resolve(event)
}
