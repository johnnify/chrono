<script lang="ts">
	import {setTheme, setMode, theme} from 'mode-watcher'
	import AppIcon from '~icons/mdi/clock-outline'
	import LoginIcon from '~icons/mdi/login'
	import TimestampsIcon from '~icons/hugeicons/csv-01'
	import UserCircle from '~icons/mdi/user-circle-outline'

	import {page} from '$app/state'
	import {Button} from '$lib/components/ui/button'
	import ThemeToggleIcon from './ThemeToggleIcon.svelte'
	import SideNav from './SideNav.svelte'

	const cycleTheme = () => {
		if (theme.current === 'dark') {
			setTheme('light')
			setMode('light')
		} else {
			setTheme('dark')
			setMode('dark')
		}
	}
</script>

<header
	class="bg-background/70 sticky top-0 z-30 mb-[5svh] flex h-(--header-height) items-center gap-2 px-(--padding-inline) py-4 backdrop-blur-lg lg:gap-4"
>
	<div class="-ml-4 flex shrink-0 grow items-center">
		<Button variant="ghost" href="/" class="font-serif text-xl font-bold">
			<AppIcon class="size-5.5" /> Chrono
		</Button>
	</div>

	<nav aria-label="Header" class="flex">
		<Button variant="ghost" href="/timestamps">
			<TimestampsIcon />
			<span class="sr-only sm:not-sr-only">Timestamps</span>
		</Button>

		{#if page.data.userRole !== 'guest'}
			<Button variant="ghost" href="/profile" aria-label="profile">
				<UserCircle />
			</Button>
		{:else}
			<Button variant="ghost" href="/login">
				<LoginIcon />
				<span class="sr-only sm:not-sr-only">Log in</span>
			</Button>
		{/if}
	</nav>
	<Button
		variant="ghost"
		size="icon"
		onclick={cycleTheme}
		aria-label="toggle light/dark theme"
	>
		<ThemeToggleIcon />
	</Button>
	<SideNav />
</header>

<style>
	header {
		view-transition-name: header;
	}
</style>
