// DIRECTOR B — algrieta: la lista + frase del mostrador → abrir en V, masilla elástica, malla (mención 2, pág. 13) → lo que se hizo en el
// pasillo de Doña Marta → si vuelve → mantener → las 4 señales otra vez (párrafos 32-48).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, HALL, CRACK, BOY } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/algrieta/";
export const SHOTS = [
  C(32, "", "ClChapter", { n: 4, title: "El arreglo", sub: "con el material que estira" }),
  C(33, "", "ClCheck", { title: "Lo que necesita", items: ["Moneda y lápiz", "Yeso de construcción", "Espátula de punta", "Masilla elástica para fisuras", "Afuera: malla + enduido"] }),
  S(34, "", "bi", "b_counter5", { p: BI("The counter of an ordinary neighborhood hardware store: a small bag of gypsum plaster, a tub of elastic crack filler and a tub of wall filler paste with plain blank labels, and a rolled strip of fiberglass mesh tape.") }),
  S(34, "Anótela tal cual", "av", ""),
  // ── abrir en V
  S(35, "", "kf", "k_vcut", { p: BI(`Close view of ${H} scraping along a diagonal crack in a pale mint-green wall with the tip of a putty knife, widening it into a small V groove, white dust falling.`), d1: "the tip of the putty knife goes into the crack", d2: "the knife runs along and opens the crack into a clean V groove", sound: "a metal tip scraping plaster" }),
  S(35, "Después sople el polvo", "bi", "b_blow", { p: BI("Close view of a man's face in profile blowing dust out of a freshly widened crack in a painted wall, dust puffing.") }),
  C(36, "", "ClVFill", { outside: false }),
  S(36, "Si la grieta es honda, en dos pasadas", "kf", "k_fill", { p: BI(`Close view of ${H} pressing white elastic filler into a V-shaped groove in a wall with a narrow putty knife, smoothing it flush.`), d1: "the knife pushes white filler into the groove", d2: "the knife smooths the filler flush with the wall", sound: "a putty knife scraping soft filler" }),
  C(37, "", "ClVFill", { outside: true }),
  S(37, "La malla es la que reparte el movimiento", "bi", "st_meshtape", { q: "fiberglass mesh tape wall", p: BI("Fiberglass mesh tape being applied over a crack on a wall.") }),
  S(38, "", "bi", "b_paintsmall", { p: BI(`Close view of a small brush painting pale mint-green paint over a freshly filled crack line above a door frame.`) }),
  C(39, "", "ClBookPage", { page: I + "book_p13.jpg", pageNo: 13, qr: I + "qr.jpg", stamp: "Manual · página 13" }),
  C(40, "", "ClCheck", { title: "El arreglo entero", items: ["La moneda", "Las 4 señales", "Testigo de yeso, 4 semanas", "Abrir en V + masilla elástica", "Malla si es afuera · pintar"], fast: true }),
  // ── lo que se hizo en el pasillo
  S(41, "", "cl", "c_vcut", { p: CLP(`He stands on a step stool in ${HALL} scraping the old filler out of the crack above the door with a putty knife, white flakes falling onto a drop cloth.`), anim: "he scrapes along the crack" }),
  S(41, "rellené con masilla elástica en dos pasadas", "cl", "c_fill", { p: CLP(`He stands on a step stool in ${HALL} smoothing white elastic filler into the crack above the door with a narrow putty knife.`) }),
  S(42, "", "bi", "b_pepe", { p: BI("A small round white gypsum plaster pill on a freshly painted pale mint-green wall right beside a wooden door frame, a tiny paper note with a child's handwriting taped next to it.") }),
  S(42, "Ella dice que es su seguro gratis", "av", ""),
  S(43, "", "bi", "b_painthall", { p: BI(`${HALL} being painted with a roller in the same pale mint-green, a drop cloth on the floor, the crack above the door gone.`), anim: "the roller rolls up the wall" }),
  S(43, "Tomás volvió a colgar las fotos de los primos", "bi", "b_hangframes", { p: BI(`${BOY} on tiptoes hanging a framed school photo back on a freshly painted pale mint-green hallway wall.`) }),
  C(43, "La grieta, ni una raya", "ClBeforeAfter", { before: I + "b_crackup.jpg", after: I + "b_crackup_ab.jpg", note: "dos olas de calor después" }),
  S(44, "", "bi", "b_guardian", { p: BI(`${BOY} standing proudly with his arms crossed under a small white plaster pill on the wall beside a door frame, as if guarding it.`) }),
  S(45, "", "bi", "b_martahall", { p: BI(`${MARTA} walking calmly down a freshly painted pale mint-green hallway with a cup of tea, not looking at the wall.`) }),
  S(45, "pasó por el pasillo sin mirar la pared", "av", ""),
  // ── si vuelve / mantener / señales
  S(46, "", "bi", "b_reopen2", { p: BI("A crack in a painted wall that reopened along an old hard filler line, the filler chipped at the edges.") }),
  C(46, "mire el video de la pared que se infla", "ClVideoRef", { thumb: I + "th_alhumedad.jpg", title: "La pared que se infla" }),
  S(47, "", "bi", "b_yearcheck", { p: BI(`Close view of ${H} checking a small white plaster pill on a wall with a fingertip, a calendar on the wall nearby.`) }),
  S(47, "canaletas, desagües y la acera pegada a la casa", "bi", "st_gutter", { q: "house gutter downspout", p: BI("A house gutter and downspout on an old house wall.") }),
  S(48, "", "av", ""),
  C(48, "si una puerta o ventana empezó a trabarse", "ClCheck", { title: "Llame sin esperar si…", items: ["Diagonal, más ancha arriba", "Puerta o ventana trabada", "Sigue por el piso", "Crece semana a semana"], fast: true }),
];
