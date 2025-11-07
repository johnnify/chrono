import {sha256} from '@oslojs/crypto/sha2'
import {encodeHexLowerCase} from '@oslojs/encoding'
import {eq, and} from 'drizzle-orm'
import type {KVNamespace} from '@cloudflare/workers-types'
import {
	type DrizzleDb,
	type AuthProviderId,
	type InsertUser,
	type InsertUserProvider,
	users,
	usersProviders,
} from '@repo/db'
import type {
	NewOrExistingUser,
	UsersRepoInterface,
	Session,
	UserRole,
	User,
} from './UsersRepoInterface'

const DAY_IN_MS = 1000 * 60 * 60 * 24

export class CloudflareUsersRepo implements UsersRepoInterface {
	#db: DrizzleDb
	#kv: KVNamespace

	constructor(db: DrizzleDb, kv: KVNamespace) {
		this.#db = db
		this.#kv = kv
	}

	getUserById = async (userId: string): Promise<User | null> => {
		const [user] = await this.#db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				avatarUrl: users.avatarUrl,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1)

		return user
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
		const expiresAt = new Date(Date.now() + DAY_IN_MS * 30)

		// Fetch user's admin status from D1
		const [user] = await this.#db
			.select({
				isAdmin: users.isAdmin,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1)

		if (!user) {
			throw new Error(`User ${userId} not found`)
		}

		const userRole: UserRole = user.isAdmin ? 'admin' : 'user'

		const session: Session = {
			id: sessionId,
			userId,
			expiresAt,
			userRole,
		}

		// Store session in KV
		await this.#kv.put(sessionId, JSON.stringify(session), {
			expirationTtl: (DAY_IN_MS * 30) / 1000, // KV expects seconds
		})

		return session
	}

	validateSessionToken = async (token: string): Promise<Session | null> => {
		const sessionId = encodeHexLowerCase(
			sha256(new TextEncoder().encode(token)),
		)

		// Read session from KV
		const sessionString = await this.#kv.get(sessionId)
		if (!sessionString) {
			return null
		}

		const storedSession = JSON.parse(sessionString) as {
			id: string
			userId: string
			expiresAt: string
			userRole: UserRole
		}

		const expiresAt = new Date(storedSession.expiresAt)

		// Check if session is expired
		const sessionExpired = Date.now() >= expiresAt.getTime()
		if (sessionExpired) {
			await this.#kv.delete(sessionId)
			return null
		}

		// Renew session if it's halfway to expiration
		const renewSession = Date.now() >= expiresAt.getTime() - DAY_IN_MS * 15
		if (renewSession) {
			const newExpiresAt = new Date(Date.now() + DAY_IN_MS * 30)
			const updatedSession: Session = {
				...storedSession,
				expiresAt: newExpiresAt,
			}
			await this.#kv.put(sessionId, JSON.stringify(updatedSession), {
				expirationTtl: (DAY_IN_MS * 30) / 1000, // KV expects seconds
			})
			return updatedSession
		}

		const session: Session = {
			...storedSession,
			expiresAt,
		}

		return session
	}

	invalidateSession = (sessionId: string): Promise<void> =>
		this.#kv.delete(sessionId)
}
