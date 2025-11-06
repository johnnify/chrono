<script lang="ts">
	import OutboundLink from '$lib/components/OutboundLink.svelte'
	import PageTitle from '$lib/components/typography/PageTitle.svelte'
	import Paragraph from '$lib/components/typography/Paragraph.svelte'
	import SectionTitle from '$lib/components/typography/SectionTitle.svelte'
</script>

<main class="container grow">
	<PageTitle class="mb-6 lg:mb-12 lg:text-6xl">Terms of Service</PageTitle>

	<section class="prose prose-lg dark:prose-invert sm:prose-xl md:prose-2xl">
		<SectionTitle>Introduction</SectionTitle>

		<Paragraph>
			Thank you for browsing <strong>Chrono</strong>! These terms govern your
			access to and use of our content and functionality.
		</Paragraph>

		<SectionTitle>Account Responsibilities</SectionTitle>

		<Paragraph>
			You are responsible for the information provided at account creation and
			for maintaining the security of your account. This applies whether you
			register directly with us or through third-party login options.
		</Paragraph>
		<Paragraph>
			Your display name and avatar may be visible to other users. Stay safe, and
			be mindful of what you share regarding those aspects!
		</Paragraph>

		<SectionTitle>User Content</SectionTitle>

		<Paragraph
			>The functionality of this app will include content contributed by users.</Paragraph
		>
		<Paragraph>
			You are solely responsible for the content you contribute and agree to not
			infringe on the rights of others or post content that is unlawful or
			objectionable.
		</Paragraph>
		<Paragraph>
			Keep the content fun and inclusive, suitable for people across age groups
			and backgrounds.
		</Paragraph>

		<SectionTitle>Prohibited Conduct</SectionTitle>

		<Paragraph>
			You agree not to misuse the Chrono app or assist others in doing so. This
			includes avoiding any attempts to compromise the app's security or
			integrity.
		</Paragraph>

		<SectionTitle>Termination and Suspension</SectionTitle>

		<Paragraph>
			We reserve the right to suspend or terminate your account if you violate
			these terms or engage in activities that risk legal liability or harm to
			others.
		</Paragraph>

		<SectionTitle>Amendments to These Terms</SectionTitle>

		<Paragraph>
			We may update these terms to reflect changes in our services or legal
			obligations. Refer to this page for the latest version of these terms.
		</Paragraph>

		<SectionTitle>Contact Information</SectionTitle>

		<Paragraph>
			For questions regarding these terms, please contact us at <OutboundLink
				href="https://discord.gg/sUpvwSdgjh"
				>Johnny’s Discord Community</OutboundLink
			>.
		</Paragraph>
	</section>
</main>
