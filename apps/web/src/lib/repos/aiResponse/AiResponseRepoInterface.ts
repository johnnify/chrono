import type {SuggestionsResponseSchema} from './schema'

export interface AiResponseRepoInterface {
	suggest(livestream: {
		title: string
		agenda: {label: string}[]
	}): Promise<SuggestionsResponseSchema>
	suggestThumbnails(livestream: {
		title: string
		description: string | null
		agenda: {label: string}[]
	}): Promise<string[]>
}
