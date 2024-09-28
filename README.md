# Chrono

![e2e](https://github.com/johnnify/chrono/actions/workflows/playwright.yaml/badge.svg)
![integration](https://github.com/johnnify/chrono/actions/workflows/playwright-msw.yaml/badge.svg)
![unit](https://github.com/johnnify/chrono/actions/workflows/vitest.yaml/badge.svg)

Monorepo for Chrono, the app with Livestream utilities for creators!

## What's inside?

This [Turborepo](https://turbo.build/repo/docs) includes the following packages/apps:

- `web`: [SvelteKit](https://kit.svelte.dev/) implementation of the web app
- `db`: Helpers to run a local SQLite database, using the [Turso CLI](https://docs.turso.tech/cli/introduction)

## Notable tech

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [pnpm](https://pnpm.io/) as the package manager
- [Prettier](https://prettier.io) for code formatting
- [ESLint](https://eslint.org/) for code linting
- More in the individual apps' READMEs!

## Local development

Most actions can and should be run from the root of the repository, thanks to Turborepo and as specified in [turbo.json](https://turbo.build/repo/docs/reference/configuration).

`pnpm i` & `pnpm dev` will get you there, but only after you've created your own `.env`!

### Install dependencies

```sh
pnpm i
```

Will install dependencies for everything in the monorepo!

### Environment variables

Apps can have their own `.env` / `.env.local` / `.env.test` files. Only `.env.test` is committed to version control, so you should use that as a template to create your own `.env` & `.env.local`.

### Run all dev servers on watch mode

```sh
pnpm dev
```

Navigate to [localhost:5137](http://localhost:5173/) to see the core web app.

This command includes spinning up a local database, so everything should **just work**!

... If not, make sure you've created your own `.env` / `.env.local` files, as described elsewhere in this README.

Keep in mind that the local database is spun up using the [Turso CLI](https://docs.turso.tech/cli/introduction), which does require you to login / authenticate with your Turso account. Weird choice by them, but hey, at least it works with a free account!

### Run all tests

**With the dev servers running**, run:

```sh
pnpm run test
```

### Update all dependencies in all apps

To update all dependencies, including all `package.json`s to point to their latest versions, run:

```sh
pnpm run update
```

Interactive UI will let you select which packages you actually want to update! Recommended to do all of them anyway.

### Other handy scripts

Refer to the [package.json](./package.json) & [turbo.json](./turbo.json) for more scripts, namely linting & formatting.

## Architectural Decision Records

We keep track of particularly important, or arguable, architecture decisions in the [docs/adr](./docs/adr) directory.

[Read more about Architectural Decision Records](./docs/adr/0001-record-architecture-decisions.md), including how create new ones, or supercede old ones.
