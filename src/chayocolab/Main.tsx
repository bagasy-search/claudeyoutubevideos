// chayocolab · El Secreto de mi Abuela para los Frijoles de Olla… y Claudio Me Confesó el de Su Fonda. UN mundo (la cocina de adobe,
// la olla de frijoles con su caldo oscuro, el comal donde se tatema la cebolla, el recetario de mamá Cuca, siete platos = siete secretos)
// y UNA cámara que lo recorre entre las ventanas del avatar. Dos personas: Chayo (reel0) y Claudio (reel1), cada ventana con su reel.
// Las fotos reales entran por portal o vapor; los planos se cortan sobre las pausas de la voz y cada pieza nace con su palabra (A("frase")).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PT2, PLATES, screenOf, camSpeed, setKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import WORDS from "./words.json";
import { BigNum, CH, Flash, HAND, P, Portal, Tag, at, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Aroma, Nota, Pensado, Palomita, Stamp, Precio, Pill } from "./comps";
import * as X from "./piezas";
import * as N from "./nuevos";

const REELS = (AVAIL as { reel: boolean[] }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number; reel: number };
const WIN: Win[] = (AVW as { win: Win[] }).win;
const inAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
export const END_T = 904.0; // voz 903,0 + 1 s de silencio
const A = (ph: string, after: number) => at(ph, after);

// ---------------- cámaras con nombre (las de chayo3) ----------------
type Cam = { p: V; l: V; fov?: number };
const CZ = PT.cazuela;
const C: Record<string, Cam> = {
  top: { p: [0, 3.6, 0.95], l: [0, 0.8, 0.12], fov: 40 }, topB: { p: [0.18, 3.95, 1.0], l: [0, 0.8, 0.12], fov: 40 }, topC: { p: [-0.15, 3.35, 0.9], l: [0, 0.8, 0.12], fov: 40 },
  wide: { p: [1.9, 1.95, 2.7], l: [-0.6, 0.8, -1.3], fov: 42 }, wide2: { p: [1.5, 1.9, 2.4], l: [-0.8, 0.8, -1.6], fov: 42 },
  fogon: { p: [-0.55, 1.4, -0.75], l: [-1.3, 0.95, -2.4], fov: 38 }, fogon2: { p: [-0.78, 1.3, -1.05], l: [-1.3, 0.8, -2.4], fov: 38 },
  comal: { p: [-0.55, 1.9, -0.7], l: [-1.3, 0.94, -2.5], fov: 32 }, comal2: { p: [-0.75, 1.75, -1.0], l: [-1.3, 0.94, -2.5], fov: 30 },
  comalT: { p: [-1.2, 2.6, -1.6], l: [-1.3, 0.94, -2.5], fov: 40 }, comalT2: { p: [-1.15, 2.45, -1.72], l: [-1.3, 0.94, -2.5], fov: 37 },
  pots: { p: [-0.2, 1.6, -1.2], l: [0.9, 1.95, -2.86], fov: 40 }, repisa: { p: [1.3, 1.55, -1.5], l: [1.6, 1.45, -2.82], fov: 38 }, repisa2: { p: [1.7, 1.5, -1.75], l: [1.6, 1.45, -2.82], fov: 36 },
  caz: { p: [0.85, 1.48, 1.2], l: CZ, fov: 36 }, caz2: { p: [0.55, 1.32, 0.6], l: CZ, fov: 33 }, cazL: { p: [-0.9, 1.45, 1.0], l: CZ, fov: 36 }, cazL2: { p: [-0.6, 1.35, 0.7], l: CZ, fov: 34 },
  cazT: { p: [0.32, 1.78, 0.6], l: [0, 0.92, -0.17], fov: 30 }, cazT2: { p: [0.24, 1.64, 0.46], l: [0, 0.92, -0.17], fov: 28 },
  libro: { p: [1.12, 1.42, 0.28], l: [0.88, 0.82, -0.3], fov: 34 }, libro2: { p: [1.0, 1.2, 0.02], l: [0.88, 0.82, -0.3], fov: 30 },
  remojo: { p: [1.05, 1.45, 0.15], l: PT2.remojo, fov: 34 }, remojo2: { p: [0.7, 1.18, -0.12], l: PT2.remojo, fov: 31 },
  limon: { p: [3.0, 1.5, 1.6], l: [5.4, 1.3, -1.6], fov: 50 }, limon2: { p: [3.6, 1.2, 0.9], l: [5.3, 0.9, -1.4], fov: 46 },
  salida: { p: [3.4, 2.9, 6.2], l: [0, 0.9, -0.6], fov: 44 },
};
PLATES.forEach((q, i) => { C["pl" + i] = { p: [q[0], 1.25, 0.95], l: [q[0], 0.82, 0.33], fov: 34 }; C["pl" + i + "b"] = { p: [q[0], 1.08, 0.7], l: [q[0], 0.82, 0.33], fov: 32 }; });

// ---------------- secciones del guion (inicio por la primera frase de cada una) ----------------
const SEC: [string, number][] = [
  ["HOOK1", 0], ["CLAUDIO", A("buenas dona chayo", 20)], ["HOOK3", A("ay claudio", 36)], ["DOLOR", A("pones tus frijoles", 56)], ["FONDA", A("y es lo primero que uno aprende", 74)],
  ["PROMISE", A("asi que esto es lo que", 86)], ["INTRO", A("para los que no me conocen", 109)], ["CTA", A("y antes de seguir", 131)], ["LIBRETA", A("y fijese que eso me gusto", 156)],
  ["STORY", A("mi abuela tenia una olla de barro", 168)], ["STORY2", 188.7], ["OLLA", A("si cuenta claudio", 215)],
  ["UNO", A("secreto numero 1", 248)], ["DOS", A("secreto numero 2", 324)], ["TRES", A("secreto numero tres", 382)], ["CTA2", A("y por cierto de una sola olla", 429)],
  ["CUATRO", A("secreto numero 4", 453)], ["CINCO", A("secreto numero 5", 499)], ["SEIS", A("secreto numero 6", 542)], ["SIETE", A("secreto numero 7", 586)],
  ["CONFIESA", A("y ahora si claudio", 629)], ["SOBRAS", A("ahora te damos unas cosas mas", 701)], ["PROBLEMAS", A("ahora lo que puede salir mal", 733)], ["DINERO", A("ahora hagamos la cuenta", 776)],
  ["RESUMEN", A("te lo doy todo junto", 811)], ["TAREA", A("no hagas todo", 850)], ["COMENTARIO", A("y cuentenos aqui abajo", 862)], ["CIERRE", A("yo los leo todos", 871)],
];
const secAt = (t: number) => { let k = SEC[0][0]; for (const [n, a] of SEC) if (t >= a - 0.05) k = n; return k; };
const SECRETO = SEC.filter(([n]) => ["UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE"].includes(n)).map(([, a]) => a);

// fotos (en orden de la voz) y recorridos de cámara de cada sección; el motor reparte las fotos parejo entre los planos de la sección
const PH: Record<string, string[]> = {
  HOOK1: ["h_olla", "h_llega"], CLAUDIO: ["h_prueba"], HOOK3: ["h_otro"], DOLOR: ["h_duros", "h_aguados"], FONDA: ["h_fonda_plato"], PROMISE: [],
  INTRO: ["i_fogon"], CTA: ["i_cta"], LIBRETA: ["i_libretas"], STORY: ["s_olla", "s_nina", "s_escoger"], STORY2: ["s_abuela", "s_platica"], OLLA: ["s_ollas"],
  UNO: ["u_nuevo", "u_viejo", "u_costales", "u_mercado", "u_negros"], DOS: ["d_remojo", "d_manana", "d_tirar", "d_contraria"],
  TRES: ["t_comal", "t_negro", "t_entero", "t_callado"], CTA2: ["t_siete"], CUATRO: ["c_fria", "c_tetera", "c_jarro", "c_fonda"],
  CINCO: ["f_jitomate", "f_dedos", "f_sal", "f_charros"], SEIS: ["m_manteca", "m_epazote", "m_carniceria"], SIETE: ["s7_tiembla", "s7_reventados", "s7_soplar"],
  CONFIESA: ["cl_confiesa", "cl_fonda", "cl_refri", "cl_hoja", "cl_hoja_olla", "cl_robar"], SOBRAS: ["x_sopa", "x_refritos", "x_molletes", "x_enfrijoladas"],
  PROBLEMAS: ["p_machacar", "p_refri"], DINERO: ["z_kilo", "z_familia"], RESUMEN: [], TAREA: [], COMENTARIO: [], CIERRE: ["z_mesa", "z_despedida"],
};
const WL: Record<string, [string, string][]> = {
  HOOK1: [["cazT", "cazT2"], ["caz", "caz2"]], CLAUDIO: [["wide", "wide2"]], HOOK3: [["cazL", "cazL2"]], DOLOR: [["caz2", "caz"], ["cazT", "cazT2"]], FONDA: [["top", "topB"]],
  PROMISE: [["top", "topB"], ["topB", "topC"], ["pl1", "pl1b"]], INTRO: [["wide", "fogon"], ["fogon", "fogon2"]], CTA: [["libro", "libro2"], ["libro2", "libro"]], LIBRETA: [["libro2", "libro"]],
  STORY: [["wide2", "pots"], ["caz", "cazL"]], STORY2: [["pots", "repisa"], ["repisa", "repisa2"]], OLLA: [["caz", "caz2"], ["cazL", "cazL2"]],
  UNO: [["libro2", "libro"], ["caz", "caz2"], ["cazT", "cazT2"]], DOS: [["remojo", "remojo2"], ["caz2", "caz"], ["remojo2", "remojo"]],
  TRES: [["comal", "comal2"], ["comalT", "comalT2"], ["comal2", "comalT"], ["caz", "caz2"]], CTA2: [["libro", "libro2"]], CUATRO: [["fogon", "fogon2"], ["cazT", "cazT2"], ["caz", "cazL"]],
  CINCO: [["cazT", "cazT2"], ["caz2", "caz"], ["cazL", "cazL2"]], SEIS: [["caz", "caz2"], ["cazT", "cazT2"], ["fogon2", "fogon"]], SIETE: [["fogon", "fogon2"], ["cazT2", "cazT"], ["caz", "caz2"]],
  CONFIESA: [["comal", "comal2"], ["caz", "cazL"], ["wide", "wide2"]], SOBRAS: [["top", "topB"], ["caz", "caz2"]], PROBLEMAS: [["cazT", "cazT2"], ["caz2", "caz"], ["wide", "wide2"]],
  DINERO: [["top", "topB"], ["topB", "topC"]], RESUMEN: [["top", "topB"], ["topB", "topC"], ["topC", "top"]], TAREA: [["comal", "comal2"], ["caz", "caz2"]], COMENTARIO: [["wide", "wide2"]],
  CIERRE: [["libro", "libro2"], ["caz", "salida"]],
};

// ---------------- el motor de planos: corta cada hueco entre ventanas del avatar sobre las pausas de la voz ----------------
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string; z?: [number, number] };
const WB: number[] = (() => { const w = WORDS as { startMs: number; endMs: number }[]; const o: number[] = []; for (let i = 0; i < w.length - 1; i++) o.push((w[i].endMs + w[i + 1].startMs) / 2000); return o; })();
const snap = (x: number, lo: number, hi: number) => { let best = x, d = 0.65; for (const b of WB) if (b > lo && b < hi && Math.abs(b - x) < d) { d = Math.abs(b - x); best = b; } return best; };
const LENS = [3.6, 4.4, 3.1, 4.9, 3.8, 2.9, 4.5, 4.1];
const PARTS: Part[] = (() => {
  const av = WIN.map((w) => [w.ms, w.me]).sort((a, b) => a[0] - b[0]);
  const gaps: [number, number][] = []; let cur = 0;
  for (const [a, b] of av) { if (a - cur > 0.3) gaps.push([cur, a]); cur = Math.max(cur, b); }
  if (END_T - cur > 0.3) gaps.push([cur, END_T]);
  const slots: [number, number][] = []; let li = 0;
  for (const [a, b] of gaps) {
    const L = b - a; let n = Math.max(1, Math.round(L / 3.9)); if (L / n < 2.3) n = Math.max(1, Math.floor(L / 2.3));
    let x = a;
    for (let k = 0; k < n; k++) {
      const left = b - x, want = k === n - 1 ? left : Math.min(left - 2.3 * (n - 1 - k), Math.max(2.4, LENS[li++ % LENS.length] * (L / n) / 3.9));
      const y = k === n - 1 ? b : snap(x + want, x + 2.3, b - 2.3 * (n - 1 - k));
      slots.push([x, y]); x = y;
    }
  }
  const bySec: Record<string, number[]> = {};
  slots.forEach(([a], i) => { const k = secAt(a + 0.05); (bySec[k] ||= []).push(i); });
  const out: Part[] = slots.map(([a, b]) => ({ a, b }));
  let zi = 0;
  for (const [k, idx] of Object.entries(bySec)) {
    const ph = [...(PH[k] || [])], wl = WL[k] || [["wide", "wide2"]], n = idx.length;
    const isPh = new Set<number>(); const np = Math.min(ph.length, Math.max(0, n - Math.ceil(n * 0.4)));
    for (let i = 0; i < np; i++) isPh.add(Math.min(n - 1, Math.floor(((i + 0.5) * n) / np)));
    let pi = 0, wi = 0;
    idx.forEach((si, j) => {
      if (isPh.has(j) && pi < ph.length) { out[si].c = ph[pi++]; out[si].z = zi++ % 2 ? [1.12, 1.03] : [1.03, 1.12]; }
      else { const [k0, k1] = wl[wi++ % wl.length]; out[si].k0 = k0; out[si].k1 = k1; }
    });
  }
  for (let i = 1; i < out.length; i++) if (!out[i].c && !out[i - 1].c && Math.abs(out[i].a - out[i - 1].b) < 1e-6) out[i].k0 = out[i - 1].k1;
  return out;
})();
export const PLAN = PARTS;
setKeys(PARTS.filter((p) => !p.c).flatMap((p) => { const k0 = C[p.k0!], k1 = C[p.k1!]; return [{ t: p.a + 0.001, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[]; }));
const partAt = (t: number) => PARTS.find((p) => t >= p.a && t < p.b);

// ---------------- recetario de mamá Cuca (una hoja por secreto) y la GUÍA ----------------
const RECETARIO = [
  { l: ["# Frijoles de Olla", "de mi mamá Cuca", "", "El frijol no se apura.", "", "— Refugio, 1962"], r: ["frijol nuevo, que brille", "remojo de la noche", "cebolla al comal", "agua caliente siempre", "la sal al final", "manteca y epazote", "fuego bajito"] },
  { l: ["# 1. El frijol", "bayo, flor de mayo", "o peruano", "", "el nuevo BRILLA", "el viejo, opaco"], r: ["cosecha de este año:", "2 horas", "", "compra poquito,", "lo de 2 o 3 semanas"] },
  { l: ["# 2. El remojo", "la noche antes", "agua fría, el doble", "8 horas", "", "esa agua SE TIRA"], r: ["a la olla", "con agua limpia", "", "¿se te olvidó?", "una hora más"] },
  { l: ["# 3. El comal", "½ cebolla blanca", "2 ajos con cáscara", "", "sin aceite, sin nada"], r: ["hasta que estén NEGRITOS", "diez minutos", "volteando con la palita", "", "ENTEROS a la olla", "no picados"] },
  { l: ["# 4. El agua", "3 litros de agua fría", "por cada kilo", "", "y después,", "NUNCA agua fría"], r: ["la tetera junto a la olla", "siempre calientita", "", "el frijol se asusta"] },
  { l: ["# 5. Al final", "la sal", "el jitomate", "el limón, el piloncillo", "", "1 cucharada de sal por kilo"], r: ["cuando el frijol", "se deshaga", "entre los dedos", "", "charros: ya cocido"] },
  { l: ["# 6. Grasita y hierba", "1 cucharada de manteca", "de la carnicería", "a la mitad", "", "epazote: últimos 15 min"], r: ["ni antes", "(se pone amargo)", "ni después", "", "huele a frijol de abuela"] },
  { l: ["# 7. El fuego", "que nomás TIEMBLE", "tapa medio abierta", "", "2 horas, 2 y media"], r: ["5 frijoles en la cuchara", "les soplas:", "si la cáscara se levanta", "ya están", "", "como mantequilla"] },
];
const GUIA = [
  { l: ["# Las 5 Ollas de", "# Doña Chayo", "", "Libro 2", "Las Mañanas del Rancho", "", "el desayuno de rancho", "con sus pesos"], r: ["Domingo y lunes", "", "frijoles de la olla .. 17", "café de olla ........ 23", "al congelador ....... 25"] },
  { l: ["# Frijoles de la Olla", "# con Tortillas", "pág. 17", "", "$6 el plato", "rinde 4 platos", "tarda 2½ horas"], r: ["los ajos y la cebolla", "van enteros", "", "si quedaron duros:", "sal al principio", "o agua fría de golpe"] },
  { l: ["# Libro 4", "# La Quincena Flaca", "", "Plan 2", "Una Olla de Frijol,", "Siete Comidas", "pág. 29"], r: ["2 kilos de frijol", "28 platos", "", "con queso ......... 35", "puercos", "sopa con nopales", "molletes"] },
];
const G1 = A("en un libro que se llama", 138), G1P = A("en el libro 2", 145), G2 = A("y por cierto de una sola olla", 429), G2P = A("en el libro 4", 440), G3 = A("esta en el libro 2", 878);
const isGuia = (t: number) => (t >= G1 - 1 && t < A("y fijese que eso me gusto", 156) + 1.5) || (t >= G2 - 1 && t < SECRETO[3] - 0.2) || t >= G3 - 1;
const SERVE = SECRETO.map((a, i) => (i < 6 ? SECRETO[i + 1] : A("y ahora si claudio", 629)) - 2.2);
const PROM = [A("que frijol comprar", 92), A("el remojo", 97), A("lo que pasa en el comal", 97), A("el agua", 100), A("lo que no se le echa hasta el final", 100), A("la grasita y la hierba", 100), A("y el fuego", 104)];
const RES = [A("frijol nuevo que brille", 814), A("remojo de la noche", 817), A("cebolla y ajo tatemados", 821), A("agua fria al principio", 825), A("la sal y lo acido", 830), A("una cucharada de manteca", 833), A("fuego bajito", 838)];
const T3 = SECRETO[2], T3end = G2;

const worldAt = (t: number): WorldProps => {
  const guia = isGuia(t);
  const plateServed = PLATES.map((_, i) => win(t, SERVE[i], SERVE[i] + 1.2));
  const plateOn = PLATES.map((_, i) => Math.max(
    win(t, PROM[i], PROM[i] + 0.3) * (1 - win(t, PROM[6] + 3, PROM[6] + 3.4)),
    win(t, SERVE[i] - 0.4, SERVE[i]) * (1 - win(t, SERVE[i] + 2, SERVE[i] + 3)),
    win(t, RES[i], RES[i] + 0.3) * (1 - win(t, RES[6] + 4, RES[6] + 4.4)),
  ));
  const k0 = partAt(t)?.k0 ?? "caz";
  const comalOn = A("al comal bien caliente", T3), negros = A("negritos por fuera", T3);
  const tatema = A("y tatema tu cebolla", 853);
  const verd = t >= T3 && t < T3end ? 0.5 * win(t, comalOn - 3, comalOn - 2.2) + 0.5 * win(t, negros, negros + 6) : t >= tatema && t < tatema + 8 ? 0.5 + 0.5 * win(t, tatema, tatema + 4) : 0;
  const tiemble = A("le bajas a que no mas tiemble", 592), fuerte = A("con hervor fuerte", 598);
  const fire = t >= SECRETO[6] && t < SERVE[6] ? 1 - 0.45 * win(t, tiemble, tiemble + 1.2) + 1.3 * win(t, fuerte, fuerte + 0.4) * (1 - win(t, fuerte + 4.5, fuerte + 5.5)) : 1;
  return {
    t, fire, ojitos: 0.4,
    steamCaz: /^cazT/.test(k0) ? 0.35 : /^(caz|pl)/.test(k0) ? 1 : /^top/.test(k0) ? 0.4 : 0.25,
    steamComal: /^comal/.test(k0) ? 0.18 : 1,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.16 * v),
    book: guia
      ? { open: ei(t, t < 300 ? G1 : t < 600 ? G2 : G3, (t < 300 ? G1 : t < 600 ? G2 : G3) + 1.2), flip: t < 300 ? ei(t, G1P, G1P + 0.9) : t < 600 ? 2 * ei(t, G2P, G2P + 0.9) : ei(t, G3 + 1, G3 + 1.9), pages: GUIA }
      : { open: 1, flip: SECRETO.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0), pages: RECETARIO },
    guia: guia ? 1 : 0,
    verduras: verd, remojo: t >= SECRETO[1] && t < SECRETO[2] ? 0.04 + 0.3 * win(t, A("se ve gordito", 340), A("se ve gordito", 340) + 3) : 0,
    top: k0.startsWith("top") ? 1 : 0,
  };
};

const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
// avatar: cada ventana con SU reel (0 = Chayo, 1 = Claudio); el reel que todavía no llegó se ve como foto fija
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const wn = WIN.find((w) => t >= w.ms && t < w.me);
  const face = WIN.map((w, i) => REELS[w.reel] ? (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: w === wn ? 1 : 0 }}><OffthreadVideo src={staticFile(P + `reel${w.reel}.mp4`)} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>) : null);
  const still = wn && !REELS[wn.reel] ? <Img src={staticFile(P + (wn.reel ? "av_still1.jpg" : "av_still.jpg"))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} /> : null;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}{still}</AbsoluteFill>;
};
const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number] }> = ({ k, t, a, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 6);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};

// ---------------- las piezas, cada una clavada a su palabra ----------------
const sc = (t: number, q: V) => screenOf(t, q);
const COMAL = PT2.comal as V, FIRE = PT.fire as V;
const Ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const add = (a: number, b: number, f: () => React.ReactNode) => { if (t >= a - 0.4 && t < b + 0.6) L.push(<React.Fragment key={"o" + a.toFixed(2) + "_" + L.length}>{f()}</React.Fragment>); };
  const card = (a: number, b: number, x: number, y: number, from: "left" | "right" | "up", main: string, sub?: string, c: string = CH.maiz) =>
    add(a, b, () => <X.Card t={t} at={a} out={b} x={x} y={y} from={from}><X.H s={56} c={c}>{main}</X.H>{sub && <X.H s={44} f={HAND}>{sub}</X.H>}</X.Card>);
  const addW = (a: number, b: number, f: () => React.ReactNode) => { if (!inAv(t)) add(a, b, f); }; // anclado al mundo 3D: no va encima del avatar
  const fondo = (a: number, b: number) => <X.Fondo o={0.45 * e(t, a, a + 0.4) * (1 - e(t, b - 0.4, b))} />;

  // ===== gancho =====
  { const a = A("mira nomas esta olla", 2); addW(a, a + 7, () => { const p = sc(t, CZ); return <Tag t={t} at={A("son frijoles de olla", a)} x={p.x} y={p.y} dx={330} dy={-220} text="CALDOSITOS, BRILLOSOS" sub="COMO LOS DE MI ABUELA" col={CH.maiz} out={a + 6.6} size={52} />; }); }
  { const a = A("con su olor a epazote", 7); addW(a, a + 3.5, () => <Aroma t={t} at={a} out={a + 3.2} x={sc(t, CZ).x} y={sc(t, CZ).y - 60} />); }
  { const a = A("ni la olla de presion", 11); add(a, a + 3.6, () => <><Pill t={t} at={A("el frijol caro", 10)} out={A("son siete cosas", 14) - 0.1} x={520} y={260} text="FRIJOL CARO" /><Pill t={t} at={a} out={A("son siete cosas", 14) - 0.1} x={520} y={420} text="OLLA DE PRESIÓN" /></>); }
  { const a = A("son siete cosas", 14); add(a, a + 4, () => <BigNum t={t} at={a} out={a + 3.6} text="7" size={330} x={1460} y={460} col={CH.maiz} edge="#5a2a10" sub="COSAS DE MI ABUELA" />); }
  { const a = A("tengo visita en mi cocina", 18); add(a, a + 3.6, () => <Palomita t={t} at={a} out={a + 3.4} y={240} text="HOY TENGO VISITA" />); }

  // ===== Claudio se presenta =====
  { const a = A("yo soy claudio", 23); add(a, a + 7, () => <LowerThird t={t} at={a} out={a + 6.6} name="CLAUDIO" l2="40 AÑOS · SU FONDA, 80 COMIDAS AL DÍA" l2at={A("40 anos", a)} />); }
  { const a = A("me quede callado", 32); add(a, a + 4, () => <Pensado t={t} at={a} out={a + 3.8} x={1380} y={300} text="...y yo nunca me callo" size={84} />); }
  { const a = A("se lo acabo sin decir nada", 42); add(a, a + 5, () => <X.Card t={t} at={a} out={a + 4.6} x={1440} y={300} from="right"><X.H s={52} c={CH.maiz}>SE LO ACABÓ</X.H><X.H s={42} f={HAND}>...y pidió otro plato</X.H></X.Card>); }
  { const a = A("me pagas con un secreto", 47); add(a, a + 4.5, () => <Stamp t={t} at={a + 0.3} out={a + 4.2} x={1300} y={420} text="UN SECRETO DE FONDA" size={84} />); }
  { const a = A("te lo cuento al final", 52); add(a, a + 3.4, () => <Palomita t={t} at={a} out={a + 3.2} y={240} text="AL FINAL TE LO CUENTO" />); }

  // ===== el dolor =====
  { const a = A("a las 3 de la tarde", 59); add(a, a + 9, () => <X.Diagnostico t={t} out={a + 8.6} x={1180} y={200} title="LO QUE TE PASA" rows={[{ at: a, text: "a las 3 de la tarde, duros" }, { at: A("se te revientan", a), text: "se revientan" }, { at: A("quedan aguados", a), text: "aguados, sin sabor" }]} />); }
  { const a = A("agua de calcetin", 64); add(a, a + 3.6, () => <Pensado t={t} at={a} out={a + 3.4} x={560} y={860} text="agua de calcetín" size={84} />); }
  { const a = A("nadie te enseno el orden", 72); add(a, a + 5, () => <>{fondo(a, a + 4.8)}<X.Cita t={t} at={a} out={a + 4.6} x={960} y={500} text="No eres tú. Nadie te enseñó el orden." size={92} /></>); }
  { const a = A("la gente no regresa", 78); add(a, a + 4, () => <Pill t={t} at={a} out={a + 3.8} x={1400} y={260} text="EL CLIENTE REGRESA" />); }
  { const a = A("ya perdiste al cliente", 84); add(a, a + 3.8, () => <Stamp t={t} at={a + 0.2} out={a + 3.6} x={1300} y={420} text="CLIENTE PERDIDO" size={90} />); }

  // ===== promesa: los 7 platos se encienden uno por uno =====
  addW(PROM[0] - 0.3, PROM[6] + 3, () => PLATES.map((q, i) => { const p = sc(t, q); return t >= PROM[i] ? <X.PlateLabel key={i} t={t} at={PROM[i]} out={PROM[6] + 2.8} x={p.x} y={p.y} n={i + 1} text={["qué frijol", "el remojo", "el comal", "el agua", "lo del final", "grasita y hierba", "el fuego"][i]} up={i % 2 ? 250 : 130} /> : null; }));
  { const a = A("el secreto de la fonda de claudio", 106); add(a, a + 4.5, () => <X.Card t={t} at={a} out={a + 4.2} x={1440} y={260} from="right" col="#8fd6ff"><X.H s={52} c="#8fd6ff">+1 · EL DE LA FONDA</X.H><X.H s={42} f={HAND}>ni yo lo sabía</X.H></X.Card>); }

  // ===== quién es Chayo =====
  { const a = A("yo soy rosario", 111); add(a, a + 9, () => <LowerThird t={t} at={a} out={a + 8.5} name="DOÑA CHAYO" l2="67 AÑOS · RANCHO DE PÁTZCUARO" l2at={A("tengo 67 anos", a)} />); }
  { const a = A("toda la vida en fogon de lena", 120); addW(a, a + 4, () => { const f = sc(t, FIRE); return <Tag t={t} at={a} x={f.x} y={f.y} dx={-260} dy={-200} text="FOGÓN DE LEÑA" sub="TODA LA VIDA" col="#ff9a4a" out={a + 3.8} size={50} />; }); }
  { const a = A("una casa sin frijoles", 127); add(a, a + 6, () => <>{fondo(a, a + 5.8)}<X.Cita t={t} at={a} out={a + 5.6} x={960} y={500} text="Una casa sin frijoles en la lumbre es una casa triste." who="MAMÁ CUCA" size={84} /></>); }

  // ===== CTA 1: la guía en el mundo, con su página REAL =====
  card(A("todas mis recetas las escribi", 135), G1 + 0.5, 1450, 280, "right", "LAS ESCRIBÍ TODAS", "cantidades · tiempos · lo que cuesta");
  { const a = G1; add(a, G1P, () => <X.Card t={t} at={a} out={G1P - 0.2} x={470} y={170} from="left" col="#ff8fbf"><X.H s={54} c="#ff8fbf">LAS 5 OLLAS DE DOÑA CHAYO</X.H><X.H s={40} f={HAND}>cinco libritos</X.H></X.Card>); }
  { const a = G1P, b = A("el link esta", G1P); add(a, b + 0.3, () => <N.PaginaReal t={t} at={a + 0.3} out={b + 0.2} x={1420} y={540} src="pag_l2_17.jpg" pag="LIBRO 2 · PÁG. 17" libro="Las Mañanas del Rancho" hl={A("los frijoles de la olla con tortillas", a)} w={520} />); }
  { const a = A("el link esta", G1P); add(a, a + 3.4, () => <X.DescCard t={t} at={a} out={a + 3.2} x={1440} y={760} hl={A("primera linea", a)} />); }
  { const a = A("toda manchada de grasa", 160); add(a, a + 5, () => <Nota t={t} at={a} out={a + 4.8} x={1480} y={300} lines={["la libreta de la fonda:", "manchada de grasa,", "lo que me enseñó mi amá"]} rot={-3} w={540} />); }
  { const a = A("pasada limpio", 165); add(a, a + 3.6, () => <Palomita t={t} at={a} out={a + 3.4} y={240} text="LA DE CHAYO, EN LIMPIO" />); }

  // ===== la historia =====
  { const a = A("una olla de barro", 170); add(a, a + 5, () => <X.FotoVieja t={t} at={a} out={a + 4.6} x={1360} y={460} src="s_abuela" w={700} rot={4} cap="Mamá Cuca" />); }
  { const a = A("escoger el frijol", 178); add(a, a + 9, () => <X.Card t={t} at={a} out={a + 8.6} x={1440} y={300} from="right"><X.H s={50} c={CH.maiz}>MI TRABAJO DE NIÑA</X.H><X.H s={42} f={HAND}>en el petate, con la charola</X.H><X.H s={42} f={HAND}>frijol por frijol</X.H><X.H s={42} f={HAND}>fuera las piedritas</X.H></X.Card>); }
  add(190, 196, () => <>{fondo(190, 196)}<X.Cita t={t} at={190} out={195.6} x={960} y={500} text="Chayito, el frijol se escoge con los ojos, no con la prisa." who="MAMÁ CUCA" size={84} /></>);
  add(200, 205, () => <Pensado t={t} at={200} out={204.6} x={1380} y={300} text="¿y por qué los de la vecina no?" size={80} />);
  add(207, 212.5, () => <>{fondo(207, 212.5)}<X.Cita t={t} at={207} out={212.2} x={960} y={500} text="El frijol no se apura." who="MAMÁ CUCA" size={110} /></>);
  { const a = A("el barro reparte el calor", 221); add(a, a + 5, () => <X.CorteOllas t={t} at={a} out={a + 4.8} x={960} y={790} n={1} badAt={1e9} />); }
  { const a = A("una olla gruesa", 229); add(a, a + 10, () => <>{fondo(a, a + 9.8)}<X.CorteOllas t={t} at={a} out={a + 9.6} x={960} y={540} n={3} badAt={A("la ollita delgada", a)} /></>); }
  { const a = A("mas prisa que olla", 246); add(a, a + 3.6, () => <Pensado t={t} at={a} out={a + 3.4} x={1380} y={300} text="más prisa que olla" size={88} />); }

  // ===== 1 · frijol nuevo =====
  { const a = A("el frijol tiene que ser nuevo", SECRETO[0]); add(a, a + 4, () => <Stamp t={t} at={a + 0.2} out={a + 3.8} x={1320} y={380} text="FRIJOL NUEVO" size={110} />); }
  { const a = A("se cuece en dos horas", SECRETO[0]); add(a, a + 9, () => <X.Versus t={t} at={a - 1.5} out={a + 8.6} x={960} y={620} a="DE ESTE AÑO" b="2-3 AÑOS EN BODEGA" rows={[["2 horas y listo", true, false], ["todo el día y no se ablanda", false, true]]} />); }
  { const a = A("es el frijol", 270); add(a, a + 3, () => <BigNum t={t} at={a} out={a + 2.8} text="ES EL FRIJOL" size={150} y={480} col={CH.maiz} edge="#5a2a10" />); }
  { const a = A("el frijol nuevo brilla", 273); add(a, a + 11, () => <N.NuevoViejo t={t} at={a} out={a + 10.6} x={960} y={560} viejoAt={A("el viejo se ve opaco", a)} />); }
  { const a = A("de dos o tres semanas", 286); add(a, a + 4, () => <Palomita t={t} at={a} out={a + 3.8} y={240} text="COMPRA POQUITO" />); }
  { const a = A("ese dia di arroz doble", 300); add(a, a + 3.6, () => <Pensado t={t} at={a} out={a + 3.4} x={1380} y={300} text="ese día: arroz doble" size={84} />); }
  { const a = A("de que cosecha es", 306); add(a, a + 4, () => <X.Card t={t} at={a} out={a + 3.8} x={1440} y={300} from="right" col="#8fd6ff"><X.H s={52} c="#8fd6ff">¿DE QUÉ COSECHA ES?</X.H><X.H s={42} f={HAND}>pregúntalo siempre</X.H></X.Card>); }
  { const a = A("el bayo", 312); add(a, a + 6, () => <X.Orden t={t} at={a} out={a + 5.8} nums={false} steps={[{ label: "bayo", at: a }, { label: "flor de mayo", at: A("el flor de mayo", a) }, { label: "peruano", at: A("o el peruano", a) }]} />); }
  { const a = A("lo que importa es que sea nuevo", 322); add(a, a + 3, () => <Palomita t={t} at={a} out={a + 2.8} y={240} text="QUE SEA NUEVO" />); }

  // ===== 2 · el remojo =====
  { const a = A("lo dejas remojando", SECRETO[1]); add(a, a + 15, () => <N.Remojo t={t} at={a} out={a + 14.6} x={1420} y={540} nocheAt={A("8 horas", a)} />); }
  { const a = A("se tira", 347); add(a, a + 4, () => <Stamp t={t} at={a} out={a + 3.8} x={560} y={400} text="ESA AGUA SE TIRA" size={84} />); }
  { const a = A("eso que te da gases", 350); add(a, a + 4, () => <X.Card t={t} at={a} out={a + 3.8} x={1440} y={300} from="right"><X.H s={50} c={CH.maiz}>AHÍ SE QUEDA</X.H><X.H s={42} f={HAND}>lo que suelta la cáscara... y los gases</X.H></X.Card>); }
  { const a = A("tarda una hora mas", 359); add(a, a + 3.6, () => <Palomita t={t} at={a} out={a + 3.4} y={240} text="¿SE TE OLVIDÓ? UNA HORA MÁS" />); }
  { const a = A("llevar la contraria", 364); add(a, a + 8, () => <X.Burbujas t={t} out={a + 7.8} items={[{ at: a, x: 1450, y: 260, text: "¡a veces no lo remojo!", rot: 3 }, { at: A("pues ya ves mija", a), x: 520, y: 520, text: "hasta los cocineros nos peleamos", rot: -4 }]} />); }
  { const a = A("frijol nuevo primero", 380); add(a, a + 3.6, () => <Palomita t={t} at={a} out={a + 3.4} y={240} text="DE ACUERDO: FRIJOL NUEVO PRIMERO" />); }

  // ===== 3 · el comal (el secreto de la abuela) =====
  { const a = A("que las fondas no te dicen", SECRETO[2]); add(a, a + 4, () => <Stamp t={t} at={a + 0.2} out={a + 3.8} x={1320} y={300} text="EL DE MI ABUELA" size={96} col={CH.maiz} />); }
  { const a = A("media cebolla blanca", SECRETO[2]); addW(a, a + 9, () => { const p = sc(t, COMAL); return <><Tag t={t} at={a} x={p.x + 40} y={p.y} dx={300} dy={-210} text="½ CEBOLLA BLANCA" col={CH.crema} out={a + 8.6} size={46} /><Tag t={t} at={A("y dos ajos", a)} x={p.x - 40} y={p.y + 10} dx={-320} dy={-170} text="2 AJOS CON CÁSCARA" col={CH.crema} out={a + 8.6} size={42} /></>; }); }
  { const a = A("sin aceite", 396); add(a, a + 3.5, () => <Pill t={t} at={a} out={a + 3.3} x={1400} y={820} text="ACEITE" />); }
  { const a = A("diez minutos", 400); add(a, a + 4, () => <X.Cronometro t={t} at={a} out={A("y van enteros a la olla", 402) - 0.1} x={1500} y={420} mins={10} label="VOLTEANDO" size={260} />); }
  { const a = A("y van enteros a la olla", 402); add(a, a + 9, () => <X.Versus t={t} at={a} out={a + 8.6} x={960} y={620} a="PICADOS" b="ENTEROS" rows={[["se deshacen, caldo turbio", true, false], ["sueltan sabor, caldo clarito", false, true]]} />); }
  { const a = A("un sabor dulce", 412); addW(a, a + 4, () => <Aroma t={t} at={a} out={a + 3.8} x={sc(t, CZ).x} y={sc(t, CZ).y - 60} />); }
  { const a = A("cubito de consome", 417); add(a, a + 3.5, () => <Pill t={t} at={a} out={a + 3.3} x={1400} y={300} text="CUBITO DE CONSOMÉ" />); }
  { const a = A("es el comal", 420); add(a, a + 2.4, () => <BigNum t={t} at={a} out={a + 2.2} text="EL COMAL" size={170} y={480} col={CH.maiz} edge="#5a2a10" />); }
  { const a = A("yo echaba la cebolla cruda", 423); add(a, a + 4, () => <Pill t={t} at={a} out={a + 3.8} x={1400} y={260} text="CEBOLLA CRUDA" />); }

  // ===== CTA 2: una olla, siete comidas, con sus páginas reales =====
  addW(A("enfrijoladas", 436), A("eso lo tengo en el libro 4", 442) + 0.2, () => <N.SieteComidas t={t} out={A("eso lo tengo en el libro 4", 442)} x={960} y={540} rows={[
    { at: A("enfrijoladas", 436), label: "ENFRIJOLADAS" }, { at: A("molletes", 437), label: "MOLLETES" }, { at: A("sopa de frijol con nopales", 437), label: "SOPA CON NOPALES" },
    { at: A("frijoles puercos", 439), label: "FRIJOLES PUERCOS" }, { at: A("tacos dorados", 440), label: "TACOS DORADOS" }, { at: A("tacos dorados", 440) + 0.4, label: "BURRITOS" }, { at: A("tacos dorados", 440) + 0.8, label: "CON QUESO" }]} />);
  { const a = G2P, b = A("desde la pagina 35", a); add(a, b + 0.2, () => <N.PaginaReal t={t} at={a + 0.2} out={b} x={1420} y={540} src="pag_l4_29.jpg" pag="LIBRO 4 · PÁG. 29" libro="La Quincena Flaca" hl={a + 0.9} w={500} />); }
  { const a = A("desde la pagina 35", G2P); add(a, A("el link esta", a) + 0.3, () => <N.PaginaReal t={t} at={a} out={A("el link esta", a) + 0.1} x={1450} y={560} src="pag_l4_35.jpg" pag="LIBRO 4 · PÁG. 35" libro="Frijoles con Queso y Tortillas" hl={a + 0.6} w={480} rot={3} />); }
  { const a = A("una olla de frijol 7 comidas", 448); add(a, a + 3, () => <BigNum t={t} at={a} out={a + 2.8} text="1 OLLA = 7" size={150} x={560} y={300} col={CH.maiz} edge="#5a2a10" sub="COMIDAS" />); }
  { const a = A("el link esta", G2P); add(a, a + 3.6, () => <X.DescCard t={t} at={a} out={a + 3.4} x={1440} y={760} hl={A("primera linea", a)} />); }

  // ===== 4 · el agua =====
  { const a = A("agua fria al principio", SECRETO[3]); add(a, a + 4, () => <Stamp t={t} at={a + 0.2} out={a + 3.8} x={1320} y={380} text="FRÍA, Y LUEGO CALIENTE" size={84} />); }
  { const a = A("3 litros de agua fria", 461); add(a, a + 5, () => <X.Card t={t} at={a} out={a + 4.8} x={1440} y={300} from="right" col="#8fd6ff"><X.H s={56} c="#8fd6ff">3 LITROS POR KILO</X.H><X.H s={42} f={HAND}>agua fría, y prendes la lumbre</X.H></X.Card>); }
  { const a = A("nunca le echas agua fria", 466); add(a, a + 16, () => <N.Tetera t={t} at={a} out={a + 15.6} x={960} y={780} okAt={A("una tetera con agua caliente", a)} />); }
  { const a = A("el frijol se asusta", 476); add(a, a + 4, () => <Pensado t={t} at={a} out={a + 3.8} x={1380} y={260} text="¡el frijol se asusta!" size={84} />); }
  { const a = A("su jarro de agua", 484); addW(a, a + 4.5, () => { const f = sc(t, FIRE); return <Tag t={t} at={a} x={f.x} y={f.y} dx={-260} dy={-200} text="EL JARRO DE LA ABUELA" sub="SIEMPRE CALIENTITO" col={CH.maiz} out={a + 4.2} size={46} />; }); }
  { const a = A("una olla de agua hirviendo atras", 490); add(a, a + 7, () => <X.Card t={t} at={a} out={a + 6.6} x={1440} y={300} from="right" col="#8fd6ff"><X.H s={50} c="#8fd6ff">EN LA FONDA</X.H><X.H s={42} f={HAND}>agua hirviendo atrás, todo el día</X.H><X.H s={42} f={HAND}>lo más barato y lo que más se olvida</X.H></X.Card>); }

  // ===== 5 · lo del final =====
  { const a = A("lo que no se le echa hasta el final", SECRETO[4]); add(a, a + 3.6, () => <Stamp t={t} at={a + 0.2} out={a + 3.4} x={1320} y={380} text="HASTA EL FINAL" size={96} />); }
  { const a = A("la sal el jitomate", 506); add(a, a + 14, () => <X.Senales t={t} out={a + 13.6} x={1250} y={240} title="AL FINAL, CON EL FRIJOL SUAVE" rows={[{ at: a, text: "la sal" }, { at: A("el jitomate el limon", a), text: "jitomate, limón" }, { at: A("hasta el piloncillo", a), text: "hasta el piloncillo" }]} />); }
  { const a = A("se ponga dura", 516); add(a, a + 4, () => <Pill t={t} at={a} out={a + 3.8} x={560} y={300} text="LA CÁSCARA SE ABLANDA" />); }
  { const a = A("eso esta probado", 520); add(a, a + 3, () => <Palomita t={t} at={a} out={a + 2.8} y={240} text="ESTÁ PROBADO" />); }
  { const a = A("una cucharada por kilo", 527); add(a, a + 6, () => <X.Card t={t} at={a} out={a + 5.6} x={1440} y={300} from="right"><X.H s={52} c={CH.maiz}>1 CUCHARADA DE SAL POR KILO</X.H><X.H s={42} f={HAND}>cuando se deshace entre los dedos</X.H></X.Card>); }
  { const a = A("frijoles charros", 537); add(a, a + 6, () => <X.Card t={t} at={a} out={a + 5.6} x={470} y={300} from="left"><X.H s={50} c={CH.maiz}>¿CHARROS?</X.H><X.H s={42} f={HAND}>jitomate y chorizo, ya cocido</X.H></X.Card>); }

  // ===== 6 · grasita y hierba =====
  { const a = A("una cucharada de manteca de cerdo", 548); add(a, a + 9, () => <X.Card t={t} at={a} out={a + 8.6} x={1440} y={300} from="right"><X.H s={50} c={CH.maiz}>1 CUCHARADA DE MANTECA</X.H><X.H s={42} f={HAND}>de la carnicería</X.H><X.H s={42} f={HAND}>a la mitad, para toda la olla</X.H></X.Card>); }
  { const a = A("ese brillito", 558); add(a, a + 4, () => <Palomita t={t} at={a} out={a + 3.8} y={240} text="BRILLITO Y CUERPO" />); }
  { const a = A("los ultimos 15 minutos", 563); add(a, a + 4.5, () => <X.Cronometro t={t} at={a} out={a + 4.2} x={1500} y={420} mins={15} label="EL EPAZOTE, AL FINAL" size={260} />); }
  { const a = A("se pone amargo", 567); add(a, a + 3.5, () => <Pill t={t} at={a} out={a + 3.3} x={560} y={300} text="EPAZOTE DESDE EL INICIO" />); }
  { const a = A("huele a frijol de abuela", 570); addW(a, a + 4, () => <Aroma t={t} at={a} out={a + 3.8} x={sc(t, CZ).x} y={sc(t, CZ).y - 60} />); }
  { const a = A("huele a chicharron", 583); add(a, a + 4, () => <X.Versus t={t} at={a - 2.5} out={a + 3.8} x={960} y={620} a="DEL SÚPER" b="DE LA CARNICERÍA" rows={[["no es igual", true, false], ["huele a chicharrón", false, true]]} />); }

  // ===== 7 · el fuego =====
  { const a = A("le bajas a que no mas tiemble", 592); add(a, a + 7.5, () => <N.Hervor t={t} at={a} out={a + 7.2} x={1450} y={460} fuerte={0.12} label="QUE NOMÁS TIEMBLE" />); }
  { const a = A("con hervor fuerte", 598); add(a, a + 7.5, () => <N.Hervor t={t} at={a} out={a + 7.2} x={1450} y={460} fuerte={1} label="FUERTE = SE REVIENTAN" />); }
  { const a = A("y la tapa medio abierta para que", 606); addW(a, a + 4, () => { const p = sc(t, CZ); return <Tag t={t} at={a} x={p.x} y={p.y} dx={330} dy={-200} text="TAPA MEDIO ABIERTA" sub="QUE NO SE DERRAME" col={CH.maiz} out={a + 3.8} size={48} />; }); }
  { const a = A("dos horas dos horas y media", 611); add(a, a + 3.6, () => <X.Cronometro t={t} at={a} out={a + 3.4} x={480} y={420} mins={150} label="2 HORAS, 2 Y MEDIA" size={240} />); }
  { const a = A("sacas cinco frijoles", 616); add(a, a + 10, () => <N.Soplar t={t} at={a} out={a + 9.6} x={960} y={720} soploAt={A("y les soplas", a)} />); }
  { const a = A("como mantequilla", 628); add(a, a + 3, () => <Palomita t={t} at={a} out={a + 2.8} y={240} text="SE DESHACE COMO MANTEQUILLA" />); }

  // ===== el secreto de la fonda de Claudio =====
  { const a = A("ya te toco", 631); add(a, a + 4.5, () => <Stamp t={t} at={a} out={a + 4.2} x={1300} y={400} text="EL DE LA FONDA" size={96} col="#8fd6ff" />); }
  { const a = A("los coci ayer", 641); add(a, a + 20, () => <N.AyerHoy t={t} at={a} out={a + 19.6} x={1380} y={440} hoyAt={A("al otro dia", a)} />); }
  { const a = A("en ollas chicas", 661); add(a, a + 7, () => <X.Card t={t} at={a} out={a + 6.6} x={470} y={300} from="left" col="#8fd6ff"><X.H s={50} c="#8fd6ff">ENFRÍA RÁPIDO</X.H><X.H s={42} f={HAND}>ollas chicas, al refri</X.H><X.H s={42} f={HAND}>y al otro día, despacito</X.H></X.Card>); }
  { const a = A("una hoja de aguacate", 670); add(a, a + 14, () => <N.Hoja t={t} at={a} out={a + 13.6} x={1400} y={520} tuesta={A("tostada en el comal", a)} />); }
  { const a = A("los ultimos 10 minutos", 674); add(a, a + 4, () => <X.Cronometro t={t} at={a} out={a + 3.8} x={480} y={420} mins={10} label="LA HOJA, AL FINAL" size={230} />); }
  { const a = A("una senora de oaxaca", 684); add(a, a + 5, () => <X.Card t={t} at={a} out={a + 4.8} x={470} y={300} from="left"><X.H s={48} c={CH.maiz}>SE LA ENSEÑÓ</X.H><X.H s={42} f={HAND}>una señora de Oaxaca,</X.H><X.H s={42} f={HAND}>20 años en su fonda</X.H></X.Card>); }
  { const a = A("me la voy a robar", 696); add(a, a + 3.6, () => <Pensado t={t} at={a} out={a + 3.4} x={1380} y={300} text="¡me la voy a robar!" size={88} />); }

  // ===== lo que sobra =====
  { const a = A("lo que sobra", 704); add(a, a + 20, () => <X.Orden t={t} at={a} out={a + 19.6} nums={false} steps={[{ label: "sopa de frijol", at: A("se hace la sopa de frijol", a) }, { label: "refritos", at: A("y se refrien", a) }, { label: "molletes", at: A("tus molletes", a) }, { label: "enfrijoladas", at: A("tus enfrijoladas", a) }, { label: "tlacoyos", at: A("tus tlacoyos", a) }]} />); }
  { const a = A("nada se tira", 729); add(a, a + 4, () => <Stamp t={t} at={a} out={a + 3.8} x={1300} y={400} text="NADA SE TIRA" size={100} />); }

  // ===== lo que puede salir mal =====
  add(A("si quedaron duros", 737), A("si quedaron aguados", 744), () => <X.FixCard t={t} at={A("si quedaron duros", 737)} out={A("si quedaron aguados", 744) - 0.2} x={960} y={860} prob="DUROS" fix={["frijol viejo", "agua fría de golpe", "jitomate antes"]} fixAt={A("el frijol era viejo", 737)} />);
  add(A("si quedaron aguados", 744), A("y si te dieron muchos gases", 755), () => <X.FixCard t={t} at={A("si quedaron aguados", 744)} out={A("y si te dieron muchos gases", 755) - 0.2} x={960} y={860} prob="AGUADOS" fix={["destapa 15 min", "machaca un puñito"]} fixAt={A("destapalos", 744)} />);
  add(A("y si te dieron muchos gases", 755), A("y eso si", 764), () => <X.FixCard t={t} at={A("y si te dieron muchos gases", 755)} out={A("y eso si", 764) - 0.2} x={960} y={860} prob="GASES" fix={["remojo y tira el agua", "su epazote"]} fixAt={A("remojalos", 760)} />);
  { const a = A("en menos de dos horas", 768); add(a, a + 6, () => <X.Refri t={t} at={a} out={a + 5.8} x={1440} y={420} inAt={A("y al refrigerador", a)} />); }
  { const a = A("ahi duran cuatro dias", 773); add(a, a + 3.6, () => <Palomita t={t} at={a} out={a + 3.4} y={240} text="DURAN 4 DÍAS" />); }

  // ===== la cuenta =====
  { const a = A("hagamos la cuenta", 778); add(a, a + 3.5, () => <BigNum t={t} at={a} out={a + 3.3} text="LA CUENTA" size={170} y={500} col={CH.maiz} edge="#5a2a10" sub="EN EL RANCHO TODO SE CUENTA" />); }
  add(A("un kilo de frijol nuevo", 782), A("ni 6 pesos el plato", 795) + 0.3, () => <Receipt t={t} rows={[
    { at: A("un kilo de frijol nuevo", 782), item: "1 kg de frijol nuevo", $: 45 }, { at: A("unos 20 pesos mas", 787), item: "cebolla, ajo, manteca, epazote", $: 20 }]}
    totalAt={A("salen unos 12 platos", 791)} x={120} y={130} out={A("ni 6 pesos el plato", 795) + 0.2} sc={1.12} title="LA OLLA · 12 PLATOS" />);
  { const a = A("salen unos 12 platos", 791); add(a, a + 4.5, () => <X.Gente t={t} at={a} out={a + 4.3} x={1350} y={360} n={12} label="platos" cols={6} />); }
  { const a = A("ni 6 pesos el plato", 795); add(a, a + 7, () => <X.Cifra t={t} at={a} out={a + 6.6} x={1400} y={420} to={6} post=" el plato" size={170} sub="LIBRO 2: A $6, CON SU CAFÉ DE OLLA" />); }
  { const a = A("te la cobran a", 804); add(a, a + 5, () => <Precio t={t} at={a} out={a + 4.8} x={1400} y={140} top="$40-50" sub="UNA ORDEN EN LA FONDA" />); }
  { const a = A("comen 8", 810); add(a, a + 4, () => <X.Card t={t} at={a} out={a + 3.8} x={470} y={300} from="left"><X.H s={50} c={CH.maiz}>1 ORDEN DE FONDA</X.H><X.H s={44} f={HAND}>= comen 8 en tu casa</X.H></X.Card>); }

  // ===== resumen, tarea, comentarios, cierre =====
  addW(RES[0] - 0.3, RES[6] + 4, () => PLATES.map((q, i) => { const p = sc(t, q); return t >= RES[i] ? <X.PlateLabel key={i} t={t} at={RES[i]} out={RES[6] + 3.8} x={p.x} y={p.y} n={i + 1} text={["nuevo, que brille", "remojo, se tira", "comal, enteros", "fría → caliente", "sal y ácido al final", "manteca + epazote", "bajito, y soplas"][i]} up={i % 2 ? 250 : 130} /> : null; }));
  { const a = A("y el de claudio", 845); add(a, a + 7, () => <X.Card t={t} at={a} out={a + 6.6} x={1440} y={250} from="right" col="#8fd6ff"><X.H s={50} c="#8fd6ff">+ EL DE CLAUDIO</X.H><X.H s={42} f={HAND}>reposarlos de un día para otro</X.H><X.H s={42} f={HAND}>y su hojita de aguacate</X.H></X.Card>); }
  { const a = A("no hagas todo", 852); add(a, a + 11, () => <X.Tarea t={t} at={a} out={a + 10.6} x={1360} y={500} rows={[{ at: A("compra frijol nuevo", a), text: "compra frijol nuevo" }, { at: A("y tatema tu cebolla", a), text: "tatema tu cebolla" }, { at: A("la hojita de claudio", a), text: "(y la hojita de Claudio)" }]} />); }
  { const a = A("y cuentenos aqui abajo", 863); add(a, a + 10, () => <X.Encuesta t={t} at={a} out={a + 9.6} x={1340} y={440} q="¿EPAZOTE O AGUACATE?" a="epazote" b="hoja de aguacate" pa={-1} />); }
  { const a = A("con mi cafecito de olla", 874); add(a, a + 3.5, () => <Pensado t={t} at={a} out={a + 3.3} x={560} y={860} text="los leo todos" size={80} />); }
  { const a = G3; add(a, A("el link esta", a) + 0.2, () => <X.Card t={t} at={a} out={A("el link esta", a)} x={470} y={170} from="left" col="#ff8fbf"><X.H s={50} c="#ff8fbf">LIBRO 2 · LAS MAÑANAS DEL RANCHO</X.H><X.H s={40} f={HAND}>la receta completita</X.H></X.Card>); }
  { const a = A("el link esta", 884); add(a, a + 3.5, () => <X.DescCard t={t} at={a} out={a + 3.3} x={1440} y={760} hl={A("primera linea", a)} />); }
  { const a = A("ve a escoger tu frijol", 897); add(a, END_T, () => <X.Cita t={t} at={a} out={END_T - 0.8} x={960} y={300} text="Ve a escoger tu frijol." size={96} />); }
  return L;
};

// ---------------- composición ----------------
export const Main: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const idx = PARTS.findIndex((p) => t >= p.a && t < p.b);
  if (inAv(t)) L.push(<Avatar key="av" t={t} />);
  else if (idx >= 0) {
    const p = PARTS[idx], nx = PARTS[idx + 1];
    if (p.c) L.push(<Clip key={"c" + idx} k={p.c} t={t} a={p.a} z={p.z} />);
    else {
      L.push(<World key="w" t={t} />);
      if (nx?.c && Math.abs(nx.a - p.b) < 1e-6 && /^(caz|pl)/.test(p.k1 ?? "")) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, CZ); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} z={nx.z} /></Portal>); }
      }
    }
  }
  PARTS.forEach((p, i) => {
    const nx = PARTS[i + 1]; if (!nx || Math.abs(nx.a - p.b) > 1e-6 || Math.abs(t - p.b) >= 0.4) return;
    if (!p.c && !nx.c) return;
    if (!p.c && nx.c && /^(caz|pl)/.test(p.k1 ?? "")) return;
    L.push(<SteamWipe key={"sw" + i} t={t} mid={p.b} w={0.24} />);
  });
  L.push(...Ov(t));
  SECRETO.forEach((a, i) => { if (Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.45} w={0.3} />); });
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
