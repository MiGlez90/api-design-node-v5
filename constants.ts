export const ENVS = {
  DEV: 'dev',
  PROD: 'production',
  TEST: 'test',
}

export const NODE_ENVS = {
  DEV: 'development',
  PROD: 'production',
  TEST: 'test',
}

export const DEFAULT_PORT = 3001;

export const DB_PREFIX = 'postgresql://';

export const NUMBER_OF_JWT_CHARS = 32;
export const JWT_CHARS_WARNING = 'Must be chars long';
export const JWT_EXPIRATION = '7d';

export const BCRYPT_ROUNDS = {
  DEFAULT: 12,
  MAX: 20,
  MIN: 10,
}
