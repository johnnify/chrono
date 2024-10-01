<script lang="ts">
	import {page} from '$app/stores'
	import {Button} from '$lib/components/ui/button'
	import MobileNav from './SideNav.svelte'
	import ThemeToggleIcon from './ThemeToggleIcon.svelte'
</script>

<header
	class="bg-background/60 px-inline sticky top-0 z-30 mb-[5svh] flex items-center gap-4 py-4 backdrop-blur"
>
	<MobileNav />
	<div class="flex-1">
		<Button variant="ghost" href="/" class="font-fancy px-0 text-xl font-black">
			Chrono
		</Button>
	</div>
	<nav
		class="flex-none items-center gap-1 sm:flex sm:gap-2"
		aria-label="Header"
	>
		{#if !$page.data.session}
			<ul>
				<li>
					<Button variant="ghost" href="/login">login</Button>
				</li>
			</ul>
		{/if}
		<!-- Desktop nav -->
		<ul class="hidden items-center gap-1 sm:flex sm:gap-2">
			<li>
				<Button variant="ghost" href="/livestreams">livestreams</Button>
			</li>
			{#if $page.data.session}
				<li>
					<Button variant="ghost" href="/profile">profile</Button>
				</li>
			{/if}
			<li>
				<Button variant="ghost" href="/about">about</Button>
			</li>
		</ul>
	</nav>
	<Button
		variant="ghost"
		size="icon"
		onclick={() => {
			if (window.toggleTheme) {
				window.toggleTheme()
			}
		}}
		class="active:translate-y-0"
	>
		<ThemeToggleIcon class="h-5 w-5 sm:h-6 sm:w-6" />
	</Button>
</header>

<style lang="postcss">
	header {
		view-transition-name: header;
	}
</style>
