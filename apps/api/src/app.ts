import Fastify, { type FastifyServerOptions } from 'fastify';
import { healthRoutes } from './routes/health';

export interface AppOptions {
  version: string;
  checkDatabase: () => Promise<void>;
  logger?: FastifyServerOptions['logger'];
}

export function buildApp({ version, checkDatabase, logger = false }: AppOptions) {
  const app = Fastify({ logger });

  // Todas as rotas ficam sob /api, que é o prefixo que o Caddy encaminha para a API.
  void app.register(healthRoutes, { prefix: '/api', version, checkDatabase });

  return app;
}
