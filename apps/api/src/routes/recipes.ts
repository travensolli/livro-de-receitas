import {
  RECIPES_PAGE_SIZE,
  recipeListQuerySchema,
  type RecipeListResponse,
  type RecipeSummary,
} from '@livro/shared';
import type { FastifyPluginCallback } from 'fastify';
import { z } from 'zod';
import type { PhotoUrlBuilder } from '../photos/photo-url';
import type { PublishedRecipeRow, RecipeRepository } from '../recipes/repository';

export interface RecipeRouteOptions {
  recipes: RecipeRepository;
  photoUrl: PhotoUrlBuilder;
}

export const recipeRoutes: FastifyPluginCallback<RecipeRouteOptions> = (app, options, done) => {
  app.get('/recipes', async (request, reply) => {
    const query = recipeListQuerySchema.safeParse(request.query);
    if (!query.success) {
      return reply.code(400).send({
        error: 'Parâmetros inválidos',
        details: z.flattenError(query.error).fieldErrors,
      });
    }

    const { page } = query.data;
    const { rows, total } = await options.recipes.listPublished({
      limit: RECIPES_PAGE_SIZE,
      offset: (page - 1) * RECIPES_PAGE_SIZE,
    });

    const body: RecipeListResponse = {
      items: rows.map((row) => toSummary(row, options.photoUrl)),
      page,
      pageSize: RECIPES_PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / RECIPES_PAGE_SIZE),
    };
    return body;
  });

  done();
};

function toSummary(row: PublishedRecipeRow, photoUrl: PhotoUrlBuilder): RecipeSummary {
  return {
    slug: row.slug,
    title: row.title,
    category: { slug: row.categorySlug, name: row.categoryName },
    prepMinutes: row.prepMinutes,
    yield:
      row.yieldQuantity !== null && row.yieldUnit !== null
        ? { quantity: row.yieldQuantity, unit: row.yieldUnit }
        : null,
    mainPhoto:
      row.mainPhotoKey !== null
        ? { url: photoUrl(row.mainPhotoKey, 'card'), alt: row.mainPhotoAlt ?? '' }
        : null,
  };
}
