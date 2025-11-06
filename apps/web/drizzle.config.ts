import {defineConfig} from 'drizzle-kit'

let dbCredentials:
	| {
			accountId: string
			databaseId: string
			token: string
	  }
	| undefined

if (
	!process.env.CLOUDFLARE_ACCOUNT_ID ||
	!process.env.CLOUDFLARE_DATABASE_ID ||
	!process.env.CLOUDFLARE_D1_TOKEN
) {
	console.error('🚨 Missing Cloudflare connection credentials')
} else {
	dbCredentials = {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
		databaseId: process.env.CLOUDFLARE_DATABASE_ID,
		token: process.env.CLOUDFLARE_D1_TOKEN,
	}
}

export default defineConfig({
	schema: '../../packages/db/src/schema',

	verbose: true,
	strict: true,

	driver: 'd1-http',
	dialect: 'sqlite',

	dbCredentials,
})
