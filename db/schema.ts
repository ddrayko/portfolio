import { dbType } from './config'
import * as schemaPg from './schema-pg'
import * as schemaSqlite from './schema-sqlite'

const selectedSchema = dbType === 'sqlite' ? schemaSqlite : schemaPg

export const {
  projects,
  admins,
  settings,
  siteUpdates,
  versions,
} = selectedSchema

export type { DbType } from './config'
export { dbType } from './config'
