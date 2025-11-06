# @repo/db

Shared database schema and utilities for the Chrono monorepo.

## Overview

This package provides centralized database schema definitions, types, and constants that are shared across multiple apps in the monorepo

## Usage

### Create the database client

The package exports a `createDrizzleDb` helper that accepts a D1Database instance:

```ts
import {createDrizzleDb} from '@repo/db'

const db = createDrizzleDb(platform.env.DB)
```

### Import schema tables

```ts
import {users, sessions} from '@repo/db/schema'
```

## Technology

- **Database**: SQLite with Drizzle ORM
- **Type Safety**: Full TypeScript support with inferred types from schema

## Note

Schema migrations are still managed from `apps/web` via Drizzle Kit for generation, Wrangler for application
