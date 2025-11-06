import {
	sqliteTable,
	text,
	integer,
	primaryKey,
	index,
} from 'drizzle-orm/sqlite-core'

import {authProviderIds} from '../constants'

export const users = sqliteTable(
	'users',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name').notNull(),
		email: text('email'),
		isEmailVerified: integer('is_email_verified', {mode: 'boolean'})
			.notNull()
			.default(false),
		isAdmin: integer('is_admin', {mode: 'boolean'}).notNull().default(false),
		avatarUrl: text('avatar_url'),
		createdAt: integer('created_at', {mode: 'timestamp'})
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => [index('email_idx').on(table.email)],
)

export type SelectUser = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {onDelete: 'cascade'}),
	expiresAt: integer('expires_at', {mode: 'timestamp'}).notNull(),
})

export type Session = typeof sessions.$inferSelect

export const usersProviders = sqliteTable(
	'users_providers',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {onDelete: 'cascade'}),
		provider: text('provider', {enum: authProviderIds}).notNull(),
		providerUserId: text('provider_user_id').notNull(),
		createdAt: integer('created_at', {mode: 'timestamp'})
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => [primaryKey({columns: [table.provider, table.providerUserId]})],
)

export type UserProvider = typeof usersProviders.$inferSelect
export type InsertUserProvider = typeof usersProviders.$inferInsert
