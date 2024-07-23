import type {AgendaEventPayload} from '$lib/server/db/schema/livestreams'
import type {AgendaItem} from './LivestreamsRepoInterface'

export const reduceAgendaEventsToAgenda = (
	agendaEvents: AgendaEventPayload[],
): AgendaItem[] =>
	agendaEvents.reduce<AgendaItem[]>((acc, payload, index) => {
		switch (payload.type) {
			case 'create':
				acc.push({
					label: '',
					isDone: false,
				})
				break
			case 'toggle':
				acc[payload.data.index].isDone = !acc[payload.data.index].isDone
				break
			case 'delete':
				acc.splice(payload.data.index, 1)
				break
			case 'label':
				acc[payload.data.index].label = payload.data.label
				break
			default:
				console.info('Unhandled event type:', payload)
				break
		}

		return acc
	}, [])
