import {z} from 'zod'

export const livestreamSchema = z.object({
	title: z.string().min(3).max(100),
})

export type LivestreamSchema = typeof livestreamSchema
