# H05 Login e área administrativa: briefing para o Claude Code

**História:** Como dono, quero entrar com minha conta e ter acesso exclusivo à área administrativa.
**Sprint:** 1 · **Pontos:** 5 · **Branch:** `feature/H05-login-admin`, a partir de `develop`
**Depende de:** H01 integrada em `develop`; credencial OAuth do Google criada pelo Gabriel (veja `tarefas-do-gabriel.md`).

Leia antes: `CLAUDE.md`, `docs/design.md` e `docs/modelo-de-dados.md`.

## Objetivo

Login com Google para todos, com o papel de admin reservado ao Gabriel. A mesma base atende os colaboradores nas próximas sprints (H18) sem retrabalho.

## Decisão técnica

Autenticação com **Better Auth**, rodando dentro da API, com o adaptador do Drizzle e o provedor Google. É uma biblioteca TypeScript, sem dependência de framework, com sessões guardadas no nosso PostgreSQL e suporte a e-mail e senha para quando a H19 chegar. Siga a documentação atual da biblioteca para a integração com o Fastify e para o formato das tabelas; se ela recomendar algo diferente do descrito aqui, prefira a documentação e registre a diferença no PR.

## Escopo

1. Better Auth configurado na API, com as rotas de autenticação sob `/api/auth/*` e as tabelas criadas por migração do Drizzle.
2. Campo `role` no usuário (`admin` ou `collaborator`, padrão `collaborator`). Quem entra com o e-mail definido em `ADMIN_EMAIL` recebe `admin`.
3. Na API, um `preHandler` que exige admin e responde 401 sem sessão e 403 sem permissão. Rotas de escrita de receitas (H06) usam ele.
4. No front:
    - botão Entrar no cabeçalho, que inicia o login com Google
    - depois de entrar, o cabeçalho mostra o nome da pessoa e o botão Sair
    - rota `/admin` protegida: sem sessão, leva ao login; colaborador vê uma mensagem clara de que a área é restrita
    - `/admin` com uma página inicial simples, que será o ponto de partida da H06
5. Variáveis novas no `.env.example` e no `docs/deploy.md`: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` e `ADMIN_EMAIL`.
6. Anotar no PR o endereço de retorno exato que o Google precisa ter cadastrado, em produção e em desenvolvimento local.

## Critérios de aceite

- [ ] Botão Entrar com Google; só o e-mail definido em `ADMIN_EMAIL` recebe o papel de admin
- [ ] Páginas `/admin` e rotas de escrita da API recusam quem não é admin
- [ ] Sessão em cookie seguro (httpOnly, Secure, SameSite) e botão de sair
- [ ] A mesma base de contas atende os colaboradores na H18, sem retrabalho

## Fora do escopo

Cadastro por e-mail e senha (H19), política de privacidade e exclusão de conta (H21), qualquer tela para colaboradores além da mensagem de acesso restrito.

## Entrega

PR de `feature/H05-login-admin` para `develop`, com o endereço de retorno do Google, as variáveis novas e o checklist acima.
