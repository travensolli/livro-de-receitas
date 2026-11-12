# Deploy

Produção roda num Droplet da DigitalOcean (1 GiB de RAM) com Docker Compose: Caddy (HTTPS e front), API e PostgreSQL. As imagens são construídas no GitHub Actions; o servidor só baixa e executa.

## Como funciona

1. Pull requests para `develop` e `main` rodam o **CI** (`.github/workflows/ci.yml`): lint, tipos, testes, build, migrações num banco limpo e build das imagens Docker.
2. Um push em `main` (merge de `release/*` ou `hotfix/*`) dispara o **Deploy** (`.github/workflows/deploy.yml`):
   1. constrói as imagens da API e do Caddy com o front e publica no GitHub Container Registry (GHCR) com a tag `sha-<12 primeiros caracteres do commit>`;
   2. gera o `.env` de produção a partir dos secrets e copia `docker-compose.yml`, `infra/deploy.sh` e o `.env` para `/opt/livro-de-receitas` por SSH;
   3. roda o `deploy.sh` no servidor: baixa as imagens, **aplica as migrações** com a imagem nova e só então recria os containers, esperando ficarem saudáveis. Se uma migração falhar, o deploy para e a versão anterior continua no ar;
   4. confere se `https://<domínio>/api/health` responde com a versão nova.

## GitHub Secrets e variáveis

Cadastre em **Settings → Secrets and variables → Actions**.

**Secrets** (aba _Secrets_):

| Nome                     | Conteúdo                                                                | Como obter                                                                   |
| ------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `DEPLOY_HOST`            | IP do Droplet                                                           | Painel da DigitalOcean                                                       |
| `DEPLOY_USER`            | `deploy`                                                                | Usuário criado pelo `infra/server-setup.sh`                                  |
| `DEPLOY_SSH_KEY`         | Chave privada de deploy, inteira (com as linhas `BEGIN` e `END`)        | `cat ~/.ssh/livro-deploy`                                                    |
| `DEPLOY_SSH_KNOWN_HOSTS` | Chave pública do servidor, para o Actions recusar um servidor impostor  | `ssh-keyscan -t ed25519 <IP>` (confira a impressão digital, abaixo)          |
| `POSTGRES_PASSWORD`      | Senha do banco de produção, só letras e números (vai dentro de uma URL) | `openssl rand -hex 32`. Não troque depois do primeiro deploy (veja Operação) |

**Variáveis** (aba _Variables_):

| Nome          | Conteúdo                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `SITE_DOMAIN` | Domínio do site, ex.: `travensolli.com.br`. Para incluir o www: `travensolli.com.br, www.travensolli.com.br` |

O `GITHUB_TOKEN`, que publica as imagens no GHCR, é criado automaticamente pelo Actions.

Para conferir a impressão digital do `ssh-keyscan`: no console web do Droplet, rode `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` e compare com `ssh-keyscan -t ed25519 <IP> | ssh-keygen -lf -` no seu computador. Se o Droplet for recriado, a chave muda e este secret precisa ser atualizado.

## Preparar o servidor (uma vez)

Pré-requisitos: Droplet criado com a imagem Docker do Marketplace e as chaves SSH pessoal e de deploy (`docs/sprints/sprint-1/tarefas-do-gabriel.md`), e o domínio apontando para o IP dele com um registro A.

1. **Token do registry.** Enquanto o repositório for privado, as imagens no GHCR também são, e o servidor precisa de um token para baixá-las. Crie um _personal access token (classic)_ em GitHub → Settings → Developer settings, só com o escopo `read:packages`. Se o repositório e os pacotes ficarem públicos, este passo é dispensável.

2. **Rode o script de preparação** (do seu computador, na raiz do repositório):

   ```bash
   scp infra/server-setup.sh ~/.ssh/livro-deploy.pub root@<IP>:/root/
   ssh root@<IP>

   # já no servidor:
   read -rsp 'Token do GHCR: ' GHCR_TOKEN && export GHCR_TOKEN
   GHCR_USER=<seu-usuario-do-github> bash /root/server-setup.sh /root/livro-deploy.pub
   ```

   O script é idempotente e pode ser rodado de novo sem problema. Ele configura swap de 2 GiB, firewall liberando só as portas 22, 80 e 443, o usuário `deploy` (no grupo `docker`, com a chave de deploy), a pasta `/opt/livro-de-receitas` e o login no GHCR.

3. **Teste o acesso de deploy** do seu computador:

   ```bash
   ssh -i ~/.ssh/livro-deploy deploy@<IP> docker ps
   ```

4. **Cadastre os secrets e a variável** da seção anterior.

## Primeiro deploy

Com o servidor pronto, os secrets cadastrados e o DNS já apontando para o Droplet, o primeiro deploy acontece no merge da `release/sprint-1` em `main`. Para publicar sem esperar um merge, use **Actions → Deploy → Run workflow** na branch `main`.

No primeiro acesso o Caddy emite o certificado HTTPS, o que leva alguns segundos; depois ele renova sozinho. Se o DNS ainda não estiver propagado, a emissão falha e o último passo do deploy acusa erro. Basta rodar o workflow de novo depois.

## Voltar para uma versão anterior

**Pelo GitHub (recomendado):** Actions → Deploy → Run workflow → em _Use workflow from_, aba _Tags_, escolha a tag anterior (ex.: `v0.1.0`) → Run workflow. O workflow reconstrói as imagens daquela versão e publica, levando junto o `docker-compose.yml` dela.

**Direto no servidor (mais rápido, usa imagens que já estão no registry):**

```bash
ssh -i ~/.ssh/livro-deploy deploy@<IP>
cd /opt/livro-de-receitas
cat deploys.log                       # histórico: data e tag de cada versão publicada
sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=sha-<tag-anterior>/' .env
bash deploy.sh
```

Para achar a tag de imagem de uma versão: `git rev-parse --short=12 v0.1.0` dá os 12 caracteres que vêm depois de `sha-`. Esse caminho mantém o `docker-compose.yml` atual; se a versão anterior usava outro compose, prefira o rollback pelo GitHub. O próximo deploy automático sobrescreve o `.env`.

**Atenção às migrações:** voltar a versão do código não desfaz migrações já aplicadas. Por isso, toda migração precisa ser compatível com a versão anterior da API: primeiro adicione tabelas e colunas e só remova o que ficou sem uso numa release seguinte. Se uma migração estragar dados, a saída é restaurar o backup diário do Droplet (painel da DigitalOcean) ou um dump manual:

```bash
# backup antes de uma release arriscada
docker compose exec -T db pg_dump -U livro livro_de_receitas | gzip > ~/backup-$(date +%F).sql.gz
```

## Operação

Comandos úteis no servidor, dentro de `/opt/livro-de-receitas`:

```bash
docker compose ps                     # estado dos containers
docker compose logs -f api            # logs da API (também: caddy, db, migrate)
docker compose restart api            # reinicia a API
docker compose exec db psql -U livro livro_de_receitas
```

- **Senha do banco:** o PostgreSQL só usa `POSTGRES_PASSWORD` ao criar o banco, no primeiro deploy. Para trocá-la depois, altere primeiro no banco (`ALTER USER livro PASSWORD '...'`) e em seguida no secret.
- **Volumes:** `postgres_data` (banco), `photos` (fotos das receitas, a partir da H06) e `caddy_data` (certificados). Não apague nenhum deles; o `docker compose down` comum preserva os volumes, o `down -v` apaga.
- **Imagens antigas:** o `deploy.sh` remove as imagens sem uso com mais de 14 dias.
- **Atualizações do PostgreSQL:** a imagem `postgres:18-alpine` recebe correções da versão 18 a cada deploy. Mudar de versão principal (ex.: 18 para 19) exige migração dos dados e deve virar uma história própria.
