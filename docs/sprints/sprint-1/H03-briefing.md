# H03 Página da receita: briefing para o Claude Code

**História:** Como visitante, quero abrir uma receita com ingredientes, preparo, tempo, rendimento e fotos.
**Sprint:** 1 · **Pontos:** 3 · **Branch:** `feature/H03-pagina-da-receita`, a partir de `develop`
**Depende de:** H02 integrada em `develop` (base visual, tabelas e seed).

Leia antes: `CLAUDE.md`, `docs/design.md` e `docs/modelo-de-dados.md`.

## Objetivo

A página de uma receita, pensada para ser usada na cozinha, com o celular na bancada.

## Escopo

1. **API:** `GET /api/recipes/:slug` devolve a receita publicada completa: dados gerais, categoria, ingredientes na ordem (com nome, quantidade, unidade e complemento), passos na ordem (com dica e foto do passo, se houver) e fotos por papel (principal, galeria e ingredientes). Receita inexistente ou em rascunho responde 404.
2. **Página `/receitas/:slug`**, seguindo o design:
    - link de volta para a lista e selo da categoria
    - título manuscrito, tempo e rendimento com ícones
    - foto principal em 3:2 e galeria em 4:3 logo abaixo (a galeria some se não houver fotos)
    - painel de ingredientes em papel de pão, com a foto dos ingredientes no topo quando existir
    - modo de preparo com números em círculo, dicas na margem com a letra manuscrita e foto do passo quando existir
    - no celular: título, fotos, ingredientes e preparo empilhados, nessa ordem
3. **Exibição dos ingredientes:** quantidades em frações comuns, unidades abreviadas conforme a tabela do modelo de dados, "a gosto" sem quantidade.
4. **Página 404** no tom do site, com link de volta para as receitas.
5. Título da aba do navegador e descrição da página com o nome e a descrição da receita.

## Critérios de aceite

- [ ] Endereço amigável pelo título, como `/receitas/bolo-de-fuba-com-goiabada`
- [ ] Mostra título, fotos, descrição, tempo de preparo, rendimento, ingredientes com quantidade e unidade, modo de preparo em passos numerados e dicas opcionais
- [ ] Leitura confortável no celular: texto de no mínimo 18 px e nada que exija zoom
- [ ] Receita inexistente ou não publicada mostra a página 404
- [ ] Todas as fotos têm texto alternativo

## Fora do escopo

Marcação de favorita (H10), notas e avaliações (H15), ajuste de porções e qualquer edição.

## Entrega

PR de `feature/H03-pagina-da-receita` para `develop`, com prints no celular e no desktop usando uma receita do seed e o checklist acima.
