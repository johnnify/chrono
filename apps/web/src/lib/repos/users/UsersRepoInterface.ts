import type {AuthProviderId, InsertUser, SelectUser, Session} from '@repo/db'

export type User = Pick<
	SelectUser,
	'id' | 'name' | 'email' | 'isAdmin' | 'avatarUrl'
>
export type NewOrExistingUser = InsertUser

export type SessionValidationResult = {
	session: Session | null
	user: User | null
}

export interface UsersRepoInterface {
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
	validateSessionToken(token: string): Promise<SessionValidationResult>

	invalidateSession(sessionId: string): Promise<void>
}
