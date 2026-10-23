// rocenas · "25 Cenas Olvidadas para Cuando Comes Solo y No Hay Dinero" (Abuela Rosa). UN mundo y UNA cámara: la cocina de Rosa
// de noche (mesa con mantel de encaje, la silla de Antonio con su chaleco gris, la estufa negra de 4 hornallas, la alacena, la ventana).
// El recetario gigante pasa una hoja por cena: el número rojo, y la cena SALE DE LA PÁGINA y vuela al plato; las monedas se apilan
// (de a 10 centavos) con lo que cuesta. Entre mundo y toma real sólo portales y vapor; el avatar entra en sus ventanas.
// Cada pieza nace con la palabra que la nombra (at("frase")). Las 25 cenas se arman solas desde la tabla DIN.
import React from "react";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, Dish, Page, screenOf, camSpeed, setKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, Flash, HAND, P, Portal, SERIF, Tag, Thermo, at, e, ei, s, LowerThird } from "./lib";
import { SteamWipe, Aroma, Nota, Pensado, Palomita, Stamp, Precio, Pill } from "./ui";
import * as X from "./piezas";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = (AVW as { win: Win[] }).win;
const inAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
export const END_T = 1514.6; // voz 1513,6 + 1 s de silencio
export const MIN1_END = 66;
const A = (ph: string, after: number) => at(ph, after);
const TA = (ph: string, after: number, fb: number) => { try { return at(ph, after); } catch { return fb; } };

// ---------------- cámaras con nombre ----------------
type Cam = { p: V; l: V; fov?: number };
const C: Record<string, Cam> = {
  wide: { p: [1.9, 1.9, 2.9], l: [-0.2, 0.8, -0.6], fov: 42 }, wide2: { p: [1.45, 1.7, 2.35], l: [-0.4, 0.85, -0.8], fov: 42 },
  wideL: { p: [-1.6, 1.85, 2.5], l: [-0.2, 0.85, -0.9], fov: 42 },
  top: { p: [0, 3.0, 0.7], l: [0, 0.76, -0.12], fov: 42 }, top2: { p: [0.15, 2.7, 0.55], l: [0, 0.76, -0.12], fov: 40 },
  mesa2: { p: [0.2, 1.75, 1.25], l: [-0.1, 0.78, -0.25], fov: 40 },
  libro: { p: [0.95, 1.5, 0.6], l: [0.52, 0.8, -0.12], fov: 36 }, libro2: { p: [0.78, 1.28, 0.32], l: [0.55, 0.8, -0.12], fov: 32 },
  libroT: { p: [0.56, 1.75, 0.22], l: [0.56, 0.78, -0.13], fov: 34 },
  plato: { p: [0.2, 1.48, 0.78], l: [-0.45, 0.8, 0.12], fov: 36 }, plato2: { p: [0.02, 1.26, 0.56], l: [-0.45, 0.8, 0.12], fov: 33 },
  platoL: { p: [-0.95, 1.2, 0.75], l: [-0.35, 0.8, 0.1], fov: 34 },
  silla: { p: [-0.3, 1.4, 0.95], l: [-0.3, 0.8, -0.6], fov: 38 }, silla2: { p: [-0.25, 1.2, 0.55], l: [-0.3, 0.85, -0.85], fov: 34 },
  estufa: { p: [-0.9, 1.5, -0.6], l: [-1.7, 0.95, -2.1], fov: 40 }, estufa2: { p: [-1.2, 1.4, -1.15], l: [-1.65, 0.95, -2.1], fov: 36 },
  alacena: { p: [-1.4, 1.45, 0.3], l: [-2.82, 1.25, -0.6], fov: 40 }, alacena2: { p: [-1.85, 1.38, -0.05], l: [-2.82, 1.2, -0.6], fov: 36 },
  ventana: { p: [0.6, 1.5, -0.6], l: [1.5, 1.6, -2.48], fov: 40 }, ventana2: { p: [0.9, 1.45, -1.2], l: [1.55, 1.45, -2.48], fov: 38 },
};

// ---------------- las 25 cenas ----------------
type Din = { n: number; name: string; c: number; pag: number; sec: string[]; secPh: string; dish: Dish; media: string[]; mem?: [string, string]; ex?: string };
const DIN: Din[] = [
  { n: 25, name: "Pan con tomate y ajo", c: 40, pag: 101, sec: ["el pan, bien crocante:", "es el rallador del ajo"], secPh: "el secreto de rosa", dish: { k: "tabla", c: "#c8402a", g: "#f0e4c4", n: 2 }, media: ["c_tomate", "d_25", "r_padre"], mem: ["mi padre cenaba", "la cena de los reyes"] },
  { n: 24, name: "Tortilla francesa con queso", c: 60, pag: 60, sec: ["fuego MEDIO,", "nunca fuerte"], secPh: "fuego medio", dish: { k: "plato", c: "#f2d04a", n: 1 }, media: ["c_tortilla", "d_24"], ex: "fuego" },
  { n: 23, name: "Panqueques de harina y agua", c: 30, pag: 70, sec: ["la masa descansa", "10 minutos"], secPh: "lo dejas descansar", dish: { k: "plato", c: "#e8c27a", n: 5 }, media: ["c_panqueque", "d_23", "r_ninos"], mem: ["en las noches de fin de mes", "creíamos que era fiesta"], ex: "crono10" },
  { n: 22, name: "Gachas saladas de avena", c: 50, pag: 28, sec: ["¿muy espesa?", "un chorrito de agua caliente"], secPh: "si te queda demasiado espesa", dish: { k: "bowl", c: "#d9c08a", g: "#f2c14e" }, media: ["c_avena", "d_22", "r_abuelo"], mem: ["mi abuelo se la comia", "despacito, en silencio"] },
  { n: 21, name: "Quesadillas de lo que quedó", c: 70, pag: 123, sec: ["queso abajo", "y queso arriba"], secPh: "queso abajo", dish: { k: "plato", c: "#e0a84a", g: "#7a3a1a", n: 4 }, media: ["d_21", "r_sobras"], mem: ["nada de lo que sobra", "todo es la cena de mañana"] },
  { n: 20, name: "Espaguetis con ajo y aceite", c: 50, pag: 77, sec: ["el ajo, sólo", "dorado clarito"], secPh: "el ajo solo hasta", dish: { k: "plato", c: "#e8d08a", g: "#3a7a2a", n: 3 }, media: ["c_ajo", "d_20"], ex: "ajo" },
  { n: 19, name: "Molletes", c: 70, pag: 99, sec: ["el pan duro", "es mejor que el fresco"], secPh: "el pan duro es mejor", dish: { k: "tabla", c: "#e8b04a", g: "#c8402a", n: 2 }, media: ["d_19", "r_lluvia"], mem: ["noches de lluvia", "la radio encendida"] },
  { n: 18, name: "Sopa de tomate con pan tostado", c: 70, pag: 133, sec: ["una pizca de azúcar:", "adiós a la acidez"], secPh: "esa pizca de azucar", dish: { k: "bowl", c: "#c8402a", g: "#e8c27a" }, media: ["r_tomates", "d_18", "r_frascos"], mem: ["la puedes congelar", "cena para varias noches"] },
  { n: 17, name: "Tortitas de arroz de ayer", c: 50, pag: 113, sec: ["no las toques:", "3 minutos + 3 minutos"], secPh: "no las muevas", dish: { k: "plato", c: "#e0b060", g: "#3a7a2a", n: 3 }, media: ["c_arroz", "d_17"], ex: "nomuevas" },
  { n: 16, name: "Mazamorra de maíz con leche", c: 50, pag: 74, sec: ["la fécula, primero", "en leche FRÍA"], secPh: "la fecula siempre", dish: { k: "bowl", c: "#f2e6c0", g: "#8a5a32" }, media: ["c_mazamorra", "d_16"], ex: "fria" },
  { n: 15, name: "Huevo al plato con tomate", c: 70, pag: 65, sec: ["el barro termina", "el huevo en la mesa"], secPh: "el barro guarda", dish: { k: "cazuela", c: "#c8402a", g: "#f6e7c8", n: 2 }, media: ["c_cazuela", "d_15", "r_cazuelita"], mem: ["esa casuelita", "hay cosas que no se jubilan"] },
  { n: 14, name: "Lentejas con arroz y cebolla dorada", c: 70, pag: 86, sec: ["la cebolla: oscura,", "casi crocante"], secPh: "tiene que quedar oscura", dish: { k: "plato", c: "#7a5a30", g: "#3a1a08", n: 3 }, media: ["c_cebolla", "d_14"] },
  { n: 13, name: "Pizza de sartén con pan duro", c: 100, pag: 102, sec: ["fuego bajo", "y tapa"], secPh: "fuego bajo y tapa", dish: { k: "sarten", c: "#c8402a", g: "#f2d04a", n: 3 }, media: ["c_pizza", "d_13", "r_nieto"], mem: ["mi nieto dice", "mejor que la pizzería"] },
  { n: 12, name: "Sopa de arroz con huevo", c: 40, pag: 138, sec: ["templar el huevo", "con un cucharón de caldo"], secPh: "templar el huevo", dish: { k: "bowl", c: "#f2df9a", g: "#3a7a2a" }, media: ["c_templar", "d_12", "r_cama"], mem: ["a la cama en una taza", "con las dos manos"], ex: "templar" },
  { n: 11, name: "Repollo guisado con papa y pimentón", c: 70, pag: 76, sec: ["ajo dorado y pimentón", "AL FINAL"], secPh: "el ajo dorado con pimenton", dish: { k: "plato", c: "#c8a050", g: "#c8402a", n: 4 }, media: ["d_11", "i_invierno"] },
  { n: 10, name: "Gachas de harina con ajo", c: 30, pag: 69, sec: ["el pimentón,", "SIEMPRE fuera del fuego"], secPh: "el pimenton se quema", dish: { k: "bowl", c: "#c06a3a", g: "#e8c27a" }, media: ["c_gachas", "d_10", "r_ajos"], mem: ["yo tenia 8 anos", "vamos a estar bien"], ex: "pimenton" },
  { n: 9, name: "Garbanzos con espinaca", c: 100, pag: 89, sec: ["pan frito machacado:", "espesa la salsa"], secPh: "ese pan frito machacado", dish: { k: "cazuela", c: "#a8502a", g: "#e8c27a", n: 4 }, media: ["d_09", "r_sarten"] },
  { n: 8, name: "Sopa de las cáscaras", c: 30, pag: 139, sec: ["las cáscaras de la semana,", "al congelador"], secPh: "el secreto de rosa", dish: { k: "bowl", c: "#d8a040", g: "#e8d08a" }, media: ["c_cascaras", "d_08", "r_bolsa"], mem: ["la cocina pobre", "la que no tira nada"], ex: "domingo" },
  { n: 7, name: "Arroz a la cubana", c: 90, pag: 71, sec: ["plátano con la cáscara", "casi NEGRA"], secPh: "el platano tiene que estar", dish: { k: "plato", c: "#f6f0e0", g: "#c8402a", n: 3 }, media: ["c_platano", "d_07", "r_platanos"], mem: ["lo feo muchas veces", "es lo más dulce"] },
  { n: 6, name: "Sopa de cebolla con pan y queso", c: 90, pag: 135, sec: ["la cebolla no se apura:", "media hora, fuego bajo"], secPh: "la cebolla no se apura", dish: { k: "bowl", c: "#a86a30", g: "#f2d04a" }, media: ["c_cebsopa", "d_06", "r_abrigo"], mem: ["mi antonio me la pedia", "con frío, del trabajo"], ex: "crono30" },
  { n: 5, name: "Migas con ajo y pimentón", c: 50, pag: 95, sec: ["el pan se humedece", "la noche anterior"], secPh: "humedecer el pan", dish: { k: "plato", c: "#d8a050", g: "#c8402a", n: 5 }, media: ["c_migas", "d_05", "r_pano"] },
  { n: 4, name: "Huevos en salsa de tomate", c: 80, pag: 56, sec: ["sal en la CLARA,", "nunca en la yema"], secPh: "sal a la clara", dish: { k: "sarten", c: "#b83020", g: "#f6e7c8", liq: true, n: 2 }, media: ["c_huevos", "d_04", "r_sarten"], mem: ["comer de la sarten", "un lujo de vivir solo"] },
  { n: 3, name: "Torrejas de pan duro", c: 50, pag: 94, sec: ["cuanto más duro el pan,", "mejor"], secPh: "cuanto mas duro", dish: { k: "plato", c: "#d89a4a", g: "#8a5a32", n: 2 }, media: ["c_torreja", "d_03"] },
  { n: 2, name: "Sopa de ajo con pan y huevo", c: 40, pag: 130, sec: ["el pimentón, con la olla", "fuera del fuego"], secPh: "el secreto es el mismo", dish: { k: "bowl", c: "#c0602a", g: "#f6e7c8" }, media: ["c_sopaajo", "d_02", "h_alacena"], mem: ["lo que habia en mi alacena", "aquella noche de marzo"] },
  { n: 1, name: "Caldo de hueso con fideos", c: 60, pag: 134, sec: ["empieza SIEMPRE", "con agua fría"], secPh: "empieza siempre con agua fria", dish: { k: "bowl", c: "#e0b050", g: "#f2e6c0" }, media: ["c_caldo", "d_01", "r_carniceria", "p_caldo", "r_hueso", "r_olla", "p_bocado"], mem: ["antonio iba los sabados", "orgulloso, como un tesoro"], ex: "fria1" },
];
// la toma LTX cae a su cuadro clave mientras no llegue el mp4
const LIMG: Record<string, string> = { g_sopa: "f_g_sopa" };
DIN.forEach((d) => d.media.forEach((m) => { if (/^[cp]_/.test(m)) LIMG[m] = "f_" + m; }));
const isClip = (k: string) => /^[cpg]_/.test(k);

// arranque de cada cena ("Número 25." ... "Y número uno.")
const D0 = DIN.map((d, i) => d.n === 1 ? A("y numero uno", 1340) : A("numero " + d.n, 160 + i * 40));
DIN.forEach((d, i) => { if (i > 0 && D0[i] <= D0[i - 1]) throw new Error("cena " + d.n + " fuera de orden"); });
const CLOSE = A("asi que eso es todo", 1380);
const DEND = (i: number) => (i + 1 < DIN.length ? D0[i + 1] : CLOSE);

// ---------------- la línea de tiempo: partes de mundo (w) y tomas reales (c) entre las ventanas del avatar ----------------
type Part = { a: number; b: number; c?: string; o?: number; k0?: string; k1?: string; pt?: V; z?: [number, number]; kind?: string; d?: number };
const w = (a: number, b: number, k0: string, k1: string, pt?: V, kind?: string): Part => ({ a, b, k0, k1, pt, kind });
const c = (a: number, b: number, id: string, o = 0, z?: [number, number]): Part => ({ a, b, c: id, o, z });
const HOOK: Part[] = [
  w(4.0, 9.6, "wide", "mesa2"), w(9.6, 13.6, "mesa2", "top"),
  c(19.9, 24.6, "h_silla"), c(24.6, 28.4, "h_pan"), w(28.4, 31.3, "alacena", "alacena2"),
  c(35.7, 41.4, "h_alacena"), w(41.4, 48.4, "libro", "libro2"),
  w(53.8, 59.6, "plato", "plato2"), c(59.6, 64.6, "r_cama"),
  c(68.5, 74.4, "r_bolsa"), w(74.4, 80.6, "silla", "silla2"),
  c(85.6, 91.4, "i_zapatos"), c(91.4, 97.5, "i_invierno"),
  c(101.9, 107.4, "g_sopa"), c(107.4, 112.1, "i_mantel"),
  w(117.6, 124.2, "libro", "libroT"), w(124.2, 131.4, "libroT", "libro2"),
  w(136.2, 143.6, "libro2", "libro"), w(143.6, 147.0, "libro", "wide2"),
  w(151.2, 157.0, "top", "top2"), w(157.0, 163.4, "top2", "libro"),
];
// huecos libres (sin avatar) dentro de [a, b)
const gaps = (a: number, b: number) => {
  const G: [number, number][] = []; let x = a;
  for (const wn of WIN) { if (wn.me <= x) continue; if (wn.ms >= b) break; if (wn.ms > x) G.push([x, wn.ms]); x = Math.max(x, wn.me); }
  if (x < b) G.push([x, b]);
  return G.filter(([p, q]) => q - p > 0.25);
};
// mundos de cada cena: el libro (sale la cena), el plato (monedas), la estufa, la mesa entera, la ventana
const WK: [string, string, V | undefined, string][] = [
  ["libro", "libro2", PT.pagina, "libro"], ["plato", "plato2", PT.plato, "plato"], ["estufa", "estufa2", PT.olla, "estufa"],
  ["wide", "wide2", undefined, "wide"], ["platoL", "plato", PT.plato, "plato2"], ["ventana", "ventana2", PT.ventana, "ventana"], ["silla", "silla2", undefined, "silla"],
];
const DINPARTS: Part[] = [];
DIN.forEach((d, i) => {
  const beats: [number, number][] = [];
  gaps(D0[i], DEND(i)).forEach(([p, q]) => {
    const L = q - p, k = L < 5.5 ? 1 : L < 13 ? 2 : 3;
    for (let j = 0; j < k; j++) beats.push([p + (L * j) / k, p + (L * (j + 1)) / k]);
  });
  let wi = 0, mi = 0;
  const used = new Map<string, number>();
  beats.forEach(([p, q], j) => {
    const world = j % 2 === 0 || mi >= d.media.length + (d.media.some(isClip) ? 1 : 0);
    if (world) {
      const [k0, k1, pt, kind] = WK[Math.min(wi, WK.length - 1) === wi ? wi : 3 + (wi % 4)];
      DINPARTS.push({ ...w(p, q, k0, k1, pt, kind), d: i }); wi++;
    } else {
      // tomas en orden; cuando se acaban, la primera toma LTX otra vez más adelante
      let id = d.media[mi] ?? d.media.find(isClip) ?? d.media[0];
      const o = used.get(id) ?? 0;
      DINPARTS.push({ ...c(p, q, id, isClip(id) ? o : 0), d: i });
      used.set(id, o + (q - p)); mi++;
    }
  });
});
// cierre: frascos, cáscaras, recetario, comentarios, la mesa para uno con su vela
const CL = (ph: string, fb: number) => TA(ph, CLOSE, fb);
const T_DOS = CL("te pido dos cosas", CLOSE + 8), T_OLLA = CL("pon una olla de caldo", CLOSE + 11), T_CASC = CL("guarda las cascaras", CLOSE + 20);
const T_REC = CL("todas las cenas de hoy", CLOSE + 30), T_LINK = CL("el enlace esta en la primera", CLOSE + 40), T_COM = CL("cuentame tu", CLOSE + 45);
const T_SUS = CL("suscribete", CLOSE + 60), T_MANTEL = CL("pon el mantel", CLOSE + 80);
const CLOSEPARTS: Part[] = [];
{
  const media = ["z_frascos", "r_bolsa", "z_mesa1"];
  const plan: (string | [string, string, V?])[] = [["wide", "top"], "z_frascos", ["estufa", "estufa2", PT.olla], "r_bolsa", ["libro", "libroT"], ["libroT", "libro2"], ["top", "top2"], ["wide2", "wide"], ["silla", "silla2"], ["plato", "plato2"], "z_mesa1", ["wide2", "wide"]];
  let j = 0;
  gaps(CLOSE, END_T).forEach(([p, q]) => {
    const L = q - p, k = L < 5.5 ? 1 : 2;
    for (let z = 0; z < k; z++) {
      const a = p + (L * z) / k, b = p + (L * (z + 1)) / k, it = plan[Math.min(j, plan.length - 1)];
      CLOSEPARTS.push(typeof it === "string" ? c(a, b, it) : w(a, b, it[0], it[1], it[2]));
      j++;
    }
  });
  void media;
}
const PARTS: Part[] = [...HOOK, ...DINPARTS, ...CLOSEPARTS];
// llaves de cámara: inicio y fin de cada parte de mundo (los saltos caen siempre dentro de una toma, del avatar o del vapor)
setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
  const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
  const k0 = C[p.k0!], k1 = C[p.k1!];
  return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
}));
const partAt = (t: number) => PARTS.find((p) => t >= p.a && t < p.b);

// ---------------- recetario: tapa + una hoja por cena + la última ----------------
const cts = (x: number) => (x >= 100 ? "un dólar" : "unos " + x + " centavos");
const PAGES: Page[] = [
  { l: ["# El Gran", "# Recetario", "de la Abuela Rosa", "", "cenas para uno", "con casi nada"], r: ["", "\"Rosa, con esto", "se hace una cena.\"", "", "— mamá"] },
  ...DIN.map((d) => ({ l: ["## " + d.n, "# " + d.name], r: ["para uno", "pág. " + d.pag, cts(d.c), "", "el secreto:", ...d.sec] })),
  { l: ["# Esta noche", "# pon el mantel", "", "aunque sea", "para uno"], r: ["", "te lo mereces", "", "— Rosa"] },
];
// el tiempo en que la cena sale de la página (primer mundo-libro de cada cena) y la hoja que pasa
const BOOKP = DIN.map((_, i) => DINPARTS.find((p) => p.d === i && p.kind === "libro"));
const FLIP = DIN.map((_, i) => (BOOKP[i] ? BOOKP[i]!.a + 0.2 : D0[i]));
const FLY = DIN.map((_, i) => (BOOKP[i] ? Math.min(BOOKP[i]!.b - 1.6, BOOKP[i]!.a + 2.6) : D0[i] + 2));
const PLATEP = DIN.map((_, i) => DINPARTS.find((p) => p.d === i && p.kind === "plato"));
const COINS = DIN.map((_, i) => (PLATEP[i] ? PLATEP[i]!.a + 0.6 : DEND(i) - 3));
const dinAt = (t: number) => { let k = -1; for (let i = 0; i < DIN.length; i++) if (t >= D0[i]) k = i; return t >= CLOSE ? -1 : k; };

const worldAt = (t: number): WorldProps => {
  const k0 = partAt(t)?.k0 ?? "wide";
  const i = dinAt(t), d = i >= 0 ? DIN[i] : undefined;
  const flip = t < 160 ? 0 : FLIP.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0) + ei(t, CLOSE + 1, CLOSE + 2);
  const hook = t < 165;
  return {
    t,
    two: t < 101.9 ? 1 : 0,
    dish: d ? d.dish : undefined,
    dishIn: d ? ei(t, FLY[i], FLY[i] + 1.4) : 0,
    dishSteam: d && /^(bowl|cazuela|sarten)$/.test(d.dish.k) ? 0.8 : 0.3,
    coins: hook ? Math.round(5 * win(t, A("50 centavos", 50), A("50 centavos", 50) + 1.2)) * (t < 60 ? 1 : 0) : d ? Math.round((d.c / 10) * ei(t, COINS[i], COINS[i] + 1.4)) : 0,
    book: { open: hook ? ei(t, 41.6, 43.0) : 1, flip, pages: PAGES, cover: "#2f4f7a" },
    gas: k0.startsWith("estufa") ? [1, 0, 1, 0] : [0.6, 0, 0, 0],
    ollaSteam: 1,
    lamp: 1,
    radio: d && d.n === 19 ? 1 : 0,
    dusk: 0,
    alacena: t < 40 ? ei(t, A("abri la alacena", 28), A("abri la alacena", 28) + 1.2) : 0,
    hueso: d && d.n === 1 ? 1 : 0,
    cardigan: 1,
    candle: t > T_MANTEL - 3 ? 1 : 0,
    top: k0.startsWith("top") ? 1 : 0,
  };
};

const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((wn, i) => (
    <Sequence key={i} from={Math.max(0, s(wn.ms) - 10)} durationInFrames={s(wn.me - wn.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= wn.ms - 0.02 && t < wn.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(wn.off) - (s(wn.ms) >= 10 ? 10 : 0))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};
const Clip: React.FC<{ k: string; t: number; a: number; o?: number; z?: [number, number] }> = ({ k, t, a, o = 0, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} startFrom={s(o)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + (LIMG[k] ?? k) + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};

// ---------------- piezas ----------------
// una pieza anclada a una palabra: si la palabra cae en una ventana del avatar, nace al salir de ella; dura hasta `dur` o la próxima ventana
const slot = (a: number, dur = 4.6): [number, number] | null => {
  let x = a; const wn = WIN.find((v) => x >= v.ms && x < v.me); if (wn) x = wn.me + 0.15;
  const nx = WIN.find((v) => v.ms > x);
  const b = Math.min(x + dur, nx ? nx.ms - 0.15 : END_T - 0.5);
  return b - x > 1.4 ? [x, b] : null;
};
const sc = (t: number, q: V) => screenOf(t, q);
const NumTitle: React.FC<{ t: number; at: number; out: number; n: number; name: string }> = ({ t, at: a, out, n, name }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3)), k = Math.min(1.08, 1 - Math.exp(-(t - a) * 7) * Math.cos((t - a) * 11));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 110, top: 760, opacity: o, display: "flex", alignItems: "center", gap: 26 }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 190, color: "#e0402c", lineHeight: 0.9, transform: `scale(${Math.max(0, k)})`, transformOrigin: "50% 60%", textShadow: "0 10px 0 #5a120c, 0 24px 40px rgba(0,0,0,.6)" }}>{n}</div>
    <div style={{ clipPath: `inset(-20% ${100 - 100 * e(t, a + 0.25, a + 0.9)}% -20% 0)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: CH.maiz, textShadow: "0 3px 10px rgba(0,0,0,.9)" }}>CENA Nº {n}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 76, color: CH.crema, lineHeight: 1, textShadow: "0 5px 18px rgba(0,0,0,.95)", maxWidth: 1100 }}>{name}</div>
    </div>
  </div>;
};
const Ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const on = (a: number, b: number) => t >= a - 0.4 && t < b + 0.6;
  const add = (a: number, b: number, f: () => React.ReactNode) => { if (on(a, b)) L.push(<React.Fragment key={"o" + a.toFixed(2) + "_" + L.length}>{f()}</React.Fragment>); };
  const at2 = (ph: string, after: number, dur: number, f: (a: number, b: number) => React.ReactNode) => { const sl = slot(A(ph, after), dur); if (sl) add(sl[0], sl[1], () => f(sl[0], sl[1])); };

  // ===== gancho: la noche de marzo =====
  add(4.0, 9.6, () => <Pill t={t} at={4.2} out={9.4} x={1500} y={190} text="UN MARTES DE MARZO" col="#3a5a8a" />);
  add(9.6, 13.6, () => [["DOS PLATOS", 10.0, [-0.3, 0.78, 0.14]], ["DOS VASOS", 11.1, [-0.05, 0.78, -0.5]], ["DOS SERVILLETAS", 12.2, [0.1, 0.78, 0.18]]].map(([tx, a, q], i) => { const p = sc(t, q as V); return <Tag key={i} t={t} at={a as number} x={p.x} y={p.y} dx={i === 1 ? 240 : -260} dy={-160 - i * 40} text={tx as string} col={CH.crema} out={13.4} size={46} />; }));
  add(19.9, 24.6, () => <Nota t={t} at={20.1} out={24.4} x={1480} y={300} lines={["Su silla vacía."]} rot={-3} w={460} />);
  add(24.6, 28.4, () => <Pensado t={t} at={24.8} out={28.2} x={1300} y={240} text="de pie, junto a la estufa" size={82} />);
  add(28.4, 31.3, () => { const p = sc(t, PT.alacena); return <Tag t={t} at={A("abri la alacena", 28)} x={p.x} y={p.y} dx={300} dy={-170} text="LA ALACENA" sub="PAN DURO · AJO · UN HUEVO" col={CH.maiz} out={31.1} size={52} />; });
  add(35.7, 41.4, () => <><X.Fondo o={0.42 * e(t, 35.8, 36.3) * (1 - e(t, 41.0, 41.4))} /><X.Cita t={t} at={A("rosa con esto", 36)} out={41.2} x={960} y={500} text="Rosa, con esto se hace una cena." who="MI MADRE" size={92} w={1300} /></>);
  add(41.4, 48.4, () => <BigNum t={t} at={A("25 cenas olvidadas", 41) - 0.1} out={48.2} text="25 CENAS OLVIDADAS" size={128} y={200} col={CH.crema} edge="#4a1a0c" sub="PARA UNA SOLA PERSONA" />);
  add(53.8, 59.6, () => <Precio t={t} at={A("50 centavos", 54)} out={59.4} x={1440} y={150} top="−50¢" sub="LA MAYORÍA, EL PLATO" />);
  add(53.8, 59.6, () => <Pill t={t} at={54.0} out={59.4} x={470} y={190} text="NINGUNA PASA DE US$1" col="#2f6a3a" />);
  add(59.6, 64.6, () => <X.Card t={t} at={A("la numero 12", 59) + 0.1} out={64.4} x={1460} y={270} from="right"><X.H s={64} c="#e0402c">Nº 12</X.H><X.H s={48} f={HAND}>la de cuando alguien caía enfermo</X.H></X.Card>);
  add(68.5, 74.4, () => <X.Card t={t} at={68.7} out={74.2} x={1460} y={270} from="right"><X.H s={64} c="#e0402c">Nº 8</X.H><X.H s={48} f={HAND}>con algo que tú tiras a la basura</X.H></X.Card>);
  add(74.4, 80.6, () => { const p = sc(t, PT.silla); return <Tag t={t} at={A("la numero 1", 74)} x={p.x} y={p.y} dx={330} dy={-220} text="Nº 1" sub="PARA EL FINAL" col="#e0402c" out={80.4} size={70} />; });
  add(85.6, 97.5, () => <LowerThird t={t} at={A("soy la abuela rosa", 86)} out={97.3} name="ABUELA ROSA" l2="81 AÑOS · LA MENOR DE 7 HERMANOS" l2at={A("tengo 81", 87)} />);
  add(91.4, 97.5, () => <Pill t={t} at={A("inviernos flacos", 92)} out={97.3} x={1460} y={190} text="INVIERNOS FLACOS" col="#3a5a8a" />);
  add(101.9, 107.4, () => <><X.Fondo o={0.36 * e(t, 102, 102.5) * (1 - e(t, 107.0, 107.4))} /><X.Cita t={t} at={A("una mesa puesta para uno", 103)} out={107.2} x={960} y={480} text="Una mesa puesta para uno no es una mesa triste." size={84} w={1360} /></>);
  add(107.4, 112.1, () => <X.Card t={t} at={A("el plato bueno", 107)} out={111.9} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>TÚ TE MERECES</X.H><X.H s={46} f={HAND}>el plato bueno · el mantel · comida caliente</X.H></X.Card>);
  // CTA dentro del mundo: el recetario se abre en la mesa
  add(117.6, 124.2, () => <Stamp t={t} at={117.8} out={124.0} text="ANTES DE SEGUIR" x={1440} y={200} size={64} col="#e0402c" />);
  add(124.2, 131.4, () => <X.Card t={t} at={A("las escribi todas", 126)} out={131.2} x={1440} y={300} from="right"><X.H s={50} c={CH.maiz}>LAS ESCRIBÍ TODAS</X.H><X.H s={44} f={HAND}>una por página · medidas para uno</X.H><X.H s={44} f={HAND}>lo que cuesta · el secreto</X.H></X.Card>);
  add(136.2, 143.6, () => <X.Card t={t} at={A("es mi recetario", 136)} out={143.4} x={500} y={180} from="left" col="#ff8fbf"><X.H s={50} c="#ff8fbf">EL GRAN RECETARIO</X.H><X.H s={50} c="#ff8fbf">DE LA ABUELA ROSA</X.H></X.Card>);
  add(136.2, 143.6, () => <X.GuiaPag t={t} at={A("el menu de 30 dias", 138)} out={143.4} x={1500} y={820} pag="+ MENÚ DE 30 DÍAS" text="para quien vive solo" />);
  add(143.6, 147.0, () => <X.DescCard t={t} at={A("el enlace esta", 143)} out={146.8} x={1400} y={720} hl={A("primera linea", 143)} />);
  add(151.2, 157.0, () => <X.Card t={t} at={151.4} out={156.8} x={1420} y={300} from="right"><X.H s={50} c={CH.maiz}>LAS 25, CON SUS MEDIDAS</X.H><X.H s={46} f={HAND}>escritas en la descripción</X.H></X.Card>);
  add(157.0, 163.4, () => <BigNum t={t} at={A("vamos a contar para atras", 158)} out={163.2} text="25 → 1" size={200} y={230} col={CH.crema} edge="#4a1a0c" sub="CONTANDO PARA ATRÁS" />);

  // ===== las 25 cenas =====
  DIN.forEach((d, i) => {
    const t0 = D0[i], t1 = DEND(i);
    if (t < t0 - 2 || t > t1 + 2) return;
    const sl = slot(t0 + 0.05, 5.5); if (sl) add(sl[0], sl[1], () => <NumTitle t={t} at={sl[0]} out={sl[1]} n={d.n} name={d.name} />);
    const cph = d.c >= 100 ? "dolar" : "centavos";
    at2(cph, t0, 4.4, (a, b) => <Precio t={t} at={a} out={b} x={1440} y={150} top={d.c >= 100 ? "US$1" : d.c + "¢"} sub="EL PLATO, PARA UNO" />);
    at2("pagina", t0, 4.4, (a, b) => <X.GuiaPag t={t} at={a} out={b} x={1500} y={850} pag={"pág. " + d.pag} text="El Gran Recetario" />);
    const sp = TA(d.secPh, t0, -1);
    if (sp > 0 && sp < t1) { const s2 = slot(sp, 6); if (s2) add(s2[0], s2[1], () => <Nota t={t} at={s2[0]} out={s2[1]} x={1440} y={420} lines={["El secreto de Rosa:", ...d.sec]} rot={-3} w={560} />); }
    if (d.mem) { const mp = TA(d.mem[0], t0, -1); if (mp > 0 && mp < t1) { const s3 = slot(mp, 5); if (s3) add(s3[0], s3[1], () => <Pensado t={t} at={s3[0]} out={s3[1]} x={1260} y={230} text={d.mem![1]} size={80} />); } }
    // la cena aterriza en el plato
    if (BOOKP[i]) add(FLY[i] + 1.3, BOOKP[i]!.b, () => { const p = sc(t, PT.plato); return <Tag t={t} at={FLY[i] + 1.35} x={p.x} y={p.y} dx={-280} dy={-200} text="PARA UNO" sub={d.name.toUpperCase()} col={CH.maiz} out={BOOKP[i]!.b - 0.2} size={44} />; });
    if (PLATEP[i]) add(COINS[i], PLATEP[i]!.b, () => { const p = sc(t, PT.monedas); return <Tag t={t} at={COINS[i] + 1.2} x={p.x} y={p.y} dx={240} dy={-210} text={d.c >= 100 ? "US$1" : d.c + " CENTAVOS"} sub="LO QUE CUESTA" col="#b8d8a0" out={PLATEP[i]!.b - 0.2} size={48} />; });
    // piezas propias de algunas cenas
    const exAt = (ph: string, dur: number, f: (a: number, b: number) => React.ReactNode) => { const x = TA(ph, t0, -1); if (x > 0 && x < t1) { const s4 = slot(x, dur); if (s4) add(s4[0], s4[1], () => f(s4[0], s4[1])); } };
    if (d.ex === "fuego") exAt("fuego medio", 5, (a, b) => <X.FuegoNivel t={t} at={a} out={b} x={420} y={520} lvl={2} label="MEDIO, NUNCA FUERTE" />);
    if (d.ex === "crono10") exAt("lo dejas descansar", 5, (a, b) => <X.Cronometro t={t} at={a} out={b} x={420} y={520} mins={10} label="QUE DESCANSE" />);
    if (d.ex === "crono30") exAt("media hora", 5, (a, b) => <X.Cronometro t={t} at={a} out={b} x={420} y={520} mins={30} label="FUEGO BAJO, TAPADA" />);
    if (d.ex === "ajo") exAt("si se oscurece", 4.5, (a, b) => <Stamp t={t} at={a} out={b} text="OSCURO = AMARGO" x={480} y={300} size={70} />);
    if (d.ex === "nomuevas") exAt("no las muevas", 5, (a, b) => <Stamp t={t} at={a} out={b} text="NO LAS TOQUES" x={480} y={300} size={76} />);
    if (d.ex === "fria") exAt("se disuelve primero", 5.5, (a, b) => <X.Versus t={t} at={a} out={b} x={760} y={620} a="LECHE FRÍA" b="LECHE CALIENTE" rows={[["se disuelve lisa", true, false], ["hace grumos", false, true]]} w={900} />);
    if (d.ex === "templar") exAt("le agregas al huevo", 6, (a, b) => <X.Orden t={t} at={a} out={b} steps={[{ label: "huevo + limón", at: a + 0.1 }, { label: "1 cucharón de caldo, batiendo", at: a + 1.2 }, { label: "a la olla, fuego apagado", at: a + 2.4 }]} />);
    if (d.ex === "pimenton") exAt("fuera del fuego", 5, (a, b) => <Stamp t={t} at={a} out={b} text="FUERA DEL FUEGO" x={480} y={300} size={70} />);
    if (d.ex === "domingo") exAt("el domingo caldo", 5.5, (a, b) => <X.Calendario t={t} at={a} out={b} x={460} y={520} flipAt={a + 1.4} a="LUN-SÁB" b="DOMINGO" la="cáscaras a la bolsa" lb="caldo" />);
    if (d.ex === "fria1") exAt("con agua fria", 5, (a, b) => <Thermo t={t} at={a} x={360} y={520} from={60} to={10} out={b} />);
  });

  // ===== cierre =====
  const sO = slot(T_OLLA, 6), sC = slot(T_CASC, 6);
  if (sO) add(sO[0], (sC ? sC[1] : sO[1]), () => <X.Tarea t={t} at={sO[0]} out={sC ? sC[1] : sO[1]} x={1360} y={480} rows={[{ at: sO[0] + 0.2, text: "domingo: olla de caldo de hueso" }, { at: sC ? sC[0] : sO[0] + 2, text: "las cáscaras, al congelador" }]} />);
  const s2 = slot(T_DOS, 3.5); if (s2) add(s2[0], s2[1], () => <BigNum t={t} at={s2[0]} out={s2[1]} text="SÓLO 2 COSAS" size={140} y={220} col={CH.crema} edge="#4a1a0c" />);
  const sR = slot(T_REC, 5); if (sR) add(sR[0], sR[1], () => <X.Card t={t} at={sR[0]} out={sR[1]} x={500} y={180} from="left" col="#ff8fbf"><X.H s={48} c="#ff8fbf">EL GRAN RECETARIO</X.H><X.H s={42} f={HAND}>+ menú de 30 días · lista de compras</X.H></X.Card>);
  const sL = slot(T_LINK, 5); if (sL) add(sL[0], sL[1], () => <X.DescCard t={t} at={sL[0]} out={sL[1]} x={1400} y={720} hl={sL[0] + 0.8} />);
  const sQ = slot(T_COM, 9); if (sQ) add(sQ[0], sQ[1], () => <X.Card t={t} at={sQ[0]} out={sQ[1]} x={1300} y={420} from="right" col={CH.maiz}><X.H s={46} c={CH.maiz}>CUÉNTAME ABAJO:</X.H><X.H s={58} f={HAND}>¿cuál de estas 25</X.H><X.H s={58} f={HAND}>hacía tu madre?</X.H></X.Card>);
  const sS = slot(T_SUS, 5); if (sS) add(sS[0], sS[1], () => <Palomita t={t} at={sS[0]} out={sS[1]} y={220} text="SUSCRÍBETE · MÁS CENAS LA PRÓXIMA SEMANA" />);
  const sM = slot(T_MANTEL, 6); if (sM) add(sM[0], sM[1], () => <X.Cita t={t} at={sM[0]} out={END_T - 0.5} x={960} y={300} text="Pon el mantel. Aunque sea para uno." size={90} />);
  return L;
};

// ---------------- EL VIDEO ----------------
export const Main: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const idx = PARTS.findIndex((p) => t >= p.a && t < p.b);
  if (inAv(t) || idx < 0) L.push(<CamaraMano key="av"><Avatar t={t} /></CamaraMano>);
  else {
    const p = PARTS[idx], nx = PARTS[idx + 1];
    if (p.c) {
      const portaled = idx > 0 && PARTS[idx - 1].pt && Math.abs(PARTS[idx - 1].b - p.a) < 1e-6;
      L.push(<CamaraMano key={"c" + idx}><Clip k={p.c} t={t} a={portaled ? p.a - 0.7 : p.a} o={p.o} z={p.z} /></CamaraMano>);
    } else {
      L.push(<World key="w" t={t} />);
      if (p.pt && nx?.c && Math.abs(nx.a - p.b) < 1e-6) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, p.pt); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><CamaraMano><Clip k={nx.c} t={t} a={p.b - 0.7} o={nx.o} z={nx.z} /></CamaraMano></Portal>); }
      }
    }
  }
  L.push(...Ov(t));
  PARTS.forEach((p, i) => { const nx = PARTS[i + 1]; if (nx && Math.abs(nx.a - p.b) < 1e-6 && !(p.pt && nx.c) && Math.abs(t - p.b) < 0.4) L.push(<SteamWipe key={"sw" + i} t={t} mid={p.b} w={0.38} />); });
  FLIP.forEach((a, i) => { if (Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.35} w={0.3} />); });
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
export const PARTS_DEBUG = PARTS;
export const D0_DEBUG = D0;
export const DIN_DEBUG = DIN.map(d => [d.n, d.name, d.cents]);
