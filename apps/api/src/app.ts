import Fastify, { type FastifyServerOptions } from 'fastify';
import type { PhotoUrlBuilder } from './photos/photo-url';
import type { RecipeRepository } from './recipes/repository';
import { healthRoutes } from './routes/health';
import { recipeRoutes } from './routes/recipes';

export interface AppOptions {
  version: string;
  checkDatabase: () => Promise<void>;
  recipes: RecipeRepository;
  photoUrl: PhotoUrlBuilder;
  logger?: FastifyServerOptions['logger'];
}

export function buildApp({
  version,
  checkDatabase,
  recipes,
  photoUrl,
  logger = false,
}: AppOptions) {
  const app = Fastify({ logger });

  // Todas as rotas ficam sob /api, que é o prefixo que o Caddy encaminha para a API.
  void app.register(healthRoutes, { prefix: '/api', version, checkDatabase });
  void app.register(recipeRoutes, { prefix: '/api', recipes, photoUrl });

  return app;
}
