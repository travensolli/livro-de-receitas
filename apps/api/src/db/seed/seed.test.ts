import { asc, count, eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createRecipeRepository } from '../../recipes/repository';
import { createTestDatabase, type TestDatabase } from '../../test/database';
import { ingredients, recipeIngredients, recipeSteps, recipes } from '../schema';
import { seedRecipes } from './data';
import { seedRecipesInto } from './seed';

let database: TestDatabase;

beforeAll(async () => {
  database = await createTestDatabase();
  await seedRecipesInto(database.db);
});

afterAll(async () => {
  await database?.destroy();
});

async function countRows() {
  const [[recipeCount], [ingredientCount], [lineCount], [stepCount]] = await Promise.all([
    database.db.select({ value: count() }).from(recipes),
    database.db.select({ value: count() }).from(ingredients),
    database.db.select({ value: count() }).from(recipeIngredients),
    database.db.select({ value: count() }).from(recipeSteps),
  ]);
  return {
    recipes: recipeCount?.value,
    ingredients: ingredientCount?.value,
    lines: lineCount?.value,
    steps: stepCount?.value,
  };
}

describe('seed de desenvolvimento', () => {
  it('grava as receitas publicadas e pode rodar de novo sem duplicar nada', async () => {
    const first = await countRows();
    await seedRecipesInto(database.db);

    expect(await countRows()).toEqual(first);
    expect(first).toMatchObject({
      recipes: seedRecipes.length,
      lines: seedRecipes.reduce((sum, recipe) => sum + recipe.ingredients.length, 0),
      steps: seedRecipes.reduce((sum, recipe) => sum + recipe.steps.length, 0),
    });
  });

  it('a última receita do arquivo é a mais recente na lista', async () => {
    const { rows } = await createRecipeRepository(database.db).listPublished({
      limit: 24,
      offset: 0,
    });

    expect(rows.map((row) => row.slug)).toEqual(seedRecipes.map((recipe) => recipe.slug).reverse());
  });

  it('ingredientes repetidos entre receitas resolvem para o mesmo item do catálogo', async () => {
    const [salt] = await database.db
      .select({ id: ingredients.id, name: ingredients.name })
      .from(ingredients)
      .where(eq(ingredients.normalizedName, 'sal'));
    const saltLines = await database.db
      .select({ preparation: recipeIngredients.preparation })
      .from(recipeIngredients)
      .innerJoin(recipes, eq(recipes.id, recipeIngredients.recipeId))
      .where(eq(recipeIngredients.ingredientId, salt!.id))
      .orderBy(asc(recipes.publishedAt), asc(recipeIngredients.position));

    // Escondidinho (duas linhas de sal), risoto, macarrão e gallo pinto.
    expect(saltLines.map((line) => line.preparation)).toEqual([
      'para a carne',
      'para o purê',
      null,
      null,
      null,
    ]);
    const [mozzarella] = await database.db
      .select({ name: ingredients.name })
      .from(ingredients)
      .where(eq(ingredients.normalizedName, 'mucarela'));
    expect(mozzarella?.name).toBe('muçarela');
  });
});
