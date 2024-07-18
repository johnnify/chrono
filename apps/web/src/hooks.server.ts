import {type Handle} from '@sveltejs/kit'
import {sequence} from '@sveltejs/kit/hooks'
import {MSW_ENABLED} from '$env/static/private'
import {dependencyInjectionHandle} from './hooks/dependencyInjectionHandle'

// Hijack server-side requests with Mock Service Worker
// useful for local development and testing edge cases!
if (MSW_ENABLED === 'true') {
	import('./mocks/mswNodeServer').then(({mswNodeServer}) => {
		mswNodeServer.listen()
	})
}

export const handle: Handle = sequence(dependencyInjectionHandle)
