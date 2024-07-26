export type Livestream = {
	id: string
	title: string
	description: string | null
	userId: string
	createdAt: Date
}

export type AgendaItem = {
	label: string
	isDone: boolean
}

export type ChapterTimestamp = {
	timestamp: string
	label: string
}

export type LivestreamWithAgenda = Livestream & {
	agenda: AgendaItem[]
	timestamps: ChapterTimestamp[]
}

export interface LivestreamsRepoInterface {
	list(): Promise<{livestreams: Omit<Livestream, 'description'>[]}>
	find(id: string): Promise<LivestreamWithAgenda | null>
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

	createAgendaItem(livestreamId: string): Promise<void>
	toggleAgendaItem(livestreamId: string, index: number): Promise<void>
	deleteAgendaItem(livestreamId: string, index: number): Promise<void>
	labelAgendaItem(
		livestreamId: string,
		{index, label}: {index: number; label: string},
	): Promise<void>
}
