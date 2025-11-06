# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for "Chrono", an providing utilities for YouTubers and Livestreams!

The web application serves as a marketing site and will include additional functionality in the future. Built with SvelteKit and modern web technologies.

Locally, the dev server is always running at http://localhost:5173/

## Architecture

### Monorepo Structure

- `apps/web/` - Main SvelteKit application
- `packages/db/` - Shared database schema, types, and client
- Turborepo manages the build pipeline and caching

## Development Commands

All commands should be run from the repository root:

- `pnpm dev` - Start all development servers in watch mode
- `pnpm build` - Build all apps for production
- `pnpm test` - Run all tests (requires dev servers running)
- `pnpm tdd` - Run tests in watch mode
- `pnpm lint` - Lint all code
- `pnpm format` - Format all code with Prettier

## Web App (apps/web/)

### Web App Specific Commands

From `apps/web/` directory:

- `pnpm test:unit` - Run Vitest unit tests
- `pnpm test` - Run all Playwright tests
- `pnpm check` - Type check with svelte-check
- `pnpm db:generate-migrations` - Generate Drizzle migrations
- `pnpm db:migrate` - Apply migrations locally **⚠️ NEVER RUN THIS YOURSELF - USER ONLY**

#### Database Migration Policy

**CRITICAL: NEVER run database migrations (`pnpm db:migrate` or `pnpm --filter @repo/web db:migrate`) yourself under ANY circumstances.**

When making database schema changes:

1. ✅ Update the schema files in `packages/db/src/schema/`
2. ❌ DO NOT run `pnpm db:migrate` or attempt to apply migrations
3. ✅ Let the user handle migration generation and application
4. ❌ DO NOT manually edit migration files or the migration journal
5. ❌ DO NOT run migration-related bash commands

The user will handle all migration operations manually.

### Tech Stack

- **Framework**: SvelteKit with Svelte 5 (Runes)
- **Styling**: Tailwind CSS v4 + `shadcn-svelte` components
- **Auth**: Arctic for OAuth, custom session management according to best practices defined by Lucia
- **Schema Validation**: Zod
- **Database**: SQLite with Drizzle ORM
- **Testing**: Playwright (e2e/integration), Vitest (unit)
- **Icons**: Unplugin Icons
- **Deployment**: Cloudflare Workers

### Key Directories

- `src/lib/components/` - Reusable Svelte components
- `src/lib/server/` - Server-side utilities (auth, db)
- `src/routes/` - SvelteKit file-based routing
- `src/mocks/` - MSW handlers for testing
- `tests/` - Playwright test suites

### Database Schema

Shared across apps via `@repo/db` package, located in `packages/db/src/schema/`:

- `auth.ts` - Users and sessions tables for authentication

### Authentication

- Session-based auth with secure cookie handling
- OAuth providers configured via Arctic
- Mock authentication available for development/testing
- Protected routes handled via hooks

### Testing Strategy

- **Playwright**: e2e and integration tests, run with dev servers
- **Vitest**: Unit tests, can run independently
- **MSW**: HTTP mocking during tests and development (when `MSW_ENABLED=true`)

You MUST start Playwright specs / tests by navigating to a page, then:

```ts
await expect(page.getByTestId('hydrated')).toBeVisible()
```

This ensures our app is fully interactive.

Prefer tests that tell a bigger story: Have the "user" (as Playwright) interact with the application for a realistic flow.

#### Example

Test the happy path in a single test:

- "I expect to see this", then "I type this", then "I click this", then "I expect to see this"
- AVOID individual tests for a single action "I expect to see this"

#### Meaningful tests

Even the Vitest tests have to be meaningful!

**NEVER write tests that only verify types or function existence**. TypeScript already guarantees these at compile time. Tests MUST verify actual behaviour, logic, edge cases, or integration points.

Examples of USELESS tests to NEVER write:

- `expect(typeof someFunction).toBe('function')` - TypeScript already checks this
- `expect(someFunction).toBeDefined()` - TypeScript already checks this
- `expect(someObject).toHaveProperty('field')` - TypeScript already checks this

If you have to write a unit test, it must answer: "What bug would this catch that TypeScript can't?"

EVERY test should have a realistic to see fail.

### Environment Setup

- Copy `.env.test` to create `.env` and `.env.local`
- Required for development due to auth secrets and database configuration
- MSW can be enabled with `MSW_ENABLED=true` for API mocking

### Important Notes

- Use pnpm as package manager
- Node.js 24.11.0 required (managed by Mise)
- MSW handlers require manual dev server restart when modified
- All tests require dev servers running except unit tests

### Tailwind CSS v4 Configuration

- **No tailwind.config file**: Tailwind v4 does not use a traditional config file
- **CSS-based configuration**: All Tailwind configuration is done in CSS files
- **Main config location**: `apps/web/src/app.css` contains the Tailwind configuration
- **Theme customization**: Custom colors, fonts, and utilities are defined in `app.css` using `@theme` blocks
- **Use `cn` utility**: Import from `$lib/utils` for conditional class application with proper merging
- **Prefer Tailwind classes**: Always use Tailwind utility classes instead of inline styles or custom CSS in `<style>` blocks when possible

### Typography Standards

- **Pretty quotes**: Always use curly quotes (“”) and apostrophes (‘’) for user-facing text instead of straight quotes ("") and apostrophes ('')
- **User-facing text**: This applies to Svelte components, form messages, error messages, and any content that will be rendered client-side
- **Example**: Use "You’re right!" instead of "You're right!" or "That’s correct!" instead of "That's correct!"
- As an LLM, you have difficulty telling curly apostrophes and straight apostrophes apart. **NEVER** try to change any type of code to another. If you think something is not compiling, you MUST ask the user for clarification.

#### Vanilla HTML forms

Always prefer web standards, including using the `form` element for GET actions like filtering and pagination, and POST actions like updating a record.

**Use Superforms**, which leverages SvelteKit which respects web standards and falls back to native form behaviour even when JavaScript is disabled.

### TypeScript Coding Standards

- **Always use `type` over `interface`**: Prefer `type Props = {}` instead of `interface Props {}`
- **Type definitions**: Consistently use type aliases for all object type definitions
- **Function declarations**: Prefer arrow functions `const someMethod = () => {}` over function declarations `function someMethod() {}`
- No `console.log`s committed in the code! You may use them for debugging purposes, but only use `console.info`, `console.warn`, `console.error` appropriately for code meant to remain in the codebase.
- **Performance measurement**: Always use `performance.now()` instead of `Date.now()` for timing operations. The Performance API provides high-resolution timestamps (microsecond precision) specifically designed for performance measurement, whereas `Date.now()` is lower resolution and intended for timestamps.
- **NEVER explicitly use `undefined`**. If you have to assign a value, use `null` instead. NEVER call a method like `antiPattern(undefined)`. You may use `antiPattern()`
- **NEVER** try format code or check for whitespace yourself with weird commands like `sed`. We have a dedicated formatter you can use at the end of your tasks.

## QA

0. NEVER try to run the server yourself, NEVER check whether we are in a git repo. You MUST assume we are running the dev server on a different window, and http://localhost:5173 is reachable, interactive and serving our app. You MUST assume we are already in a git monorepo.
1. At the end of a task where you changed or added code, you MUST ensure `pnpm check` runs successfully at the root of the project.
2. At the end of a task where you changed or added code, you MUST ensure `pnpm build` runs successfully at the root of the project.
3. At the end of a task where you changed or added code, you MUST ensure `pnpm test` runs successfully at the root of the project.
4. At the end of a task where you changed or added code, you MUST ensure `pnpm lint` runs successfully at the root of the project.
5. At the end of a task where you changed or added code, you MUST ensure any related spec or test files are updated. This includes Playwright `.spec.ts` files and Vitest `.test.ts` files.

You may spawn agents to run these tasks in parallel.

# Svelte MCP server

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user.
You MUST keep calling it until no issues or suggestions are returned UNLESS they are about experimental features. For example, ignore issue about top-level `await` or Svelte Remote Functions, since they are explicitly enabled in `apps/web/svelte.config.js`.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Project-specific notes

### Creating new routes and page metadata

If you've created a new route, make sure you have added a corresponding `+page.server.ts`.

Every route needs one with, at the very least, an exported `load` method returning an object with a `meta` key. For example, at minimum we should have a `+page.server.ts` like this:

```ts
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async () => ({
	meta: {
		title: '[THE ROUTE TITLE]',
		description: '[A LONG ACCURATE DESCRIPTION FOR SEO BEST PRACTICES]',
	},
})
```

# Cloudflare Documentation MCP server

Get up to date reference information on Cloudflare.

Use this when researching ways to accomplish a task with automation or infrastructure.

Also use this when debugging an issue that seems to work locally, but not when deployed to Cloudflare.

## Available Cloudflare Documentation MCP Tools:

### 1. search_cloudflare_documentation

**Description:** Search the Cloudflare documentation.

#### Prompt Examples

- `Do Cloudflare Workers costs depend on response sizes? I want to serve some images (map tiles) from an R2 bucket and I'm concerned about costs.`
- `How many indexes are supported in Workers Analytics Engine? Give an example using the Workers binding api.`
- `Can you give me some information on how to use the Workers AutoRAG binding`

### Playwright MCP Server

At the end of writing user-facing code, you MUST use the Playwright MCP Server to confirm the UX is as expected. You MUST keep using it until all issues are resolved.

You MUST Playwright's accessibility tree to navigate the DOM. **NEVER** take screenshots.

When writing Playwright tests / specs, you MUST use the Playwright MCP server to confirm we are using the correct Locators / selectors.

You MUST use accessible Locators. NEVER use test ids: no `data-testid` in the source code, no `getByTestId` in the tests.

AVOID writing source code just for tests.

When writing tests NEVER `waitForTimeout`. Playwright assertions have built-in waits, there must always be a better way than an explicitly waiting.

When evaluating page performance, you MUST consider the Core Web Vitals. Layout Shift is unacceptable. Prevent it with common techniques like specifying width and height on images.

# Agents

## Working with Agendas

**CRITICAL**: When the user mentions an "Agenda" or you see `.johnnify/AGENDA.md`:

1. **ALWAYS use the `agenda-implementer` agent** via the Task tool
2. **NEVER do the work yourself** - let the agent handle task execution
3. The agent will:
   - Work through tasks systematically
   - Update `.johnnify/AGENDA.md` with progress/timestamps
   - Update `.johnnify/CURRENT_TASK.md` to track active work
   - Check in with the user between tasks
4. **Do NOT** launch the agent and then take over - wait for the agent to complete or ask for guidance
5. **Do NOT** manually update AGENDA.md or CURRENT_TASK.md - the agent handles this

If you find yourself writing code related to an an `.johnnify/AGENDA.md`, STOP and use the agenda-implementer agent instead.
