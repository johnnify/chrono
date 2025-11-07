import {expect, describe, it, vi} from 'vitest'
import type {RequestEvent} from '@sveltejs/kit'

import {isProtectedRoute, protectedRoutesHandle} from './protectedRoutesHandle'

describe('isProtectedRoute', () => {
	describe('returns `true` for all protected routes:', () => {
		const protectedRoutes = ['/admin']

		protectedRoutes.forEach((route) => {
			it(route, () => {
				expect(isProtectedRoute(route)).toBeTruthy()
			})
		})
	})

	describe('unprotected routes', () => {
		it('allows access to the login page', () => {
			expect(isProtectedRoute('/login')).toBeFalsy()
			expect(isProtectedRoute('/login?error=url-mismatch')).toBeFalsy()
		})

		it('allows access to the auth callback routes', () => {
			expect(isProtectedRoute('/auth')).toBeFalsy()
			expect(isProtectedRoute('/auth/callback/sso')).toBeFalsy()
			expect(
				isProtectedRoute('/auth/callback/sso?code=just-a-test'),
			).toBeFalsy()
		})
	})
})

describe('protectedRoutesHandle', () => {
	it('returns a redirect when for regular users trying to get to /admin', async () => {
		const event = {
			url: new URL('https://our-origin.com/admin'),
			locals: {
				session: {
					id: 'test-session',
					userId: 'test-user',
					expiresAt: new Date(),
					userRole: 'user',
				},
				userRole: 'user',
			},
		} as RequestEvent
		const resolve = vi.fn()
		const result = await protectedRoutesHandle({event, resolve})

		expect(resolve).not.toBeCalled()
		expect(result.status).toBe(307)
	})

	it('resolves the /admin route normally, when the user IS an admin', async () => {
		const event = {
			url: new URL('https://our-origin.com/admin'),
			locals: {
				session: {
					id: 'test-session',
					userId: 'test-user',
					expiresAt: new Date(),
					userRole: 'admin',
				},
				userRole: 'admin',
			},
		} as RequestEvent
		const resolve = vi.fn()
		await protectedRoutesHandle({event, resolve})

		expect(resolve).toBeCalled()
	})
})
