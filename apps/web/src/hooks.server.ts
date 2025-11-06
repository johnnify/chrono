import type {Handle} from '@sveltejs/kit'
import {sequence} from '@sveltejs/kit/hooks'

import {MSW_ENABLED} from '$env/static/private'
import {dependencyInjectionHandle} from './hooks/dependencyInjectionHandle'
import {authHandle} from './hooks/authHandle'
import {protectedRoutesHandle} from './hooks/protectedRoutesHandle'
import {preloadHandle} from './hooks/preloadHandle'

// Hijack server-side requests with Mock Service Worker
// useful for local development and testing edge cases!
// All tests under `tests/integration` are meant to run with MSW_ENABLED === 'true'
if (MSW_ENABLED === 'true') {
	void import('./mocks/mswNodeServer').then(({mswNodeServer}) => {
		mswNodeServer.listen()
	})
}

export const handle: Handle = sequence(
	dependencyInjectionHandle,
	preloadHandle,
	authHandle,
	protectedRoutesHandle,
)
