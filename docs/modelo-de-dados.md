# Modelo de dados

Modelo da Sprint 1, compartilhado pelas histórias H02, H03, H05 e H06. Nomes no banco em inglês, como manda o `CLAUDE.md`. As migrações são criadas pela primeira história que precisar de cada tabela.

Duas decisões já valem desde agora porque os cardápios (H22 a H27) dependem delas: ingredientes estruturados (quantidade, unidade e item de um catálogo) e tempo e rendimento como números. Sem isso, a lista de compras, o ajuste de porções e o tempo total exigiriam recadastrar todas as receitas.

## Tabelas

### `categories`

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | |
| `slug` | text, único | `sweets`, `pot`, `greens`, `breads` |
| `name` | text | Nome exibido |
| `position` | int | Ordem de exibição |

As quatro categorias acima são provisórias e entram por seed; a lista definitiva é decisão do PO. O visual de cada uma (cor e ícone) fica no front, em `apps/web/src/design/categories.ts`, ligado pelo `slug`.

### `recipes`

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | |
| `slug` | text, único | Gerado do título na criação, sem acentos; nunca muda depois, para não quebrar endereços |
| `title` | text | |
| `description` | text | Uma ou duas frases |
| `category_id` | uuid | |
| `prep_minutes` | int | Tempo total em minutos |
| `yield_quantity` | numeric | Quanto rende |
| `yield_unit` | text | `porções`, `fatias`, `unidades`... |
| `servings` | int | Quantas pessoas serve; base do ajuste de porções futuro |
| `status` | enum | `draft`, `published` |
| `author_id` | uuid | Quem cadastrou (tabela de usuários da H05) |
| `published_at` | timestamptz, nulo | Preenchido ao publicar |
| `created_at`, `updated_at` | timestamptz | |

### `ingredients` (catálogo)

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | |
| `name` | text | Como aparece: "farinha de trigo" |
| `normalized_name` | text, único | Minúsculas e sem acentos, para evitar duplicatas e permitir a soma na lista de compras |

### `recipe_ingredients`

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | |
| `recipe_id` | uuid | |
| `position` | int | Ordem na lista |
| `ingredient_id` | uuid | |
| `quantity` | numeric, nulo | Nulo quando for "a gosto" |
| `unit` | enum | Lista fixa abaixo |
| `preparation` | text, nulo | Complemento livre: "em cubos", "picada" |

### `recipe_steps`

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | |
| `recipe_id` | uuid | |
| `position` | int | Número do passo |
| `text` | text | |
| `tip` | text, nulo | Dica na margem, exibida com a letra manuscrita |

### `recipe_photos`

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | |
| `recipe_id` | uuid | |
| `role` | enum | `main`, `gallery`, `ingredients`, `step` |
| `step_id` | uuid, nulo | Quando `role` = `step` |
| `position` | int | Ordem na galeria |
| `alt_text` | text | Texto alternativo, obrigatório |
| `storage_key` | text | Chave na camada de armazenamento, nunca um caminho de disco |
| `width`, `height` | int | Da imagem original |
| `created_at` | timestamptz | |

Regras: no máximo uma foto `main` e uma `ingredients` por receita.

### Usuários e sessões

Criadas pela H05, no formato exigido pelo Better Auth (usuário, sessão, conta e verificação), com um campo extra `role` no usuário: `admin` ou `collaborator`.

## Unidades

Lista fixa, com a grandeza de cada uma para permitir somas no futuro:

| Valor | Exibição | Grandeza |
| --- | --- | --- |
| `g` | g | massa |
| `kg` | kg | massa |
| `ml` | ml | volume |
| `l` | l | volume |
| `cup` | xíc. | volume |
| `tbsp` | c. sopa | volume |
| `tsp` | c. chá | volume |
| `unit` | (sem unidade: "3 ovos") | contagem |
| `clove` | dente(s) | contagem |
| `bunch` | maço(s) | contagem |
| `slice` | fatia(s) | contagem |
| `pinch` | pitada | contagem |
| `to_taste` | a gosto | sem quantidade |

Quantidades são guardadas em decimal e exibidas em frações comuns (0.5 vira 1/2, 0.25 vira 1/4, 0.333 vira 1/3). Na entrada, o formulário aceita "1/2", "1 1/2", "0,5" e "1,5".
