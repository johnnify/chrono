import {expect, it, describe} from 'vitest'
import * as filterAndMap from './filterAndMap'
import * as reduce from './reduce'
import * as sql from './sql'

const implementations = [
	{
		name: 'filter & map',
		getAllPublishedLivestreams: filterAndMap.getAllPublishedLivestreams,
	},
	{
		name: 'reduce',
		getAllPublishedLivestreams: reduce.getAllPublishedLivestreams,
	},
	{
		name: 'SQL',
		getAllPublishedLivestreams: sql.getAllPublishedLivestreams,
	},
]

implementations.forEach(({name, getAllPublishedLivestreams}) => {
	describe(name, () => {
		it('only fetches already published livestreams', async () => {
			const startTime = performance.now()
			const livestreams = await getAllPublishedLivestreams()
			const endTime = performance.now()

			expect(livestreams).toBeTruthy()
			expect(livestreams).toHaveLength(100)

			console.info(`🚀 ${name} took ${endTime - startTime}ms`)
		})

		it('aliases `published_at` to `publishedAt`', async () => {
			const livestreams = await getAllPublishedLivestreams()

			livestreams.forEach((livestream) => {
				expect(livestream.publishedAt).toBeDefined()
				expect(Object.hasOwn(livestream, 'published_at')).toBeFalsy()
			})
		})
	})
})
