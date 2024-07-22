import {z} from 'zod'
import {ProvidersEnum} from '$lib/schemas'

export const socialLoginSchema = z.object({
	provider: ProvidersEnum,
})

export type SocialLoginSchema = typeof socialLoginSchema

export const magicLoginSchema = z.object({
	email: z.string().email(),
})

export type MagicLoginSchema = typeof magicLoginSchema
