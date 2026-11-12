# syntax=docker/dockerfile:1

# Imagem do Caddy com o build estático do front embutido em /srv.
# Construída no CI: nada é compilado no servidor.
# Contexto: raiz do repositório (docker build -f infra/caddy/Dockerfile .).

ARG NODE_VERSION=26

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /repo

# Mesma versão do pnpm declarada em "packageManager" no package.json da raiz.
COPY package.json ./
RUN npm install -g "pnpm@$(node -p "require('./package.json').packageManager.split('@')[1].split('+')[0]")"

# Dependências primeiro, para aproveitar o cache enquanto só o código muda.
COPY pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store --filter @livro/web...

COPY packages/shared packages/shared
COPY apps/web apps/web
RUN pnpm --filter @livro/web build


FROM caddy:2.11-alpine
COPY infra/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/web/dist /srv
