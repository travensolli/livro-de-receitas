import { RECIPES_PAGE_SIZE, recipeListResponseSchema } from '@livro/shared';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../app';
import { categories, recipePhotos, recipes } from '../db/schema';
import { diskPhotoUrl } from '../photos/photo-url';
import { createRecipeRepository } from '../recipes/repository';
import { createTestDatabase, type TestDatabase } from '../test/database';

let database: TestDatabase;
let app: ReturnType<typeof buildApp>;
let potId: string;

beforeAll(async () => {
  database = await createTestDatabase();
  app = buildApp({
    version: 'teste',
    checkDatabase: database.ping,
    recipes: createRecipeRepository(database.db),
    photoUrl: diskPhotoUrl,
  });
  // A categoria vem da migração de dados, como em produção.
  const [pot] = await database.db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, 'pot'));
  potId = pot!.id;
});

afterAll(async () => {
  await app?.close();
  await database?.destroy();
});

beforeEach(async () => {
  await database.db.delete(recipes);
});

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function insertRecipe(values: {
  slug: string;
  status?: 'draft' | 'published';
  publishedAt?: Date | null;
}) {
  const status = values.status ?? 'published';
  const [recipe] = await database.db
    .insert(recipes)
    .values({
      slug: values.slug,
      title: `Receita ${values.slug}`,
      categoryId: potId,
      prepMinutes: 40,
      yieldQuantity: 6,
      yieldUnit: 'porções',
      servings: 6,
      status,
      publishedAt: values.publishedAt ?? (status === 'published' ? daysAgo(1) : null),
    })
    .returning({ id: recipes.id });
  return recipe!.id;
}

async function getRecipes(url = '/api/recipes') {
  const response = await app.inject({ method: 'GET', url });
  return { response, body: recipeListResponseSchema.parse(response.json()) };
}

describe('GET /api/recipes', () => {
  it('responde lista vazia quando não há receitas publicadas', async () => {
    await insertRecipe({ slug: 'rascunho', status: 'draft' });

    const { response, body } = await getRecipes();

    expect(response.statusCode).toBe(200);
    expect(body).toEqual({
      items: [],
      page: 1,
      pageSize: RECIPES_PAGE_SIZE,
      total: 0,
      totalPages: 0,
    });
  });

  it('lista só as publicadas, das mais recentes para as mais antigas', async () => {
    await insertRecipe({ slug: 'antiga', publishedAt: daysAgo(10) });
    await insertRecipe({ slug: 'rascunho', status: 'draft' });
    await insertRecipe({ slug: 'nova', publishedAt: daysAgo(1) });
    await insertRecipe({ slug: 'meio', publishedAt: daysAgo(5) });

    const { body } = await getRecipes();

    expect(body.items.map((item) => item.slug)).toEqual(['nova', 'meio', 'antiga']);
    expect(body.total).toBe(3);
  });

  it('devolve slug, título, categoria, tempo, rendimento e foto ausente', async () => {
    await insertRecipe({ slug: 'bolo' });

    const { body } = await getRecipes();

    expect(body.items).toEqual([
      {
        slug: 'bolo',
        title: 'Receita bolo',
        category: { slug: 'pot', name: 'Panela do dia a dia' },
        prepMinutes: 40,
        yield: { quantity: 6, unit: 'porções' },
        mainPhoto: null,
      },
    ]);
  });

  it('devolve a foto principal no tamanho de card, ignorando as outras fotos', async () => {
    const recipeId = await insertRecipe({ slug: 'com-foto' });
    await database.db.insert(recipePhotos).values([
      {
        recipeId,
        role: 'gallery',
        altText: 'Fatia no prato',
        storageKey: 'galeria-1',
        width: 1600,
        height: 1200,
      },
      {
        recipeId,
        role: 'main',
        altText: 'Bolo inteiro na forma',
        storageKey: 'principal-1',
        width: 1600,
        height: 2000,
      },
    ]);

    const { body } = await getRecipes();

    expect(body.items).toHaveLength(1);
    expect(body.items[0]?.mainPhoto).toEqual({
      url: '/fotos/principal-1/card.webp',
      alt: 'Bolo inteiro na forma',
    });
  });

  it(`pagina de ${RECIPES_PAGE_SIZE} em ${RECIPES_PAGE_SIZE}`, async () => {
    const total = RECIPES_PAGE_SIZE + 2;
    for (let index = 0; index < total; index += 1) {
      await insertRecipe({ slug: `receita-${index}`, publishedAt: daysAgo(total - index) });
    }

    const first = await getRecipes();
    const second = await getRecipes('/api/recipes?page=2');
    const beyond = await getRecipes('/api/recipes?page=3');

    expect(first.body.items).toHaveLength(RECIPES_PAGE_SIZE);
    expect(first.body.items[0]?.slug).toBe(`receita-${total - 1}`);
    expect(second.body.items.map((item) => item.slug)).toEqual(['receita-1', 'receita-0']);
    expect(second.body).toMatchObject({ page: 2, total, totalPages: 2 });
    expect(beyond.body.items).toEqual([]);
  });

  it.each(['0', '-1', 'abc', '1.5'])('responde 400 para page=%s', async (page) => {
    const response = await app.inject({ method: 'GET', url: `/api/recipes?page=${page}` });

    expect(response.statusCode).toBe(400);
  });
});
