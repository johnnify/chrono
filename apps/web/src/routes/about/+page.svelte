<script lang="ts">
	import OutboundLink from '$lib/components/OutboundLink.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import SectionTitle from '$lib/components/SectionTitle.svelte'
	import Discord from '$lib/components/icons/Discord.svelte'
	import Instagram from '$lib/components/icons/Instagram.svelte'
	import YouTube from '$lib/components/icons/YouTube.svelte'
</script>

<main class="container max-w-prose">
	<PageTitle class="mb-6">About</PageTitle>

	<section class="mb-8 flex flex-col gap-4">
		<p>
			<strong>Chrono</strong> is an app with tools meant for livestream content creators!
			The very first tool is an Agenda -> YouTube timestamp converter!
		</p>

		<p>
			It is <strong>also</strong> part of an <OutboundLink
				href="https://www.youtube.com/@johnnifytech"
				>educational YouTube series</OutboundLink
			> by <OutboundLink href="https://magrippis.com">Johnny</OutboundLink>!
		</p>
	</section>

	<section class="flex flex-col gap-6">
		<SectionTitle>Contact</SectionTitle>
		<p>Reach out, suggest features, and say hi on the socials!</p>
		<ul class="flex gap-8">
			<li>
				<OutboundLink href="https://www.youtube.com/@johnnifytech">
					<YouTube aria-label="YouTube" class="w-16" />
				</OutboundLink>
			</li>
			<li>
				<OutboundLink href="https://discord.gg/sUpvwSdgjh">
					<Discord aria-label="Discord" class="w-16" />
				</OutboundLink>
			</li>
			<li>
				<OutboundLink href="https://www.instagram.com/jmagrippis">
					<Instagram aria-label="Instagram" class="w-16" />
				</OutboundLink>
			</li>
		</ul>
	</section>
</main>
