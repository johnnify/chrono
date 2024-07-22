import {and, eq} from 'drizzle-orm'
import {createDate, isWithinExpirationDate, TimeSpan} from 'oslo'

import {
	providersToUsers,
	users,
	verificationCodes,
	type InsertUser,
} from '$lib/server/db/schema/auth'
import type {Provider, User, UsersRepoInterface} from './UsersRepoInterface'
import type {DrizzleDb} from '$lib/server/db/db'

export class DbUsersRepo implements UsersRepoInterface {
	#db: DrizzleDb

	constructor(db: DrizzleDb) {
		this.#db = db
	}

	async findById(id: string) {
		const [result] = await this.#db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1)

		return result
	}

	async findByProvider(provider: Provider) {
		const [result] = await this.#db
			.select({userId: providersToUsers.userId})
			.from(providersToUsers)
			.where(
				and(
					eq(providersToUsers.providerId, provider.providerId),
					eq(providersToUsers.providerUserId, provider.providerUserId),
				),
			)
			.limit(1)

		return result ? result.userId : null
	}

	async findByEmail(email: string) {
		const [result] = await this.#db
			.select({id: users.id})
			.from(users)
			.where(eq(users.email, email))
			.limit(1)

		return result ? result.id : null
	}

	async findByVerificationCode(code: string) {
		return this.#db.transaction(async (tx) => {
			const [user] = await tx
				.select({
					userId: users.id,
					emailVerified: users.emailVerified,
					expiresAt: verificationCodes.expiresAt,
				})
				.from(users)
				.leftJoin(verificationCodes, eq(users.id, verificationCodes.userId))
				.where(eq(verificationCodes.code, code))
				.limit(1)

			if (!user) return null

			const {userId, expiresAt, emailVerified} = user
			if (userId && expiresAt) {
				await tx
					.delete(verificationCodes)
					.where(eq(verificationCodes.userId, userId))

				if (!isWithinExpirationDate(expiresAt)) {
					return null
				}

				if (!emailVerified) {
					await tx
						.update(users)
						.set({emailVerified: true})
						.where(eq(users.id, userId))
				}

				return userId
			} else {
				return null
			}
		})
	}

	async createUser(user: InsertUser, provider?: Provider) {
		return this.#db.transaction(async (tx) => {
			const [{id}] = await tx
				.insert(users)
				.values(user)
				.returning({id: users.id})

			if (provider) {
				await tx.insert(providersToUsers).values({...provider, userId: id})
			}

			return id
		})
	}

	async addProviderToUser(userId: string, provider: Provider) {
		this.#db.insert(providersToUsers).values({...provider, userId})
	}

	async updateUserProfile({
		id,
		...restOfUser
	}: Pick<User, 'id' | 'name' | 'avatarUrl'>) {
		await this.#db.update(users).set(restOfUser).where(eq(users.id, id))
		return
	}

	async generateVerificationCode(userId: string) {
		await this.#db
			.delete(verificationCodes)
			.where(eq(verificationCodes.userId, userId))

		const [{code}] = await this.#db
			.insert(verificationCodes)
			.values({
				userId,
				expiresAt: createDate(new TimeSpan(15, 'm')), // 15 minutes
			})
			.returning({code: verificationCodes.code})

		return code
	}
}
