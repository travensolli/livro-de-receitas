import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

export function createDatabase(connectionString: string) {
  const pool = new pg.Pool({
    connectionString,
    // O servidor tem 1 GiB de RAM: poucas conexões bastam para este volume de acesso.
    max: 5,
    connectionTimeoutMillis: 2_000,
    idleTimeoutMillis: 30_000,
  });

  // Sem este listener, um erro numa conexão ociosa (ex.: o banco reiniciou) derruba o processo.
  pool.on('error', (error) => {
    console.error('Erro em conexão ociosa com o banco:', error.message);
  });

  const db = drizzle({ client: pool, schema });

  async function ping(): Promise<void> {
    await db.execute(sql`select 1`);
  }

  return { db, pool, ping };
}

export type Database = ReturnType<typeof createDatabase>['db'];
