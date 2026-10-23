// fbcafe · tiempos (clavados a la frase de la voz) y poses de la cámara del mundo del taller.
import { at, fin, AVWIN } from "./at";
// fin de la ventana del avatar que contiene t (o t si no hay)
const avEnd = (t: number) => (AVWIN.find(([a, b]) => t >= a - 0.01 && t < b) ?? [t, t])[1];

type V = [number, number, number];
export const EV = {
  toc: at("escuchaste"),
  levanta: at("levantala"),
  noMadera: at("porque no es madera"),
  cemento: at("es cemento"),
  bolsa: at("el de la bolsa"),
  veta: at("y esa veta"),
  muelle: at("de tabla de muelle"),
  alacena: at("en la alacena"),
  cafe: at("cafe el mismo cafe"),
  patio: at("ahora pensa en tu patio"),
  pusiste: at("pusiste unas tablas"),
  pagaste: at("pagaste lo que pagaste"),
  inviernos: at("a los dos inviernos"),
  hongo: at("con hongo negro"),
  astillas: at("con esas astillas"),
  lijar: at("hay que lijarla"),
  culpa: at("no fue culpa tuya"),
  moja: at("se moja"),
  pudre: at("y se pudre"),
  hoy: at("hoy te muestro"),
  parecen: at("que parecen madera de verdad"),
  dolares: at("por unos 2 dolares"),
  errores: at("con los cinco errores"),
  prueba: at("la prueba de la manguera"),
  primer: at("el primer error"),
  claudio: at("soy claudio"),
  viejo: at("como las hacia mi viejo"),
  radio: at("con la radio prendida"),
  pan: at("como la masa del pan"),
  c1: at("rapido antes de arrancar"),
  todo: at("todo lo que fui aprendiendo"),
  coleccion: at("la coleccion del constructor libre"),
  link: at("el link esta en la primera"),
  medidas: at("y las medidas exactas"),
  volvemos: at("volvemos al patio"),
  c1open: 0, c1page: 0, fin1: 0, wipe: 0, deckClip: 0, desmolde: 0, manguera: 0,
};
EV.wipe = avEnd(EV.noMadera) + 0.25;   // la piel de madera se barre apenas sale el avatar ("…es cemento")
EV.deckClip = avEnd(EV.astillas); EV.desmolde = avEnd(EV.pudre); EV.manguera = avEnd(EV.errores);
EV.c1open = EV.todo + 0.8;
EV.c1page = EV.coleccion + 1.6;
EV.fin1 = fin("volvemos al patio") + 0.6;

const PLY = 0.62, PLZ = 0.3;
export const KEYS: { t: number; p: V; l: V; fov?: number; arc?: number }[] = [
  // (sale del avatar "…es cemento"): la tabla de 3/4, la piel de madera se barre → cemento
  { t: 0, p: [-0.42, 0.86, 0.85], l: [0.05, PLY, PLZ], fov: 34 },
  { t: EV.wipe, p: [-0.42, 0.86, 0.85], l: [0.05, PLY, PLZ], fov: 34 },
  { t: EV.wipe + 0.9, p: [0.98, 0.72, 0.6], l: [0.6, 0.6, PLZ], fov: 30, arc: 0.04 },
  // "la bolsa que tenés tirada en el fondo del patio": latigazo a la bolsa
  { t: EV.wipe + 1.6, p: [0.98, 0.72, 0.6], l: [0.6, 0.6, PLZ], fov: 30 },
  { t: EV.wipe + 2.2, p: [-0.55, 0.95, -0.25], l: [-1.45, 0.16, -1.5], fov: 36 },
  { t: EV.veta - 0.3, p: [-0.62, 0.9, -0.35], l: [-1.45, 0.16, -1.5], fov: 34 },
  // "Y esa veta, esos nudos": baja a la superficie, la veta es un paisaje
  { t: EV.veta + 0.7, p: [-0.05, 0.72, 0.45], l: [-0.18, PLY, PLZ], fov: 34, arc: 0.1 },
  { t: EV.muelle, p: [-0.42, 0.634, 0.36], l: [-0.15, 0.623, 0.31], fov: 42 },
  { t: EV.alacena - 0.6, p: [0.1, 0.634, 0.35], l: [0.38, 0.623, 0.3], fov: 42 },
  // "algo que tenés en la alacena de la cocina": el frasco de café en el banco
  { t: EV.alacena + 0.4, p: [2.05, 1.22, -1.75], l: [2.25, 1.02, -2.5], fov: 32, arc: 0.15 },
  { t: EV.cafe, p: [2.12, 1.15, -1.95], l: [2.25, 1.02, -2.5], fov: 28 },
  // (sale del avatar "ahora pensá en tu patio"): el deck junto a la pileta, nuevo
  { t: EV.pusiste - 0.4, p: [2.0, 1.35, 2.7], l: [3.55, 0.1, 0.9], fov: 42 },
  { t: EV.inviernos, p: [2.2, 1.15, 2.4], l: [3.5, 0.1, 0.9], fov: 40 },
  { t: EV.hongo, p: [2.6, 0.45, 1.75], l: [3.3, 0.12, 0.95], fov: 36 },
  // "se moja, no se seca nunca": a la punta, el agua que sube
  { t: EV.culpa - 3.0, p: [2.6, 0.45, 1.75], l: [3.3, 0.12, 0.95], fov: 36 },
  { t: EV.culpa, p: [2.45, 0.3, 1.3], l: [2.9, 0.1, 1.2], fov: 32 },
  { t: EV.hoy, p: [2.5, 0.34, 1.4], l: [2.9, 0.1, 1.2], fov: 32 },
  // "por unos 2 dólares": la tabla terminada, de 3/4
  { t: EV.dolares - 1.0, p: [-0.75, 1.05, 1.15], l: [0, PLY, PLZ], fov: 38 },
  { t: EV.dolares + 1.5, p: [-0.6, 0.95, 1.0], l: [0, PLY, PLZ], fov: 36 },
  // "el primer error… es justamente con el café": el frasco
  { t: EV.primer - 0.3, p: [2.05, 1.22, -1.75], l: [2.25, 1.02, -2.5], fov: 32 },
  { t: EV.primer + 4.5, p: [2.15, 1.12, -2.0], l: [2.25, 1.02, -2.5], fov: 26 },
  // (sale del avatar "soy Claudio"): dron sobre el taller
  { t: EV.claudio + 2.0, p: [-2.3, 2.5, 3.3], l: [0.2, 0.6, -1.2], fov: 46 },
  { t: EV.radio - 0.8, p: [2.2, 2.1, 2.6], l: [0.8, 0.7, -1.6], fov: 44 },
  // "la radio prendida y el mate frío arriba del banco"
  { t: EV.radio + 0.6, p: [1.55, 1.35, -1.55], l: [1.9, 1.0, -2.55], fov: 38 },
  { t: EV.pan + 2, p: [1.75, 1.3, -1.7], l: [2.0, 1.0, -2.6], fov: 36 },
  // CTA1: la Colección en el banco → se abre → pág. 17
  { t: EV.todo, p: [1.75, 1.6, -1.6], l: [1.5, 0.94, -2.42], fov: 38 },
  { t: EV.c1open + 1.2, p: [1.52, 1.62, -2.0], l: [1.5, 0.94, -2.42], fov: 36 },
  { t: EV.c1page + 0.9, p: [1.5, 1.42, -2.3], l: [1.5, 0.94, -2.43], fov: 38 },
  { t: EV.medidas + 3, p: [1.5, 1.38, -2.32], l: [1.5, 0.94, -2.43], fov: 38 },
  // "Volvemos al patio": sube y mira la tabla
  { t: EV.volvemos - 0.3, p: [1.2, 1.5, -0.6], l: [0, 0.6, 0.3], fov: 40 },
  { t: EV.fin1 + 1, p: [-0.6, 1.2, 1.3], l: [0, 0.6, 0.3], fov: 38 },
];

// ---------- el resto del video (2:25 → final): el mundo vuelve entre tomas, cada visita con su par de poses ----------
// ax: frase con red (si el ASR la partió distinto, queda el segundo aproximado); we/ws: fin/inicio de la ventana del avatar más cercana
export const MISS: string[] = [];
export const ax = (f: string, d: number) => { try { const x = at(f, d - 5); if (Math.abs(x - d) < 12) return x; MISS.push(`${f} @${d} (lejos: ${x.toFixed(1)})`); return d; } catch { MISS.push(`${f} @${d}`); return d; } };
const near = (x: number) => AVWIN.reduce((b, w) => (Math.min(Math.abs(w[0] - x), Math.abs(w[1] - x)) < Math.min(Math.abs(b[0] - x), Math.abs(b[1] - x)) ? w : b));
export const we = (x: number) => near(x)[1], ws = (x: number) => near(x)[0];
export const RW = {
  plank0: ax("nosotros vamos a hacer lo mismo", 190.4), p1: ax("paso 1", 227.7), copia: ax("el cemento copia todo", 256.9), copia2: we(282.1),
  bags: ax("paso 2", 302.5), cafe: we(334.2), p4a: ax("la parte de arriba va a ser", 424.8), desm: ax("a los dos o tres dias desmoldas", 510.7),
  p6: ax("paso 6", 529.1), cafe2: ax("y ahora lo mas importante del video", 558.7), grain3: ax("y la tercera mano", 610.4), grain4: ax("eso es exactamente lo que el ojo", 631.5),
  p8: we(678.2), bench: ax("vamos a los numeros", 713.4), deck: we(744.3), book: we(762.2), verdad: ax("ahora la verdad", 791.2),
  recap: ax("te repaso los cinco errores", 853.7), recap2: we(865.5), recap3: we(881.1), book2: ax("todas las medidas", 888.5), tarea: ax("la tarea para esta semana", 907.9), end: ax("cuando la desmoldes", 919.2),
};
const PK = [0, 0.62, 0.3] as V, KN = [-0.18, 0.62, 0.32] as V, BK = [1.5, 0.94, -2.42] as V, CF = [2.25, 1.02, -2.5] as V, DK = [3.3, 0.12, 0.95] as V, BG = [-1.45, 0.16, -1.5] as V;
KEYS.push(
  { t: EV.fin1 + 4, p: [-0.45, 1.0, 1.05], l: PK, fov: 36 },
  { t: RW.plank0, p: [-0.75, 1.05, 1.15], l: PK, fov: 38 }, { t: RW.plank0 + 4.5, p: [-0.55, 0.95, 1.0], l: PK, fov: 35 },
  { t: RW.p1, p: [-0.42, 0.634, 0.36], l: [-0.15, 0.623, 0.31], fov: 42 }, { t: RW.p1 + 2.2, p: [-0.25, 0.634, 0.36], l: [0.02, 0.623, 0.31], fov: 42 },
  { t: RW.copia, p: [0.42, 0.68, 0.46], l: [0.1, 0.62, 0.3], fov: 34 }, { t: RW.copia + 6, p: [0.18, 0.66, 0.42], l: [-0.1, 0.62, 0.3], fov: 32 },
  { t: RW.copia2, p: [0.05, 1.1, 0.6], l: PK, fov: 40 }, { t: RW.copia2 + 8.8, p: [-0.3, 0.92, 0.62], l: PK, fov: 36 },
  { t: RW.bags, p: [-0.55, 0.95, -0.25], l: BG, fov: 36 }, { t: RW.bags + 4.4, p: [-0.75, 0.75, -0.6], l: BG, fov: 32 },
  { t: RW.cafe, p: [2.05, 1.22, -1.75], l: CF, fov: 32 }, { t: RW.cafe + 5, p: [2.12, 1.15, -1.95], l: CF, fov: 28 },
  { t: RW.p4a, p: [0.85, 1.0, 1.1], l: PK, fov: 38 }, { t: RW.p4a + 7.2, p: [0.5, 0.92, 0.95], l: PK, fov: 35 },
  { t: RW.desm, p: [0.9, 0.75, 0.62], l: [0.6, 0.6, 0.3], fov: 32 }, { t: RW.desm + 6.2, p: [0.98, 0.72, 0.6], l: [0.55, 0.6, 0.3], fov: 30 },
  { t: RW.p6, p: [-0.3, 1.3, 0.9], l: PK, fov: 40 }, { t: RW.p6 + 4.5, p: [0.2, 1.2, 0.8], l: PK, fov: 38 },
  { t: RW.cafe2, p: [2.15, 1.12, -2.0], l: CF, fov: 26 }, { t: RW.cafe2 + 7, p: [2.2, 1.08, -2.18], l: CF, fov: 22 },
  { t: RW.grain3, p: [0.1, 0.634, 0.35], l: [0.38, 0.623, 0.3], fov: 42 }, { t: RW.grain3 + 3, p: [0.28, 0.634, 0.35], l: [0.55, 0.623, 0.3], fov: 42 },
  { t: RW.grain4, p: [-0.32, 0.665, 0.46], l: KN, fov: 34 }, { t: RW.grain4 + 5.8, p: [-0.06, 0.66, 0.45], l: KN, fov: 32 },
  { t: RW.p8, p: [-0.9, 0.9, 0.72], l: PK, fov: 38 }, { t: RW.p8 + 9, p: [-0.6, 0.85, 0.92], l: PK, fov: 36 },
  { t: RW.bench, p: [1.15, 1.55, -1.15], l: [1.9, 0.92, -2.45], fov: 42 }, { t: RW.bench + 9, p: [1.6, 1.42, -1.5], l: [1.8, 0.92, -2.45], fov: 38 },
  { t: RW.deck, p: [2.0, 1.35, 2.7], l: [3.55, 0.1, 0.9], fov: 42 }, { t: RW.deck + 13, p: [2.6, 0.45, 1.75], l: DK, fov: 36 },
  { t: RW.book, p: [1.56, 1.62, -1.95], l: BK, fov: 36 }, { t: RW.book + 10, p: [1.5, 1.42, -2.3], l: BK, fov: 36 },
  { t: RW.verdad, p: [0.95, 0.9, 1.0], l: PK, fov: 36 }, { t: RW.verdad + 3, p: [0.75, 0.85, 0.9], l: PK, fov: 34 },
  { t: RW.recap, p: [-2.3, 2.5, 3.3], l: [0.2, 0.6, -1.2], fov: 46 }, { t: RW.recap + 10, p: [-1.2, 1.8, 2.4], l: PK, fov: 42 },
  { t: RW.recap2, p: [-0.42, 0.634, 0.36], l: [-0.15, 0.623, 0.31], fov: 42 }, { t: RW.recap2 + 11, p: [0.1, 0.634, 0.35], l: [0.38, 0.623, 0.3], fov: 42 },
  { t: RW.recap3, p: [1.55, 1.35, -1.55], l: [1.9, 1.0, -2.55], fov: 38 }, { t: RW.book2 - 0.45, p: [1.75, 1.3, -1.7], l: [2.0, 1.0, -2.6], fov: 36 },
  { t: RW.book2 + 0.05, p: [1.75, 1.6, -1.6], l: BK, fov: 38 }, { t: RW.book2 + 19, p: [1.5, 1.42, -2.3], l: BK, fov: 38 },
  { t: RW.tarea, p: [0.05, 1.1, 0.6], l: PK, fov: 40 }, { t: RW.tarea + 2.4, p: [-0.15, 1.0, 0.65], l: PK, fov: 38 },
  { t: RW.end, p: [-0.42, 0.634, 0.36], l: [-0.15, 0.623, 0.31], fov: 42 }, { t: RW.end + 7.6, p: [0.0, 0.64, 0.38], l: [0.25, 0.623, 0.3], fov: 40 },
);
