// valniveamix · tiempos (clavados a la frase de la voz) y poses de la cámara del mundo:
// el TOCADOR de la doctora (la lata azul, el cuenco de vidrio, la cucharita, la sábila, el frasquito, el recetario),
// el CORTE DE PIEL gigante (epidermis, dermis con colágeno, grasa, gotitas de agua, la "tapa" de crema),
// el VASO de agua y aceite (la emulsión) y las CADENAS de azúcares de la sábila que atrapan agua.
import { at, AVWIN } from "./at";

type V = [number, number, number];
// ax: frase con red (si el ASR la partió distinto, queda el segundo aproximado)
export const MISS: string[] = [];
export const ax = (f: string, d: number) => { try { const x = at(f, d - 6); if (Math.abs(x - d) < 12) return x; MISS.push(`${f} @${d} (lejos: ${x.toFixed(1)})`); return d; } catch { MISS.push(`${f} @${d}`); return d; } };
const near = (x: number) => AVWIN.reduce((b, w) => (Math.min(Math.abs(w[0] - x), Math.abs(w[1] - x)) < Math.min(Math.abs(b[0] - x), Math.abs(b[1] - x)) ? w : b));
// we/ws: fin/inicio de la ventana del avatar más cercana
export const we = (x: number) => near(x)[1], ws = (x: number) => near(x)[0];

// ---------- anclas del mundo ----------
export const EV = {
  // el recetario en el tocador
  libro: ax("en un solo libro", 95.4), recetario: ax("el recetario de la doctora", 96.7), p43: ax("y en la 43", 102.1),
  truco85: ax("el truco de mi recetario", 635.3), r67: ax("las 67 recetas", 861.8),
  // la receta en el cuenco
  receta: ax("vamos a la receta", 403.2), cuchCrema: ax("necesita una cucharadita", 406.4), alRas: ax("al ras", 411.3), media: ax("media cucharadita", 411.6),
  cuenco: ax("y un cuenquito", 414.1), ponga: ax("ponga la crema en el cuenco", 418.1), agregue: ax("agregue el gel encima", 420.0), mezcle: ax("mezcle en circulos", 422.5),
  grumos: ax("la crema hace grumitos", 429.5), nata: ax("como una nata batida", 437.3), frasco: ax("guardela en un frasquito", 467.1),
  // el corte de piel
  pocaAgua: ax("es una piel con poca agua", 143.9), gruesa: ax("en una capa gruesa", 206.8),
  tapa: ax("funciona como una tapa", 271.1), escape: ax("no deja que el agua", 277.5),
  edad: ax("y que pasa a los 60", 279.7), grasa: ax("fabrica la misma cantidad de grasa", 283.5), esponjas: ax("como esponjitas de agua", 288.8),
  tierra: ax("como tierra seca", 294.3), entra: ax("el agua entra y se va", 295.8), ponia: ax("se ponia una capa gruesa", 300.0), sinAgua: ax("no tenia agua para guardar", 304.7),
  dos: ax("necesita dos cosas", 317.5), aguaEntre: ax("agua que entre", 319.8), tapaSalir: ax("y una tapa que no la deje salir", 321.3), aguaTapa: ax("agua y tapa", 323.6),
  gelSolo: ax("el gel solo", 374.5), evapora: ax("se evapora en un rato", 377.1), cremaSola: ax("la crema sola", 379.9), juntas: ax("pero juntas", 383.6), pone: ax("el gel pone el agua", 384.8), laTapa: ax("y la crema la tapa", 385.7),
  minuto: ax("y en ese minuto", 522.3), seEvapore: ax("antes de que el agua se evapore", 523.8), sePone: ax("se pone la mezcla", 525.6),
  tierra2: ax("la tapa sobre la tierra seca", 545.3), suavizan: ax("se suavizan", 786.9),
  // el vaso: agua y aceite
  separaran: ax("sin que se separaran", 225.2), dentro: ax("por dentro tiene un poquito de agua", 251.3), fuera: ax("pero por fuera", 255.7),
  aguaAceite: ax("llamamos agua en aceite", 264.0), gotitas: ax("escondida dentro de gotitas", 266.3), manda: ax("es la que manda", 268.9),
  // la sábila: cadenas de azúcares
  cadenas: ax("en unas cadenas de azucares", 355.0), retienen: ax("la retienen y la sueltan", 357.1),
};

// ---------- puntos del mundo ----------
export const CY = 0.85;                                   // tapa de la mesada del tocador
export const SK: V = [10, 0, 0];                          // el corte de piel
export const PTS = {
  tin: [-0.14, CY, 0.05] as V, bowl: [0.15, CY, 0.08] as V, aloe: [0.6, CY, -0.12] as V, jar: [0.38, CY, -0.06] as V,
  book: [-0.62, CY, 0.02] as V, towel: [0.86, CY, 0.12] as V, mirror: [-0.15, 1.42, -0.3] as V,
  skinTop: [SK[0], 0.95, 0.15] as V, epi: [SK[0] - 0.55, 0.9, 0.41] as V, derm: [SK[0] - 0.3, 0.62, 0.41] as V, fat: [SK[0] + 0.45, 0.24, 0.41] as V, tapa: [SK[0] + 0.2, 1.0, 0.3] as V,
  vaso: [13, 0.95, -0.2] as V, cadenas: [7.2, 1.0, -0.2] as V,
};

// poses de cámara por estación (p, l, fov)
type Pose = { p: V; l: V; fov?: number; arc?: number };
const T = PTS.tin, B = PTS.bowl, K = PTS.book, A = PTS.aloe, J = PTS.jar;
export const POSE: Record<string, Pose> = {
  wide: { p: [0.05, 1.32, 1.3], l: [0.05, 0.98, -0.05], fov: 40 }, wide2: { p: [-0.35, 1.22, 1.05], l: [0.1, 0.95, -0.05], fov: 38 },
  tin: { p: [-0.12, 1.06, 0.36], l: T, fov: 34 }, tin2: { p: [-0.05, 0.98, 0.26], l: [T[0], CY + 0.02, T[2]], fov: 30 }, tinTop: { p: [-0.14, 1.12, 0.17], l: [T[0], CY + 0.03, T[2]], fov: 36 },
  bowl: { p: [0.17, 1.08, 0.36], l: B, fov: 30 }, bowl2: { p: [0.1, 0.99, 0.24], l: [B[0], CY + 0.02, B[2]], fov: 28 }, bowlTop: { p: [0.15, 1.12, 0.2], l: [B[0], CY + 0.01, B[2]], fov: 32 },
  pair: { p: [0.0, 1.05, 0.42], l: [0.0, CY + 0.02, 0.06], fov: 34 }, pair2: { p: [0.02, 0.98, 0.33], l: [0.0, CY + 0.02, 0.06], fov: 32 },
  aloe: { p: [0.42, 1.08, 0.38], l: [A[0], CY + 0.12, A[2]], fov: 36 }, aloe2: { p: [0.5, 1.0, 0.28], l: [A[0], CY + 0.1, A[2]], fov: 32 },
  jar: { p: [0.3, 1.0, 0.24], l: J, fov: 30 },
  book: { p: [-0.58, 1.42, 0.42], l: K, fov: 36 }, bookTop: { p: [-0.62, 1.38, 0.1], l: [K[0], CY + 0.04, K[2] - 0.02], fov: 38 }, bookPg: { p: [-0.55, 1.28, 0.1], l: [K[0] + 0.06, CY + 0.04, K[2] - 0.02], fov: 34 },
  // corte de piel
  sk: { p: [SK[0] + 0.15, 1.15, 2.45], l: [SK[0], 0.55, 0.2], fov: 36 }, sk2: { p: [SK[0] - 0.55, 1.0, 2.0], l: [SK[0], 0.6, 0.2], fov: 36 },
  skTop: { p: [SK[0] + 0.3, 1.35, 1.25], l: [SK[0], 0.92, 0.2], fov: 34 }, skTop2: { p: [SK[0] - 0.2, 1.22, 1.0], l: [SK[0] - 0.1, 0.92, 0.25], fov: 32 },
  skDerm: { p: [SK[0] - 0.4, 0.66, 1.35], l: [SK[0] - 0.35, 0.6, 0.4], fov: 32 }, skFat: { p: [SK[0] + 0.5, 0.35, 1.3], l: [SK[0] + 0.45, 0.3, 0.4], fov: 32 },
  // el vaso y las cadenas
  vaso: { p: [13.05, 1.12, 0.75], l: PTS.vaso, fov: 32 }, vaso2: { p: [13.0, 1.0, 0.42], l: [13, 0.95, -0.2], fov: 24 }, vasoIn: { p: [13.0, 0.97, 0.06], l: [13, 0.95, -0.2], fov: 30 },
  cad: { p: [7.3, 1.12, 0.85], l: PTS.cadenas, fov: 34 }, cad2: { p: [7.05, 0.95, 0.5], l: [7.2, 0.85, -0.2], fov: 30 },
};

// cada visita del mundo: [segundo en que entra, segundo en que se va, pose A → pose B]
export type Visit = { a: number; b: number; A: string; B: string };
export const KEYS: { t: number; p: V; l: V; fov?: number; arc?: number }[] = [];
export const visits = (vs: Visit[]) => {
  KEYS.length = 0;
  let prev = -1e9;
  for (const v of [...vs].sort((x, y) => x.a - y.a)) {
    const a = POSE[v.A], b = POSE[v.B];
    // mundo → mundo sin toma en el medio: la cámara vuela de una pose a la otra en 0,8 s (nunca un salto seco)
    const a0 = Math.abs(v.a - prev) < 0.05 ? Math.min(v.a + 0.8, (v.a + v.b) / 2) : v.a;
    KEYS.push({ t: a0, ...a }, { t: v.b, ...b, arc: b.arc });
    prev = v.b;
  }
};
