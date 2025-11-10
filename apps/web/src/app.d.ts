import '@types/dom-speech-recognition'
import 'unplugin-icons/types/svelte'

import type {CloudflareUsersRepo} from '$lib/repos/users/CloudflareUsersRepo'
import type {Session, UserRole} from '$lib/repos/users/UsersRepoInterface'
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
			session: Session | null
			userRole: UserRole
			usersRepo: CloudflareUsersRepo
			rng: Rng
		}
		interface PageData {
			userRole: UserRole
			rng: Rng
		}
		// interface PageState {}
		interface Platform {
			env?: {
				DB: D1Database
				SESSIONS_KV: KVNamespace
			}
		}
	}
}

export {}
