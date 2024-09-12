import {z} from 'zod'

export const fileSchema = z.instanceof(File, {message: 'Please upload a file.'})
export const imageSchema = fileSchema.refine(
	(file) => file.size === 0 || file.type.startsWith('image/'),
)

export const providerIds = ['google'] as const
export type ProviderId = (typeof providerIds)[number]
export const ProvidersEnum = z.enum(providerIds)
