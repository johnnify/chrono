import {type Handle} from '@sveltejs/kit'
import {building} from '$app/environment'

const protectedRoutePrefixes = ['/admin']
export const isProtectedRoute = (pathname: string) =>
	protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix))

export const protectedRoutesHandle: Handle = async ({event, resolve}) => {
	if (
		// Allow access everywhere during the build step
		!building &&
		isProtectedRoute(event.url.pathname) &&
		(!event.locals.user ||
			(event.url.pathname.includes('/admin') && !event.locals.user.isAdmin))
	) {
		console.info(`unauthorised access to ${event.url.pathname}, redirecting...`)
		if (event.locals.user) {
			console.info('redirected user', event.locals.user)
		}
		// this used to work with the SvelteKit `redirect` helper, but does not now?
		return new Response(null, {
			status: 307,
			headers: new Headers({Location: '/login'}),
		})
	}

	return resolve(event)
}
