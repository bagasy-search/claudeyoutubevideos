// fbterrazo · tiempos (clavados a la frase de la voz) y poses de la cámara del mundo del taller.
import { at, fin, AVWIN } from "./at";
// fin de la ventana del avatar que contiene t (o t si no hay)
const avEnd = (t: number) => (AVWIN.find(([a, b]) => t >= a - 0.01 && t < b) ?? [t, t])[1];

type V = [number, number, number];
export const EV = {
  liso: at("liso como un vidrio"),
  banco: at("parece el piso de un banco"),
  fortuna: at("hoy cuestan una fortuna"),
  peroNo: at("pero no es cemento"),
  blanco: at("cemento blanco del corralon"),
  piedras: at("y las piedras que brillan"),
  botellas: at("son las botellas"),
  fondo: at("en el fondo del patio"),
  vidrio: at("vidrio molido"),
  casa: at("ahora pensa en tu casa"),
  quincho: at("en el quincho"),
  gris: at("quedo gris"),
  anos: at("a los dos anos"),
  aceite: at("manchado de aceite"),
  sillas: at("las marcas de las sillas"),
  polvillo: at("con un polvillo blanco"),
  fisuras: at("con esas fisuras finitas"),
  mapa: at("parecen un mapa"),
  cuanto: at("cuanto sale poner un piso lindo"),
  numero: at("te dijeron un numero"),
  culpa: at("no fue culpa tuya"),
  barato: at("es el piso mas barato"),
  terminado: at("no esta terminado"),
  piedra: at("piedra dentro y pulido"),
  hoy: at("hoy te muestro"),
  baldosas: at("baldosas de terrazo"),
  edificio: at("un edificio de los anos 40"),
  dolares: at("por unos 4 dolares"),
  paso: at("paso por paso"),
  errores: at("con los cinco errores"),
  gota: at("la prueba de la gota de aceite"),
  primer: at("el primer error"),
  conBotellas: at("con las botellas", at("el primer error")),
  claudio: at("soy claudio"),
  radio: at("radio prendida"),
  basura: at("una botella vacia no es basura"),
  rapido: at("rapido antes de arrancar"),
  todo: at("todo lo que fui aprendiendo"),
  coleccion: at("la coleccion del constructor libre"),
  link: at("el link esta en la primera"),
  medidas: at("y las medidas exactas"),
  volvemos: at("volvemos al patio"),
  c1open: 0, c1page: 0, fin1: 0, mundo1: 0, ghostOff: 0, quinchoIn: 0, polish: 0, gotaClip: 0, errWorld: 0,
};
EV.mundo1 = EV.banco + 0.3;                    // sale del gancho (toma real) al mundo: la baldosa pulida
EV.ghostOff = EV.vidrio + 2.2;                 // la baldosa deja de ser "de vidrio" (corte) y vuelve opaca
EV.quinchoIn = avEnd(EV.casa);                 // sale del avatar "pensá en tu casa" → el quincho
EV.polish = avEnd(EV.piedra) + 0.3;            // la ola de pulido arranca apenas sale el avatar ("hoy te muestro…")
EV.gotaClip = EV.gota - 0.3; EV.errWorld = EV.primer - 0.3;
EV.c1open = EV.todo + 0.8;
EV.c1page = EV.coleccion + 1.6;
EV.fin1 = fin("volvemos al patio") + 0.6;

const TY = 0.66, TZ = 0.3;
export const KEYS: { t: number; p: V; l: V; fov?: number; arc?: number }[] = [
  // (sale del gancho): rasante sobre la baldosa pulida, "liso como un vidrio… de mármol granítico… una fortuna"
  { t: 0, p: [-0.55, 0.74, 0.78], l: [0.05, TY, TZ], fov: 32 },
  { t: EV.mundo1, p: [-0.55, 0.74, 0.78], l: [0.05, TY, TZ], fov: 32 },
  { t: EV.fortuna + 1.5, p: [0.42, 0.72, 0.76], l: [0.0, TY, 0.25], fov: 30 },
  // (sale del avatar "es cemento blanco"): la baldosa se vuelve de vidrio: las gemas flotan adentro
  { t: EV.piedras - 0.6, p: [-0.95, 1.28, 1.3], l: [0, 0.7, TZ], fov: 36 },
  { t: EV.botellas - 0.3, p: [0.85, 1.22, 1.25], l: [0, 0.7, TZ], fov: 36, arc: 0.05 },
  // "son las botellas de cerveza y de vino": latigazo al cajón, una botella estalla
  { t: EV.botellas + 0.5, p: [-0.95, 0.78, -0.45], l: [-1.45, 0.28, -1.4], fov: 36 },
  { t: EV.vidrio - 0.7, p: [-1.0, 0.72, -0.55], l: [-1.45, 0.22, -1.35], fov: 32 },
  // "vidrio molido": vuelve a la baldosa, de cerca
  { t: EV.vidrio + 0.4, p: [0.25, 0.98, 0.88], l: [0, TY, TZ], fov: 34, arc: 0.06 },
  { t: EV.casa, p: [0.15, 0.92, 0.82], l: [0, TY, TZ], fov: 32 },
  // (sale del avatar "pensá en tu casa"): el quincho con su alisado gris que envejece
  { t: EV.quinchoIn, p: [1.7, 1.9, 3.3], l: [3.4, 0.05, 0.9], fov: 44 },
  { t: EV.aceite, p: [2.35, 1.25, 2.45], l: [3.35, 0.03, 0.8], fov: 40 },
  { t: EV.fisuras, p: [2.9, 0.85, 1.95], l: [3.5, 0.03, 0.75], fov: 36 },
  { t: EV.cuanto, p: [2.95, 0.8, 1.9], l: [3.5, 0.03, 0.75], fov: 34 },
  // "no fue culpa tuya… no está terminado": vuelve a la baldosa
  { t: avEnd(EV.cuanto) + 0.4, p: [1.6, 1.75, 3.1], l: [3.4, 0.1, 0.8], fov: 44 },
  { t: EV.terminado - 0.2, p: [1.9, 1.6, 2.9], l: [3.4, 0.1, 0.8], fov: 44 },
  { t: EV.terminado + 0.8, p: [-0.7, 1.02, 1.12], l: [0, TY, TZ], fov: 34 },
  { t: EV.piedra, p: [-0.6, 0.98, 1.05], l: [0, TY, TZ], fov: 34 },
  // "hoy te muestro… baldosas de terrazo": la ola de pulido barre la baldosa gris
  { t: EV.polish, p: [-0.48, 0.9, 0.98], l: [0.05, TY, TZ], fov: 32 },
  { t: EV.dolares + 1.2, p: [0.5, 0.86, 0.96], l: [0, TY, TZ], fov: 32 },
  { t: EV.gotaClip, p: [0.42, 0.8, 0.8], l: [0, TY, TZ], fov: 28 },
  // "el primer error… con las botellas": el cajón
  { t: EV.errWorld, p: [-0.95, 0.82, -0.45], l: [-1.45, 0.3, -1.4], fov: 34 },
  { t: EV.claudio, p: [-1.05, 0.75, -0.6], l: [-1.45, 0.25, -1.4], fov: 30 },
  // (sale del avatar "soy Claudio"): dron sobre el taller
  { t: EV.claudio + 2.0, p: [-2.3, 2.5, 3.3], l: [0.2, 0.6, -1.2], fov: 46 },
  { t: EV.radio - 0.8, p: [2.2, 2.1, 2.6], l: [0.8, 0.7, -1.6], fov: 44 },
  // "la radio prendida y el mate frío arriba del banco"
  { t: EV.radio + 0.6, p: [1.55, 1.35, -1.55], l: [1.9, 1.0, -2.55], fov: 38 },
  // "una botella vacía no es basura": la botella verde en el banco, contra el sol
  { t: EV.basura, p: [1.95, 1.22, -1.9], l: [2.3, 1.08, -2.5], fov: 32 },
  { t: EV.basura + 4, p: [2.05, 1.15, -2.05], l: [2.3, 1.08, -2.5], fov: 28 },
  // CTA1: la Colección en el banco → se abre → pág. 53
  { t: EV.todo, p: [1.75, 1.6, -1.6], l: [1.5, 0.94, -2.42], fov: 38 },
  { t: EV.c1open + 1.2, p: [1.52, 1.62, -2.0], l: [1.5, 0.94, -2.42], fov: 36 },
  { t: EV.c1page + 0.9, p: [1.5, 1.42, -2.3], l: [1.5, 0.94, -2.43], fov: 38 },
  { t: EV.medidas + 3, p: [1.5, 1.38, -2.32], l: [1.5, 0.94, -2.43], fov: 38 },
  // "Volvemos al patio": sube y mira la baldosa
  { t: EV.volvemos - 0.3, p: [1.2, 1.5, -0.6], l: [0, TY, TZ], fov: 40 },
  { t: EV.fin1 + 1, p: [-0.6, 1.2, 1.3], l: [0, TY, TZ], fov: 38 },
];

// ---------- el resto del video (2:22 → final): el mundo vuelve entre tomas, cada visita con su par de poses ----------
// ax: frase con red (si el ASR la partió distinto, queda el segundo aproximado); we/ws: fin/inicio de la ventana del avatar más cercana
export const MISS: string[] = [];
export const ax = (f: string, d: number) => { try { const x = at(f, d - 5); if (Math.abs(x - d) < 12) return x; MISS.push(`${f} @${d} (lejos: ${x.toFixed(1)})`); return d; } catch { MISS.push(`${f} @${d}`); return d; } };
const near = (x: number) => AVWIN.reduce((b, w) => (Math.min(Math.abs(w[0] - x), Math.abs(w[1] - x)) < Math.min(Math.abs(b[0] - x), Math.abs(b[1] - x)) ? w : b));
export const we = (x: number) => near(x)[1], ws = (x: number) => near(x)[0];
export const RW = {
  crate: we(185.7), tileA: we(330.7), bags: ax("paso 2", 354.1), tileB: we(427.7), tileC: ax("es normal", 617.4), tileD: ax("despues del empastado", 648),
  bench: ax("vamos a los numeros", 733), tileE: we(743.9), quincho: we(774.9), tileF: we(792.1), book: ax("en la coleccion en la pagina", 847.1),
  recap: ax("te repaso los 5 errores", 883.8), book2: ax("todas las medidas", 915.2),
};
const L = [0, TY, TZ] as V, BK = [1.5, 0.94, -2.42] as V, QL = [3.45, 0.04, 0.82] as V;
KEYS.push(
  { t: EV.fin1 + 4, p: [-0.25, 1.0, 1.05], l: L, fov: 34 },
  { t: RW.crate, p: [-0.55, 0.95, -0.15], l: [-1.45, 0.3, -1.4], fov: 38 }, { t: RW.crate + 9.5, p: [-0.95, 0.72, -0.6], l: [-1.45, 0.25, -1.4], fov: 32 },
  { t: RW.tileA, p: [0.38, 0.84, 0.74], l: L, fov: 26 }, { t: ws(344) + 0.5, p: [-0.32, 0.82, 0.72], l: L, fov: 24 },
  { t: RW.bags, p: [-1.15, 0.95, -1.25], l: [-2.2, 0.2, -2.6], fov: 38 }, { t: RW.bags + 6, p: [-0.7, 0.9, -1.0], l: [-1.75, 0.2, -2.4], fov: 36 },
  { t: RW.tileB, p: [0.62, 1.02, 1.0], l: L, fov: 32 }, { t: RW.tileB + 12.5, p: [-0.52, 0.96, 0.96], l: L, fov: 30 },
  { t: RW.tileC, p: [0.16, 0.8, 0.56], l: L, fov: 24 }, { t: RW.tileC + 3.5, p: [-0.12, 0.8, 0.56], l: L, fov: 22 },
  { t: RW.tileD, p: [0.82, 0.76, 0.62], l: L, fov: 30 }, { t: RW.tileD + 8.5, p: [0.48, 0.8, 0.98], l: L, fov: 30 },
  { t: RW.bench, p: [1.15, 1.55, -1.15], l: [1.9, 0.92, -2.45], fov: 42 }, { t: ws(740.5) + 0.5, p: [1.6, 1.42, -1.5], l: [1.8, 0.92, -2.45], fov: 38 },
  { t: RW.tileE, p: [-0.55, 1.12, 1.2], l: L, fov: 36 }, { t: RW.tileE + 10.5, p: [0.42, 1.04, 1.12], l: L, fov: 34 },
  { t: RW.quincho, p: [2.1, 1.6, 2.8], l: QL, fov: 42 }, { t: RW.quincho + 6.5, p: [2.75, 1.0, 2.2], l: QL, fov: 36 },
  { t: RW.tileF, p: [-0.72, 1.3, 1.5], l: L, fov: 40 }, { t: RW.tileF + 12, p: [0.3, 0.9, 0.9], l: L, fov: 32 },
  { t: RW.book, p: [1.56, 1.62, -1.95], l: BK, fov: 36 }, { t: RW.book + 7.5, p: [1.5, 1.42, -2.3], l: BK, fov: 36 },
  { t: RW.recap, p: [-1.0, 1.4, 1.6], l: L, fov: 40 }, { t: RW.book2 - 0.45, p: [1.0, 1.3, 1.6], l: L, fov: 40 },
  { t: RW.book2 + 0.05, p: [1.75, 1.6, -1.6], l: BK, fov: 38 }, { t: RW.book2 + 20, p: [1.5, 1.42, -2.3], l: BK, fov: 38 },
);
