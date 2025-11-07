<script lang="ts">
	import UserCircle from '~icons/mdi/user-circle-outline'
	import UploadIcon from '~icons/material-symbols/upload'
	import LoginIcon from '~icons/material-symbols-light/login'
	import LogoutIcon from '~icons/material-symbols-light/logout'

	import {beforeNavigate} from '$app/navigation'
	import {page} from '$app/state'
	import {Button, buttonVariants} from '$lib/components/ui/button'
	import * as Sheet from '$lib/components/ui/sheet'
	import {cn} from '$lib/utils'
	import {logout} from '$lib/auth.remote'
	import AnimatedHamburger from './AnimatedHamburger.svelte'

	let menuOpen = $state(false)

	beforeNavigate(async (navigation) => {
		// Close the Sheet, if it's open
		if (navigation.type !== 'leave' && menuOpen) {
			menuOpen = false
		}
	})
</script>

{#snippet titledLineBreak(title: string)}
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="border-border w-full border-t"></span>
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background text-muted-foreground px-2">{title}</span>
		</div>
	</div>
{/snippet}

<div>
	<Sheet.Root bind:open={menuOpen}>
		<Sheet.Trigger
			class={cn(buttonVariants({variant: 'ghost', size: 'icon'}), 'flex')}
			aria-label="Open navigation menu"
		>
			<AnimatedHamburger open={menuOpen} />
		</Sheet.Trigger>
		<Sheet.Content side="right" class="z-50">
			<Sheet.Header>
				<Sheet.Title>Navigation</Sheet.Title>
			</Sheet.Header>
			{@render titledLineBreak('main')}
			<ul class="items-center gap-1 pl-2">
				<li>
					<Button variant="ghost" href="/timestamps">
						<UploadIcon />
						Timestamps
					</Button>
				</li>
			</ul>

			{@render titledLineBreak('account')}
			<ul class="items-center gap-1 pl-2">
				{#if page.data.userRole !== 'guest'}
					<li>
						<Button variant="ghost" href="/profile">
							<UserCircle />
							Profile
						</Button>
					</li>
					<li>
						<form {...logout.for('side-nav')}>
							<Button variant="ghost" disabled={!!logout.pending}>
								<LogoutIcon />
								Sign out
							</Button>
						</form>
					</li>
				{:else}
					<li>
						<Button variant="ghost" href="/login">
							<LoginIcon />
							Login
						</Button>
					</li>
				{/if}
			</ul>

			{@render titledLineBreak('legal')}
			<ul class="items-center gap-1 pl-2">
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
