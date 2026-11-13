import { CategoryBadge } from './CategoryBadge';
import styles from './CategoryChip.module.css';

export interface CategoryChipProps {
  slug: string;
  name: string;
  href: string;
  /** Marca o atalho da categoria que está sendo vista. */
  current?: boolean;
}

/** Atalho de categoria em formato pílula, com o selo e o nome. */
export function CategoryChip({ slug, name, href, current = false }: CategoryChipProps) {
  return (
    <a className={styles.chip} href={href} aria-current={current ? 'page' : undefined}>
      <CategoryBadge slug={slug} size={28} />
      <span>{name}</span>
    </a>
  );
}
