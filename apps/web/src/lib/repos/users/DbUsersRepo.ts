import {sha256} from '@oslojs/crypto/sha2'
import {encodeHexLowerCase} from '@oslojs/encoding'
import {eq, and} from 'drizzle-orm'
import {
	type DrizzleDb,
	type AuthProviderId,
	type InsertUser,
	type Session,
	type InsertUserProvider,
	users,
	sessions,
	usersProviders,
} from '@repo/db'
import type {
	NewOrExistingUser,
	SessionValidationResult,
	UsersRepoInterface,
} from './UsersRepoInterface'

const DAY_IN_MS = 1000 * 60 * 60 * 24

export class DbUsersRepo implements UsersRepoInterface {
	#db: DrizzleDb

	constructor(db: DrizzleDb) {
		this.#db = db
	}

	upsertUser = async (user: NewOrExistingUser): Promise<string> => {
		const update: InsertUser = {
			name: user.name,
			email: user.email,
		}

		const [dbUser] = await this.#db
			.insert(users)
			.values({...user})
			.onConflictDoUpdate({
				target: users.id,
				set: update,
			})
			.returning({id: users.id})

		return dbUser.id
	}

	upsertOAuthUser = async ({
		provider,
		providerUserId,
		user,
	}: {
		provider: AuthProviderId
		providerUserId: string
		user: {
			name: string
			email: string | null
			avatarUrl?: string | null
		}
	}): Promise<string> => {
		// TODO: This should be a single transaction,
		// but Drizzle does not support them with Cloudflare D1:
		// https://github.com/drizzle-team/drizzle-orm/issues/4212

		// Check if this provider account already exists
		const [existingProviderUser] = await this.#db
			.select({userId: usersProviders.userId})
			.from(usersProviders)
			.where(
				and(
					eq(usersProviders.provider, provider),
					eq(usersProviders.providerUserId, providerUserId),
				),
			)
			.limit(1)

		if (existingProviderUser) {
			// Update existing user with latest data
			const userId = existingProviderUser.userId
			await this.#db
				.update(users)
				.set({
					name: user.name,
					email: user.email,
					avatarUrl: user.avatarUrl,
				})
				.where(eq(users.id, userId))
			return userId
		}

		if (user.email) {
			// Check if there is already a user who's verified this email
			const [existingUser] = await this.#db
				.select({id: users.id})
				.from(users)
				.where(
					and(eq(users.email, user.email), eq(users.isEmailVerified, true)),
				)
				.limit(1)

			if (existingUser) {
				// Add the provider association to the existing user
				const userProvider: InsertUserProvider = {
					userId: existingUser.id,
					provider,
					providerUserId,
				}

				await this.#db.insert(usersProviders).values(userProvider)

				return existingUser.id
			}
		}

		// Create new user and link to provider
		const newUser: InsertUser = {
			name: user.name,
			email: user.email,
			isEmailVerified: !!user.email,
			avatarUrl: user.avatarUrl,
		}

		const [createdUser] = await this.#db
			.insert(users)
			.values(newUser)
			.returning({id: users.id})

		// Link user to OAuth provider
		const userProvider: InsertUserProvider = {
			userId: createdUser.id,
			provider,
			providerUserId,
		}

		await this.#db.insert(usersProviders).values(userProvider)

		return createdUser.id
	}

	updateUserProfile = (user: {id: string; name: string}): Promise<void> =>
		this.#db.update(users).set({name: user.name}).where(eq(users.id, user.id))

	createSession = async (token: string, userId: string): Promise<Session> => {
		const sessionId = encodeHexLowerCase(
			sha256(new TextEncoder().encode(token)),
		)
		const session: Session = {
			id: sessionId,
			userId,
			expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
		}
		await this.#db.insert(sessions).values(session)
		return session
	}

	validateSessionToken = async (
		token: string,
	): Promise<SessionValidationResult> => {
		const sessionId = encodeHexLowerCase(
			sha256(new TextEncoder().encode(token)),
		)
		const [result] = await this.#db
			.select({
				user: {
					id: users.id,
					name: users.name,
					email: users.email,
					avatarUrl: users.avatarUrl,
					isAdmin: users.isAdmin,
				},
				session: sessions,
			})
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(eq(sessions.id, sessionId))

		if (!result) {
			return {session: null, user: null}
		}
		const {session, user} = result

		const sessionExpired = Date.now() >= session.expiresAt.getTime()
		if (sessionExpired) {
			await this.#db.delete(sessions).where(eq(sessions.id, session.id))
			return {session: null, user: null}
		}

		const renewSession =
			Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15
		if (renewSession) {
			session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30)
			await this.#db
				.update(sessions)
				.set({expiresAt: session.expiresAt})
				.where(eq(sessions.id, session.id))
		}

		return {session, user}
	}

	invalidateSession = (sessionId: string): Promise<void> =>
		this.#db.delete(sessions).where(eq(sessions.id, sessionId))
}
