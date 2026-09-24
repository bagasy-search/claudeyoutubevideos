// gen_matchlist_dulces.mjs — arma un match list DENSO (~200 beats) estilo "barcos".
// Cada dulce: varios ángulos (proceso, ingredientes, primer plano, servir) + un POOL
// grande de ambiente nostálgico reusable para los pasajes reflexivos "se perdió porque".
import fs from "fs";

// [key, nombreES, EN-concept-base, [queries proceso], [queries beauty/servir]]
const D = [
  ["d01_alfajores","alfajores de maicena","maicena alfajores with dulce de leche and coconut",
    ["armar alfajores de maicena receta","rellenar alfajores dulce de leche coco"],
    ["alfajor de maicena mordido dulce de leche","alfajores de maicena apilados coco"]],
  ["d02_dulceleche","dulce de leche","dulce de leche cooking in a pot stirred",
    ["hacer dulce de leche casero olla revolviendo","dulce de leche cuchara de madera olla"],
    ["dulce de leche chorreando cuchara primer plano","frasco de dulce de leche casero"]],
  ["d03_arrozleche","arroz con leche","arroz con leche rice pudding with cinnamon",
    ["hacer arroz con leche casero olla","arroz con leche canela revolviendo olla"],
    ["arroz con leche plato canela espolvoreada","bol de arroz con leche cremoso"]],
  ["d04_mazamorra","mazamorra","white corn mazamorra criolla dessert",
    ["hacer mazamorra maiz blanco receta criolla","mazamorra cocinando olla maiz"],
    ["mazamorra servida en plato","mazamorra con miel de caña"]],
  ["d05_coco","bocaditos de coco","coconut and dulce de leche balls",
    ["hacer bocaditos de coco dulce de leche","bolitas de coco armando a mano"],
    ["bocaditos de coco bañados chocolate","bolitas de coco en plato"]],
  ["d06_turronquaker","turron de quaker","oat caramel turron pressed in tray",
    ["hacer turron de quaker avena receta","turron de avena caramelo sarten"],
    ["turron de quaker cortado cuadrados","turron de avena casero plato"]],
  ["d07_mantecol","mantecol de mani","peanut nougat mantecol crushed peanuts",
    ["hacer mantecol casero mani receta","turron de mani moliendo mani"],
    ["mantecol barra cortada","mantecol de mani primer plano"]],
  ["d08_cascaritas","cascaritas de naranja","candied orange peel in sugar syrup",
    ["hacer cascaras de naranja confitadas","cascaritas de naranja almibar cocinando"],
    ["cascaritas de naranja abrillantadas azucar","cascaras de naranja confitadas frasco"]],
  ["d09_colacion","colacion","white glazed colacion filled candy",
    ["hacer colacion cordobesa receta","colacion rellena dulce de leche glase"],
    ["colacion bolitas blancas plato","colacion cordobesa primer plano"]],
  ["d10_alfeniques","alfeniques","pulling hot sugar caramel into white candy",
    ["hacer alfeñique caramelo azucar estirado","estirar caramelo azucar a mano blanco"],
    ["alfeñique caramelo blanco artesanal","caramelo de azucar estirado golosina"]],
  ["d11_membrillo","dulce de membrillo","quince paste cooking red thick",
    ["hacer dulce de membrillo casero olla","membrillo hirviendo cedazo pasta"],
    ["dulce de membrillo con queso vigilante","tajada de dulce de membrillo"]],
  ["d12_arrope","arrope","dark grape arrope syrup pouring",
    ["hacer arrope de uva casero receta","arrope de tuna cocinando jarabe"],
    ["arrope oscuro sobre pan","arrope de uva frasco jarabe"]],
  ["d13_melcocha","melcocha","pulling melcocha taffy on hook",
    ["hacer melcocha caramelo estirado","melcocha artesanal estirar gancho feria"],
    ["melcocha golosina estirada","melcocha caramelo masticable"]],
  ["d14_caramelosleche","caramelos de leche","milk toffee caramels wrapped",
    ["hacer caramelos de leche caseros toffee","caramelos blandos de leche olla"],
    ["caramelos de leche envueltos papel","caramelos de leche primer plano"]],
  ["d15_ambrosia","ambrosia","ambrosia egg yolk threads in syrup",
    ["hacer ambrosia postre yemas almibar","ambrosia yemas hilos cocinando"],
    ["ambrosia postre hilos dorados compotera","ambrosia servida vidrio"]],
  ["d16_bombones","bombones de chocolate","homemade chocolate eggs and bonbons molds",
    ["hacer huevos de pascua caseros chocolate molde","bombones caseros baño maria rellenar"],
    ["bombones caseros surtidos","huevos de chocolate caseros pascua"]],
  ["d17_chupetines","chupetines","homemade caramel lollipops",
    ["hacer chupetines caseros caramelo","paletas de caramelo palito casero"],
    ["chupetin de caramelo brillante","chupetines caseros colores"]],
  ["d18_frutasabrillantadas","frutas abrillantadas","colorful candied glace fruits",
    ["hacer frutas abrillantadas confitadas receta","confitar frutas almibar colores"],
    ["frutas abrillantadas colores frasco","frutas confitadas para pan dulce"]],
  ["d19_conitos","conitos de dulce de leche","cones with dulce de leche and meringue",
    ["hacer conitos de dulce de leche merengue","armar conitos rellenos manga"],
    ["conitos de dulce de leche bandeja","conito de dulce de leche primer plano"]],
  ["d20_quesillo","quesillo con arrope","fresh quesillo cheese with dark arrope",
    ["hacer quesillo casero norte","quesillo con arrope receta norteña"],
    ["quesillo con arrope plato","quesillo fresco norte argentino"]],
];

// Pool de AMBIENTE nostálgico — reusable en intro, cada "se perdió porque", extras, cierre.
const AMB = [
  ["amb_cocina_vieja1","old rustic argentine kitchen wood stove","cocina antigua de campo leña"],
  ["amb_cocina_vieja2","vintage 1960s kitchen formica table","cocina vieja mesa formica retro"],
  ["amb_abuela_cocina1","elderly grandmother cooking stirring pot","abuela cocinando revolviendo olla"],
  ["amb_abuela_cocina2","old woman baking in kitchen","anciana cocinando reposteria casa"],
  ["amb_manos_viejas1","old wrinkled hands kneading dough","manos viejas amasando masa"],
  ["amb_manos_viejas2","old hands stirring caramel wooden spoon","manos ancianas revolviendo caramelo cuchara"],
  ["amb_azucar_caramelo1","white sugar melting into golden caramel pan","azucar derritiendo caramelo dorado sarten"],
  ["amb_azucar_caramelo2","caramel bubbling in a pot close up","caramelo hirviendo burbujas olla"],
  ["amb_almibar","syrup boiling in a pot slow","almibar hirviendo olla lento"],
  ["amb_horno_lena","wood fired oven baking bread","horno de barro leña pan"],
  ["amb_nietos_cocina","grandmother and grandchildren baking together flour","abuela nietos cocinando harina juntos"],
  ["amb_familia_mesa1","vintage family eating around table warm","familia antigua comiendo mesa reunidos"],
  ["amb_familia_mesa2","family sharing dessert old photo","familia compartiendo postre foto vieja"],
  ["amb_frascos_despensa","glass jars of homemade jam pantry shelf","frascos de dulce casero despensa"],
  ["amb_mercado_feria","old street market fair sweets vendor","feria mercado antiguo golosinas puesto"],
  ["amb_ninos_golosina","children eating candy happy vintage","niños comiendo golosina felices antiguo"],
  ["amb_cuchara_madera","wooden spoon stirring sweet mixture","cuchara de madera revolviendo dulce"],
  ["amb_mesa_dulces","table full of homemade sweets spread","mesa llena de dulces caseros"],
  ["amb_te_merienda","afternoon tea with homemade sweets","merienda te con dulces caseros mesa"],
  ["amb_campo_fruta","fruit harvest orchard basket","cosecha de fruta huerta canasto"],
];

const beats = [];
for (const [key, es, concept, proc, beauty] of D) {
  beats.push({ name: `${key}_proc`, concept: `making ${concept}, hands cooking process`, query: proc, dur: 5 });
  beats.push({ name: `${key}_ingr`, concept: `ingredients for ${es} on a table`, query: [`${es} ingredientes`, `${proc[0]}`], dur: 4 });
  beats.push({ name: `${key}_close`, concept: `extreme close up of ${concept}`, query: beauty, dur: 4 });
  beats.push({ name: `${key}_serve`, concept: `${concept} served, plated, ready to eat`, query: beauty, dur: 4 });
}
for (const [name, concept, query] of AMB) beats.push({ name, concept, query: [query], dur: 5 });

fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/match_dulces.json", JSON.stringify(beats, null, 1));
console.log(`match list DENSO: ${beats.length} beats (${D.length} dulces x4 + ${AMB.length} ambiente)`);
