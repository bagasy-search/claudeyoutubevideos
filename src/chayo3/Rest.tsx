// chayo3 · EL RESTO DEL VIDEO (97 s → final). Mismo mundo y misma cámara que el minuto 1: la cocina de adobe, la mesa de fiesta con sus
// siete platos de barro (uno por secreto: al cerrar cada secreto su plato se sirve), el recetario de mamá Cuca que pasa una hoja por
// secreto, el comal/sartén/charola/olla de remojo como estaciones, el limonero, el puesto de chiles del mercado. Entre mundo y toma real
// sólo portales y vapor; el avatar entra en sus ventanas. Cada pieza nace con la palabra que la nombra (at("frase")).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PT2, PLATES, screenOf, camSpeed, setKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, Flash, HAND, P, Portal, Tag, at, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Aroma, Nota, Reloj, Pensado, Palomita, Stamp, Precio, Pill, MIN1_END } from "./Min1";
import * as X from "./piezas";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms >= 100);
const inAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
export const REST_START = MIN1_END;
export const END_T = 1878.7; // voz 1877,7 + 1 s de silencio
const A = (ph: string, after: number) => at(ph, after);

// páginas REALES de la guía (guia_chayo.md, paginación definitiva): Libro 5 "La Fiesta del Rancho" · Fiesta 3 "El Mole del Bautizo para 50"
const PAG = { mole: "Libro 5 · pág. 53", lista: "Libro 5 · pág. 50", chica: "Libro 3 · pág. 51" };

// ---------------- cámaras con nombre ----------------
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
  charola: { p: [-0.55, 1.3, 0.75], l: PT2.charola, fov: 34 }, charolaT: { p: [-0.72, 1.62, 0.4], l: PT2.charola, fov: 34 },
  remojo: { p: [1.05, 1.45, 0.15], l: PT2.remojo, fov: 34 }, remojo2: { p: [0.7, 1.18, -0.12], l: PT2.remojo, fov: 31 },
  limon: { p: [3.0, 1.5, 1.6], l: [5.4, 1.3, -1.6], fov: 50 }, limon2: { p: [3.6, 1.2, 0.9], l: [5.3, 0.9, -1.4], fov: 46 },
  patio: { p: [6.6, 1.75, 3.6], l: [10, 1.0, 0.8], fov: 42 }, patio2: { p: [6.9, 1.7, 3.4], l: [10, 1.0, 0.8], fov: 42 },
  mercado: { p: [6.6, 1.5, 7.6], l: [6.6, 0.95, 5.4], fov: 38 }, mercado2: { p: [6.25, 1.3, 6.7], l: [6.6, 0.95, 5.4], fov: 35 },
  canasta: { p: [-1.9, 1.15, 1.7], l: [-2.6, 0.25, 0.8], fov: 38 }, salida: { p: [3.4, 2.9, 6.2], l: [0, 0.9, -0.6], fov: 44 },
};
PLATES.forEach((q, i) => { C["pl" + i] = { p: [q[0], 1.25, 0.95], l: [q[0], 0.82, 0.33], fov: 34 }; C["pl" + i + "b"] = { p: [q[0], 1.08, 0.7], l: [q[0], 0.82, 0.33], fov: 32 }; });

// ---------------- la línea de tiempo: partes de mundo (w) y tomas reales (c) entre las ventanas del avatar ----------------
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string; pt?: V; z?: [number, number] };
const w = (a: number, b: number, k0: string, k1: string, pt?: V): Part => ({ a, b, k0, k1, pt });
const c = (a: number, b: number, id: string, z?: [number, number]): Part => ({ a, b, c: id, z });
const FIRE = PT.fire, LIMON: V = [5.6, 1.4, -1.8], CANASTA: V = [-2.6, 0.25, 0.8], POTS: V = [1.05, 2.3, -2.86];
const PARTS: Part[] = [
  // promesa
  w(97, 104.5, "top", "topB"), w(109.3, 119.7, "topB", "topC"), w(123.8, 136.4, "pl2", "pl2b"),
  // quién es Chayo
  w(141.6, 148.6, "wide", "fogon", FIRE), c(148.6, 152.1, "i_fogon"),
  w(157.1, 162.2, "comal", "pots", POTS), c(162.2, 167.7, "s_cazuela"),
  c(173.2, 178.2, "i_cta"), w(178.2, 186.3, "libro", "libro2"),
  // la historia
  w(190.5, 201.8, "wide2", "patio"),
  c(206.4, 210.6, "s_boda60"), w(210.6, 218.5, "patio2", "canasta"),
  c(223.9, 232.2, "s_nina"), w(232.2, 237.0, "cazL", "cazL2"),
  w(242.3, 253.1, "libro", "libro2"),
  w(258.1, 271.3, "caz", "caz2"), w(274.7, 286.8, "cazL", "topC"),
  // SECRETO 1
  w(291.5, 294.3, "libro2", "libro2"), w(294.3, 302.7, "comal", "comal2"),
  c(307.6, 312.6, "u_quemado"), w(312.6, 320.3, "mercado", "mercado2"),
  w(326.4, 338.0, "mercado2", "mercado"),
  c(343.0, 349.4, "u_limpiar"), w(349.4, 355.8, "canasta", "fogon2"),
  c(360.5, 364.6, "u_trapo"), w(364.6, 372.3, "comal", "comalT"),
  w(377.8, 384.2, "comalT", "comalT2"), c(384.2, 388.6, "u_contar"),
  w(393.0, 399.2, "comal2", "comal"), c(399.2, 405.7, "u_comal"),
  w(410.5, 414.6, "comalT2", "comal2"), c(414.6, 420.5, "u_tirar"),
  w(424.4, 434.4, "comal", "fogon"),
  w(438.4, 443.6, "caz", "caz2"), w(443.6, 449.4, "mercado", "mercado2"),
  c(453.2, 459.0, "u_mercado"), w(459.0, 463.7, "mercado2", "mercado"),
  c(469.8, 473.9, "u_doblar"), w(473.9, 476.4, "pl0", "pl0b"), w(476.4, 479.6, "libro2", "libro2"), w(479.6, 483.2, "comal", "comal2"),
  // SECRETO 2
  w(488.5, 495.0, "comalT", "comalT2"), w(495.0, 501.9, "libro", "libro2"),
  w(508.0, 513.2, "libro2", "libro"), w(513.2, 519.7, "cazL", "caz"),
  c(524.8, 530.6, "d_manteca"), w(530.6, 537.0, "comal", "comal2"),
  w(541.8, 547.6, "comalT", "comalT2"), c(547.6, 553.7, "d_ajonjoli"),
  w(558.7, 563.6, "charola", "charolaT"), c(563.6, 570.2, "d_cacahuate"),
  c(574.1, 580.6, "d_pasas"), w(580.6, 586.7, "comal2", "comalT"),
  c(590.7, 594.2, "d_platano"), c(594.2, 601.0, "d_tortilla"),
  c(606.3, 611.2, "d_charola"), w(611.2, 618.8, "charolaT", "charola"),
  c(623.4, 629.0, "p_charola"), w(629.0, 635.5, "comalT2", "comal"),
  w(641.1, 650.1, "pl1", "pl1b"),
  // SECRETO 3
  w(654.2, 657.2, "libro2", "libro2"), w(657.2, 667.6, "remojo", "remojo2"),
  c(671.5, 676.6, "t_remojo"), w(676.6, 683.8, "remojo2", "remojo"),
  w(690.1, 694.0, "remojo", "remojo2"), w(694.0, 697.4, "limon", "limon2", LIMON), c(697.4, 700.1, "t_tirar_agua"),
  w(705.3, 712.0, "remojo", "remojo2"), c(712.0, 718.7, "p_agua"),
  c(723.0, 727.2, "t_escurrir"), w(727.2, 732.8, "caz", "caz2"),
  c(737.1, 743.0, "t_guajolote"), w(743.0, 748.7, "fogon", "fogon2"),
  w(754.6, 767.0, "wide", "wide2"),
  w(772.4, 778.0, "comal", "comal2"), w(778.0, 781.8, "pl2", "pl2b"),
  // CTA 2
  c(786.9, 791.2, "c2_lista"), w(791.2, 799.5, "libro", "libro2"),
  // SECRETO 4
  w(803.1, 808.6, "libro2", "libro"), w(808.6, 815.8, "repisa", "repisa2"),
  w(821.4, 832.3, "repisa2", "repisa"),
  c(836.7, 842.2, "k_clavos"), w(842.2, 850.5, "comalT", "comalT2"),
  w(855.3, 860.6, "comal2", "comal"), c(860.6, 866.1, "k_especias"),
  w(871.8, 880.0, "comal", "comal2"), w(880.0, 884.8, "comalT", "comalT2"),
  w(889.2, 894.2, "comalT2", "comal"), c(894.2, 899.9, "k_verduras"),
  w(903.9, 909.2, "comal2", "comalT"), c(909.2, 916.1, "k_semillas"),
  w(921.3, 934.4, "repisa", "wide2"),
  w(940.1, 951.9, "pl3", "pl3b"),
  // SECRETO 5
  w(956.1, 959.2, "libro2", "libro2"), w(959.2, 967.6, "caz2", "cazT"),
  w(973.2, 976.4, "caz", "caz2"), c(976.4, 985.0, "m_metate"),
  c(988.6, 995.2, "m_molino"), w(995.2, 1001.3, "patio", "patio2"),
  c(1007.7, 1013.2, "m_licuar"), w(1013.2, 1019.8, "charola", "remojo"),
  w(1023.2, 1028.2, "caz", "caz2"), c(1028.2, 1035.6, "p_colar"),
  c(1041.8, 1046.6, "m_pellejos"), w(1046.6, 1052.4, "cazT", "cazT2"),
  w(1057.2, 1070.6, "cazL", "cazL2"),
  w(1074.0, 1086.1, "mercado", "mercado2"),
  w(1089.4, 1099.0, "pl4", "pl4b"),
  // SECRETO 6
  w(1102.4, 1105.6, "libro2", "libro2"), w(1105.6, 1113.9, "caz", "caz2"),
  w(1119.6, 1124.6, "caz2", "cazL"), c(1124.6, 1130.2, "f_manteca"),
  c(1134.1, 1140.2, "f_echar"), c(1140.2, 1146.2, "p_freir"),
  c(1151.7, 1157.2, "f_mover"), w(1157.2, 1163.8, "cazT", "cazT2"),
  w(1168.9, 1173.2, "cazT2", "cazT"), c(1173.2, 1179.6, "f_fondo"),
  w(1184.1, 1190.2, "cazT", "cazT2"), c(1190.2, 1198.1, "f_ojitos"),
  w(1203.9, 1214.2, "caz", "cazL"),
  w(1219.1, 1223.2, "cazL2", "caz2"), c(1223.2, 1228.5, "f_caldo"),
  w(1233.7, 1241.2, "caz2", "cazT"), c(1241.2, 1246.7, "f_chocolate"),
  w(1251.1, 1260.9, "caz", "caz2"),
  w(1266.1, 1278.5, "cazL", "caz"),
  c(1282.0, 1288.2, "f_probar"), w(1288.2, 1294.2, "caz2", "cazT"),
  w(1300.4, 1311.6, "caz", "cazL"),
  w(1317.1, 1324.2, "cazL2", "caz"), w(1324.2, 1329.8, "pl5", "pl5b"),
  // SECRETO 7
  w(1334.3, 1337.6, "libro2", "libro2"), w(1337.6, 1345.5, "wide", "wide2"),
  w(1350.2, 1360.5, "caz", "caz2"),
  w(1366.0, 1372.2, "caz2", "cazT"), c(1372.2, 1379.3, "s7_noche"),
  w(1383.3, 1394.7, "cazL", "caz"),
  c(1399.5, 1405.6, "s7_calentar"), c(1405.6, 1412.3, "s7_piezas"),
  w(1416.2, 1428.3, "wide2", "wide"),
  w(1433.4, 1439.2, "libro", "libro2"), c(1439.2, 1443.8, "s7_enojado"),
  w(1448.2, 1462.0, "caz", "cazL"),
  w(1467.4, 1478.6, "patio", "patio2"),
  w(1484.1, 1494.0, "topC", "top"),
  // variantes
  w(1498.9, 1505.6, "caz", "caz2"), c(1505.6, 1511.4, "v_costilla"),
  w(1516.2, 1520.2, "topB", "top"), c(1520.2, 1526.9, "v_arroz"),
  w(1532.1, 1539.4, "top", "topC"), c(1539.4, 1544.4, "v_adorno"),
  w(1549.4, 1560.8, "pl6", "pl6b"),
  c(1566.3, 1572.4, "v_enmoladas"), c(1572.4, 1577.3, "v_tamales"),
  c(1582.2, 1589.0, "v_huevos"), w(1589.0, 1594.5, "caz", "caz2"),
  // lo que puede salir mal
  w(1598.7, 1610.0, "cazL", "cazL2"),
  w(1614.1, 1624.2, "caz2", "caz"),
  w(1629.6, 1642.3, "cazT", "caz"),
  w(1645.7, 1657.2, "cazL2", "cazL"),
  c(1663.5, 1670.0, "pr_cortado"), w(1670.0, 1675.2, "cazT", "cazT2"),
  c(1679.8, 1685.6, "pr_batir"), w(1685.6, 1692.2, "mercado", "mercado2"),
  // la cuenta
  c(1697.6, 1702.6, "h_fonda_plato"), c(1702.6, 1709.2, "din_mesa"),
  w(1714.8, 1728.6, "top", "topB"),
  c(1732.8, 1738.2, "din_guajolote"), w(1738.2, 1744.0, "patio", "patio2"),
  w(1749.6, 1758.9, "topB", "topC"),
  w(1764.5, 1778.5, "charola", "charolaT"),
  // resumen, tarea, comentarios, próximo, cierre
  w(1782.6, 1793.9, "top", "topB"), w(1799.4, 1812.1, "topB", "top"),
  w(1816.1, 1821.4, "comalT", "comal"), c(1821.4, 1827.2, "p_comal"),
  w(1832.4, 1843.4, "caz", "cazL"),
  w(1847.6, 1861.3, "fogon2", "fogon"),
  c(1865.3, 1868.8, "z_servir"), c(1868.8, 1872.4, "z_fogon"), w(1872.4, END_T, "caz", "salida"),
];
// llaves de cámara: inicio y fin de cada parte de mundo (los saltos caen siempre dentro de una toma, del avatar o del vapor)
setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
  const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
  const k0 = C[p.k0!], k1 = C[p.k1!];
  return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
}));
const partAt = (t: number) => PARTS.find((p) => t >= p.a && t < p.b);

// ---------------- recetario: una hoja por secreto ----------------
const RECETARIO = [
  { l: ["# Mole de Fiesta", "de mi mamá Cuca", "", "Pa' 20 platos.", "Nadie entra a la cocina", "enojado.", "", "— Refugio, 1961"], r: ["chiles uno por uno,", "contando...", "cada cosa frita aparte", "el agua del remojo NO", "las especias enteras", "colar dos veces", "freír hasta los ojitos", "y de un día pa' otro"] },
  { l: ["# 1. Los chiles", "250 g ancho", "250 g mulato", "150 g pasilla", "4 ó 5 chipotles", "", "quitar rabo, venas", "y semillas (guardar)"], r: ["comal a fuego medio", "de 2 en 2, nunca en montón", "contar hasta 10 ó 15", "voltear: otros 10", "", "huele a pasas = listo", "humo negro = pa' fuera"] },
  { l: ["# 2. Las cositas", "½ taza ajonjolí", "1 puño cacahuate", "1 puño almendra", "1 puñito pasitas", "1 plátano macho negro", "1 tortilla de ayer", "½ bolillo duro"], r: ["en manteca, UNA A LA VEZ", "1 ajonjolí (2 cdas aparte)", "2 cacahuate y almendra", "3 pasitas: se inflan, fuera", "4 plátano casi negro", "5 tortilla: que truene", "6 bolillo dorado"] },
  { l: ["# 3. El remojo", "agua recién hervida", "un plato encima", "20 minutos, no más", "", "el agua: AL LIMONERO"], r: ["se licúa con CALDO", "guajolote desde temprano", "cebolla, ajo, zanahoria", "hierbas de olor", "", "6 kg = 20 gentes"] },
  { l: ["# 4. Especias", "1 raja de canela", "6 clavos", "6 pimientas gordas", "10 pimientas negras", "½ cdta comino", "½ cdta anís", "1 cdta orégano"], r: ["pizca tomillo y mejorana", "comal bajito, 2 minutos", "", "verduras tatemadas:", "3 jitomates, 3 tomates", "½ cebolla, 1 ajo", "1 cda semillas de chile"] },
  { l: ["# 5. Moler", "en tandas chicas", "chiles + 2 tazas caldo", "cositas + 1 taza", "especias y verduras", "", "coladera fina"], r: ["colar, volver a licuar", "los pellejitos,", "y colar OTRA VEZ", "", "siempre caldo,", "nunca agua"] },
  { l: ["# 6. Freír", "4-5 cdas manteca", "que humee tantito", "todo de un jalón", "(¡los niños fuera!)", "", "pala sin parar", "30 a 40 minutos"], r: ["hasta los OJITOS", "caldo de taza en taza", "2 tablillas chocolate", "piloncillo: un huevo", "sal al final", "15 min más, bajito"] },
  { l: ["# 7. Un día antes", "enfriar destapado", "(máx. 2 horas)", "al refri", "", "mañana sabe a fiesta"], r: ["calentar bajito", "con caldo caliente", "las piezas 15 min", "", "Nadie entra a la cocina", "enojado."] },
];
const GUIA = [
  { l: ["# Las 5 Ollas de", "# Doña Chayo", "", "Libro 5", "La Fiesta del Rancho", "", "recetas de mi abuela", "con sus pesos"], r: ["Fiesta 3", "El Mole del Bautizo pa' 50", "", "apertura ............ 47", "lista del mercado ... 50", "pasta del mole rojo . 53", "pollo en mole ....... 54"] },
  { l: ["# Pasta del Mole Rojo", "pág. 53", "", "1 kg de chiles secos", "pa' la fiesta de 50", "", "con sus cantidades", "y sus tiempos"], r: ["paso por paso,", "como en el rancho", "", "y en la pág. 54:", "el pollo en mole", "pa' 50 gentes"] },
  { l: ["# Lista del mercado", "pág. 50 · pa' 50 gentes", "", "unos $2,208", "de mercado", "", "unos $44 por persona"], r: ["contra 200 a 280", "pesos por persona", "de un banquete"] },
  { l: ["# Pollo en Mole Rojo", "Libro 3 · pág. 51", "", "pa' 4 gentes", "y 5 bolsas de mole", "pa' otros días"], r: ["unos $61", "el plato del domingo"] },
];

// ---------------- tiempos clave ----------------
const SERVE = [473.9, 645.0, 778.2, 948.0, 1094.0, 1326.0, 1484.6];           // el plato del secreto i se sirve
const FLIP = [292.0, 476.9, 654.6, 803.5, 956.5, 1102.8, 1334.7];             // el recetario pasa la hoja del secreto i
const PROM = [A("como se tuestan", 97), A("por que cada cosa", 97), 109.6, 109.9, A("por que se cuela", 109), A("el paso que hace", 109), A("el ultimo secreto", 109)];
const RES = [A("1 los chiles", 1782), A("2 cada cosita", 1782), A("el agua del remojo nunca", 1790), A("especias enteras tostadas", 1798), A("5 se muele", 1798), A("6 el mole se frie", 1798), A("se hace un dia antes", 1808)];
const G1 = A("es la guia de mi cocina", 178), G1P = A("completito", 178), G2 = 791.5, G2P = A("cantidad chica", 791);
const isGuia = (t: number) => (t >= 173.2 && t < 186.3) || (t >= 786.9 && t < 799.5);
const step = (t: number, ts: number[]) => ts.reduce((acc, a) => acc + win(t, a, a + 0.5), 0);

const worldAt = (t: number): WorldProps => {
  const guia = isGuia(t);
  const plateServed = PLATES.map((_, i) => win(t, SERVE[i], SERVE[i] + 1.2));
  const plateOn = PLATES.map((_, i) => Math.max(
    win(t, PROM[i], PROM[i] + 0.3) * (1 - win(t, 136.0, 136.4)),
    i === 2 ? win(t, 123.8, 124.3) * (0.6 + 0.4 * Math.sin(t * 5)) * (1 - win(t, 136, 136.4)) : 0,
    win(t, SERVE[i] - 0.4, SERVE[i]) * (1 - win(t, SERVE[i] + 2, SERVE[i] + 3)),
    win(t, RES[i], RES[i] + 0.3) * (1 - win(t, 1812, 1812.3)),
  ));
  const sartenOn = t >= 479 && t < 641.1;
  const fryK = t < 495 ? 9 : t < 580 ? 0 : t < 600 ? 3 : 9;
  const chiles = t >= 291.4 && t < 307.6 ? 14 * win(t, A("todos juntos", 294) - 0.3, A("todos juntos", 294) + 0.4) + (t > 300 ? 0 : 0)
    : t >= 364 && t < 470 ? 3 * win(t, A("de dos en dos", 364), A("de dos en dos", 364) + 0.6)
    : t >= 772 && t < 778 ? 3 : t >= 1816 && t < 1830 ? 3 : 0;
  const toast = t >= 772 && t < 778 ? 0 : t >= 1816 ? 1 : win(t, 379, 402);
  const rawK = t >= 1104 && t < 1163.8 ? 1 : t >= 1163.8 && t < 1175 ? 1 - win(t, 1163.8, 1170.5) : 0;
  const fuegoAlto = A("con el fuego alto", 1300);
  return {
    t,
    night: Math.max(win(t, 1349.5, 1350.2) * (1 - win(t, 1386, 1390)), win(t, 1872.4, 1877) * 0.55),
    fire: 1 + win(t, fuegoAlto - 0.2, fuegoAlto + 0.4) * (1 - win(t, 1316, 1318)) * 1.2 + (t >= 1816 ? 0.3 : 0),
    steamCaz: (rawK > 0.5 ? 0.6 : 1) * (/^cazT/.test(partAt(t)?.k0 ?? "") ? 0.3 : /^(caz|pl)/.test(partAt(t)?.k0 ?? "caz") ? 1 : /^top/.test(partAt(t)?.k0 ?? "") ? 0.4 : 0.22),
    steamComal: /^comal/.test(partAt(t)?.k0 ?? "") ? 0.18 : 1,
    ojitos: t >= 1184 && t < 1198 ? 1 : 0.8,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.16 * v),
    book: guia
      ? { open: ei(t, t < 500 ? G1 + 0.2 : G2, (t < 500 ? G1 + 0.2 : G2) + 1.2), flip: t < 500 ? ei(t, G1P, G1P + 0.9) : 2 + ei(t, G2P, G2P + 0.9), pages: GUIA }
      : { open: 1, flip: FLIP.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0), pages: RECETARIO },
    guia: guia ? 1 : 0,
    partyPeople: (t >= 190 && t < 219) || (t >= 1467 && t < 1479) || t >= 1872 ? 1 : 0,
    patioLights: Math.max(t >= 1467 && t < 1479 ? 1 : 0, win(t, 1873, 1876)),
    chiles, toast, burnt: t >= 405 && t < 421 ? win(t, 409.6, 410.8) : 0,
    sarten: sartenOn ? 1 : 0, fry: fryK,
    charola: t >= 555 && t < 1030 ? step(t, [559.0, A("luego los cacahuates", 560), 581.0, 594.4, 598.3, 603.0]) : t >= 1760 && t < 1780 ? 6 : 0,
    remojo: t >= 654 && t < 705 ? 0.3 + 0.7 * win(t, 676.6, 683.5) : t >= 705 && t < 760 ? 0.15 + 0.2 * win(t, 707, 711) : t >= 1013 && t < 1020 ? 0.3 : 0,
    tapa: t >= 705 && t < 760 ? win(t, A("les pones un plato", 705), A("les pones un plato", 705) + 0.6) : 0,
    aguaLimon: t >= 690 && t < 1000 ? win(t, A("al pie del limonero", 690) - 0.3, A("al pie del limonero", 690) + 1.6) : 0,
    especias: t >= 842 && t < 880 ? win(t, 842.4, 843.2) : 0,
    verduras: t >= 880 && t < 921 ? 0.5 * win(t, A("las verduras", 879), A("las verduras", 879) + 0.6) + 0.5 * win(t, 889.5, 893.5) : 0,
    raw: rawK,
    smoke: t >= 1300 && t < 1324 ? win(t, fuegoAlto - 0.2, fuegoAlto + 0.6) * (1 - win(t, 1318, 1321)) : 0,
    top: partAt(t)?.k0?.startsWith("top") ? 1 : 0,
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
const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number] }> = ({ k, t, a, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};

// ---------------- las piezas, cada una clavada a su palabra ----------------
const sc = (t: number, q: V) => screenOf(t, q);
const PL = (i: number) => PLATES[i];
const Ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const on = (a: number, b: number) => t >= a - 0.4 && t < b + 0.6;
  const add = (a: number, b: number, f: () => React.ReactNode) => { if (on(a, b)) L.push(<React.Fragment key={"o" + a.toFixed(2) + "_" + L.length}>{f()}</React.Fragment>); };

  // ===== promesa =====
  add(97, 119.7, () => PLATES.map((q, i) => { const p = sc(t, q); return (t < 104.5 && i < 2) || (t >= 109.3 && t < 119.7) ? <X.PlateLabel key={i} t={t} at={Math.max(t < 105 ? 97 : 109.35, PROM[i])} out={t < 105 ? 104.3 : 119.5} x={p.x} y={p.y} n={i + 1} text={["chiles sin amargar", "cada cosa aparte", "el agua: nunca", "especias contadas", "colar dos veces", "el paso que nadie hace", "el reloj"][i]} up={i % 2 ? 250 : 130} /> : null; }));
  add(104.5, 109.3, () => <><X.Card t={t} at={A("el agua que nunca", 104)} out={109.2} x={1560} y={300} from="right"><X.H s={56}>3 · el agua <span style={{ color: CH.maiz }}>¡nunca!</span></X.H></X.Card>
    <X.Card t={t} at={A("las especias contadas", 104)} out={109.2} x={1560} y={460} from="right"><X.H s={56}>4 · especias contadas</X.H></X.Card></>);
  add(109.3, 119.7, () => <Reloj t={t} at={A("con el reloj", 109)} spin={A("con el reloj", 109) + 0.4} out={119.5} x={1650} y={300} />);
  add(119.7, 123.8, () => <Precio t={t} at={A("en pesos", 119)} out={123.6} x={1440} y={140} top="$" sub="CADA COSA, EN PESOS" />);
  add(123.8, 136.4, () => <><X.Card t={t} at={124.0} out={136.2} x={420} y={250} from="left"><X.H s={64} c={CH.maiz}>SECRETO 3</X.H></X.Card>
    <X.Burbujas t={t} out={135.0} items={[{ at: A("le va a dar coraje", 124), x: 1450, y: 260, text: "¡¿Cómo que no?!", rot: 3 }, { at: A("le va a dar coraje", 124) + 0.7, x: 520, y: 520, text: "¡Siempre se ha hecho así!", rot: -4 }, { at: A("contra lo que hace", 124), x: 1400, y: 640, text: "¡Ay, ésta!", rot: 5 }]} />
    <Nota t={t} at={A("tu haz la prueba", 130)} out={136.2} x={1500} y={300} lines={["Tú haz la prueba."]} rot={3} w={440} /></>);

  // ===== quién es Chayo =====
  add(136.4, 147, () => <LowerThird t={t} at={A("yo soy rosario", 136)} out={146.5} name="DOÑA CHAYO" l2="67 AÑOS · RANCHO DE PÁTZCUARO" l2at={A("67", 140)} />);
  add(141.6, 148.6, () => <X.MapaMich t={t} at={A("patzcuaro", 141)} out={148.0} x={1380} y={430} />);
  add(141.6, 148.6, () => { const f = sc(t, FIRE); return <Tag t={t} at={A("fogon de lena", 144)} x={f.x} y={f.y} dx={-260} dy={-200} text="FOGÓN DE LEÑA" sub="TODA LA VIDA" col="#ff9a4a" out={148.4} size={50} />; });
  add(157.1, 162.2, () => <Aroma t={t} at={A("te hacian toser", 157)} out={160.6} x={sc(t, PT2.comal).x} y={sc(t, PT2.comal).y - 40} />);
  add(157.1, 162.2, () => { const p = sc(t, POTS); return <Tag t={t} at={A("la cazuela grandota", 157)} x={p.x} y={p.y} dx={-320} dy={160} text="LA CAZUELA DEL MOLE" sub="NEGRA DE TANTOS AÑOS" col={CH.maiz} out={162.0} size={46} />; });
  add(162.2, 167.7, () => <Nota t={t} at={A("nomas se bajaba del clavo", 162)} out={167.5} x={1500} y={260} lines={["Del clavo, nomás", "pa'l mole."]} rot={4} w={440} />);
  add(173.2, 178.2, () => <X.Card t={t} at={A("las escribi todas", 173)} out={178.0} x={1450} y={280} from="right"><X.H s={50} c={CH.maiz}>LAS ESCRIBÍ TODAS</X.H><X.H s={44} f={HAND}>cantidades · tiempos · lo que cuesta</X.H></X.Card>);
  add(178.2, 186.3, () => <><X.Card t={t} at={G1} out={186.1} x={470} y={170} from="left" col="#ff8fbf"><X.H s={54} c="#ff8fbf">LA GUÍA DE MI COCINA</X.H></X.Card>
    <X.GuiaPag t={t} at={A("el mole de fiesta esta ahi", 180)} out={186.1} x={1530} y={800} pag={PAG.mole} text="Pasta del Mole Rojo, completita" /></>);
  add(186.3, 190.5, () => <X.DescCard t={t} at={A("el link esta", 186)} out={190.3} x={1440} y={760} hl={A("primera linea", 186)} />);

  // ===== la historia =====
  add(190.5, 201.8, () => <X.FotoVieja t={t} at={A("mi abuela se llamaba", 190)} out={196.8} x={1360} y={460} src="i_abuela" w={720} rot={4} cap="Mamá Cuca" />);
  add(190.5, 206.4, () => <X.Orden t={t} at={A("bautizos", 196) - 0.2} out={206.2} nums={false} steps={[{ label: "bautizos", at: A("bautizos", 196) }, { label: "comuniones", at: A("primeras comuniones", 196) }, { label: "bodas", at: A("bodas", 200) }, { label: "el santo patrón", at: A("el dia del santo", 200) }]} />);
  add(206.4, 210.6, () => <X.Gente t={t} at={A("para 120", 206)} out={210.4} x={1350} y={360} n={120} label="gentes" />);
  add(206.4, 210.6, () => <X.Card t={t} at={A("en tres cazuelas", 206)} out={210.4} x={460} y={850} from="left"><X.H s={56} c={CH.maiz}>3 CAZUELAS</X.H></X.Card>);
  add(210.6, 218.5, () => <X.Semana t={t} at={A("desde el jueves", 209)} out={214.6} x={960} y={300} days={["JUEVES", "VIERNES", "SÁBADO"]} mark={A("boda de sabado", 210)} hot={2} />);
  add(210.6, 218.5, () => { const p = sc(t, CANASTA); return <Tag t={t} at={A("limpiar los chiles", 213)} x={p.x} y={p.y} dx={260} dy={-240} text="A MÍ ME TOCABA" sub="LIMPIAR LOS CHILES" col={CH.maiz} out={218.3} size={50} />; });
  add(223.9, 232.2, () => <Nota t={t} at={A("no te talles", 228)} out={232.0} x={1480} y={300} lines={["No te talles, Chayito,", "que luego lloras", "de a deveras."]} rot={-3} w={520} />);
  add(242.3, 253.1, () => <><X.Fondo o={0.45 * e(t, 243.4, 244) * (1 - e(t, 249.4, 249.8))} /><X.Cita t={t} at={A("el mole huele la prisa", 243)} out={249.4} x={960} y={500} text="El mole huele la prisa." who="MAMÁ CUCA" size={110} /></>);
  add(242.3, 253.1, () => <Pensado t={t} at={A("brujeria", 248)} out={253.0} x={1400} y={300} text="¿brujería?" size={100} />);
  add(258.1, 271.3, () => { const p = sc(t, CZ); return <Tag t={t} at={A("una cazuela de barro grandota", 258)} x={p.x} y={p.y} dx={330} dy={-230} text="BARRO" sub="NOMÁS PA'L MOLE" col={CH.maiz} out={265.0} size={58} />; });
  add(258.1, 271.3, () => <X.CorteOllas t={t} at={A("el barro reparte", 262)} out={271.1} x={960} y={790} n={1} badAt={1e9} />);
  add(274.7, 286.8, () => <><X.Fondo o={0.4 * e(t, 274.8, 275.3) * (1 - e(t, 286.3, 286.7))} /><X.CorteOllas t={t} at={274.9} out={286.5} x={960} y={540} n={3} badAt={A("la olla delgadita", 279)} /></>);

  // ===== SECRETO 1 · los chiles =====
  add(286.8, 291.5, () => <X.Banda t={t} at={A("secreto numero 1", 286)} out={291.3} n={1} text="CHILES UNO POR UNO, CONTANDO" />);
  add(291.5, 294.3, () => <X.Card t={t} at={291.8} out={294.1} x={480} y={260} from="left"><X.H s={56} c={CH.maiz}>Hoja 1</X.H><X.H s={46} f={HAND}>los chiles</X.H></X.Card>);
  add(294.3, 302.7, () => <X.Anillo t={t} at={A("el 90", 294) - 0.1} out={298.4} x={440} y={420} pct={90} label="de los moles amargos empiezan aquí" />);
  add(294.3, 302.7, () => { const p = sc(t, PT2.comal); return <Tag t={t} at={A("en monton", 297)} x={p.x} y={p.y} dx={260} dy={-220} text="EN MONTÓN" col="#ff6a4a" out={302.5} size={62} />; });
  add(307.6, 312.6, () => <><Pill t={t} at={A("con azucar", 307)} out={312.4} x={1400} y={300} text="AZÚCAR" /><X.Card t={t} at={A("toda la tarde", 307)} out={312.4} x={1400} y={470} from="right"><X.H s={46} f={HAND}>...toda la tarde</X.H></X.Card></>);
  add(312.6, 320.3, () => <X.Card t={t} at={A("tres chiles", 312)} out={316.2} x={480} y={250} from="left"><X.H s={60} c={CH.maiz}>3 CHILES</X.H><X.H s={44} f={HAND}>pa' 20 platos</X.H></X.Card>);
  add(312.6, 326.4, () => <X.ChileFicha t={t} at={A("250 gramos de chile ancho", 314)} out={A("250 de chile mulato", 318) - 0.3} x={1480} y={520} kind="ancho" name="ANCHO" qty="250 g" what="el cuerpo y el dulcecito" col="#6a1a0c" />);
  add(320.3, 332, () => <X.ChileFicha t={t} at={A("250 de chile mulato", 318)} out={A("150 gramos", 326) - 0.3} x={1480} y={520} kind="mulato" name="MULATO" qty="250 g" what="el color casi negro" col="#2e0f08" />);
  add(326.4, 338.0, () => <X.ChileFicha t={t} at={A("150 gramos", 326)} out={A("cuatro o cinco chipotles", 330) - 0.3} x={1480} y={520} kind="pasilla" name="PASILLA" qty="150 g" what="lo amarguito bueno" col="#1e0c08" />);
  add(330, 343.0, () => <X.ChileFicha t={t} at={A("cuatro o cinco chipotles", 330)} out={342.8} x={1480} y={520} kind="chipotle" name="CHIPOTLE" qty="4 ó 5" what="el humo y el picor" col="#5a2a14" />);
  add(343.0, 349.4, () => <X.Card t={t} at={A("las venas son", 345)} out={349.2} x={1440} y={280} from="right"><X.H s={52} c="#ff8a6a">LAS VENAS</X.H><X.H s={44} f={HAND}>pican y, si se queman, amargan</X.H></X.Card>);
  add(349.4, 355.8, () => <Nota t={t} at={A("las semillas no las tires", 349)} out={355.6} x={1480} y={300} lines={["Las semillas:", "¡guárdalas!"]} rot={4} w={420} />);
  add(360.5, 364.6, () => <X.Card t={t} at={A("traen tierra", 360)} out={364.4} x={1460} y={300} from="right"><X.H s={48} f={HAND}>trapito húmedo: fuera la tierra</X.H></X.Card>);
  add(364.6, 372.3, () => <X.FuegoNivel t={t} at={A("a fuego medio", 364)} out={369.4} x={420} y={430} lvl={2} label="FUEGO MEDIO" />);
  add(364.6, 372.3, () => { const p = sc(t, PT2.comal); return <Tag t={t} at={A("de dos en dos", 368)} x={p.x} y={p.y} dx={300} dy={-220} text="DE 2 EN 2" sub="ó DE 3 EN 3" col={CH.maiz} out={372.1} size={60} />; });
  add(372.3, 377.8, () => <Stamp t={t} at={A("nunca en monton", 372)} out={377.6} text="NUNCA EN MONTÓN" x={1400} y={250} size={72} />);
  add(377.8, 388.6, () => <X.Cuenta t={t} at={A("cuentas", 379)} out={388.4} x={1560} y={420} from={1} to={15} dur={A("y los volteas", 381) - A("cuentas", 379)} flipAt={A("y los volteas", 381)} />);
  add(384.2, 388.6, () => <X.Card t={t} at={A("otros diez", 384)} out={388.4} x={420} y={260} from="left"><X.H s={56} c={CH.maiz}>OTROS 10 s</X.H><X.H s={44} f={HAND}>del otro lado, y fuera</X.H></X.Card>);
  add(388.6, 405.7, () => <X.Senales t={t} out={405.5} x={480} y={420} title="YA ESTÁN CUANDO..." rows={[{ at: A("cambian de color", 389), text: "cambian a rojizo" }, { at: A("flexibles como piel", 393), text: "flexibles como piel" }, { at: A("un olor dulce", 393), text: "huelen dulce, a pasas" }]} />);
  add(399.2, 405.7, () => <Aroma t={t} at={A("ese olor es", 400)} out={405.6} x={1300} y={700} />);
  add(410.5, 414.6, () => <Stamp t={t} at={A("va para afuera", 410)} out={414.4} text="¡PA' FUERA!" x={1400} y={300} size={96} />);
  add(414.6, 420.5, () => <X.Card t={t} at={A("un solo chile quemado", 414)} out={420.3} x={1400} y={300} from="right"><X.H s={56}>1 chile quemado</X.H><X.H s={46} f={HAND} c="#ff8a6a">amarga toda la cazuela</X.H></X.Card>);
  add(424.4, 434.4, () => <><X.Fondo o={0.35 * e(t, 424.5, 425) * (1 - e(t, 434, 434.4))} /><X.CurvaTostado t={t} at={424.6} out={434.2} x={960} y={540} burnAt={A("si te pasas", 428)} /></>);
  add(438.4, 443.6, () => <><Pill t={t} at={A("ni con chocolate", 438)} out={443.4} x={480} y={260} text="CHOCOLATE" /><Pill t={t} at={A("ni con azucar", 438)} out={443.4} x={960} y={200} text="AZÚCAR" /><Pill t={t} at={A("ni con platano", 438)} out={443.4} x={1440} y={260} text="PLÁTANO" />
    <Palomita t={t} at={A("no quemarlo", 440)} out={443.4} y={820} text="NO QUEMARLO" /></>);
  add(443.6, 449.4, () => <Precio t={t} at={A("280 pesos", 444)} out={449.2} x={1440} y={140} top="$280" sub="EL KILO · ANCHO" />);
  add(449.4, 453.2, () => <Precio t={t} at={A("en unos 320", 449)} out={453.0} x={1440} y={140} top="$320" sub="MULATO Y PASILLA" />);
  add(453.2, 459.0, () => <Receipt t={t} rows={[{ at: A("unos 210 pesos", 453), item: "chiles", $: 210 }]} totalAt={1e9} x={1300} y={160} out={458.8} title="PA' 20 PLATOS" />);
  add(459.0, 463.7, () => <Pill t={t} at={A("tiesos y viejos", 459)} out={463.5} x={1400} y={280} text="TIESOS Y VIEJOS" />);
  add(469.8, 473.9, () => <X.DoblaTest t={t} at={469.9} out={473.7} x={960} y={560} badAt={A("se rompe", 469.8)} />);
  add(473.9, 483.2, () => <X.Banda t={t} at={A("secreto numero 2", 472)} out={479.4} n={2} text="CADA COSA POR SEPARADO, EN MANTECA" />);
  add(473.9, 476.4, () => { const p = sc(t, PL(0)); return <Tag t={t} at={474.2} x={p.x} y={p.y} dx={220} dy={-220} text="PLATO 1" sub="SERVIDO" col={CH.maiz} out={476.2} size={52} />; });
  add(479.6, 483.2, () => <Stamp t={t} at={A("las fondas ya no lo hacen", 478)} out={483.0} text="LAS FONDAS YA NO" x={1420} y={260} size={64} col={CH.maiz} />);

  // ===== SECRETO 2 · cada cosa por separado =====
  add(488.5, 495.0, () => { const p = sc(t, PT2.comal); return <><Tag t={t} at={A("unas se queman", 490)} x={p.x - 60} y={p.y} dx={-300} dy={-180} text="QUEMADO" col="#ff5a3c" out={494.8} size={60} /><Tag t={t} at={A("otras se quedan crudas", 490)} x={p.x + 60} y={p.y} dx={300} dy={-180} text="CRUDO" col="#e8e0c8" out={494.8} size={60} /></>; });
  add(495.0, 512.5, () => <X.IconRow t={t} out={512.3} x={960} y={880} items={[
    { k: "ajonjoli", label: "½ taza ajonjolí", at: A("media taza de ajonjoli", 495), c: "#f0dca8" }, { k: "cacahuate", label: "cacahuate", at: A("un puno de cacahuates", 495), c: "#c0874a" },
    { k: "almendra", label: "almendra", at: A("un puno de almendras", 500), c: "#b07a4a" }, { k: "pasas", label: "pasitas", at: A("un punito de pasitas", 500), c: "#3a1a2a" },
    { k: "platano", label: "plátano macho", at: A("un platano macho", 500), c: "#3a2a12" }, { k: "tortilla", label: "tortilla de ayer", at: A("una tortilla de un dia", 507), c: "#e8d49c" },
    { k: "bolillo", label: "½ bolillo duro", at: A("medio bolillo duro", 507), c: "#d8a058" }]} />);
  add(513.2, 519.7, () => <X.Card t={t} at={A("su espesor", 514)} out={519.5} x={1440} y={280} from="right"><X.H s={54} c={CH.maiz}>ESPESOR + DULCE</X.H><X.H s={44} f={HAND}>sin tanta azúcar</X.H></X.Card>);
  add(524.8, 537.0, () => <X.Versus t={t} at={A("pero la manteca", 527)} out={536.8} x={960} y={300} a="MANTECA" b="ACEITE" w={940} rows={[["aguanta más calor", true, false], ["le da sabor de rancho", true, false]]} />);
  add(537.0, 541.8, () => <Nota t={t} at={A("de la buena", 537)} out={541.6} x={1500} y={250} lines={["La de hacer", "chicharrón."]} rot={-3} w={400} />);
  add(541.8, 606.3, () => <X.Orden t={t} at={A("el orden es este", 542)} out={606.1} steps={[{ label: "ajonjolí", at: A("primero el ajonjoli", 543) }, { label: "cacahuate", at: A("luego los cacahuates", 560) }, { label: "pasitas", at: A("luego las pasitas", 570) }, { label: "plátano", at: A("luego el platano", 584) }, { label: "tortilla", at: A("luego la tortilla", 592) }, { label: "bolillo", at: A("al final el bolillo", 596) }]} />);
  add(547.6, 553.7, () => <X.Card t={t} at={A("moviendo sin parar", 549)} out={553.5} x={1440} y={260} from="right"><X.H s={50} f={HAND}>sin parar: se quema en un segundo</X.H></X.Card>);
  add(558.7, 563.6, () => <Nota t={t} at={A("guarda dos cucharadas", 558)} out={563.4} x={1500} y={260} lines={["2 cucharadas", "pa' adornar"]} rot={4} w={400} />);
  add(563.6, 570.2, () => <X.Cronometro t={t} at={A("dos o tres minutos", 565)} out={570.0} x={1560} y={360} mins={3} label="2 a 3 min" />);
  add(574.1, 580.6, () => <><X.Globitos t={t} at={A("se inflan como globitos", 575)} out={580.4} x={960} y={500} /><Stamp t={t} at={A("en cuanto se inflan", 577)} out={580.4} text="¡FUERA!" x={1450} y={260} size={96} /></>);
  add(580.6, 590.7, () => <X.Card t={t} at={A("en rodajas", 583)} out={590.5} x={460} y={280} from="left"><X.H s={50} c={CH.maiz}>PLÁTANO</X.H><X.H s={44} f={HAND}>casi negro de las orillas</X.H></X.Card>);
  add(594.2, 601.0, () => <X.Onoma t={t} at={A("hasta que truene", 594)} out={597.6} x={1350} y={360} text="¡CRAC!" />);
  add(594.2, 601.0, () => <X.Card t={t} at={A("como pan tostado", 598)} out={600.8} x={460} y={280} from="left"><X.H s={46} f={HAND}>bolillo: dorado como pan tostado</X.H></X.Card>);
  add(606.3, 611.2, () => <Nota t={t} at={A("altar de muertos", 607)} out={611.0} x={1500} y={280} lines={["Parece altar", "de muertos."]} rot={-4} w={400} />);
  add(611.2, 618.8, () => <><X.Mitad t={t} at={A("la mitad del sabor", 611)} out={618.6} x={1560} y={420} label="LA MITAD DEL SABOR" /><Stamp t={t} at={A("en la fonda esto no existe", 615)} out={618.6} text="EN LA FONDA: NO EXISTE" x={620} y={880} size={58} /></>);
  add(623.4, 629.0, () => <Receipt t={t} rows={[{ at: A("unos 90 pesos", 623), item: "cositas", $: 90 }, { at: A("unos 70 pesos", 625), item: "manteca 1 kg", $: 70 }]} totalAt={1e9} x={1300} y={160} out={628.8} title="SECRETO 2" />);
  add(629.0, 641.1, () => <Pill t={t} at={A("todo de una sola vez", 630)} out={640.9} x={1400} y={260} text="TODO DE UNA VEZ" />);
  add(641.1, 650.1, () => <X.Versus t={t} at={A("una cosa a la vez", 641)} out={648.0} x={960} y={300} a="FIESTA" b="FRASCO" w={900} rows={[["una cosa a la vez", true, false], ["sabor por capas", true, false]]} />);
  add(641.1, 650.1, () => { const p = sc(t, PL(1)); return <Tag t={t} at={645.3} x={p.x} y={p.y} dx={240} dy={-210} text="PLATO 2" sub="SERVIDO" col={CH.maiz} out={648.4} size={50} />; });
  add(648, 654.2, () => <X.Banda t={t} at={A("secreto numero 3", 647)} out={654.0} n={3} text="EL AGUA DEL REMOJO NUNCA SE USA" />);

  // ===== SECRETO 3 · el agua del remojo =====
  add(657.2, 667.6, () => <><X.Fondo o={0.4 * e(t, 659, 659.5) * (1 - e(t, 667.2, 667.6))} /><X.FlujoMito t={t} at={A("remojan los chiles", 659)} out={667.4} x={960} y={540} xAt={A("y ahi mija", 664)} /></>);
  add(671.5, 676.6, () => <X.Card t={t} at={A("color cafe oscuro", 672)} out={676.4} x={1440} y={280} from="right"><X.H s={50} f={HAND}>café oscuro... ¿será el sabor?</X.H></X.Card>);
  add(676.6, 683.8, () => <X.Particulas t={t} at={676.8} out={683.6} x={960} y={600} sweetAt={1e9} />);
  add(690.1, 694.0, () => <X.Particulas t={t} at={690.2} out={693.8} x={960} y={600} sweetAt={690.4} />);
  add(694.0, 697.4, () => { const p = sc(t, LIMON); return <Tag t={t} at={A("al pie del limonero", 693)} x={p.x} y={p.y} dx={-300} dy={-160} text="AL LIMONERO" sub="POR ESO DABA TAN BONITO" col="#bfe88a" out={697.2} size={56} />; });
  add(705.3, 712.0, () => <X.Cronometro t={t} at={A("20 minutos", 707)} out={711.8} x={420} y={420} mins={20} label="20 MIN, NO MÁS" />);
  add(705.3, 712.0, () => { const p = sc(t, PT2.remojo); return <Tag t={t} at={A("les pones un plato", 706)} x={p.x} y={p.y} dx={300} dy={-200} text="UN PLATO ENCIMA" sub="PA' QUE NO FLOTEN" col={CH.maiz} out={711.8} size={48} />; });
  add(712.0, 718.7, () => <Pill t={t} at={A("si los dejas horas", 712)} out={718.5} x={1400} y={280} text="HORAS DE REMOJO" />);
  add(723.0, 732.8, () => <X.Card t={t} at={A("con caldo", 724)} out={732.6} x={1440} y={300} from="right"><div style={{ display: "flex", gap: 40 }}><X.H s={72} c="#bfe88a">CALDO ✓</X.H><X.H s={72} c="#ff8a6a">AGUA ✗</X.H></div></X.Card>);
  add(743.0, 748.7, () => <Pensado t={t} at={A("a lo mismo", 745)} out={748.5} x={1300} y={300} text="saben a lo mismo: a fiesta" size={90} />);
  add(748.7, 754.6, () => <Precio t={t} at={A("110 pesos", 749)} out={754.4} x={1440} y={140} top="$110" sub="EL KILO · GUAJOLOTE" />);
  add(754.6, 767.0, () => <X.Bascula t={t} at={A("uno de 6 kilos", 754)} out={760.4} x={1450} y={480} kg={6} label="6 KG" sub="pa' 20 gentes" />);
  add(754.6, 767.0, () => <Precio t={t} at={A("unos 320 pesos", 758)} out={766.8} x={1440} y={140} top="$320" sub="DOS POLLOS GRANDES" />);
  add(767.0, 772.4, () => <Pill t={t} at={A("sin tostarlos", 767)} out={772.2} x={1400} y={250} text="SIN TOSTAR" />);
  add(772.4, 778.0, () => <><X.SaborPlano t={t} at={772.6} out={777.8} x={960} y={860} /><Stamp t={t} at={A("el comal no se brinca", 774)} out={777.8} text="EL COMAL NO SE BRINCA" x={960} y={240} size={64} /></>);
  add(778.0, 781.8, () => { const p = sc(t, PL(2)); return <Tag t={t} at={778.5} x={p.x} y={p.y} dx={240} dy={-210} text="PLATO 3" sub="SERVIDO" col={CH.maiz} out={781.6} size={50} />; });

  // ===== CTA 2 =====
  add(781.8, 786.9, () => <X.Card t={t} at={A("la lista del mercado", 782)} out={786.7} x={1460} y={300} from="right"><X.H s={50} c="#ff8fbf">EN MI GUÍA</X.H><X.H s={46} f={HAND}>la lista del mercado, con precios</X.H></X.Card>);
  add(791.2, 799.5, () => <><X.GuiaPag t={t} at={791.6} out={G2P - 0.1} x={1530} y={220} pag={PAG.lista} text="la lista del mercado" /><X.GuiaPag t={t} at={G2P + 0.5} out={799.3} x={1530} y={220} pag={PAG.chica} text="pa' 4 gentes: pollo en mole" /><X.Porciones t={t} at={A("cantidad chica", 794)} out={799.3} x={560} y={760} shrinkAt={A("para 4 gentes", 795)} /></>);
  add(799.5, 803.1, () => <X.DescCard t={t} at={A("esta en el link", 799)} out={802.9} x={1440} y={760} hl={A("primera linea", 799)} />);

  // ===== SECRETO 4 · especias =====
  add(803.1, 808.6, () => <X.Banda t={t} at={A("secreto numero 4", 803)} out={808.4} n={4} text="ESPECIAS ENTERAS, TOSTADAS Y CONTADAS" />);
  add(808.6, 815.8, () => <X.SobreViejo t={t} at={A("especias en polvo de sobre", 809)} out={815.6} x={1450} y={500} />);
  add(821.4, 832.3, () => <X.BarrasSabor t={t} at={821.6} out={828.2} x={1420} y={480} badAt={A("un puno de todo", 821) + 0.4} />);
  add(821.4, 832.3, () => { const p = sc(t, [1.6, 1.55, -2.8]); return <Tag t={t} at={A("en frasquitos", 828)} x={p.x} y={p.y} dx={-280} dy={200} text="ENTERAS" sub="EN FRASQUITOS" col={CH.maiz} out={832.1} size={56} />; });
  add(836.7, 855.3, () => <X.Conteo t={t} out={855.1} x={520} y={500} rows={[
    { label: "canela (10 cm)", n: 1, at: A("una raja de canela", 836), c: "#c08060", r: 14 }, { label: "clavos", n: 6, at: A("6 clavos", 840), c: "#6a3418" },
    { label: "pimienta gorda", n: 6, at: A("6 pimientas gordas", 840), c: "#8a5a32", r: 11 }, { label: "pimienta negra", n: 10, at: A("10 pimientas negras", 840), c: "#2a1a10", r: 8 },
    { label: "½ cdta comino", n: 1, at: A("media cucharadita de comino", 845), c: "#b0903a" }, { label: "½ cdta anís", n: 1, at: A("media cucharadita de anis", 849), c: "#8a7a4a" }, { label: "1 cdta orégano", n: 1, at: A("una cucharadita de oregano", 849), c: "#6b8a3a" }]} />);
  add(855.3, 860.6, () => <X.FuegoNivel t={t} at={A("a fuego bajito", 856)} out={860.4} x={1500} y={430} lvl={1} label="BAJITO · 2 MIN" />);
  add(860.6, 866.1, () => <Aroma t={t} at={A("soltar olor", 862)} out={866.0} x={960} y={700} />);
  add(866.1, 871.8, () => <Palomita t={t} at={A("nomas se calienta", 866)} out={871.6} y={240} text="CANELA: NOMÁS SE CALIENTA" />);
  add(871.8, 880.0, () => <X.EscalaClavo t={t} at={A("por eso se cuentan", 872)} out={879.8} x={960} y={250} badAt={A("con 15", 875)} />);
  add(880.0, 899.9, () => <X.Card t={t} at={A("las verduras", 880)} out={899.7} x={480} y={420} from="left"><X.H s={50} c={CH.maiz}>AL COMAL</X.H>{[["3 jitomates", 884.8], ["3 tomates verdes", 886.3], ["½ cebolla", 887.6], ["1 cabeza de ajo", 889.2]].map(([l, a], i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CH.crema, opacity: e(t, a as number, (a as number) + 0.3) }}>{l as string}</div>)}</X.Card>);
  add(889.2, 894.2, () => { const p = sc(t, PT2.comal); return <Tag t={t} at={A("negritos por fuera", 889)} x={p.x} y={p.y} dx={300} dy={-200} text="NEGRITOS POR FUERA" sub="SUAVECITOS POR DENTRO" col={CH.maiz} out={894.0} size={46} />; });
  add(894.2, 903.9, () => <><X.Card t={t} at={A("le da lo acido", 897)} out={903.7} x={1450} y={240} from="right"><X.H s={48} f={HAND}>jitomate → lo ácido</X.H></X.Card><X.Card t={t} at={A("el tomate verde", 899)} out={903.7} x={1450} y={400} from="right"><X.H s={48} f={HAND}>tomate verde → frescura</X.H></X.Card></>);
  add(903.9, 909.2, () => <Pensado t={t} at={A("ese fondo", 904)} out={909.0} x={1300} y={280} text="el fondo que nadie sabe" size={88} />);
  add(909.2, 916.1, () => <X.Card t={t} at={A("una cucharada en el comal", 909)} out={915.9} x={1440} y={280} from="right"><X.H s={60} c={CH.maiz}>1 CUCHARADA</X.H><X.H s={44} f={HAND}>de semillas, doraditas</X.H></X.Card>);
  add(921.3, 944, () => <Receipt t={t} rows={[{ at: A("unos 30 pesos", 928), item: "especias", $: 30 }, { at: A("unos 40 pesos", 939), item: "verduras", $: 40 }]} totalAt={1e9} x={1320} y={160} out={943.8} title="SECRETO 4" />);
  add(921.3, 934.4, () => <Nota t={t} at={A("a las gallinas", 924)} out={928.0} x={520} y={300} lines={["Lo demás:", "pa' las gallinas."]} rot={-4} w={420} />);
  add(940.1, 951.9, () => <Stamp t={t} at={A("no es un concurso", 944)} out={951.7} text="NO ES CONCURSO" x={960} y={250} size={84} />);
  add(940.1, 951.9, () => { const p = sc(t, PL(3)); return <Tag t={t} at={948.4} x={p.x} y={p.y} dx={240} dy={-210} text="PLATO 4" sub="SERVIDO" col={CH.maiz} out={951.7} size={50} />; });

  // ===== SECRETO 5 · moler y colar =====
  add(951.9, 959.2, () => <X.Banda t={t} at={A("secreto numero 5", 953)} out={959.0} n={5} text="SE MUELE FINO Y SE CUELA DOS VECES" />);
  add(959.2, 967.6, () => <X.Textura t={t} at={A("como terciopelo", 959) - 0.6} out={967.4} x={960} y={860} goodAt={A("como terciopelo", 959)} />);
  add(973.2, 976.4, () => <Pill t={t} at={A("casi nadie cuela", 973)} out={976.2} x={1400} y={260} text="COLAR" />);
  add(976.4, 985.0, () => <X.Card t={t} at={A("molia en metate", 976)} out={984.8} x={1440} y={260} from="right"><X.H s={56} c={CH.maiz}>METATE</X.H><X.H s={44} f={HAND}>horas, pa'delante y pa'trás</X.H></X.Card>);
  add(995.2, 1001.3, () => <X.Trueque t={t} at={A("a cambio de un plato", 996)} out={1001.1} x={960} y={420} who="DON CHEMA, EL MOLINERO" />);
  add(1001.3, 1007.7, () => <Palomita t={t} at={A("con la licuadora esta bien", 1001)} out={1007.5} y={240} text="LICUADORA, EN TANDAS" />);
  add(1007.7, 1023.2, () => <X.Tandas t={t} out={1023.0} x={960} y={560} rows={[{ at: A("pones los chiles remojados", 1007), label: "chiles + 2 tazas de caldo", c: "#6a1a0c" }, { at: A("luego aparte las cositas", 1015), label: "cositas + 1 taza", c: "#a8642a" }, { at: A("luego las especias", 1019), label: "especias y verduras", c: "#8a3a1a" }]} />);
  add(1023.2, 1028.2, () => <Pill t={t} at={A("si metes todo junto", 1023)} out={1028.0} x={1400} y={260} text="TODO JUNTO" />);
  add(1028.2, 1035.6, () => <X.Card t={t} at={A("una coladera fina", 1030)} out={1035.4} x={1440} y={260} from="right"><X.H s={50} f={HAND}>apretando con la cuchara</X.H></X.Card>);
  add(1041.8, 1046.6, () => <X.Coladera t={t} at={1041.9} out={1046.4} x={1400} y={420} twoAt={A("dos veces", 1042)} />);
  add(1046.6, 1052.4, () => { const p = sc(t, CZ); return <Tag t={t} at={A("un mole liso", 1048)} x={p.x} y={p.y} dx={320} dy={-220} text="LISITO" sub="Y QUE BRILLA" col={CH.maiz} out={1052.2} size={62} />; });
  add(1057.2, 1070.6, () => <><X.Fondo o={0.4 * e(t, 1057.4, 1058) * (1 - e(t, 1070.2, 1070.6))} /><X.Lupa t={t} at={1057.5} out={1070.4} x={960} y={520} cleanAt={A("si la colas", 1066)} label="LA PIEL DEL CHILE" /></>);
  add(1070.6, 1074.0, () => <X.Card t={t} at={A("dos pajaros de un tiro", 1070)} out={1073.8} x={1460} y={260} from="right"><X.H s={48} f={HAND}>menos arena + menos amargo</X.H></X.Card>);
  add(1074.0, 1086.1, () => <Precio t={t} at={A("60 pesos", 1076)} out={1083.0} x={1440} y={140} top="$60" sub="LA COLADERA · TODA LA VIDA" />);
  add(1074.0, 1086.1, () => <Pill t={t} at={A("colar una sola vez", 1082)} out={1085.9} x={600} y={300} text="COLAR UNA VEZ" />);
  add(1089.4, 1099.0, () => <><Pill t={t} at={A("echarle agua", 1089)} out={1094.0} x={600} y={260} text="AGUA" /><Palomita t={t} at={A("siempre caldo", 1092)} out={1096.8} y={240} text="SIEMPRE CALDO" /></>);
  add(1089.4, 1099.0, () => { const p = sc(t, PL(4)); return <Tag t={t} at={1094.4} x={p.x} y={p.y} dx={-260} dy={-210} text="PLATO 5" sub="SERVIDO" col={CH.maiz} out={1097.8} size={50} />; });

  // ===== SECRETO 6 · el mole se fríe =====
  add(1095.6, 1105.6, () => <X.Banda t={t} at={A("secreto numero 6", 1095)} out={1105.4} n={6} text="EL MOLE SE FRÍE" />);
  add(1105.6, 1113.9, () => <X.HervirFreir t={t} at={A("mucha gente pone", 1106)} out={1113.7} x={960} y={540} okAt={1e9} />);
  add(1119.6, 1124.6, () => <X.HervirFreir t={t} at={1119.7} out={1124.4} x={960} y={540} okAt={A("el mole primero se frie", 1119)} />);
  add(1124.6, 1130.2, () => <X.Card t={t} at={A("cuatro o cinco cucharadas", 1125)} out={1130.0} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>4-5 CUCHARADAS</X.H><X.H s={44} f={HAND}>de manteca, que humee</X.H></X.Card>);
  add(1134.1, 1140.2, () => <X.Onoma t={t} at={A("y eso truena", 1135)} out={1139.0} x={1300} y={340} text="¡TSSSHH!" col="#ffcf6a" />);
  add(1140.2, 1146.2, () => <Nota t={t} at={A("una tapa a la mano", 1143)} out={1146.0} x={1480} y={280} lines={["La tapa a la mano", "y los niños, fuera."]} rot={3} w={460} />);
  add(1151.7, 1157.2, () => <X.Card t={t} at={A("sin parar", 1152)} out={1157.0} x={1440} y={260} from="right"><X.H s={50} f={HAND}>pala de madera, raspando el fondo</X.H></X.Card>);
  add(1157.2, 1163.8, () => <X.Cronometro t={t} at={A("durante", 1157)} out={1163.6} x={1600} y={340} mins={40} label="30 a 40 MIN" dur={2.5} />);
  add(1160, 1179.6, () => <X.ColorBarra t={t} at={A("al principio es rojo", 1160)} out={1173.0} x={960} y={930} t0={A("al principio es rojo", 1160)} t1={A("brillante", 1166)} mins={40} />);
  add(1173.2, 1179.6, () => <X.Card t={t} at={A("se ve el fondo", 1172.5)} out={1179.4} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>SE VE EL FONDO</X.H><X.H s={44} f={HAND}>un segundo, y se cierra</X.H></X.Card>);
  add(1184.1, 1190.2, () => { const p = sc(t, CZ); return <Tag t={t} at={A("los ojitos del mole", 1185)} x={p.x} y={p.y} dx={330} dy={-210} text="LOS OJITOS" sub="YA SE FRIÓ" col={CH.maiz} out={1190.0} size={64} />; });
  add(1190.2, 1198.1, () => <Pensado t={t} at={A("ese brillo", 1192)} out={1197.9} x={1250} y={280} text="ese brillo de las fiestas" size={88} />);
  add(1203.9, 1214.2, () => <X.Senales t={t} out={1214.0} x={500} y={460} title="LA GRASA CALIENTE TUESTA..." rows={[{ at: A("los chiles", 1204), text: "los chiles" }, { at: A("las semillas", 1205), text: "las semillas" }, { at: A("las especias", 1206), text: "las especias" }]} />);
  add(1203.9, 1214.2, () => <Stamp t={t} at={A("el agua sola", 1210)} out={1214.0} text="EL AGUA SOLA, NUNCA" x={1350} y={820} size={60} />);
  add(1223.2, 1228.5, () => <X.Tazas t={t} at={A("de taza en taza", 1224)} out={1228.3} x={1400} y={260} n={6} dt={0.45} label="DE TAZA EN TAZA" />);
  add(1233.7, 1241.2, () => <X.Liston t={t} at={A("caiga en liston", 1235)} out={1241.0} x={1500} y={470} />);
  add(1233.7, 1241.2, () => <X.Card t={t} at={A("unos 6 a 8 tazas", 1237)} out={1241.0} x={480} y={280} from="left"><X.H s={56} c={CH.maiz}>6 A 8 TAZAS</X.H><X.H s={44} f={HAND}>de caldo, depende</X.H></X.Card>);
  add(1241.2, 1251.1, () => <X.Card t={t} at={A("dos tablillas", 1243)} out={1246.5} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>2 TABLILLAS</X.H><X.H s={44} f={HAND}>de metate, con azúcar y canela</X.H></X.Card>);
  add(1251.1, 1260.9, () => <><X.ComoHuevo t={t} at={A("un pedacito de piloncillo", 1251)} out={1256.4} x={1450} y={450} /><Pensado t={t} at={A("el otro secreto", 1257)} out={1260.7} x={1250} y={300} text="el secreto del secreto" size={92} /></>);
  add(1260.9, 1266.1, () => <Pill t={t} at={A("no es para que sepa a chocolate", 1260)} out={1265.9} x={1400} y={250} text="SABER A CHOCOLATE" />);
  add(1266.1, 1278.5, () => <X.SeCasan t={t} at={1266.2} out={1271.6} x={960} y={500} joinAt={A("se casen", 1267)} />);
  add(1266.1, 1278.5, () => <Stamp t={t} at={A("si sabe a chocolate", 1270)} out={1273.8} text="¿SABE A CHOCOLATE? TE PASASTE" x={960} y={260} size={56} />);
  add(1266.1, 1278.5, () => <X.Card t={t} at={A("y la sal al final", 1273)} out={1278.3} x={1440} y={300} from="right"><X.H s={52} c={CH.maiz}>SAL AL FINAL</X.H><X.H s={44} f={HAND}>una cucharada, y esperar</X.H></X.Card>);
  add(1282.0, 1288.2, () => <X.Card t={t} at={A("con su sal", 1283)} out={1288.0} x={1440} y={260} from="right"><X.H s={50} f={HAND}>con su sal, todo se acomoda</X.H></X.Card>);
  add(1288.2, 1294.2, () => <X.Cronometro t={t} at={A("otros 15 minutos", 1288)} out={1294.0} x={1600} y={340} mins={15} label="OTROS 15 MIN" />);
  add(1294.2, 1300.4, () => <Precio t={t} at={A("unos 55 pesos", 1296)} out={1300.2} x={1440} y={140} top="$55" sub="CHOCOLATE Y PILONCILLO" />);
  add(1300.4, 1311.6, () => <X.Card t={t} at={A("frir 10 minutos", 1301)} out={1311.4} x={500} y={280} from="left"><div style={{ display: "flex", gap: 30 }}><X.H s={70} c="#ff8a6a">10 min ✗</X.H><X.H s={70} c="#bfe88a">40 min ✓</X.H></div></X.Card>);
  add(1300.4, 1311.6, () => { const p = sc(t, CZ); return <Tag t={t} at={A("con el fuego alto", 1303)} x={p.x} y={p.y} dx={320} dy={-200} text="FUEGO ALTO" sub="SE PEGA Y SE QUEMA" col="#ff5a3c" out={1311.4} size={56} />; });
  add(1311.6, 1317.1, () => <Palomita t={t} at={A("pasalo a otra olla", 1313)} out={1316.9} y={240} text="A OTRA OLLA, SIN RASPAR" />);
  add(1317.1, 1324.2, () => <><Pill t={t} at={A("mucha azucar", 1319)} out={1321.6} x={1400} y={250} text="MÁS AZÚCAR" /><X.Fondo o={0.45 * e(t, 1321.6, 1322) * (1 - e(t, 1323.9, 1324.2))} /><X.Cita t={t} at={A("lo amargo no se tapa", 1321)} out={1324.0} x={960} y={520} text="Lo amargo no se tapa, se evita." size={96} /></>);
  add(1324.2, 1329.8, () => { const p = sc(t, PL(5)); return <Tag t={t} at={1326.4} x={p.x} y={p.y} dx={-260} dy={-210} text="PLATO 6" sub="SERVIDO" col={CH.maiz} out={1328.4} size={50} />; });
  add(1328, 1337.6, () => <X.Banda t={t} at={A("secreto numero 7", 1327)} out={1337.4} n={7} text="UN DÍA ANTES" />);

  // ===== SECRETO 7 · un día antes =====
  add(1337.6, 1356, () => <X.Calendario t={t} at={1337.8} out={1355.0} x={1540} y={470} flipAt={A("manana decia", 1349)} a="VIERNES" la="el mole, listo" b="SÁBADO" lb="¡a la boda!" />);
  add(1350.2, 1360.5, () => <X.Sabores t={t} at={A("los sabores separados", 1353)} out={1360.3} x={760} y={520} joinAt={1e9} />);
  add(1366.0, 1372.2, () => <X.Sabores t={t} at={1366.1} out={1372.0} x={960} y={520} joinAt={A("se van juntando", 1365)} />);
  add(1372.2, 1379.3, () => <X.Card t={t} at={A("con los frijoles", 1374)} out={1379.1} x={1440} y={280} from="right"><X.H s={46} f={HAND}>como los frijoles y el pozole: al otro día, mejor</X.H></X.Card>);
  add(1383.3, 1394.7, () => <X.Refri t={t} at={A("dejas enfriar", 1383)} out={1394.5} x={1380} y={500} inAt={A("lo metes al refrigerador", 1386)} />);
  add(1394.7, 1399.5, () => <Palomita t={t} at={A("es normal", 1395)} out={1399.3} y={240} text="ESPESO COMO PASTA: NORMAL" />);
  add(1399.5, 1412.3, () => <X.Card t={t} at={A("15 minutos", 1408)} out={1412.1} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>15 MIN</X.H><X.H s={44} f={HAND}>las piezas, dentro del mole</X.H></X.Card>);
  add(1416.2, 1421.8, () => <X.Dura t={t} at={1416.3} out={1421.6} x={1380} y={420} bAt={A("en el congelador", 1415)} />);
  add(1421.8, 1433.4, () => <X.Carnes t={t} out={1433.2} x={960} y={950} rows={[{ at: A("habia enmoladas", 1424), n: "ENMOLADAS", s: "lo que sobró" }, { at: A("habia tamales de mole", 1424), n: "TAMALES", s: "de mole" }, { at: A("habia huevos en mole", 1424), n: "HUEVOS", s: "en mole" }]} />);
  add(1433.4, 1439.2, () => { const b = sc(t, [0.88, 0.85, -0.3]); return <Tag t={t} at={A("nadie podia entrar enojado", 1435)} x={b.x} y={b.y} dx={-360} dy={-220} text="NADIE ENTRA ENOJADO" col={CH.maiz} out={1439.0} size={50} />; });
  add(1448.2, 1462.0, () => <X.Diagnostico t={t} out={1461.8} x={1380} y={480} title="EL MOLE SE CORTA SI..." rows={[{ at: A("cuando dejas de moverlo", 1450), text: "dejas de moverlo" }, { at: A("el fuego esta muy alto", 1452), text: "el fuego está alto" }, { at: A("no esta atento", 1456), text: "no estás atenta" }]} />);
  add(1462.0, 1467.4, () => <Palomita t={t} at={A("cocina contenta", 1462)} out={1467.2} y={240} text="COCINA CONTENTA" />);
  add(1467.4, 1478.6, () => <><Pill t={t} at={A("los invitados llegando", 1471)} out={1478.4} x={480} y={260} text="INVITADOS" /><Pill t={t} at={A("con prisa", 1473)} out={1478.4} x={960} y={200} text="PRISA" /><Pill t={t} at={A("con el fuego alto", 1473)} out={1478.4} x={1440} y={260} text="FUEGO ALTO" /></>);
  add(1484.1, 1494.0, () => <><X.Corona t={t} at={A("como una reina", 1486)} out={1490.6} x={960} y={330} /><BigNum t={t} at={A("cuatro cosas mas", 1489)} out={1493.8} text="+4" size={200} y={520} col={CH.maiz} edge="#5a2a10" sub="QUE HACÍA MI ABUELA" /></>);
  add(1484.1, 1494.0, () => { const p = sc(t, PL(6)); return <Tag t={t} at={1484.9} x={p.x} y={p.y} dx={-240} dy={-200} text="PLATO 7" sub="LOS SIETE, SERVIDOS" col={CH.maiz} out={1488.0} size={50} />; });

  // ===== variantes =====
  add(1498.9, 1505.6, () => <X.Carnes t={t} out={1505.4} x={960} y={760} rows={[{ at: A("era guajolote", 1498), n: "GUAJOLOTE", s: "pa' las bodas" }, { at: A("con pollo", 1500), n: "POLLO", s: "cuando no alcanzaba" }, { at: A("costilla de cerdo", 1503), n: "COSTILLA", s: "en la matanza" }]} />);
  add(1498.9, 1505.6, () => <X.Card t={t} at={1499.0} out={1505.4} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>1 · LA CARNE</X.H></X.Card>);
  add(1511.4, 1516.2, () => <Palomita t={t} at={A("se cuece aparte", 1511)} out={1516.0} y={240} text="LA CARNE, APARTE" />);
  add(1516.2, 1526.9, () => <X.Card t={t} at={A("la segunda el arroz", 1516)} out={1526.7} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>2 · EL ARROZ</X.H></X.Card>);
  add(1520.2, 1526.9, () => <X.Card t={t} at={A("que suena como arenita", 1522)} out={1526.7} x={1440} y={300} from="right"><X.H s={46} f={HAND}>frito hasta que suene como arenita</X.H></X.Card>);
  add(1532.1, 1539.4, () => <X.PlatoMapa t={t} at={A("cada cosa en su lugar", 1533)} out={1539.2} x={1360} y={520} />);
  add(1532.1, 1544.4, () => <X.Card t={t} at={A("la tercera el adorno", 1537)} out={1544.2} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>3 · EL ADORNO</X.H></X.Card>);
  add(1549.4, 1560.8, () => <><X.Onoma t={t} at={A("truena en la boca", 1549)} out={1552.6} x={1350} y={330} text="¡CRIC!" size={120} /><X.Card t={t} at={A("cebolla morada", 1552)} out={1560.6} x={480} y={300} from="left"><X.H s={48} f={HAND}>cebolla morada</X.H><X.H s={48} f={HAND}>hojitas de aguacate</X.H><X.H s={40} c={CH.maiz}>SEGÚN LA CASA</X.H></X.Card></>);
  add(1560.8, 1566.3, () => <Nota t={t} at={A("servilleta bordada", 1563)} out={1566.1} x={1500} y={260} lines={["Tortillas en su", "servilleta bordada."]} rot={-3} w={460} />);
  add(1566.3, 1582.2, () => <X.Card t={t} at={A("la cuarta lo que sobra", 1566)} out={1582.0} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>4 · LO QUE SOBRA</X.H></X.Card>);
  add(1582.2, 1589.0, () => <Nota t={t} at={A("el desayuno del lunes", 1586)} out={1588.8} x={1500} y={280} lines={["El desayuno", "del lunes."]} rot={4} w={400} />);
  add(1589.0, 1594.5, () => <BigNum t={t} at={A("lo que puede salir mal", 1592)} out={1594.3} text="SI ALGO SALE MAL" size={130} y={500} col={CH.crema} edge="#4a1a0c" />);

  // ===== lo que puede salir mal =====
  add(1598.7, 1610.0, () => <X.Diagnostico t={t} out={1609.8} x={1340} y={480} title="¿AMARGO? FUE UNO DE TRES" rows={[{ at: A("se te quemo un chile", 1600), text: "un chile quemado" }, { at: A("usaste el agua del remojo", 1602), text: "el agua del remojo" }, { at: A("se te pego el fondo", 1604), text: "el fondo pegado" }]} />);
  add(1614.1, 1624.2, () => <X.FixCard t={t} at={A("te quedo muy dulce", 1614)} out={1624.0} x={960} y={860} prob="MUY DULCE" fix={["pizca de sal", "chorrito de caldo"]} fixAt={A("arreglalo", 1616)} />);
  add(1624.2, 1629.6, () => <Palomita t={t} at={A("tomate asado", 1624)} out={1629.4} y={240} text="JITOMATE ASADO, MOLIDO" />);
  add(1629.6, 1637.8, () => <X.FixCard t={t} at={A("muy picoso", 1629)} out={1637.6} x={960} y={860} prob="MUY PICOSO" fix={["más caldo", "tortilla frita molida"]} fixAt={A("ahi mas caldo", 1631)} />);
  add(1637.8, 1652.0, () => <X.FixCard t={t} at={A("grumoso o arenoso", 1637)} out={1651.8} x={960} y={860} prob="GRUMOSO" fix={["licuar con caldo", "colar", "volver a freír"]} fixAt={A("lo pasas otra vez", 1645)} />);
  add(1652.0, 1657.2, () => <X.FixCard t={t} at={A("muy aguado", 1652)} out={1657.0} x={960} y={860} prob="MUY AGUADO" fix={["fuego bajito, destapado"]} fixAt={A("lo dejas a fuego bajito", 1652)} />);
  add(1657.2, 1663.5, () => <Palomita t={t} at={A("siempre caldo caliente", 1660)} out={1663.3} y={240} text="SIEMPRE CALDO CALIENTE" />);
  add(1663.5, 1670.0, () => <Pill t={t} at={A("nunca frio", 1663)} out={1669.8} x={1400} y={260} text="CALDO FRÍO" />);
  add(1670.0, 1675.2, () => <X.Card t={t} at={A("no te asustes", 1670)} out={1675.0} x={1440} y={280} from="right"><X.H s={52} c={CH.maiz}>NO TE ASUSTES</X.H><X.H s={44} f={HAND}>bájale el fuego</X.H></X.Card>);
  add(1679.8, 1685.6, () => <X.Card t={t} at={A("casi siempre regresa", 1681)} out={1685.4} x={1440} y={280} from="right"><X.H s={50} f={HAND}>batir fuerte: casi siempre regresa</X.H></X.Card>);
  add(1685.6, 1692.2, () => <BigNum t={t} at={A("hagamos la cuenta", 1687)} out={1692.0} text="LA CUENTA" size={170} y={500} col={CH.maiz} edge="#5a2a10" sub="EN EL RANCHO TODO SE CUENTA" />);

  // ===== la cuenta =====
  add(1692.2, 1702.6, () => <Precio t={t} at={A("unos 190", 1693)} out={1702.4} x={1400} y={140} top="$190-200" sub="EL PLATO EN LA FONDA" />);
  add(1697.6, 1702.6, () => <><Pill t={t} at={A("pasta de frasco", 1698)} out={1702.4} x={480} y={700} text="FRASCO" /><Pill t={t} at={A("con agua y azucar", 1698)} out={1702.4} x={480} y={860} text="AGUA Y AZÚCAR" /></>);
  add(1702.6, 1709.2, () => <X.Cifra t={t} at={A("son unos", 1705)} out={1709.0} x={960} y={500} to={4000} post=" +" sub="una fiesta de 20, en fonda" />);
  add(1709.2, 1736, () => <Receipt t={t} rows={[
    { at: A("chiles unos 210", 1710), item: "chiles", $: 210 }, { at: A("las cositas fritas", 1714), item: "cositas", $: 90 }, { at: A("la manteca 70", 1714), item: "manteca", $: 70 },
    { at: A("las especias 30", 1714), item: "especias", $: 30 }, { at: A("los jitomates tomates", 1714), item: "verduras", $: 40 }, { at: A("el chocolate y el piloncillo", 1720), item: "chocolate", $: 55 }]}
    totalAt={A("eso es la pasta", 1727)} x={120} y={110} out={1735.6} sc={1.12} title="LA PASTA · 20 PLATOS" />);
  add(1732.8, 1738.2, () => <X.Card t={t} at={A("el guajolote unos 660", 1732)} out={1738.0} x={1440} y={260} from="right"><X.H s={56} c={CH.maiz}>GUAJOLOTE $660</X.H><X.H s={46} f={HAND}>o 2 pollos, $320</X.H></X.Card>);
  add(1738.2, 1744.0, () => <X.Cifra t={t} at={A("todo junto con guajolote", 1738)} out={1743.8} x={960} y={480} to={1150} sub="con guajolote, pa' 20 gentes" />);
  add(1744.0, 1749.6, () => <X.Cifra t={t} at={A("son como 58", 1744)} out={1749.4} x={1450} y={250} to={58} post=" el plato" size={120} />);
  add(1749.6, 1758.9, () => <X.Cifra t={t} at={1749.7} out={1752.6} x={960} y={300} to={40} post=" el plato" sub="con pollo" size={140} />);
  add(1749.6, 1758.9, () => <X.Platos4v20 t={t} at={A("por lo que cuestan", 1751)} out={1758.7} x={960} y={620} bAt={A("tu le das de comer", 1753)} />);
  add(1758.9, 1764.5, () => <Palomita t={t} at={A("las enmoladas del lunes", 1759)} out={1764.3} y={240} text="Y SOBRA PA'L LUNES" />);
  add(1764.5, 1778.5, () => <X.Cambio t={t} at={A("quitale las almendras", 1765)} out={1778.3} x={1380} y={300} swapAt={A("ponle mas cacahuate", 1767)} />);
  add(1778.5, 1782.6, () => <Palomita t={t} at={A("nadie en la fiesta", 1779)} out={1782.4} y={240} text="NADIE SE DIO CUENTA" />);

  // ===== resumen, tarea, comentarios, próximo, cierre =====
  add(1782.6, 1812.1, () => PLATES.map((q, i) => { const p = sc(t, q); return t >= 1799.4 || i < 2 ? <X.PlateLabel key={i} t={t} at={Math.max(i < 3 ? 1782.6 : 1799.45, RES[i])} out={1811.9} x={p.x} y={p.y} n={i + 1} text={["chiles contados", "cada cosa aparte", "agua al limonero", "especias contadas", "colar 2 veces", "freír: los ojitos", "un día antes"][i]} up={i % 2 ? 250 : 130} /> : null; }));
  add(1782.6, 1793.9, () => <X.Card t={t} at={A("te lo doy todo junto", 1782)} out={1785.8} x={960} y={160} from="up"><X.H s={56} c={CH.maiz}>TODO JUNTO</X.H></X.Card>);
  add(1816.1, 1832.4, () => <X.Tarea t={t} at={A("no hagas los 7", 1816)} out={1832.2} x={1360} y={500} rows={[{ at: A("tuesta tus chiles", 1818), text: "chiles, contando segundos" }, { at: A("y tira el agua", 1820), text: "el agua del remojo, fuera" }]} />);
  add(1832.4, 1847.6, () => <X.Encuesta t={t} at={A("cuentame aqui abajo", 1832)} out={1847.4} x={1340} y={440} q="¿TU MOLE LLEVA PLÁTANO?" a="sí lleva" b="no lleva" pa={-1} />);
  add(1838, 1843.4, () => <Pensado t={t} at={A("de que parte eres", 1840)} out={1843.2} x={560} y={860} text="¿y de qué parte eres?" size={84} />);
  add(1847.6, 1861.3, () => <X.Proximo t={t} at={A("9 errores", 1849)} out={1861.1} x={1300} y={460} />);
  add(1865.3, 1872.4, () => <X.Cita t={t} at={A("el mole no se apura", 1865)} out={1872.0} x={960} y={300} text="El mole no se apura. Se cuida." size={96} />);
  add(1869.4, END_T, () => <X.Orden t={t} at={A("chiles contados", 1869) - 0.2} out={1876.6} nums={false} steps={[{ label: "chiles contados", at: A("chiles contados", 1869) }, { label: "agua al limonero", at: A("agua al limonero", 1871) }, { label: "la pala sin parar", at: A("la pala sin parar", 1872) }]} />);
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
      L.push(<Clip key={"c" + idx} k={p.c} t={t} a={portaled ? p.a - 0.7 : p.a} z={p.z} />);
    } else {
      L.push(<World key="w" t={t} />);
      if (p.pt && nx?.c && Math.abs(nx.a - p.b) < 1e-6) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, p.pt); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} z={nx.z} /></Portal>); }
      }
    }
  }
  L.push(...Ov(t));
  // vapor en cada costura entre dos partes seguidas (salvo las que ya son portal)
  PARTS.forEach((p, i) => { const nx = PARTS[i + 1]; if (nx && Math.abs(nx.a - p.b) < 1e-6 && !(p.pt && nx.c) && Math.abs(t - p.b) < 0.4) L.push(<SteamWipe key={"sw" + i} t={t} mid={p.b} w={0.38} />); });
  // destello suave al entrar a cada secreto
  [291.5, 488.5, 654.2, 803.1, 956.1, 1102.4, 1334.3].forEach((a, i) => { if (Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.45} w={0.3} />); });
  // fundido final
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
