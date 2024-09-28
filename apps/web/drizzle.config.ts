import dotenvFlow from 'dotenv-flow'
import type {Config} from 'drizzle-kit'

dotenvFlow.config()

if (!process.env.DB_URL) {
	throw new Error('DB_URL environment variable not set')
}

export default {
	dialect: 'sqlite',
	driver: 'turso',
	schema: './src/lib/server/db/schema/*',
	out: './src/drizzle',
	dbCredentials: {
		url: process.env.DB_URL,
		authToken: process.env.DB_AUTH_TOKEN,
	},
} satisfies Config
