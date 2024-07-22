import {sqliteTable, text, integer, primaryKey} from 'drizzle-orm/sqlite-core'
import {alphabet, generateRandomString} from 'oslo/crypto'
// drizzle-kit cannot magically resolve $lib
import {providerIds} from '../../../schemas'

export const users = sqliteTable('users', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email').notNull(),
	name: text('name'),
	avatarUrl: text('avatar_url'),
	emailVerified: integer('email_verified', {mode: 'boolean'})
		.notNull()
		.default(false),
})

export type SelectUser = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export const sessions = sqliteTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {onDelete: 'cascade'}),
	expiresAt: integer('expires_at').notNull(),
})

export type SelectSession = typeof sessions.$inferSelect
export type InsertSession = typeof sessions.$inferInsert

export const providersToUsers = sqliteTable(
	'providers_users',
	{
		providerId: text('provider_id', {enum: providerIds}).notNull(),
		providerUserId: text('provider_user_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {onDelete: 'cascade'}),
	},
	(table) => ({
		pk: primaryKey({columns: [table.providerId, table.providerUserId]}),
	}),
)

export type SelectProviderToUser = typeof providersToUsers.$inferSelect
export type InsertProviderToUser = typeof providersToUsers.$inferInsert

const generateVerificationCode = () =>
	generateRandomString(32, alphabet('0-9', 'A-Z'))

export const verificationCodes = sqliteTable('verification_codes', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	code: text('code').notNull().$defaultFn(generateVerificationCode),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {onDelete: 'cascade'}),
	expiresAt: integer('expires_at', {mode: 'timestamp'}).notNull(),
})

export type SelectVerificationCode = typeof providersToUsers.$inferSelect
export type InsertVerificationCode = typeof providersToUsers.$inferInsert
