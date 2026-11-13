// Receitas do seed de desenvolvimento: quatro receitas reais do acervo, publicadas e sem
// fotos, para testar as telas até o cadastro (H06) existir. Nunca vão para produção.
import type { ingredientUnit } from '../schema';

type Unit = (typeof ingredientUnit.enumValues)[number];

/** Nome do item no catálogo, quantidade (nula em "a gosto"), unidade e complemento. */
export type SeedIngredient = [
  name: string,
  quantity: number | null,
  unit: Unit,
  preparation?: string,
];

/** Texto do passo e dica opcional. */
export type SeedStep = [text: string, tip?: string];

export interface SeedRecipe {
  slug: string;
  title: string;
  description: string;
  categorySlug: string;
  prepMinutes: number;
  yieldQuantity: number;
  yieldUnit: string;
  servings: number;
  ingredients: SeedIngredient[];
  steps: SeedStep[];
}

/** Na ordem de publicação: a primeira é a mais antiga, a última aparece no topo da lista. */
export const seedRecipes: SeedRecipe[] = [
  {
    slug: 'escondidinho-de-carne-desfiada-com-pure-de-mandioca',
    title: 'Escondidinho de carne desfiada com purê de mandioca',
    description:
      'Acém desfiado na pressão, purê de mandioca cremoso e cobertura gratinada com três queijos.',
    categorySlug: 'pot',
    prepMinutes: 100,
    yieldQuantity: 6,
    yieldUnit: 'porções',
    servings: 6,
    ingredients: [
      ['acém', 1, 'kg', 'em cubos grandes (5 cm)'],
      ['óleo', 2, 'tbsp'],
      ['cebola', 1, 'unit', 'grande, picada'],
      ['alho', 4, 'clove', 'picados'],
      ['tomate', 2, 'unit', 'picados'],
      ['folha de louro', 2, 'unit'],
      ['água', 500, 'ml'],
      ['sal', 2, 'tsp', 'para a carne'],
      ['pimenta-do-reino', 0.5, 'tsp'],
      ['cheiro-verde', 3, 'tbsp', 'picado'],
      ['mandioca', 1.2, 'kg', 'descascada'],
      ['manteiga', 3, 'tbsp'],
      ['leite', 250, 'ml'],
      ['sal', 1, 'tsp', 'para o purê'],
      ['requeijão cremoso', 200, 'g'],
      ['muçarela', 150, 'g', 'ralada'],
      ['parmesão', 50, 'g', 'ralado'],
    ],
    steps: [
      [
        'Tempere o acém com o sal da carne e a pimenta. Aqueça o óleo na panela de pressão em fogo alto e doure a carne em 2 ou 3 levas, sem amontoar, até formar uma crosta escura, cerca de 10 minutos. Reserve.',
      ],
      [
        'Na mesma panela, refogue a cebola por 3 minutos, junte o alho e o tomate e raspe o fundo para soltar o que grudou. Volte a carne, adicione o louro e a água. Tampe e, quando pegar pressão, abaixe o fogo e cozinhe por 40 minutos.',
        'A carne pode ser feita até 3 dias antes e fica ainda mais saborosa',
      ],
      [
        'Enquanto a carne está na pressão, cubra a mandioca com água e uma boa pitada de sal em outra panela e cozinhe por cerca de 30 minutos, até desmanchar ao toque do garfo.',
        'Comece assim que a pressão pegar, as duas ficam prontas juntas',
      ],
      [
        'Escorra a mandioca, retire as fibras centrais e amasse ainda quente com a manteiga, o leite e o sal do purê até ficar liso e firme. Use espremedor ou amassador.',
        'Liquidificador deixa a mandioca elástica',
      ],
      [
        'Solte a pressão, descarte o louro e desfie a carne com dois garfos. Volte ao caldo e cozinhe em fogo médio, mexendo, por cerca de 10 minutos, até secar quase todo o líquido. Finalize com o cheiro-verde e acerte o sal.',
        'Na batedeira, com o batedor de pá, desfia em 1 minuto',
      ],
      [
        'Preaqueça o forno a 200 °C. Em um refratário de cerca de 20 x 30 cm, espalhe um terço do purê, depois toda a carne, distribua o requeijão em colheradas e cubra com o restante do purê. Salpique a muçarela e o parmesão por cima.',
        'Carne bem seca, senão o purê encharca',
      ],
      [
        'Leve ao forno por cerca de 25 minutos, até dourar por cima e borbulhar nas bordas.',
        'Montado e ainda sem assar, congela por até 3 meses',
      ],
      ['Deixe descansar 5 minutos fora do forno antes de servir, para as camadas firmarem.'],
    ],
  },
  {
    slug: 'risoto-de-strogonoff-de-frango',
    title: 'Risoto de strogonoff de frango',
    description:
      'Risoto cremoso com frango, champignon e molho de strogonoff, finalizado com batata palha. Os cinco primeiros passos são o pré-preparo; depois é só fogão.',
    categorySlug: 'pot',
    prepMinutes: 50,
    yieldQuantity: 4,
    yieldUnit: 'porções',
    servings: 4,
    ingredients: [
      ['peito de frango', 500, 'g', 'ou sobrecoxa sem osso'],
      ['arroz arbóreo', 300, 'g'],
      ['caldo de galinha', 1.2, 'l'],
      ['vinho branco seco', 120, 'ml'],
      ['cebola', 1, 'unit', 'média'],
      ['alho', 2, 'clove'],
      ['champignon', 150, 'g'],
      ['manteiga', 2, 'tbsp'],
      ['azeite', 2, 'tbsp'],
      ['ketchup', 3, 'tbsp'],
      ['mostarda', 1, 'tbsp'],
      ['molho inglês', 1, 'tbsp'],
      ['creme de leite', 200, 'g'],
      ['parmesão', 50, 'g'],
      ['sal', 1, 'tsp'],
      ['pimenta-do-reino', 0.5, 'tsp', 'moída'],
      ['salsinha', 2, 'tbsp'],
      ['batata palha', 50, 'g'],
    ],
    steps: [
      [
        'Coloque o caldo de galinha numa panela em fogo baixo. Ele vai aquecendo enquanto você faz o resto do pré-preparo e precisa estar quente na hora de usar.',
        'É o que mais economiza tempo',
      ],
      [
        'Corte o frango em cubos de uns 2 cm e tempere com metade do sal e da pimenta. Deixe num prato perto do fogão.',
        'Sobrecoxa sem osso fica mais suculenta',
      ],
      [
        'Pique a cebola e o alho e deixe os dois juntos num potinho, porque entram quase ao mesmo tempo. Fatie o champignon e deixe em outro potinho.',
      ],
      [
        'Num potinho, misture o ketchup, a mostarda e o molho inglês, para o molho entrar de uma vez só.',
      ],
      [
        'Meça o arroz e o vinho e deixe ao lado do fogão com o azeite. Divida a manteiga em duas partes. Rale o parmesão, pique a salsinha e deixe o creme de leite e a batata palha separados para o final.',
      ],
      [
        'Aqueça o azeite numa panela larga em fogo alto e doure o frango em porções, sem amontoar, até ficar bem dourado por fora, cerca de 6 minutos. Reserve no prato.',
      ],
      [
        'Na mesma panela, ainda em fogo alto, doure o champignon mexendo pouco, cerca de 4 minutos. Junte ao prato do frango, com o caldinho.',
      ],
      [
        'Baixe para fogo médio, derreta metade da manteiga e refogue a cebola com o alho por cerca de 3 minutos, até a cebola ficar translúcida, sem deixar o alho queimar.',
      ],
      [
        'Adicione o arroz e mexa por cerca de 2 minutos, até as bordas dos grãos ficarem translúcidas.',
      ],
      ['Despeje o vinho e mexa até evaporar quase todo, soltando o fundinho da panela.'],
      [
        'Adicione o caldo quente uma concha de cada vez, mexendo sempre, e só coloque a próxima quando a anterior for absorvida. Cozinhe por cerca de 18 minutos, até o arroz ficar al dente e cremoso.',
        'Caldo pronto já é salgado, prove antes de salgar',
      ],
      [
        'Despeje o pote de molho, volte o frango e o champignon com o caldinho e cozinhe por 2 a 3 minutos, mexendo, até o frango terminar de cozinhar por dentro.',
        'O frango só volta agora, senão fica seco e borrachudo',
      ],
      [
        'Desligue o fogo e incorpore o creme de leite, o parmesão e o restante da manteiga. Acerte o sal e a pimenta, tampe e deixe descansar 2 minutos. Se ficar firme demais, solte com um pouco do caldo que sobrou.',
      ],
      [
        'Sirva na hora, com a salsinha e a batata palha por cima, já no prato.',
        'Batata palha só no prato, para não murchar',
      ],
    ],
  },
  {
    slug: 'macarrao-parafuso-com-carne-moida-e-queijo-no-forno',
    title: 'Macarrão parafuso com carne moída e queijo no forno',
    description:
      'Macarrão gratinado com molho de tomate cremoso, carne moída e bastante queijo derretido por cima.',
    categorySlug: 'pot',
    prepMinutes: 50,
    yieldQuantity: 6,
    yieldUnit: 'porções',
    servings: 6,
    ingredients: [
      ['macarrão parafuso', 500, 'g'],
      ['carne moída', 500, 'g'],
      ['cebola', 1, 'unit', 'média, picada'],
      ['alho', 3, 'clove', 'picados'],
      ['azeite', 2, 'tbsp'],
      ['molho de tomate', 680, 'g'],
      ['creme de leite', 200, 'g'],
      ['muçarela', 250, 'g', 'ralada'],
      ['parmesão', 50, 'g', 'ralado'],
      ['sal', 1, 'tsp'],
      ['pimenta-do-reino', 0.5, 'tsp'],
      ['orégano', 1, 'tsp'],
      ['cheiro-verde', 2, 'tbsp', 'picado, opcional'],
    ],
    steps: [
      ['Preaqueça o forno a 200 °C e separe um refratário médio, de cerca de 30 x 20 cm.'],
      [
        'Cozinhe o macarrão em bastante água fervente com sal, tirando cerca de 2 minutos antes do tempo da embalagem. Escorra e reserve.',
        'Bem al dente, porque ele termina de cozinhar no forno',
      ],
      [
        'Em uma panela grande, aqueça o azeite e refogue a cebola por cerca de 3 minutos, até ficar transparente. Junte o alho e mexa por 1 minuto, sem deixar queimar.',
      ],
      [
        'Adicione a carne moída, solte bem com uma colher e deixe dourar, mexendo de vez em quando, por cerca de 10 minutos, até perder a cor rosada e secar a água que ela solta.',
      ],
      [
        'Acrescente o molho de tomate, o sal, a pimenta e o orégano. Abaixe o fogo e deixe apurar por 10 minutos com a panela semitampada.',
      ],
      ['Desligue o fogo e misture o creme de leite. Prove e ajuste o sal se precisar.'],
      [
        'Misture o macarrão ao molho com metade da muçarela. Transfira para o refratário e cubra com o restante da muçarela e o parmesão.',
        'Dá para trocar metade da muçarela por queijo prato',
      ],
      [
        'Leve ao forno por cerca de 20 minutos, até o queijo derreter e dourar. Finalize com o cheiro-verde antes de servir.',
        'Grill nos últimos 5 minutos deixa mais crocante',
      ],
    ],
  },
  {
    slug: 'gallo-pinto',
    title: 'Gallo pinto',
    description:
      'Arroz e feijão preto refogados juntos, ao estilo costarriquenho. Rende melhor com arroz e feijão do dia anterior.',
    categorySlug: 'pot',
    prepMinutes: 20,
    yieldQuantity: 4,
    yieldUnit: 'porções',
    servings: 4,
    ingredients: [
      ['arroz branco cozido', 3, 'cup', 'de preferência do dia anterior'],
      ['feijão preto cozido', 2, 'cup'],
      ['caldo de feijão', 0.5, 'cup'],
      ['cebola', 1, 'unit', 'média, picada'],
      ['pimentão vermelho', 0.5, 'unit', 'picado'],
      ['alho', 2, 'clove', 'picados'],
      ['óleo', 2, 'tbsp'],
      ['Salsa Lizano', 3, 'tbsp', 'ou molho inglês'],
      ['coentro', 0.5, 'cup', 'picado'],
      ['sal', 0.5, 'tsp'],
    ],
    steps: [
      [
        'Aqueça o óleo em uma frigideira grande em fogo médio. Junte a cebola e o pimentão e refogue por cerca de 5 minutos, até amolecerem.',
      ],
      ['Acrescente o alho e mexa por 1 minuto, até perfumar, sem deixar dourar demais.'],
      [
        'Adicione o feijão, o caldo do feijão e a Salsa Lizano. Deixe ferver levemente por cerca de 4 minutos, até o caldo reduzir um pouco.',
        'Sem Salsa Lizano, use 2 c. sopa de molho inglês e uma pitada de cominho',
      ],
      [
        'Junte o arroz e misture delicadamente para não esmagar. Cozinhe por cerca de 5 minutos, mexendo de vez em quando, até o arroz ficar escurinho e absorver o caldo.',
        'Arroz e feijão de ontem deixam o arroz soltinho',
      ],
      [
        'Desligue o fogo, acrescente o coentro e acerte o sal. Sirva quente.',
        'Na Costa Rica, vai com ovo frito e banana-da-terra',
      ],
    ],
  },
];
