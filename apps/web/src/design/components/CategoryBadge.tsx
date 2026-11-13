import type { CSSProperties } from 'react';
import { getCategoryVisual } from '../categories';
import styles from './CategoryBadge.module.css';
import { Icon } from './Icon';

export type CategoryBadgeSize = 28 | 32 | 40 | 52;

export interface CategoryBadgeProps {
  /** Slug da categoria, como vem da API. */
  slug: string;
  size?: CategoryBadgeSize;
  /** Nome da categoria para leitores de tela, quando o selo aparece sem o nome ao lado. */
  label?: string;
}

/** Círculo na cor da categoria com o ícone dela por cima. */
export function CategoryBadge({ slug, size = 32, label }: CategoryBadgeProps) {
  const visual = getCategoryVisual(slug);
  const style = {
    '--badge-size': `${size}px`,
    '--badge-color': visual.color,
    '--badge-on-color': visual.onColor,
  } as CSSProperties;

  return (
    <span className={styles.badge} style={style}>
      <Icon name={visual.icon} size={Math.round(size * 0.6)} label={label} />
    </span>
  );
}
