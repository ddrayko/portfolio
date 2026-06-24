import { dbType, type DbType } from './config'
import postgres from 'postgres'
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

let _db: any = null

function createPostgresInstance(url: string) {
  const sql = postgres(url, { prepare: false })
  return drizzlePg(sql, { schema })
}

function createSqliteInstance(url: string) {
  try {
    const Database = require('better-sqlite3')
    const { drizzle: drizzleSqlite } = require('drizzle-orm/better-sqlite3')
    const path = url.replace(/^sqlite:\/\//, '').replace(/^file:/, '')
    const sqliteDb = new Database(path)
    return drizzleSqlite(sqliteDb, { schema })
  } catch {
    throw new Error(
      'SQLite support requires "better-sqlite3". Run: npm install better-sqlite3 @types/better-sqlite3'
    )
  }
}

const createDbInstance = () => {
  if (_db) return _db

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!databaseUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("⚠️ DATABASE_URL or POSTGRES_URL is not set. Using mock database for local development.")
      const mockResult = { rows: [], command: '', rowCount: 0 }
      const mockQuery = () => Promise.resolve(mockResult)
      const mock: any = new Proxy(() => Promise.resolve([]), {
        get: (_, prop) => {
          if (prop === 'then') return (onFullfilled: any) => onFullfilled([])
          if (typeof prop === 'string' && ['select', 'insert', 'update', 'delete', 'from', 'where', 'orderBy', 'limit', 'values', 'set', 'returning', 'onConflictDoUpdate'].includes(prop)) {
            return mock
          }
          return mockQuery
        },
        apply: () => Promise.resolve([]),
      })
      return mock
    }
    throw new Error("DATABASE_URL or POSTGRES_URL is not set. Please check your environment variables.")
  }

  switch (dbType) {
    case 'sqlite':
      _db = createSqliteInstance(databaseUrl)
      break
    case 'postgresql':
    default:
      _db = createPostgresInstance(databaseUrl)
      break
  }

  return _db
}

export const db = new Proxy({} as any, {
  get(_, prop, receiver) {
    const instance = createDbInstance()
    return Reflect.get(instance, prop, receiver)
  },
})

export { dbType }
export type { DbType }
