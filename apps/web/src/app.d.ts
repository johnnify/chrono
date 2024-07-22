import type {Session, User} from 'lucia'
import type {LivestreamsRepoInterface} from '$lib/repos/livestreams/LivestreamsRepoInterface'
import type {UsersRepoInterface} from '$lib/repos/users/UsersRepoInterface'

declare global {
	// fresh API just dropped, let's extend Document
	interface Document {
		startViewTransition?(callback: () => Promise<void>): void
	}
	interface CSSStyleDeclaration {
		viewTransitionName?: string
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
			session: Session | null
			usersRepo: UsersRepoInterface
			livestreamsRepo: LivestreamsRepoInterface
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		namespace Superforms {
			type Message = {
				type: 'error' | 'success'
				text: string
			}
		}
	}
}

export {}
