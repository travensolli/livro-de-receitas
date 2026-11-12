import type { HealthResponse } from '@livro/shared';
import type { FastifyPluginCallback } from 'fastify';

export interface HealthRouteOptions {
  version: string;
  /** Resolve se o banco responde; rejeita caso contrário. */
  checkDatabase: () => Promise<void>;
}

export const healthRoutes: FastifyPluginCallback<HealthRouteOptions> = (app, options, done) => {
  app.get('/health', async (request, reply) => {
    let database: HealthResponse['database'] = 'ok';
    try {
      await options.checkDatabase();
    } catch (error) {
      request.log.warn({ err: error }, 'Banco de dados indisponível');
      database = 'unavailable';
    }

    const body: HealthResponse = { api: 'ok', database, version: options.version };
    return reply.code(database === 'ok' ? 200 : 503).send(body);
  });

  done();
};
