import type {Config} from 'tailwindcss'
import {fontFamily} from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography'
import containerQueries from '@tailwindcss/container-queries'

const config: Config = {
	content: ['./src/**/*.{html,svelte,ts}'],
	darkMode: ['class', '[data-theme="dark"]'],
	safelist: ['dark'],
	theme: {
		fontFamily: {
			sans: ['var(--font-sans)', ...fontFamily.sans],
			fancy: ['var(--font-fancy)', ...fontFamily.serif],
		},
		container: {
			center: true,
			padding: 'var(--padding-inline)',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
				},
			},
			boxShadow: {
				sm: 'var(--shadow-1)',
				DEFAULT: 'var(--shadow-2)',
				md: 'var(--shadow-3)',
				lg: 'var(--shadow-4)',
				xl: 'var(--shadow-5)',
				'2xl': 'var(--shadow-6)',
			},
			padding: {
				inline: 'var(--padding-inline)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	plugins: [containerQueries, typography],
}

export default config
