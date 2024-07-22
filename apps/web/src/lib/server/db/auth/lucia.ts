import {Lucia} from 'lucia'
import {DrizzleSQLiteAdapter} from '@lucia-auth/adapter-drizzle'
import {dev} from '$app/environment'

import {db} from '../db'
import {sessions, users, type SelectUser} from '../schema/auth'

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
		},
	},
	getUserAttributes: (attributes) => ({
		email: attributes.email,
		name: attributes.name,
		avatarUrl: attributes.avatarUrl,
	}),
})

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: SelectUser
	}
}
