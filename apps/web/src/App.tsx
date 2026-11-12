import type { HealthResponse } from '@livro/shared';
import { useEffect, useState } from 'react';
import { fetchHealth } from './health';

type HealthState =
  { kind: 'loading' } | { kind: 'online'; health: HealthResponse } | { kind: 'offline' };

export function App() {
  const [state, setState] = useState<HealthState>({ kind: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal).then(
      (health) => setState(health ? { kind: 'online', health } : { kind: 'offline' }),
      () => {
        // Requisição cancelada porque o componente saiu da tela: nada a fazer.
      },
    );
    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Acervo de receitas do Gabriel Travensolli</p>
        <h1>Meu Livro de Receitas</h1>
        <p className="lead">As receitas estão sendo organizadas e chegam aqui em breve.</p>
      </header>

      <section className="status" aria-labelledby="status-title">
        <h2 id="status-title">Status do sistema</h2>
        <StatusList state={state} />
      </section>
    </main>
  );
}

function StatusList({ state }: { state: HealthState }) {
  if (state.kind === 'loading') {
    return <p role="status">Verificando…</p>;
  }

  const api = state.kind === 'online' ? 'No ar' : 'Fora do ar';
  const database =
    state.kind === 'offline'
      ? 'Sem informação'
      : state.health.database === 'ok'
        ? 'Conectado'
        : 'Indisponível';

  return (
    <dl className="status-list">
      <StatusItem label="API" value={api} ok={state.kind === 'online'} />
      <StatusItem
        label="Banco de dados"
        value={database}
        ok={state.kind === 'online' && state.health.database === 'ok'}
      />
      {state.kind === 'online' && (
        <div className="status-version">
          <dt>Versão</dt>
          <dd>{state.health.version}</dd>
        </div>
      )}
    </dl>
  );
}

function StatusItem({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="status-item">
      <dt>{label}</dt>
      <dd data-ok={ok}>{value}</dd>
    </div>
  );
}
