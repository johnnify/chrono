import {generateObject} from 'ai'
import type {OpenAIProvider} from '@ai-sdk/openai'
import {eq} from 'drizzle-orm'
import type {DrizzleDb} from '$lib/server/db/db'
import type {AiResponseRepoInterface} from './AiResponseRepoInterface'
import {suggestionsSchema, type SuggestionsResponseSchema} from './schema'
import {
	cachedAiResponses,
	cachedGeneratedImages,
} from '$lib/server/db/schema/cachedAiResponses'
import type OpenAI from 'openai'

export class AiResponseDbRepo implements AiResponseRepoInterface {
	#db: DrizzleDb
	#openaiProvider: OpenAIProvider
	#openaiClient: OpenAI

	constructor({
		db,
		openaiProvider,
		openaiClient,
	}: {
		db: DrizzleDb
		openaiProvider: OpenAIProvider
		openaiClient: OpenAI
	}) {
		this.#db = db
		this.#openaiProvider = openaiProvider
		this.#openaiClient = openaiClient
	}

	suggest = async (livestream: {title: string; agenda: {label: string}[]}) => {
		const prompt = `Suggest a few YouTube descriptions based on the following agenda for the YouTube livestream${livestream.title ? `titled “${livestream.title}”` : ''}
	${livestream.agenda.map(({label}) => `- ${label}`).join('\n')}

	Consider that YouTube descriptions have to lead with the most important thing, be in plain text.
	Do not use markdown, just plain text. Do not use hashtags.
	You do not need to use all of the agenda items, or their exact wording, your job is to make something accurate, but appealing to potential viewers.
	`

		const [result] = await this.#db
			.select({response: cachedAiResponses.response})
			.from(cachedAiResponses)
			.where(eq(cachedAiResponses.prompt, prompt))
			.limit(1)

		if (result) {
			return result.response
		}

		const {object} = await generateObject({
			model: this.#openaiProvider('gpt-4o'),
			schema: suggestionsSchema,
			prompt,
		})

		await this.#db.insert(cachedAiResponses).values({prompt, response: object})

		return object
	}

	suggestThumbnails = async (livestream: {
		title: string
		description: string | null
		agenda: {label: string}[]
	}) => {
		const descriptionPrompt = livestream.description
			? `The video has the following description:
${livestream.description}`
			: ''
		const prompt = `Suggest a minimalistic and clean YouTube thumbnail based on the following agenda for a YouTube livestream${livestream.title ? `titled “${livestream.title}”` : ''}
${livestream.agenda.map(({label}) => `- ${label}`).join('\n')}

${descriptionPrompt}
--
Make it eye-catching, but appealing to a tech audience! Keep it simple. Do not use text or letters at all costs.
`

		const [result] = await this.#db
			.select({response: cachedGeneratedImages.response})
			.from(cachedGeneratedImages)
			.where(eq(cachedGeneratedImages.prompt, prompt))
			.limit(1)

		if (result) {
			return result.response.imageUrls
		}

		const response = await this.#openaiClient.images.generate({
			model: 'dall-e-3',
			prompt,
			size: '1792x1024',
			response_format: 'b64_json',
		})

		const imageUrls = response.data.reduce<string[]>((acc, {url, b64_json}) => {
			if (url) {
				acc.push(url)
			}
			if (b64_json) {
				acc.push(`data:image/png;base64, ${b64_json}`)
			}
			return acc
		}, [])

		if (imageUrls.length > 0) {
			await this.#db
				.insert(cachedGeneratedImages)
				.values({prompt, response: {imageUrls}})

			return imageUrls
		} else {
			throw new Error('Could not generate thumbnails')
		}
	}
}
