# H06 Cadastro e edição de receitas: briefing para o Claude Code

**História:** Como dono, quero cadastrar e editar receitas por formulário, com fotos e ingredientes estruturados.
**Sprint:** 1 · **Pontos:** 13 · **Branch:** `feature/H06-cadastro-de-receitas`, a partir de `develop`
**Depende de:** H02, H03 e H05 integradas em `develop`.

Leia antes: `CLAUDE.md`, `docs/design.md` e `docs/modelo-de-dados.md`.

## Objetivo

O Gabriel cadastra e edita receitas completas pelo próprio site, com fotos e ingredientes estruturados, sem precisar mexer no banco. É a história que fecha a meta da Sprint 1.

## Escopo

### Área administrativa

1. `/admin/receitas`: lista de todas as receitas, rascunhos e publicadas, com status, data de atualização e link para editar.
2. `/admin/receitas/nova` e `/admin/receitas/:id`: o mesmo formulário para criar e editar.

### Formulário

1. Campos gerais: título, descrição, categoria, tempo de preparo em minutos, rendimento (quantidade e unidade livre, como "12 fatias") e quantas pessoas serve.
2. **Ingredientes estruturados**, um por linha, reordenáveis:
    - quantidade: aceita "1/2", "1 1/2", "0,5" e "1,5"; fica vazia quando a unidade é "a gosto"
    - unidade: lista fixa do modelo de dados
    - item: busca com autocompletar no catálogo (`GET /api/admin/ingredients?q=`), ignorando acentos e maiúsculas; se não existir, cria um novo
    - complemento opcional: "em cubos", "picada"
3. **Passos**, reordenáveis, cada um com texto e dica opcional.
4. **Fotos:** envio de várias de uma vez, cada uma com papel (principal, galeria, ingredientes ou foto de um passo específico) e texto alternativo obrigatório.
5. Validação no navegador e na API, com mensagens que dizem exatamente o que corrigir.

### Rascunho e publicação

1. Toda receita nasce como rascunho e pode ser salva incompleta.
2. Publicar exige título, categoria, ao menos um ingrediente, ao menos um passo e a foto principal.
3. O slug é gerado do título na criação, sem acentos (sufixo `-2`, `-3` em caso de repetição) e nunca muda, mesmo se o título for editado.

### Fotos

1. Envio por multipart, só para admin. Formatos aceitos: JPEG, PNG e WebP. Limites: até 10 fotos por receita e 10 MB por arquivo (valores propostos; o PO pode ajustar).
2. A API remove todos os metadados (EXIF, inclusive a localização GPS que celulares gravam), corrige a orientação e gera WebP em dois tamanhos: 720 px de largura para os cards e 1600 px para a página. O original, já sem metadados, fica guardado fora do acesso público, para permitir reprocessar se os tamanhos mudarem.
3. Todo acesso a arquivos passa por uma interface de armazenamento (`PhotoStorage`, com salvar, apagar e montar URL pública). A única implementação agora é em disco, no volume de fotos criado na H01. Nada no restante do código conhece caminhos de disco: a troca futura para o DigitalOcean Spaces é uma implementação nova dessa interface.
4. As versões públicas são servidas direto pelo Caddy, a partir do volume, sob `/fotos/`.
5. Apagar uma foto da receita apaga também os arquivos dela.

## Critérios de aceite

- [ ] Formulário com todos os campos da H03, validado no navegador e na API
- [ ] Ingredientes estruturados: quantidade numérica (aceita frações como 1/2) ou "a gosto", unidade de uma lista fixa e item escolhido de um catálogo com autocompletar, criando um novo quando não existir
- [ ] Tempo de preparo em minutos e rendimento em porções, ambos numéricos
- [ ] Upload de várias fotos com escolha da foto principal (até 10 por receita, 10 MB cada)
- [ ] A API converte as fotos para WebP em dois tamanhos, um para a lista e outro para a página, sem metadados
- [ ] Receita nasce como rascunho e só aparece no site ao ser publicada
- [ ] Editar uma receita não quebra o endereço dela

## Fora do escopo

Ocultar e excluir receitas (H14), favoritas (H10), sugestões de colaboradores (H11) e fotos em HEIC, o formato padrão do iPhone (a biblioteca de imagens não o lê sem dependências extras; a tela de envio pede JPEG com uma mensagem clara).

## Entrega

PR de `feature/H06-cadastro-de-receitas` para `develop`, com um vídeo curto ou uma sequência de prints do cadastro de uma receita do início à publicação, e o checklist acima.

Com a H06 integrada, a Sprint 1 está completa: abra a `release/sprint-1` conforme o Gitflow do `CLAUDE.md` para a Review.
