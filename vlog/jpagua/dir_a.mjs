// DIRECTOR A — jpagua (Claudio en Japón #5, "Lo que aprendí en Tokio"): MINUTO 1 (la miniatura HÉROE cobra vida: el frasco marrón
// "va en la cocina" → Sato-san saca la tabla del basurero delante de los cocineros y busca el frasco (loop: lo que dijo) → el frasco
// olvidado en el baño → promesa 16 usos + la 7 (no le damos tiempo) → credibilidad + test) + polaroid del video 4 + qué es + usos 1
// (paños), 2 (sangre en la ropa), 3 (amarillo de las camisas, mención 1 del Método pág. 13 con la frase del mostrador). Párrafos 0-18.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH, BOTTLE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpagua/";
export const H = "a man's hands with tanned skin, the sleeve of a plain red polo shirt at the edge of the frame";
export const SATOP = I + "x_sato.jpg";
export const KITCHEN = "a small bright Latin American kitchen with white tiles, light-wood cabinets and a window";
export const STAFFK = "the stainless-steel staff kitchen of a quiet, spotless Tokyo business hotel";
export const R = (n, title, sub, o = {}) => ({ n, total: 16, title, sub, label: "USO", starText: "LA QUE CASI TODOS HACEMOS MAL", ...o });
export const SHOTS = [
  // ── 0:00 · la miniatura héroe cobra vida
  C(0, "", "ClHeroHook", { bed: I + "x_thumbbg.jpg", lines: ["Va en la", "cocina"], marks: [{ x: 470, y: 330, text: "3 %" }, { x: 470, y: 900, text: "NO EN EL BOTIQUÍN" }] }),
  S(0, "Está en la cocina", "bi", "b_bottlekitchen", { q: "hydrogen peroxide bottle kitchen", p: BI(`${BOTTLE} standing on the counter of a small tidy Japanese kitchen next to a wooden cutting board and a sponge.`) }),
  S(0, "Y tú lo tienes escondido detrás de las curitas", "bi", "b_firstaid", { q: "first aid kit cabinet", p: BI(`An open bathroom cabinet with adhesive bandages, cotton and pill boxes with blank labels in front, ${BOTTLE} hidden at the back.`) }),
  // ── Sato-san y la tabla
  S(1, "", "bi", "b_staffkitchen", { q: "hotel kitchen stainless steel", p: BI(`${STAFFK}: steel counters, a big sink, cooks in white jackets in the background, morning.`) }),
  S(1, "Encontré una tabla de cortar llena de manchas", "bi", "b_stainedboard", { q: "old cutting board stains", p: BI("An old white plastic cutting board covered in dark knife scratches and stains, lying on a steel counter.") }),
  S(1, "y la tiré a la basura", "kf", "k_boardtrash", { p: BI(`Close view of ${H} dropping a stained white plastic cutting board into a large steel kitchen trash bin.`), d1: "the hand holds the board over the bin", d2: "the board drops into the bin", sound: "a plastic board dropped into a bin" }),
  S(1, "Sato-san la sacó del basurero", "bi", "b_satoboard", { p: BI(`${SATO} pulling a white plastic cutting board out of a steel trash bin in ${STAFFK}, calm and serious.`) }),
  S(1, "delante de todos los cocineros", "bi", "b_cooks", { p: BI(`Three Japanese cooks in white jackets and caps pausing their work in ${STAFFK} to watch someone off frame, curious.`) }),
  S(1, "la apoyó en la mesa de acero", "bi", "b_boardsteel", { p: BI(`A stained white plastic cutting board laid flat on a stainless steel table in ${STAFFK}.`) }),
  S(1, "y fue a buscar un frasco marrón", "bi", "b_satobottle", { p: BI(`${SATO} taking ${BOTTLE} from a steel shelf in ${STAFFK}.`) }),
  S(1, "mientras la tabla hacía espuma", "kf", "k_boardfoam", { p: BI("Close view of hydrogen peroxide poured on a white plastic cutting board on a steel table, small white bubbles forming in the scratches."), d1: "the liquid sits on the board", d2: "fine white foam bubbles up in the scratches", sound: "a soft fizz of bubbles" }),
  S(1, "todavía lo repito", "av", ""),
  // ── el frasco olvidado
  S(2, "", "bi", "b_bottleback", { p: BI(`The back of a crowded bathroom cabinet shelf in ${BATH}, ${BOTTLE} behind creams and boxes, almost full.`) }),
  S(2, "para un raspón hace dos años", "bi", "b_knee", { q: "child scraped knee bandage", p: BI("A child's knee with a small scrape and an adhesive bandage, sitting on a sofa, only the leg in the frame.") }),
  S(2, "al fondo del mueble del baño", "cl", "c_findbottle", { p: CLP(`He pulls ${BOTTLE} out from the back of a bathroom cabinet in ${BATH} and holds it up with raised eyebrows.`) }),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "casi todos en la cocina", "bi", "b_kitchenwide", { q: "bright kitchen home", p: BI(`${KITCHEN} in the morning, a cutting board, a sponge and dish cloths by the sink.`) }),
  S(3, "Y la número siete", "bi", "b_board7", { q: "cutting board chicken", p: BI("Raw chicken pieces on a white plastic cutting board on a kitchen counter, a knife beside them.") , ov: { c: "ClChip", props: { text: "Nº 7", alert: true } } }),
  S(3, "pero no le damos tiempo de trabajar", "kf", "k_spraywipe", { p: BI(`Close view of ${H} spraying a cutting board and wiping it immediately with a cloth.`), d1: "the spray bottle points at the board", d2: "the cloth wipes the board right away", sound: "a spray trigger and a quick wipe" }),
  // ── credibilidad + test
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "15 años de conserje en Tokio" } } }),
  S(4, "en un hotel de Tokio", "bi", "b_hotelfront", { q: "tokyo hotel entrance", p: BI("The entrance of a modest business hotel on a quiet Tokyo street in the morning, no readable signs.") }),
  S(4, "donde el frasco marrón estaba en todos los carritos de limpieza", "bi", "b_cartbottle", { p: BI(`A hotel housekeeping cart in a corridor of ${HOTEL} with folded towels, cloths and ${BOTTLE} in the top tray.`) }),
  S(4, "Y al final te dejo el test de cinco minutos", "bi", "b_timer5", { q: "kitchen timer", p: BI("A simple white kitchen timer set to five minutes on a light-wood table next to a pillow and a folded towel.") }),
  S(4, "para saber a qué huele tu casa", "bi", "b_sniffair", { p: BI(`A Latin American woman stepping into the living room of ${HOUSE} and sniffing the air with a curious face.`) }),
  // ── el video 4
  C(5, "", "ClVideoRef", { thumb: I + "th_jpcasa.jpg", title: "11 cosas que hacen que tu casa huela a viejo" }),
  S(5, "Hoy el frasco hace el trabajo", "bi", "b_bottlecloth", { p: BI(`${BOTTLE} next to a folded cloth and a spray top on a light-wood counter in ${HOUSE}.`) }),
  // ── qué es
  C(6, "", "ClBottle3D", { title: "Agua oxigenada 3 %", sub: "agua + un poco más de oxígeno" }),
  S(6, "queda agua y un poco de aire", "kf", "k_bubbles", { p: BI("Extreme close view of tiny oxygen bubbles rising in a clear liquid in a white bowl on a kitchen counter."), d1: "a few bubbles on the surface", d2: "bubbles rise and pop", sound: "a soft fizz" }),
  S(6, "No deja olor", "bi", "b_cleancounter", { q: "clean kitchen counter", p: BI(`A clean, dry kitchen counter in ${KITCHEN} with nothing on it but a folded cloth, sunlight.`) }),
  S(7, "", "bi", "b_pharmacy", { q: "pharmacy shelf bottles", p: BI("A pharmacy shelf with several brown plastic bottles with plain blank labels in a row.") }),
  S(7, "Es la única que vas a usar hoy", "cl", "c_onebottle", { p: CLP(`He holds ${BOTTLE} up next to his face in ${KITCHEN}, tapping the label with one finger.`), ov: { c: "ClChip", props: { text: "3 % · 10 volúmenes" } } }),

  // ══ 1 · los paños de cocina
  C(8, "", "ClRule", R(1, "Los paños de cocina", "de color té a blancos")),
  S(8, "los paños empezaban blancos y a los meses estaban color té", "bi", "b_teacloths", { q: "kitchen towels hanging", p: BI("Several kitchen cloths hanging on a rail, some white and some stained the color of weak tea.") }),
  S(8, "Sato-san los ponía en remojo", "bi", "b_satosoak", { p: BI(`${SATO} lowering stained kitchen cloths into a plastic basin of water in ${STAFFK}.`) }),
  S(9, "", "cl", "c_clothsmell", { p: CLP(`He smells a freshly washed kitchen cloth in ${KITCHEN} and makes a face.`) }),
  S(9, "Y el detergente solo no llega", "bi", "b_clothfiber", { p: BI("Extreme close view of the fibers of an old grayish kitchen cloth.") }),
  C(10, "", "ClNumbers", { title: "Los paños", rows: [["Agua oxigenada", "½ taza"], ["Con", "agua caliente en el fregadero"], ["Remojo", "1 hora"], ["Después", "lavado normal"]], page: 13 }),
  S(10, "Vuelven blancos", "kf", "k_clothsoak", { p: BI(`Close view of ${H} lifting a white kitchen cloth out of a sink full of hot water.`), d1: "the cloth is under the water", d2: "the hand lifts the white cloth out dripping", sound: "a cloth lifted out of water, dripping" }),

  // ══ 2 · sangre en la ropa
  C(11, "", "ClRule", R(2, "Una mancha de sangre", "agua fría, nunca caliente")),
  S(11, "Un corte pelando papas", "bi", "b_peel", { q: "peeling potatoes kitchen", p: BI(`Hands peeling a potato with a small knife over a bowl in ${KITCHEN}.`) }),
  S(11, "una gota en el delantal", "bi", "b_apron", { q: "white apron kitchen", p: BI("A small red stain on a white cotton apron hanging on a kitchen hook.") }),
  C(11, "agua fría, nunca caliente", "ClSato", { img: SATOP, quote: "Agua fría. Nunca caliente." }),
  S(12, "", "kf", "k_coldwater", { p: BI("Close view of a white cloth with a small red stain held under a cold running tap in a sink."), d1: "the stain is under the tap", d2: "the water runs through the cloth", sound: "a cold tap running" }),
  S(12, "Esa espuma es la mancha saliendo", "kf", "k_stainfoam", { p: BI("Extreme close view of hydrogen peroxide poured on a red stain on white cotton, white foam forming."), d1: "the liquid touches the stain", d2: "white foam bubbles up over the stain", sound: "a soft fizz" }),
  S(13, "", "bi", "b_cleanapron", { q: "apron hanging clothesline", p: BI("A clean white apron hanging to dry on a line in the sun.") }),
  S(13, "prueba antes en un rincón que no se vea", "cl", "c_testcorner", { p: CLP(`He dabs a cotton swab on the inside hem of a dark shirt in ${KITCHEN}, checking carefully.`), ov: { c: "ClStampOv", props: { text: "PROBAR EN UN RINCÓN", alert: true } } }),

  // ══ 3 · el amarillo de las camisas (mención 1)
  C(14, "", "ClRule", R(3, "El amarillo de las camisas", "una pasta y sol")),
  S(14, "En el verano de Tokio", "bi", "b_tokyosummer", { q: "tokyo summer street humid", p: BI("A hot humid summer afternoon on a quiet Tokyo street, office workers in white shirts, no readable signs.") }),
  S(14, "Las del uniforme del hotel duraban años", "bi", "b_uniforms", { q: "white shirts hanging rack", p: BI(`Bright white uniform shirts hanging in a row in the laundry room of ${HOTEL}.`) }),
  S(15, "", "bi", "b_yellowcollar", { q: "dirty shirt collar", p: BI("Close view of the yellowed collar of a white shirt laid on a table.") }),
  S(15, "Por eso refregar no sirve", "cl", "c_scrub", { p: CLP(`He scrubs the yellow armpit of a white shirt at a sink in ${KITCHEN}, frustrated.`) }),
  S(16, "", "kf", "k_paste", { p: BI(`Close view of ${H} spreading a white paste of baking soda over the yellowed underarm of a white shirt laid flat.`), d1: "the spoon of paste touches the fabric", d2: "the paste is spread over the yellow area", sound: "a spoon spreading paste on fabric" }),
  S(16, "y si se puede, al sol", "bi", "b_shirtsun", { q: "white shirt drying sun", p: BI("A white shirt laid flat on a table in the sun by an open window, a white paste on the underarm.") }),
  // mención 1
  S(17, "", "av", ""),
  S(17, "En el Método te dejé anotado", "bi", "b_shoplist", { p: BI(`A handwritten shopping list on a notepad on a light-wood table next to two brown plastic bottles of hydrogen peroxide with blank white labels and an opaque white spray bottle.`), ov: { c: "ClChip", props: { text: "Método · pág. 13" } } }),
  S(17, "En la farmacia, pide así", "bi", "b_pharmacounter", { q: "pharmacy counter", p: BI("The counter of an ordinary neighborhood pharmacy with two brown plastic bottles with blank labels and a white spray bottle on it.") }),
  C(17, "necesito dos frascos de agua oxigenada", "ClCheck", { title: "Lo único que hay que comprar", label: "MÉTODO · PÁG. 13", items: ["2 frascos de agua oxigenada de 10 volúmenes", "Un atomizador opaco", "Un paño", "Bicarbonato"] }),
  S(18, "", "bi", "b_spraytop", { q: "spray bottle kitchen counter", p: BI(`A white spray top screwed directly onto ${BOTTLE} on a kitchen counter.`) }),
];
