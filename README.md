# Chrono

![e2e](https://github.com/johnnify/chrono/actions/workflows/playwright.yaml/badge.svg)
![integration](https://github.com/johnnify/chrono/actions/workflows/playwright-msw.yaml/badge.svg)
![unit](https://github.com/johnnify/chrono/actions/workflows/vitest.yaml/badge.svg)

Monorepo for Chrono, the app with Livestream utilities for creators!

## What's inside?

This [Turborepo](https://turbo.build/repo/docs) includes the following packages/apps:

- `web`: [SvelteKit](https://kit.svelte.dev/) implementation of the web app
- `pb`: The [PocketBase](https://pocketbase.io/) backend, including a CMS for admins

## Notable tech

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [bun](https://bun.sh/) as the package manager
- [Prettier](https://prettier.io) for code formatting
- [ESLint](https://eslint.org/) for code linting
- [Docker](https://www.docker.com/) for containerization, namely for the PocketBase stack
- More in the individual apps' READMEs!

## Local development

Most actions can and should be run from the root of the repository, thanks to Turborepo and as specified in [turbo.json](https://turbo.build/repo/docs/reference/configuration).

`bun i` & `bun dev` will get you there, but only after you've created your own `.env`, and given Docker permissions to mount directories inside `./apps/pb` as volumes!

### Install dependencies

```sh
bun i
```

Will install dependencies for everything in the monorepo!

### Environment variables

Apps can have their own `.env` / `.env.local` / `.env.test` files. Only `.env.test` is committed to version control, so you should use that as a template to create your own `.env` & `.env.local`.

### Give Docker Settings -> Resources -> File Sharing permissions

The PocketBase stack requires Docker to be available, and have permission to mount some directories within our `apps/pb`. With the Docker Desktop app for Mac running, you can go to its **Settings -> Resources -> File Sharing** tab, and add the to `apps/pb` in the **Virtual file shares** section.

If you only want to do this once in your life, you may allowlist all paths under where you keep your code, like `/Users/your-username/Code`... but that depends on how YOLO you're feeling.

### Run all dev servers on watch mode

```sh
bun dev
```

Navigate to [localhost:5137](http://localhost:5173/) to see the core web app.

This command includes spinning up a local database, so everything should **just work**!

... If not, make sure you've created your own `.env` / `.env.local` files, as described elsewhere in this README.

Keep in mind that the local database is spun up using the [Turso CLI](https://docs.turso.tech/cli/introduction), which does require you to login / authenticate with your Turso account. Weird choice by them, but hey, at least it works with a free account!

### Run all tests

**With the dev servers running**, run:

```sh
bun run test
```

### Update all dependencies in all apps

To update all dependencies, including all `package.json`s to point to their latest versions, run:

```sh
bun run update
```

Interactive UI will let you select which packages you actually want to update! Recommended to do all of them anyway.

### Other handy scripts

Refer to the [package.json](./package.json) & [turbo.json](./turbo.json) for more scripts, namely linting & formatting.

## Architectural Decision Records

We keep track of particularly important, or arguable, architecture decisions in the [docs/adr](./docs/adr) directory.

[Read more about Architectural Decision Records](./docs/adr/0001-record-architecture-decisions.md), including how create new ones, or supercede old ones.
