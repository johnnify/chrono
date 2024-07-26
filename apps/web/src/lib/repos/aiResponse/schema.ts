import {z} from 'zod'

export const suggestionSchema = z.string().min(100).max(5_000)
export type SuggestionSchema = z.infer<typeof suggestionSchema>

export const suggestionsSchema = z.object({
	suggestions: z.array(suggestionSchema).length(3),
})

export type SuggestionsResponseSchema = z.infer<typeof suggestionsSchema>
