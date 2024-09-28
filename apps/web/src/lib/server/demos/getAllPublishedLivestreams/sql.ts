import {client} from '$lib/server/db/db'
import type {UILivestream} from './types'

export const getAllPublishedLivestreams = async () => {
	const {rows} = await client.execute(
		'SELECT id, title, published_at AS publishedAt FROM livestreams WHERE published_at < unixepoch()',
	)

	return rows as unknown as UILivestream[]
}
