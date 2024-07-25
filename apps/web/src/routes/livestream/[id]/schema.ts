import {z} from 'zod'

export const labelAgendaItemSchema = z.object({
	index: z.number().int().min(0),
	label: z.string().min(0).max(500),
})

export type LabelAgendaItemSchema = typeof labelAgendaItemSchema
