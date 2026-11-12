import { z } from 'zod';

const databaseUrl = z.url({ protocol: /^postgres(ql)?$/ });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_HOST: z.string().min(1).default('0.0.0.0'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: databaseUrl,
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  APP_VERSION: z.string().min(1).default('dev'),
});

export type Env = z.infer<typeof envSchema>;

function parse<T extends z.ZodType>(schema: T, source: NodeJS.ProcessEnv): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(`Variáveis de ambiente inválidas:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  return parse(envSchema, source);
}

export function loadDatabaseUrl(source: NodeJS.ProcessEnv = process.env): string {
  return parse(z.object({ DATABASE_URL: databaseUrl }), source).DATABASE_URL;
}
