import { z } from 'zod';

/** Quantas receitas cada página de `GET /api/recipes` traz. */
export const RECIPES_PAGE_SIZE = 24;

/** Parâmetros de `GET /api/recipes`. */
export const recipeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
});

export type RecipeListQuery = z.infer<typeof recipeListQuerySchema>;

export const categoryRefSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export type CategoryRef = z.infer<typeof categoryRefSchema>;

/** Uma receita na lista: o suficiente para montar o card. */
export const recipeSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: categoryRefSchema,
  /** Tempo total em minutos. */
  prepMinutes: z.number().int().positive().nullable(),
  /** Quanto rende, como "6 porções". */
  yield: z
    .object({
      quantity: z.number().positive(),
      unit: z.string(),
    })
    .nullable(),
  /** Foto principal no tamanho de card, quando houver. */
  mainPhoto: z
    .object({
      url: z.string(),
      alt: z.string(),
    })
    .nullable(),
});

export type RecipeSummary = z.infer<typeof recipeSummarySchema>;

/** Resposta de `GET /api/recipes`: receitas publicadas, das mais recentes para as mais antigas. */
export const recipeListResponseSchema = z.object({
  items: z.array(recipeSummarySchema),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export type RecipeListResponse = z.infer<typeof recipeListResponseSchema>;
