import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'
import env, { getIsProd } from '../../env.ts'
import { remember } from '@epic-web/remember'

const createPool = () : Pool => {
  return new Pool({
    connectionString: env.DATABASE_URL,
  })
}

let client: Pool;

if (getIsProd()) {
  client = createPool()
} else {
  client = remember('dbPool', () => createPool())
}

export const db = drizzle({ client, schema })

export default db