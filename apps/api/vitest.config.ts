import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Os testes de integração leem DATABASE_URL do .env da raiz, como a API em dev.
// Variáveis já definidas no ambiente (no CI, por exemplo) têm prioridade.
const envFile = fileURLToPath(new URL('../../.env', import.meta.url));
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

export default defineConfig({
  test: {
    // Criar o banco e aplicar as migrações leva alguns segundos.
    hookTimeout: 30_000,
  },
});
