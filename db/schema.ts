import { dbType } from './config'
import * as schemaPg from './schema-pg'
import * as schemaSqlite from './schema-sqlite'

const selectedSchema = dbType === 'sqlite' ? schemaSqlite : schemaPg

export const {
  projets,
  admin,
  settings,
  siteUpdate,
} = selectedSchema
