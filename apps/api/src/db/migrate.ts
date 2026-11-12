// Aplica as migrações pendentes de drizzle/. Usado em dev (`pnpm db:migrate`) e no deploy,
// pelo serviço `migrate` do docker-compose.yml, antes de a API subir.
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { loadDatabaseUrl } from '../env';
import { createDatabase } from './client';

// Em dev este arquivo está em src/db/; no build, em dist/db/. Nos dois casos a pasta
// de migrações fica dois níveis acima.
const migrationsFolder = resolve(import.meta.dirname, '../../drizzle');

const { db, pool } = createDatabase(loadDatabaseUrl());

try {
  await migrate(db, { migrationsFolder });
  console.log('Migrações aplicadas.');
} catch (error) {
  console.error('Falha ao aplicar as migrações:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
