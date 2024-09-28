import {beforeAll, afterEach, afterAll} from 'vitest'
import {migrate} from 'drizzle-orm/libsql/migrator'

import {mswNodeServer} from './mocks/mswNodeServer'
import {client, db} from '$lib/server/db/db'
import {users, type InsertUser} from '$lib/server/db/schema/auth'
import {livestreams} from '$lib/server/db/schema/livestreams'
import {generateLivestreamPartials} from './drizzle/factories/livestream'

beforeAll(async () => {
	console.log('🦆 Running migrations...')
	await migrate(db, {migrationsFolder: './src/drizzle'})
	console.log('✅ Migrations complete!')

	console.log('🌱 Seeding database...')
	const testUser: InsertUser = {
		email: 'elena@example.com',
		name: 'Elena',
	}
	const [{id}] = await db
		.insert(users)
		.values(testUser)
		.returning({id: users.id})

	await db
		.insert(livestreams)
		.values(generateLivestreamPartials(1_000, {userId: id}))

	console.log('✅ Seeding complete...')

	mswNodeServer.listen()
})
afterEach(() => mswNodeServer.resetHandlers())
afterAll(() => {
	client.close()
	mswNodeServer.close()
})
