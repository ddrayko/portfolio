export type DbType = 'postgresql' | 'sqlite' | 'mysql' | 'libsql'

export function detectDbType(): DbType {
  if (process.env.DB_TYPE) {
    const t = process.env.DB_TYPE.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (['postgresql', 'postgres', 'supabase', 'neon'].includes(t)) return 'postgresql'
    if (['sqlite', 'sqlite3'].includes(t)) return 'sqlite'
    if (t === 'mysql') return 'mysql'
    if (t === 'libsql') return 'libsql'
  }

  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) return 'postgresql'
  if (url.startsWith('sqlite://') || url.startsWith('file:')) return 'sqlite'
  if (url.startsWith('mysql://')) return 'mysql'
  if (url.startsWith('libsql://')) return 'libsql'

  return 'postgresql'
}

export const dbType: DbType = detectDbType()
