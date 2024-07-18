<script lang="ts">
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
	<nav class="flex-none" aria-label="Header">
		<!-- Desktop nav -->
		<ul class="hidden items-center gap-1 sm:flex sm:gap-2">
			<li>
				<Button variant="ghost" href="/about">about</Button>
			</li>
		</ul>
	</nav>
	<Button
		variant="ghost"
		size="icon"
		onclick={() => {
			window.toggleTheme && window.toggleTheme()
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
