import type {SelectAgendaEvent} from '$lib/server/db/schema/livestreams'
import type {AgendaItem, ChapterTimestamp} from './LivestreamsRepoInterface'

export const reduceAgendaEvents = (
	agendaEvents: Pick<SelectAgendaEvent, 'createdAt' | 'payload'>[],
): {agenda: AgendaItem[]; timestamps: ChapterTimestamp[]} =>
	agendaEvents.reduce<{agenda: AgendaItem[]; timestamps: ChapterTimestamp[]}>(
		(acc, {createdAt, payload}, index) => {
			switch (payload.type) {
				case 'create':
					const label = ''
					acc.agenda.push({
						label,
						isDone: false,
					})
					if (!acc.timestamps.length) {
						acc.timestamps.push({timestamp: '00:00', label})
					}
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
					if (acc.timestamps[payload.data.index]) {
						acc.timestamps[payload.data.index].label = payload.data.label
					}

					break
				default:
					console.info('Unhandled event type:', payload)
					break
			}

			return acc
		},
		{agenda: [], timestamps: []},
	)
