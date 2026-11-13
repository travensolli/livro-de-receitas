CREATE TYPE "public"."ingredient_unit" AS ENUM('g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'unit', 'clove', 'bunch', 'slice', 'pinch', 'to_taste');--> statement-breakpoint
CREATE TYPE "public"."photo_role" AS ENUM('main', 'gallery', 'ingredients', 'step');--> statement-breakpoint
CREATE TYPE "public"."recipe_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text NOT NULL,
	CONSTRAINT "ingredients_normalized_name_unique" UNIQUE("normalized_name")
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"quantity" numeric,
	"unit" "ingredient_unit" NOT NULL,
	"preparation" text,
	CONSTRAINT "recipe_ingredients_quantity_check" CHECK (("recipe_ingredients"."unit" = 'to_taste' and "recipe_ingredients"."quantity" is null) or ("recipe_ingredients"."unit" <> 'to_taste' and "recipe_ingredients"."quantity" > 0))
);
--> statement-breakpoint
CREATE TABLE "recipe_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"role" "photo_role" NOT NULL,
	"step_id" uuid,
	"position" integer DEFAULT 0 NOT NULL,
	"alt_text" text NOT NULL,
	"storage_key" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_photos_storage_key_unique" UNIQUE("storage_key"),
	CONSTRAINT "recipe_photos_step_id_check" CHECK (("recipe_photos"."role" = 'step') = ("recipe_photos"."step_id" is not null)),
	CONSTRAINT "recipe_photos_alt_text_check" CHECK (length(trim("recipe_photos"."alt_text")) > 0)
);
--> statement-breakpoint
CREATE TABLE "recipe_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"text" text NOT NULL,
	"tip" text
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category_id" uuid,
	"prep_minutes" integer,
	"yield_quantity" numeric,
	"yield_unit" text,
	"servings" integer,
	"status" "recipe_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recipes_slug_unique" UNIQUE("slug"),
	CONSTRAINT "recipes_published_at_check" CHECK ("recipes"."status" <> 'published' or "recipes"."published_at" is not null),
	CONSTRAINT "recipes_prep_minutes_check" CHECK ("recipes"."prep_minutes" > 0),
	CONSTRAINT "recipes_yield_quantity_check" CHECK ("recipes"."yield_quantity" > 0),
	CONSTRAINT "recipes_servings_check" CHECK ("recipes"."servings" > 0)
);
--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_photos" ADD CONSTRAINT "recipe_photos_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_photos" ADD CONSTRAINT "recipe_photos_step_id_recipe_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."recipe_steps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recipe_ingredients_recipe_id_idx" ON "recipe_ingredients" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_ingredients_ingredient_id_idx" ON "recipe_ingredients" USING btree ("ingredient_id");--> statement-breakpoint
CREATE INDEX "recipe_photos_recipe_id_idx" ON "recipe_photos" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_photos_step_id_idx" ON "recipe_photos" USING btree ("step_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recipe_photos_one_main_idx" ON "recipe_photos" USING btree ("recipe_id") WHERE "recipe_photos"."role" = 'main';--> statement-breakpoint
CREATE UNIQUE INDEX "recipe_photos_one_ingredients_idx" ON "recipe_photos" USING btree ("recipe_id") WHERE "recipe_photos"."role" = 'ingredients';--> statement-breakpoint
CREATE INDEX "recipe_steps_recipe_id_idx" ON "recipe_steps" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipes_status_published_at_idx" ON "recipes" USING btree ("status","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "recipes_category_id_idx" ON "recipes" USING btree ("category_id");