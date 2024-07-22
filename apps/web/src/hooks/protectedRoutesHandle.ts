import {redirect, type Handle} from '@sveltejs/kit'

const isProtectedRoute = (pathname: string) =>
	pathname.startsWith('/livestream') || pathname.startsWith('/profile')

export const protectedRoutesHandle: Handle = async ({event, resolve}) => {
	if (isProtectedRoute(event.url.pathname) && !event.locals.user) {
		redirect(307, '/login')
	}

	return resolve(event)
}
