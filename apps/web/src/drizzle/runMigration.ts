import {migrate} from 'drizzle-orm/libsql/migrator'
import {scriptDb} from './scriptDb'

export const runMigration = async () => {
	console.info('🦆 Running migrations...')
	await migrate(scriptDb, {migrationsFolder: './src/drizzle'})
	console.info('✅ Migrations complete!')
}
