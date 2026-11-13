// Banco descartável para testes de integração: cada arquivo de teste cria o seu, com as
// migrações aplicadas, e apaga no fim. Precisa de um PostgreSQL acessível em DATABASE_URL
// (em dev, `pnpm db:up`); o banco apontado por ela não é tocado.
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { createDatabase } from '../db/client';
import { loadDatabaseUrl } from '../env';

const migrationsFolder = resolve(import.meta.dirname, '../../drizzle');

async function runAdmin(baseUrl: string, statement: string): Promise<void> {
  const client = new pg.Client({ connectionString: baseUrl });
  await client.connect();
  try {
    await client.query(statement);
  } finally {
    await client.end();
  }
}

export async function createTestDatabase() {
  const baseUrl = loadDatabaseUrl();
  // Só letras minúsculas, números e "_": o nome entra direto no SQL de CREATE DATABASE.
  const name = `livro_test_${randomUUID().replaceAll('-', '')}`;
  await runAdmin(baseUrl, `CREATE DATABASE ${name}`);

  const url = new URL(baseUrl);
  url.pathname = `/${name}`;
  const database = createDatabase(url.toString());
  await migrate(database.db, { migrationsFolder });

  return {
    ...database,
    async destroy() {
      await database.pool.end();
      await runAdmin(baseUrl, `DROP DATABASE IF EXISTS ${name} WITH (FORCE)`);
    },
  };
}

export type TestDatabase = Awaited<ReturnType<typeof createTestDatabase>>;
