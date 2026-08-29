import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

// One .env at the repo root is shared by the API and the execution service, so
// the JWT secrets and the execution token cannot drift out of sync between them.
// Local first: dotenv never overwrites an already-set variable, so loading the
// service-local file first is what lets it override the shared root values.
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

/**
 * All configuration comes from environment variables — never hardcode secrets.
 * The process refuses to boot if anything required is missing or malformed.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),

  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),

  EXECUTION_SERVICE_URL: z.string().default('http://localhost:4001'),
  EXECUTION_SERVICE_TOKEN: z.string().default('dev-execution-token'),
  EXECUTION_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  EXECUTION_MAX_OUTPUT_BYTES: z.coerce.number().int().positive().default(64_000),
  MAX_CODE_LENGTH: z.coerce.number().int().positive().default(50_000),

  /**
   * Password-reset delivery. 'console' needs no account and prints the code to
   * the server log — the flow is fully usable that way in development.
   */
  SMS_PROVIDER: z.enum(['console', 'twilio', 'msg91']).default('console'),
  RESET_CODE_TTL_MINUTES: z.coerce.number().int().positive().default(10),
  RESET_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),

  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),

  MSG91_AUTH_KEY: z.string().optional(),
  MSG91_TEMPLATE_ID: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  // eslint-disable-next-line no-console
  console.error(`Invalid environment configuration:\n${issues}`);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
