import {describe, it, expect} from 'vitest'
import {reduceAgendaEvents} from './reduceAgendaEvents'
import type {AgendaEventPayload} from '$lib/server/db/schema/livestreams'

describe('derived agenda', () => {
	it('returns an empty agenda when no events', () => {
		const {agenda} = reduceAgendaEvents([])
		expect(agenda).toEqual([])
	})

	it('returns as many agenda items, as there are create events', () => {
		const eventsA: AgendaEventPayload[] = [{type: 'create'}]
		const {agenda: agendaA} = reduceAgendaEvents(eventsA)
		expect(agendaA).toHaveLength(1)

		const eventsB: AgendaEventPayload[] = [...Array(5).keys()].map(() => ({
			type: 'create',
		}))
		const {agenda: agendaB} = reduceAgendaEvents(eventsB)
		expect(agendaB).toHaveLength(5)
	})

	it('checks or unchecks an agenda item that had a `toggle` event', () => {
		const eventsA: AgendaEventPayload[] = [
			{type: 'create'},
			{type: 'toggle', data: {index: 0}},
		]
		const {agenda: agendaA} = reduceAgendaEvents(eventsA)
		expect(agendaA[0].isDone).toBe(true)

		const eventsB: AgendaEventPayload[] = [...Array(50).keys()].map(() => ({
			type: 'create',
		}))
		const randomIndex = Math.floor(Math.random() * eventsB.length)
		eventsB.push({type: 'toggle', data: {index: randomIndex}})

		const {agenda: agendaB} = reduceAgendaEvents(eventsB)
		expect(agendaB[randomIndex].isDone).toBe(true)

		// event for the same index toggles the item back
		const eventsC: AgendaEventPayload[] = [
			...eventsB,
			{type: 'toggle', data: {index: randomIndex}},
		]
		const {agenda: agendaC} = reduceAgendaEvents(eventsC)
		expect(agendaC[randomIndex].isDone).toBe(false)
	})

	it('removes agenda items that have had a delete event', () => {
		const eventsA: AgendaEventPayload[] = [
			{type: 'create'},
			{type: 'delete', data: {index: 0}},
		]
		const {agenda: agendaA} = reduceAgendaEvents(eventsA)
		expect(agendaA).toHaveLength(0)

		const eventsB: AgendaEventPayload[] = [...Array(50).keys()].map(() => ({
			type: 'create',
		}))
		const randomIndex = Math.floor(Math.random() * eventsB.length)
		// toggle just one item
		eventsB.push({type: 'toggle', data: {index: randomIndex}})
		// delete it!
		eventsB.push({type: 'delete', data: {index: randomIndex}})

		const {agenda: agendaB} = reduceAgendaEvents(eventsB)
		// All the remaining items should NOT be done!
		agendaB.forEach((item) => {
			expect(item.isDone).toBe(false)
		})
	})

	it('creates events without labels', () => {
		const events: AgendaEventPayload[] = [...Array(5).keys()].map(() => ({
			type: 'create',
		}))
		const {agenda: agenda} = reduceAgendaEvents(events)
		agenda.forEach((item) => {
			expect(item.label).toBe('')
		})
	})

	it('changes the label of the specified agenda item', () => {
		const eventsA: AgendaEventPayload[] = [
			{type: 'create'},
			{type: 'label', data: {index: 0, label: 'I was updated!'}},
		]
		const {agenda: agendaA} = reduceAgendaEvents(eventsA)
		expect(agendaA[0].label).toBe('I was updated!')

		const eventsB: AgendaEventPayload[] = [...Array(50).keys()].map(() => ({
			type: 'create',
		}))
		const randomIndex = Math.floor(Math.random() * eventsB.length)
		eventsB.push({
			type: 'label',
			data: {index: randomIndex, label: 'I was the only one updated!'},
		})

		const {agenda: agendaB} = reduceAgendaEvents(eventsB)
		expect(agendaB[randomIndex].label).toBe('I was the only one updated!')

		// can relabel an item
		const eventsC: AgendaEventPayload[] = [
			...eventsB,
			{type: 'label', data: {index: randomIndex, label: 'LIKE 💜 SUBSCRIBE'}},
		]
		const {agenda: agendaC} = reduceAgendaEvents(eventsC)
		expect(agendaC[randomIndex].label).toBe('LIKE 💜 SUBSCRIBE')
	})
})
