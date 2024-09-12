import {agendaItemStatuses} from '$lib/repos/livestreams/LivestreamsRepoInterface'
import {z} from 'zod'

export const updateAgendaItemSchema = z.object({
	id: z.string(),
	label: z.string().min(0).max(500),
	status: z.enum(agendaItemStatuses).default('pending'),
})

export type UpdateAgendaItemSchema = typeof updateAgendaItemSchema

export const deleteAgendaItemSchema = z.object({
	id: z.string(),
})
export type DeleteAgendaItemSchema = typeof deleteAgendaItemSchema
