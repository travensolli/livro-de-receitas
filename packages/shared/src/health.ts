import { z } from 'zod';

/** Resposta de `GET /api/health`: estado da API e da conexão com o banco. */
export const healthResponseSchema = z.object({
  api: z.literal('ok'),
  database: z.enum(['ok', 'unavailable']),
  /** Versão em execução (tag da imagem), útil para conferir o que está no ar. */
  version: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
