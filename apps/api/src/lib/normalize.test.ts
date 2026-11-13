import { describe, expect, it } from 'vitest';
import { normalizeName } from './normalize';

describe('normalizeName', () => {
  it.each([
    ['Muçarela', 'mucarela'],
    ['  pimenta-do-reino ', 'pimenta-do-reino'],
    ['Requeijão   cremoso', 'requeijao cremoso'],
    ['ÓLEO', 'oleo'],
    ['Salsa Lizano', 'salsa lizano'],
  ])('%j vira %j', (input, expected) => {
    expect(normalizeName(input)).toBe(expected);
  });
});
