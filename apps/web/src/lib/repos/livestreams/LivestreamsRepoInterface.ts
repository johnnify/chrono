export type Livestream = {
	id: string
	title: string
	description: string | null
	userId: string
	createdAt: Date
}

export const agendaItemStatuses = [
	'pending',
	'started',
	'bailed',
	'done',
] as const
export type AgendaItemStatus = (typeof agendaItemStatuses)[number]

export type AgendaItem = {
	id: string
	label: string
	status: AgendaItemStatus
	streamTimestamp: string | null
}

export type LivestreamWithAgenda = Livestream & {
	agenda: AgendaItem[]
}

export interface LivestreamsRepoInterface {
	list(
		userId: string,
	): Promise<{livestreams: Omit<Livestream, 'description'>[]}>
	find({
		id,
		userId,
	}: {
		id: string
		userId?: string
	}): Promise<LivestreamWithAgenda | null>
	// returns the ID of the newly created livestream
	create({
		title,
		description,
		userId,
	}: {
		title: string
		description?: string | null
		userId: string
	}): Promise<string>
	update({
		id,
		title,
		description,
		userId,
	}: {
		id: string
		title: string
		description?: string | null
		userId: string
	}): Promise<void>

	// returns the ID of the newly created agenda item
	createAgendaItem(livestreamId: string, userId: string): Promise<string>
	updateAgendaItem(
		id: string,
		partial: Partial<Omit<AgendaItem, 'id'>>,
		userId: string,
	): Promise<void>
	deleteAgendaItem(id: string, userId: string): Promise<void>
}
