# H01 Fundação: briefing para o Claude Code

**História:** Como dono, quero repositório, CI/CD e servidor configurados, para que cada entrega vá ao ar automaticamente.
**Sprint:** 1 · **Pontos:** 8 · **Branch:** `feature/H01-fundacao`, criada a partir de `develop`

Leia o `CLAUDE.md` antes de começar e siga as regras de Gitflow e de commits dele.

## Objetivo

Deixar o esqueleto do projeto pronto, testado e publicável. Nenhuma funcionalidade de receitas entra aqui: elas vêm na H02, H03, H05 e H06.

## Escopo

1. Monorepo com pnpm workspaces: `apps/web`, `apps/api` e `packages/shared`, com scripts na raiz para `dev`, `lint`, `typecheck`, `test` e `build`.
2. `apps/api`: Fastify com `GET /api/health`, que informa o status da API e da conexão com o banco. Drizzle configurado, com uma primeira migração mínima e um comando para aplicar migrações.
3. `apps/web`: React + Vite com uma página inicial provisória com o nome do site, que mostra o resultado de `/api/health`.
4. Qualidade: ESLint, Prettier, checagem de tipos (`tsc --noEmit`) e Vitest, com pelo menos um teste na API e um no front.
5. Docker:
    - Dockerfile da API, multi-stage, com imagem final enxuta
    - imagem do Caddy com o build estático do front embutido
    - `docker-compose.yml` de produção com Caddy, API e PostgreSQL, com volume persistente para o banco e um volume reservado para as fotos da H06
    - `docker-compose.dev.yml` com o PostgreSQL para desenvolvimento local
    - migrações aplicadas automaticamente a cada deploy, antes de a API subir
6. Caddy: domínio vindo de variável de ambiente, HTTPS automático, `/api/*` encaminhado para a API e fallback do SPA para `index.html`.
7. GitHub Actions:
    - `ci.yml`: em pull requests para `develop` e `main`, roda install, lint, typecheck, test e build
    - `deploy.yml`: em push para `main`, constrói as imagens, publica no GitHub Container Registry e faz o deploy no Droplet por SSH (`docker compose pull` e `docker compose up -d`)
8. `infra/server-setup.sh`: script idempotente para preparar o Droplet (swap de 2 GiB, firewall liberando apenas as portas 22, 80 e 443, pasta da aplicação e acesso ao registry).
9. `docs/deploy.md`: lista dos GitHub Secrets e variáveis necessários, como preparar o servidor e como voltar para a tag anterior em caso de problema.
10. `.env.example` com todas as variáveis, e a seção "Comandos" do `CLAUDE.md` atualizada.

## Critérios de aceite

- [ ] Repositório com front, API, configuração do servidor, `CLAUDE.md` e `.claude/settings.json`
- [ ] Pull requests para `develop` rodam lint, checagem de tipos e testes; o merge da release em `main` publica no Droplet sem passo manual
- [ ] Site abre em HTTPS no domínio, com certificado renovado automaticamente
- [ ] Migrações versionadas no repositório e aplicadas no deploy
- [ ] Nenhum segredo no repositório

Ficam com o Gabriel, fora do código: proteger as branches no GitHub e ativar os backups diários do Droplet.

## Fora do escopo

Receitas, login, upload de fotos e qualquer tela além da provisória.

## Dependências do Gabriel

O deploy real depende de domínio, Droplet e secrets, descritos em `docs/sprints/sprint-1/tarefas-do-gabriel.md`. Se algo ainda não existir, deixe tudo pronto e testado localmente e liste no PR exatamente o que falta para o primeiro deploy.

## Entrega

Pull request de `feature/H01-fundacao` para `develop`, com descrição em português, instruções para testar localmente e o checklist acima. Sem coautoria ou assinatura de ferramenta.
