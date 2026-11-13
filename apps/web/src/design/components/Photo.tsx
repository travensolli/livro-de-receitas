import type { CSSProperties } from 'react';
import { getCategoryVisual } from '../categories';
import { Icon } from './Icon';
import styles from './Photo.module.css';

/** Proporções do design: 4:5 nos cards, 3:2 na principal, 4:3 na galeria e ingredientes, 16:10 nos passos. */
export type PhotoRatio = '4/5' | '3/2' | '4/3' | '16/10';

export interface PhotoProps {
  /** URL da foto; sem ela, aparece o espaço reservado. */
  src?: string | null;
  /** Texto alternativo, obrigatório em toda foto de receita. */
  alt: string;
  ratio: PhotoRatio;
  /** Categoria da receita: dá o tom do espaço reservado. Sem ela, o tom é o do papel de pão. */
  categorySlug?: string;
  /** Legenda do espaço reservado. */
  missingCaption?: string;
  className?: string;
}

/** Foto com recorte fixo (object-fit: cover) e espaço reservado para quando ainda não há foto. */
export function Photo({
  src,
  alt,
  ratio,
  categorySlug,
  missingCaption = 'Sem foto ainda',
  className,
}: PhotoProps) {
  const style = {
    '--photo-ratio': ratio,
    '--photo-tint': categorySlug
      ? getCategoryVisual(categorySlug).tint
      : 'var(--color-paper-photo)',
  } as CSSProperties;
  const classes = [styles.frame, className].filter(Boolean).join(' ');

  if (src) {
    return (
      <div className={classes} style={style}>
        <img className={styles.image} src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <div className={`${classes} ${styles.missing}`} style={style}>
      <Icon name="photo" size={40} />
      <span className={styles.caption}>{missingCaption}</span>
    </div>
  );
}
