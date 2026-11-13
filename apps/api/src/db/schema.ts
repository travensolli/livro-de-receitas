// Tabelas do banco, definidas com o Drizzle conforme docs/modelo-de-dados.md.
// Depois de alterar este arquivo, rode `pnpm db:generate` para criar a migração.
//
// A coluna `recipes.author_id` do modelo de dados fica para quando existir a tabela de
// usuários (H05): o tipo do id depende do Better Auth, e a coluna nasce já com a FK.
import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const recipeStatus = pgEnum('recipe_status', ['draft', 'published']);

export const photoRole = pgEnum('photo_role', ['main', 'gallery', 'ingredients', 'step']);

/** Unidades fixas dos ingredientes; a exibição e a grandeza de cada uma estão no modelo de dados. */
export const ingredientUnit = pgEnum('ingredient_unit', [
  'g',
  'kg',
  'ml',
  'l',
  'cup',
  'tbsp',
  'tsp',
  'unit',
  'clove',
  'bunch',
  'slice',
  'pinch',
  'to_taste',
]);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  position: integer('position').notNull(),
});

export const recipes = pgTable(
  'recipes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Gerado do título na criação e nunca alterado, para não quebrar endereços. */
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    // Rascunhos podem ser salvos incompletos (H06); a publicação exige os campos.
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'restrict' }),
    prepMinutes: integer('prep_minutes'),
    yieldQuantity: numeric('yield_quantity', { mode: 'number' }),
    yieldUnit: text('yield_unit'),
    servings: integer('servings'),
    status: recipeStatus('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index('recipes_status_published_at_idx').on(table.status, table.publishedAt.desc()),
    index('recipes_category_id_idx').on(table.categoryId),
    check(
      'recipes_published_at_check',
      sql`${table.status} <> 'published' or ${table.publishedAt} is not null`,
    ),
    check('recipes_prep_minutes_check', sql`${table.prepMinutes} > 0`),
    check('recipes_yield_quantity_check', sql`${table.yieldQuantity} > 0`),
    check('recipes_servings_check', sql`${table.servings} > 0`),
  ],
);

/** Catálogo de ingredientes, compartilhado entre as receitas. */
export const ingredients = pgTable('ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  /** Minúsculas e sem acentos: evita duplicatas e permite somar na lista de compras. */
  normalizedName: text('normalized_name').notNull().unique(),
});

export const recipeIngredients = pgTable(
  'recipe_ingredients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'restrict' }),
    /** Nulo quando a unidade é "a gosto". */
    quantity: numeric('quantity', { mode: 'number' }),
    unit: ingredientUnit('unit').notNull(),
    preparation: text('preparation'),
  },
  (table) => [
    index('recipe_ingredients_recipe_id_idx').on(table.recipeId),
    index('recipe_ingredients_ingredient_id_idx').on(table.ingredientId),
    check(
      'recipe_ingredients_quantity_check',
      sql`(${table.unit} = 'to_taste' and ${table.quantity} is null) or (${table.unit} <> 'to_taste' and ${table.quantity} > 0)`,
    ),
  ],
);

export const recipeSteps = pgTable(
  'recipe_steps',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    text: text('text').notNull(),
    /** Dica na margem, exibida com a letra manuscrita. */
    tip: text('tip'),
  },
  (table) => [index('recipe_steps_recipe_id_idx').on(table.recipeId)],
);

export const recipePhotos = pgTable(
  'recipe_photos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    role: photoRole('role').notNull(),
    stepId: uuid('step_id').references(() => recipeSteps.id, { onDelete: 'cascade' }),
    position: integer('position').notNull().default(0),
    altText: text('alt_text').notNull(),
    /** Chave na camada de armazenamento (PhotoStorage), nunca um caminho de disco. */
    storageKey: text('storage_key').notNull().unique(),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('recipe_photos_recipe_id_idx').on(table.recipeId),
    index('recipe_photos_step_id_idx').on(table.stepId),
    // No máximo uma foto principal e uma de ingredientes por receita.
    uniqueIndex('recipe_photos_one_main_idx')
      .on(table.recipeId)
      .where(sql`${table.role} = 'main'`),
    uniqueIndex('recipe_photos_one_ingredients_idx')
      .on(table.recipeId)
      .where(sql`${table.role} = 'ingredients'`),
    check(
      'recipe_photos_step_id_check',
      sql`(${table.role} = 'step') = (${table.stepId} is not null)`,
    ),
    check('recipe_photos_alt_text_check', sql`length(trim(${table.altText})) > 0`),
  ],
);
