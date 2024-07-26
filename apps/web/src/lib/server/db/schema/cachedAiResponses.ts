import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core'

import type {SuggestionsResponseSchema} from '../../../repos/aiResponse/schema'

export const cachedAiResponses = sqliteTable('cached_ai_responses', {
	prompt: text('prompt').notNull().primaryKey(),
	response: text('response', {mode: 'json'})
		.$type<SuggestionsResponseSchema>()
		.notNull(),
	createdAt: integer('created_at', {mode: 'timestamp'})
		.notNull()
		.$defaultFn(() => new Date()),
})
