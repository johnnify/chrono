import type {Handle} from '@sveltejs/kit'

export const dependencyInjectionHandle: Handle = async ({event, resolve}) => {
	return resolve(event)
}
