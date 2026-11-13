import { describe, expect, it } from 'vitest';
import { formatMinutes, formatYield } from './format';

describe('formatMinutes', () => {
  it.each([
    [20, '20 min'],
    [60, '1 h'],
    [100, '1 h 40 min'],
    [125, '2 h 5 min'],
  ])('%d minutos → %s', (minutes, expected) => {
    expect(formatMinutes(minutes)).toBe(expected);
  });
});

describe('formatYield', () => {
  it('usa vírgula decimal', () => {
    expect(formatYield(6, 'porções')).toBe('6 porções');
    expect(formatYield(1.5, 'litros')).toBe('1,5 litros');
  });
});
