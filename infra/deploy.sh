#!/usr/bin/env bash
# Atualiza a aplicação no servidor para a versão definida em IMAGE_TAG no .env.
# O workflow de deploy copia este script para /opt/livro-de-receitas e o executa por SSH;
# ele também serve para um rollback manual (veja docs/deploy.md).
set -euo pipefail

cd "$(dirname "$(readlink -f "$0")")"

if [[ ! -f .env || ! -f docker-compose.yml ]]; then
  echo "Faltam .env ou docker-compose.yml em $(pwd)." >&2
  exit 1
fi

tag=$(grep -E '^IMAGE_TAG=' .env | cut -d= -f2-)
echo "==> Baixando as imagens da versão ${tag}"
docker compose pull --quiet

# As migrações rodam com a imagem nova antes de recriar a API.
# Se falharem, o script para aqui e a versão atual continua no ar.
echo "==> Aplicando migrações"
docker compose run --rm migrate

echo "==> Subindo os containers"
docker compose up -d --wait --remove-orphans

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ${tag}" >> deploys.log

# Remove imagens sem uso criadas há mais de 14 dias; as recentes ficam para um rollback rápido.
docker image prune -af --filter until=336h > /dev/null

echo "==> Versão ${tag} no ar"
