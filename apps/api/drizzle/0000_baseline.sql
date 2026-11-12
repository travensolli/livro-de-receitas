-- Migração de base (H01): marca o início do histórico de migrações e valida o fluxo de
-- aplicação no deploy. As tabelas de receitas chegam a partir da H02, geradas com
-- `pnpm db:generate` a partir de src/db/schema.ts.
SELECT 1;
