import type { RecipeListResponse, RecipeSummary } from '@livro/shared';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

function recipe(overrides: Partial<RecipeSummary> & Pick<RecipeSummary, 'slug' | 'title'>) {
  return {
    category: { slug: 'pot', name: 'Panela do dia a dia' },
    prepMinutes: 50,
    yield: { quantity: 6, unit: 'porções' },
    mainPhoto: null,
    ...overrides,
  } satisfies RecipeSummary;
}

function listResponse(items: RecipeSummary[]): RecipeListResponse {
  return { items, page: 1, pageSize: 24, total: items.length, totalPages: items.length ? 1 : 0 };
}

function mockFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('página inicial', () => {
  it('lista as receitas na ordem da API, com título, foto e link para a receita', async () => {
    const fetchMock = mockFetch(
      listResponse([
        recipe({
          slug: 'gallo-pinto',
          title: 'Gallo pinto',
          prepMinutes: 20,
          yield: { quantity: 4, unit: 'porções' },
          mainPhoto: { url: '/fotos/abc/card.webp', alt: 'Gallo pinto na frigideira' },
        }),
        recipe({ slug: 'escondidinho', title: 'Escondidinho', prepMinutes: 100 }),
      ]),
    );

    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'O que tem saído do fogão' }),
    ).toBeVisible();
    const cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledWith('/api/recipes?page=1', expect.anything());

    const [first, second] = cards as [HTMLElement, HTMLElement];
    expect(within(first).getByRole('link', { name: 'Gallo pinto' })).toHaveAttribute(
      'href',
      '/receitas/gallo-pinto',
    );
    expect(within(first).getByRole('img', { name: 'Gallo pinto na frigideira' })).toHaveAttribute(
      'src',
      '/fotos/abc/card.webp',
    );
    expect(within(first).getByText('20 min')).toBeVisible();
    expect(within(first).getByText('4 porções')).toBeVisible();
    expect(within(first).getByText('Panela do dia a dia')).toBeVisible();

    expect(within(second).getByRole('link', { name: 'Escondidinho' })).toHaveAttribute(
      'href',
      '/receitas/escondidinho',
    );
    expect(within(second).getByText('Sem foto ainda')).toBeVisible();
    expect(within(second).getByText('1 h 40 min')).toBeVisible();
  });

  it('sem receitas publicadas, mostra uma mensagem amigável', async () => {
    mockFetch(listResponse([]));

    render(<App />);

    expect(await screen.findByText(/Ainda não tem receita por aqui/)).toBeVisible();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('quando a API falha, avisa e permite tentar de novo', async () => {
    const fetchMock = mockFetch({ error: 'falhou' }, 500);

    render(<App />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Não foi possível carregar as receitas agora');

    mockFetch(listResponse([recipe({ slug: 'gallo-pinto', title: 'Gallo pinto' })]));
    fireEvent.click(within(alert).getByRole('button', { name: 'Tentar de novo' }));

    expect(await screen.findByRole('link', { name: 'Gallo pinto' })).toBeVisible();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('tem o cabeçalho com o nome do site, o menu e o botão Entrar, e o rodapé', async () => {
    mockFetch(listResponse([]));

    render(<App />);

    expect(screen.getByRole('link', { name: 'Receitas do Travensolli' })).toHaveAttribute(
      'href',
      '/',
    );
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    expect(within(nav).getByRole('link', { name: 'Receitas' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'Cardápios' })).toHaveAttribute(
      'href',
      '/cardapios',
    );
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeVisible();
    expect(screen.getByText('Feito em casa, anotado à mão.')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Política de privacidade' })).toHaveAttribute(
      'href',
      '/privacidade',
    );
    await screen.findByText(/Ainda não tem receita/);
  });
});
