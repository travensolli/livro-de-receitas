-- Categorias provisórias do design (docs/design.md). Entram por migração, e não pelo seed de
-- desenvolvimento, porque o cadastro de receitas em produção (H06) depende delas. Quando o PO
-- definir a lista definitiva, as mudanças entram numa migração nova.
-- O visual de cada uma (cor e ícone) fica no front, em apps/web/src/design/categories.ts.
INSERT INTO "categories" ("slug", "name", "position") VALUES
	('sweets', 'Bolos e doces', 1),
	('pot', 'Panela do dia a dia', 2),
	('greens', 'Hortaliças', 3),
	('breads', 'Pães e quitandas', 4)
ON CONFLICT ("slug") DO NOTHING;
