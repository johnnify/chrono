<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte'
	import Logo from '$lib/components/Logo.svelte'
	import HeroButton from '$lib/components/HeroButton.svelte'
</script>

<main class="container flex grow flex-col gap-12">
	<section
		class="flex min-h-[40svh] grow flex-col items-center justify-center gap-12 text-center"
	>
		<Logo class="dark:fill-primary-foreground w-24 fill-rose-900" />

		<PageTitle>Chrono</PageTitle>

		<section class="flex flex-col gap-2 text-xl lg:text-2xl">
			<p>Livestream utilities for creators!</p>
		</section>

		<HeroButton size="lg" href="/livestreams">Start creating!</HeroButton>
	</section>
</main>
