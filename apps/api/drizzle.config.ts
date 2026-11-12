import { defineConfig } from 'drizzle-kit';

// `pnpm db:generate` compara o schema com o último snapshot e cria a próxima migração em drizzle/.
// As migrações são aplicadas pelo nosso migrador (src/db/migrate.ts), em dev e em produção.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
});
