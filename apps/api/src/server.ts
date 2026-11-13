import { buildApp } from './app';
import { createDatabase } from './db/client';
import { loadEnv } from './env';
import { diskPhotoUrl } from './photos/photo-url';
import { createRecipeRepository } from './recipes/repository';

const env = loadEnv();
const database = createDatabase(env.DATABASE_URL);

const app = buildApp({
  version: env.APP_VERSION,
  checkDatabase: database.ping,
  recipes: createRecipeRepository(database.db),
  photoUrl: diskPhotoUrl,
  logger: { level: env.LOG_LEVEL },
});

app.addHook('onClose', async () => {
  await database.pool.end();
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    app.log.info(`${signal} recebido, encerrando`);
    app.close().then(
      () => process.exit(0),
      (error: unknown) => {
        app.log.error(error, 'Falha ao encerrar');
        process.exit(1);
      },
    );
  });
}

try {
  await app.listen({ host: env.API_HOST, port: env.API_PORT });
} catch (error) {
  app.log.fatal(error, 'Falha ao iniciar a API');
  process.exit(1);
}
