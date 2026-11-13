import { Button } from '../design/components/Button';
import { Icon } from '../design/components/Icon';
import styles from './SiteHeader.module.css';

export type SiteSection = 'recipes' | 'menus';

export interface SiteHeaderProps {
  /** Seção em que a pessoa está, marcada no menu. */
  current?: SiteSection;
}

export function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.name} href="/">
          Receitas do Travensolli
        </a>

        <nav className={styles.nav} aria-label="Principal">
          <a
            className={styles.link}
            href="/"
            aria-current={current === 'recipes' ? 'page' : undefined}
          >
            <Icon name="recipes" size={22} />
            Receitas
          </a>
          <a
            className={styles.link}
            href="/cardapios"
            aria-current={current === 'menus' ? 'page' : undefined}
          >
            <Icon name="menus" size={22} />
            Cardápios
          </a>
        </nav>

        {/* O login com Google chega na H05. */}
        <Button variant="brand" className={styles.signIn}>
          Entrar
        </Button>
      </div>
    </header>
  );
}
