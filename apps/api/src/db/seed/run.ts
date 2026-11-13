// Seed de desenvolvimento (`pnpm db:seed`): grava as receitas de exemplo no banco de
// DATABASE_URL. Não entra no build nem na imagem Docker e se recusa a rodar em produção.
import { loadDatabaseUrl } from '../../env';
import { createDatabase } from '../client';
import { seedRecipes } from './data';
import { seedRecipesInto } from './seed';

if (process.env.NODE_ENV === 'production') {
  console.error('O seed de desenvolvimento não roda com NODE_ENV=production.');
  process.exit(1);
}

const { db, pool } = createDatabase(loadDatabaseUrl());

try {
  await seedRecipesInto(db, seedRecipes);
  console.log(`Seed aplicado: ${seedRecipes.length} receitas publicadas.`);
} catch (error) {
  console.error('Falha ao aplicar o seed:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
