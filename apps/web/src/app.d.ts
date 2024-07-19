import type {LivestreamsRepoInterface} from '$lib/repos/livestreams/LivestreamsRepoInterface'

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
