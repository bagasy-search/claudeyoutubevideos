// chayopollo · El Secreto de mi Abuela para el Caldo de Pollo Más Sabroso. UN mundo (la cocina de adobe de chayo3, olla con caldo dorado,
// comal donde se tatema la cebolla, recetario de mamá Cuca, siete platos = siete secretos) y UNA cámara que recorre ese mundo entre las
// ventanas del avatar; las fotos reales entran por portal o vapor. Los planos se cortan sobre las pausas de la voz (words.json) y cada
// pieza nace con la palabra que la nombra (A("frase")).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PT2, PLATES, screenOf, camSpeed, setKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import WORDS from "./words.json";
import { BigNum, CH, Flash, HAND, P, Portal, Tag, at, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Aroma, Nota, Reloj, Pensado, Palomita, Stamp, Precio, Pill } from "./comps";
import * as X from "./piezas";
import * as N from "./nuevos";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = (AVW as { win: Win[] }).win;
const inAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
export const END_T = 981.0; // voz 980,0 + 1 s de silencio
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
  ["HOOK1", 0], ["HOOK2", A("la semana pasada mi hija", 20)], ["HOOK3", A("y a lo mejor a ti", 50)], ["PROMISE", A("asi que esto es lo que", 75)],
  ["INTRO", A("para los que no me conocen", 100)], ["CTA", A("y antes de seguir", 130)], ["STORY", A("mi abuela se llamaba", 165)], ["STORY3", A("y la olla tambien cuenta", 210)],
  ["UNO", A("secreto numero uno", 230)], ["DOS", A("secreto numero 2", 295)], ["TRES", A("secreto numero 3", 370)], ["CUATRO", A("secreto numero 4", 435)],
  ["CTA2", A("y por cierto mija", 485)], ["CINCO", A("secreto numero 5", 505)], ["SEIS", A("secreto numero 6", 600)], ["SIETE", A("secreto numero 7", 660)],
  ["VARIANTES", A("ahora te voy a dar cuatro", 720)], ["PROBLEMAS", A("ahora lo que puede salir mal", 790)], ["DINERO", A("ahora hagamos la cuenta", 855)],
  ["RESUMEN", A("te lo doy todo junto", 900)], ["TAREA", A("y tu tarea para esta semana", 930)], ["COMENTARIO", A("y cuentame aqui abajo", 945)], ["CIERRE", A("y si quieres la receta completita", 960)],
];
const secAt = (t: number) => { let k = SEC[0][0]; for (const [n, a] of SEC) if (t >= a - 0.05) k = n; return k; };
const SECRETO = SEC.filter(([n]) => ["UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE"].includes(n)).map(([, a]) => a);

// fotos (en orden de la voz) y recorridos de cámara de cada sección; el motor reparte las fotos parejo entre los planos de la sección
const PH: Record<string, string[]> = {
  HOOK1: ["h_plato", "h_olla"], HOOK2: ["h_fonda", "h_fonda_plato"], HOOK3: ["h_lavar", "h_aguado"], PROMISE: [],
  INTRO: ["i_fogon", "i_taza"], CTA: ["i_cta"], STORY: ["s_gallinas", "s_abuela", "s_nina"], STORY3: ["s_olla_barro", "s_olla_delgada"],
  UNO: ["u_pechugas", "u_polleria", "u_piezas", "u_patitas", "u_gelatina", "u_gallina", "u_molleja"],
  DOS: ["d_salpica", "d_cuchillo", "d_jabon", "d_agua_fria", "d_sal"],
  TRES: ["t_comal", "t_voltear", "t_negro", "t_pelar", "t_a_la_olla", "t_color"],
  CUATRO: ["c_espuma", "c_jicara", "c_parada", "c_hierbabuena"], CTA2: ["w_libro", "w_tinga", "w_enchiladas"],
  CINCO: ["f_borbotones", "f_tiembla", "f_sacar_pechuga", "f_deshebrar", "f_seca", "f_tetera", "f_presion"],
  SEIS: ["v_atole", "v_elote", "v_papa", "v_calabacita", "v_arroz", "v_servir"], SIETE: ["s7_cilantro", "s7_tapa", "s7_mesa", "s7_limon"],
  VARIANTES: ["x_tlalpeno", "x_lupe", "x_fideo", "x_flautas"], PROBLEMAS: ["p_turbio", "p_grasa", "p_refri"], DINERO: ["m_mercado", "m_familia"],
  RESUMEN: [], TAREA: [], COMENTARIO: [], CIERRE: ["z_cebolla", "z_servir"],
};
const WL: Record<string, [string, string][]> = {
  HOOK1: [["cazT", "cazT2"], ["caz", "caz2"]], HOOK2: [["top", "topB"]], HOOK3: [["cazL", "cazL2"]], PROMISE: [["top", "topB"], ["topB", "topC"], ["pl1", "pl1b"]],
  INTRO: [["wide", "fogon"], ["fogon", "fogon2"]], CTA: [["libro", "libro2"], ["libro2", "libro"]], STORY: [["wide2", "pots"], ["caz", "cazL"]], STORY3: [["pots", "repisa"], ["repisa", "repisa2"], ["caz", "caz2"]],
  UNO: [["libro2", "libro"], ["caz", "caz2"], ["cazT", "cazT2"], ["cazL", "caz"]], DOS: [["caz2", "caz"], ["remojo", "remojo2"], ["cazT", "cazT2"], ["libro", "libro2"]],
  TRES: [["comal", "comal2"], ["comalT", "comalT2"], ["comal2", "comalT"], ["caz", "caz2"]], CUATRO: [["cazT", "cazT2"], ["caz", "cazL"], ["cazL2", "caz2"]],
  CTA2: [["libro", "libro2"]], CINCO: [["fogon", "fogon2"], ["cazT", "cazT2"], ["caz2", "caz"], ["fogon2", "fogon"], ["cazL", "cazL2"]],
  SEIS: [["caz", "caz2"], ["cazT", "cazT2"], ["pl5", "pl5b"], ["cazL", "cazL2"]], SIETE: [["cazT2", "cazT"], ["limon", "limon2"], ["top", "topB"], ["pl6", "pl6b"]],
  VARIANTES: [["caz", "caz2"], ["fogon", "wide"], ["cazL", "cazL2"]], PROBLEMAS: [["cazT", "cazT2"], ["caz2", "caz"], ["wide", "wide2"]], DINERO: [["top", "topB"], ["topB", "topC"]],
  RESUMEN: [["top", "topB"], ["topB", "topC"], ["topC", "top"]], TAREA: [["caz", "caz2"], ["pl4", "pl4b"]], COMENTARIO: [["wide", "wide2"]], CIERRE: [["libro", "libro2"], ["caz", "salida"]],
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
      let y = k === n - 1 ? b : snap(x + want, x + 2.3, b - 2.3 * (n - 1 - k));
      slots.push([x, y]); x = y;
    }
  }
  // reparto: por sección, fotos repartidas parejo entre sus planos, el resto con recorridos de cámara
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
  // mundo → mundo pegados: la cámara sigue desde donde quedó (un solo plano, sin corte)
  for (let i = 1; i < out.length; i++) if (!out[i].c && !out[i - 1].c && Math.abs(out[i].a - out[i - 1].b) < 1e-6) out[i].k0 = out[i - 1].k1;
  return out;
})();
export const PLAN = PARTS; // (para el EDL)
setKeys(PARTS.filter((p) => !p.c).flatMap((p) => { const k0 = C[p.k0!], k1 = C[p.k1!]; return [{ t: p.a + 0.001, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[]; }));
const partAt = (t: number) => PARTS.find((p) => t >= p.a && t < p.b);

// ---------------- recetario de mamá Cuca (una hoja por secreto) y la GUÍA ----------------
const RECETARIO = [
  { l: ["# Caldo de Pollo", "de mi mamá Cuca", "", "El caldo tiene su orden,", "como la misa.", "", "— Refugio, 1962"], r: ["pollo entero y patitas", "no se lava: a la olla", "cebolla al comal", "la espuma, a tiempo", "fuego bajito", "verduras en orden", "cilantro al apagar"] },
  { l: ["# 1. El pollo", "1 pollo entero, 2 kg", "en piezas, con huacal", "y sus alas", "½ kg de patitas", "", "molleja y corazón"], r: ["las patitas: gelatina", "si hay gallina, mejor", "(una hora más)", "", "la pechuga sola", "da caldo aguado"] },
  { l: ["# 2. No se lava", "del bolsa a la olla", "cuchillo pa' el pellejo", "manos con jabón", "tabla nomás pa'l pollo", "", "lo limpia el hervor"], r: ["agua FRÍA", "4 litros", "1 cucharada de sal", "", "que suelte despacito"] },
  { l: ["# 3. El comal", "½ cebolla blanca", "3 ajos con cáscara", "1 jitomate entero", "", "sin aceite, sin nada"], r: ["hasta que estén NEGROS", "unos 10 minutos", "volteando con la palita", "", "al ajo, fuera la cáscara", "todo a la olla"] },
  { l: ["# 4. La espuma", "a los 20 minutos", "sube gris, fea", "no es grasa", "", "10 minutos con la jícara"], r: ["sin espuma, ahora sí:", "lo tatemado", "y una ramita", "de hierbabuena"] },
  { l: ["# 5. El fuego", "que nomás TIEMBLE", "tapa medio abierta", "", "la pechuga:", "25 minutos y afuera"], r: ["lo demás, 1 hora más", "si baja el agua:", "de la tetera, caliente", "", "olla de presión:", "20 min, sin espuma"] },
  { l: ["# 6. Las verduras", "elote y zanahoria: 30 min", "papa y chayote: 15", "calabacita y ejote: 10", "", "pedazos GRANDES"], r: ["el arroz aparte,", "en su cazuelita", "una cucharada en el plato", "y encima el caldo"] },
  { l: ["# 7. Al final", "al apagar la lumbre:", "un puñito de cilantro", "con todo y tallo", "otra ramita de hierbabuena", "tapa, 10 minutos"], r: ["a la mesa, en platitos:", "cebolla, cilantro, serrano,", "limones, chile de árbol", "tortillas del comal", "", "sin limón no hay fiesta"] },
];
const GUIA = [
  { l: ["# Las 5 Ollas de", "# Doña Chayo", "", "Libro 3", "El Pollo que Rinde", "", "cuatro semanas de pollo", "con sus pesos"], r: ["Semana 1", "El Pollo Entero Partido", "", "el menú ............ 13", "el orden ........... 16", "pollo y caldo ...... 17", "tinga ............. 18"] },
  { l: ["# Pollo Partido y", "# Caldo de la Abuela", "pág. 17 · lunes", "", "$33 el plato", "rinde 4 platos", "tarda 2 horas"], r: ["la pechuga:", "25 minutos y afuera", "", "y de aquí sale", "toda la semana"] },
  { l: ["# El Menú", "Semana 1 · pág. 13", "", "lunes · el caldo", "martes · tinga", "miércoles · enchiladas", "jueves · sopa de arroz"], r: ["un pollo,", "cinco comidas", "", "ni $27 el plato"] },
];
const G1 = A("las cinco ollas de dona chayo", 140), G1P = A("en el libro 3", 150), G2 = A("en mi libro 3", 490), G2P = A("el lunes el caldo", 495), G3 = A("esta en el libro 3", 964);
const isGuia = (t: number) => (t >= G1 - 1 && t < A("y ahora si vamonos", 160) + 1.5) || (t >= G2 - 1 && t < A("secreto numero 5", 505) - 0.2) || t >= G3 - 1;
const SERVE = SECRETO.map((a, i) => (i < 6 ? SECRETO[i + 1] : A("ahora te voy a dar cuatro", 720)) - 2.2);
const PROM = [A("que partes del pollo", 85), A("que no se hace en el fregadero", 85), A("lo que pasa en el comal", 85), A("la espuma", 85), A("el fuego y el reloj", 85), A("el orden de las verduras", 85), A("y lo que va al final", 85)];
const RES = [A("uno pollo entero", 905), A("dos no se lava", 905), A("3 cebolla", 905), A("4 la espuma", 905), A("5 fuego bajito", 905), A("6 las verduras", 905), A("7 cilantro", 905)];
const T3 = SECRETO[2], T3end = SECRETO[3];

const worldAt = (t: number): WorldProps => {
  const guia = isGuia(t);
  const plateServed = PLATES.map((_, i) => win(t, SERVE[i], SERVE[i] + 1.2));
  const plateOn = PLATES.map((_, i) => Math.max(
    win(t, PROM[i], PROM[i] + 0.3) * (1 - win(t, PROM[6] + 3, PROM[6] + 3.4)),
    win(t, SERVE[i] - 0.4, SERVE[i]) * (1 - win(t, SERVE[i] + 2, SERVE[i] + 3)),
    win(t, RES[i], RES[i] + 0.3) * (1 - win(t, RES[6] + 4, RES[6] + 4.4)),
  ));
  const k0 = partAt(t)?.k0 ?? "caz";
  const comalOn = A("va al comal", T3), negros = A("negros por fuera", T3);
  const verd = t >= T3 && t < T3end ? 0.5 * win(t, comalOn, comalOn + 0.8) + 0.5 * win(t, negros, negros + 6) : t >= T3end && t < SECRETO[4] ? 1 : t >= A("ve a tatemar tu cebolla", 960) ? 0.5 + 0.5 * win(t, A("ve a tatemar tu cebolla", 960), END_T) : 0;
  const bajito = A("lo que tu quieres es que", 535), borb = A("a borbotones", 511);
  const fire = t >= SECRETO[4] && t < SECRETO[5] ? 1 + 1.1 * win(t, borb, borb + 0.4) * (1 - win(t, bajito - 0.5, bajito + 0.3)) - 0.45 * win(t, bajito, bajito + 1.2) : 1;
  return {
    t, fire, ojitos: 1,
    steamCaz: /^cazT/.test(k0) ? 0.35 : /^(caz|pl)/.test(k0) ? 1 : /^top/.test(k0) ? 0.4 : 0.25,
    steamComal: /^comal/.test(k0) ? 0.18 : 1,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.16 * v),
    book: guia
      ? { open: ei(t, t < 400 ? G1 : t < 600 ? G2 : G3, (t < 400 ? G1 : t < 600 ? G2 : G3) + 1.2), flip: t < 400 ? ei(t, G1P, G1P + 0.9) : t < 600 ? 2 * ei(t, G2P, G2P + 0.9) : ei(t, G3 + 1, G3 + 1.9), pages: GUIA }
      : { open: 1, flip: SECRETO.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0), pages: RECETARIO },
    guia: guia ? 1 : 0,
    verduras: verd, remojo: t >= SECRETO[1] && t < SECRETO[2] ? 0.04 : 0,
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
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((wn, i) => (
    <Sequence key={i} from={s(wn.ms) - 10} durationInFrames={s(wn.me - wn.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= wn.ms - 0.02 && t < wn.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(wn.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
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

  // ===== gancho =====
  { const a = A("mira nomas el color", 2); add(a, a + 6, () => { const p = sc(t, CZ); return <Tag t={t} at={a} x={p.x} y={p.y} dx={330} dy={-220} text="DORADITO, CLARITO" sub="CON SUS OJITOS DE GRASA" col={CH.maiz} out={a + 5.6} size={54} />; }); }
  { const a = A("y huelelo", 5); add(a, a + 3.5, () => <Aroma t={t} at={a} out={a + 3.2} x={sc(t, CZ).x} y={sc(t, CZ).y - 60} />); }
  { const a = A("ni el cubito de consome", 8); add(a, a + 3.2, () => <><Pill t={t} at={A("el pollo caro", 8)} out={a + 3} x={1380} y={260} text="POLLO CARO" /><Pill t={t} at={a} out={a + 3} x={1380} y={420} text="CUBITO DE CONSOMÉ" /></>); }
  { const a = A("siete cosas", 10); add(a, a + 5, () => <BigNum t={t} at={a} out={a + 4.6} text="7" size={330} x={1460} y={460} col={CH.maiz} edge="#5a2a10" sub="COSAS DE MI ABUELA" />); }
  { const a = A("una fonda en uruapan", 25); add(a, a + 4, () => <X.MapaMich t={t} at={a} out={a + 3.8} x={1400} y={430} />); }
  { const a = A("120 pesos", 30); add(a, a + 4, () => <Precio t={t} at={a} out={a + 3.8} x={1400} y={140} top="$120" sub="EL PLATO EN LA FONDA" />); }
  { const a = A("un caldo palido", 35); add(a, a + 7, () => <X.Diagnostico t={t} out={a + 6.6} x={1180} y={200} title="LO QUE ME LLEGÓ" rows={[{ at: a, text: "pálido, sin sabor" }, { at: A("una pechuga seca", a), text: "pechuga de estropajo" }, { at: A("un arroz hecho en grudo", a), text: "arroz hecho engrudo" }]} />); }
  { const a = A("eso es secreto de la casa", 45); add(a, a + 4, () => <Stamp t={t} at={a + 0.3} out={a + 3.8} x={1300} y={420} text="SECRETO DE LA CASA" size={90} />); }
  { const a = A("lo lavas bien en el fregadero", 58); add(a, a + 4, () => <Nota t={t} at={a} out={a + 3.8} x={1500} y={280} lines={["lo lavas...", "hierva y hierva..."]} rot={3} w={460} />); }
  { const a = A("sabe a agua caliente", 62); add(a, a + 4, () => <Pensado t={t} at={a} out={a + 3.8} x={1380} y={320} text="agua caliente con verduras" size={84} />); }
  { const a = A("nadie te enseno el orden", 72); add(a, a + 5, () => <><X.Fondo o={0.45 * e(t, a, a + 0.4) * (1 - e(t, a + 4.4, a + 4.8))} /><X.Cita t={t} at={a} out={a + 4.6} x={960} y={500} text="No eres tú. Nadie te enseñó el orden." size={92} /></>); }

  // ===== promesa: los 7 platos se encienden uno por uno =====
  add(PROM[0] - 0.3, PROM[6] + 3, () => PLATES.map((q, i) => { const p = sc(t, q); return t >= PROM[i] ? <X.PlateLabel key={i} t={t} at={PROM[i]} out={PROM[6] + 2.8} x={p.x} y={p.y} n={i + 1} text={["pollo entero y patitas", "nada de fregadero", "el comal", "la espuma", "fuego y reloj", "verduras en orden", "lo del final"][i]} up={i % 2 ? 250 : 130} /> : null; }));
  { const a = A("ni un peso mas", 95); add(a, a + 3.5, () => <Palomita t={t} at={a} out={a + 3.3} y={240} text="NI UN PESO MÁS" />); }
  { const a = A("te va a sonar al reves", 98); add(a, a + 5, () => <X.Burbujas t={t} out={a + 4.8} items={[{ at: a, x: 1450, y: 260, text: "¡¿Cómo que no?!", rot: 3 }, { at: a + 0.8, x: 520, y: 520, text: "¡Mi mamá así lo hacía!", rot: -4 }]} />); }

  // ===== quién es Chayo =====
  { const a = A("yo soy rosario", 110); add(a, a + 9, () => <LowerThird t={t} at={a} out={a + 8.5} name="DOÑA CHAYO" l2="67 AÑOS · RANCHO DE PÁTZCUARO" l2at={a + 1.5} />); }
  { const a = A("fogon de lena", 118); add(a, a + 4, () => { const f = sc(t, FIRE); return <Tag t={t} at={a} x={f.x} y={f.y} dx={-260} dy={-200} text="FOGÓN DE LEÑA" sub="TODA LA VIDA" col="#ff9a4a" out={a + 3.8} size={50} />; }); }
  { const a = A("era la medicina", 122); add(a, a + 9, () => <X.Orden t={t} at={a} out={a + 8.6} nums={false} steps={[{ label: "gripa", at: A("tenia gripa", a) }, { label: "tristeza", at: A("llegaba triste", a) }, { label: "40 días", at: A("recien aliviada", a) }]} />); }

  // ===== CTA 1: la guía en el mundo, con su página REAL =====
  card(A("las escribi", 140), G1 + 0.5, 1450, 280, "right", "LAS ESCRIBÍ TODAS", "cantidades · tiempos · lo que cuesta");
  { const a = G1; add(a, G1P, () => <X.Card t={t} at={a} out={G1P - 0.2} x={470} y={170} from="left" col="#ff8fbf"><X.H s={54} c="#ff8fbf">LAS 5 OLLAS DE DOÑA CHAYO</X.H><X.H s={40} f={HAND}>cinco libritos</X.H></X.Card>); }
  { const a = G1P, b = A("el link esta", G1P); add(a, b + 0.3, () => <N.PaginaReal t={t} at={a + 0.3} out={b + 0.2} x={1420} y={540} src="pag_l3_17.jpg" pag="LIBRO 3 · PÁG. 17" libro="El Pollo que Rinde" hl={A("el pollo partido en casa", a)} w={520} />); }
  { const a = A("el link esta", G1P); add(a, a + 4.5, () => <X.DescCard t={t} at={a} out={a + 4.3} x={1440} y={760} hl={A("primera linea", a)} />); }

  // ===== la historia =====
  { const a = A("mama cuca", 170); add(a, a + 5, () => <X.FotoVieja t={t} at={a} out={a + 4.6} x={1360} y={460} src="s_abuela" w={700} rot={4} cap="Mamá Cuca" />); }
  { const a = A("ya no ponia", 175); add(a, a + 4, () => <Pensado t={t} at={a} out={a + 3.8} x={1380} y={300} text="esa era la del caldo" size={90} />); }
  { const a = A("como ocho anos", 180); add(a, a + 4, () => <BigNum t={t} at={a} out={a + 3.6} text="8" size={260} x={1500} y={430} col={CH.crema} sub="AÑOS" />); }
  { const a = A("chayito despacito", 185); add(a, a + 5, () => <Nota t={t} at={a} out={a + 4.6} x={1480} y={300} lines={["Chayito, despacito,", "que si la rompes", "se le sale el sabor."]} rot={-3} w={520} />); }
  { const a = A("el caldo tiene su orden", 200); add(a, a + 5, () => <><X.Fondo o={0.45 * e(t, a, a + 0.4) * (1 - e(t, a + 4.4, a + 4.8))} /><X.Cita t={t} at={a} out={a + 4.6} x={960} y={500} text="El caldo tiene su orden, como la misa." who="MAMÁ CUCA" size={96} /></>); }
  { const a = A("una olla de barro grandota", 215); add(a, a + 5, () => <X.CorteOllas t={t} at={a} out={a + 4.8} x={960} y={790} n={1} badAt={1e9} />); }
  { const a = A("la ollita delgada", 225); add(a, a + 6, () => <><X.Fondo o={0.4 * e(t, a - 2, a - 1.6) * (1 - e(t, a + 5, a + 5.4))} /><X.CorteOllas t={t} at={a - 2} out={a + 5.6} x={960} y={540} n={3} badAt={a} /></>); }

  // ===== 1 · pollo entero + patitas =====
  { const a = A("pura pechuga", SECRETO[0]); add(a, a + 5, () => <Pill t={t} at={a} out={a + 4.6} x={1400} y={260} text="PURA PECHUGA" />); }
  { const a = A("salen del hueso", SECRETO[0]); add(a, a + 5, () => <X.Orden t={t} at={a} out={a + 4.8} nums={false} steps={[{ label: "hueso", at: a }, { label: "pellejo", at: A("del pellejo", a) }, { label: "patas", at: A("de las patas", a) }]} />); }
  { const a = A("le pides a la polleria", SECRETO[0]); add(a, a + 9, () => <X.Card t={t} at={a} out={a + 8.6} x={1440} y={330} from="right"><X.H s={50} c={CH.maiz}>EN LA POLLERÍA</X.H><X.H s={42} f={HAND}>1 pollo de 2 kg, en piezas</X.H><X.H s={42} f={HAND}>con huacal y alas</X.H><X.H s={42} f={HAND}>+ ½ kg de patitas</X.H></X.Card>); }
  { const a = A("pura gelatina", SECRETO[0]); add(a, a + 9, () => <N.Gelatina t={t} at={a} out={a + 8.6} x={1450} y={430} hitAt={A("se cuaje como gelatina", a)} label="así se cuaja un caldo de a de veras" />); }
  { const a = A("si consigues gallina", SECRETO[0]); add(a, a + 7, () => <X.Card t={t} at={a} out={a + 6.6} x={470} y={260} from="left"><X.H s={52} c={CH.maiz}>GALLINA = MÁS SABOR</X.H><X.H s={42} f={HAND}>una hora más de olla</X.H></X.Card>); }
  { const a = A("la molleja y el corazon", SECRETO[0]); add(a, a + 4.5, () => { const p = sc(t, CZ); return <Tag t={t} at={a} x={p.x} y={p.y} dx={320} dy={-200} text="MOLLEJA Y CORAZÓN" sub="EL SABOR HONDO" col={CH.maiz} out={a + 4.2} size={48} />; }); }

  // ===== 2 · no se lava + agua fría =====
  { const a = A("no se lava en el fregadero", SECRETO[1]); add(a, a + 4, () => <Stamp t={t} at={a + 0.2} out={a + 3.8} x={1320} y={380} text="NO SE LAVA" size={110} />); }
  { const a = A("el agua salpica", SECRETO[1]); add(a, a + 9, () => <N.Salpica t={t} at={a} out={a + 8.6} x={960} y={540} />); }
  { const a = A("nomas lo reparte", SECRETO[1]); add(a, a + 4, () => <Pensado t={t} at={a} out={a + 3.8} x={1300} y={300} text="no lo limpia: lo reparte" size={84} />); }
  { const a = A("es el hervor", SECRETO[1]); add(a, a + 5, () => <Palomita t={t} at={a} out={a + 4.8} y={240} text="LO LIMPIA EL HERVOR" />); }
  { const a = A("te lavas las manos con jabon", SECRETO[1]); add(a, a + 9, () => <X.Tarea t={t} at={a} out={a + 8.6} x={1360} y={460} rows={[{ at: a, text: "manos con jabón" }, { at: A("y la tabla tambien", a), text: "la tabla también" }, { at: A("nomas pal pollo crudo", a) , text: "tabla sólo pa'l pollo" }]} />); }
  { const a = A("agua fria no caliente", SECRETO[1]); add(a, a + 9, () => <X.Card t={t} at={a} out={a + 8.6} x={1440} y={300} from="right"><X.H s={56} c="#8fd6ff">AGUA FRÍA</X.H><X.H s={42} f={HAND}>4 litros · 1 cucharada de sal</X.H></X.Card>); }
  { const a = A("la carne se cierra de golpe", SECRETO[1]); add(a, a + 4, () => <Pill t={t} at={a} out={a + 3.8} x={1400} y={620} text="AGUA HIRVIENDO" />); }

  // ===== 3 · el comal (el secreto de la abuela) =====
  { const a = A("el que las fondas no te dicen", SECRETO[2]); add(a, a + 4, () => <Stamp t={t} at={a + 0.2} out={a + 3.8} x={1320} y={300} text="EL DE MI ABUELA" size={96} col={CH.maiz} />); }
  { const a = A("va al comal", SECRETO[2]); add(a, a + 10, () => { const p = sc(t, COMAL); return <><Tag t={t} at={A("media cebolla blanca", a)} x={p.x + 40} y={p.y} dx={300} dy={-210} text="½ CEBOLLA" col={CH.crema} out={a + 9.6} size={46} /><Tag t={t} at={A("tres dientes de ajo", a)} x={p.x - 30} y={p.y + 10} dx={-320} dy={-170} text="3 AJOS CON CÁSCARA" col={CH.crema} out={a + 9.6} size={42} /><Tag t={t} at={A("un jitomate entero", a)} x={p.x - 60} y={p.y - 10} dx={-300} dy={150} text="1 JITOMATE" col="#ff7a5c" out={a + 9.6} size={44} /></>; }); }
  { const a = A("sin aceite sin nada", SECRETO[2]); add(a, a + 3.5, () => <Pill t={t} at={a} out={a + 3.3} x={1400} y={820} text="ACEITE" />); }
  { const a = A("negros mija no doraditos", SECRETO[2]); add(a, a + 5, () => <X.Versus t={t} at={a} out={a + 4.8} x={960} y={620} a="DORADITO" b="NEGRO" rows={[["sabe a cebolla cruda", true, false], ["sabe a casa, a domingo", false, true]]} />); }
  { const a = A("unos 10 minutos", SECRETO[2]); add(a, a + 4, () => <X.Cronometro t={t} at={a} out={a + 3.8} x={1500} y={420} mins={10} label="VOLTEANDO" size={260} />); }
  { const a = A("un olor dulce", SECRETO[2]); add(a, a + 4, () => <Aroma t={t} at={a} out={a + 3.8} x={sc(t, COMAL).x} y={sc(t, COMAL).y - 50} />); }
  { const a = A("el azucar de la cebolla", SECRETO[2]); add(a, a + 6, () => <X.Card t={t} at={a} out={a + 5.6} x={1440} y={300} from="right"><X.H s={50} c={CH.maiz}>EL AZÚCAR SE TATEMA</X.H><X.H s={42} f={HAND}>como cuando se tuesta un pan</X.H></X.Card>); }
  { const a = A("ese negrito no amarga", SECRETO[2]); add(a, a + 4, () => <Palomita t={t} at={a} out={a + 3.8} y={240} text="EL NEGRITO NO AMARGA" />); }
  { const a = A("como de te", SECRETO[2]); add(a, a + 4.5, () => <N.DosTazas t={t} at={a - 0.4} out={a + 4.2} x={960} y={700} goodAt={a + 0.3} />); }
  { const a = A("es el comal", SECRETO[2] + 50); add(a, a + 3.5, () => <BigNum t={t} at={a} out={a + 3.3} text="EL COMAL" size={170} y={480} col={CH.maiz} edge="#5a2a10" />); }

  // ===== 4 · la espuma =====
  { const a = A("una espuma gris", SECRETO[3]); add(a, a + 5, () => { const p = sc(t, CZ); return <Tag t={t} at={a} x={p.x} y={p.y} dx={330} dy={-200} text="ESPUMA GRIS" sub="NO ES GRASA" col="#c9c2b6" out={a + 4.6} size={52} />; }); }
  { const a = A("es la proteina del pollo", SECRETO[3]); add(a, a + 5, () => <X.Card t={t} at={a} out={a + 4.6} x={1440} y={300} from="right"><X.H s={50} c={CH.maiz}>PROTEÍNA CUAJADA</X.H><X.H s={42} f={HAND}>no hace daño... pero enturbia</X.H></X.Card>); }
  { const a = A("10 minutos de estar ahi", SECRETO[3]); add(a, a + 4, () => <X.Cronometro t={t} at={a} out={a + 3.8} x={1500} y={420} mins={10} label="CON LA JÍCARA" size={250} />); }
  { const a = A("una jicara junto al fogon", SECRETO[3]); add(a, a + 4, () => { const f = sc(t, FIRE); return <Tag t={t} at={a} x={f.x} y={f.y} dx={-260} dy={-200} text="LA JÍCARA" sub="NOMÁS PA' ESO" col={CH.maiz} out={a + 3.8} size={50} />; }); }
  { const a = A("ahora si le echas", SECRETO[3]); add(a, a + 7, () => <X.Orden t={t} at={a} out={a + 6.6} nums={false} steps={[{ label: "sin espuma", at: a }, { label: "lo tatemado", at: A("la cebolla el ajo", a) }, { label: "hierbabuena", at: A("una ramita de hierbabuena", a) }]} />); }

  // ===== CTA 2: la semana de un pollo, con la página del menú =====
  { const a = G2; add(a, G2P, () => <X.Card t={t} at={a} out={G2P - 0.2} x={470} y={170} from="left" col="#ff8fbf"><X.H s={50} c="#ff8fbf">LA COMIDA DE TODA LA SEMANA</X.H></X.Card>); }
  { const a = G2P; add(a, a + 7, () => <X.Orden t={t} at={a} out={a + 6.6} nums={false} steps={[{ label: "lunes · caldo", at: a }, { label: "martes · tinga", at: A("el martes tinga", a) }, { label: "miércoles · enchiladas", at: A("el miercoles enchiladas", a) }]} />); }
  { const a = A("con un solo pollo entero", G2P); add(a, A("el link esta", a) + 0.3, () => <N.PaginaReal t={t} at={a} out={A("el link esta", a) + 0.1} x={1450} y={560} src="pag_l3_13.jpg" pag="LIBRO 3 · PÁG. 13" libro="El menú de la semana" hl={a + 0.6} w={480} rot={3} />); }
  { const a = A("el link esta", G2P); add(a, a + 4.5, () => <X.DescCard t={t} at={a} out={a + 4.3} x={1440} y={760} hl={A("primera linea", a)} />); }

  // ===== 5 · fuego bajito + reloj de la pechuga =====
  { const a = A("a borbotones", SECRETO[4]); add(a, a + 6, () => <N.Hervor t={t} at={a} out={a + 5.6} x={1450} y={460} fuerte={1} label="A BORBOTONES = TURBIO" />); }
  { const a = A("a ver la novela", SECRETO[4]); add(a, a + 3.5, () => <Pensado t={t} at={a} out={a + 3.3} x={560} y={860} text="...y se va a ver la novela" size={76} />); }
  { const a = A("no mas tiemble", SECRETO[4]); add(a, a + 7, () => <N.Hervor t={t} at={a} out={a + 6.6} x={1450} y={460} fuerte={0.12} label="QUE NOMÁS TIEMBLE" />); }
  { const a = A("la pechuga no se queda", SECRETO[4]); add(a, a + 9, () => <X.Cronometro t={t} at={A("25 minutos", a)} out={a + 8.6} x={1500} y={420} mins={25} label="Y LA PECHUGA, AFUERA" size={280} dur={2.4} />); }
  { const a = A("una hora mas", SECRETO[4] + 30); add(a, a + 5, () => <X.Carnes t={t} out={a + 4.8} x={1300} y={240} rows={[{ at: a - 2.5, n: "piernas y muslos", s: "+1 h" }, { at: a - 1.8, n: "alas y huacal", s: "+1 h" }, { at: a - 1.2, n: "patitas", s: "+1 h" }]} />); }
  { const a = A("con dos tenedores", SECRETO[4]); add(a, a + 4, () => <Palomita t={t} at={a + 1} out={a + 3.8} y={240} text="JUGOSA, SUAVECITA" />); }
  { const a = A("de la tetera nunca fria", SECRETO[4]); add(a, a + 5, () => <><Palomita t={t} at={a} out={a + 4.8} y={240} text="AGUA CALIENTE DE LA TETERA" /><Pill t={t} at={a + 1} out={a + 4.8} x={1400} y={620} text="AGUA FRÍA" /></>); }
  { const a = A("la olla de presion", SECRETO[4]); add(a, a + 12, () => <X.Senales t={t} out={a + 11.6} x={1250} y={240} title="OLLA DE PRESIÓN" rows={[{ at: A("20 minutos despues", a), text: "20 min desde que suena" }, { at: A("quitale la espuma antes", a), text: "la espuma antes de tapar" }, { at: A("dos terceras partes", a), text: "llena hasta 2/3" }]} />); }

  // ===== 6 · las verduras en orden + arroz aparte =====
  { const a = A("hecha a tole", SECRETO[5]); add(a, a + 5, () => <N.VerdurasOrden t={t} at={a - 1.5} out={a + 4.6} x={960} y={620} rows={[{ at: a - 1.4, label: "TODO JUNTO", min: 30, c: "#c9c2b6" }]} bad={a} />); }
  { const a = A("primero el elote", SECRETO[5]); add(a, a + 22, () => <N.VerdurasOrden t={t} at={a} out={a + 21.5} x={960} y={600} rows={[
    { at: a + 0.2, label: "ELOTE", min: 30, c: CH.maiz }, { at: A("y la zanahoria", a), label: "ZANAHORIA", min: 28, c: "#f08a3a" },
    { at: A("la papa y el chayote", a), label: "PAPA · CHAYOTE", min: 15, c: "#e8d9a8" }, { at: A("la calabacita y el ejote", a), label: "CALABACITA · EJOTE", min: 8, c: "#8fbf4a" }]} />); }
  { const a = A("grandes mija pedazos grandes", SECRETO[5]); add(a, a + 3.5, () => <Palomita t={t} at={a} out={a + 3.3} y={240} text="PEDAZOS GRANDES" />); }
  { const a = A("y el arroz no va a la olla", SECRETO[5]); add(a, a + 4, () => <Stamp t={t} at={a + 0.2} out={a + 3.8} x={1320} y={380} text="EL ARROZ, APARTE" size={96} />); }
  { const a = A("una cucharada en el plato", SECRETO[5]); add(a, a + 5, () => <X.Orden t={t} at={a} out={a + 4.8} nums={false} steps={[{ label: "arroz en el plato", at: a }, { label: "encima, el caldo", at: A("y encima el caldo", a) }]} />); }

  // ===== 7 · lo del final + la mesa =====
  { const a = A("cuando apagas la lumbre", SECRETO[6]); add(a, a + 10, () => <X.Card t={t} at={a} out={a + 9.6} x={1440} y={300} from="right"><X.H s={50} c={CH.maiz}>AL APAGAR</X.H><X.H s={42} f={HAND}>un puñito de cilantro con tallo</X.H><X.H s={42} f={HAND}>+ una ramita de hierbabuena</X.H></X.Card>); }
  { const a = A("lo dejas reposar 10 minutos", SECRETO[6]); add(a, a + 4, () => <X.Cronometro t={t} at={a} out={a + 3.8} x={480} y={420} mins={10} label="TAPADO, REPOSANDO" size={240} />); }
  { const a = A("se despiertan con el calor", SECRETO[6]); add(a, a + 4, () => <Aroma t={t} at={a} out={a + 3.8} x={sc(t, CZ).x} y={sc(t, CZ).y - 60} />); }
  { const a = A("en platitos", SECRETO[6]); add(a, a + 10, () => <N.Platitos t={t} out={a + 9.6} y={760} rows={[
    { at: A("cebolla picada", a), label: "CEBOLLA", c: "#efe6d6" }, { at: A("cilantro", a + 1), label: "CILANTRO", c: "#5f9a3a" }, { at: A("chile serrano", a), label: "SERRANO", c: "#3f7a2a" },
    { at: A("limones partidos", a), label: "LIMÓN", c: "#a8d24a" }, { at: A("un chile chipolte", a), label: "CHILE FRITO", c: "#7a1f10" }]} />); }
  { const a = A("como fiesta sin musica", SECRETO[6]); add(a, a + 4.5, () => <><X.Fondo o={0.4 * e(t, a - 1, a - 0.6) * (1 - e(t, a + 3.8, a + 4.2))} /><X.Cita t={t} at={a - 1.4} out={a + 4} x={960} y={500} text="Caldo sin limón es como fiesta sin música." size={88} /></>); }

  // ===== variantes =====
  { const a = A("cuatro cosas mas", 726); add(a, a + 4, () => <BigNum t={t} at={a} out={a + 3.6} text="+4" size={240} x={1460} y={460} col={CH.maiz} edge="#5a2a10" sub="CON EL MISMO CALDO" />); }
  card(A("el caldo tlalpeno", 728), A("el caldo tlalpeno", 728) + 7, 1440, 300, "right", "1 · TLALPEÑO", "garbanzo + chipotle en adobo");
  card(A("el caldo para el enfermo", 745), A("el caldo para el enfermo", 745) + 8, 1440, 300, "right", "2 · PA'L ENFERMO", "alas, patitas, zanahoria y arroz");
  { const a = A("mi totero otra vez", 750); add(a, a + 3.5, () => <Pensado t={t} at={a} out={a + 3.3} x={1380} y={300} text="¡ya anda de mitotero!" size={84} />); }
  card(A("la sopa de fideo", 770), A("la sopa de fideo", 770) + 7, 1440, 300, "right", "3 · SOPA DE FIDEO", "con el caldo que sobró");
  card(A("lo que sobra del pollo", 780), A("lo que sobra del pollo", 780) + 8, 1440, 300, "right", "4 · TINGA O FLAUTAS", "con la carne que quedó");
  { const a = A("domingo lunes y martes", 785); add(a, a + 5, () => <X.Orden t={t} at={a - 0.2} out={a + 4.8} nums={false} steps={[{ label: "domingo", at: a }, { label: "lunes", at: a + 0.5 }, { label: "y martes", at: a + 1.0 }]} />); }

  // ===== lo que puede salir mal =====
  add(A("si tu caldo salio turbio", 797), A("no es que no sepas", 800), () => <X.FixCard t={t} at={A("si tu caldo salio turbio", 797)} out={A("no es que no sepas", 800) - 0.2} x={960} y={860} prob="TURBIO" fix={["fuego bajito", "cuchara en mano"]} fixAt={A("la proxima vez", 800)} />);
  add(A("si la pechuga quedo seca", 812), A("si el caldo quedo sin cuerpo", 812), () => <X.FixCard t={t} at={A("si la pechuga quedo seca", 812)} out={A("si el caldo quedo sin cuerpo", 812) - 0.2} x={960} y={860} prob="PECHUGA SECA" fix={["25 minutos y afuera"]} fixAt={A("25 minutos y afuera", 812)} />);
  add(A("si el caldo quedo sin cuerpo", 812), A("si te quedo muy grasoso", 812), () => <X.FixCard t={t} at={A("si el caldo quedo sin cuerpo", 812)} out={A("si te quedo muy grasoso", 812) - 0.2} x={960} y={860} prob="SIN CUERPO" fix={["patitas", "pollo entero"]} fixAt={A("le faltaron las patitas", 812)} />);
  add(A("si te quedo muy grasoso", 812), A("y si te quedo sin chiste", 812), () => <X.Refri t={t} at={A("si te quedo muy grasoso", 812)} out={A("y si te quedo sin chiste", 812) - 0.2} x={1440} y={420} inAt={A("mételo al refrigerador", 812)} />);
  add(A("y si te quedo sin chiste", 812), A("y eso si mija", 840), () => <X.FixCard t={t} at={A("y si te quedo sin chiste", 812)} out={A("y eso si mija", 840) - 0.2} x={960} y={860} prob="SIN CHISTE" fix={["sal", "limón", "espera un minuto"]} fixAt={A("le falta sal", 830)} />);
  { const a = A("en menos de dos horas", 845); add(a, a + 6, () => <X.Card t={t} at={a} out={a + 5.6} x={1440} y={300} from="right"><X.H s={50} c={CH.maiz}>MENOS DE 2 HORAS</X.H><X.H s={42} f={HAND}>recipientes chiquitos, al refri</X.H></X.Card>); }
  { const a = A("tres o cuatro dias", 850); add(a, a + 4, () => <Palomita t={t} at={a} out={a + 3.8} y={240} text="3 A 4 DÍAS" />); }

  // ===== la cuenta =====
  { const a = A("hagamos la cuenta", 861); add(a, a + 3.5, () => <BigNum t={t} at={a} out={a + 3.3} text="LA CUENTA" size={170} y={500} col={CH.maiz} edge="#5a2a10" sub="EN EL RANCHO TODO SE CUENTA" />); }
  add(A("en la fonda", 864), A("todo junto unos", 870) + 4, () => <Receipt t={t} rows={[
    { at: A("un pollo entero de 2 kilos", 864), item: "pollo 2 kg", $: 150 }, { at: A("el medio kilo de patitas", 864), item: "patitas", $: 20 }, { at: A("las verduras el arroz", 864), item: "verduras y más", $: 90 }]}
    totalAt={A("todo junto unos", 870)} x={120} y={130} out={A("todo junto unos", 870) + 3.8} sc={1.12} title="LA OLLA · 6 GENTES" />);
  { const a = A("120 pesos un plato", 862); add(a, a + 4, () => <Precio t={t} at={a} out={a + 3.8} x={1400} y={140} top="$120" sub="UN PLATO EN LA FONDA" />); }
  { const a = A("comen seis personas", 876); add(a, a + 5, () => <X.Gente t={t} at={a} out={a + 4.8} x={1350} y={360} n={6} label="gentes" cols={6} />); }
  { const a = A("como 40 pesos", 880); add(a, a + 5, () => <X.Cifra t={t} at={a} out={a + 4.8} x={1400} y={420} to={40} post=" el plato" size={150} />); }
  { const a = A("en tu casa comen tres", 885); add(a, a + 5, () => <X.Card t={t} at={a} out={a + 4.8} x={470} y={300} from="left"><X.H s={50} c={CH.maiz}>1 PLATO DE FONDA</X.H><X.H s={44} f={HAND}>= 3 en tu casa</X.H></X.Card>); }
  { const a = A("porque tu no tienes prisa", 890); add(a, a + 4, () => <Palomita t={t} at={a} out={a + 3.8} y={240} text="Y SABE MEJOR" />); }

  // ===== resumen, tarea, comentarios, cierre =====
  add(RES[0] - 0.3, RES[6] + 4, () => PLATES.map((q, i) => { const p = sc(t, q); return t >= RES[i] ? <X.PlateLabel key={i} t={t} at={RES[i]} out={RES[6] + 3.8} x={p.x} y={p.y} n={i + 1} text={["entero + patitas", "sin lavar, agua fría", "cebolla al comal", "fuera la espuma", "bajito · pechuga 25'", "verduras en orden", "cilantro y limón"][i]} up={i % 2 ? 250 : 130} /> : null; }));
  { const a = A("no hagas los 7", 937); add(a, a + 12, () => <X.Tarea t={t} at={a} out={a + 11.6} x={1360} y={500} rows={[{ at: A("ponle sus patitas", a), text: "sus patitas al caldo" }, { at: A("y saca la pechuga", a), text: "la pechuga a los 25 minutos" }]} />); }
  { const a = A("cuentame aqui abajo", 950); add(a, a + 11, () => <X.Encuesta t={t} at={a} out={a + 10.6} x={1340} y={440} q="¿HIERBABUENA O CILANTRO?" a="hierbabuena" b="cilantro" pa={-1} />); }
  { const a = A("con mi cafecito de olla", 958); add(a, a + 3.5, () => <Pensado t={t} at={a} out={a + 3.3} x={560} y={860} text="los leo todos" size={80} />); }
  { const a = A("el link esta", 964); add(a, a + 4.5, () => <X.DescCard t={t} at={a} out={a + 4.3} x={1440} y={760} hl={A("primera linea", a)} />); }
  { const a = A("ve a tatemar tu cebolla", 966); add(a, END_T, () => <X.Cita t={t} at={a} out={END_T - 0.8} x={960} y={300} text="Ve a tatemar tu cebolla." size={96} />); }
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
      // mundo → foto mirando la olla: la foto se abre como portal desde la olla
      if (nx?.c && Math.abs(nx.a - p.b) < 1e-6 && /^(caz|pl)/.test(p.k1 ?? "")) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, CZ); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} z={nx.z} /></Portal>); }
      }
    }
  }
  L.push(...Ov(t));
  // vapor en cada costura entre planos (salvo mundo→mundo, que es la misma cámara que sigue, y los portales)
  PARTS.forEach((p, i) => {
    const nx = PARTS[i + 1]; if (!nx || Math.abs(nx.a - p.b) > 1e-6 || Math.abs(t - p.b) >= 0.4) return;
    if (!p.c && !nx.c) return;
    if (!p.c && nx.c && /^(caz|pl)/.test(p.k1 ?? "")) return;
    L.push(<SteamWipe key={"sw" + i} t={t} mid={p.b} w={0.38} />);
  });
  SECRETO.forEach((a, i) => { if (Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.45} w={0.3} />); });
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
