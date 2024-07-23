import {z} from 'zod'

export const labelAgendaItemSchema = z.object({
	index: z.number().int().positive(),
	label: z.string().min(0).max(500),
})

export type LabelAgendaItemSchema = typeof labelAgendaItemSchema
