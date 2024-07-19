import type {LivestreamsRepoInterface} from './LivestreamsRepoInterface'
import {
	Collections,
	type LivestreamsResponse,
	type TypedPocketBase,
} from '$lib/generated/pocketbase-types'

export class LivestreamsPocketbaseRepo implements LivestreamsRepoInterface {
	#pb: TypedPocketBase

	constructor(pb: TypedPocketBase) {
		this.#pb = pb
	}

	mapPbLivestreamToLivestream = ({
		thumbnail,
		...pbLivestream
	}: LivestreamsResponse) => ({
		...pbLivestream,
		thumbnail: this.#pb.getFileUrl(pbLivestream, thumbnail),
	})

	list = async () => {
		const listResult = await this.#pb
			.collection(Collections.Livestreams)
			.getList(1, 50)

		return {livestreams: listResult.items.map(this.mapPbLivestreamToLivestream)}
	}

	find = async (id: string) => {
		const result = await this.#pb.collection(Collections.Livestreams).getOne(id)

		return result ? this.mapPbLivestreamToLivestream(result) : null
	}
}
