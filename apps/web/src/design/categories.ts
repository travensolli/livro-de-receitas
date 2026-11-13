// Visual de cada categoria, ligado pelo slug que vem da API (tabela `categories`).
// Uma categoria nova pede três tokens em tokens.css (cor, -on e -tint) e uma linha aqui.
import type { IconName } from './icons/registry';

export interface CategoryVisual {
  /** Nome de referência; na tela vale o nome que vem da API. */
  name: string;
  /** Cor da categoria (selo e etiqueta). */
  color: string;
  /** Cor do ícone sobre a cor da categoria. */
  onColor: string;
  /** Tom claro, usado como fundo de foto ausente. */
  tint: string;
  icon: IconName;
}

function visual(slug: string, name: string, icon: IconName): CategoryVisual {
  return {
    name,
    color: `var(--color-category-${slug})`,
    onColor: `var(--color-category-${slug}-on)`,
    tint: `var(--color-category-${slug}-tint)`,
    icon,
  };
}

export const categoryVisuals: Record<string, CategoryVisual> = {
  sweets: visual('sweets', 'Bolos e doces', 'category-sweets'),
  pot: visual('pot', 'Panela do dia a dia', 'category-pot'),
  greens: visual('greens', 'Hortaliças', 'category-greens'),
  breads: visual('breads', 'Pães e quitandas', 'category-breads'),
};

/** Categoria que ainda não ganhou visual próprio: cores da casa e ícone de receitas. */
const fallbackVisual: CategoryVisual = {
  name: 'Receitas',
  color: 'var(--color-brand)',
  onColor: 'var(--color-on-brand)',
  tint: 'var(--color-paper-photo)',
  icon: 'recipes',
};

export function getCategoryVisual(slug: string): CategoryVisual {
  return categoryVisuals[slug] ?? fallbackVisual;
}
