# Sprint 1: tarefas do Gabriel

Estas etapas usam suas contas e seus dados, então ficam com você. Os nomes de menus mudam com o tempo; na dúvida, siga a documentação de cada serviço.

A ordem sugerida permite que o Claude Code trabalhe na H01 enquanto você cuida das contas.

## 1. GitHub (antes de abrir o Claude Code)

1. Crie o repositório `livro-de-receitas` vazio, sem README, licença ou .gitignore, para não conflitar com o commit inicial do bootstrap.
2. Decida a visibilidade. No plano gratuito, a proteção de branches só funciona em repositório público; para repositório privado, é preciso o GitHub Pro. Como nenhum segredo fica no código, a recomendação é **público**, o que também simplifica o deploy (as imagens no registry podem ser públicas) e serve de vitrine para o portfolio no futuro.
3. Conecte e envie as duas branches:

    ```bash
    cd /home/g-travensolli/projetos/livro-de-receitas
    git remote add origin git@github.com:<seu-usuario>/livro-de-receitas.git
    git push -u origin main develop
    ```

4. Proteja `main` e `develop`: exigir pull request antes do merge, exigir o CI verde quando ele existir e bloquear force push. Marque também a opção que aplica as regras a administradores, senão elas não valem para você.

## 2. Domínio

1. Consulte a disponibilidade no Registro.br e registre o domínio escolhido (sugestão: `travensolli.com.br`).
2. Depois de criar o Droplet, aponte o domínio para o IP dele com um registro do tipo A (e outro para `www`, se quiser).

## 3. DigitalOcean

1. Crie a conta e configure um alerta de cobrança (por exemplo, US$ 10).
2. Crie uma chave SSH exclusiva para o deploy:

    ```bash
    ssh-keygen -t ed25519 -f ~/.ssh/livro-deploy -C "deploy livro-de-receitas"
    ```

3. Crie o Droplet: imagem Ubuntu com Docker (Marketplace), plano Basic de 1 GiB (US$ 6/mês), região na costa leste dos EUA, sua chave SSH pessoal e a de deploy, e backups diários ativados.
4. Quando a H01 estiver pronta, rode o `infra/server-setup.sh` no servidor, seguindo o `docs/deploy.md`.

## 4. GitHub Secrets

Cadastre os secrets listados no `docs/deploy.md`, que o Claude Code cria na H01 (endereço do servidor, usuário e a chave privada `~/.ssh/livro-deploy`, entre outros).

## 5. Google (necessário para a H05)

1. No Google Cloud Console, crie um projeto e configure a tela de consentimento OAuth.
2. Crie uma credencial OAuth do tipo aplicativo web, com o endereço de retorno no seu domínio. O caminho exato vem no briefing da H05.
3. Guarde o client ID e o client secret para cadastrar como secrets.
