import type {AgendaEventPayload} from '$lib/server/db/schema/livestreams'
import type {AgendaItem} from './LivestreamsRepoInterface'

export const reduceAgendaEvents = (
	agendaEvents: AgendaEventPayload[],
): {agenda: AgendaItem[]} =>
	agendaEvents.reduce<{agenda: AgendaItem[]}>(
		(acc, payload, index) => {
			switch (payload.type) {
				case 'create':
					acc.agenda.push({
						label: '',
						isDone: false,
					})
					break
				case 'toggle':
					acc.agenda[payload.data.index].isDone =
						!acc.agenda[payload.data.index].isDone
					break
				case 'delete':
					acc.agenda.splice(payload.data.index, 1)
					break
				case 'label':
					acc.agenda[payload.data.index].label = payload.data.label
					break
				default:
					console.info('Unhandled event type:', payload)
					break
			}

			return acc
		},
		{agenda: []},
	)
