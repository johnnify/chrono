import {http, passthrough} from 'msw'

export const googleHandlers = [
	http.post('https://oauth2.googleapis.com/token', () => passthrough()),
]
