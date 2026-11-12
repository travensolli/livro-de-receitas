# H02 Lista de receitas: briefing para o Claude Code

**História:** Como visitante, quero ver a lista de receitas com foto e título, para escolher o que abrir.
**Sprint:** 1 · **Pontos:** 5 (inclui a base visual) · **Branch:** `feature/H02-lista-de-receitas`, a partir de `develop`
**Depende de:** H01 integrada em `develop`.

Leia antes: `CLAUDE.md`, `docs/design.md` e `docs/modelo-de-dados.md`.

## Objetivo

Construir a base visual do site e a primeira tela pública: a página inicial com as receitas publicadas.

## Escopo

1. **Base visual**, exatamente como descreve o `docs/design.md`:
    - `apps/web/src/design/tokens.css` com todos os tokens
    - `apps/web/src/design/fonts.css` carregando Bitter e Kalam servidas pelo próprio site, em `.woff2`
    - registro de ícones com o conjunto provisório e o componente `Icon`
    - `categories.ts` e os componentes `CategoryBadge`, `CategoryChip`, `Button`, `Photo` e `Meta`
    - cabeçalho (nome do site manuscrito, menu com Receitas e Cardápios, botão Entrar) e rodapé (frase manuscrita e link para a política de privacidade, ainda sem página)
2. **Banco:** migrações de `categories`, `recipes`, `ingredients`, `recipe_ingredients`, `recipe_steps` e `recipe_photos`, conforme o modelo de dados.
3. **Seed de desenvolvimento:** as quatro categorias provisórias e três receitas de exemplo publicadas, sem fotos, para testar as telas até a H06 existir. O seed nunca roda em produção.
4. **API:** `GET /api/recipes` devolve as receitas publicadas, das mais recentes para as mais antigas, com paginação de 24 por página e, para cada uma: slug, título, categoria (slug e nome), tempo, rendimento e a foto principal (URL do tamanho de card, se houver).
5. **Página inicial:** título manuscrito "O que tem saído do fogão", grade de cards e estado vazio. Cada card leva para `/receitas/<slug>`.

## Critérios de aceite

- [ ] A página inicial lista as receitas publicadas, das mais recentes para as mais antigas, com foto principal e título
- [ ] Grade responsiva: uma coluna no celular, várias no desktop
- [ ] Fotos da lista em tamanho reduzido e formato WebP; sem foto, aparece o tom da categoria com o ícone de foto
- [ ] Sem receitas publicadas, aparece uma mensagem amigável no lugar da lista
- [ ] Toda cor, fonte e ícone vem dos tokens e do registro; nenhum hexadecimal ou nome de fonte dentro de componentes

## Fora do escopo

A faixa "As favoritas da casa" e os atalhos de categoria do design (H10 e H09), a busca (H08), o login (H05) e a página de cardápios.

## Entrega

PR de `feature/H02-lista-de-receitas` para `develop`, com prints da página no celular e no desktop, instruções para rodar o seed e o checklist acima.
