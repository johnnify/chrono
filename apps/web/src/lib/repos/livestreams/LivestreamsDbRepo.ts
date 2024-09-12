import type {DrizzleDb} from '$lib/server/db/db'
import {agendaItems, livestreams} from '$lib/server/db/schema/livestreams'
import {and, desc, eq} from 'drizzle-orm'
import type {
	AgendaItem,
	LivestreamsRepoInterface,
} from './LivestreamsRepoInterface'

export class LivestreamsDbRepo implements LivestreamsRepoInterface {
	#db: DrizzleDb

	constructor(db: DrizzleDb) {
		this.#db = db
	}

	list = async (userId: string) => {
		const dbLivestreams = await this.#db
			.select()
			.from(livestreams)
			.where(eq(livestreams.userId, userId))
			.orderBy(desc(livestreams.createdAt))

		return {livestreams: dbLivestreams}
	}

	find = async ({id, userId}: {id: string; userId?: string}) => {
		const whereFilters = [eq(livestreams.id, id)]
		if (userId) {
			whereFilters.push(eq(livestreams.userId, userId))
		}
		const [livestream, ...agendaItemRows] = await this.#db
			.select({
				id: livestreams.id,
				title: livestreams.title,
				description: livestreams.description,
				userId: livestreams.userId,
				createdAt: livestreams.createdAt,
				agendaItem: {
					id: agendaItems.id,
					label: agendaItems.label,
					status: agendaItems.status,
					streamTimestamp: agendaItems.streamTimestamp,
				},
			})
			.from(livestreams)
			.where(and(...whereFilters))
			.leftJoin(agendaItems, eq(livestreams.id, agendaItems.livestreamId))
			.orderBy(agendaItems.order)

		if (!livestream) return null

		const dbAgendaItems = agendaItemRows.reduce<AgendaItem[]>(
			(acc, {agendaItem}) => {
				if (agendaItem) {
					acc.push(agendaItem)
				}
				return acc
			},
			[],
		)

		return {
			id: livestream.id,
			title: livestream.title,
			description: livestream.description,
			userId: livestream.userId,
			createdAt: livestream.createdAt,
			agenda: dbAgendaItems,
		}
	}

	create = async ({
		title,
		description,
		userId,
	}: {
		title: string
		description?: string | null
		userId: string
	}) => {
		const [{id}] = await this.#db
			.insert(livestreams)
			.values({title, description, userId})
			.returning({id: livestreams.id})

		return id
	}

	update = async ({
		id,
		title,
		description,
		userId,
	}: {
		id: string
		title: string
		description?: string | null
		userId: string
	}) => {
		await this.#db
			.update(livestreams)
			.set({title, description})
			.where(and(eq(livestreams.id, id), eq(livestreams.userId, userId)))
	}

	createAgendaItem = async (livestreamId: string, userId: string) => {
		const [livestream] = await this.#db
			.select({id: livestreams.id})
			.from(livestreams)
			.where(
				and(eq(livestreams.id, livestreamId), eq(livestreams.userId, userId)),
			)
		if (!livestream) {
			throw new Error(`no livestream with ${livestreamId} for user `)
		}
		const [lastExistingAgendaItem] = await this.#db
			.select({order: agendaItems.order})
			.from(agendaItems)
			.where(eq(agendaItems.livestreamId, livestreamId))
			.orderBy(desc(agendaItems.order))
			.limit(1)

		const [{id}] = await this.#db
			.insert(agendaItems)
			.values({
				livestreamId,
				order: lastExistingAgendaItem ? lastExistingAgendaItem.order + 1 : 0,
			})
			.returning({id: agendaItems.id})

		return id
	}
	updateAgendaItem = async (
		id: string,
		partial: Partial<Omit<AgendaItem, 'id'>>,
		userId: string,
	) => {
		const [agendaItem] = await this.#db
			.select({id: agendaItems.id})
			.from(agendaItems)
			.innerJoin(livestreams, eq(agendaItems.livestreamId, livestreams.id))
			.where(and(eq(agendaItems.id, id), eq(livestreams.userId, userId)))
		if (!agendaItem) {
			throw new Error(`no agenda item with ${id} for user `)
		}

		await this.#db
			.update(agendaItems)
			.set(partial)
			.where(eq(agendaItems.id, id))
	}
	deleteAgendaItem = async (id: string, userId: string) => {
		const [agendaItem] = await this.#db
			.select({id: agendaItems.id})
			.from(agendaItems)
			.innerJoin(livestreams, eq(agendaItems.livestreamId, livestreams.id))
			.where(and(eq(agendaItems.id, id), eq(livestreams.userId, userId)))

		if (!agendaItem) {
			throw new Error(`no agenda item with ${id} for user `)
		}

		await this.#db.delete(agendaItems).where(eq(agendaItems.id, id))
	}
}
