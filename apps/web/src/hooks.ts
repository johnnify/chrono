import type {Transport} from '@sveltejs/kit'

import {Rng} from '$lib/Rng'

export const transport: Transport = {
	Rng: {
		encode: (value) => value instanceof Rng && value.toJSON(),
		decode: (serialized) => Rng.fromJSON(serialized),
	},
}
