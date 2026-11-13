// @vitest-environment node
// Guarda as regras de baixo acoplamento do docs/design.md: só tokens.css e fonts.css conhecem
// cores e fontes concretas, e todo ícone passa pelo registro.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcDir = fileURLToPath(new URL('..', import.meta.url));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    const isSource = /\.(css|ts|tsx)$/.test(entry.name);
    const isTest = /\.test\.(ts|tsx)$/.test(entry.name);
    return isSource && !isTest ? [relative(srcDir, path)] : [];
  });
}

const files = sourceFiles(srcDir);

function violations(pattern: RegExp, allowed: string[]) {
  return files
    .filter((file) => !allowed.includes(file))
    .flatMap((file) =>
      readFileSync(join(srcDir, file), 'utf8')
        .split('\n')
        .flatMap((line, index) =>
          pattern.test(line) ? [`${file}:${index + 1}: ${line.trim()}`] : [],
        ),
    );
}

describe('regras do design', () => {
  it('encontra os arquivos do front', () => {
    expect(files).toContain('design/tokens.css');
    expect(files).toContain('App.tsx');
  });

  it('nenhuma cor em hexadecimal fora de tokens.css', () => {
    expect(violations(/#[0-9a-f]{3,8}\b/i, ['design/tokens.css'])).toEqual([]);
  });

  it('nenhuma cor em rgb(), hsl() ou nome de cor fora de tokens.css', () => {
    expect(
      violations(/\b(rgba?|hsla?|oklch)\(|:\s*(white|black|red|blue|orange|green)\b/i, [
        'design/tokens.css',
      ]),
    ).toEqual([]);
  });

  it('nenhum nome de fonte fora de tokens.css e fonts.css', () => {
    expect(
      violations(
        /\b(Kalam|Bitter|Georgia|Segoe|Arial|Helvetica|Roboto|serif|cursive|monospace|system-ui)\b/i,
        ['design/tokens.css', 'design/fonts.css'],
      ),
    ).toEqual([]);
  });

  it('font-family só com tokens', () => {
    expect(violations(/font-family:(?!\s*(var\(--font-|inherit))/, ['design/fonts.css'])).toEqual(
      [],
    );
  });

  it('nenhum SVG importado fora do registro de ícones', () => {
    expect(violations(/from\s+['"].*\.svg['"]/, [])).toEqual([]);
    expect(violations(/set-provisorio\//, ['design/icons/registry.ts'])).toEqual([]);
  });
});
