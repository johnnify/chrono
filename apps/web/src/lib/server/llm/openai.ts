import {OPENAI_API_KEY} from '$env/static/private'
import {createOpenAI} from '@ai-sdk/openai'
import OpenAI from 'openai'

// Meant to be used with Vercel's ai-sdk
export const openaiProvider = createOpenAI({
	apiKey: OPENAI_API_KEY,
})

// Meant to interface with the OpenAI API directly
export const openaiClient = new OpenAI({
	apiKey: OPENAI_API_KEY,
})
