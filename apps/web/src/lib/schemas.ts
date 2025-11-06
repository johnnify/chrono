import {z} from 'zod/v4'
import {authProviderIds} from '@repo/db'

export const fileSchema = z.instanceof(File, {message: 'Please upload a file.'})
export const imageSchema = fileSchema.refine(
	(file) => file.size === 0 || file.type.startsWith('image/'),
)

export const AuthProvidersEnum = z.enum(authProviderIds)
