import * as dotenv from 'dotenv';
import * as path from 'path';

const nodeEnv = process.env.NODE_ENV ?? 'development';

// Load environment-specific .env file first, then fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: false });

export const env = {
  NODE_ENV: nodeEnv,
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
} as const;

export type Env = typeof env;
