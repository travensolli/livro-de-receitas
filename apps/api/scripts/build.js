// Gera o bundle de produção da API em dist/.
// As dependências de produção ficam fora do bundle (vão para node_modules na imagem);
// os pacotes do workspace, como @livro/shared, são devDependencies e entram no bundle.
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

await build({
  entryPoints: ['src/server.ts', 'src/db/migrate.ts'],
  outdir: 'dist',
  outbase: 'src',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  sourcemap: true,
  external: Object.keys(pkg.dependencies ?? {}),
  logLevel: 'info',
});
