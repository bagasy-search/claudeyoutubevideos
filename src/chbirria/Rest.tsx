// chbirria · EL RESTO DEL VIDEO (114,9 s → final). Mismo mundo y misma cámara que el minuto 1: la cocina de adobe, la olla de birria de
// la mesa, los siete platos de barro (uno por secreto: al cerrar cada secreto su plato se sirve), el recetario de mamá Cuca que pasa una
// hoja por secreto, el comal (chiles, jitomate, especias), la olla del remojo, el puesto del mercado. Entre mundo y toma real sólo
// portales y vapor; el avatar entra en sus ventanas. Cada pieza nace con la palabra que la nombra (at("frase")).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PT2, PLATES, screenOf, camSpeed, setKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, Flash, HAND, P, Portal, Tag, at, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Aroma, Nota, Pensado, Palomita, Stamp, Precio, Pill, MIN1_END } from "./Min1";
import * as X from "./piezas";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms >= 110);
const inAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
export const REST_START = MIN1_END;
export const END_T = 1750.7; // voz 1749,7 + 1 s de silencio
const A = (ph: string, after: number) => at(ph, after);

// páginas REALES de la guía: Libro 1 · Semana 4 "La Birria de Res para Toda la Semana" (págs. 66-83)
const PAG = { receta: "Libro 1 · pág. 72", menu: "Libro 1 · pág. 68", lista: "Libro 1 · pág. 69", usa: "Libro 1 · pág. 70", mal: "Libro 1 · pág. 82", cuenta: "Libro 1 · pág. 67" };
// la toma LTX (19/28 s, varias tomas) cae a su cuadro clave mientras no llegue el mp4
const LIMG: Record<string, string> = {
  h_tatemar: "p_tatemar", h_freir: "p_freir",
  l_fogon: "i_fogon", l_nina: "s_nina", l_olla: "s_olla", l_desvenar: "u_desvenar", l_comal: "p_comal", l_quemado: "u_quemado", l_remojo: "u_remojo",
  l_ajo: "d_ajo", l_especias: "d_especias", l_licuar: "t_licuar", l_colar: "p_colar", l_cascaras: "t_cascaras", l_echar: "c_echar", l_rojo: "c_rojo",
  l_carne: "k_carne", l_agua: "k_agua", l_tiembla: "p_tiembla", l_caliente: "k_caliente", l_garbanzo: "k_garbanzo", l_grasa: "g_tapa", l_tortilla: "g_tortilla",
  l_deshebrar: "s7_deshebrar", l_separar: "s7_separar", l_servir: "v_servir", l_quesa: "v_quesa", l_mercado: "din_mercado", l_cierre: "z_fogon",
};

// ---------------- cámaras con nombre ----------------
type Cam = { p: V; l: V; fov?: number };
const CZ = PT.cazuela;
const C: Record<string, Cam> = {
  top: { p: [0, 3.6, 0.95], l: [0, 0.8, 0.12], fov: 40 }, topB: { p: [0.18, 3.95, 1.0], l: [0, 0.8, 0.12], fov: 40 }, topC: { p: [-0.15, 3.35, 0.9], l: [0, 0.8, 0.12], fov: 40 },
  wide: { p: [1.9, 1.95, 2.7], l: [-0.6, 0.8, -1.3], fov: 42 }, wide2: { p: [1.5, 1.9, 2.4], l: [-0.8, 0.8, -1.6], fov: 42 },
  fogon: { p: [-0.55, 1.4, -0.75], l: [-1.3, 0.95, -2.4], fov: 38 }, fogon2: { p: [-0.78, 1.3, -1.05], l: [-1.3, 0.8, -2.4], fov: 38 },
  comal: { p: [-0.55, 1.9, -0.7], l: [-1.3, 0.94, -2.5], fov: 32 }, comal2: { p: [-0.75, 1.75, -1.0], l: [-1.3, 0.94, -2.5], fov: 30 },
  comalT: { p: [-1.2, 2.6, -1.6], l: [-1.3, 0.94, -2.5], fov: 40 }, comalT2: { p: [-1.15, 2.45, -1.72], l: [-1.3, 0.94, -2.5], fov: 37 },
  repisa: { p: [1.3, 1.55, -1.5], l: [1.6, 1.45, -2.82], fov: 38 }, repisa2: { p: [1.7, 1.5, -1.75], l: [1.6, 1.45, -2.82], fov: 36 },
  caz: { p: [0.85, 1.48, 1.2], l: CZ, fov: 36 }, caz2: { p: [0.55, 1.32, 0.6], l: CZ, fov: 33 }, cazL: { p: [-0.9, 1.45, 1.0], l: CZ, fov: 36 }, cazL2: { p: [-0.6, 1.35, 0.7], l: CZ, fov: 34 },
  cazT: { p: [0.32, 1.78, 0.6], l: [0, 0.92, -0.17], fov: 30 }, cazT2: { p: [0.24, 1.64, 0.46], l: [0, 0.92, -0.17], fov: 28 },
  libro: { p: [1.12, 1.42, 0.28], l: [0.88, 0.82, -0.3], fov: 34 }, libro2: { p: [1.0, 1.2, 0.02], l: [0.88, 0.82, -0.3], fov: 30 },
  remojo: { p: [1.05, 1.45, 0.15], l: PT2.remojo, fov: 34 }, remojo2: { p: [0.7, 1.18, -0.12], l: PT2.remojo, fov: 31 },
  mercado: { p: [6.6, 1.5, 7.6], l: [6.6, 0.95, 5.4], fov: 38 }, mercado2: { p: [6.25, 1.3, 6.7], l: [6.6, 0.95, 5.4], fov: 35 },
  canasta: { p: [-1.9, 1.15, 1.7], l: [-2.6, 0.25, 0.8], fov: 38 }, salida: { p: [3.4, 2.9, 6.2], l: [0, 0.9, -0.6], fov: 44 },
};
PLATES.forEach((q, i) => { C["pl" + i] = { p: [q[0], 1.25, 0.95], l: [q[0], 0.82, 0.33], fov: 34 }; C["pl" + i + "b"] = { p: [q[0], 1.08, 0.7], l: [q[0], 0.82, 0.33], fov: 32 }; });

// ---------------- la línea de tiempo: partes de mundo (w) y tomas reales (c) entre las ventanas del avatar ----------------
type Part = { a: number; b: number; c?: string; o?: number; k0?: string; k1?: string; pt?: V; z?: [number, number] };
const w = (a: number, b: number, k0: string, k1: string, pt?: V): Part => ({ a, b, k0, k1, pt });
const c = (a: number, b: number, id: string, o = 0, z?: [number, number]): Part => ({ a, b, c: id, o, z });
const FIRE = PT.fire, COMAL = PT2.comal, REM = PT2.remojo;
const PARTS: Part[] = [
  // promesa
  w(120.9, 133.3, "topC", "top"), w(137.7, 146.5, "caz", "caz2"),
  w(151.5, 157.6, "cazT", "cazT2"), w(157.6, 165.0, "wide", "fogon"),
  // quién es Chayo + CTA
  w(170.9, 175.5, "fogon", "fogon2", FIRE), c(175.5, 182.1, "l_fogon", 0),
  c(187.8, 192.5, "i_cta"), w(192.5, 197.9, "libro", "libro2"),
  w(202.4, 209.0, "libro2", "libro"), w(209.0, 214.2, "libro", "libro2"),
  // la historia
  w(218.6, 224.6, "wide", "wide2", CZ), c(224.6, 231.2, "l_olla", 0),
  w(235.2, 240.6, "caz", "caz2"), c(240.6, 247.5, "l_nina", 0),
  c(253.7, 260.5, "l_desvenar", 0), w(260.5, 266.8, "canasta", "fogon2"),
  w(273.0, 283.4, "caz", "cazL"),
  w(287.2, 293.5, "caz", "caz2"), w(293.5, 300.3, "cazL", "cazL2"),
  w(306.5, 311.5, "caz2", "caz"), w(311.5, 318.6, "libro2", "comal"),
  // SECRETO 1 · los chiles
  w(324.2, 329.5, "comal", "comal2", COMAL), c(329.5, 334.4, "l_quemado", 0),
  w(340.5, 346.0, "mercado", "mercado2"), c(346.0, 353.2, "u_mercado"),
  w(358.0, 362.0, "canasta", "canasta"), c(362.0, 368.4, "l_desvenar", 9),
  c(373.4, 379.5, "u_trapo"), w(379.5, 386.1, "fogon2", "comal"),
  w(391.6, 396.5, "comalT", "comalT2", COMAL), c(396.5, 403.3, "l_comal", 0),
  c(407.9, 413.5, "l_comal", 9), w(413.5, 419.1, "comal", "comal2"),
  w(423.0, 428.0, "comalT2", "comalT"), c(428.0, 433.0, "u_tirar"), w(433.0, 436.8, "remojo", "remojo2"),
  w(442.4, 448.5, "remojo2", "remojo"), c(448.5, 455.5, "l_mercado", 0),
  c(460.7, 465.0, "l_remojo", 0), w(465.0, 470.7, "pl0", "pl0b"),
  // SECRETO 2 · tatemar
  w(475.7, 481.0, "libro2", "comal"), w(481.0, 486.9, "comalT", "comalT2"),
  w(491.9, 496.0, "comal2", "comalT", COMAL), c(496.0, 502.0, "h_tatemar", 3),
  c(508.0, 514.0, "d_tatemar"), w(514.0, 520.4, "comalT2", "comal2"),
  w(526.0, 531.0, "comal", "comal2"), c(531.0, 536.3, "l_ajo", 0),
  c(541.2, 545.5, "l_ajo", 9), w(545.5, 551.9, "repisa", "repisa2"),
  c(555.6, 561.5, "l_especias", 0), w(561.5, 569.4, "comalT", "comalT2"),
  w(575.5, 581.0, "mercado", "mercado2"), c(581.0, 587.4, "d_especias"),
  w(590.9, 595.5, "comal2", "comalT"), w(595.5, 600.8, "comalT2", "comal"),
  w(605.0, 609.5, "fogon", "comal"), c(609.5, 613.5, "l_desvenar", 19), w(613.5, 618.6, "pl1", "pl1b"),
  // SECRETO 3 · colar dos veces
  w(622.3, 627.0, "libro2", "libro2"), w(627.0, 634.9, "caz2", "cazT"),
  c(638.8, 650.4, "l_licuar", 0),
  c(655.3, 661.0, "t_metate"), w(661.0, 667.5, "wide", "wide2"),
  c(671.5, 681.7, "l_colar", 0),
  w(685.9, 692.0, "cazT2", "cazT"), w(692.0, 698.7, "cazT", "cazT2"),
  w(704.6, 710.0, "caz", "caz2"), c(710.0, 716.3, "l_colar", 19),
  w(720.9, 726.0, "caz2", "cazT"), w(726.0, 730.7, "pl2", "pl2b"),
  // CTA 2
  c(736.3, 741.0, "din_mercado"), w(741.0, 749.9, "libro", "libro2"),
  w(753.7, 766.2, "libro2", "libro"),
  // SECRETO 4 · freír el adobo
  w(769.6, 774.0, "libro2", "libro2"), w(774.0, 779.9, "caz", "caz2"),
  w(784.9, 795.3, "cazL", "cazL2"),
  c(799.8, 810.6, "l_echar", 0),
  c(814.8, 820.5, "c_mover"), w(820.5, 828.3, "cazT", "cazT2"),
  c(834.1, 840.0, "l_rojo", 0), w(840.0, 846.0, "cazT2", "caz"),
  w(850.2, 860.5, "caz2", "cazL"),
  w(866.7, 872.0, "caz", "caz2"), w(872.0, 878.8, "libro", "libro2"),
  w(883.4, 888.5, "libro2", "caz"), c(888.5, 894.8, "h_freir", 2),
  w(898.5, 904.0, "cazT", "cazT2"), w(904.0, 910.9, "caz", "caz2"),
  // SECRETO 5 · agua fría, fuego que apenas tiembla
  w(916.3, 918.6, "pl3", "pl3b"), w(918.6, 923.0, "libro2", "libro2"), c(923.0, 929.8, "h_deshace"),
  w(934.0, 939.5, "fogon", "fogon2"), w(939.5, 945.6, "mercado", "mercado2"),
  c(951.3, 957.0, "k_carniceria"), w(957.0, 962.9, "mercado2", "mercado"),
  w(967.4, 971.0, "mercado", "mercado2"), c(971.0, 978.9, "l_carne", 0),
  c(982.9, 993.4, "l_tiembla", 0),
  w(998.5, 1004.5, "caz", "caz2"), c(1004.5, 1010.9, "l_tiembla", 14),
  w(1015.1, 1020.0, "cazL", "cazL2"), c(1020.0, 1026.8, "k_tapar"),
  c(1030.9, 1037.0, "l_caliente", 0), w(1037.0, 1043.5, "fogon2", "fogon"),
  c(1048.2, 1054.0, "k_presion"), w(1054.0, 1060.2, "caz", "caz2"),
  w(1065.4, 1071.0, "cazL", "caz"), c(1071.0, 1076.7, "l_garbanzo", 0),
  c(1080.3, 1085.5, "l_garbanzo", 10), w(1085.5, 1088.0, "pl4", "pl4b"), w(1088.0, 1093.4, "libro2", "libro2"),
  // SECRETO 6 · la grasa roja
  w(1097.8, 1103.5, "cazT", "cazT2"), c(1103.5, 1109.7, "g_basura"),
  c(1115.7, 1125.5, "l_grasa", 0),
  c(1130.3, 1136.0, "l_grasa", 9.5), c(1136.0, 1142.7, "g_frasco"),
  c(1147.5, 1159.0, "l_tortilla", 0),
  c(1163.6, 1169.5, "g_huevo"), w(1169.5, 1175.3, "caz", "caz2"),
  w(1180.7, 1186.5, "cazT", "cazT2"), c(1186.5, 1192.8, "s7_refri"),
  w(1197.3, 1207.8, "comal", "comal2"),
  w(1211.9, 1217.5, "pl5", "pl5b"), w(1217.5, 1225.6, "libro2", "libro2"),
  // SECRETO 7 · una olla, siete comidas
  w(1231.4, 1237.0, "top", "topB"), c(1237.0, 1242.8, "l_separar", 0),
  c(1248.1, 1257.5, "l_deshebrar", 0),
  w(1261.5, 1267.5, "top", "topC"), c(1267.5, 1273.6, "s7_cinta"),
  c(1279.1, 1284.5, "s7_separar"), w(1284.5, 1290.8, "wide", "wide2"),
  w(1295.9, 1302.0, "top", "topB"), c(1302.0, 1309.2, "l_quesa", 0),
  w(1315.6, 1321.0, "topB", "topC"), c(1321.0, 1327.3, "v_tacos"),
  w(1331.4, 1337.0, "wide2", "wide"), c(1337.0, 1342.3, "l_separar", 10),
  w(1347.0, 1353.0, "caz", "cazL"), c(1353.0, 1359.8, "h_familia"),
  w(1365.7, 1370.0, "pl6", "pl6b"), w(1370.0, 1377.3, "top", "topB"),
  // variantes
  w(1383.0, 1388.0, "pl6", "pl6b"), w(1388.0, 1393.3, "cazL", "caz"),
  c(1397.8, 1410.3, "l_quesa", 9),
  c(1413.6, 1418.5, "l_quesa", 19), w(1418.5, 1424.1, "top", "topC"),
  c(1427.9, 1434.0, "v_hielos"), c(1434.0, 1439.8, "v_torta"),
  w(1446.0, 1450.0, "topB", "top"), w(1450.0, 1457.3, "caz", "caz2"),
  w(1463.0, 1469.0, "caz2", "cazL"), w(1469.0, 1475.2, "wide", "wide2"),
  // lo que puede salir mal
  w(1479.3, 1486.0, "comalT", "comalT2"), c(1486.0, 1493.0, "u_quemado"),
  w(1498.2, 1509.6, "caz", "caz2"),
  w(1514.3, 1518.5, "cazL", "cazL2"), c(1518.5, 1523.2, "t_colar2"),
  w(1528.4, 1535.0, "comal", "comal2"), w(1535.0, 1541.0, "comalT", "comalT2"),
  w(1546.8, 1551.5, "comal2", "comal"), w(1551.5, 1557.2, "caz", "cazL"),
  // la cuenta
  w(1560.5, 1566.0, "mercado", "mercado2"), c(1566.0, 1572.3, "l_mercado", 8),
  w(1576.7, 1589.1, "mercado2", "mercado"),
  w(1594.8, 1604.7, "top", "topB"),
  w(1608.4, 1619.7, "topB", "topC"),
  w(1625.9, 1630.5, "pl3", "pl3b"), w(1630.5, 1637.1, "topC", "top"),
  w(1642.8, 1648.0, "wide", "wide2"), c(1648.0, 1653.5, "din_mesa"),
  // resumen, tarea, comentarios, próximo, cierre
  w(1659.6, 1671.8, "top", "topB"), w(1675.9, 1687.2, "topB", "top"),
  w(1691.1, 1702.0, "caz", "caz2"),
  w(1706.7, 1719.1, "cazL", "caz"),
  w(1723.2, 1734.8, "fogon2", "fogon"),
  c(1738.3, 1744.0, "l_cierre", 0), w(1744.0, END_T, "caz", "salida"),
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
  { l: ["# Birria de Domingo", "de mi mamá Cuca", "", "Pa' toda la semana.", "Fuego que apenas", "tiembla.", "", "— Refugio"], r: ["chiles contando", "los segundos", "el jitomate, negro", "colar dos veces", "freír el adobo", "agua fría", "la grasa NO se tira", "una olla, 7 comidas"] },
  { l: ["# 1. Los chiles", "8 guajillos", "3 anchos", "", "sin rabito, venas", "ni semillas", "trapito húmedo"], r: ["comal a fuego medio", "de 2 en 2", "10 a 20 segundos", "voltear: otros 10 a 20", "", "huele a fruta seca = listo", "huele a humo = pa' fuera", "remojo: 20 minutos"] },
  { l: ["# 2. Tatemar", "1 jitomate grande", "½ cebolla", "5 dientes de ajo", "(con su cáscara)", "", "hasta NEGRO"], r: ["1 raja de canela", "3 clavos", "4 pimientas gordas", "1 cdta comino", "1 cdta orégano", "1 cda sal", "", "contadas"] },
  { l: ["# 3. Colar", "licuar un buen rato", "", "1ª colada: solita", "2ª colada: apretando"], r: ["hasta que queden", "cáscaras SECAS", "", "la pasta del colador", "es la carne del chile"] },
  { l: ["# 4. Freír el adobo", "grasa bien caliente", "el adobo de un jalón", "(¡los niños fuera!)", "", "fuego medio"], r: ["5 minutos", "raspando el fondo", "", "más oscuro", "más brillante", "huele a chile tostado"] },
  { l: ["# 5. La carne", "pecho", "1½ kg chambarete", "con hueso", "2½ kg en total", "", "4 litros de agua FRÍA"], r: ["fuego que apenas", "tiembla", "3 horas, tapada", "", "si baja el agua:", "CALIENTE, nunca fría"] },
  { l: ["# 6. La grasa roja", "se enfría el consomé", "la grasa sube", "se levanta entera", "", "a su frasco"], r: ["quesabirrias rojas", "el huevo rojo", "", "1 semana en el refri", "calentar a fuego medio", "nunca hasta que humee"] },
  { l: ["# 7. Una olla,", "# siete comidas", "", "APARTAR", "antes de servir", "", "cucharón limpio"], r: ["refri: lun, mar, mié", "congelador: jue, vie, sáb", "", "todo al frío", "antes de 2 horas", "", "cinta con el día"] },
];
const GUIA = [
  { l: ["# Las 5 Ollas de", "# Doña Chayo", "", "Libro 1", "Semana 4", "", "recetas de mi abuela", "con sus pesos"], r: ["La Birria de Res", "para Toda la Semana", "", "lo que te llevas ...... 67", "el menú ................. 68", "la lista ................. 69", "la birria ............... 72"] },
  { l: ["# Birria de Res", "# con su Consomé", "pág. 72", "", "pecho y chambarete", "con hueso", "adobo de guajillo", "y ancho"], r: ["paso por paso,", "como en el rancho", "", "da para toda", "la semana"] },
  { l: ["# El menú", "pág. 68", "", "domingo: la birria", "lunes: quesabirrias", "martes: tacos dorados", "miércoles: consomé"], r: ["jueves: tostadas", "viernes: chilaquiles", "sábado: sopes", "", "pégalo en el refri"] },
  { l: ["# La lista del mercado", "pág. 69", "", "lo que compras", "el sábado", "", "unos $910"], r: ["con una columna", "pa' anotar", "lo que pagaste tú"] },
  { l: ["# Si vives en", "# Estados Unidos", "pág. 70", "", "la misma lista,", "con su nombre", "en inglés"], r: ["unos 95 dólares", "", "menos de 3½ dólares", "el plato"] },
];

// ---------------- tiempos clave ----------------
const SERVE = [469.6, 616.0, 728.0, 917.0, 1086.0, 1213.0, 1366.5];         // el plato del secreto i se sirve
const FLIP = [A("secreto numero uno", 310), 476.0, A("secreto numero 3", 620), 770.0, A("secreto numero cinco", 915), A("secreto numero 6", 1085), A("secreto numero 7", 1215)];
const PROM = [120.9, 120.9, 120.9, A("paso de cinco minutos", 120), A("el agua fria", 120), A("la grasa roja", 120), A("el ultimo secreto", 120)];
const RES = [1659.7, A("el jitomate la cebolla", 1659), A("el adobo se cuela", 1659), 1671.0, A("agua fria", 1675), A("la grasa roja es oro", 1675), 1686.6];
const G1 = 192.6, G1P = A("la birria esta ahi", 202), G1M = A("con el menu", 202), G2 = 741.2, G2P = A("con el nombre en ingles", 753), G2M = A("el menu de los 7", 756);
const isGuia = (t: number) => (t >= 187.8 && t < 214.2) || (t >= 736.3 && t < 766.2);
const RAW = (t: number) => (t >= 774 && t < 822 ? 1 : t >= 822 && t < 846 ? 1 - win(t, 822, 845) : 0);

const worldAt = (t: number): WorldProps => {
  const guia = isGuia(t);
  const k0 = partAt(t)?.k0 ?? "caz";
  const plateServed = PLATES.map((_, i) => win(t, SERVE[i], SERVE[i] + 1.2));
  const plateOn = PLATES.map((_, i) => Math.max(
    win(t, PROM[i], PROM[i] + 0.3) * (1 - win(t, 133.0, 133.3)),
    win(t, SERVE[i] - 0.4, SERVE[i]) * (1 - win(t, SERVE[i] + 2, SERVE[i] + 3)),
    win(t, RES[i], RES[i] + 0.3) * (1 - win(t, 1687, 1687.2)),
  ));
  const monton = A("en monton", 320);
  const chiles = t >= 324 && t < 330 ? 3 + 11 * win(t, monton - 0.3, monton + 0.4) : t >= 391 && t < 420 ? 2 : t >= 423 && t < 428 ? 2 : t >= 1479 && t < 1486 ? 2 : 0;
  const toast = t >= 413 && t < 420 ? win(t, 413.6, 418) : 0;
  const quemo = A("ya se quemo", 422);
  const verd = t >= 475 && t < 537 ? 0.5 + 0.5 * win(t, 508, 520) : t >= 590 && t < 601 ? 0.5 + 0.5 * win(t, A("se tatema hasta negro", 590), A("se tatema hasta negro", 590) + 1.5) : 0;
  return {
    t,
    night: win(t, 1745, 1749.5) * 0.5,
    fire: 1 + (t >= 934 && t < 939.5 ? 1.3 : 0) + (t >= 1037 && t < 1043.5 ? 0.3 : 0),
    steamCaz: /^cazT/.test(k0) ? 0.3 : /^(caz|pl)/.test(k0) ? 1 : /^top/.test(k0) ? 0.35 : 0.2,
    steamComal: /^comal/.test(k0) ? 0.15 : 1,
    ojitos: t >= 1097 && t < 1104 ? 1 : 0.7,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.16 * v), plateFill: PLATES.map(() => 0),
    book: guia
      ? (t < 500 ? { open: ei(t, G1, G1 + 1.2), flip: ei(t, G1P, G1P + 0.9) + ei(t, G1M, G1M + 0.9), pages: GUIA }
                 : { open: ei(t, G2, G2 + 1.2), flip: 3 + ei(t, G2P, G2P + 0.9) - 2 * ei(t, G2M, G2M + 1.2), pages: GUIA })
      : { open: 1, flip: FLIP.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0), pages: RECETARIO },
    guia: guia ? 1 : 0,
    partyPeople: 0, patioLights: 0,
    chiles, toast, burnt: (t >= 423 && t < 428 ? win(t, quemo - 0.3, quemo + 0.8) : 0) + (t >= 1479 && t < 1486 ? 1 : 0),
    sarten: 0, fry: 0, charola: 0,
    remojo: t >= 433 && t < 449 ? 0.3 + 0.4 * win(t, 442.4, 448.5) : 0,
    tapa: 0, aguaLimon: 0,
    especias: t >= 561 && t < 570 ? win(t, 561.6, 562.4) : 0,
    verduras: verd,
    raw: RAW(t),
    smoke: t >= 898.5 && t < 904 ? win(t, A("se quema el fondo", 898) - 0.2, A("se quema el fondo", 898) + 0.6) : 0,
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

  // ===== promesa =====
  add(120.9, 133.3, () => PLATES.map((q, i) => { const p = sc(t, q); return <X.PlateLabel key={i} t={t} at={PROM[i] + i * 0.05} out={133.1} x={p.x} y={p.y} n={i + 1} text={["chiles contados", "jitomate negro", "colar 2 veces", "freír el adobo", "agua fría, fuego bajito", "la grasa roja", "una olla, 7 comidas"][i]} up={i % 2 ? 250 : 130} />; }));
  add(137.7, 146.5, () => <Precio t={t} at={A("en pesos", 137)} out={146.3} x={1440} y={140} top="$" sub="CADA COSA, EN PESOS" />);
  add(151.5, 157.6, () => <X.Burbujas t={t} out={157.4} items={[{ at: A("tirando a la basura", 150), x: 1450, y: 260, text: "¡¿Cómo que no se tira?!", rot: 3 }, { at: A("tirando a la basura", 150) + 0.8, x: 520, y: 560, text: "¡Siempre la he quitado!", rot: -4 }]} />);
  add(151.5, 157.6, () => <Nota t={t} at={A("tu haz la prueba", 153)} out={157.4} x={1500} y={760} lines={["Tú haz la prueba."]} rot={3} w={440} />);
  add(157.6, 165.0, () => <LowerThird t={t} at={A("yo soy rosario", 157)} out={164.8} name="DOÑA CHAYO" l2="67 AÑOS · RANCHO DE PÁTZCUARO" l2at={A("tengo 67", 160)} />);

  // ===== quién es Chayo + CTA =====
  add(170.9, 175.5, () => { const f = sc(t, FIRE); return <Tag t={t} at={171.2} x={f.x} y={f.y} dx={-260} dy={-200} text="FOGÓN DE LEÑA" sub="TODA LA VIDA" col="#ff9a4a" out={175.3} size={50} />; });
  add(175.5, 182.1, () => <Aroma t={t} at={A("los chiles en el comal", 176)} out={182.0} x={1300} y={640} />);
  add(187.8, 192.5, () => <X.Card t={t} at={A("y lo hice", 190)} out={192.4} x={1450} y={280} from="right"><X.H s={50} c={CH.maiz}>LAS ESCRIBÍ TODAS</X.H><X.H s={44} f={HAND}>cantidades · tiempos · lo que cuesta</X.H></X.Card>);
  add(192.5, 197.9, () => <X.Card t={t} at={A("son mis libros", 194)} out={197.8} x={470} y={170} from="left" col="#ff8fbf"><X.H s={54} c="#ff8fbf">LAS 5 OLLAS DE DOÑA CHAYO</X.H></X.Card>);
  add(202.4, 209.0, () => <X.GuiaPag t={t} at={G1P + 0.3} out={208.9} x={1530} y={800} pag={PAG.receta} text="Birria de Res con su Consomé" />);
  add(202.4, 209.0, () => <X.Card t={t} at={G1M + 0.2} out={208.9} x={470} y={170} from="left"><X.H s={50} c={CH.maiz}>EL MENÚ DE LA SEMANA</X.H><X.H s={42} f={HAND}>de esta misma olla</X.H></X.Card>);
  add(209.0, 214.2, () => <X.DescCard t={t} at={A("el link esta", 208)} out={214.0} x={1440} y={760} hl={A("primera linea", 208)} />);

  // ===== la historia =====
  add(218.6, 224.6, () => <X.FotoVieja t={t} at={218.8} out={224.4} x={1360} y={460} src="s_abuela" w={720} rot={4} cap="Mamá Cuca" />);
  add(224.6, 231.2, () => <X.Card t={t} at={A("era la olla", 224)} out={231.0} x={1450} y={260} from="right"><X.H s={52} c={CH.maiz}>LA OLLA DEL DOMINGO</X.H><X.H s={44} f={HAND}>pa' que comiera toda la familia</X.H></X.Card>);
  add(235.2, 240.6, () => <><X.Fondo o={0.42 * e(t, 235.3, 235.8) * (1 - e(t, 240.1, 240.5))} /><X.Cita t={t} at={235.5} out={240.3} x={960} y={500} text="Una olla bien hecha el domingo te cuida toda la semana." who="MAMÁ CUCA" size={84} w={1300} /></>);
  add(240.6, 247.5, () => <X.Card t={t} at={A("desvenar los chiles", 240)} out={247.3} x={1450} y={260} from="right"><X.H s={50} c={CH.maiz}>A MÍ ME TOCABA</X.H><X.H s={46} f={HAND}>desvenar los chiles</X.H></X.Card>);
  add(253.7, 260.5, () => <Nota t={t} at={A("no te talles", 254)} out={260.3} x={1480} y={300} lines={["No te talles los ojos,", "Chayito, que luego", "lloras de a deveras."]} rot={-3} w={520} />);
  add(260.5, 266.8, () => <Pensado t={t} at={A("y lloraba", 260)} out={266.6} x={1300} y={300} text="(y lloraba)" size={96} />);
  add(273.0, 283.4, () => <><X.Fondo o={0.42 * e(t, 273.2, 273.7) * (1 - e(t, 279.2, 279.6))} /><X.Cita t={t} at={A("porque ella le pone", 272)} out={279.4} x={960} y={500} text="Ella le pone el chile, pero no se lo cocina." who="MAMÁ CUCA" size={92} w={1300} /></>);
  add(273.0, 283.4, () => <Pensado t={t} at={A("tenia su razon", 278)} out={283.2} x={1250} y={300} text="cada cosa, su razón" size={92} />);
  add(287.2, 293.5, () => { const p = sc(t, CZ); return <Tag t={t} at={A("una olla de barro", 287)} x={p.x} y={p.y} dx={330} dy={-230} text="BARRO" sub="DE BOCA ANCHA" col={CH.maiz} out={293.3} size={58} />; });
  add(293.5, 300.3, () => <X.CorteOllas t={t} at={A("el barro guarda", 292)} out={300.1} x={960} y={790} n={1} badAt={1e9} />);
  add(293.5, 300.3, () => <X.FuegoNivel t={t} at={A("fuego bajito", 295)} out={300.1} x={1560} y={360} lvl={1} label="BAJITO, DE HORAS" />);
  add(306.5, 311.5, () => <X.Card t={t} at={A("olla de presion", 306)} out={311.3} x={1450} y={280} from="right"><X.H s={48} c={CH.maiz}>OLLA GRUESA, CON TAPA</X.H><X.H s={44} f={HAND}>o de presión: también</X.H></X.Card>);

  // ===== SECRETO 1 · los chiles =====
  add(311.5, 318.6, () => <X.Banda t={t} at={FLIP[0]} out={318.4} n={1} text="LOS CHILES, CONTANDO LOS SEGUNDOS" />);
  add(324.2, 329.5, () => { const p = sc(t, COMAL); return <Tag t={t} at={A("en monton", 324)} x={p.x} y={p.y} dx={260} dy={-220} text="EN MONTÓN" col="#ff6a4a" out={329.3} size={62} />; });
  add(329.5, 334.4, () => <X.Card t={t} at={A("humo negro", 329)} out={334.2} x={1440} y={280} from="right"><X.H s={56} c="#ff8a6a">HUMO NEGRO</X.H><X.H s={46} f={HAND}>= el amargo de toda la tarde</X.H></X.Card>);
  add(340.5, 353.2, () => <X.ChileFicha t={t} at={A("ocho chiles guajillo", 340)} out={353.0} x={1480} y={520} kind="pasilla" name="GUAJILLO" qty="8" what="el rojo bonito, un poquito ácido" col="#9a1e0e" />);
  add(340.5, 346.0, () => <X.Card t={t} at={A("tres chiles anchos", 341)} out={345.8} x={480} y={250} from="left"><X.H s={56} c={CH.maiz}>+ 3 ANCHOS</X.H><X.H s={44} f={HAND}>el cuerpo y el dulcecito</X.H></X.Card>);
  add(358.0, 362.0, () => <Palomita t={t} at={A("no necesitas mas", 358)} out={361.8} y={240} text="CON ESOS DOS: NO NECESITAS MÁS" />);
  add(362.0, 368.4, () => <X.Orden t={t} at={A("les quitas el rabito", 361) - 0.2} out={368.2} steps={[{ label: "el rabito", at: A("les quitas el rabito", 361) }, { label: "abrirlos", at: A("los abres", 362) }, { label: "semillas y venas", at: A("las semillas y las venas", 364) }]} />);
  add(373.4, 379.5, () => <X.Card t={t} at={A("un trapito humedo", 372)} out={379.3} x={1460} y={300} from="right"><X.H s={48} f={HAND}>trapito húmedo: fuera la tierra</X.H></X.Card>);
  add(379.5, 386.1, () => <X.FuegoNivel t={t} at={A("ahora el comal", 383)} out={385.9} x={420} y={430} lvl={2} label="FUEGO MEDIO, NO ALTO" />);
  add(391.6, 396.5, () => <Stamp t={t} at={391.8} out={396.3} text="NUNCA EN MONTÓN" x={1400} y={250} size={72} />);
  add(391.6, 396.5, () => { const p = sc(t, COMAL); return <Tag t={t} at={A("con la palita", 392)} x={p.x} y={p.y} dx={300} dy={-200} text="APLASTADITOS" sub="QUE TOQUEN PAREJO" col={CH.maiz} out={396.3} size={50} />; });
  add(396.5, 403.3, () => <X.Cuenta t={t} at={A("cuentas", 397)} out={403.1} x={1560} y={420} from={1} to={20} dur={A("y los volteas", 398) - A("cuentas", 397)} flipAt={A("y los volteas", 398)} />);
  add(407.9, 419.1, () => <X.Senales t={t} out={418.9} x={480} y={420} title="YA ESTÁN CUANDO..." rows={[{ at: A("cambian de color", 408), text: "un tono más claro" }, { at: A("flexibles como piel", 410), text: "flexibles como piel" }, { at: A("un olor dulce", 413), text: "huelen a fruta seca" }]} />);
  add(413.5, 419.1, () => <Aroma t={t} at={A("un olor dulce", 413)} out={419.0} x={1300} y={640} />);
  add(423.0, 428.0, () => <Stamp t={t} at={A("va para afuera", 425)} out={427.8} text="¡PA' FUERA!" x={1400} y={300} size={96} />);
  add(428.0, 433.0, () => <X.Card t={t} at={A("un solo chile quemado", 428)} out={432.8} x={1400} y={300} from="right"><X.H s={56}>1 chile quemado</X.H><X.H s={46} f={HAND} c="#ff8a6a">amarga toda la olla</X.H></X.Card>);
  add(433.0, 436.8, () => { const p = sc(t, REM); return <Tag t={t} at={A("luego los remojas", 433)} x={p.x} y={p.y} dx={300} dy={-200} text="AL REMOJO" sub="AGUA CALIENTE" col={CH.maiz} out={436.6} size={52} />; });
  add(442.4, 448.5, () => <X.Cronometro t={t} at={A("a los 20 minutos", 444)} out={448.3} x={420} y={420} mins={20} label="20 MIN, NO MÁS" />);
  add(448.5, 455.5, () => <Precio t={t} at={A("40 pesos", 451)} out={455.3} x={1440} y={140} top="$40" sub="100 g GUAJILLO + 100 g ANCHO" />);
  add(460.7, 465.0, () => <Pill t={t} at={A("sin tostarlos", 460)} out={464.8} x={1400} y={250} text="SIN TOSTAR" />);
  add(465.0, 470.7, () => <Stamp t={t} at={A("el comal no se brinca", 465)} out={468.8} text="EL COMAL NO SE BRINCA" x={960} y={240} size={64} />);
  served(0, 465.0, 470.7);

  // ===== SECRETO 2 · tatemar =====
  add(475.7, 481.0, () => <X.Banda t={t} at={475.9} out={480.8} n={2} text="EL JITOMATE SE PONE NEGRO" />);
  add(475.7, 481.0, () => { const p = sc(t, COMAL); return <Tag t={t} at={A("se llama tatemar", 476)} x={p.x} y={p.y} dx={280} dy={-220} text="TATEMAR" col={CH.maiz} out={480.8} size={66} />; });
  add(481.0, 486.9, () => <Stamp t={t} at={A("las fondas ya casi no", 481)} out={486.7} text="LAS FONDAS YA CASI NO" x={1420} y={260} size={62} col={CH.maiz} />);
  add(491.9, 502.0, () => <X.Card t={t} at={A("un jitomate grande", 493) - 0.2} out={501.8} x={1450} y={330} from="right"><X.H s={50} c={CH.maiz}>AL COMAL</X.H><Lst t={t} rows={[["1 jitomate grande", A("un jitomate grande", 493)], ["½ cebolla", A("media cebolla", 494)], ["5 dientes de ajo", A("dientes de ajo", 495)], ["(con su cáscara)", A("con todo y cascara", 498)]]} /></X.Card>);
  add(514.0, 520.4, () => { const p = sc(t, COMAL); return <Tag t={t} at={A("negros por fuera", 510)} x={p.x} y={p.y} dx={300} dy={-200} text="NEGROS POR FUERA" sub="SUAVECITOS POR DENTRO" col={CH.maiz} out={520.2} size={46} />; });
  add(514.0, 520.4, () => <Palomita t={t} at={A("no te asustes", 514)} out={520.2} y={240} text="NO TE ASUSTES DE LO NEGRO" />);
  add(526.0, 531.0, () => <X.Card t={t} at={A("ahumadito", 525)} out={530.8} x={1440} y={280} from="right"><X.H s={52} c={CH.maiz}>AHUMADITO</X.H><X.H s={44} f={HAND}>como de leña: el sabor del rancho</X.H></X.Card>);
  add(531.0, 536.3, () => <X.Card t={t} at={A("se pone dulce", 531)} out={536.1} x={1440} y={280} from="right"><X.H s={50} f={HAND}>por dentro: dulce</X.H></X.Card>);
  add(541.2, 545.5, () => <Nota t={t} at={A("como mantequilla", 540)} out={545.3} x={1480} y={300} lines={["El ajo, suavecito", "como mantequilla."]} rot={4} w={440} />);
  add(545.5, 569.4, () => <X.Conteo t={t} out={569.2} x={520} y={500} rows={[
    { label: "canela", n: 1, at: A("una raja de canela", 545), c: "#c08060", r: 14 }, { label: "clavos", n: 3, at: A("tres clavos", 547), c: "#6a3418" },
    { label: "pimienta gorda", n: 4, at: A("pimientas gordas", 551), c: "#8a5a32", r: 11 }, { label: "1 cdta comino", n: 1, at: A("cucharadita de comino", 551), c: "#b0903a" },
    { label: "1 cdta orégano", n: 1, at: A("de oregano", 553), c: "#6b8a3a" }, { label: "1 cda sal", n: 1, at: A("una cucharada de sal", 555), c: "#e8e0d0" }]} />);
  add(561.5, 569.4, () => <X.EscalaClavo t={t} at={561.6} out={569.2} x={1400} y={250} badAt={A("sabe a dentista", 561)} />);
  add(561.5, 569.4, () => <Pensado t={t} at={A("sabe a dentista", 561)} out={569.2} x={1300} y={800} text="...sabe a dentista" size={86} />);
  add(575.5, 587.4, () => <Receipt t={t} rows={[{ at: 575.6, item: "jitomate", $: 30 }, { at: A("en unos 40", 575), item: "cebolla y ajo", $: 40 }, { at: A("unos 45 pesos", 578), item: "especias", $: 45 }]} totalAt={1e9} x={1300} y={160} out={587.2} title="SECRETO 2" />);
  add(590.9, 595.5, () => <Pill t={t} at={A("la verdura cruda", 590)} out={595.3} x={1400} y={250} text="VERDURA CRUDA" />);
  add(590.9, 600.8, () => <Stamp t={t} at={A("se tatema hasta negro", 592)} out={600.6} text="HASTA NEGRO" x={600} y={820} size={80} />);
  add(605.0, 618.6, () => <X.Orden t={t} at={A("pon el comal a calentar", 605) - 0.2} out={613.3} steps={[{ label: "comal a calentar", at: A("pon el comal a calentar", 605) }, { label: "desvenas", at: A("mientras desvenas", 607) }, { label: "tatemas ahí mismo", at: A("ahi mismo", 609) }, { label: "verdura lista", at: A("la verdura lista", 611) }]} />);
  served(1, 613.5, 618.6);

  // ===== SECRETO 3 · colar dos veces =====
  add(622.3, 627.0, () => <X.Banda t={t} at={FLIP[2]} out={626.8} n={3} text="EL ADOBO SE CUELA DOS VECES" />);
  add(627.0, 634.9, () => <X.Textura t={t} at={627.1} out={634.7} x={960} y={860} goodAt={A("como seda", 626)} />);
  add(638.8, 650.4, () => <X.Tandas t={t} out={650.2} x={960} y={600} rows={[{ at: A("los chiles escurridos", 642), label: "los chiles escurridos", c: "#9a1e0e" }, { at: A("el jitomate", 645), label: "el jitomate tatemado", c: "#5a1a0c" }, { at: A("los ajos ya pelados", 647), label: "la cebolla y los ajos", c: "#a8642a" }]} />);
  add(638.8, 643.5, () => <Pill t={t} at={A("no lo colaron", 638)} out={643.3} x={1400} y={250} text="SIN COLAR" />);
  add(655.3, 661.0, () => <X.Card t={t} at={A("en el metate", 656)} out={660.8} x={1440} y={260} from="right"><X.H s={56} c={CH.maiz}>METATE</X.H><X.H s={44} f={HAND}>cuando no había licuadora</X.H></X.Card>);
  add(661.0, 667.5, () => <Nota t={t} at={A("tio chencho", 661)} out={667.3} x={1480} y={300} lines={["La licuadora", "de mi tío Chencho."]} rot={-3} w={440} />);
  add(671.5, 681.7, () => <X.Coladera t={t} at={671.6} out={681.5} x={1400} y={420} twoAt={A("la segunda", 674)} />);
  add(671.5, 681.7, () => <X.Card t={t} at={A("la que nadie hace", 675)} out={681.5} x={480} y={250} from="left"><X.H s={50} c={CH.maiz}>LA 2ª COLADA</X.H><X.H s={44} f={HAND}>la que nadie hace</X.H></X.Card>);
  add(685.9, 692.0, () => <Stamp t={t} at={A("secas mija", 686)} out={691.8} text="¡SECAS!" x={1420} y={280} size={110} />);
  add(692.0, 698.7, () => <><X.Fondo o={0.4 * e(t, 692.1, 692.6) * (1 - e(t, 698.3, 698.7))} /><X.Lupa t={t} at={692.2} out={698.5} x={960} y={520} cleanAt={1e9} label="LA CARNE DEL CHILE" /></>);
  add(704.6, 710.0, () => <Pill t={t} at={A("salio palido", 705)} out={709.8} x={1400} y={260} text="CONSOMÉ PÁLIDO" />);
  add(704.6, 710.0, () => <X.Card t={t} at={A("va a la basura", 703)} out={709.8} x={480} y={250} from="left"><X.H s={48} f={HAND}>el color se va a la basura</X.H></X.Card>);
  add(710.0, 716.3, () => <X.Card t={t} at={A("son las pieles", 710)} out={716.1} x={1440} y={280} from="right"><X.H s={52} c={CH.maiz}>LAS PIELES</X.H><X.H s={44} f={HAND}>como papelitos en la boca</X.H></X.Card>);
  add(720.9, 726.0, () => <Pill t={t} at={A("y no colar", 721)} out={725.8} x={1400} y={260} text="COLAR UNA VEZ" />);
  add(726.0, 730.7, () => <Palomita t={t} at={A("tiene arreglo", 727)} out={730.5} y={240} text="CON GRUMOS: TIENE ARREGLO" />);
  served(2, 726.0, 730.7, -260);

  // ===== CTA 2 =====
  add(736.3, 741.0, () => <X.Card t={t} at={A("te cuento algo", 738)} out={740.8} x={1460} y={300} from="right"><X.H s={50} c="#ff8fbf">EN MI LIBRO</X.H><X.H s={46} f={HAND}>la lista del mercado, con precios</X.H></X.Card>);
  add(741.0, 749.9, () => <X.GuiaPag t={t} at={A("la lista del mercado", 742)} out={749.7} x={1530} y={220} pag={PAG.lista} text="la lista del mercado, con su precio" />);
  add(753.7, 766.2, () => <X.GuiaPag t={t} at={G2P + 0.3} out={A("el menu de los 7", 756) - 0.1} x={1530} y={220} pag={PAG.usa} text="la misma lista, en inglés" />);
  add(753.7, 766.2, () => <X.GuiaPag t={t} at={A("el menu de los 7", 756) + 0.2} out={766.0} x={1530} y={220} pag={PAG.menu} text="el menú de los 7 días, pa'l refri" />);
  add(760.0, 766.2, () => <X.DescCard t={t} at={A("esta en el link", 760)} out={766.0} x={1440} y={760} hl={A("primera linea", 760)} />);

  // ===== SECRETO 4 · freír el adobo =====
  add(769.6, 774.0, () => <X.Banda t={t} at={769.8} out={773.8} n={4} text="EL ADOBO SE FRÍE" />);
  add(774.0, 779.9, () => <X.Cronometro t={t} at={A("el paso de 5 minutos", 773)} out={779.7} x={1600} y={340} mins={5} label="5 MINUTOS" />);
  add(774.0, 779.9, () => <Stamp t={t} at={A("casi nadie lo hace", 776)} out={779.7} text="CASI NADIE LO HACE" x={620} y={820} size={60} />);
  add(784.9, 795.3, () => <X.HervirFreir t={t} at={785.0} out={795.1} x={960} y={540} okAt={A("primero se frie", 788)} />);
  add(799.8, 810.6, () => <X.Onoma t={t} at={A("y eso truena", 802)} out={807.0} x={1300} y={340} text="¡TSSSHH!" col="#ffcf6a" />);
  add(799.8, 810.6, () => <Nota t={t} at={A("echarse para atras", 806)} out={810.4} x={1480} y={760} lines={["¡Pa'trás,", "que salta!"]} rot={3} w={400} />);
  add(814.8, 820.5, () => <Nota t={t} at={814.9} out={820.3} x={1480} y={280} lines={["Los niños,", "fuera de la cocina."]} rot={-3} w={440} />);
  add(820.5, 828.3, () => <X.Card t={t} at={A("con la cuchara de madera", 819)} out={828.1} x={1440} y={260} from="right"><X.H s={52} c={CH.maiz}>MOVER</X.H><X.H s={44} f={HAND}>raspando el fondo</X.H></X.Card>);
  add(820.5, 828.3, () => <X.Cronometro t={t} at={A("a fuego medio", 822)} out={828.1} x={420} y={420} mins={5} label="FUEGO MEDIO · 5 MIN" />);
  add(834.1, 846.0, () => <X.Senales t={t} out={845.8} x={480} y={440} title="YA SE FRIÓ CUANDO..." rows={[{ at: 834.2, text: "más oscuro" }, { at: A("mas brillante", 833), text: "más brillante" }, { at: A("espesa tantito", 834), text: "espesa tantito" }, { at: A("chile tostado", 836), text: "huele a chile tostado" }]} />);
  add(840.0, 846.0, () => <Palomita t={t} at={A("ya se frio", 841)} out={845.8} y={240} text="YA SE FRIÓ" />);
  add(850.2, 860.5, () => <X.Senales t={t} out={860.3} x={1380} y={420} title="LA GRASA CALIENTE TUESTA..." rows={[{ at: A("tuesta el chile", 850), text: "el chile" }, { at: A("la verdura", 851), text: "la verdura" }, { at: A("y las especias", 852), text: "las especias" }]} />);
  add(850.2, 860.5, () => <Stamp t={t} at={A("el agua sola nunca", 854)} out={860.3} text="EL AGUA SOLA, NUNCA" x={620} y={820} size={60} />);
  add(866.7, 872.0, () => <X.Versus t={t} at={A("un adobo frito", 866)} out={871.8} x={960} y={300} a="FRITO" b="CRUDO" w={900} rows={[["rojo profundo", true, false], ["sabe a chile tostado", true, false]]} />);
  add(872.0, 878.8, () => <X.GuiaPag t={t} at={A("lo que sale mal", 873)} out={878.6} x={1530} y={800} pag={PAG.mal} text="Si te sale mal: el consomé pálido" />);
  add(883.4, 888.5, () => <><X.Fondo o={0.42 * e(t, 883.5, 884) * (1 - e(t, 888.1, 888.5))} /><X.Cita t={t} at={883.6} out={888.3} x={960} y={500} text="Fríelo 5 minutos más." who="MI LIBRO" size={110} /></>);
  add(888.5, 894.8, () => <Precio t={t} at={A("unos 45 pesos", 889)} out={894.6} x={1440} y={140} top="$45" sub="EL LITRO DE ACEITE · TE DURA EL MES" />);
  add(898.5, 904.0, () => <><Pill t={t} at={A("un minutito", 898)} out={903.8} x={600} y={260} text="UN MINUTITO" /><Pill t={t} at={A("con el fuego alto", 899)} out={903.8} x={1320} y={260} text="FUEGO ALTO" /></>);
  add(904.0, 910.9, () => <Palomita t={t} at={A("pasalo a otra olla", 906)} out={910.7} y={240} text="A OTRA OLLA, SIN RASPAR" />);
  served(3, 916.3, 918.6);

  // ===== SECRETO 5 · agua fría, fuego que apenas tiembla =====
  add(918.6, 923.0, () => <X.Banda t={t} at={FLIP[4]} out={922.8} n={5} text="AGUA FRÍA, FUEGO QUE APENAS TIEMBLA" />);
  add(923.0, 929.8, () => <X.Card t={t} at={A("se deshace sola", 922)} out={929.6} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>LA CARNE QUE</X.H><X.H s={50} c={CH.maiz}>SE DESHACE SOLA</X.H></X.Card>);
  add(934.0, 939.5, () => <Pill t={t} at={A("a lo bruto", 935)} out={939.3} x={1400} y={260} text="HERVIR A LO BRUTO" />);
  add(939.5, 945.6, () => <X.Card t={t} at={A("dos carnes juntas", 941)} out={945.4} x={480} y={250} from="left"><X.H s={60} c={CH.maiz}>2 CARNES</X.H><X.H s={44} f={HAND}>juntas: parte del secreto</X.H></X.Card>);
  add(951.3, 957.0, () => <X.Carnes t={t} out={956.8} x={960} y={820} rows={[{ at: 951.4, n: "PECHO", s: "la carne que se deshebra" }, { at: A("chambarete con hueso", 951), n: "CHAMBARETE", s: "1½ kg, con hueso y tuétano" }]} />);
  add(957.0, 962.9, () => <X.Bascula t={t} at={A("dos kilos y medio", 958)} out={962.7} x={1450} y={480} kg={2.5} label="2½ KG" sub="en total" />);
  add(967.4, 971.0, () => <Precio t={t} at={A("en unos 285", 967)} out={970.8} x={1440} y={140} top="$285" sub="CHAMBARETE · 1½ KG" />);
  add(971.0, 978.9, () => <X.Card t={t} at={A("cuatro litros", 973)} out={978.7} x={1440} y={280} from="right"><X.H s={56} c="#9fd8ff">4 LITROS</X.H><X.H s={46} f={HAND}>de agua FRÍA, y tapas</X.H></X.Card>);
  add(982.9, 993.4, () => <X.FuegoNivel t={t} at={983.0} out={993.2} x={420} y={430} lvl={1} label="APENAS TIEMBLA" />);
  add(982.9, 993.4, () => <X.Cronometro t={t} at={A("tres horas", 988)} out={993.2} x={1600} y={340} mins={180} label="3 HORAS" dur={2.5} />);
  add(998.5, 1004.5, () => <X.Card t={t} at={A("despacio", 998)} out={1004.3} x={1440} y={280} from="right"><X.H s={50} f={HAND}>despacio, de afuera pa' adentro</X.H></X.Card>);
  add(1004.5, 1010.9, () => <X.Card t={t} at={A("los nervios", 1000)} out={1010.7} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>LO DURO</X.H><X.H s={44} f={HAND}>se vuelve consomé</X.H></X.Card>);
  add(1015.1, 1020.0, () => <Pensado t={t} at={A("nadando en caldo", 1015)} out={1019.8} x={1300} y={300} text="seca... ¡y nadando en caldo!" size={86} />);
  add(1020.0, 1026.8, () => <X.Card t={t} at={A("cada media hora", 1020)} out={1026.6} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>CADA ½ HORA</X.H><X.H s={44} f={HAND}>destapas y miras el agua</X.H></X.Card>);
  add(1030.9, 1037.0, () => <X.Card t={t} at={1031.0} out={1036.8} x={1440} y={300} from="right"><div style={{ display: "flex", gap: 40 }}><X.H s={70} c="#bfe88a">CALIENTE ✓</X.H><X.H s={70} c="#ff8a6a">FRÍA ✗</X.H></div></X.Card>);
  add(1037.0, 1043.5, () => { const f = sc(t, FIRE); return <Tag t={t} at={A("una ollita de agua caliente", 1036)} x={f.x} y={f.y} dx={300} dy={-220} text="LA OLLITA" sub="DE AGUA CALIENTE" col={CH.maiz} out={1043.3} size={52} />; });
  add(1048.2, 1054.0, () => <Palomita t={t} at={A("baje solita", 1049)} out={1053.8} y={240} text="QUE LA PRESIÓN BAJE SOLITA" />);
  add(1054.0, 1060.2, () => <Pill t={t} at={A("no la abras", 1051)} out={1060.0} x={1400} y={260} text="ABRIRLA O ENFRIARLA" />);
  add(1065.4, 1071.0, () => <X.FixCard t={t} at={1065.5} out={1070.8} x={960} y={860} prob="¿QUEDÓ DURA?" fix={["tapada, en su consomé", "½ hora a fuego bajito"]} fixAt={A("la dejas tapada", 1065)} />);
  add(1071.0, 1076.7, () => <X.Card t={t} at={A("el garbanzo", 1072)} out={1076.5} x={1440} y={280} from="right"><X.H s={52} c={CH.maiz}>EL GARBANZO</X.H><X.H s={44} f={HAND}>en otra ollita</X.H></X.Card>);
  add(1080.3, 1085.5, () => <Nota t={t} at={A("es para el miercoles", 1081)} out={1085.3} x={1480} y={300} lines={["El garbanzo:", "pa'l miércoles."]} rot={4} w={400} />);
  served(4, 1085.5, 1088.0, -260);
  add(1088.0, 1093.4, () => <X.Banda t={t} at={FLIP[5]} out={1093.2} n={6} text="LA GRASA ROJA ES ORO" />);

  // ===== SECRETO 6 · la grasa roja =====
  add(1097.8, 1103.5, () => { const p = sc(t, CZ); return <Tag t={t} at={A("toda esa grasa roja", 1098)} x={p.x} y={p.y} dx={330} dy={-210} text="LA GRASA ROJA" sub="FLOTANDO ARRIBA" col="#ff8a3a" out={1103.3} size={60} />; });
  add(1103.5, 1109.7, () => <Stamp t={t} at={A("a la basura", 1104)} out={1109.5} text="¡A LA BASURA!" x={1400} y={280} size={90} col="#ff5a3c" />);
  add(1115.7, 1125.5, () => <X.Card t={t} at={A("lo dejas enfriar", 1117)} out={1125.3} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>SE ENFRÍA</X.H><X.H s={46} f={HAND}>y la grasa sube toda arriba</X.H></X.Card>);
  add(1130.3, 1136.0, () => <X.GuiaPag t={t} at={A("el truco de chayo", 1131)} out={1135.8} x={1530} y={800} pag={PAG.receta} text="El truco de Chayo: la grasa, a su frasco" />);
  add(1136.0, 1142.7, () => <Pensado t={t} at={A("para que la quiero", 1138)} out={1142.5} x={1300} y={300} text="¿y pa' qué la quiero?" size={90} />);
  add(1147.5, 1159.0, () => <X.Versus t={t} at={A("se pintan de rojo", 1148)} out={1158.8} x={960} y={300} a="CON GRASA" b="SIN GRASA" w={940} rows={[["tortilla roja y crujiente", true, false], ["como la de la birriería", true, false]]} />);
  add(1163.6, 1169.5, () => <X.Cronometro t={t} at={A("dos minutos", 1164)} out={1169.3} x={1600} y={340} mins={2} label="TAPADO · 2 MIN" />);
  add(1163.6, 1169.5, () => <X.Card t={t} at={A("el huevo rojo", 1165)} out={1169.3} x={480} y={250} from="left"><X.H s={56} c="#ff8a3a">EL HUEVO ROJO</X.H><X.H s={44} f={HAND}>el desayuno de la semana</X.H></X.Card>);
  add(1169.5, 1175.3, () => <Palomita t={t} at={A("queda limpio", 1172)} out={1175.1} y={240} text="EL CONSOMÉ, LIMPIO" />);
  add(1180.7, 1186.5, () => <><X.Fondo o={0.42 * e(t, 1180.8, 1181.3) * (1 - e(t, 1186.1, 1186.5))} /><X.Cita t={t} at={1181.0} out={1186.3} x={960} y={500} text="La grasa, pa' la tortilla. El consomé, pa' la cuchara." who="MAMÁ CUCA" size={84} w={1300} /></>);
  add(1186.5, 1192.8, () => <X.Card t={t} at={A("te dura una semana", 1186)} out={1192.6} x={1440} y={280} from="right"><X.H s={52} c={CH.maiz}>1 SEMANA</X.H><X.H s={44} f={HAND}>en el refri, en su frasco tapado</X.H></X.Card>);
  add(1197.3, 1207.8, () => <X.FuegoNivel t={t} at={A("fuego medio", 1198)} out={1207.6} x={420} y={430} lvl={2} label="FUEGO MEDIO" />);
  add(1197.3, 1207.8, () => <Stamp t={t} at={A("nunca hasta que humee", 1199)} out={1207.6} text="NUNCA HASTA QUE HUMEE" x={1350} y={260} size={60} />);
  add(1211.9, 1217.5, () => <><X.Fondo o={0.42 * e(t, 1212.0, 1212.5) * (1 - e(t, 1217.1, 1217.5))} /><X.Cita t={t} at={A("ya la pagaste", 1212)} out={1217.3} x={960} y={500} text="Ya la pagaste con la carne." size={100} /></>);
  served(5, 1211.9, 1217.5);
  add(1217.5, 1225.6, () => <X.Banda t={t} at={FLIP[6]} out={1225.4} n={7} text="UNA OLLA, SIETE COMIDAS" />);

  // ===== SECRETO 7 · una olla, siete comidas =====
  add(1231.4, 1237.0, () => <X.Semana t={t} at={A("toda la semana", 1233)} out={1236.8} x={960} y={300} days={["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]} mark={1e9} hot={0} />);
  add(1237.0, 1242.8, () => <Stamp t={t} at={A("apartar antes de servir", 1238)} out={1242.6} text="APARTAR ANTES DE SERVIR" x={960} y={240} size={64} />);
  add(1248.1, 1257.5, () => <X.Bascula t={t} at={A("un kilo ochocientos", 1250)} out={1257.3} x={1450} y={480} kg={1.8} label="1,8 KG" sub="de carne deshebrada" />);
  add(1248.1, 1257.5, () => <X.Card t={t} at={A("la separas en tres", 1254)} out={1257.3} x={480} y={250} from="left"><X.H s={60} c={CH.maiz}>EN 3</X.H></X.Card>);
  add(1261.5, 1273.6, () => <X.Carnes t={t} out={1273.4} x={960} y={820} rows={[{ at: A("seiscientos gramos para el refri", 1261), n: "600 g · REFRI", s: "lunes, martes, miércoles" }, { at: A("seiscientos gramos para el congelador", 1264), n: "600 g · CONGELADOR", s: "jueves, viernes, sábado" }]} />);
  add(1279.1, 1284.5, () => <Palomita t={t} at={A("un cucharon limpio", 1280)} out={1284.3} y={240} text="CUCHARÓN LIMPIO, BOTES CHICOS" />);
  add(1284.5, 1290.8, () => <X.Refri t={t} at={1284.6} out={1290.6} x={1380} y={500} inAt={A("antes de dos horas", 1286)} />);
  add(1284.5, 1290.8, () => <X.Card t={t} at={A("antes de dos horas", 1286)} out={1290.6} x={480} y={250} from="left"><X.H s={56} c={CH.maiz}>ANTES DE 2 HORAS</X.H></X.Card>);
  add(1295.9, 1327.3, () => <X.Senales t={t} out={1327.1} x={470} y={470} title="LA SEMANA DE LA OLLA" rows={[{ at: A("el lunes", 1296), text: "lun · quesabirrias" }, { at: A("el martes", 1298), text: "mar · tacos dorados" }, { at: A("miercoles", 1305), text: "mié · consomé con arroz" }, { at: A("jueves", 1305), text: "jue · tostadas" }, { at: A("el viernes", 1314), text: "vie · chilaquiles" }, { at: A("el sabado", 1316), text: "sáb · sopes" }]} />);
  add(1321.0, 1327.3, () => <X.Card t={t} at={A("cada noche", 1318)} out={1327.1} x={1440} y={260} from="right"><X.H s={52} c={CH.maiz}>20 A 40 MIN</X.H><X.H s={44} f={HAND}>cada noche, y nada más</X.H></X.Card>);
  add(1331.4, 1337.0, () => <X.Calendario t={t} at={1331.5} out={1336.8} x={1540} y={470} flipAt={A("el jueves lo del viernes", 1332)} a="MIÉRCOLES" la="sacas lo del jueves" b="JUEVES" lb="sacas lo del viernes" />);
  add(1337.0, 1342.3, () => <Nota t={t} at={A("un pedazo de cinta", 1337)} out={1342.1} x={1480} y={300} lines={["Cinta con el", "nombre y el día."]} rot={-3} w={420} />);
  add(1347.0, 1353.0, () => <Nota t={t} at={A("mi tia licha", 1346)} out={1352.8} x={1480} y={280} lines={["Mi tía Licha se", "acordaba de todo."]} rot={4} w={460} />);
  add(1347.0, 1353.0, () => <Precio t={t} at={A("no cuesta nada", 1349)} out={1352.8} x={520} y={140} top="$0" sub="ESTE SECRETO · NOMÁS PLANEAR" />);
  add(1353.0, 1359.8, () => <Pill t={t} at={A("directo a la mesa", 1354)} out={1359.6} x={1400} y={260} text="DE LA OLLA A LA MESA" />);
  add(1365.7, 1370.0, () => <Stamp t={t} at={A("aparta primero", 1365)} out={1369.8} text="APARTA PRIMERO, SIRVE DESPUÉS" x={960} y={240} size={58} />);
  served(6, 1365.7, 1370.0, -240);
  add(1370.0, 1377.3, () => <BigNum t={t} at={A("cuatro cosas mas", 1371)} out={1377.1} text="+4" size={200} y={520} col={CH.maiz} edge="#5a2a10" sub="QUE SALEN DE ESTA OLLA" />);

  // ===== variantes =====
  add(1383.0, 1393.3, () => <X.Card t={t} at={1383.1} out={1393.1} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>1 · CÓMO SE SIRVE</X.H></X.Card>);
  add(1383.0, 1393.3, () => <X.Card t={t} at={A("una taza de consome", 1383)} out={1393.1} x={1450} y={330} from="right"><Lst t={t} rows={[["plato hondo + 1 taza de consomé", A("una taza de consome", 1383)], ["cebolla, cilantro y limón", A("cebolla picada", 1386)]]} s={44} /></X.Card>);
  add(1397.8, 1410.3, () => <X.Card t={t} at={A("la segunda", 1395)} out={1410.1} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>2 · QUESABIRRIAS</X.H></X.Card>);
  add(1397.8, 1413.6, () => <X.Orden t={t} at={A("por la grasa roja", 1398) - 0.2} out={1413.4} steps={[{ label: "por la grasa roja", at: A("por la grasa roja", 1398) }, { label: "queso Oaxaca", at: A("queso oaxaca", 1402) }, { label: "birria + queso", at: A("una cucharada de birria", 1403) }, { label: "media luna", at: A("en media luna", 1406) }]} />);
  add(1413.6, 1418.5, () => <X.Card t={t} at={A("hace hilo", 1414)} out={1418.3} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>HACE HILO</X.H><X.H s={44} f={HAND}>= ya está lista</X.H></X.Card>);
  add(1418.5, 1427.9, () => <X.Card t={t} at={A("la tercera", 1418)} out={1427.7} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>3 · LO QUE SOBRA</X.H></X.Card>);
  add(1427.9, 1434.0, () => <X.Card t={t} at={A("un cubito", 1429)} out={1433.8} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>CUBITOS</X.H><X.H s={44} f={HAND}>caldo pa' cualquier sopa</X.H></X.Card>);
  add(1434.0, 1439.8, () => <X.Card t={t} at={A("una torta", 1435)} out={1439.6} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>LA TORTA</X.H><X.H s={44} f={HAND}>bolillo, birria y su grasa roja</X.H></X.Card>);
  add(1446.0, 1450.0, () => <X.Cronometro t={t} at={1446.1} out={1449.8} x={1600} y={340} mins={10} label="10 MIN" />);
  add(1450.0, 1457.3, () => <X.Card t={t} at={A("y la cuarta", 1448)} out={1457.1} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>4 · SI SON DOS</X.H></X.Card>);
  add(1450.0, 1463.0, () => <X.Card t={t} at={A("la mitad de todo", 1454)} out={1462.8} x={1440} y={330} from="right"><X.H s={56} c={CH.maiz}>LA MITAD DE TODO</X.H><X.H s={44} f={HAND}>mismos pasos, mismo fuego</X.H></X.Card>);
  add(1463.0, 1469.0, () => <X.Card t={t} at={A("200 gramos", 1466)} out={1468.8} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>PORCIONES DE 200 g</X.H><X.H s={44} f={HAND}>pa'l congelador</X.H></X.Card>);
  add(1469.0, 1475.2, () => <BigNum t={t} at={A("lo que puede salir mal", 1470)} out={1475.0} text="SI ALGO SALE MAL" size={130} y={500} col={CH.crema} edge="#4a1a0c" />);

  // ===== lo que puede salir mal =====
  add(1479.3, 1493.0, () => <X.FixCard t={t} at={1479.4} out={1492.8} x={960} y={860} prob="¿AMARGA?" fix={["ese adobo se tira", "tostar otra vez: 10 s por lado"]} fixAt={A("ese adobo se tira", 1484)} />);
  add(1479.3, 1486.0, () => <X.GuiaPag t={t} at={A("lo que dice mi libro", 1481)} out={1485.8} x={1530} y={220} pag={PAG.mal} text="Si te sale mal: cómo se arregla" />);
  add(1498.2, 1509.6, () => <X.FixCard t={t} at={1498.3} out={1509.4} x={960} y={860} prob="¿PÁLIDO?" fix={["5 minutos de fritura", "que huela a chile tostado"]} fixAt={A("la proxima vez", 1502)} />);
  add(1514.3, 1518.5, () => <X.FixCard t={t} at={1514.4} out={1518.3} x={960} y={860} prob="¿SECA?" fix={["tapada, ½ hora más", "fuego bajito"]} fixAt={1514.6} />);
  add(1518.5, 1523.2, () => <X.FixCard t={t} at={A("quedo con grumos", 1518)} out={1523.0} x={960} y={860} prob="¿GRUMOS?" fix={["colar otra vez, apretando"]} fixAt={A("no lo colaste bien", 1519)} />);
  add(1528.4, 1535.0, () => <X.FixCard t={t} at={1528.5} out={1534.8} x={960} y={860} prob="¿GRASA QUEMADA?" fix={["esa se tira", "la nueva: fuego medio"]} fixAt={A("esa se tira", 1530)} />);
  add(1535.0, 1541.0, () => <Pill t={t} at={A("se te rompen", 1538)} out={1540.8} x={1400} y={260} text="SE ROMPEN" />);
  add(1546.8, 1551.5, () => <X.FixCard t={t} at={1546.9} out={1551.3} x={960} y={860} prob="¿EL QUESO NO SE DERRITE?" fix={["comal más caliente"]} fixAt={A("estaba muy frio", 1549)} />);
  add(1551.5, 1557.2, () => <><X.Fondo o={0.42 * e(t, 1551.6, 1552.1) * (1 - e(t, 1556.8, 1557.2))} /><X.Cita t={t} at={A("no es que no sepas", 1551)} out={1557.0} x={960} y={500} text="No es que no sepas. Es que nadie te lo había dicho." size={84} w={1300} /></>);

  // ===== la cuenta =====
  add(1560.5, 1566.0, () => <BigNum t={t} at={1560.6} out={1565.8} text="LA CUENTA" size={170} y={500} col={CH.maiz} edge="#5a2a10" sub="PRECIOS DE MERCADO · MICHOACÁN" />);
  add(1566.0, 1606, () => <Receipt t={t} rows={[
    { at: A("el pecho", 1566), item: "pecho", $: 170 }, { at: A("el chambarete", 1568), item: "chambarete", $: 285 }, { at: 1573.0, item: "chiles", $: 40 }, { at: 1575.0, item: "jitomate", $: 30 },
    { at: A("la cebolla y el ajo", 1576), item: "cebolla y ajo", $: 40 }, { at: A("el cilantro", 1578), item: "cilantro", $: 24 }, { at: A("limones y lechuga", 1580), item: "limón y lechuga", $: 50 },
    { at: A("los quesos y la crema", 1582), item: "quesos y crema", $: 95 }, { at: 1590.0, item: "tortillas y tostadas", $: 82 }, { at: 1592.5, item: "masa pa' sopes", $: 22 },
    { at: A("el arroz y el garbanzo", 1594), item: "arroz y garbanzo", $: 27 }, { at: A("y la canela", 1596), item: "especias", $: 45 }]}
    totalAt={A("todo junto", 1600)} x={110} y={60} out={1605.8} sc={0.86} title="PA' 28 PLATOS" />);
  add(1608.4, 1619.7, () => <X.Cifra t={t} at={A("son 28 platos", 1612)} out={1619.5} x={1400} y={300} to={28} post=" platos" sub="4 personas · 7 días" size={120} />);
  add(1608.4, 1619.7, () => <X.Cifra t={t} at={A("unos 33 pesos", 1614)} out={1619.5} x={1400} y={640} to={33} pre="$" post=" el plato" size={130} />);
  add(1608.4, 1619.7, () => <X.GuiaPag t={t} at={A("unos 33 pesos", 1614) + 0.6} out={1619.5} x={480} y={220} pag={PAG.cuenta} text="unos $33 el plato" />);
  add(1625.9, 1630.5, () => <Palomita t={t} at={A("nada de bote", 1626)} out={1630.3} y={240} text="NADA DE BOTE" />);
  add(1630.5, 1637.1, () => <Precio t={t} at={A("unos 95 dolares", 1631)} out={1636.9} x={1440} y={140} top="US$95" sub="MENOS DE 3½ DÓLARES EL PLATO" />);
  add(1642.8, 1653.5, () => <Nota t={t} at={A("no alcanzaba", 1643)} out={1653.3} x={1480} y={300} lines={["Una olla el domingo,", "y nadie se daba cuenta."]} rot={-3} w={500} />);

  // ===== resumen, tarea, comentarios, próximo, cierre =====
  add(1659.6, 1687.2, () => PLATES.map((q, i) => { const p = sc(t, q); return <X.PlateLabel key={i} t={t} at={Math.max(1659.65, RES[i])} out={1687.0} x={p.x} y={p.y} n={i + 1} text={["chiles contados", "jitomate negro", "colar 2 veces", "freír el adobo", "agua fría, fuego bajito", "la grasa roja", "aparta antes"][i]} up={i % 2 ? 250 : 130} />; }));
  add(1691.1, 1702.0, () => <X.Tarea t={t} at={A("no hagas los 7", 1691)} out={1701.8} x={1360} y={500} rows={[{ at: A("cuela tu adobo", 1693), text: "colar el adobo 2 veces" }, { at: A("y frielo", 1694), text: "freírlo 5 minutos" }]} />);
  add(1706.7, 1719.1, () => <X.Encuesta t={t} at={A("cuentame aqui abajo", 1707)} out={1718.9} x={1340} y={440} q="¿TU BIRRIA ES DE...?" a="res" b="chivo o borrego" pa={-1} />);
  add(1723.2, 1734.8, () => <X.Card t={t} at={A("el proximo domingo", 1723)} out={1734.6} x={1300} y={420} from="right" col={CH.maiz}><X.H s={46} c={CH.maiz}>EL PRÓXIMO DOMINGO</X.H><X.H s={52} f={HAND}>otra olla de mi abuela,</X.H><X.H s={52} f={HAND}>pa' toda la semana</X.H></X.Card>);
  add(1738.3, 1744.0, () => <X.Cita t={t} at={1738.4} out={1743.8} x={960} y={300} text="La birria no se apura. Se espera." size={96} />);
  add(1744.0, END_T, () => <X.Orden t={t} at={A("chiles contados", 1735) - 0.2} out={1749.6} nums={false} steps={[{ label: "chiles contados", at: A("chiles contados", 1735) }, { label: "adobo frito", at: A("adobo frito", 1735) }, { label: "el fuego que apenas tiembla", at: A("apenas tiembla", 1744) }]} />);
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
  }
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
