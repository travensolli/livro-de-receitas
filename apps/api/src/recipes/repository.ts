import { and, count, desc, eq } from 'drizzle-orm';
import type { Database } from '../db/client';
import { categories, recipePhotos, recipes } from '../db/schema';

export interface PublishedRecipeRow {
  slug: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  prepMinutes: number | null;
  yieldQuantity: number | null;
  yieldUnit: string | null;
  mainPhotoKey: string | null;
  mainPhotoAlt: string | null;
}

export interface RecipeRepository {
  /** Receitas publicadas, das mais recentes para as mais antigas, e o total publicado. */
  listPublished(options: {
    limit: number;
    offset: number;
  }): Promise<{ rows: PublishedRecipeRow[]; total: number }>;
}

const isPublished = eq(recipes.status, 'published');

export function createRecipeRepository(db: Database): RecipeRepository {
  return {
    async listPublished({ limit, offset }) {
      const [rows, totals] = await Promise.all([
        db
          .select({
            slug: recipes.slug,
            title: recipes.title,
            categorySlug: categories.slug,
            categoryName: categories.name,
            prepMinutes: recipes.prepMinutes,
            yieldQuantity: recipes.yieldQuantity,
            yieldUnit: recipes.yieldUnit,
            mainPhotoKey: recipePhotos.storageKey,
            mainPhotoAlt: recipePhotos.altText,
          })
          .from(recipes)
          // Publicar exige categoria (H06), então o inner join não esconde nenhuma publicada.
          .innerJoin(categories, eq(recipes.categoryId, categories.id))
          // Há no máximo uma foto principal por receita (índice único parcial).
          .leftJoin(
            recipePhotos,
            and(eq(recipePhotos.recipeId, recipes.id), eq(recipePhotos.role, 'main')),
          )
          .where(isPublished)
          // O id desempata receitas publicadas no mesmo instante, para a paginação ser estável.
          .orderBy(desc(recipes.publishedAt), desc(recipes.id))
          .limit(limit)
          .offset(offset),
        db
          .select({ total: count() })
          .from(recipes)
          .innerJoin(categories, eq(recipes.categoryId, categories.id))
          .where(isPublished),
      ]);

      return { rows, total: totals[0]?.total ?? 0 };
    },
  };
}
