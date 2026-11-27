import { env as loadEnv } from 'custom-env'
import { z } from 'zod'
import {
  BCRYPT_ROUNDS,
  DB_PREFIX,
  DEFAULT_PORT,
  ENVS,
  JWT_CHARS_WARNING,
  JWT_EXPIRATION,
  NODE_ENVS,
  NUMBER_OF_JWT_CHARS,
} from './constants.ts'

// Define environment
process.env.APP_STAGE = process.env.APP_STAGE || ENVS.DEV

const envSchema = z.object({
  APP_STAGE: z.enum(Object.values(ENVS)).default(ENVS.DEV),
  BCRYPT_ROUNDS: z.coerce
    .number()
    .min(BCRYPT_ROUNDS.MIN)
    .max(BCRYPT_ROUNDS.MAX)
    .default(BCRYPT_ROUNDS.DEFAULT),
  DATABASE_URL: z.string().startsWith(DB_PREFIX),
  JWT_EXPIRES_IN: z.string().default(JWT_EXPIRATION),
  JWT_SECRET: z.string().min(NUMBER_OF_JWT_CHARS, JWT_CHARS_WARNING),
  NODE_ENV: z.enum(Object.values(NODE_ENVS)).default(NODE_ENVS.DEV),
  PORT: z.coerce.number().positive().default(DEFAULT_PORT),
})

export type Env = z.infer<typeof envSchema>
let env: Env

const processEnv = env || process.env;

export const isProd = processEnv.APP_STAGE === ENVS.PROD
export const isDev = processEnv.APP_STAGE === ENVS.DEV
export const isTest = processEnv.APP_STAGE === ENVS.TEST

if (isDev && !env) {
  loadEnv(ENVS.DEV)
} else if (isTest && !env) {
  loadEnv(ENVS.TEST)
} else if (isProd && !env) {
  loadEnv(ENVS.PROD)
}

function getSafeEnv() {
  if (env) return env;

  try {
    env = envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid env var')
      console.error(z.treeifyError(error))

      error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        console.error(`${path}: ${issue.message}`)
      })

      process.exit(1)
    }
  }

  return env
}

getSafeEnv()

export const getIsDev = () => env.APP_STAGE === ENVS.DEV

export const getIsProd = () => env.APP_STAGE === ENVS.PROD

export const getIsTest = () => env.APP_STAGE === ENVS.TEST

export default env
