import tsEslint from 'typescript-eslint'

// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
	ignorePatterns: ['apps/**', 'packages/**'],
	extends: ['eslint:recommended', 'prettier', 'eslint-config-turbo'],
	plugins: ['only-warn'],
	globals: {
		React: true,
		JSX: true,
	},
	env: {
		node: true,
	},
	ignorePatterns: [
		// Ignore dotfiles
		'.*.js',
		'node_modules/',
		'dist/',
	],
	overrides: [
		{
			files: ['*.js?(x)', '*.ts?(x)'],
		},
	],
	parser: tsEslint.parser,
	parserOptions: {
		project: true,
	},
}
