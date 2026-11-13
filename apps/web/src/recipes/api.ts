import { recipeListResponseSchema, type RecipeListResponse } from '@livro/shared';

/** Busca uma página de receitas publicadas. Rejeita se a API falhar ou responder fora do contrato. */
export async function fetchRecipes(page = 1, signal?: AbortSignal): Promise<RecipeListResponse> {
  const response = await fetch(`/api/recipes?page=${page}`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`GET /api/recipes respondeu ${response.status}`);
  }
  return recipeListResponseSchema.parse(await response.json());
}
