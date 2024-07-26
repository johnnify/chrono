import {describe, it, expect} from 'vitest'
import {reduceAgendaEvents} from './reduceAgendaEvents'
import type {
	AgendaEventPayload,
	SelectAgendaEvent,
} from '$lib/server/db/schema/livestreams'

const agendaEventFactory = (
	count: number,
	{payload, ...partial}: {createdAt?: Date; payload: AgendaEventPayload} = {
		payload: {type: 'create'},
	},
): Pick<SelectAgendaEvent, 'createdAt' | 'payload'>[] =>
	[...Array(count).keys()].map((_, index) => {
		const createdAt = new Date(Date.now() - (count - index) * 1_000)

		return {
			createdAt,
			...partial,
			payload,
		}
	})

describe('derived agenda', () => {
	it('returns an empty agenda when no events', () => {
		const {agenda} = reduceAgendaEvents([])
		expect(agenda).toEqual([])
	})

	it('returns as many agenda items, as there are create events', () => {
		const eventsA = agendaEventFactory(1, {
			payload: {type: 'create'},
		})

		const {agenda: agendaA} = reduceAgendaEvents(eventsA)
		expect(agendaA).toHaveLength(1)

		const eventsB = agendaEventFactory(5, {
			payload: {type: 'create'},
		})
		const {agenda: agendaB} = reduceAgendaEvents(eventsB)
		expect(agendaB).toHaveLength(5)
	})

	it('checks or unchecks an agenda item that had a `toggle` event', () => {
		const eventsA: Pick<SelectAgendaEvent, 'createdAt' | 'payload'>[] = [
			...agendaEventFactory(1, {
				payload: {type: 'create'},
			}),
			{createdAt: new Date(), payload: {type: 'toggle', data: {index: 0}}},
		]
		const {agenda: agendaA} = reduceAgendaEvents(eventsA)
		expect(agendaA[0].isDone).toBe(true)

		const eventsB = agendaEventFactory(50, {
			payload: {type: 'create'},
		})
		const randomIndex = Math.floor(Math.random() * eventsB.length)
		eventsB.push({
			createdAt: new Date(),
			payload: {type: 'toggle', data: {index: randomIndex}},
		})

		const {agenda: agendaB} = reduceAgendaEvents(eventsB)
		expect(agendaB[randomIndex].isDone).toBe(true)

		// event for the same index toggles the item back
		const eventsC: Pick<SelectAgendaEvent, 'createdAt' | 'payload'>[] = [
			...eventsB,
			{
				createdAt: new Date(),
				payload: {type: 'toggle', data: {index: randomIndex}},
			},
		]
		const {agenda: agendaC} = reduceAgendaEvents(eventsC)
		expect(agendaC[randomIndex].isDone).toBe(false)
	})

	it('removes agenda items that have had a delete event', () => {
		const eventsA: Pick<SelectAgendaEvent, 'createdAt' | 'payload'>[] = [
			...agendaEventFactory(1, {
				payload: {type: 'create'},
			}),
			{createdAt: new Date(), payload: {type: 'delete', data: {index: 0}}},
		]
		const {agenda: agendaA} = reduceAgendaEvents(eventsA)
		expect(agendaA).toHaveLength(0)

		const eventsB = agendaEventFactory(50, {
			payload: {type: 'create'},
		})
		const randomIndex = Math.floor(Math.random() * eventsB.length)
		// toggle just one item
		eventsB.push({
			createdAt: new Date(Date.now() - 500),
			payload: {type: 'toggle', data: {index: randomIndex}},
		})
		// delete it!
		eventsB.push({
			createdAt: new Date(),
			payload: {type: 'toggle', data: {index: randomIndex}},
		})

		const {agenda: agendaB} = reduceAgendaEvents(eventsB)
		// All the remaining items should NOT be done!
		agendaB.forEach((item) => {
			expect(item.isDone).toBe(false)
		})
	})

	it('creates events without labels', () => {
		const events = agendaEventFactory(5, {
			payload: {type: 'create'},
		})
		const {agenda: agenda} = reduceAgendaEvents(events)
		agenda.forEach((item) => {
			expect(item.label).toBe('')
		})
	})

	it('changes the label of the specified agenda item', () => {
		const eventsA: Pick<SelectAgendaEvent, 'createdAt' | 'payload'>[] = [
			...agendaEventFactory(1, {
				payload: {type: 'create'},
			}),
			{
				createdAt: new Date(),
				payload: {type: 'label', data: {index: 0, label: 'I was updated!'}},
			},
		]
		const {agenda: agendaA} = reduceAgendaEvents(eventsA)
		expect(agendaA[0].label).toBe('I was updated!')

		const eventsB = agendaEventFactory(50, {
			payload: {type: 'create'},
		})
		const randomIndex = Math.floor(Math.random() * eventsB.length)
		// toggle just one item
		eventsB.push({
			createdAt: new Date(Date.now() - 500),
			payload: {
				type: 'label',
				data: {index: randomIndex, label: 'I was the only one updated!'},
			},
		})

		const {agenda: agendaB} = reduceAgendaEvents(eventsB)
		expect(agendaB[randomIndex].label).toBe('I was the only one updated!')

		// can relabel an item
		const eventsC: Pick<SelectAgendaEvent, 'createdAt' | 'payload'>[] = [
			...eventsB,
			{
				createdAt: new Date(),
				payload: {
					type: 'label',
					data: {index: randomIndex, label: 'LIKE 💜 SUBSCRIBE'},
				},
			},
		]
		const {agenda: agendaC} = reduceAgendaEvents(eventsC)
		expect(agendaC[randomIndex].label).toBe('LIKE 💜 SUBSCRIBE')
	})
})

describe('timestamps', () => {
	it('returns an empty array when there are no events', () => {
		const {timestamps} = reduceAgendaEvents([])
		expect(timestamps).toEqual([])
	})

	it('always starts at 00:00', () => {
		const events = agendaEventFactory(5, {
			payload: {type: 'create'},
		})
		const {timestamps} = reduceAgendaEvents(events)
		expect(timestamps[0].timestamp).toBe('00:00')
	})

	it('labels as the first agenda item', () => {
		const events: Pick<SelectAgendaEvent, 'createdAt' | 'payload'>[] = [
			...agendaEventFactory(1, {
				payload: {type: 'create'},
			}),
			{
				createdAt: new Date(),
				payload: {
					type: 'label',
					data: {index: 0, label: 'This should be the first title!'},
				},
			},
		]

		const {timestamps} = reduceAgendaEvents(events)
		expect(timestamps[0].label).toBe('This should be the first title!')
	})
})
