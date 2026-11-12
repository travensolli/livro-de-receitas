import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

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

describe('App', () => {
  it('mostra o nome do site e o status vindo de /api/health', async () => {
    const fetchMock = mockFetch({ api: 'ok', database: 'ok', version: 'sha-abc123' });

    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Meu Livro de Receitas' })).toBeVisible();
    expect(await screen.findByText('No ar')).toBeVisible();
    expect(screen.getByText('Conectado')).toBeVisible();
    expect(screen.getByText('sha-abc123')).toBeVisible();
    expect(fetchMock).toHaveBeenCalledWith('/api/health', expect.anything());
  });

  it('indica o banco indisponível quando a API responde 503', async () => {
    mockFetch({ api: 'ok', database: 'unavailable', version: 'sha-abc123' }, 503);

    render(<App />);

    expect(await screen.findByText('Indisponível')).toBeVisible();
    expect(screen.getByText('No ar')).toBeVisible();
  });

  it('indica a API fora do ar quando a requisição falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
    );

    render(<App />);

    expect(await screen.findByText('Fora do ar')).toBeVisible();
  });
});
