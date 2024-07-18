<script lang="ts">
	import OutboundLink from '$lib/components/OutboundLink.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import SectionTitle from '$lib/components/SectionTitle.svelte'
</script>

<main class="container">
	<PageTitle class="mb-6 lg:mb-12 lg:text-6xl">Privacy Policy</PageTitle>

	<section class="prose prose-lg dark:prose-invert sm:prose-xl md:prose-2xl">
		<SectionTitle>Introduction</SectionTitle>

		<p>
			Your privacy is paramount to us here at the <strong>Chrono</strong>
			app, and we are committed to protecting your personal data. This policy outlines
			how we collect and use information in connection with your use of the Chrono
			app, including but not limited to account creation and management features.
		</p>

		<SectionTitle>Information We Collect</SectionTitle>

		<p>
			To personalize and enhance your experience on Chrono, we collect the
			following your <strong>display name</strong> and
			<strong>avatar</strong> when you create an account.
		</p>

		<p>
			Your display name and avatar may be visible to other users. Stay safe, and
			be mindful of what you share regarding those aspects!
		</p>

		<p>
			We also collect your <strong>email</strong> which we will never willingly share
			with anyone else. We need your email for authentication purposes. We will never
			divulge or sell your email address to third parties.
		</p>

		<SectionTitle>How We Use Your Information</SectionTitle>

		<p>
			We use your email for authentication purposes, and relaying critical
			information. We may never even send you a single email.
		</p>
		<p>
			Other information you provide, such as your <strong>display name</strong>
			and <strong>avatar</strong>, may be associated with any other content you
			create.
		</p>

		<SectionTitle>Information Sharing</SectionTitle>

		<p>
			We will never sell your personal information. Your personal information is
			not shared with third parties, except as strictly necessary to comply with
			legal obligations. We intentionally try to choose well-known and secure
			third-party service that are compatible with this policy.
		</p>

		<SectionTitle>Your Rights and Choices</SectionTitle>

		<p>
			You have rights over your personal information, including the right to
			access, correct, or delete your data. You can exercise these rights at any
			time by accessing your account settings or contacting us directly.
		</p>

		<SectionTitle>Amendments to This Policy</SectionTitle>

		<p>
			We may update this privacy policy to reflect changes to our information
			practices. Refer to this page for its latest version.
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
