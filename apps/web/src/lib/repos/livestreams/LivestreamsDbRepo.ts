import type {DrizzleDb} from '$lib/server/db/db'
import {
	agendaEvents,
	livestreams,
	type AgendaEventPayload,
} from '$lib/server/db/schema/livestreams'
import {desc, eq} from 'drizzle-orm'
import type {LivestreamsRepoInterface} from './LivestreamsRepoInterface'
import {reduceAgendaEventsToAgenda} from './reduceAgendaEventsToAgenda'

export class LivestreamsDbRepo implements LivestreamsRepoInterface {
	#db: DrizzleDb

	constructor(db: DrizzleDb) {
		this.#db = db
	}

	list = async () => {
		const dbLivestreams = await this.#db
			.select()
			.from(livestreams)
			.orderBy(desc(livestreams.createdAt))

		return {livestreams: dbLivestreams}
	}

	find = async (id: string) => {
		const results = await this.#db
			.select({
				id: livestreams.id,
				title: livestreams.title,
				userId: livestreams.userId,
				createdAt: livestreams.createdAt,
				agendaEvent: agendaEvents.payload,
			})
			.from(livestreams)
			.where(eq(livestreams.id, id))
			.leftJoin(agendaEvents, eq(livestreams.id, agendaEvents.livestreamId))
			.orderBy(agendaEvents.createdAt)

		if (!results.length) return null

		const dbAgendaEvents = results.reduce<AgendaEventPayload[]>(
			(acc, {agendaEvent}) => {
				if (agendaEvent) {
					acc.push(agendaEvent)
				}
				return acc
			},
			[],
		)

		const livestream = {
			id: results[0].id,
			title: results[0].title,
			userId: results[0].userId,
			createdAt: results[0].createdAt,
			agenda: reduceAgendaEventsToAgenda(dbAgendaEvents),
		}

		return livestream
	}

	create = async ({title, userId}: {title: string; userId: string}) => {
		const [{id}] = await this.#db
			.insert(livestreams)
			.values({title, userId})
			.returning({id: livestreams.id})

		return id
	}

	createAgendaItem = async (livestreamId: string) => {
		await this.#db.insert(agendaEvents).values({
			livestreamId,
			payload: {type: 'create'},
		})
	}
	toggleAgendaItem = async (livestreamId: string, index: number) => {
		await this.#db.insert(agendaEvents).values({
			livestreamId,
			payload: {type: 'toggle', data: {index}},
		})
	}
	deleteAgendaItem = async (livestreamId: string, index: number) => {
		await this.#db.insert(agendaEvents).values({
			livestreamId,
			payload: {type: 'delete', data: {index}},
		})
	}
	labelAgendaItem = async (
		livestreamId: string,
		{index, label}: {index: number; label: string},
	) => {
		await this.#db.insert(agendaEvents).values({
			livestreamId,
			payload: {type: 'label', data: {index, label}},
		})
	}
}
