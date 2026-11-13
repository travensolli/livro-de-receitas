import { eq, inArray, sql } from 'drizzle-orm';
import { normalizeName } from '../../lib/normalize';
import type { Database } from '../client';
import { categories, ingredients, recipeIngredients, recipeSteps, recipes } from '../schema';
import { seedRecipes, type SeedRecipe } from './data';

/** A primeira receita do seed é publicada nesta data; cada seguinte, um dia depois. */
const FIRST_PUBLISHED_AT = new Date('2026-11-01T12:00:00-03:00');
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Grava as receitas do seed. Pode rodar quantas vezes quiser: cada receita é localizada pelo
 * slug e tem os dados, ingredientes e passos substituídos; o catálogo de ingredientes é
 * reaproveitado pelo nome normalizado. As categorias vêm das migrações.
 */
export async function seedRecipesInto(db: Database, list: SeedRecipe[] = seedRecipes) {
  await db.transaction(async (tx) => {
    const categoryRows = await tx
      .select({ id: categories.id, slug: categories.slug })
      .from(categories)
      .where(
        inArray(
          categories.slug,
          list.map((recipe) => recipe.categorySlug),
        ),
      );
    const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]));

    // Catálogo: o primeiro nome cadastrado para cada item é o que aparece.
    const catalog = new Map<string, string>();
    for (const recipe of list) {
      for (const [name] of recipe.ingredients) {
        const normalized = normalizeName(name);
        if (!catalog.has(normalized)) catalog.set(normalized, name);
      }
    }
    await tx
      .insert(ingredients)
      .values([...catalog].map(([normalizedName, name]) => ({ name, normalizedName })))
      .onConflictDoNothing({ target: ingredients.normalizedName });
    const ingredientRows = await tx
      .select({ id: ingredients.id, normalizedName: ingredients.normalizedName })
      .from(ingredients)
      .where(inArray(ingredients.normalizedName, [...catalog.keys()]));
    const ingredientIds = new Map(ingredientRows.map((row) => [row.normalizedName, row.id]));

    for (const [index, recipe] of list.entries()) {
      const categoryId = categoryIds.get(recipe.categorySlug);
      if (!categoryId) {
        throw new Error(`Categoria "${recipe.categorySlug}" não existe. Rode pnpm db:migrate.`);
      }

      const values = {
        slug: recipe.slug,
        title: recipe.title,
        description: recipe.description,
        categoryId,
        prepMinutes: recipe.prepMinutes,
        yieldQuantity: recipe.yieldQuantity,
        yieldUnit: recipe.yieldUnit,
        servings: recipe.servings,
        status: 'published' as const,
        publishedAt: new Date(FIRST_PUBLISHED_AT.getTime() + index * ONE_DAY_MS),
      };
      const [saved] = await tx
        .insert(recipes)
        .values(values)
        .onConflictDoUpdate({
          target: recipes.slug,
          set: { ...values, updatedAt: sql`now()` },
        })
        .returning({ id: recipes.id });
      const recipeId = saved!.id;

      await tx.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));
      await tx.delete(recipeSteps).where(eq(recipeSteps.recipeId, recipeId));

      await tx.insert(recipeIngredients).values(
        recipe.ingredients.map(([name, quantity, unit, preparation], position) => ({
          recipeId,
          position: position + 1,
          ingredientId: ingredientIds.get(normalizeName(name))!,
          quantity,
          unit,
          preparation: preparation ?? null,
        })),
      );
      await tx.insert(recipeSteps).values(
        recipe.steps.map(([text, tip], position) => ({
          recipeId,
          position: position + 1,
          text,
          tip: tip ?? null,
        })),
      );
    }
  });
}
