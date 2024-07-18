<script lang="ts">
	import YouTubeIcon from '$lib/components/icons/YouTube.svelte'
	import GitHubIcon from '$lib/components/icons/GitHub.svelte'
	import DiscordIcon from '$lib/components/icons/Discord.svelte'
	import PulsingHeart from '$lib/components/PulsingHeart.svelte'
	import OutboundLink from '$lib/components/OutboundLink.svelte'
	import Link from './Link.svelte'
</script>

<footer class="px-inline mt-[5svh] flex flex-col items-center gap-2 pb-6">
	<section class="flex gap-2">
		<div class="flex shrink-0 items-center justify-center gap-2">
			Made with
			<PulsingHeart />
			by <OutboundLink href="https://magrippis.com">jmagrippis</OutboundLink>
		</div>

		<OutboundLink href="https://www.youtube.com/@johnnifytech">
			<span class="sr-only">Johnny’s YouTube channel</span>
			<YouTubeIcon class="w-5" />
		</OutboundLink>
		<OutboundLink href="https://github.com/jmagrippis/chrono">
			<span class="sr-only">checkout the source code at the github repo</span>
			<GitHubIcon class="w-5" />
		</OutboundLink>
		<OutboundLink href="https://discord.gg/sUpvwSdgjh">
			<span class="sr-only">Join Johnny's Discord community!</span>
			<DiscordIcon class="w-5" />
		</OutboundLink>
	</section>
	<section>
		Read our <Link class="decoration-primary underline" href="/terms"
			>Terms of Service</Link
		>
		& our
		<Link class="decoration-primary underline" href="/privacy-policy"
			>Privacy Policy</Link
		>
	</section>
</footer>

<style>
	footer {
		view-transition-name: footer;
	}
</style>
