import { healthResponseSchema } from '@livro/shared';
import { describe, expect, it } from 'vitest';
import { buildApp, type AppOptions } from './app';
import { diskPhotoUrl } from './photos/photo-url';

// A rota de saúde não consulta receitas: um repositório vazio basta.
const recipeDependencies: Pick<AppOptions, 'recipes' | 'photoUrl'> = {
  recipes: { listPublished: () => Promise.resolve({ rows: [], total: 0 }) },
  photoUrl: diskPhotoUrl,
};

describe('GET /api/health', () => {
  it('responde 200 quando o banco está acessível', async () => {
    const app = buildApp({
      ...recipeDependencies,
      version: 'teste',
      checkDatabase: () => Promise.resolve(),
    });

    const response = await app.inject({ method: 'GET', url: '/api/health' });

    expect(response.statusCode).toBe(200);
    expect(healthResponseSchema.parse(response.json())).toEqual({
      api: 'ok',
      database: 'ok',
      version: 'teste',
    });
    await app.close();
  });

  it('responde 503 e informa o banco indisponível quando a conexão falha', async () => {
    const app = buildApp({
      ...recipeDependencies,
      version: 'teste',
      checkDatabase: () => Promise.reject(new Error('connection refused')),
    });

    const response = await app.inject({ method: 'GET', url: '/api/health' });

    expect(response.statusCode).toBe(503);
    expect(healthResponseSchema.parse(response.json())).toEqual({
      api: 'ok',
      database: 'unavailable',
      version: 'teste',
    });
    await app.close();
  });
});
