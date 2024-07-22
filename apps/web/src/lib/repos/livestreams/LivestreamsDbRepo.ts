import type {DrizzleDb} from '$lib/server/db/db'
import type {LivestreamsRepoInterface} from './LivestreamsRepoInterface'

export class LivestreamsDbRepo implements LivestreamsRepoInterface {
	#db: DrizzleDb

	constructor(db: DrizzleDb) {
		this.#db = db
	}

	list = async () => {
		return {livestreams: []}
	}

	find = async (id: string) => {
		return null
	}
}
