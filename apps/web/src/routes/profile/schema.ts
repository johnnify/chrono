import {z} from 'zod'

export const formSchema = z.object({
	name: z.string().nullable(),
})

export type FormSchema = typeof formSchema
