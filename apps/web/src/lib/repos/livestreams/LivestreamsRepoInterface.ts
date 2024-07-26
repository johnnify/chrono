export type Livestream = {
	id: string
	title: string
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

export type LivestreamWithAgenda = {
	id: string
	title: string
	userId: string
	createdAt: Date
	agenda: AgendaItem[]
	timestamps: ChapterTimestamp[]
}

export interface LivestreamsRepoInterface {
	list(): Promise<{livestreams: Livestream[]}>
	find(id: string): Promise<LivestreamWithAgenda | null>
	// returns the ID of the newly created livestream
	create({title, userId}: {title: string; userId: string}): Promise<string>

	createAgendaItem(livestreamId: string): Promise<void>
	toggleAgendaItem(livestreamId: string, index: number): Promise<void>
	deleteAgendaItem(livestreamId: string, index: number): Promise<void>
	labelAgendaItem(
		livestreamId: string,
		{index, label}: {index: number; label: string},
	): Promise<void>
}
