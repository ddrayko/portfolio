import { defineConfig } from 'drizzle-kit'

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

function detectDialect(): 'postgresql' | 'sqlite' | 'mysql' {
  if (process.env.DB_TYPE) {
    const t = process.env.DB_TYPE.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (['postgresql', 'postgres', 'supabase', 'neon'].includes(t)) return 'postgresql'
    if (['sqlite', 'sqlite3'].includes(t)) return 'sqlite'
    if (t === 'mysql') return 'mysql'
  }

  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) return 'postgresql'
  if (url.startsWith('sqlite://') || url.startsWith('file:')) return 'sqlite'
  if (url.startsWith('mysql://')) return 'mysql'

  return 'postgresql'
}

const dialect = detectDialect()

// drizzle-kit needs the raw file path for SQLite (no sqlite:// prefix)
const dbUrl = dialect === 'sqlite' ? url.replace(/^sqlite:\/\//, '').replace(/^file:/, '') : url

export default defineConfig({
  schema: dialect === 'sqlite' ? './db/schema-sqlite.ts' : './db/schema-pg.ts',
  out: './drizzle',
  dialect,
  dbCredentials: {
    url: dbUrl,
  },
})
