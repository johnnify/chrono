<script lang="ts">
	import OutboundLink from '$lib/components/OutboundLink.svelte'
	import Heading3 from '$lib/components/typography/Heading3.svelte'
	import PageTitle from '$lib/components/typography/PageTitle.svelte'
	import Paragraph from '$lib/components/typography/Paragraph.svelte'
	import SectionTitle from '$lib/components/typography/SectionTitle.svelte'
</script>

<main class="container grow">
	<PageTitle class="mb-6 lg:mb-12 lg:text-6xl">Privacy Policy</PageTitle>

	<section class="prose prose-lg dark:prose-invert sm:prose-xl md:prose-2xl">
		<SectionTitle>Introduction</SectionTitle>

		<Paragraph>
			Your privacy is paramount to us here at <strong>Chrono</strong>, and we
			are committed to protecting your personal data. This policy outlines how
			we collect and use information in connection with your use of the Chrono
			app, including but not limited to account creation and management
			features.
		</Paragraph>

		<SectionTitle>Data Controller</SectionTitle>

		<Paragraph>
			The data controller responsible for your personal information is Ioannis
			"Johnny" Magrippis, operating Chrono from Barcelona, Spain. For data
			protection inquiries, please use the contact information at the bottom of
			this policy.
		</Paragraph>

		<SectionTitle>Information We Collect</SectionTitle>

		<Paragraph>
			To personalize and enhance your experience on Chrono, we collect the
			following your <strong>display name</strong>
			and
			<strong>avatar</strong> when you create an account.
		</Paragraph>

		<Paragraph>
			Your display name and avatar may be visible to other users. Stay safe, and
			be mindful of what you share regarding those aspects!
		</Paragraph>

		<Paragraph>
			We also collect your <strong>email</strong> which we will never willingly share
			with anyone else. We need your email for authentication purposes. We will never
			divulge or sell your email address to third parties.
		</Paragraph>

		<Heading3>Analytics and Performance Data</Heading3>

		<Paragraph>
			We use Cloudflare Web Analytics to understand how visitors use our site
			and improve performance. This service collects anonymous performance
			metrics such as page load times and page views.
		</Paragraph>

		<Paragraph>
			Cloudflare Web Analytics does <em>not</em> use cookies or tracking
			technologies and does <em>not</em> collect personal information.
		</Paragraph>

		<SectionTitle>How We Use Your Information</SectionTitle>

		<Paragraph>
			We use your email for authentication purposes, and relaying critical
			information. We may never even send you a single email. The legal basis
			for processing your email is our <strong>legitimate interest</strong> in providing
			secure authentication and essential service communications.
		</Paragraph>
		<Paragraph>
			Other information you provide, such as your <strong>display name</strong>
			and <strong>avatar</strong>, may be associated with any other content you
			create. By creating an account, you provide <strong>consent</strong> for us
			to process and display this information.
		</Paragraph>
		<Paragraph>
			Analytics data is processed based on our <strong
				>legitimate interest</strong
			>
			in understanding site performance and improving user experience. Since this
			data is anonymous and privacy-preserving, no additional consent is required.
		</Paragraph>

		<SectionTitle>Data Retention</SectionTitle>

		<Paragraph>
			We retain your personal information (email, display name, avatar) for as
			long as your account is active. If you delete your account, your personal
			information will be permanently removed from our systems. Anonymous
			analytics data may be retained indefinitely for statistical purposes.
		</Paragraph>

		<SectionTitle>Information Sharing</SectionTitle>

		<Paragraph>
			We will never sell your personal information. Your personal information is
			not shared with third parties, except as strictly necessary to comply with
			legal obligations. We intentionally try to choose well-known and secure
			third-party service that are compatible with this policy.
		</Paragraph>

		<SectionTitle>Your Rights and Choices</SectionTitle>

		<Paragraph>
			Under data protection laws, including GDPR, you have the following rights
			regarding your personal information:
		</Paragraph>

		<Paragraph>
			<strong>Right to Access:</strong> You can request a copy of your personal data
			we hold.
		</Paragraph>
		<Paragraph>
			<strong>Right to Rectification:</strong> You can correct inaccurate or incomplete
			data through your account settings.
		</Paragraph>
		<Paragraph>
			<strong>Right to Erasure:</strong> You can delete your account and associated
			personal data at any time.
		</Paragraph>
		<Paragraph>
			<strong>Right to Restriction:</strong> You can request we limit how we use
			your data in certain circumstances.
		</Paragraph>
		<Paragraph>
			<strong>Right to Data Portability:</strong> You can request your data in a
			structured, machine-readable format.
		</Paragraph>
		<Paragraph>
			<strong>Right to Object:</strong> You can object to processing based on legitimate
			interests.
		</Paragraph>
		<Paragraph>
			<strong>Right to Withdraw Consent:</strong> Where processing is based on consent,
			you can withdraw it at any time by deleting your account.
		</Paragraph>
		<Paragraph>
			<strong>Right to Lodge a Complaint:</strong> You can file a complaint with
			your local data protection authority if you believe your rights have been violated.
		</Paragraph>

		<Paragraph>
			To exercise these rights, contact us using the information at the bottom
			of this policy or manage your data through your account settings.
		</Paragraph>

		<SectionTitle>International Data Transfers</SectionTitle>

		<Paragraph>
			Chrono uses Cloudflare's infrastructure, which may involve transferring
			your data to servers located outside your country, including the United
			States. Cloudflare implements appropriate safeguards such as Standard
			Contractual Clauses to protect your data during international transfers.
		</Paragraph>

		<SectionTitle>Cookies and Storage</SectionTitle>

		<Paragraph>
			We use essential session cookies and browser storage (localStorage,
			sessionStorage) to maintain your login state and provide core
			functionality. These are strictly necessary for the service to work and do
			not require consent. We do not use tracking cookies or third-party
			advertising cookies.
		</Paragraph>

		<SectionTitle>Amendments to This Policy</SectionTitle>

		<Paragraph>
			We may update this privacy policy to reflect changes to our information
			practices. Refer to this page for its latest version.
		</Paragraph>

		<SectionTitle>Contact Information</SectionTitle>

		<Paragraph>
			For questions regarding these terms, please contact us at <OutboundLink
				href="https://discord.gg/sUpvwSdgjh"
				size="inline">Johnny’s Discord Community</OutboundLink
			>.
		</Paragraph>
	</section>
</main>
