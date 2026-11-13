/**
 * Forma canônica de um nome para comparação: minúsculas, sem acentos e com os espaços
 * colapsados. "Muçarela " e "muçarela" viram "mucarela" e resolvem para o mesmo ingrediente.
 */
export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}
