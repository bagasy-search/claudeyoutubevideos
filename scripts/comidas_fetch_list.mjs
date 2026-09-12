// comidas_fetch_list.mjs — arma _v3/comidas_fetch.json: por CADA comida, queries
// específicas en español ancladas al NOMBRE del plato (cocinándose + emplatado),
// para bajar fotos reales on-topic con fetch_bing. Prefijo dNN_ = mapea foto→comida.
import fs from "fs";

// [slug, [ {q, c(concept EN), n} ... ] ] por comida (n = candidatos a quedarse por query)
const DISHES = [
  ["d01_sopapan",   [["sopa de pan casera plato hondo", "rustic bread soup in a bowl", 8], ["pan duro remojado en caldo", "stale bread soaked in broth", 8]]],
  ["d02_lentejas",  [["guiso de lentejas casero olla", "lentil stew in a pot home cooking", 8], ["plato de lentejas guisadas con chorizo", "plate of stewed lentils", 8]]],
  ["d03_polenta",   [["polenta amarilla cremosa plato", "creamy yellow polenta on a plate", 8], ["olla de polenta revolviendo cuchara", "cooking polenta stirring pot", 8]]],
  ["d04_tortillapapa", [["tortilla de papas española sarten", "spanish potato omelette in a pan", 8], ["porcion de tortilla de papa en plato", "slice of potato omelette on plate", 8]]],
  ["d05_arrozhuevo",[["arroz blanco con huevo frito plato", "white rice with a fried egg on top", 8], ["huevo frito sobre arroz casero", "fried egg over rice home meal", 8]]],
  ["d06_fideosmanteca", [["fideos con manteca y queso plato", "buttered noodles with cheese plate", 8], ["tallarines con manteca caseros", "plain buttered spaghetti", 8]]],
  ["d07_arrozguisado", [["arroz guisado con verduras olla", "stewed rice with vegetables in a pot", 8], ["plato de arroz amarillo guisado", "plate of yellow stewed rice", 8]]],
  ["d08_zapallo",   [["zapallo calabaza hervido pure plato", "cooked mashed squash pumpkin plate", 8], ["puree de zapallo casero", "homemade pumpkin puree", 8]]],
  ["d09_puchero",   [["puchero criollo olla carne verduras", "boiled beef and vegetables stew pot", 8], ["plato de puchero con papa choclo", "plate of puchero boiled dinner", 8]]],
  ["d10_guisoarroz",[["guiso de arroz con carne olla", "rice stew with meat in a pot", 8], ["plato de arroz guisado casero humeante", "plate of hot rice stew", 8]]],
  ["d11_tortasfritas", [["tortas fritas caseras plato", "fried dough cakes tortas fritas plate", 8], ["tortas fritas friendo en sarten", "frying dough cakes in a pan", 8]]],
  ["d12_bunuelos",  [["bunuelos de acelga fritos plato", "chard fritters fried on a plate", 8], ["bunuelos verdes friendo aceite", "green vegetable fritters frying", 8]]],
  ["d13_pangrasa",  [["pan casero con grasa de cerdo", "homemade bread with pork lard spread", 8], ["rebanada de pan con grasa y sal", "bread slice with lard and salt", 8]]],
  ["d14_sopaverdura", [["sopa de verduras casera plato", "homemade vegetable soup bowl", 8], ["olla de sopa de verduras humeante", "pot of steaming vegetable soup", 8]]],
  ["d15_croquetas", [["croquetas caseras fritas doradas plato", "golden fried croquettes on a plate", 8], ["croquetas friendo en aceite", "croquettes frying in oil", 8]]],
  ["d16_pastelpapa",[["pastel de papa al horno porcion", "baked shepherds pie potato slice", 8], ["pure de papa gratinado con carne", "mashed potato gratin with meat", 8]]],
  ["d17_locro",     [["locro criollo olla maiz zapallo", "locro corn and squash stew pot", 8], ["plato de locro humeante criollo", "plate of steaming locro stew", 8]]],
  ["d18_zapallitos",[["revuelto de zapallitos con huevo sarten", "zucchini scramble with egg in pan", 8], ["zapallitos salteados con huevo plato", "sauteed zucchini with egg plate", 8]]],
  ["d19_albondigas",[["albondigas con salsa de tomate plato", "meatballs in tomato sauce plate", 8], ["albondigas caseras en olla", "homemade meatballs in a pot", 8]]],
  ["d20_ensladalentejas", [["ensalada de lentejas fria plato", "cold lentil salad on a plate", 8], ["lentejas con cebolla huevo ensalada", "lentil salad with onion and egg", 8]]],
  ["d21_budinpan",  [["budin de pan casero porcion caramelo", "bread pudding slice with caramel", 8], ["budin de pan flan casero plato", "homemade bread pudding plate", 8]]],
  ["d22_maicena",   [["postre de maicena con leche plato", "cornstarch milk pudding bowl", 8], ["crema de maicena casera vainilla", "homemade vanilla cornstarch cream", 8]]],
  ["d23_fideosguisados", [["fideos guisados con salsa olla", "stewed noodles in sauce pot", 8], ["guiso de fideos plato casero", "noodle stew plate home cooking", 8]]],
  ["d24_matecocido",[["mate cocido taza infusion caliente", "cup of cooked mate tea", 8], ["taza de mate cocido con leche pan", "mate cocido with milk and bread", 8]]],
  ["d25_papamanteca", [["papa hervida con manteca perejil plato", "boiled potato with butter and parsley", 8], ["papas con manteca caseras plato", "buttered potatoes home plate", 8]]],
];

// b-roll emocional para intro + transiciones (viejos comiendo/cocinando solos, cocinas humildes)
const BROLL = [
  ["e_viejo_come",   [["anciano comiendo solo en la mesa", "old man eating alone at a table", 8], ["abuelo solo con un plato de comida", "lonely grandfather with a plate of food", 8]]],
  ["e_abuela_cocina",[["anciana cocinando en cocina humilde", "elderly woman cooking in a humble kitchen", 8], ["abuela revolviendo una olla", "grandmother stirring a pot", 8]]],
  ["e_manos_viejas", [["manos viejas arrugadas cocinando", "old wrinkled hands cooking", 8], ["manos ancianas cortando pan", "elderly hands cutting bread", 8]]],
  ["e_cocina_vieja", [["cocina antigua a lena rustica", "old rustic wood stove kitchen", 8], ["cocina humilde antigua olla fuego", "humble old kitchen pot over fire", 8]]],
  ["e_mesa_humilde", [["mesa humilde con plato de comida sencilla", "humble table with a simple meal", 8], ["plato de comida casera sobre mesa vieja", "home cooked plate on an old table", 8]]],
];

const list = [];
for (const [slug, qs] of [...DISHES, ...BROLL]) {
  qs.forEach(([q, c, n], i) => list.push({ name: `${slug}_${i + 1}`, query: q, concept: c, count: n }));
}
fs.writeFileSync("_v3/comidas_fetch.json", JSON.stringify(list, null, 1));
console.log(`fetch list: ${list.length} queries · ${DISHES.length} comidas + ${BROLL.length} broll · ~${list.reduce((a, x) => a + x.count, 0)} fotos objetivo`);
