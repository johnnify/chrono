export type SvelteError = {
	status: number
	body: {
		message?: string
	}
}

export const isSvelteError = (error: unknown): error is SvelteError =>
	typeof error === 'object' &&
	error !== null &&
	'status' in error &&
	'body' in error
