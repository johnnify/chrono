import type {InsertLivestream} from '$lib/server/db/schema/livestreams'
import {faker} from '@faker-js/faker'

export const generateLivestreamPartial = ({
	userId,
	...partial
}: Partial<InsertLivestream> & {userId: string}): InsertLivestream => ({
	userId,
	title: faker.commerce.productName(),
	description: faker.commerce.productDescription(),
	...partial,
})

export const generateLivestreamPartials = (
	count: number,
	partial: Partial<InsertLivestream> & {userId: string},
) => {
	// Only 10% of streams should be in the future
	const futureLivestreamsCount = Math.floor(0.1 * count)
	return Array.from({length: count}, (_, index) =>
		generateLivestreamPartial({
			publishedAt:
				index < futureLivestreamsCount
					? faker.date.recent({days: 365})
					: faker.date.soon({days: 49}),

			...partial,
		}),
	)
}
