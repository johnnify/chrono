import {client} from '$lib/server/db/db'
import type {DbLivestream, UILivestream} from './types'

export const getAllPublishedLivestreams = async () => {
	const {rows} = await client.execute(
		'SELECT id, title, published_at FROM livestreams',
	)

	return (rows as unknown as DbLivestream[]).reduce<UILivestream[]>(
		(acc, {id, title, published_at}) => {
			if (new Date(published_at * 1000) < new Date()) {
				acc.push({id, title, publishedAt: published_at})
			}
			return acc
		},
		[],
	)
}
