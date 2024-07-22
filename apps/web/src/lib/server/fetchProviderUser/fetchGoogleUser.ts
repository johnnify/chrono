export type GoogleApiUser = {
	sub: string
	name: string
	email: string
	picture: string
	email_verified: boolean
}

export const fetchGoogleUser = async (
	accessToken: string,
): Promise<GoogleApiUser> => {
	const googleUserResponse = await fetch(
		'https://openidconnect.googleapis.com/v1/userinfo',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	)

	return googleUserResponse.json()
}
