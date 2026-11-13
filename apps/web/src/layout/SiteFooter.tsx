import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.phrase}>Feito em casa, anotado à mão.</p>
        {/* A página da política de privacidade chega na H21. */}
        <a className={styles.link} href="/privacidade">
          Política de privacidade
        </a>
      </div>
    </footer>
  );
}
