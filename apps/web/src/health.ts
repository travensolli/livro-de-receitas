import { healthResponseSchema, type HealthResponse } from '@livro/shared';

/**
 * Consulta a saúde da API. Retorna `null` quando a API não responde ou responde algo inesperado.
 * Uma resposta 503 ainda traz o corpo com o estado do banco, então é lida normalmente.
 */
export async function fetchHealth(signal?: AbortSignal): Promise<HealthResponse | null> {
  try {
    const response = await fetch('/api/health', {
      signal,
      headers: { Accept: 'application/json' },
    });
    const parsed = healthResponseSchema.safeParse(await response.json());
    return parsed.success ? parsed.data : null;
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
    return null;
  }
}
