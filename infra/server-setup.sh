#!/usr/bin/env bash
# Prepara o Droplet para rodar o Livro de Receitas. Idempotente: pode ser executado de novo
# a qualquer momento, e só ajusta o que estiver faltando.
#
# Uso, como root no servidor (passo a passo em docs/deploy.md):
#   bash server-setup.sh /root/livro-deploy.pub
#
# Para o servidor baixar imagens privadas do GitHub Container Registry, informe também
# um token com permissão read:packages:
#   read -rsp 'Token do GHCR: ' GHCR_TOKEN && export GHCR_TOKEN
#   GHCR_USER=<usuario-do-github> bash server-setup.sh /root/livro-deploy.pub
#
# O que o script faz:
#   1. swap de 2 GiB (o Droplet tem só 1 GiB de RAM)
#   2. firewall (ufw) liberando apenas as portas 22, 80 e 443
#   3. usuário "deploy", no grupo docker, com a chave pública de deploy
#   4. pasta da aplicação em /opt/livro-de-receitas
#   5. login no GitHub Container Registry, se GHCR_USER e GHCR_TOKEN forem informados
set -euo pipefail

APP_DIR=/opt/livro-de-receitas
DEPLOY_USER=${DEPLOY_USER:-deploy}
SWAP_FILE=/swapfile
SWAP_SIZE=2G
PUBKEY_FILE=${1:-}

log() { printf '\n==> %s\n' "$*"; }
fail() {
  printf 'Erro: %s\n' "$*" >&2
  exit 1
}

[[ $EUID -eq 0 ]] || fail "rode como root (ex.: sudo bash $0 ...)."
command -v docker > /dev/null || fail "Docker não encontrado. Crie o Droplet com a imagem Docker do Marketplace."
docker compose version > /dev/null 2>&1 || fail "o plugin 'docker compose' não está instalado."
if [[ -n $PUBKEY_FILE ]]; then
  [[ -r $PUBKEY_FILE ]] || fail "não consegui ler a chave pública em $PUBKEY_FILE."
  ssh-keygen -l -f "$PUBKEY_FILE" > /dev/null 2>&1 || fail "$PUBKEY_FILE não parece uma chave pública SSH."
fi

# 1. Swap ---------------------------------------------------------------------
log "Swap de $SWAP_SIZE em $SWAP_FILE"
if [[ ! -f $SWAP_FILE ]]; then
  fallocate -l "$SWAP_SIZE" "$SWAP_FILE"
  chmod 600 "$SWAP_FILE"
  mkswap "$SWAP_FILE" > /dev/null
fi
if ! swapon --show=NAME --noheadings | grep -qx "$SWAP_FILE"; then
  swapon "$SWAP_FILE"
fi
if ! grep -qE "^${SWAP_FILE}[[:space:]]" /etc/fstab; then
  echo "$SWAP_FILE none swap sw 0 0" >> /etc/fstab
fi
# Usa o swap só como reserva, para não deixar o servidor lento à toa.
echo 'vm.swappiness=10' > /etc/sysctl.d/99-livro-de-receitas.conf
sysctl -q -p /etc/sysctl.d/99-livro-de-receitas.conf
swapon --show

# 2. Firewall -----------------------------------------------------------------
# O reset remove regras antigas (a imagem Docker da DigitalOcean libera 2375 e 2376).
# Obs.: o Docker publica portas por fora do ufw; por isso só o Caddy publica portas
# (80 e 443) no docker-compose.yml, e o PostgreSQL fica acessível apenas na rede interna.
log "Firewall: apenas 22, 80 e 443"
if ! command -v ufw > /dev/null; then
  apt-get update -qq
  apt-get install -y -qq ufw > /dev/null
fi
ufw --force reset > /dev/null
ufw default deny incoming > /dev/null
ufw default allow outgoing > /dev/null
ufw allow 22/tcp > /dev/null
ufw allow 80/tcp > /dev/null
ufw allow 443/tcp > /dev/null
ufw allow 443/udp > /dev/null # HTTP/3
ufw --force enable > /dev/null
ufw status verbose

# 3. Usuário de deploy --------------------------------------------------------
log "Usuário $DEPLOY_USER"
if ! id -u "$DEPLOY_USER" > /dev/null 2>&1; then
  useradd --create-home --shell /bin/bash "$DEPLOY_USER"
fi
usermod -aG docker "$DEPLOY_USER"
deploy_home=$(getent passwd "$DEPLOY_USER" | cut -d: -f6)
if [[ -n $PUBKEY_FILE ]]; then
  install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$deploy_home/.ssh"
  authorized_keys="$deploy_home/.ssh/authorized_keys"
  touch "$authorized_keys"
  key=$(< "$PUBKEY_FILE")
  if ! grep -qxF "$key" "$authorized_keys"; then
    echo "$key" >> "$authorized_keys"
    echo "Chave de deploy adicionada."
  else
    echo "Chave de deploy já estava autorizada."
  fi
  chown "$DEPLOY_USER:$DEPLOY_USER" "$authorized_keys"
  chmod 600 "$authorized_keys"
else
  echo "Nenhuma chave pública informada: authorized_keys de $DEPLOY_USER não foi alterado."
fi

# 4. Pasta da aplicação -------------------------------------------------------
log "Pasta da aplicação em $APP_DIR"
install -d -m 750 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$APP_DIR"
ls -ld "$APP_DIR"

# 5. Registry -----------------------------------------------------------------
log "Acesso ao GitHub Container Registry"
if [[ -n ${GHCR_USER:-} && -n ${GHCR_TOKEN:-} ]]; then
  printf '%s' "$GHCR_TOKEN" |
    sudo -u "$DEPLOY_USER" -H docker login ghcr.io --username "$GHCR_USER" --password-stdin
else
  echo "GHCR_USER e GHCR_TOKEN não informados: login pulado (necessário só se as imagens forem privadas)."
fi

log "Servidor pronto. Próximo passo: cadastrar os secrets e rodar o deploy (docs/deploy.md)."
