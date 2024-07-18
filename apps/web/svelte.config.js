import adapter from '@sveltejs/adapter-vercel'
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({runtime: 'edge'}),
	},

	compilerOptions: {
		// bits-ui and other shadcn packages use Svelte 4 still :-(
		// https://github.com/huntabyte/bits-ui/issues/287
		// runes: true,
	},
}

export default config
