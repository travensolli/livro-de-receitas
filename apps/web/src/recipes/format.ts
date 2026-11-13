const numberFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

/** 20 → "20 min"; 60 → "1 h"; 100 → "1 h 40 min". */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

/** 6 e "porções" → "6 porções"; 1.5 e "xícaras" → "1,5 xícaras". */
export function formatYield(quantity: number, unit: string): string {
  return `${numberFormat.format(quantity)} ${unit}`.trim();
}
