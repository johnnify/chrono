<script lang="ts">
	import type {Snippet} from 'svelte'
	import type {OnNavigate} from '@sveltejs/kit'
	import '@fontsource-variable/newsreader'
	import '../app.css'

	import {Toaster} from '$lib/components/ui/sonner'
	import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import {page} from '$app/stores'
	import {onNavigate} from '$app/navigation'

	const defaultMeta = {
		title: 'Chrono ⏱️',
		description:
			'Chrono is the original app with livestream utilities for creators!',
		ogImageUrl: '/og.jpg',
	}
	type Props = {
		children: Snippet
	}
	let {children}: Props = $props()

	// Meta tags
	let title = $derived(
		$page.data.meta?.title
			? `${$page.data.meta.title} ⏱️ Chrono`
			: defaultMeta.title,
	)
	let description = $derived(
		$page.data.meta?.description
			? $page.data.meta.description
			: defaultMeta.description,
	)
	let ogImageUrl = $derived(
		`${$page.url.origin}${
			$page.data.meta?.ogImageUrl
				? $page.data.meta.ogImageUrl
				: defaultMeta.ogImageUrl
		}`,
	)

	const shouldViewTransition = (navigation: OnNavigate) =>
		document.startViewTransition &&
		navigation.from?.url.href !== navigation.to?.url.href &&
		(navigation.to?.route.id !== '/images/[id]/edit' ||
			navigation.from?.route.id !== navigation.to?.route.id)

	onNavigate((navigation) => {
		if (shouldViewTransition(navigation)) {
			if (navigation.delta && navigation.delta < 0) {
				document.documentElement.dataset.back = 'true'
			} else {
				document.documentElement.removeAttribute('data-back')
			}

			return new Promise((resolve) => {
				if (document.startViewTransition) {
					document.startViewTransition(async () => {
						resolve()
						await navigation.complete
					})
				}
			})
		}
	})

	$effect(() => {
		// Add data-testid now that our app is hydrated
		// We have Playwright "wait" for this before starting any test
		document.documentElement.dataset.testid = 'hydrated'
	})
</script>

<svelte:head>
	<title>{title}</title>

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Chrono" />
	<meta property="og:url" content={$page.url.href} />

	<meta property="og:image" content={ogImageUrl} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Header />
<div class="flex grow flex-col justify-center">
	{@render children()}
	<Toaster />
</div>
<Footer />
