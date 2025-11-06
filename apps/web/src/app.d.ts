import '@types/dom-speech-recognition'
import {D1Database} from '@cloudflare/workers-types'
import 'unplugin-icons/types/svelte'

import type {DbUsersRepo} from '$lib/repos/users/DbUsersRepo'
import type {User} from '$lib/repos/users/UsersRepoInterface'
import type {SessionValidationResult} from '$lib/server/auth'
import type {Rng} from '$lib/Rng'

declare global {
	// fresh API just dropped, let's extend Document
	interface Document {
		startViewTransition?(callback: () => Promise<void>): void
	}

	interface Window {
		toggleTheme?(): void
	}

	// for enhanced images with query params such as w=64
	// https://kit.svelte.dev/docs/images#sveltejs-enhanced-img
	declare module '*&enhanced'

	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null
			session: SessionValidationResult['session']
			usersRepo: DbUsersRepo
			rng: Rng
		}
		interface PageData {
			user?: User | null
			rng: Rng
		}
		// interface PageState {}
		interface Platform {
			env?: {
				DB: D1Database
			}
		}

		namespace Superforms {
			type Message = {
				type: 'error' | 'success'
				text: string
			}
		}
	}
}

export {}
