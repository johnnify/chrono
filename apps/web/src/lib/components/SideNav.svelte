<script lang="ts">
	import {beforeNavigate} from '$app/navigation'
	import {page} from '$app/stores'
	import {Button} from '$lib/components/ui/button'
	import * as Sheet from '$lib/components/ui/sheet'
	import AnimatedHamburger from './AnimatedHamburger.svelte'

	let menuOpen = $state(false)

	beforeNavigate(async (navigation) => {
		// Close the Sheet, if it's open
		if (navigation.type !== 'leave' && menuOpen) {
			menuOpen = false
		}
	})
</script>

{#snippet labelledBreak(label)}
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t"></span>
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background text-muted-foreground px-2">{label}</span>
		</div>
	</div>
{/snippet}

<div class="sm:hidden">
	<Sheet.Root bind:open={menuOpen}>
		<Sheet.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="ghost"
				size="icon"
				aria-label="open navigation menu"
			>
				<AnimatedHamburger open={menuOpen} />
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="right" class="z-50">
			<Sheet.Header class="mb-8">
				<Sheet.Title>Navigation</Sheet.Title>
			</Sheet.Header>
			{@render labelledBreak('main')}
			<ul class="grid gap-1 sm:gap-2">
				<li>
					<Button variant="ghost" href="/">Home</Button>
				</li>
				<li>
					<Button variant="ghost" href="/livestreams">Livestreams</Button>
				</li>
				<li>
					<Button variant="ghost" href="/about">About</Button>
				</li>
			</ul>

			{@render labelledBreak('account')}
			<ul class="grid gap-1 sm:gap-2">
				{#if $page.data.session}
					<li>
						<Button variant="ghost" href="/profile">Profile</Button>
					</li>
				{:else}
					<li>
						<Button variant="ghost" href="/login">Login</Button>
					</li>
				{/if}
			</ul>

			{@render labelledBreak('legal')}
			<ul class="grid gap-1 sm:gap-2">
				<li>
					<Button variant="ghost" href="/terms">Terms of Service</Button>
				</li>
				<li>
					<Button variant="ghost" href="/privacy-policy">Privacy Policy</Button>
				</li>
			</ul>
		</Sheet.Content>
	</Sheet.Root>
</div>

<style lang="postcss">
	div {
		view-transition-name: side-nav;
	}
</style>
