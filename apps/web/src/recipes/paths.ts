/** Endereço público de uma receita, como `/receitas/gallo-pinto`. */
export function recipePath(slug: string): string {
  return `/receitas/${slug}`;
}
