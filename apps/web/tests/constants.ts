import {join} from 'node:path'

export const authCredentialsFile = join(
	import.meta.dirname,
	'auth/loggedIn.json',
)
