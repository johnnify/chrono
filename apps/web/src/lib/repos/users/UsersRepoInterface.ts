import type {AuthProviderId, InsertUser, SelectUser} from '@repo/db'

export const userRoles = ['guest', 'user', 'admin'] as const

export type UserRole = (typeof userRoles)[number]

export type User = Pick<SelectUser, 'id' | 'name' | 'email' | 'avatarUrl'>

export type Session = {
	id: string
	userId: string
	expiresAt: Date
	userRole: UserRole
}

export type NewOrExistingUser = InsertUser

export interface UsersRepoInterface {
	// Get user by ID
	getUserById(userId: string): Promise<User | null>

	// creates new user, or updates existing one. Returns the user id
	upsertUser(user: NewOrExistingUser): Promise<string>

	// OAuth user handling - creates user and links to provider, or updates existing linked user
	upsertOAuthUser(params: {
		provider: AuthProviderId
		providerUserId: string
		user: {
			name: string
			email: string | null
			avatarUrl?: string | null
		}
	}): Promise<string>

	updateUserProfile(params: {id: string; name: string}): Promise<void>

	// session handling
	createSession(token: string, userId: string): Promise<Session>
	validateSessionToken(token: string): Promise<Session | null>

	invalidateSession(sessionId: string): Promise<void>
}
