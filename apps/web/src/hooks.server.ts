import type {Handle} from '@sveltejs/kit'
import {sequence} from '@sveltejs/kit/hooks'

import {dependencyInjectionHandle} from './hooks/dependencyInjectionHandle'
import {authHandle} from './hooks/authHandle'
import {protectedRoutesHandle} from './hooks/protectedRoutesHandle'
import {preloadHandle} from './hooks/preloadHandle'

export const handle: Handle = sequence(
	dependencyInjectionHandle,
	preloadHandle,
	authHandle,
	protectedRoutesHandle,
)
