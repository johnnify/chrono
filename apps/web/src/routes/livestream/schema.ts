import {z} from 'zod'

export const livestreamSchema = z.object({
	title: z.string().min(3).max(100),
	description: z.string().min(3).max(5_000).nullable(),
})

export type LivestreamSchema = typeof livestreamSchema
