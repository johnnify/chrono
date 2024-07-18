<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte'
	import {Button} from '$lib/components/ui/button'
	import Logo from '$lib/components/Logo.svelte'
</script>

<main class="container flex grow flex-col gap-12">
	<section
		class="flex min-h-[40svh] grow flex-col items-center justify-center gap-12 text-center"
	>
		<Logo class="fill-primary w-24" />

		<PageTitle>Chrono</PageTitle>

		<section class="flex flex-col gap-2 text-xl lg:text-2xl">
			<p>Livestream utilities for creators!</p>
		</section>

		<Button href="/livestreams">Start creating!</Button>
	</section>
</main>
