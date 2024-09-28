import {client} from '$lib/server/db/db'

export const getAllPublishedLivestreams = async () => {
	const {rows} = await client.execute(
		'SELECT id, title, created_at, published_at FROM livestreams',
	)

	return rows
		.filter(
			({published_at}) =>
				published_at && new Date((published_at as number) * 1000) < new Date(),
		)
		.map(({published_at, ...restOfRow}) => ({
			...restOfRow,
			publishedAt: published_at,
		}))
}
