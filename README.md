# Meu Livro de Receitas

Acervo público de receitas culinárias, com cardápios, notas de colaboradores e curadoria do dono.

O contexto do projeto e as regras de trabalho estão no `CLAUDE.md`. Os briefings de cada sprint ficam em `docs/sprints/`.

## Rodando localmente

Requer Node 26, pnpm 10 e Docker.

```bash
pnpm install
cp .env.example .env
pnpm db:up        # PostgreSQL de desenvolvimento
pnpm db:migrate   # aplica as migrações
pnpm dev          # API e front; o endereço do front aparece no terminal
```

Os demais comandos estão na seção "Comandos" do `CLAUDE.md`. Deploy e operação do servidor: `docs/deploy.md`.
