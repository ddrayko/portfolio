import { dbType } from './config'
import * as schemaPg from './schema-pg'
import * as schemaSqlite from './schema-sqlite'

const schema = dbType === 'sqlite' ? schemaSqlite : schemaPg

type SchemaTables = {
  projects: typeof schemaPg.projects
  admins: typeof schemaPg.admins
  settings: typeof schemaPg.settings
  siteUpdates: typeof schemaPg.siteUpdates
  moments: typeof schemaPg.moments
  versions: typeof schemaPg.versions
}

export const {
  projects,
  admins,
  settings,
  siteUpdates,
  moments,
  versions,
}: SchemaTables = schema as any

export type { DbType } from './config'
export { dbType } from './config'
