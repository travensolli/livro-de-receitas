import type { RecipeSummary } from '@livro/shared';
import { useEffect, useState } from 'react';
import { Button } from '../design/components/Button';
import { fetchRecipes } from '../recipes/api';
import { RecipeCard } from '../recipes/RecipeCard';
import styles from './HomePage.module.css';

type ListState =
  { kind: 'loading' } | { kind: 'error' } | { kind: 'loaded'; recipes: RecipeSummary[] };

export function HomePage() {
  const [state, setState] = useState<ListState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchRecipes(1, controller.signal).then(
      (page) => setState({ kind: 'loaded', recipes: page.items }),
      () => {
        // Requisição cancelada porque a página saiu da tela: nada a fazer.
        if (!controller.signal.aborted) setState({ kind: 'error' });
      },
    );
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setState({ kind: 'loading' });
    setAttempt((value) => value + 1);
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>O que tem saído do fogão</h1>
      <RecipeList state={state} onRetry={retry} />
    </div>
  );
}

function RecipeList({ state, onRetry }: { state: ListState; onRetry: () => void }) {
  if (state.kind === 'loading') {
    return (
      <p className={styles.message} role="status">
        Carregando as receitas…
      </p>
    );
  }

  if (state.kind === 'error') {
    return (
      <div className={styles.notice} role="alert">
        <p className={styles.message}>
          Não foi possível carregar as receitas agora. Confira sua conexão e tente de novo.
        </p>
        <Button variant="outline" onClick={onRetry}>
          Tentar de novo
        </Button>
      </div>
    );
  }

  if (state.recipes.length === 0) {
    return (
      <div className={styles.notice}>
        <p className={styles.message}>
          Ainda não tem receita por aqui. O fogão já está aceso: as primeiras chegam em breve.
        </p>
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {state.recipes.map((recipe) => (
        <li key={recipe.slug}>
          <RecipeCard recipe={recipe} />
        </li>
      ))}
    </ul>
  );
}
