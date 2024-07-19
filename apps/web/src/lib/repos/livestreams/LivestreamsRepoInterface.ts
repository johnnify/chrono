export type Livestream = {
	id: string
	title: string
	thumbnail: string
	created: string
}

export interface LivestreamsRepoInterface {
	list(): Promise<{livestreams: Livestream[]}>
	find(id: string): Promise<Livestream | null>
}
