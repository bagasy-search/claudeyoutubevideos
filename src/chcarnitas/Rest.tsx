// chcarnitas · EL RESTO DEL VIDEO (115,6 s → final). Mismo mundo y misma cámara que el minuto 1: la cocina de adobe, el cazo de cobre de
// la mesa con su manteca dorada, los siete platos de barro (uno por secreto: al cerrar cada secreto su plato se sirve), el recetario de
// mamá Cuca que pasa una hoja por secreto (y la GUÍA cuando Chayo habla de su libro), el fogón y el puesto del mercado. Entre mundo y toma
// real sólo portales y vapor; el avatar entra en sus ventanas. Cada pieza nace con la palabra que la nombra (at("frase")).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PLATES, screenOf, camSpeed, setKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, Flash, HAND, P, Portal, Tag, at, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Aroma, Nota, Pensado, Palomita, Stamp, Precio, Pill, MIN1_END } from "./Min1";
import * as X from "./piezas";
import * as Y from "./piezas2";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms >= 110);
// el reel pagado dura 381,44 s: las ventanas que caen después (min 22-25) no tienen cara → esos segundos son mundo/tomas
const REEL_DUR = 381.44;
const sinCara = (w: Win) => REEL && w.off + (w.me - w.ms) > REEL_DUR + 0.1;
const inAv = (t: number) => WIN.some((w) => !sinCara(w) && t >= w.ms && t < w.me);
export const REST_START = MIN1_END;
export const END_T = 1519.3; // voz 1518,3 + 1 s de silencio
const A = (ph: string, after: number) => at(ph, after);

// páginas REALES de la guía: Libro 5 "La Fiesta del Rancho" · Fiesta 1 "Las Carnitas para 25" (págs. 11-28)
const PAG = { fiesta: "Libro 5 · pág. 11", receta: "Libro 5 · pág. 17", menu: "Libro 5 · pág. 13", lista: "Libro 5 · pág. 14", usa: "Libro 5 · pág. 15", orden: "Libro 5 · pág. 16", cant: "Libro 5 · pág. 26", mal: "Libro 5 · pág. 27" };
// la toma LTX (19/28 s, varias tomas) cae a su cuadro clave mientras no llegue el mp4
const LIMG: Record<string, string> = {
  l_fogon: "i_fogon", l_olla: "s_olla", l_carniceria: "u_carniceria", l_cortar: "u_cortar", l_costilla: "u_costilla", l_sal: "d_sal", l_echar: "d_echar",
  l_naranjas: "t_naranjas", l_destapado: "c_destapado", l_mover: "c_mover", l_lena: "k_lena", l_tenedor: "k_tenedor", l_hueso: "k_costilla", l_asomar: "k_asomar",
  l_fuerte: "s6_fuerte", l_coladera: "s6_coladera", l_colar: "s6_colar", l_frijoles: "s6_frijoles", l_horno: "s7_horno", l_hielera: "s7_hielera", l_taco: "v_taco",
  l_mercado: "din_mercado", l_cierre: "z_fogon",
};

// ---------------- cámaras con nombre ----------------
type Cam = { p: V; l: V; fov?: number };
const CZ = PT.cazuela;
const C: Record<string, Cam> = {
  top: { p: [0, 3.6, 0.95], l: [0, 0.8, 0.12], fov: 40 }, topB: { p: [0.18, 3.95, 1.0], l: [0, 0.8, 0.12], fov: 40 }, topC: { p: [-0.15, 3.35, 0.9], l: [0, 0.8, 0.12], fov: 40 },
  wide: { p: [1.9, 1.95, 2.7], l: [-0.6, 0.8, -1.3], fov: 42 }, wide2: { p: [1.5, 1.9, 2.4], l: [-0.8, 0.8, -1.6], fov: 42 },
  fogon: { p: [-0.55, 1.4, -0.75], l: [-1.3, 0.95, -2.4], fov: 38 }, fogon2: { p: [-0.78, 1.3, -1.05], l: [-1.3, 0.8, -2.4], fov: 38 },
  comal: { p: [-0.55, 1.9, -0.7], l: [-1.3, 0.94, -2.5], fov: 32 }, comal2: { p: [-0.75, 1.75, -1.0], l: [-1.3, 0.94, -2.5], fov: 30 },
  caz: { p: [0.85, 1.48, 1.2], l: CZ, fov: 36 }, caz2: { p: [0.55, 1.32, 0.6], l: CZ, fov: 33 }, cazL: { p: [-0.9, 1.45, 1.0], l: CZ, fov: 36 }, cazL2: { p: [-0.6, 1.35, 0.7], l: CZ, fov: 34 },
  cazT: { p: [0.32, 1.78, 0.6], l: [0, 0.92, -0.17], fov: 30 }, cazT2: { p: [0.24, 1.64, 0.46], l: [0, 0.92, -0.17], fov: 28 },
  libro: { p: [1.12, 1.42, 0.28], l: [0.88, 0.82, -0.3], fov: 34 }, libro2: { p: [1.0, 1.2, 0.02], l: [0.88, 0.82, -0.3], fov: 30 },
  mercado: { p: [6.6, 1.55, 8.0], l: [6.6, 1.0, 5.4], fov: 44 }, mercado2: { p: [6.3, 1.4, 7.3], l: [6.6, 1.0, 5.4], fov: 42 },
  salida: { p: [3.4, 2.9, 6.2], l: [0, 0.9, -0.6], fov: 44 },
};
PLATES.forEach((q, i) => { C["pl" + i] = { p: [q[0], 1.25, 0.95], l: [q[0], 0.82, 0.33], fov: 34 }; C["pl" + i + "b"] = { p: [q[0], 1.08, 0.7], l: [q[0], 0.82, 0.33], fov: 32 }; });

// ---------------- la línea de tiempo: cada HUECO entre dos ventanas del avatar se parte en mundo (w) y tomas reales (c) ----------------
type Part = { a: number; b: number; c?: string; o?: number; k0?: string; k1?: string; pt?: V; z?: [number, number] };
type It = { c?: string; o?: number; k0?: string; k1?: string; pt?: V; z?: [number, number] };
const w = (k0: string, k1: string, pt?: V): It => ({ k0, k1, pt });
// toma LTX que todavía no llegó: su cuadro clave va UNA sola vez (o=0); los tramos siguientes caen al mundo 3D (nunca repetir imagen)
const ALT: [string, string][] = [["cazT2", "cazT"], ["topB", "topC"], ["cazL2", "caz2"], ["wide2", "wide"], ["caz", "cazL"], ["fogon2", "fogon"]];
let nAlt = 0;
const c = (id: string, o = 0, z?: [number, number]): It =>
  id.startsWith("l_") && o > 0 && !(AVAIL.clips as string[]).includes(id) ? (([k0, k1]) => ({ k0, k1 }))(ALT[nAlt++ % ALT.length]) : { c: id, o, z };
const FIRE = PT.fire;
// hueco i = entre la ventana i y la i+1 (ventana 0 = la de 115,6 s); `cuts` son los segundos donde cambia de parte
const g = (i: number, its: It[], cuts: number[] = []): Part[] => {
  const a = sinCara(WIN[i]) ? WIN[i].ms + 0.04 : WIN[i].me - 0.04;
  const b = i + 2 === WIN.length && sinCara(WIN[i + 1]) ? 1519.3 : WIN[i + 1].ms + 0.04, xs = [a, ...cuts, b];
  return its.map((it, k) => ({ ...it, a: xs[k], b: xs[k + 1] }));
};
const PARTS: Part[] = [
  // la promesa (los siete platos) → coraje → quién es Chayo
  ...g(0, [w("topC", "top")]), ...g(1, [w("top", "topB"), c("p_sentada")], [140.9]),
  ...g(2, [w("caz", "caz2"), c("s6_basura")], [156.5]),
  ...g(3, [w("wide", "fogon", FIRE), c("l_fogon", 0)], [174.0]), ...g(4, [c("l_fogon", 6), w("caz", "caz2")], [189.5]),
  // el libro + CTA 1
  ...g(5, [c("i_cta"), w("libro", "libro2")], [205.0]), ...g(6, [w("libro2", "libro"), w("wide", "wide2")], [224.6]),
  // la historia de mamá Cuca
  ...g(7, [c("s_cuarto"), c("l_olla", 0)], [241.5]), ...g(8, [c("s_nina"), w("caz2", "caz")], [260.0]),
  ...g(9, [w("cazL", "cazL2"), w("caz", "caz2")], [275.5]), ...g(10, [w("cazT", "cazT2"), c("h_deshace")], [291.0]),
  ...g(11, [w("caz", "caz2"), w("cazL", "cazL2")], [309.5]),
  // SECRETO 1 · tres carnes
  ...g(12, [w("libro2", "libro2"), c("p_cortes")], [324.5]), ...g(13, [c("u_magro"), c("u_estropajo"), w("mercado", "mercado2")], [340.5, 344.5]),
  ...g(14, [w("mercado2", "mercado"), c("l_carniceria", 0)], [356.5]), ...g(15, [c("l_carniceria", 7), c("l_costilla", 0)], [372.5]),
  ...g(16, [c("l_cortar", 0)]), ...g(17, [w("cazT", "cazT2"), c("l_cortar", 13)], [408.5]),
  ...g(18, [w("libro", "libro2"), w("mercado", "mercado2")], [424.0]), ...g(19, [w("pl0", "pl0b"), w("libro2", "libro2")], [441.5]),
  // SECRETO 2 · en manteca, nunca en agua
  ...g(20, [c("d_hervida"), w("caz", "caz2")], [459.0]), ...g(21, [c("l_sal", 0), c("l_sal", 7)], [476.5]),
  ...g(22, [w("cazT", "cazT2"), c("p_manteca")], [492.5]), ...g(23, [w("caz", "caz2"), w("mercado", "mercado2")], [509.5]),
  ...g(24, [w("cazT2", "cazT"), c("l_echar", 0)], [526.0]), ...g(25, [w("cazL", "cazL2"), w("pl1", "pl1b")], [541.5]),
  // SECRETO 3 · las naranjas
  ...g(26, [c("d_cuidado"), w("libro2", "libro2")], [555.5]), ...g(27, [c("p_naranjas"), c("l_naranjas", 0)], [575.5]),
  ...g(28, [c("t_brillo"), w("caz2", "caz")], [593.0]), ...g(29, [w("wide", "wide2"), c("l_naranjas", 7)], [608.5]),
  ...g(30, [c("t_negras"), w("pl2", "pl2b")], [624.5]),
  // CTA 2 · la lista, la de Estados Unidos, el plan de los dos días
  ...g(31, [w("libro", "libro2")]), ...g(32, [w("libro2", "libro")]),
  // SECRETO 4 · destapado la primera hora
  ...g(33, [w("libro2", "libro2"), w("caz", "caz2")], [676.0]), ...g(34, [c("l_destapado", 0), c("p_destapado")], [693.5]),
  ...g(35, [c("l_destapado", 9), c("c_tapa")], [710.0]), ...g(36, [w("caz", "caz2"), c("l_destapado", 18)], [723.5]),
  ...g(37, [c("l_mover", 0), w("cazT", "cazT2")], [741.5]), ...g(38, [w("caz2", "cazT"), w("pl3", "pl3b")], [757.0]),
  // SECRETO 5 · fuego bajo dos horas
  ...g(39, [c("c_transparente"), w("libro2", "libro2"), w("fogon", "fogon2")], [770.0, 775.0]),
  ...g(40, [w("fogon2", "fogon"), c("l_lena", 0)], [791.5]), ...g(41, [c("p_fuegobajo"), c("l_hueso", 0)], [807.5]),
  ...g(42, [w("libro", "libro2"), c("l_asomar", 0)], [823.0]), ...g(43, [w("cazT", "cazT2"), c("l_tenedor", 0)], [841.5]),
  ...g(44, [w("caz", "caz2"), w("cazL", "cazL2")], [856.5]), ...g(45, [w("pl4", "pl4b"), w("libro2", "libro2")], [874.0]),
  // SECRETO 6 · cinco minutos de fuego alto y la manteca es oro
  ...g(46, [w("fogon", "fogon2", FIRE), c("l_fuerte", 0)], [891.0]), ...g(47, [c("l_fuerte", 9), c("p_dorado")], [906.0]),
  ...g(48, [w("cazT", "cazT2"), c("l_coladera", 0)], [921.0]), ...g(49, [c("s6_charola"), w("cazT2", "cazT")], [940.2]),
  ...g(50, [c("l_colar", 0), c("s6_frasco")], [957.5]), ...g(51, [c("l_frijoles", 0), w("libro", "libro2")], [974.5]),
  ...g(52, [w("pl5", "pl5b"), c("l_colar", 9)], [989.5]),
  // SECRETO 7 · el día antes
  ...g(53, [w("libro2", "libro2"), w("wide", "wide2")], [1006.5]), ...g(54, [w("libro", "libro2"), c("l_coladera", 9)], [1023.5]),
  ...g(55, [w("top", "topB"), c("s7_refri")], [1040.5]), ...g(56, [w("wide2", "wide"), c("l_horno", 0)], [1057.5]),
  ...g(57, [c("s7_horneadas"), w("top", "topC")], [1075.5]), ...g(58, [c("l_hielera", 0), c("s7_mesa")], [1093.0]),
  ...g(59, [w("pl6", "pl6b"), w("top", "topB"), w("libro", "libro2")], [1106.5, 1110.5]),
  // cuatro cosas más de la misma olla
  ...g(60, [w("wide", "wide2"), w("top", "topC")], [1125.5]), ...g(61, [c("l_taco", 0), c("v_pico")], [1142.5]),
  ...g(62, [w("libro2", "libro"), w("top", "topB")], [1160.0]), ...g(63, [c("v_dosollas"), w("top", "topC")], [1176.0]),
  ...g(64, [c("v_bolsas"), w("comal", "comal2")], [1192.5]), ...g(65, [c("v_charros"), c("v_jamaica")], [1209.5]),
  ...g(66, [c("v_chilaquiles"), w("caz", "cazL")], [1225.5]),
  // lo que puede salir mal
  ...g(67, [w("cazT", "cazT2")]), ...g(68, [c("l_tenedor", 7), w("fogon", "fogon2")], [1257.0]),
  ...g(69, [w("caz", "caz2"), c("l_asomar", 8)], [1275.5]), ...g(70, [w("cazT", "cazT2"), w("top", "topB")], [1290.0]),
  // la cuenta
  ...g(71, [w("caz2", "caz"), w("mercado", "mercado2")], [1307.0]), ...g(72, [w("mercado2", "mercado")]),
  ...g(73, [w("top", "topB")]), ...g(74, [w("topB", "topC"), c("l_mercado", 0)], [1358.5]),
  ...g(75, [w("wide", "wide2"), c("l_mercado", 7)], [1374.0]), ...g(76, [w("pl2", "pl2b"), w("top", "topB")], [1390.5]),
  ...g(77, [w("wide2", "wide"), w("libro", "libro2")], [1408.5]),
  // resumen, tarea, comentarios, próximo, cierre
  ...g(78, [w("top", "topB")]), ...g(79, [w("topB", "top")]), ...g(80, [w("caz", "caz2")]),
  ...g(81, [c("l_fuerte", 19), w("cazL", "caz")], [1475.5]), ...g(82, [w("cazL2", "cazL"), w("fogon2", "fogon")], [1491.0]),
  ...g(83, [c("l_cierre", 0), w("caz", "salida")], [1507.5]),
];
// llaves de cámara: inicio y fin de cada parte de mundo (los saltos caen siempre dentro de una toma, del avatar o del vapor)
setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
  const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
  const k0 = C[p.k0!], k1 = C[p.k1!];
  return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
}));
const partAt = (t: number) => PARTS.find((p) => t >= p.a && t < p.b);

// ---------------- recetario de mamá Cuca: una hoja por secreto ----------------
const RECETARIO = [
  { l: ["# Carnitas de Fiesta", "de mi abuela", "", "Pa' los 15 años", "y los cumpleaños.", "Fuego bajito,", "nada de prisa.", "— Refugio"], r: ["tres carnes, no una", "manteca, nunca agua", "las naranjas", "destapado la 1ª hora", "fuego bajito 2 horas", "5 minutos fuerte", "un día antes", "y tú, sentada"] },
  { l: ["# 1. Tres carnes", "3 kg maciza", "2 kg espaldilla", "con su grasa", "2 kg costilla", "en trozos"], r: ["7 kilos pa' 25", "", "trozos de 6 cm", "como un huevo grande", "", "NO le quites la grasa"] },
  { l: ["# 2. En manteca", "nunca en agua", "", "2 cdas de sal", "antes, con la mano"], r: ["2 kg de manteca", "se queda en la olla", "", "¡nunca agua a la", "manteca caliente!"] },
  { l: ["# 3. Las naranjas", "4, partidas", "con cáscara", "desde el principio"], r: ["el jugo trae azúcar:", "el color de cobre", "", "negritas al final:", "se apartan"] },
  { l: ["# 4. Destapado", "la 1ª hora", "fuego medio", "sin tapa"], r: ["unos 60 minutos", "mover cada 30", "", "el ruido cambia:", "chisporroteo finito"] },
  { l: ["# 5. Fuego bajo", "2 horas", "que nomás burbujee"], r: ["3 horas la olla sola", "", "el tenedor entra", "sin empujar"] },
  { l: ["# 6. 5 minutos", "de fuego alto", "al final", "", "coladera y", "charola plana"], r: ["la manteca es oro:", "tibia, se cuela", "frasco con tapa", "", "frijoles, huevos"] },
  { l: ["# 7. El día antes", "charola plana", "al refri antes", "de 2 horas"], r: ["12: al horno", "200°, 20 minutos", "2: tortillas", "4: a la mesa", "", "y tú, sentada"] },
];
// la GUÍA (Libro 5): las páginas que Chayo nombra
const GUIA = [
  { l: ["# Las 5 Ollas de", "# Doña Chayo", "", "Libro 5", "La Fiesta del Rancho", "", "recetas de mi abuela", "con sus pesos"], r: ["Las Carnitas para 25", "", "lo que te llevas ...... 12", "el menú ................. 13", "la lista ................. 14", "el orden ................ 16", "las carnitas ........... 17"] },
  { l: ["# Carnitas Estilo", "# Michoacán", "pág. 17", "", "3 kg maciza", "2 kg espaldilla", "2 kg costilla", "2 kg manteca"], r: ["4 naranjas", "2 cdas de sal", "", "3 horas, la olla sola", "", "el truco de Chayo:", "la manteca no se tira"] },
  { l: ["# Lo que compras", "# para 25", "pág. 14", "", "precios de mercado,", "Michoacán, octubre", "", "unos $2,133"], r: ["con una columna", "pa' anotar", "lo que pagaste tú"] },
  { l: ["# Si vives en", "# Estados Unidos", "pág. 15", "", "la misma fiesta,", "en la tienda de allá"], r: ["con su nombre", "en inglés", "", "unos 179 dólares"] },
  { l: ["# Dos días,", "# hora por hora", "pág. 16", "", "el día antes:", "unas 4 horas", "la olla sola: 3 horas"], r: ["el día de la fiesta:", "unas 3 horas", "", "a las 4, a la mesa"] },
  { l: ["# Para 10, 25 o 50", "pág. 26", "", "para 10: 3 kg", "para 50: 14 kg", "en 2 ollas"], r: ["unos $85", "por persona,", "casi igual"] },
  { l: ["# Si te sale mal", "pág. 27", "", "secas", "duras", "pálidas"], r: ["se hizo caldo", "huele a quemado", "se aguadaron"] },
];
// ventanas en que el libro de la mesa es la GUÍA: [desde, hasta, página a la que abre, (segundo cambio de página, a cuál)]
const G2P = A("con el nombre en ingles", 645), G2O = A("el plan de los dos dias", 655);
const GV: [number, number, number, number?, number?, number?, number?][] = [
  [205.0, 229.4, 0, A("hora por hora", 219), 4], [418.6, 424.0, 2], [634.3, 665.7, 2, G2P, 3, G2O, 4], [817.7, 823.0, 1], [974.5, 980.0, 1],
  [1018.3, 1023.5, 4], [1110.5, 1115.2, 4], [1153.9, 1160.0, 5], [1408.5, 1414.7, 3],
];
const guiaAt = (t: number) => GV.find((v) => t >= v[0] - 0.05 && t < v[1] + 0.05);

// ---------------- tiempos clave ----------------
const FLIP = [A("secreto numero uno", 315), A("secreto numero 2", 440), A("secreto numero 3", 550), A("secreto numero 4", 660), A("secreto numero 5", 765), A("secreto numero 6", 870), A("secreto numero 7", 1000)];
const SERVE = [436.3, 541.9, 624.9, 757.4, 867.7, 984.8, 1103.0];         // el plato del secreto i se sirve
const PROM = [A("tres carnes distintas", 120), A("en manteca", 120), A("las naranjas", 120), A("va destapado", 120), 134.75, A("cinco minutos del final", 130), A("el ultimo secreto", 130)];
const RES = [A("tres carnes", 1415), A("se cuecen en su manteca", 1420), A("cuatro naranjas partidas", 1428), A("la primera hora destapada", 1430), A("fuego bajo dos horas", 1438), A("cinco minutos de fuego alto", 1440), A("se hacen el dia antes", 1448)];
const ROT = ["tres carnes", "en manteca, nunca agua", "4 naranjas", "destapado la 1ª hora", "fuego bajo 2 horas", "5 minutos fuerte", "el día antes"];

const worldAt = (t: number): WorldProps => {
  const gv = guiaAt(t);
  const k0 = partAt(t)?.k0 ?? "caz";
  const plateServed = PLATES.map((_, i) => win(t, SERVE[i], SERVE[i] + 1.2));
  const plateOn = PLATES.map((_, i) => Math.max(
    win(t, PROM[i], PROM[i] + 0.3) * (1 - win(t, 140.7, 141.0)),
    win(t, SERVE[i] - 0.4, SERVE[i]) * (1 - win(t, SERVE[i] + 3, SERVE[i] + 4)),
    win(t, RES[i], RES[i] + 0.3) * (1 - win(t, 1453, 1453.3)),
  ));
  // la carne cruda/pálida: secreto 2 (la hervida) y secreto 4 (suelta su agua, se va dorando)
  const raw = t >= 459 && t < 466 ? 1 : t >= 671 && t < 724 ? 1 : t >= 724 && t < 761 ? 1 - win(t, 724, 760) : t >= 1269 && t < 1276 ? 1 : 0;
  const bk = gv ? { open: ei(t, gv[0], gv[0] + 1.0), flip: gv[2] * ei(t, gv[0] + 0.3, gv[0] + 1.2) + (gv[3] ? ((gv[4] as number) - gv[2]) * ei(t, gv[3], gv[3] + 0.9) : 0) + (gv[5] ? ((gv[6] as number) - (gv[4] as number)) * ei(t, gv[5], gv[5] + 0.9) : 0), pages: GUIA }
    : { open: 1, flip: FLIP.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0), pages: RECETARIO };
  return {
    t, night: 0,
    fire: t >= 785 && t < 831 ? 0.55 : (t >= 885 && t < 913 ? 1 + 1.4 * win(t, 885.3, 885.9) : 1),
    steamCaz: /^cazT/.test(k0) ? 0.3 : /^(caz|pl)/.test(k0) ? 1 : /^top/.test(k0) ? 0.35 : 0.2,
    steamComal: /^comal/.test(k0) ? 0.15 : 1,
    ojitos: t >= 676 && t < 724 ? 1 : t >= 785 && t < 831 ? 0.35 : 0.7,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.16 * v), plateFill: PLATES.map(() => 0),
    book: bk, guia: gv ? 1 : 0,
    partyPeople: 0, patioLights: 0,
    chiles: 0, toast: 0, burnt: 0, sarten: t >= 1192 && t < 1200 ? 1 : 0, fry: 0, charola: 0, remojo: 0, tapa: 0, aguaLimon: 0, especias: 0, verduras: 0,
    raw,
    smoke: t >= 1285 && t < 1290.5 ? win(t, 1285.3, 1286.2) : 0,
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
    <Sequence key={i} from={s(wn.ms) - 10} durationInFrames={s(wn.me - wn.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= wn.ms - 0.02 && t < wn.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(wn.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
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

// ---------------- las piezas, cada una clavada a su palabra ----------------
const sc = (t: number, q: V) => screenOf(t, q);
const PL = (i: number) => PLATES[i];
const Lst: React.FC<{ t: number; rows: [string, number][]; s?: number }> = ({ t, rows, s: sz = 48 }) => <>{rows.map(([l, a], i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: sz, color: CH.crema, opacity: e(t, a, a + 0.3) }}>{l}</div>)}</>;
const Ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const on = (a: number, b: number) => t >= a - 0.4 && t < b + 0.6;
  const add = (a: number, b: number, f: () => React.ReactNode) => { if (on(a, b)) L.push(<React.Fragment key={"o" + a.toFixed(2) + "_" + L.length}>{f()}</React.Fragment>); };
  const served = (i: number, a: number, b: number, dx = 240) => add(a, b, () => { const p = sc(t, PL(i)); return <Tag t={t} at={SERVE[i] + 0.3} x={p.x} y={p.y} dx={dx} dy={-210} text={"PLATO " + (i + 1)} sub={i === 6 ? "LOS SIETE, SERVIDOS" : "SERVIDO"} col={CH.maiz} out={b - 0.2} size={50} />; });
  const plateLabels = (a: number, b: number, ats: number[]) => add(a, b, () => PLATES.map((q, i) => { const p = sc(t, q); return <X.PlateLabel key={i} t={t} at={ats[i] + i * 0.05} out={b - 0.2} x={p.x} y={p.y} n={i + 1} text={ROT[i]} up={i % 2 ? 250 : 130} />; }));

  // ===== siete secretos (sobre el avatar) + promesa =====
  add(115.6, 120.4, () => <BigNum t={t} at={A("siete secretos", 115)} text="7 SECRETOS" size={150} y={880} col={CH.maiz} edge="#5a2a10" out={120.2} sub="DE LAS CARNITAS DE MI ABUELA" />);
  plateLabels(120.5, 140.9, PROM);
  add(140.9, 145.7, () => <Palomita t={t} at={A("sentada con tus invitados", 140)} out={145.5} y={240} text="TÚ, SENTADA CON TUS INVITADOS" />);
  add(150.6, 156.5, () => <Precio t={t} at={150.7} out={156.3} x={1440} y={140} top="$" sub="CADA COSA, EN PESOS" />);
  add(156.5, 162.9, () => <X.Burbujas t={t} out={162.7} items={[{ at: A("tirando a la basura", 155), x: 1450, y: 260, text: "¡¿Cómo que no se tira?!", rot: 3 }, { at: A("tirando a la basura", 155) + 0.8, x: 520, y: 560, text: "¡Siempre la he tirado!", rot: -4 }]} />);
  add(162.9, 168.7, () => <LowerThird t={t} at={A("yo soy rosario", 163)} out={168.5} name="DOÑA CHAYO" l2="67 AÑOS · RANCHO DE PÁTZCUARO" l2at={166.0} />);

  // ===== quién es Chayo + CTA =====
  add(168.7, 174.0, () => <X.MapaMich t={t} at={169.0} out={173.8} x={1460} y={500} />);
  add(174.0, 179.4, () => <Tag t={t} at={A("fogon de lena", 175)} x={1100} y={640} dx={260} dy={-240} text="FOGÓN DE LEÑA" sub="TODA LA VIDA" col="#ff9a4a" out={179.2} size={50} />);
  add(184.5, 189.5, () => <X.Card t={t} at={A("del encino", 184)} out={189.3} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>EL HUMO DEL ENCINO</X.H><X.H s={44} f={HAND}>desde temprano</X.H></X.Card>);
  add(189.5, 196.3, () => <X.Onoma t={t} at={A("chisporroteando", 189)} out={196.1} x={1320} y={300} text="¡CHSSS!" col="#ffcf6a" />);
  add(189.5, 196.3, () => <Pensado t={t} at={A("los primos", 192)} out={196.1} x={1250} y={820} text="…un pedacito, abuela" size={86} />);
  add(201.2, 205.0, () => <X.Card t={t} at={A("y lo hice", 202)} out={204.8} x={1450} y={280} from="right"><X.H s={50} c={CH.maiz}>LAS ESCRIBÍ TODAS</X.H><X.H s={44} f={HAND}>antes de que se me olvidaran</X.H></X.Card>);
  add(205.0, 212.8, () => <X.Card t={t} at={A("son mis libros", 204)} out={212.6} x={470} y={170} from="left" col="#ff8fbf"><X.H s={54} c="#ff8fbf">LAS 5 OLLAS DE DOÑA CHAYO</X.H></X.Card>);
  add(205.0, 212.8, () => <X.Card t={t} at={A("con sus cantidades", 207)} out={212.6} x={1450} y={840} from="right"><X.H s={44} f={HAND}>cantidades · tiempos · lo que cuesta</X.H></X.Card>);
  add(217.7, 224.6, () => <X.GuiaPag t={t} at={A("hora por hora", 219) + 0.3} out={224.4} x={1530} y={220} pag={PAG.orden} text="la fiesta para 25, hora por hora" />);
  add(217.7, 224.6, () => <X.DescCard t={t} at={A("el link esta", 219)} out={224.4} x={1440} y={760} hl={A("primera linea", 219)} />);

  // ===== la historia =====
  add(224.6, 229.4, () => <X.FotoVieja t={t} at={A("se llamaba refugio", 224)} out={229.2} x={1360} y={460} src="s_abuela" w={720} rot={4} cap="Mamá Cuca" />);
  add(235.2, 241.5, () => <X.Card t={t} at={A("bautizos", 234)} out={241.3} x={1450} y={260} from="right"><X.H s={46} c={CH.maiz}>BAUTIZOS · CUMPLEAÑOS</X.H><X.H s={44} f={HAND}>los 15 años de las primas</X.H></X.Card>);
  add(241.5, 248.5, () => <Stamp t={t} at={A("venia fiesta", 243)} out={248.3} text="¡VENÍA FIESTA!" x={1380} y={280} size={84} col={CH.maiz} />);
  add(253.3, 260.0, () => <X.Card t={t} at={A("me tocaba", 252)} out={259.8} x={1450} y={260} from="right"><X.H s={50} c={CH.maiz}>A MÍ ME TOCABA</X.H><X.H s={46} f={HAND}>partir las naranjas</X.H></X.Card>);
  add(260.0, 266.0, () => <X.Onoma t={t} at={A("a tronar", 262)} out={265.8} x={1320} y={300} text="¡PAH!" col="#ffcf6a" />);
  add(266.0, 270.9, () => <Nota t={t} at={A("hazte para atras", 265)} out={270.7} x={1480} y={300} lines={["Hazte pa' atrás,", "Chayito, que la", "manteca no perdona."]} rot={-3} w={520} />);
  add(270.9, 275.5, () => <Pensado t={t} at={A("nomas tantito", 270)} out={275.3} x={1300} y={300} text="(nomás tantito)" size={96} />);
  add(275.5, 284.8, () => <X.Card t={t} at={A("mama cuca por que", 275)} out={284.6} x={1400} y={250} from="right" w={760}><X.H s={42} f={HAND}>¿por qué las suyas son doraditas y las del puesto como carne hervida?</X.H></X.Card>);
  add(284.8, 291.0, () => <><X.Fondo o={0.42 * e(t, 285.0, 285.5) * (1 - e(t, 290.5, 290.9))} /><X.Cita t={t} at={A("la carnita no quiere prisa", 285)} out={290.7} x={960} y={500} text="La carnita no quiere prisa." who="MAMÁ CUCA" size={96} w={1300} /></>);
  add(291.0, 298.0, () => <Pensado t={t} at={A("tenia su razon", 290)} out={297.8} x={1250} y={300} text="cada cosa, su razón" size={92} />);
  add(303.9, 309.5, () => <X.Card t={t} at={A("no te apures", 303)} out={309.3} x={1450} y={280} from="right"><X.H s={46} c={CH.maiz}>¿SIN CAZO? NO TE APURES</X.H><X.H s={44} f={HAND}>la olla más grande, de fondo grueso</X.H></X.Card>);
  add(309.5, 315.1, () => <X.Card t={t} at={A("honda eso si", 309)} out={314.9} x={1450} y={280} from="right" col="#ff8a6a"><X.H s={52} c="#ff8a6a">HONDA</X.H><X.H s={44} f={HAND}>la manteca caliente salta</X.H></X.Card>);

  // ===== SECRETO 1 · tres carnes =====
  add(319.8, 324.5, () => <X.Banda t={t} at={Math.max(320.0, FLIP[0])} out={324.3} n={1} text="TRES CARNES, NO UNA" />);
  add(324.5, 332.1, () => <Stamp t={t} at={A("son de tres", 324)} out={331.9} text="SON DE TRES" x={1400} y={280} size={90} col={CH.maiz} />);
  add(335.9, 340.5, () => <Pill t={t} at={336.1} out={340.3} x={1400} y={260} text="LIMPIECITA, SIN GRASA" />);
  add(340.5, 344.5, () => <Stamp t={t} at={A("como estropajo", 340)} out={344.3} text="ESTROPAJO" x={1400} y={280} size={96} />);
  add(344.5, 346.9, () => <Precio t={t} at={344.7} out={346.7} x={1440} y={470} top="7 kg" sub="DE 3 CORTES" />);
  add(351.6, 361.5, () => <X.Carnes t={t} out={361.3} x={960} y={850} rows={[{ at: A("de maciza", 349), n: "3 kg MACIZA", s: "da el cuerpo" }, { at: A("de espaldilla", 354), n: "2 kg ESPALDILLA", s: "con su grasa: lo jugoso" }, { at: 360.4, n: "2 kg COSTILLA", s: "el sabor del hueso" }]} />);
  add(366.5, 382.8, () => <X.Senales t={t} out={382.6} x={1400} y={420} title="CADA CARNE, SU TRABAJO" rows={[{ at: A("la maciza llena", 370), text: "maciza: llena el taco" }, { at: A("la espaldilla con su grasita", 372), text: "espaldilla: el jugo" }, { at: A("la costilla con su hueso", 376), text: "costilla: sabor hondo" }]} />);
  add(386.0, 398.2, () => <Y.Trozo6 t={t} at={A("unos 6 centimetros", 388)} out={398.0} x={1400} y={420} />);
  add(403.5, 408.5, () => <X.Card t={t} at={A("si los dejas enteros", 403)} out={408.3} x={1450} y={280} from="right"><X.H s={46} c="#ff8a6a">ENTEROS</X.H><X.H s={42} f={HAND}>doraditos por fuera, crudos por dentro</X.H></X.Card>);
  add(408.5, 412.9, () => <Stamp t={t} at={A("6 centimetros mija", 408)} out={412.7} text="6 CM · CON SU GRASA" x={1300} y={280} size={70} col={CH.maiz} />);
  add(418.6, 424.0, () => <X.GuiaPag t={t} at={A("con precios del mercado", 419)} out={423.8} x={1530} y={220} pag={PAG.lista} text="la lista, con precios de Michoacán" />);
  add(424.0, 432.1, () => <Receipt t={t} rows={[{ at: A("unos 980 pesos", 425), item: "cerdo, 7 kg (3 cortes)", $: 980 }]} totalAt={1e9} x={1300} y={160} out={431.9} title="LA FIESTA DE 25" />);
  add(424.0, 432.1, () => <Pill t={t} at={A("lo mas caro", 428)} out={431.9} x={560} y={860} text="LO MÁS CARO: CUÍDALO" col={CH.maiz} />);
  add(435.9, 441.5, () => <X.Card t={t} at={A("te va a cobrar lo mismo", 436)} out={441.3} x={1450} y={260} from="right"><X.H s={44} c="#ff8a6a">¿QUE LE QUITE LA GRASA?</X.H><X.H s={42} f={HAND}>te cobra lo mismo y se te seca</X.H></X.Card>);
  served(0, 435.9, 441.5);

  // ===== SECRETO 2 · en manteca, nunca en agua =====
  add(441.5, 447.5, () => <X.Banda t={t} at={FLIP[1]} out={447.3} n={2} text="EN MANTECA, NUNCA EN AGUA" />);
  add(452.6, 459.0, () => <Pill t={t} at={A("a hervir en agua", 452)} out={458.8} x={1400} y={260} text="HERVIDA EN AGUA" />);
  add(459.0, 465.1, () => { const p = sc(t, CZ); return <Tag t={t} at={A("palida por dentro", 460)} x={p.x} y={p.y} dx={320} dy={-230} text="PÁLIDA Y SECA" col={CH.maiz} out={464.9} size={56} />; });
  add(465.1, 470.2, () => <Stamp t={t} at={A("eso no son carnitas", 464)} out={470.0} text="ESO ES CARNE COCIDA" x={1380} y={860} size={62} />);
  add(470.2, 476.5, () => <X.Card t={t} at={470.4} out={476.3} x={1450} y={280} from="right"><X.H s={52} c={CH.maiz}>2 CDAS DE SAL</X.H><X.H s={44} f={HAND}>pa' los 7 kilos, con la mano</X.H></X.Card>);
  add(482.6, 487.2, () => <Pill t={t} at={A("si se la echas al final", 480)} out={487.0} x={1400} y={160} text="ANTES, NO AL FINAL" col={CH.maiz} />);
  add(487.2, 492.5, () => <X.Bascula t={t} at={487.4} out={492.3} x={1450} y={460} kg={2} label="MANTECA" sub="pa' los 7 kilos" />);
  add(492.5, 498.6, () => <Pensado t={t} at={A("si mija dos kilos", 492)} out={498.4} x={1300} y={300} text="(sí, mija, dos kilos)" size={92} />);
  add(503.1, 509.5, () => <X.Card t={t} at={A("no se la comen", 503)} out={509.3} x={1450} y={280} from="right"><X.H s={46} c={CH.maiz}>NO SE LA COMEN</X.H><X.H s={44} f={HAND}>se queda en la olla</X.H></X.Card>);
  add(509.5, 516.9, () => <Receipt t={t} rows={[{ at: 509.7, item: "cerdo, 7 kg", $: 980 }, { at: A("unos 120 pesos", 511), item: "manteca, 2 kg", $: 120 }]} totalAt={1e9} x={1380} y={470} out={516.7} title="LA FIESTA DE 25" />);
  add(520.6, 526.0, () => <X.Versus t={t} at={520.8} out={525.8} x={960} y={560} a="AGUA" b="MANTECA" rows={[["guarda el jugo", false, true], ["dora la carne", false, true]]} w={900} />);
  add(526.0, 532.0, () => <Palomita t={t} at={528.0} out={531.8} y={240} text="UNA OLLA: COCER Y DORAR" />);
  add(537.6, 541.5, () => <Stamp t={t} at={537.8} out={541.3} text="NUNCA AGUA" x={1380} y={280} size={100} />);
  add(541.5, 547.1, () => <X.Card t={t} at={A("salta y quema", 541)} out={546.9} x={480} y={260} from="left" col="#ff8a6a"><X.H s={52} c="#ff8a6a">SALTA Y QUEMA</X.H><X.H s={44} f={HAND}>y quema feo</X.H></X.Card>);
  served(1, 541.5, 547.1);

  // ===== SECRETO 3 · las naranjas =====
  add(550.7, 555.5, () => <X.Senales t={t} out={555.3} x={1420} y={420} title="CUIDADO" rows={[{ at: 550.9, text: "olla honda" }, { at: 551.5, text: "el mango hacia adentro" }, { at: 552.1, text: "los niños, lejos" }]} />);
  add(555.5, 564.2, () => <X.Banda t={t} at={FLIP[2]} out={564.0} n={3} text="LAS NARANJAS" />);
  add(569.7, 575.5, () => <X.Card t={t} at={569.9} out={575.3} x={1450} y={280} from="right"><X.H s={52} c={CH.maiz}>4 NARANJAS</X.H><X.H s={44} f={HAND}>partidas, con todo y cáscara</X.H></X.Card>);
  add(575.5, 581.4, () => <Tag t={t} at={A("tiene azucar", 578)} x={980} y={560} dx={300} dy={-240} text="EL JUGO TRAE AZÚCAR" col={CH.maiz} out={581.2} size={52} />);
  add(586.8, 593.0, () => <Y.ColorCobre t={t} at={A("sin naranja", 586)} out={592.8} x={960} y={820} goodAt={A("con naranja se ponen", 590)} />);
  add(593.0, 598.6, () => <Aroma t={t} at={A("un olorcito", 595)} out={598.5} x={1180} y={640} />);
  add(603.4, 608.5, () => <Pensado t={t} at={604.0} out={608.3} x={1300} y={300} text="…aquí hay fiesta" size={96} />);
  add(608.5, 614.2, () => <Pill t={t} at={A("desde el principio", 610)} out={614.0} x={1400} y={260} text="DESDE EL PRINCIPIO" col={CH.maiz} />);
  add(617.8, 624.5, () => <Tag t={t} at={A("como pasas", 621)} x={980} y={560} dx={300} dy={-240} text="NEGRITAS" sub="COMO PASAS" col={CH.maiz} out={624.3} size={54} />);
  add(624.5, 628.5, () => <Pill t={t} at={A("se apartan", 624)} out={628.3} x={560} y={260} text="NO SE SIRVEN: SE APARTAN" />);
  served(2, 624.5, 628.5);

  // ===== CTA 2 =====
  add(634.3, 646.9, () => <X.GuiaPag t={t} at={A("la lista del mercado", 638)} out={646.7} x={1530} y={220} pag={PAG.lista} text="la lista para 25, con lo que cuesta" />);
  add(634.3, 646.9, () => <X.Card t={t} at={A("te cuento algo", 634)} out={646.7} x={470} y={170} from="left" col="#ff8fbf"><X.H s={50} c="#ff8fbf">EN MI LIBRO</X.H></X.Card>);
  add(653.1, 665.7, () => <X.GuiaPag t={t} at={G2P + 0.3} out={G2O - 0.1} x={1530} y={220} pag={PAG.usa} text="la misma lista, en inglés" />);
  add(653.1, 665.7, () => <X.GuiaPag t={t} at={G2O + 0.2} out={665.5} x={1530} y={220} pag={PAG.orden} text="los dos días, hora por hora, pa'l refri" />);
  add(658.0, 665.7, () => <X.DescCard t={t} at={A("esta en el link", 660)} out={665.5} x={1440} y={760} hl={A("primera linea", 660)} />);

  // ===== SECRETO 4 · destapado la primera hora =====
  add(671.6, 676.0, () => <X.Banda t={t} at={671.8} out={675.8} n={4} text="DESTAPADO LA PRIMERA HORA" />);
  add(676.0, 682.6, () => <X.Orden t={t} at={A("pones la carne", 668) - 0.2} out={682.4} steps={[{ label: "la carne", at: A("pones la carne", 668) }, { label: "la manteca", at: A("la manteca y las naranjas", 668) }, { label: "las naranjas", at: A("y las naranjas", 668) }]} />);
  add(686.6, 693.5, () => <Stamp t={t} at={686.8} out={693.3} text="SIN TAPA" x={1400} y={260} size={96} />);
  add(686.6, 693.5, () => <Tag t={t} at={690.0} x={980} y={600} dx={-320} dy={-240} text="TURBIA, BLANQUECINA" col={CH.crema} out={693.3} size={50} />);
  add(693.5, 699.2, () => <Pill t={t} at={A("hierve", 695)} out={699.0} x={1400} y={260} text="EN VEZ DE FREÍR, HIERVE" />);
  add(704.0, 710.0, () => <Palomita t={t} at={A("asi tiene que ser", 703)} out={709.8} y={240} text="ASÍ TIENE QUE SER" />);
  add(710.0, 715.0, () => <Tag t={t} at={A("gotea", 712)} x={960} y={420} dx={300} dy={-200} text="EL VAPOR SE REGRESA" sub="Y GOTEA" col={CH.maiz} out={714.8} size={50} />);
  add(718.6, 723.5, () => <Stamp t={t} at={A("la carne gris", 718)} out={723.3} text="CARNE GRIS" x={1400} y={280} size={90} />);
  add(723.5, 729.7, () => <X.Cronometro t={t} at={A("unos 60 minutos", 725)} out={729.5} x={1560} y={420} mins={60} label="60 MIN, DESTAPADA" />);
  add(734.7, 741.5, () => <X.Card t={t} at={734.9} out={741.3} x={1450} y={280} from="right"><X.H s={50} c={CH.maiz}>CADA 30 MINUTOS</X.H><X.H s={44} f={HAND}>de abajo pa' arriba, y la dejas</X.H></X.Card>);
  add(741.5, 746.8, () => <><X.Fondo o={0.4 * e(t, 741.7, 742.2) * (1 - e(t, 746.3, 746.7))} /><X.Cita t={t} at={A("la carne que se mueve mucho", 742)} out={746.5} x={960} y={500} text="La carne que se mueve mucho no se dora." who="MAMÁ CUCA" size={84} w={1300} /></>);
  add(751.0, 761.0, () => <Y.Ruido t={t} at={751.2} out={760.8} x={960} y={300} swapAt={A("un chisporroteo finito", 756)} />);
  served(3, 757.0, 761.0);

  // ===== SECRETO 5 · fuego bajo dos horas =====
  add(766.3, 770.0, () => <Tag t={t} at={766.5} x={960} y={600} dx={300} dy={-240} text="TRANSPARENTE" sub="OTRA VEZ: ÉSA ES LA SEÑAL" col={CH.maiz} out={769.8} size={50} />);
  add(770.0, 775.0, () => <X.Banda t={t} at={Math.max(770.1, FLIP[4])} out={774.8} n={5} text="FUEGO BAJO DOS HORAS" />);
  add(775.0, 780.5, () => <X.FuegoNivel t={t} at={775.3} out={780.3} x={1560} y={380} lvl={3} label="LA TENTACIÓN" />);
  add(785.6, 798.2, () => <X.FuegoNivel t={t} at={A("le bajas el fuego", 789)} out={798.0} x={1560} y={380} lvl={1} label="FUEGO BAJO" />);
  add(791.5, 798.2, () => <Pill t={t} at={A("burbuje despacito", 786)} out={798.0} x={560} y={260} text="QUE NOMÁS BURBUJEE" col={CH.maiz} />);
  add(802.1, 807.5, () => <X.Cronometro t={t} at={802.3} out={807.3} x={1560} y={420} mins={120} label="2 HORAS" />);
  add(807.5, 813.7, () => <Tag t={t} at={A("se va despegando del hueso", 808)} x={960} y={580} dx={300} dy={-240} text="SE DESPEGA DEL HUESO" col={CH.maiz} out={813.5} size={50} />);
  add(817.7, 823.0, () => <X.GuiaPag t={t} at={A("mi libro dice tres horas", 818)} out={822.8} x={1530} y={220} pag={PAG.receta} text="3 horas, la olla sola" />);
  add(823.0, 830.1, () => <X.Senales t={t} out={829.9} x={1420} y={420} title="MIENTRAS TANTO" rows={[{ at: A("haces los frijoles", 823), text: "los frijoles" }, { at: A("el agua de jamaica", 824), text: "el agua de jamaica" }, { at: A("la salsa", 825), text: "la salsa" }]} />);
  add(834.8, 841.5, () => { const p = sc(t, CZ); return <Tag t={t} at={836.0} x={p.x} y={p.y} dx={320} dy={-230} text="SE TIENE QUE DESHACER" col={CH.maiz} out={841.3} size={50} />; });
  add(851.0, 856.5, () => <Y.Tenedor t={t} at={851.2} out={856.3} x={960} y={560} badAt={852.0} />);
  add(851.0, 856.5, () => <Palomita t={t} at={A("nomas esperala", 853)} out={856.3} y={160} text="NOMÁS ESPÉRALA" />);
  add(856.5, 863.2, () => <Pill t={t} at={A("sacarla antes", 858)} out={863.0} x={1400} y={260} text="SACARLA ANTES" />);
  add(867.3, 874.0, () => <X.GuiaPag t={t} at={A("dice mi libro", 867)} out={873.8} x={1530} y={220} pag={PAG.receta} text="duras: les faltó tiempo" />);
  served(4, 867.3, 874.0);

  // ===== SECRETO 6 · cinco minutos de fuego alto, y la manteca es oro =====
  add(874.0, 880.5, () => <X.Banda t={t} at={FLIP[5]} out={880.3} n={6} text="5 MINUTOS DE FUEGO ALTO" />);
  add(885.1, 891.0, () => <X.FuegoNivel t={t} at={885.3} out={890.8} x={1560} y={380} lvl={3} label="AHORA SÍ: FUEGO ALTO" />);
  add(891.0, 895.7, () => <X.Cronometro t={t} at={891.2} out={895.5} x={1560} y={420} mins={5} label="5 MINUTOS, NO MÁS" />);
  add(899.2, 906.0, () => <Tag t={t} at={A("una costrita dorada", 901)} x={960} y={580} dx={300} dy={-240} text="COSTRITA DORADA" sub="CRUJIENTE EN LAS ORILLITAS" col={CH.maiz} out={905.8} size={50} />);
  add(906.0, 912.8, () => <Stamp t={t} at={A("sigue jugosa", 908)} out={912.6} text="JUGOSA POR DENTRO" x={1380} y={280} size={70} col={CH.maiz} />);
  add(917.4, 921.0, () => <Pill t={t} at={A("nunca al principio", 919)} out={920.8} x={1400} y={260} text="AL FINAL, NUNCA AL PRINCIPIO" col={CH.maiz} />);
  add(921.0, 929.8, () => <X.Card t={t} at={A("con una coladera", 921)} out={929.6} x={1450} y={280} from="right"><X.H s={48} c={CH.maiz}>COLADERA GRANDE</X.H><X.H s={44} f={HAND}>que escurra la manteca</X.H></X.Card>);
  add(934.5, 940.2, () => <Palomita t={t} at={A("en charola plana", 937)} out={940.0} y={240} text="EN CHAROLA PLANA: QUE RESPIREN" />);
  add(940.2, 945.3, () => { const p = sc(t, CZ); return <Tag t={t} at={A("la manteca que queda", 941)} x={p.x} y={p.y} dx={320} dy={-230} text="LA MANTECA QUE QUEDA" col={CH.maiz} out={945.1} size={50} />; });
  add(950.3, 957.5, () => <X.Card t={t} at={A("nunca la tiraba", 952)} out={957.3} x={1450} y={280} from="right"><X.H s={48} c={CH.maiz}>NUNCA LA TIRABA</X.H><X.H s={44} f={HAND}>tibia, colada, a su frasco</X.H></X.Card>);
  add(957.5, 964.1, () => <Stamp t={t} at={A("es oro", 962)} out={963.9} text="ES ORO" x={1380} y={280} size={110} col={CH.maiz} />);
  add(968.1, 974.5, () => <X.Card t={t} at={A("frijoles refritos", 960)} out={974.3} x={1450} y={280} from="right"><X.H s={46} c={CH.maiz}>FRIJOLES REFRITOS</X.H><X.H s={44} f={HAND}>o charros: saben a otra cosa</X.H></X.Card>);
  add(974.5, 980.0, () => <X.GuiaPag t={t} at={975.0} out={979.8} x={1530} y={220} pag={PAG.receta} text="el truco de Chayo: la manteca no se tira" />);
  add(984.4, 989.5, () => <Stamp t={t} at={A("dijo que no", 986)} out={989.3} text="DOÑA CHAYO DIJO QUE NO" x={960} y={240} size={62} col={CH.maiz} />);
  add(989.5, 996.2, () => <X.Senales t={t} out={996.0} x={1420} y={420} title="AL COLARLA" rows={[{ at: A("tibia no hirviendo", 989), text: "tibia, no hirviendo" }, { at: A("no haya ninos", 991), text: "sin niños cerca" }, { at: 994.5, text: "vidrio grueso o metal" }]} />);
  served(5, 984.4, 989.5);

  // ===== SECRETO 7 · se hacen el día antes =====
  add(1001.0, 1006.5, () => <X.Banda t={t} at={FLIP[6]} out={1006.3} n={7} text="SE HACEN EL DÍA ANTES" />);
  add(1006.5, 1013.2, () => <X.Card t={t} at={A("se hacen el dia antes", 1006)} out={1013.0} x={1450} y={280} from="right"><X.H s={52} c={CH.maiz}>EL DÍA ANTES</X.H><X.H s={44} f={HAND}>y la abuela, sentada en la mesa</X.H></X.Card>);
  add(1018.3, 1023.5, () => <X.GuiaPag t={t} at={A("mi libro lo dice asi", 1018)} out={1023.3} x={1530} y={220} pag={PAG.orden} text="el día antes, paso por paso" />);
  add(1040.5, 1048.2, () => <X.Refri t={t} at={1040.7} out={1048.0} x={1350} y={560} inAt={1042.0} />);
  add(1052.0, 1057.5, () => <Pill t={t} at={A("no se queda fuera", 1054)} out={1057.3} x={1400} y={260} text="NO SE QUEDA AFUERA LA TARDE" />);
  add(1057.5, 1099.1, () => <Y.DiaFiesta t={t} out={A("y tu sentada", 1090) - 0.2} x={960} y={250} rows={[{ at: A("a las 12", 1056), h: "12:00", text: "al horno, 200°, 20 min" }, { at: A("a las dos", 1081), h: "2:00", text: "tortillas a la hielera" }, { at: A("a las cuatro", 1090), h: "4:00", text: "¡a la mesa!" }]} />);
  add(1070.0, 1075.5, () => <Stamp t={t} at={1070.2} out={1075.3} text="MÁS CRUJIENTES" x={1380} y={860} size={80} col={CH.maiz} />);
  add(1075.5, 1080.9, () => <X.Card t={t} at={A("son mejores que las recien hechas", 1075)} out={1080.7} x={1450} y={860} from="right"><X.H s={44} c={CH.maiz}>MEJORES QUE RECIÉN HECHAS</X.H></X.Card>);
  add(1093.0, 1099.1, () => <Palomita t={t} at={A("y tu sentada", 1093)} out={1098.9} y={240} text="Y TÚ, SENTADA, CON TU VESTIDO" />);
  add(1102.6, 1110.5, () => <X.Orden t={t} at={A("los frijoles charros", 1104) - 0.2} out={1110.3} steps={[{ label: "frijoles charros", at: A("los frijoles charros", 1104) }, { label: "agua de jamaica", at: A("el agua de jamaica", 1105) }, { label: "arroz con leche", at: A("el arroz con leche", 1107) }, { label: "salsa verde", at: A("la salsa verde", 1108) }]} />);
  add(1110.5, 1115.2, () => <X.GuiaPag t={t} at={A("el plan hora por hora", 1111)} out={1115.0} x={1530} y={220} pag={PAG.orden} text="el plan, hora por hora" />);
  served(6, 1102.6, 1106.5);

  // ===== cuatro cosas más =====
  add(1120.0, 1125.5, () => <Pensado t={t} at={A("la fiesta camina sola", 1122)} out={1125.3} x={1250} y={300} text="…y la fiesta camina sola" size={92} />);
  add(1125.5, 1132.1, () => <X.Card t={t} at={A("cuatro cosas mas", 1126)} out={1131.9} x={1450} y={280} from="right"><X.H s={50} c={CH.maiz}>4 COSAS MÁS</X.H><X.H s={44} f={HAND}>de esta misma olla</X.H></X.Card>);
  add(1136.8, 1142.5, () => <X.Card t={t} at={1137.0} out={1142.3} x={1450} y={280} from="right"><X.H s={48} c={CH.maiz}>1 · CÓMO SE SIRVE</X.H><X.H s={44} f={HAND}>3 tacos por persona</X.H></X.Card>);
  add(1142.5, 1149.2, () => <Tag t={t} at={A("el pico de gallo", 1142)} x={960} y={600} dx={320} dy={-240} text="PICO DE GALLO" sub="Y LIMONES PARTIDOS" col={CH.maiz} out={1149.0} size={50} />);
  add(1153.9, 1160.0, () => <X.Card t={t} at={1154.1} out={1159.8} x={1440} y={760} from="right"><X.H s={46} c={CH.maiz}>2 · SI SON 10</X.H><X.H s={42} f={HAND}>3 kg de carne · 1 kg de manteca</X.H><X.H s={42} f={HAND}>unos $850 toda la comida</X.H></X.Card>);
  add(1153.9, 1160.0, () => <X.GuiaPag t={t} at={1154.3} out={1159.8} x={1530} y={220} pag={PAG.cant} text="para 10, para 25 o para 50" />);
  add(1160.0, 1164.8, () => <X.Card t={t} at={A("y si son 50", 1160)} out={1164.6} x={1450} y={280} from="right"><X.H s={46} c={CH.maiz}>SI SON 50</X.H><X.H s={42} f={HAND}>14 kg, en dos ollas de 7</X.H></X.Card>);
  add(1171.1, 1176.0, () => <Precio t={t} at={1171.3} out={1175.8} x={1440} y={140} top="$4,270" sub="LA FIESTA DE 50" />);
  add(1176.0, 1184.5, () => <Y.Duran t={t} at={A("lo que sobra", 1175)} out={1184.3} x={1350} y={560} rows={[{ l: "refrigerador", v: "3 días", w: 0.2, at: A("tres dias", 1178), c: "#8fd6ff" }, { l: "congelador", v: "2 meses", w: 1, at: 1183.0, c: "#d9f3ff" }]} />);
  add(1192.5, 1199.0, () => <X.Card t={t} at={1192.7} out={1198.8} x={1450} y={280} from="right"><X.H s={46} c={CH.maiz}>SARTÉN SECO, SIN ACEITE</X.H><X.H s={42} f={HAND}>o al horno 15 min a 200°</X.H></X.Card>);
  add(1203.9, 1209.5, () => <X.Card t={t} at={A("lo que va alrededor", 1202)} out={1209.3} x={1450} y={280} from="right"><X.H s={48} c={CH.maiz}>4 · LO QUE VA ALREDEDOR</X.H><X.H s={42} f={HAND}>charros · arroz rojo</X.H></X.Card>);
  add(1209.5, 1214.2, () => <Tag t={t} at={A("de 10 litros", 1209)} x={960} y={560} dx={300} dy={-240} text="JAMAICA, 10 LITROS" col={CH.maiz} out={1214.0} size={50} />);
  add(1218.7, 1225.5, () => <Nota t={t} at={A("las tortillas de dos dias", 1221)} out={1225.3} x={1480} y={300} lines={["Tortillas de 2 días:", "las mejores pa'", "chilaquiles."]} rot={3} w={480} />);

  // ===== lo que puede salir mal =====
  add(1225.5, 1230.8, () => <X.GuiaPag t={t} at={A("lo que puede salir mal", 1225)} out={1230.6} x={1530} y={220} pag={PAG.mal} text="si te sale mal: cómo se arregla" />);
  add(1236.2, 1246.5, () => <X.FixCard t={t} at={1236.4} out={1246.3} x={960} y={540} prob="SECAS" fix={["manteca caliente", "20 min a fuego bajo", "tapadas"]} fixAt={A("les agregas manteca", 1237)} />);
  add(1252.1, 1257.0, () => <X.FixCard t={t} at={1252.3} out={1256.8} x={960} y={540} prob="DURAS" fix={["fuego bajo, sin apurarla", "hasta que el tenedor entre"]} fixAt={1252.8} />);
  add(1257.0, 1264.0, () => <X.FixCard t={t} at={A("si quedaron palidas", 1257)} out={1263.8} x={960} y={540} prob="PÁLIDAS" fix={["los 5 min de fuego alto", "o la naranja"]} fixAt={A("te faltaron los 5", 1258)} />);
  add(1269.3, 1281.5, () => <X.FixCard t={t} at={A("se te hizo caldo", 1269)} out={1281.3} x={960} y={540} prob="SE HIZO CALDO" fix={["destápala", "o pártela en dos ollas"]} fixAt={A("destapala", 1278)} />);
  add(1285.2, 1290.0, () => <Stamp t={t} at={A("esa ya no se guarda", 1286)} out={1289.8} text="ÉSA YA NO SE GUARDA" x={1300} y={280} size={70} />);
  add(1290.0, 1295.9, () => <X.FixCard t={t} at={A("se te aguadaron", 1289)} out={1295.7} x={960} y={540} prob="SE AGUADARON" fix={["charola plana, extendidas", "horno o sartén seco"]} fixAt={1293.5} />);

  // ===== la cuenta =====
  add(1302.1, 1307.0, () => <Nota t={t} at={1302.3} out={1306.8} x={1480} y={300} lines={["No es que no sepas,", "mija: nadie te", "lo había dicho."]} rot={-3} w={500} />);
  add(1307.0, 1315.7, () => <X.GuiaPag t={t} at={A("lo que compras", 1309)} out={1315.5} x={1530} y={220} pag={PAG.lista} text="lo que compras para 25" />);
  add(1316.0, 1368.6, () => <Receipt t={t} sc={0.62} rows={[
    { at: A("el cerdo", 1315), item: "cerdo, 7 kg", $: 980 }, { at: A("la manteca", 1318), item: "manteca", $: 120 }, { at: A("el frijol bayo", 1320), item: "frijol bayo", $: 80 },
    { at: A("el chorizo", 1324), item: "chorizo", $: 70 }, { at: A("el arroz", 1326), item: "arroz", $: 128 }, { at: A("la leche", 1328), item: "leche", $: 112 },
    { at: A("el jitomate", 1330), item: "jitomate, tomate, cebolla", $: 178 }, { at: A("el ajo", 1336), item: "ajo, serrano, zanahoria", $: 71 }, { at: A("el cilantro", 1340), item: "cilantro y epazote", $: 40 },
    { at: A("limon y naranja", 1343), item: "limón y naranja", $: 55 }, { at: A("las tortillas", 1347), item: "tortillas", $: 104 }, { at: A("el aceite", 1349), item: "aceite", $: 45 },
    { at: A("el azucar", 1351), item: "azúcar, piloncillo, canela", $: 75 }, { at: A("la jamaica", 1357), item: "jamaica", $: 75 }]}
    totalAt={A("todo junto", 1358)} x={1420} y={110} out={1368.4} title="LA FIESTA DE 25" />);
  add(1368.7, 1374.0, () => <X.Gente t={t} at={A("comen 25 personas", 1370)} out={1373.8} x={960} y={540} n={25} label="25 PERSONAS, FIESTA COMPLETA" cols={13} />);
  add(1374.0, 1385.3, () => <Precio t={t} at={A("85 pesos por persona", 1379)} out={1385.1} x={1440} y={140} top="$85" sub="POR PERSONA" />);
  add(1385.4, 1390.5, () => <Precio t={t} at={A("45 pesos el plato", 1386)} out={1390.3} x={1440} y={140} top="$45" sub="EL PLATO DE 3 TACOS" />);
  add(1390.5, 1397.6, () => <X.Card t={t} at={A("una taquiza para 25", 1390)} out={1397.4} x={1400} y={300} from="right" col="#ff8a6a"><X.H s={46} c="#ff8a6a">LA TAQUIZA</X.H><X.H s={42} f={HAND}>de $180 a $250 por cabeza</X.H><X.H s={42} f={HAND}>de $4,500 a $6,250</X.H></X.Card>);
  add(1402.5, 1408.5, () => <Stamp t={t} at={A("todavia te sobra dinero", 1403)} out={1408.3} text="Y TODAVÍA TE SOBRA" x={1300} y={280} size={74} col={CH.maiz} />);
  add(1408.5, 1414.7, () => <X.GuiaPag t={t} at={A("179 dolares", 1410)} out={1414.5} x={1530} y={220} pag={PAG.usa} text="unos 179 dólares: menos de 7 por persona" />);

  // ===== resumen, tarea, comentarios, próximo, cierre =====
  plateLabels(1418.9, 1453.3, RES);
  add(1453.4, 1465.1, () => <X.Tarea t={t} at={A("tu tarea para esta semana", 1453)} out={1464.9} x={1400} y={560} rows={[{ at: A("deja la olla destapada", 1458), text: "destapada la 1ª hora" }, { at: A("no le subas al fuego", 1461), text: "fuego alto sólo los últimos 5 min" }]} />);
  add(1470.2, 1475.5, () => <Pensado t={t} at={A("como las de la fonda", 1470)} out={1475.3} x={1250} y={300} text="…como las de la fonda" size={92} />);
  add(1475.5, 1480.4, () => <X.Card t={t} at={A("en los comentarios", 1476)} out={1480.2} x={1400} y={300} from="right"><X.H s={44} c={CH.maiz}>¿EN TU CASA LLEVAN...?</X.H><X.H s={44} f={HAND}>naranja · leche · refresco</X.H></X.Card>);
  add(1484.9, 1491.0, () => <X.Card t={t} at={1485.1} out={1490.8} x={1400} y={300} from="right"><X.H s={48} c={CH.maiz}>¿Y DE QUÉ PARTE ERES?</X.H><X.H s={42} f={HAND}>los leo todos, con mi cafecito</X.H></X.Card>);
  add(1491.0, 1497.6, () => <X.Proximo t={t} at={A("la proxima vez", 1492)} out={1497.4} x={1420} y={540} />);
  add(1501.5, 1507.5, () => <Pensado t={t} at={A("la carnita no quiere prisa", 1500)} out={1507.3} x={1250} y={300} text="…no quiere prisa, mija" size={96} />);
  add(1507.5, 1514.6, () => <X.Senales t={t} out={1514.4} x={1420} y={420} title="LA CARNITA" rows={[{ at: A("tres carnes", 1508), text: "tres carnes" }, { at: A("su manteca", 1510), text: "su manteca" }, { at: A("su naranja", 1511), text: "su naranja" }, { at: A("el fuego bajito", 1511), text: "y el fuego bajito" }]} />);
  return L;
};

// ---------------- EL RESTO ----------------
export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const idx = PARTS.findIndex((p) => t >= p.a && t < p.b);
  if (inAv(t)) L.push(<Avatar key="av" t={t} />);
  else if (idx >= 0) {
    const p = PARTS[idx], nx = PARTS[idx + 1];
    if (p.c) {
      const portaled = idx > 0 && PARTS[idx - 1].pt && Math.abs(PARTS[idx - 1].b - p.a) < 1e-6;
      L.push(<Clip key={"c" + idx} k={p.c} t={t} a={portaled ? p.a - 0.7 : p.a} o={p.o} z={p.z} />);
    } else {
      L.push(<World key="w" t={t} />);
      if (p.pt && nx?.c && Math.abs(nx.a - p.b) < 1e-6) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, p.pt); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} o={nx.o} z={nx.z} /></Portal>); }
      }
    }
  } else if (t < WIN[0].ms) L.push(<World key="w0" t={t} />);
  L.push(...Ov(t));
  // vapor en cada costura entre dos partes seguidas (salvo las que ya son portal)
  PARTS.forEach((p, i) => { const nx = PARTS[i + 1]; if (nx && Math.abs(nx.a - p.b) < 1e-6 && !(p.pt && nx.c) && Math.abs(t - p.b) < 0.4) L.push(<SteamWipe key={"sw" + i} t={t} mid={p.b} w={0.38} />); });
  // destello suave al entrar a cada secreto
  FLIP.forEach((a, i) => { if (Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.45} w={0.3} />); });
  // fundido final
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
