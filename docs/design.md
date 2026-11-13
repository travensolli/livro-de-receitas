# Design do Livro de Receitas

Identidade visual aprovada para o MVP em 12/11/2026. A referência visual completa (fundamentos, página inicial, página da receita e celular) está no canvas "Identidade visual: Livro de Receitas do Travensolli", no projeto do Claude.

A direção se chama **couve, abóbora e papel de pão**: uma cozinha de casa, com a letra do Gabriel como assinatura, cores tiradas de ingredientes e fotos como protagonistas.

## Princípios

1. A letra do Gabriel e os ícones de traço de caneta dão o tom. Nada de gradientes, sombras, emoji ou enfeites sem função.
2. Cor tem função. O verde é a cor da casa, o laranja chama para a ação, e cada categoria tem a sua cor, repetida no ícone e na etiqueta.
3. As fotos mandam. Várias por receita (prato pronto, ingredientes e passos), sempre no mesmo recorte, sem moldura.
4. Papel de pão só onde alguém anotaria: a lista de ingredientes.
5. Texto alinhado à esquerda, linhas curtas e letra grande o bastante para ler no celular com a mão suja de farinha.

## Arquitetura: baixo acoplamento

A fonte manuscrita e os ícones atuais são provisórios. No futuro entram a fonte feita da letra do Gabriel e ícones próprios. Para que essa troca não toque em nenhuma tela, o design vive em três camadas, e só elas conhecem valores concretos.

```
apps/web/src/design/
  tokens.css        # todos os valores: cores, fontes, tamanhos, espaços, raios
  fonts.css         # o único lugar que carrega arquivos de fonte
  categories.ts     # categoria -> nome, token de cor e nome de ícone
  icons/
    registry.ts     # nome semântico -> componente SVG; a única porta de entrada
    set-provisorio/ # os SVGs atuais, um arquivo por ícone
  components/       # Icon, CategoryBadge, Button, Photo, HandNote...
apps/web/public/fonts/  # arquivos .woff2 servidos pelo próprio site
```

Regras que garantem a troca fácil:

- Componentes nunca usam cor em hexadecimal, nome de fonte ou tamanho solto. Sempre `var(--token)`.
- Nenhum componente importa um SVG diretamente. Todo ícone passa por `<Icon name="..." />`, que consulta o registro.
- Os nomes dos ícones são semânticos (o que significam), nunca descritivos (o desenho). `time`, e não `clock`.
- As fontes são servidas pelo próprio site (self-host), sem CDN de terceiros: mais rápido, sem depender de serviço externo e sem enviar dados de visitantes a outra empresa.

## Tokens

Os valores abaixo vão em `tokens.css`, como propriedades em `:root`.

### Cores

| Token                 | Valor     | Nome         | Uso                                                                          |
| --------------------- | --------- | ------------ | ---------------------------------------------------------------------------- |
| `--color-bg`          | `#F7F8F5` | Esmalte      | Fundo das páginas                                                            |
| `--color-text`        | `#22282B` | Ferro        | Texto principal                                                              |
| `--color-text-muted`  | `#4E565B` | Grafite      | Texto de apoio                                                               |
| `--color-line`        | `#C9CCC6` |              | Linhas e bordas de campos                                                    |
| `--color-brand`       | `#2A7040` | Couve        | Cor da casa: links, botão de entrar, números dos passos, faixa das favoritas |
| `--color-brand-hover` | `#1F5530` |              | Hover de links e botões verdes                                               |
| `--color-on-brand`    | `#FFFFFF` |              | Texto sobre o verde                                                          |
| `--color-action`      | `#F07A2A` | Abóbora      | Botão principal, coração das favoritas                                       |
| `--color-on-action`   | `#22282B` |              | Texto sobre o laranja (nunca branco)                                         |
| `--color-accent-text` | `#B4470F` |              | Laranja para texto e anotações à mão                                         |
| `--color-paper`       | `#E6CD98` | Papel de pão | Painel de ingredientes                                                       |
| `--color-paper-photo` | `#F3E6C6` |              | Fundo de foto ausente dentro do painel                                       |

### Cores de categoria

Cada categoria tem três tokens: a cor, a cor do ícone sobre ela e um tom claro usado como fundo de foto ausente. A lista de categorias ainda será definida pelo PO; estas quatro são as provisórias do design.

| Categoria                   | `--color-category-<slug>` | `-on`     | `-tint`   | Ícone             |
| --------------------------- | ------------------------- | --------- | --------- | ----------------- |
| Bolos e doces (`sweets`)    | `#F2B705` milho           | `#22282B` | `#FBE7A1` | `category-sweets` |
| Panela do dia a dia (`pot`) | `#F07A2A` abóbora         | `#22282B` | `#FCD8BF` | `category-pot`    |
| Hortaliças (`greens`)       | `#6BAA3A` broto           | `#22282B` | `#DCEDCB` | `category-greens` |
| Pães e quitandas (`breads`) | `#A0612B` canela          | `#FFFFFF` | `#F1DECB` | `category-breads` |

Uma categoria nova pede só três tokens novos e uma linha em `categories.ts`.

### Tipografia

| Token         | Valor                             | Uso                                                                             |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------- |
| `--font-hand` | `"Kalam", "Segoe Print", cursive` | Nome do site, títulos de receitas e seções, dicas na margem, números dos passos |
| `--font-text` | `"Bitter", Georgia, serif`        | Todo o resto                                                                    |

Kalam é provisória e será trocada pela fonte da letra do Gabriel. Bitter é definitiva.

Escala (base 16 px):

| Token             | Valor                         | Uso                                              |
| ----------------- | ----------------------------- | ------------------------------------------------ |
| `--text-sm`       | `0.9375rem` (15 px)           | Legendas, metadados, rodapé                      |
| `--text-base`     | `1.125rem` (18 px)            | Texto corrido, ingredientes                      |
| `--text-lg`       | `1.3125rem` (21 px)           | Destaques de texto                               |
| `--text-hand-sm`  | `1.5rem` (24 px)              | Dicas na margem                                  |
| `--text-hand-md`  | `1.875rem` (30 px)            | Título nos cards                                 |
| `--text-hand-lg`  | `clamp(2rem, 4vw, 2.375rem)`  | Títulos de seção (Ingredientes, Modo de preparo) |
| `--text-hand-xl`  | `clamp(2.5rem, 6vw, 3.25rem)` | Títulos de página                                |
| `--text-hand-2xl` | `clamp(3rem, 7vw, 4.75rem)`   | Título da receita e da faixa das favoritas       |

Entrelinha: `1.65` no texto corrido em Bitter; `1` a `1.1` nos títulos manuscritos. Linhas de texto com no máximo cerca de 36em.

### Espaço, raio e layout

- Espaços em múltiplos de 4 px: `--space-1` 4, `--space-2` 8, `--space-3` 12, `--space-4` 16, `--space-5` 24, `--space-6` 32, `--space-7` 48, `--space-8` 56, `--space-9` 72.
- Raios: `--radius-sm` 3 px (fotos e painéis), `--radius-md` 6 px (botões e campos), `--radius-pill` 999 px (atalhos de categoria). Selos de categoria e números de passo são círculos.
- Conteúdo em container de no máximo 1200 px, com 24 px de respiro lateral (20 px no celular).
- Sem sombras.

## Componentes base

- **Icon**: `<Icon name="time" size={22} />`. Herda a cor do texto (`currentColor`) e é decorativo por padrão (`aria-hidden`); quando sozinho num botão, o botão recebe `aria-label`.
- **CategoryBadge**: círculo na cor da categoria com o ícone dela por cima. Tamanhos 28, 32, 40 e 52 px.
- **CategoryChip**: atalho de categoria na página inicial, com o selo e o nome, em formato pílula.
- **Button**: `action` (laranja com texto escuro), `brand` (verde com texto branco) e `outline` (borda ferro). Altura mínima de 44 px.
- **Photo**: recorte fixo com `object-fit: cover`. Proporções: 4:5 nos cards, 3:2 na foto principal, 4:3 na galeria e nos ingredientes, 16:10 nas fotos de passo. Sem foto, mostra o tom claro da categoria com o ícone `photo` e uma legenda.
- **Meta**: ícone mais texto, para tempo e rendimento.
- **IngredientsPanel**: fundo papel de pão, título manuscrito, quantidade em negrito numa coluna e o item ao lado.
- **StepList**: número em círculo verde com algarismo manuscrito branco; texto em Bitter; dica opcional em `HandNote`; foto opcional do passo.
- **HandNote**: texto manuscrito em `--color-accent-text`, girado `-1.2deg`. Só para dicas do autor; nunca para texto de interface.

## Onde a letra manuscrita entra, e onde não

Entra no nome do site, nos títulos de receitas, cardápios e seções, nas dicas na margem, nos números dos passos e na frase do rodapé. Não entra em menus, botões, formulários, mensagens de erro, metadados nem textos longos: ali a leitura vem antes da personalidade.

## Acessibilidade

- Contraste mínimo de 4.5:1 para texto. Por isso o laranja vivo nunca leva texto branco, e texto em laranja usa `--color-accent-text`.
- Alvos de toque com pelo menos 44 px.
- Foco visível em tudo que é clicável: contorno de 3 px em `--color-brand`, com 2 px de afastamento.
- Toda foto de receita tem texto alternativo; ícones decorativos ficam ocultos para leitores de tela.
- Animações só como resposta a uma ação, e respeitando `prefers-reduced-motion`.

## O que não fazer

Gradientes, sombras, cards com borda e sombra, rótulos em caixa alta, emoji, azul, setas decorativas em botões, animações de entrada em cada seção, ícone importado fora do registro, cor ou fonte declarada fora de `tokens.css` e `fonts.css`.

## Como trocar a fonte manuscrita

1. Gerar a fonte a partir da letra do Gabriel, com alfabeto completo, acentos (á, à, â, ã, é, ê, í, ó, ô, õ, ú, ü, ç, nas versões maiúsculas também), números e pontuação.
2. Exportar em `.woff2` e colocar em `apps/web/public/fonts/`.
3. Em `fonts.css`, trocar o `@font-face` da Kalam pelo da fonte nova, mantendo um nome de família próprio (ex.: `"Letra Travensolli"`).
4. Em `tokens.css`, atualizar só `--font-hand`.
5. Revisar a escala manuscrita, já que cada letra tem um tamanho aparente diferente; se preciso, ajustar só os tokens `--text-hand-*`.

Nenhum componente muda.

## Como trocar os ícones

1. Desenhar os novos ícones em 24 x 24, com traço em `currentColor` e `fill="none"` (o coração é a exceção: preenchido).
2. Criar a pasta do novo conjunto em `icons/` com um arquivo por nome semântico da tabela abaixo.
3. Apontar o `registry.ts` para o novo conjunto. Nomes que faltarem caem no conjunto provisório.

Nenhum componente muda.

## Conjunto provisório de ícones

Traço de 1.8, pontas e junções arredondadas, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`.

| Nome              | Uso                    | Desenho (conteúdo do SVG)                                                                                                                                                                                             |
| ----------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `category-sweets` | Bolos e doces          | `<path d="M12 21.5V15"/><path d="M12 15C7.6 12.8 7.2 6 12 2.8C16.9 6.1 16.3 12.9 12 15Z"/><path d="M12 15C10.2 12.2 10.1 6.4 12 2.8"/><path d="M12 15C13.9 12.3 13.8 6.3 12 2.8"/>`                                   |
| `category-pot`    | Panela do dia a dia    | `<path d="M4.2 10.2h15.6l-.4 6.3a2.8 2.8 0 0 1-2.8 2.6H7.4a2.8 2.8 0 0 1-2.8-2.6z"/><path d="M2 11.4h2.2M19.8 11.4H22"/><path d="M5.8 10c1.6-2.6 10.6-2.8 12.4 0"/><path d="M12 7.2V5.6"/>`                           |
| `category-greens` | Hortaliças             | `<path d="M5 19.2C4.6 10.6 10.4 4.8 19.4 4.6c.3 8.8-5.6 14.8-14.4 14.6z"/><path d="M5 19.2 14.8 9.4"/>`                                                                                                               |
| `category-breads` | Pães e quitandas       | `<path d="M3.8 12.6C3.6 8.4 7.6 5.8 12 5.8s8.6 2.6 8.2 6.8v5.6c0 .7-.5 1.2-1.2 1.2H5c-.7 0-1.2-.5-1.2-1.2z"/><path d="M8.6 9.2l1.4 2.2M12.4 8.6l1.4 2.2M16 9.4l1.2 1.9"/>`                                            |
| `time`            | Tempo de preparo       | `<circle cx="12" cy="12" r="8.6"/><path d="M12 7.6v4.8l3.2 2"/>`                                                                                                                                                      |
| `servings`        | Rendimento             | `<circle cx="12.6" cy="12.5" r="6"/><circle cx="12.6" cy="12.5" r="3.2"/><path d="M2.8 4.5v4.2c0 1 .7 1.6 1.4 1.6M5.6 4.5v4.2c0 1-.7 1.6-1.4 1.6M4.2 10.3v9.2"/><path d="M21.4 4.4c-1.2 1.2-1.6 3.6-1.4 6.2h1.4v9"/>` |
| `recipes`         | Menu: Receitas         | `<path d="M3 6.2c3-1.4 6-1.2 9 .8 3-2 6-2.2 9-.8v12.2c-3-1.4-6-1.2-9 .8-3-2-6-2.2-9-.8z"/><path d="M12 7v12.2"/>`                                                                                                     |
| `menus`           | Menu: Cardápios        | `<path d="M3 17.5h18"/><path d="M4.8 17.2c.4-4.6 3.4-7.6 7.2-7.6s6.8 3 7.2 7.6"/><path d="M12 9.6V7.8M10.8 7.6h2.4"/>`                                                                                                |
| `favorite`        | Favoritas (preenchido) | `<path d="M12 20s-7.6-4.6-8.4-9.6C3 7.2 5 5 7.6 5c1.9 0 3.4 1.2 4.4 2.8C13 6.2 14.5 5 16.4 5 19 5 21 7.2 20.4 10.4 19.6 15.4 12 20 12 20z"/>`                                                                         |
| `search`          | Busca                  | `<circle cx="10.8" cy="10.8" r="6.2"/><path d="M15.4 15.4l5 5"/>`                                                                                                                                                     |
| `photo`           | Foto ausente           | `<path d="M4 8.2h3.2L8.8 6h6.4l1.6 2.2H20v10.6H4z"/><circle cx="12" cy="13.2" r="3.4"/>`                                                                                                                              |
