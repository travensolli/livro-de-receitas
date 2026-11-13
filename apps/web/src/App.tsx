import { SiteFooter } from './layout/SiteFooter';
import { SiteHeader } from './layout/SiteHeader';
import { HomePage } from './pages/HomePage';

// Por enquanto só existe a página inicial; as rotas (receita, 404) chegam com a H03.
export function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <SiteHeader current="recipes" />
      <main id="conteudo" tabIndex={-1}>
        <HomePage />
      </main>
      <SiteFooter />
    </>
  );
}
