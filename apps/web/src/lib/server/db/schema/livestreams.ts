import {index, integer, sqliteTable, text} from 'drizzle-orm/sqlite-core'
import {users} from './auth'
import {agendaItemStatuses} from '../../../repos/livestreams/LivestreamsRepoInterface'

export const livestreams = sqliteTable(
	'livestreams',
	{
		id: text('id')
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {onDelete: 'cascade'}),
		title: text('title').notNull(),
		description: text('description'),
		createdAt: integer('created_at', {mode: 'timestamp'})
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => ({
		createdAtIdx: index('livestreams_created_at_index').on(table.createdAt),
	}),
)

export type SelectLivestream = typeof livestreams.$inferSelect
export type InsertLivestream = typeof livestreams.$inferInsert

export const agendaItems = sqliteTable(
	'agenda_items',
	{
		id: text('id')
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		livestreamId: text('livestream_id')
			.notNull()
			.references(() => livestreams.id, {onDelete: 'cascade'}),
		label: text('label').notNull().default(''),
		status: text('status', {enum: agendaItemStatuses})
			.notNull()
			.default('pending'),
		startedAt: integer('started_at', {mode: 'timestamp'}),
		streamTimestamp: text('stream_timestamp'),
		order: integer('order').notNull().default(0),
		createdAt: integer('created_at', {mode: 'timestamp'})
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => ({
		orderIndex: index('agenda_item_order_index').on(table.order),
	}),
)

export type SelectAgendaItem = typeof agendaItems.$inferSelect
export type InsertAgendaItem = typeof agendaItems.$inferInsert
