import dotenvFlow from 'dotenv-flow'
import {drizzle} from 'drizzle-orm/libsql'
import {createClient} from '@libsql/client'

if (!process.env.DB_URL) {
	dotenvFlow.config()
}

if (!process.env.DB_URL) {
	throw new Error('DB_URL environment variable not set')
}

export const scriptClient = createClient({
	url: process.env.DB_URL,
	authToken: process.env.DB_AUTH_TOKEN,
})

console.info(`⚡️ Connected to ${process.env.DB_URL}...`)

export const scriptDb = drizzle(scriptClient)
