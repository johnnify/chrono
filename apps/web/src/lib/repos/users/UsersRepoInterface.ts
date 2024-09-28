import type {ProviderId} from '$lib/schemas'
import type {InsertUser, SelectUser} from '$lib/server/db/schema/auth'

export type User = SelectUser
export type NewUser = InsertUser

export type Provider = {
	providerId: ProviderId
	providerUserId: string
}

export interface UsersRepoInterface {
	findById(id: string): Promise<SelectUser | null>
	// returns the user's id
	findByProvider(provider: Provider): Promise<string | null>
	// returns the user's id
	findByEmail(email: string): Promise<string | null>
	// returns the user's id
	findByVerificationCode(code: string): Promise<string | null>

	// returns the new user's id
	createUser(user: NewUser, provider?: Provider): Promise<string>

	addProviderToUser(userId: string, provider: Provider): Promise<void>

	updateUserProfile(
		user: Pick<User, 'id' | 'name'> | {avatarUrl?: string | null},
	): Promise<void>

	generateVerificationCode(userId: string): Promise<string>
}
