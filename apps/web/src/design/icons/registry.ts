// Nome semântico -> componente SVG: a única porta de entrada dos ícones. Componentes usam
// sempre <Icon name="..." />, nunca importam um SVG direto.
//
// Para trocar o conjunto (docs/design.md, "Como trocar os ícones"): crie a pasta do novo
// conjunto ao lado de set-provisorio/ e espalhe os ícones dele depois de `provisional` em
// `registry`. Nomes que faltarem no conjunto novo continuam vindo do provisório.
import type { ComponentType, SVGProps } from 'react';
import { CategorySweetsIcon } from './set-provisorio/category-sweets';
import { CategoryPotIcon } from './set-provisorio/category-pot';
import { CategoryGreensIcon } from './set-provisorio/category-greens';
import { CategoryBreadsIcon } from './set-provisorio/category-breads';
import { TimeIcon } from './set-provisorio/time';
import { ServingsIcon } from './set-provisorio/servings';
import { RecipesIcon } from './set-provisorio/recipes';
import { MenusIcon } from './set-provisorio/menus';
import { FavoriteIcon } from './set-provisorio/favorite';
import { SearchIcon } from './set-provisorio/search';
import { PhotoIcon } from './set-provisorio/photo';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const provisional = {
  'category-sweets': CategorySweetsIcon,
  'category-pot': CategoryPotIcon,
  'category-greens': CategoryGreensIcon,
  'category-breads': CategoryBreadsIcon,
  time: TimeIcon,
  servings: ServingsIcon,
  recipes: RecipesIcon,
  menus: MenusIcon,
  favorite: FavoriteIcon,
  search: SearchIcon,
  photo: PhotoIcon,
} satisfies Record<string, IconComponent>;

export type IconName = keyof typeof provisional;

const registry: Record<IconName, IconComponent> = {
  ...provisional,
};

export const iconNames = Object.keys(registry) as IconName[];

export function getIcon(name: IconName): IconComponent {
  return registry[name];
}
