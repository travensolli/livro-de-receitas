import type { RecipeSummary } from '@livro/shared';
import { CategoryBadge } from '../design/components/CategoryBadge';
import { Meta } from '../design/components/Meta';
import { Photo } from '../design/components/Photo';
import { formatMinutes, formatYield } from './format';
import { recipePath } from './paths';
import styles from './RecipeCard.module.css';

/** Card da lista: o card inteiro é clicável, mas o link (e o nome acessível) é o título. */
export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  return (
    <article className={styles.card}>
      <Photo
        className={styles.photo}
        src={recipe.mainPhoto?.url}
        alt={recipe.mainPhoto?.alt ?? ''}
        ratio="4/5"
        categorySlug={recipe.category.slug}
      />
      <div className={styles.body}>
        <p className={styles.category}>
          <CategoryBadge slug={recipe.category.slug} size={28} />
          {recipe.category.name}
        </p>
        <h2 className={styles.title}>
          <a className={styles.link} href={recipePath(recipe.slug)}>
            {recipe.title}
          </a>
        </h2>
        {(recipe.prepMinutes !== null || recipe.yield !== null) && (
          <p className={styles.meta}>
            {recipe.prepMinutes !== null && (
              <Meta icon="time" label="Tempo de preparo">
                {formatMinutes(recipe.prepMinutes)}
              </Meta>
            )}
            {recipe.yield !== null && (
              <Meta icon="servings" label="Rendimento">
                {formatYield(recipe.yield.quantity, recipe.yield.unit)}
              </Meta>
            )}
          </p>
        )}
      </div>
    </article>
  );
}
