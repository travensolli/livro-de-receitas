# Meu Livro de Receitas

Site público com o acervo de receitas culinárias do Gabriel Travensolli. Visitantes navegam, buscam e filtram receitas. Colaboradores com conta sugerem receitas e cardápios e dão notas de 0 a 5. Nada enviado por colaborador é publicado sem aprovação do dono.

## Como trabalhamos

- Scrum com sprints de 1 semana. Cada história tem um ID (H01, H02...) e critérios de aceite definidos no planejamento.
- Cada história chega como briefing em `docs/sprints/sprint-N/`. Leia o briefing inteiro antes de começar.
- Na dúvida sobre escopo, pergunte antes de implementar. Não acrescente funcionalidades fora do briefing.
- Quando algo depender de contas do Gabriel (domínio, servidor, Google, GitHub), deixe tudo pronto e testado localmente e liste no PR exatamente o que falta.

## Stack

- `apps/web`: React + Vite + TypeScript, build estático servido pelo Caddy
- `apps/api`: Node.js (versão LTS ativa) + TypeScript com Fastify
- `packages/shared`: tipos e validações compartilhados (Zod)
- Banco: PostgreSQL com Drizzle ORM; migrações versionadas no repositório
- Testes com Vitest, lint com ESLint, formatação com Prettier
- Monorepo com pnpm workspaces
- Produção: um Droplet da DigitalOcean com 1 GiB de RAM rodando Docker Compose (Caddy, API e PostgreSQL). A memória é curta: nada é compilado no servidor, as imagens são construídas no CI.
- Fotos: disco do servidor, atrás de uma camada de armazenamento isolada (uma interface), para migrar ao DigitalOcean Spaces sem reescrever a API.

## Gitflow (obrigatório)

- `main` recebe apenas merges de `release/*` e `hotfix/*`. `develop` integra as histórias.
- Cada história nasce em `feature/<ID>-<descricao-curta>` a partir de `develop` (ex.: `feature/H01-fundacao`) e volta por pull request para `develop`.
- Fim de sprint: `release/sprint-N` sai de `develop`, é mergeada em `main` e de volta em `develop` e recebe a tag `vX.Y.Z`. O merge em `main` dispara o deploy.
- Correção urgente em produção: `hotfix/<descricao>` a partir de `main`, mergeada em `main` e em `develop`.
- Nunca faça push direto em `main` ou `develop`. Nunca reescreva o histórico de branches compartilhadas (sem force push).

## Commits e pull requests

- NUNCA inclua coautoria ou assinatura de ferramenta em commits ou pull requests: nada de `Co-Authored-By`, "Generated with Claude Code", emoji de robô ou link de sessão. O `.claude/settings.json` já desliga isso na ferramenta, e esta regra vale de qualquer forma.
- Mensagens no padrão Conventional Commits, em português: `feat(api): cria rota de saúde`.
- Commits pequenos e coesos.
- Descrição do PR em português: o que foi feito, como testar e o checklist dos critérios de aceite.

## Convenções de código

- Nomes no código (variáveis, funções, tabelas, colunas) em inglês; textos da interface em português do Brasil.
- TypeScript em modo strict. Evite `any`; quando for inevitável, justifique em comentário.
- Segredos só em variáveis de ambiente. Mantenha `.env.example` atualizado e nunca faça commit de `.env`.

## Definition of Done

- Critérios de aceite do briefing atendidos
- Lint, checagem de tipos e testes passando localmente e no CI
- Mudanças de interface funcionando no celular e no desktop
- Nenhum segredo no repositório
- PR aberto para `develop` com o checklist preenchido

## Comandos

Atualize esta seção sempre que criar ou mudar scripts do projeto.

Pré-requisitos: Node 26 (`.nvmrc`), pnpm 10 (versão fixada em `packageManager`) e Docker. Todos os comandos rodam na raiz.

- `pnpm install`: instala as dependências do monorepo
- `cp .env.example .env`: cria a configuração local (uma vez; o mesmo `.env` serve ao banco, à API e ao Vite)
- `pnpm db:up` / `pnpm db:down`: sobe e para o PostgreSQL de desenvolvimento (`docker-compose.dev.yml`)
- `pnpm db:migrate`: aplica as migrações pendentes no banco de `DATABASE_URL`
- `pnpm db:generate`: gera uma migração em `apps/api/drizzle/` a partir de `apps/api/src/db/schema.ts`
- `pnpm dev`: API (porta `API_PORT`) e front (Vite, encaminhando `/api` para a API) com recarga automática
- `pnpm lint`: ESLint e checagem do Prettier; `pnpm format` corrige a formatação
- `pnpm typecheck`: `tsc --noEmit` em todos os pacotes
- `pnpm test`: Vitest em todos os pacotes
- `pnpm build`: build de produção da API (`apps/api/dist`) e do front (`apps/web/dist`)
- `docker build -f apps/api/Dockerfile .` e `docker build -f infra/caddy/Dockerfile .`: imagens de produção (o CI faz isso; o servidor nunca compila)
- Deploy, secrets, preparação do servidor e rollback: `docs/deploy.md`
