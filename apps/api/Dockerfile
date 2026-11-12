# syntax=docker/dockerfile:1

# Imagem da API. O estágio "build" compila; a imagem final leva só o bundle, as migrações
# e as dependências de produção. Construída no CI: nada é compilado no servidor.
# Contexto: raiz do repositório (docker build -f apps/api/Dockerfile .).

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
    pnpm install --frozen-lockfile --store-dir /pnpm-store --filter @livro/api...

COPY packages/shared packages/shared
COPY apps/api apps/api
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm --filter @livro/api build \
 && pnpm --filter @livro/api deploy --prod --legacy --store-dir /pnpm-store /out


FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# O npm só serve para instalar pacotes; em produção é só superfície de ataque a mais.
# A pasta do volume de fotos (H06) já nasce com dono "node" para a API poder gravar nela.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
 && mkdir -p /data/photos \
 && chown node:node /data/photos

COPY --from=build /out ./

ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}

USER node
EXPOSE 3000
CMD ["node", "--enable-source-maps", "dist/server.js"]
