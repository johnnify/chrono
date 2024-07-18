<script lang="ts">
	import OutboundLink from '$lib/components/OutboundLink.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import SectionTitle from '$lib/components/SectionTitle.svelte'
</script>

<main class="container">
	<PageTitle class="mb-6 lg:mb-12 lg:text-6xl">Terms of Service</PageTitle>

	<section class="prose prose-lg dark:prose-invert sm:prose-xl md:prose-2xl">
		<SectionTitle>Introduction</SectionTitle>

		<p>
			Thank you for browsing the <strong>Chrono</strong> app! These terms govern
			your access to and use of our content and functionality.
		</p>

		<SectionTitle>Account Responsibilities</SectionTitle>

		<p>
			You are responsible for the information provided at account creation and
			for maintaining the security of your account. This applies whether you
			register directly with us or through third-party login options.
		</p>
		<p>
			Your display name and avatar may be visible to other users. Stay safe, and
			be mindful of what you share regarding those aspects!
		</p>

		<SectionTitle>User Content</SectionTitle>

		<p>
			The functionality of this app will include content contributed by users.
		</p>
		<p>
			You are solely responsible for the content you contribute and agree to not
			infringe on the rights of others or post content that is unlawful or
			objectionable.
		</p>
		<p>
			Keep the content fun and inclusive, suitable for people across age groups
			and backgrounds.
		</p>

		<SectionTitle>Prohibited Conduct</SectionTitle>

		<p>
			You agree not to misuse the Chrono app or assist others in doing so. This
			includes avoiding any attempts to compromise the app’s security or
			integrity.
		</p>

		<SectionTitle>Termination and Suspension</SectionTitle>

		<p>
			We reserve the right to suspend or terminate your account if you violate
			these terms or engage in activities that risk legal liability or harm to
			others.
		</p>

		<SectionTitle>Amendments to These Terms</SectionTitle>

		<p>
			We may update these terms to reflect changes in our services or legal
			obligations. Refer to this page for the latest version of these terms.
		</p>

		<SectionTitle>Contact Information</SectionTitle>

		<p>
			For questions regarding these terms, please contact us at <OutboundLink
				href="https://discord.gg/sUpvwSdgjh"
				>Johnny’s Discord Community</OutboundLink
			>.
		</p>
	</section>
</main>
