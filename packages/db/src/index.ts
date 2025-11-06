import {drizzle} from 'drizzle-orm/d1'
import type {D1Database} from '@cloudflare/workers-types'

export const createDrizzleDb = (platformDb: D1Database) => drizzle(platformDb)

export type DrizzleDb = ReturnType<typeof createDrizzleDb>

// Re-export constants
export * from './constants'
// Re-export schema
export * from './schema'
// Re-export types
export * from './types'
