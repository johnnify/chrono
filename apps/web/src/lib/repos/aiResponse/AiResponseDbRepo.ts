import {generateObject} from 'ai'
import type {OpenAIProvider} from '@ai-sdk/openai'
import {eq} from 'drizzle-orm'
import type {DrizzleDb} from '$lib/server/db/db'
import type {AiResponseRepoInterface} from './AiResponseRepoInterface'
import {suggestionsSchema} from './schema'
import {cachedAiResponses} from '$lib/server/db/schema/cachedAiResponses'

export class AiResponseDbRepo implements AiResponseRepoInterface {
	#db: DrizzleDb
	#openai: OpenAIProvider

	constructor({db, openai}: {db: DrizzleDb; openai: OpenAIProvider}) {
		this.#db = db
		this.#openai = openai
	}

	suggest = async (livestream: {title: string; agenda: {label: string}[]}) => {
		const prompt = `Suggest a YouTube description based on the following agenda for the YouTube livestream${livestream.title ? `titled “${livestream.title}”` : ''}
	${livestream.agenda.map(({label}) => `- ${label}`).join('\n')}

	Consider that YouTube descriptions have to lead with the most important thing, be in plain text.
	Do not use markdown, just plain text. Do not use hashtags.`

		const [result] = await this.#db
			.select({response: cachedAiResponses.response})
			.from(cachedAiResponses)
			.where(eq(cachedAiResponses.prompt, prompt))
			.limit(1)

		if (result) {
			return result.response
		}

		const {object} = await generateObject({
			model: this.#openai('gpt-4o'),
			schema: suggestionsSchema,
			prompt,
		})

		await this.#db.insert(cachedAiResponses).values({prompt, response: object})

		return object
	}
}
