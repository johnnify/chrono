import {index, integer, sqliteTable, text} from 'drizzle-orm/sqlite-core'
import {users} from './auth'

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
		createdAtIdx: index(`created_at_idx_${crypto.randomUUID()}`).on(
			table.createdAt,
		),
	}),
)

export type SelectLivestream = typeof livestreams.$inferSelect
export type InsertLivestream = typeof livestreams.$inferInsert

export type AgendaEventType = 'create' | 'toggle' | 'delete' | 'label'

export type AgendaEventPayload =
	| {
			type: 'create'
	  }
	| {
			type: 'toggle'
			data: {
				index: number
			}
	  }
	| {
			type: 'delete'
			data: {
				index: number
			}
	  }
	| {
			type: 'label'
			data: {
				index: number
				label: string
			}
	  }

export const agendaEvents = sqliteTable(
	'agenda_events',
	{
		id: text('id')
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		livestreamId: text('livestream_id')
			.notNull()
			.references(() => livestreams.id, {onDelete: 'cascade'}),
		payload: text('payload', {mode: 'json'})
			.$type<AgendaEventPayload>()
			.notNull(),
		createdAt: integer('created_at', {mode: 'timestamp'})
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => ({
		createdAtIdx: index(`created_at_idx_${crypto.randomUUID()}`).on(
			table.createdAt,
		),
	}),
)

export type SelectAgendaEvent = typeof agendaEvents.$inferSelect
export type InsertAgendaEvent = typeof agendaEvents.$inferInsert
