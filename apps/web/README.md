# Chrono Web

Web app for Chrono, implemented with SvelteKit!

## Notable tech

- Meta framework: [SvelteKit](https://kit.svelte.dev/)
- Styling: [Tailwind](https://tailwindcss.com/) with [shadcn-svelte](https://github.com/huntabyte/shadcn-svelte) & [Unplugin Icons](https://github.com/unplugin/unplugin-icons) for the icons
- Auth: [Lucia](https://lucia-auth.com/)-style auth heavily using [Arctic](https://arcticjs.dev/)
- Schema validation: [Zod 4](https://zod.dev/)
- Browser tests: [Playwright](https://playwright.dev/)
- HTTP request interception & mocking: [MSW](https://mswjs.io/)
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [pnpm](https://pnpm.io/) as the package manager
- [Prettier](https://prettier.io) for code formatting
- [ESLint](https://eslint.org/) for code linting
- [Mise](https://mise.jdx.dev/) for managing [Node](https://nodejs.org/en) versions
- [Drizzle](https://drizzle.dev/) as the ORM for our SQLite database (schema shared via `@repo/db`)

## Local development

`cd` into the directory of this readme, and `pnpm i` & `pnpm dev` should get you there: so long as you've got node setup and have created your own `.env`!

### Install dependencies

```sh
pnpm i
```

Will install dependencies for everything in the monorepo!

### Environment variables

Only `.env.test` is committed to version control, so you should use that as a template to create your own `.env` & `.env.local`.

### Start dev server on watch mode

```sh
pnpm dev
```

Navigate to [localhost:5137](http://localhost:5173/) to see the web app.

## Automated tests

We have two categories of tests:

1. Browser tests with [Playwright](https://playwright.dev/)
2. Unit tests with [Vitest](https://vitest.dev/)

Playwright tests are in the e2e/integration level. Slower, but give us more confidence. Important spec should be covered there.

Vitest tests are on the integration/unit level. Faster, but do your best to avoid covering implementation details.

### Run e2e tests

With the dev servers running, OR with the `PUBLIC_ROOT_URL` environment variable set (to, for example, the production deployment), run:

```sh
pnpm run test:e2e
```

### Run integration tests

**With the dev servers running**, run:

```sh
pnpm run test:integration
```

### Run all Playwright tests

**With the dev servers running** and **no `PUBLIC_ROOT_URL` set**, run:

```sh
pnpm run test
```

### Run unit tests

Anytime, run:

```sh
pnpm run test:unit
```

## Mock Service Worker

We use [MSW](https://mswjs.io/) to mock API requests during tests and local development: So long as there's an `MSW_ENABLED` environment variable set exactly to the string `true`.

Some requests [get passed-through](https://mswjs.io/docs/api/passthrough/) regardless.

You may tweak the handlers or define more in the `src/mocks` directory.

Unlike everything else in this app, **MSW handlers are not automatically reloaded**. When you make changes in the handlers, you must manually restart the dev server.

With `MSW_ENABLED='true'`, you'll see a yellow warning for any non-intercepted request. We should at the very least have a pass-through handler for all requests.

With `MSW_ENABLED='true'`, you can interact with our backend API, without having the actual backend running! This is useful for integration and unit tests, but also during development and demos for edge and error cases.

## Other handy scripts

### Update all dependencies

To update all dependencies, including the `package.json` to point to their latest versions, run:

```sh
pnpm up --latest
```
