// donlupe01 · RESTO del video (fin del minuto 1 → 871,8 s). El mismo hilo: la cocina del rancho es el mundo y todo entra y sale de ahí.
// Línea de PLANOS (avatar · mundo 3D con su cámara · foto real con empuje lento) con transiciones de rancho (humareda, barrido, portal desde
// el punto del mundo) + piezas NUEVAS por minuto (piezas2.tsx) clavadas a la voz con at("frase"). Audio fuera de Remotion.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, getInputProps, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, JARS, TY, screenOf, camSpeed, setKeys, Key, V } from "./rancho3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, DrawX, Flash, FONT, P, Portal, Tag, at, e, ei, s } from "./lib";
import { Humareda, Ficha, Salero, Sobre, Gis, Pregunta, Burbuja, MIN1_END } from "./Min1";
import { Letrero, Mapa, Campanita, Lista, Sello, Calendario, Dicho, PlacaSecreto, Cortes, Gelatina, Cobija, CuboCorte, Ticket, Congelada, SalJugo, Cucharas, Reloj, Chiles, Comal, Receta, Medidor, Maguey2D, CrudaAsada, Muestrario, Iconos, IC, Etiquetas, VaporCorte, HoyoCorte, Moneda, Goteo, Orden, Barras, Destapa, Arreglo, Cuenta, Garrafa, Semana, Encuesta, Golpe } from "./piezas2";

const NOMB = !!(getInputProps() as { nomb?: boolean }).nomb;
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
const IMGS = new Set((AVAIL as { imgs?: string[] }).imgs ?? []);
type Win = { ms: number; me: number; off: number };
const R: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms >= 125);
export const TOTAL_END = 871.8;
export const TOTAL_FRAMES = s(TOTAL_END);

// at() con fecha aproximada (la del guion medido): busca desde ap-3 y avisa si cayó lejos (frase mal escrita)
const w = (ph: string, ap: number) => { const v = at(ph, ap - 3); if (Math.abs(v - ap) > 4) console.warn(`[donlupe01] "${ph}" cayó en ${v.toFixed(2)} (esperado ~${ap})`); return v; };

// ---------------- vistas de cámara del mundo ----------------
type Vw = { p: V; l: V; fov?: number };
const CA = PT.carne;
const VW = {
  aereo: { p: [2.5, 8.5, 10.5], l: [2.5, 0, -1], fov: 44 } as Vw,
  aereo2: { p: [3.5, 6.2, 8.0], l: [2.5, 0.4, -1], fov: 40 } as Vw,
  mesa: { p: [-0.95, 1.34, 0.95], l: [0.3, 0.86, -0.45], fov: 38 } as Vw,
  mesa2: { p: [-0.72, 1.28, 0.78], l: [0.3, 0.86, -0.45], fov: 36 } as Vw,
  carne: { p: [0.55, 1.14, 0.52], l: CA, fov: 30 } as Vw,
  carne2: { p: [0.32, 1.06, 0.38], l: CA, fov: 27 } as Vw,
  carneL: { p: [-0.35, 1.18, 0.62], l: CA, fov: 30 } as Vw,
  fogon: { p: [0.3, 1.55, -0.85], l: [1.35, 1.08, -2.1], fov: 40 } as Vw,
  fogon2: { p: [0.6, 1.45, -0.95], l: [1.35, 1.05, -2.1], fov: 38 } as Vw,
  lumbre: { p: [0.35, 1.25, -0.35], l: [1.35, 0.75, -1.9], fov: 40 } as Vw,
  vapor: { p: [-0.55, 1.62, -0.55], l: [0.45, 1.22, -2.1], fov: 40 } as Vw,
  vapor2: { p: [-0.2, 1.55, -0.9], l: [0.45, 1.25, -2.1], fov: 38 } as Vw,
  pared: { p: [-0.55, 1.5, -0.2], l: [-1.65, 1.6, -2.6], fov: 46 } as Vw,
  pared2: { p: [-0.8, 1.55, -0.6], l: [-1.65, 1.6, -2.6], fov: 44 } as Vw,
  pencas: { p: [-1.5, 1.45, -0.55], l: [-2.55, 1.0, -2.0], fov: 40 } as Vw,
  pencas2: { p: [-1.85, 1.3, -1.0], l: [-2.55, 0.95, -2.0], fov: 36 } as Vw,
  hoyo: { p: [4.7, 1.7, 0.4], l: [6.4, 0.0, -1.6], fov: 42 } as Vw,
  hoyo2: { p: [5.6, 1.55, -0.6], l: [6.4, -0.5, -1.6], fov: 40 } as Vw,
  patio: { p: [2.3, 1.0, 2.45], l: [3.5, 0.35, 1.1], fov: 38 } as Vw,
  patio2: { p: [4.1, 0.95, 2.45], l: [3.5, 0.35, 1.1], fov: 32 } as Vw,
  jarros: { p: [-1.45, 1.25, 1.55], l: [-0.95, 0.88, 0.3], fov: 34 } as Vw,
  consome: { p: [1.25, 1.28, 0.95], l: PT.consome, fov: 34 } as Vw,
  consome2: { p: [1.1, 1.2, 0.78], l: PT.consome, fov: 30 } as Vw,
};
const jarV = (i: number): Vw => ({ p: [JARS[i][0] - 0.22, 1.16, 1.18], l: [JARS[i][0] + 0.05, 0.9, 0.3], fov: 34 });
const jarIn = (i: number): Vw => ({ p: [JARS[i][0] + 0.04, 1.02, 0.98], l: [JARS[i][0], TY + 0.12, 0.3], fov: 26 });
const jarTop = (i: number): V => [JARS[i][0], TY + 0.08, JARS[i][2]];

// ---------------- PLANOS ----------------
type Tr = "humo" | "whip" | "portal";
type Beat = { a: number; k: "av" | "w" | "img"; img?: string; z?: [number, number]; ox?: number; v?: [Vw, Vw]; mid?: { t: number; v: Vw }[]; st?: (t: number, a: number) => Partial<WorldProps>; tr?: Tr; px?: (t: number) => { x: number; y: number } };
const night = (n: number) => () => ({ night: n });
const B: Beat[] = [];
const img = (a: number, k: string, tr: Tr = "humo", z: [number, number] = [1.03, 1.1], ox = 0, px?: Beat["px"]) => B.push({ a, k: "img", img: k, tr, z, ox, px });
const wb = (a: number, v0: Vw, v1: Vw, tr: Tr = "humo", st?: Beat["st"], mid?: Beat["mid"], px?: Beat["px"]) => B.push({ a, k: "w", v: [v0, v1], tr, st, mid, px });

// tiempos de la voz que se usan en varios lugares
const TT = {
  sec: [w("secreto numero uno", 240.6), w("secreto numero 2", 336.7), w("secreto numero 3", 392.7), w("secreto numero 4", 464.3), w("secreto numero 5", 540.5), w("secreto numero 6", 609.8), w("secreto numero 7", 672.6)],
};
// un secreto: los jarritos de lado a lado → la cámara se mete al jarrito n, cae la placa
const secreto = (n: number, a: number, b: number) => wb(a, VW.jarros, jarIn(n - 1), "humo", undefined, [{ t: a + 0.9, v: jarV(n - 1) }, { t: Math.min(b - 0.3, a + 2.6), v: jarIn(n - 1) }]);

// ===== 126,7 → 135,1 · la sal (cola del portal del minuto 1) · "tú haz la prueba" · DON LUPE · Michoacán
img(MIN1_END, "k_sal", "humo", [1.0, 1.08]);
const tPres = w("para los que no me conocen", 128.5);
img(tPres, "r_lupe_presenta", "humo", [1.02, 1.08]);
const tNaci = w("naci y me crie", 133.6);
wb(tNaci - 0.15, VW.aereo2, VW.aereo, "whip");
// R0 · 135,1-139,4 avatar
// ===== 139,4 → 152 · "soy el que se come todo" · la barbacoa la hago yo · el olor del hoyo de mi abuelo
wb(R[0].me, VW.carneL, VW.carne, "humo");
const tHago = w("pero la barbacoa compadre", 144.5);
img(tHago, "r_lupe_pierna", "whip", [1.02, 1.09]);
const tOlor = w("y si hay un olor", 149.5);
wb(tOlor, VW.hoyo, VW.hoyo2, "humo", () => ({ dawn: 1, hoyoSteam: 0.6 }));
// R1 · 152-156,3
// ===== 156,3 → 183,5 · el abuelo en la madrugada · suscríbete + campanita · el mercado · vamos al fogón
img(R[1].me, "r_abuelo", "humo", [1.04, 1.1]);
const tRap = w("y rapidito", 160.3);
wb(tRap, VW.fogon, VW.fogon2, "humo");
const tDigo = w("y te digo una cosa", 168.6);
img(tDigo, "r_mercado", "whip", [1.02, 1.1], -30);
const tAsi = w("asi la hacia mi abuelo", 176.6);
wb(tAsi, VW.mesa, VW.lumbre, "humo", undefined, [{ t: w("vamos al fogon", 179.4) - 0.2, v: VW.mesa2 }]);
// R2 · 183,5-188 · Don Teodoro
// ===== 188 → 199,6 · bautizos, bodas, el santo · la boda del tío Ramiro, 200 gentes, desde el viernes
img(R[2].me, "r_boda", "humo", [1.02, 1.1], 20);
const tCaso = w("cuando se caso mi tio ramiro", 194.3);
wb(tCaso, VW.hoyo, VW.aereo2, "whip", () => ({ night: 0.35, brasas: 0.7 }));
// R3 · 199,6-205,4
// ===== 205,4 → 217,1 · el niño cuidando la lumbre · las piedras al rojo · "no te duermas Lupito"
img(R[3].me, "r_nino", "humo", [1.03, 1.1]);
const tPied = w("hasta que las piedras", 211.5);
wb(tPied, VW.hoyo, VW.hoyo2, "humo", () => ({ night: 1, brasas: 1 }));
// R4 · 217,1-221,1
// ===== 221,1 → 231,4 · ¿por qué la del señor de la plaza no? · "le tiene miedo al tiempo"
img(R[4].me, "r_plaza", "humo", [1.02, 1.09], -20);
const tCont = w("y me contesto", 226.6);
wb(tCont, VW.lumbre, VW.fogon2, "humo", () => ({ night: 1 }));
// R5 · 231,4-236,4
// ===== 236,4 → 248,9 · SECRETO 1 · la carnicería
secreto(1, R[5].me, w("aqui empieza la mitad", 245.9));
const tMitad = w("aqui empieza la mitad", 245.9);
img(tMitad, "r_carniceria", "portal", [1.0, 1.08], 0, (t) => screenOf(t, jarTop(0)));
// R6 · 248,9-254,5 (burbuja con los cubitos)
// ===== 254,5 → 265,7 · se te va a secar · los cortes del borrego
wb(R[6].me, VW.carne, VW.carne2, "humo", () => ({ dry: 1, meatSteam: 0, desh: 0.35 }));
const tBorr = w("mi abuelo usaba borrego", 258.8);
wb(tBorr, VW.mesa, VW.mesa2, "whip", () => ({ dof: 0.012 }));
const tRes = w("si tu la vas a hacer de res", 264.1);
img(tRes, "r_cachete", "humo", [1.02, 1.1]);
// R7 · 265,7-270,6
// ===== 270,6 → 282,9 · nervio y colágeno → gelatina · se deshace en la boca
wb(R[7].me, VW.vapor, VW.vapor2, "humo", () => ({ vapor: 1, dof: 0.008 }));
const tDesh = w("eso es lo que hace que", 280.2);
wb(tDesh, VW.carneL, VW.carne2, "humo", (t, a) => ({ fork: ei(t, a + 0.1, a + 1.8), desh: ei(t, a + 0.3, a + 2.0) }));
// R8 · 282,9-286,6
// ===== 286,6 → 300,3 · la grasa como cobija · se quita en el plato · pedazos de un kilo
img(R[8].me, "r_grasa", "humo", [1.02, 1.08], -40);
const tSobra = w("la grasa que sobra", 293.6);
wb(tSobra, VW.mesa2, VW.mesa, "humo");
const tPed = w("y en pedazos grandes", 297.4);
img(tPed, "r_trozos", "whip", [1.02, 1.08]);
// R9 · 300,3-304,4 (cubito vs pedazo grande)
// ===== 304,4 → 315,8 · jugoso por dentro · la carnicería del pueblo (ticket)
wb(R[9].me, VW.carne2, VW.carne, "humo", () => ({ desh: 0 }));
const tCarn = w("en la carniceria de mi pueblo", 310.3);
wb(tCarn, VW.mesa, VW.mesa2, "humo", () => ({ dof: 0.01 }));
// R10 · 315,8-319,4
// ===== 319,4 → 330,9 · cuenta para 10 · congelada al fuego no
wb(R[10].me, VW.consome, VW.carneL, "humo", () => ({ dof: 0.01 }));
const tErr = w("y el error mas comun", 325.4);
wb(tErr, VW.fogon, VW.fogon2, "whip", () => ({ dof: 0.008 }));
// R11 · 330,9-336,7
// ===== 336,7 → 347,9 · SECRETO 2: la sal la noche antes · el salero del coraje · ¿endurece? MITO · el sábado en la noche
secreto(2, R[11].me, w("pos mi abuelo la salaba", 345.7));
const tPos = w("pos mi abuelo la salaba", 345.7);
wb(tPos, VW.mesa2, VW.carne, "humo", night(1));
// R12 · 347,9-352,3
// ===== 352,3 → 363,3 · el jugo sale / toda la noche / vuelve con la sal
wb(R[12].me, VW.carne, VW.carne2, "humo", () => ({ night: 1, dof: 0.014 }));
// R13 · 363,3-368,4
// ===== 368,4 → 380,3 · hasta el centro · una cucharada por kilo
wb(R[13].me, VW.carne2, VW.carneL, "humo", () => ({ night: 1, dof: 0.014 }));
const tMed = w("la medida de mi abuelo", 373.2);
wb(tMed, VW.mesa, VW.mesa2, "humo", () => ({ dof: 0.01 }));
// R14 · 380,3-386,3
// ===== 386,3 → 398,7 · 12 horas mínimo (el traste) · SECRETO 3
img(R[14].me, "r_traste_sal", "humo", [1.02, 1.08], -30);
secreto(3, TT.sec[2], R[15].ms);
// R15 · 398,7-403,7
// ===== 403,7 → 417 · guisado · 8 guajillo + 3 anchos · el comal
img(R[15].me, "r_aguado", "humo", [1.02, 1.08]);
const tPara3 = w("para 3 kilos de carne", 407.1);
wb(tPara3, VW.fogon, VW.lumbre, "whip", () => ({ dof: 0.01 }));
const tComal = w("y al comal", 413.2);
img(tComal, "r_comal", "humo", [1.02, 1.1], 30);
// R16 · 417-422,7
// ===== 422,7 → 435,2 · un chile quemado amarga · la licuadora
img(R[16].me, "r_quemado", "humo", [1.02, 1.08]);
const tRem = w("los remojas 20 minutos", 426.7);
img(tRem, "r_licuadora", "whip", [1.02, 1.1], -40);
// R17 · 435,2-440,9
// ===== 440,9 → 451,9 · espeso como pasta · se unta encima de la sal
wb(R[17].me, VW.lumbre, VW.fogon2, "humo", () => ({ dof: 0.01 }));
const tUnt = w("y lo untas la noche antes", 447.4);
img(tUnt, "r_untar", "humo", [1.02, 1.08]);
// R18 · 451,9-457,8
// ===== 457,8 → 471,2 · se queda pegado · SECRETO 4 · la penca de maguey
wb(R[18].me, VW.carne, VW.carne2, "humo", () => ({ desh: 0.2 }));
wb(TT.sec[3], VW.jarros, VW.patio, "humo", () => ({ dof: 0.006 }), [{ t: TT.sec[3] + 0.9, v: jarV(3) }, { t: TT.sec[3] + 2.6, v: jarIn(3) }, { t: w("la penca es la hoja", 469.1), v: VW.aereo2 }]);
// R19 · 471,2-474,8
// ===== 474,8 → 485,6 · el machete en el cerro · la penca cruda no sirve, se asa
img(R[19].me, "r_lupe_machete", "humo", [1.02, 1.08], 30);
const tAqui = w("y aqui esta el secreto", 479.4);
wb(tAqui, VW.patio, VW.patio2, "whip", (t) => ({ pencaFire: ei(t, w("la tienes que asar", 480.9), w("la tienes que asar", 480.9) + 4) }));
// R20 · 485,6-490,4
// ===== 490,4 → 501,3 · la penca en las brasas · abraza la carne, olor dulce
img(R[20].me, "r_penca_brasa", "humo", [1.03, 1.1]);
const tRomp = w("asi ya no se rompe", 495.0);
wb(tRomp, VW.patio2, VW.patio, "humo", () => ({ pencaFire: 1 }));
// R21 · 501,3-506,4
// ===== 506,4 → 518,6 · se cuece pareja · ¿sin penca? no te apures
img(R[21].me, "r_envolver", "humo", [1.02, 1.08]);
const tCiud = w("ahora si vives en la ciudad", 514.0);
wb(tCiud, VW.mesa, VW.mesa2, "whip", () => ({ dof: 0.008 }));
// R22 · 518,6-523,1
// ===== 523,1 → 534,6 · la hoja de plátano en la llama · hojas de aguacate
img(R[22].me, "r_platano", "humo", [1.02, 1.08]);
const tAgu = w("hojas de aguacate secas", 529.7);
wb(tAgu - 0.6, VW.fogon, VW.fogon2, "humo", () => ({ dof: 0.01 }));
// R23 · 534,6-537,8
// ===== 537,8 → 550,1 · SECRETO 5 · el agua nunca toca la carne (corte de la vaporera)
const tImp = w("y lo que importa de los dos", 543.5);
secreto(5, R[23].me, tImp);
wb(tImp, VW.vapor, VW.vapor2, "portal", () => ({ vapor: 1, dof: 0.006 }), undefined, (t) => screenOf(t, jarTop(4)));
// R24 · 550,1-554,1
// ===== 554,1 → 564,6 · el hoyo: 1 m × 80 cm, piedras de río
wb(R[24].me, VW.hoyo, VW.hoyo2, "humo", () => ({ night: 0.3, brasas: 0.35, dof: 0.004 }));
// R25 · 564,6-569,4
// ===== 569,4 → 578,9 · la leña hecha brasa · la olla, la parrilla, las pencas, la carne, y se tapa
wb(R[25].me, VW.hoyo2, VW.hoyo, "humo", () => ({ night: 0.8, brasas: 1 }));
const tBaj = w("ahi bajaba la olla", 573.0);
wb(tBaj, VW.aereo2, VW.hoyo, "humo", () => ({ night: 0.6, brasas: 0.3, dof: 0.01 }));
// R26 · 578,9-583,7
// ===== 583,7 → 598,5 · cuatro dedos · en capas · el truco de los tamales
img(R[26].me, "r_vaporera", "humo", [1.02, 1.1]);
const tCama = w("encima de la parrilla una cama", 587.4);
img(tCama, "r_capas", "whip", [1.02, 1.08]);
const tTruco = w("y aqui te va un truco", 595.5);
wb(tTruco, VW.vapor, VW.vapor2, "humo", () => ({ vapor: 0.9 }));
// R27 · 598,5-603,6 (la moneda)
// ===== 603,6 → 614,1 · agua caliente por la orilla · SECRETO 6 · la olla de barro abajo
wb(R[27].me, VW.vapor2, VW.vapor, "humo", () => ({ vapor: 0.7 }));
const tAbajo = w("abajo de la carne en el hoyo", 612.6);
secreto(6, TT.sec[5], tAbajo);
img(tAbajo, "r_olla_jugo", "portal", [1.0, 1.08], 0, (t) => screenOf(t, jarTop(5)));
// R28 · 614,1-618,8
// ===== 618,8 → 630,2 · gota por gota · la olla es oro · lo que lleva la olla
wb(R[28].me, VW.hoyo2, VW.hoyo, "humo", () => ({ dawn: 1, hoyo: 1, hoyoSteam: 0.5 }));
const tOro = w("en la manana esa olla", 623.7);
img(tOro, "r_consome", "whip", [1.02, 1.1]);
const tParaQ = w("para que sea consome", 626.2);
img(tParaQ, "r_ingredientes", "humo", [1.02, 1.08], -30);
// R29 · 630,2-635,7
// ===== 635,7 → 646,7 · la olla del fogón recibe el jugo toda la noche
wb(R[29].me, VW.fogon, VW.fogon2, "humo", () => ({ night: 0.7, dof: 0.006 }));
// R30 · 646,7-652
// ===== 652 → 664,1 · con cebolla, cilantro, limón y chile de árbol · primero el consomé
wb(R[30].me, VW.consome, VW.consome2, "humo");
const tDecia = w("mi abuelo decia que el consome", 658.2);
wb(tDecia, VW.mesa, VW.mesa2, "whip");
// R31 · 664,1-669,1 (sabe a sobre)
// ===== 669,1 → 680,9 · nada sudó encima · SECRETO 7 · no se puede apurar
wb(R[31].me, VW.fogon2, VW.fogon, "humo");
secreto(7, TT.sec[6], R[32].ms);
// R32 · 680,9-686,7 (10 pm → 6 am)
// ===== 686,7 → 699 · ocho horas sin asomarse · lámina, costal, tierra · cordón de masa
img(R[32].me, "r_lupe_reloj", "humo", [1.02, 1.08]);
const tTapa = w("el hoyo se tapa con una lamina", 688.7);
img(tTapa, "r_lupe_tapa", "humo", [1.02, 1.08], 30);
const tSello = w("en la vaporera el sello", 695.4);
img(tSello, "r_masa_sello", "whip", [1.02, 1.1]);
// R33 · 699-703,3
// ===== 703,3 → 714,6 · se te escapa la barbacoa · 4 a 5 horas
wb(R[33].me, VW.vapor2, VW.vapor, "humo", () => ({ vapor: 1.6 }));
const tVap3 = w("en la vaporera 3 kilos", 706.8);
wb(tVap3, VW.fogon, VW.lumbre, "humo", () => ({ dof: 0.012 }));
// R34 · 714,6-719,2 (+15 min)
// ===== 719,2 → 732,3 · el que destapa · tres señales · el hueso sale limpio
wb(R[34].me, VW.vapor, VW.vapor2, "humo", () => ({ vapor: 1.4 }));
const tComo = w("como sabes que ya esta", 726.9);
wb(tComo, VW.carne, VW.carneL, "whip");
const tHues = w("el hueso sale limpio", 729.7);
img(tHues, "r_hueso_sale", "whip", [1.02, 1.1]);
// R35 · 732,3-735,6
// ===== 735,6 → 747 · se deshebra con el tenedor · 20 minutos de reposo
wb(R[35].me, VW.carneL, VW.carne2, "humo", (t, a) => ({ fork: ei(t, a + 0.1, a + 1.8), desh: ei(t, a + 0.3, a + 2.0) }));
const tApag = w("y cuando apagas", 739.0);
wb(tApag, VW.vapor, VW.vapor2, "humo", () => ({ vapor: 0.25, fire: 0.35 }));
// R36 · 747-752,3
// ===== 752,3 → 762,7 · sigue dura: una hora más · NO FUISTE TÚ · salió seca
wb(R[36].me, VW.lumbre, VW.fogon2, "humo", () => ({ fire: 0.6, dof: 0.008 }));
const tNoF = w("no fuiste tu", 759.0);
wb(tNoF, VW.pared, VW.pared2, "humo");
const tSeca = w("si salio seca", 760.2);
img(tSeca, "r_seca", "whip", [1.02, 1.08]);
// R37 · 762,7-767,7
// ===== 767,7 → 778,6 · salada: el consomé te salva · hay aritmética
wb(R[37].me, VW.consome2, VW.consome, "humo");
const tCuen = w("y ahora la cuenta", 774.3);
wb(tCuen, VW.mesa2, VW.mesa, "humo", () => ({ dof: 0.006 }));
// R38 · 778,6-783,2
// ===== 783,2 → 794,7 · la taquería: kilo y medio $750 · en tu casa
img(R[38].me, "r_taqueria", "humo", [1.02, 1.08]);
// R39 · 794,7-799,3
// ===== 799,3 → 828,9 · $720 + 5 L de consomé · lo que sobra · la semana · media semana de comer
wb(R[39].me, VW.mesa, VW.mesa2, "humo", () => ({ dof: 0.01 }));
const tSob = w("y lo que sobra no se tira", 806.3);
img(tSob, "r_sobras", "whip", [1.02, 1.08]);
const tDom = w("el domingo tacos", 811.6);
img(tDom, "r_tacos_dom", "humo", [1.02, 1.1], -30);
const tUna = w("asi una sola barbacoa", 819.1);
img(tUna, "r_lupe_sirve", "humo", [1.02, 1.08]);
const tMet = w("porque el adobo se va metiendo", 825.0);
wb(tMet, VW.carneL, VW.carne2, "whip");
// R40 · 828,9-832,7
// ===== 832,7 → 843,7 · las dos cosas · los siete secretos en la descripción
wb(R[40].me, VW.fogon, VW.fogon2, "humo", () => ({ dof: 0.008 }));
const tSiete = w("los siete secretos te los", 838.6);
wb(tSiete, VW.jarros, jarV(6), "humo", undefined, [{ t: tSiete + 2.5, v: jarV(3) }]);
// R41 · 843,7-849,2 (¿borrego, res o chivo?)
// ===== 849,2 → 863,1 · ¿hoyo o vaporera? · de dónde me ven · campanita · los frijoles charros
wb(R[41].me, VW.hoyo, VW.hoyo2, "humo");
const tQuiero = w("quiero saber de donde", 851.4);
wb(tQuiero, VW.aereo2, VW.aereo, "humo", () => ({ dof: 0.006 }));
const tGusto = w("y si te gusto", 853.2);
wb(tGusto, VW.fogon, VW.fogon2, "humo");
const tProx = w("y el proximo video", 858.9);
img(tProx, "r_frijoles", "whip", [1.02, 1.1]);
// R42 · 863,1-868,2
// ===== 868,2 → fin · "nos vemos el domingo": la cámara sube y se aleja del rancho al atardecer
wb(R[42].me, VW.mesa, VW.aereo, "humo", (t) => ({ night: 0.45 * e(t, 868, 871) }));

// avatar: un plano por ventana (entra y sale con humareda)
R.forEach((x) => B.push({ a: x.ms, k: "av", tr: "humo" }));
B.sort((p, q) => p.a - q.a);
const BE = B.map((b, i) => (i + 1 < B.length ? B[i + 1].a : TOTAL_END + 1));

// claves de cámara de cada plano del mundo (antes un poco si entra por barrido/portal; justo al cortar si el que sigue también es mundo)
const K2: Key[] = [];
B.forEach((b, i) => {
  if (b.k !== "w" || !b.v) return;
  const prevW = i > 0 && B[i - 1].k === "w", nx = B[i + 1];
  const pre = prevW ? 0 : b.tr === "portal" ? 0.85 : b.tr === "whip" ? 0.3 : 0.05;
  const post = nx && nx.k === "w" ? -0.002 : nx && nx.tr === "whip" ? 0.3 : 0.05;
  K2.push({ t: b.a - pre, ...b.v[0] }, ...(b.mid ?? []).filter((m) => m.t > b.a && m.t < BE[i]).map((m) => ({ t: m.t, ...m.v })), { t: BE[i] + post, ...b.v[1] });
});
setKeys(K2);

// ---------------- mundo / avatar / toma ----------------
const restWorld = (t: number): WorldProps => ({ t, fire: 1, desh: 1, fork: 0, dry: 0, meatSteam: 1, jarOn: JARS.map(() => 1), jarSteam: JARS.map(() => 0.5), vapor: 0.6, dof: 0.0018 });
const World: React.FC<{ t: number; st?: Partial<WorldProps> }> = ({ t, st }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: !NOMB && v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...restWorld(t)} {...st} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const wAct = R.find((x) => t >= x.ms - 0.02 && t < x.me);
  const face = REEL && NOMB ? (wAct ? <Img src={staticFile(P + "avf/f" + Math.round((wAct.off + t - wAct.ms) * 30) + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null) : REEL ? <>{R.map((x, i) => (
    <Sequence key={i} from={s(x.ms) - 10} durationInFrames={s(x.me - x.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= x.ms - 0.02 && t < x.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(x.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};
const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; dur?: number }> = ({ k, t, a, z = [1.03, 1.1], ox = 0, dur = 7 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : IMGS.has(k) ? <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <AbsoluteFill style={{ background: "#2a1a10", color: "#f6e7c8", fontFamily: FONT, fontSize: 60, alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox * e(t, a, a + dur)}px)` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};
const base = (b: Beat, i: number, t: number, key: string) => {
  if (b.k === "av") return <Avatar key={key} t={t} />;
  if (b.k === "img") return <Clip key={key} k={b.img!} t={t} a={b.a} z={b.z} ox={b.ox} dur={Math.max(4, BE[i] - b.a)} />;
  return <World key={key} t={t} st={b.st ? b.st(t, b.a) : undefined} />;
};

// ---------------- composición ----------------
export const Rest: React.FC<{ off?: number }> = ({ off = 0 }) => {
  const t = useCurrentFrame() / 30 + off;
  if (t < MIN1_END) return null;
  const L: React.ReactNode[] = [];
  // plano activo + transición con el siguiente
  let i = 0; while (i < B.length - 1 && B[i + 1].a <= t) i++;
  const cur = B[i], nx = B[i + 1];
  const nT = nx ? nx.a : 1e9;
  if (nx && nx.tr === "whip" && t > nT - 0.25) {
    const sl = ei(t, nT - 0.25, nT + 0.25), mb = Math.sin(sl * Math.PI) * 36;
    L.push(<AbsoluteFill key="wA" style={{ transform: `translateX(${-sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{base(cur, i, t, "b" + i)}</AbsoluteFill>);
    L.push(<AbsoluteFill key="wB" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{base(nx, i + 1, t, "b" + (i + 1))}</AbsoluteFill>);
  } else if (cur.tr === "whip" && i > 0 && t < cur.a + 0.25) {
    const pv = B[i - 1], sl = ei(t, cur.a - 0.25, cur.a + 0.25), mb = Math.sin(sl * Math.PI) * 36;
    L.push(<AbsoluteFill key="wA" style={{ transform: `translateX(${-sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{base(pv, i - 1, t, "b" + (i - 1))}</AbsoluteFill>);
    L.push(<AbsoluteFill key="wB" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{base(cur, i, t, "b" + i)}</AbsoluteFill>);
  } else {
    L.push(base(cur, i, t, "b" + i));
    if (nx && nx.tr === "portal" && t > nT - 0.85) {
      const c = nx.px ? nx.px(t) : { x: 960, y: 540 };
      L.push(<Portal key="pt" x={c.x} y={c.y} r={ei(t, nT - 0.85, nT)}>{base(nx, i + 1, t, "b" + (i + 1))}</Portal>);
    }
  }
  B.forEach((b) => { if (b.tr === "humo" && Math.abs(t - b.a) < 0.6 && b.a > MIN1_END + 0.1) L.push(<Humareda key={"h" + b.a} t={t} mid={b.a} w={0.4} dir={Math.round(b.a) % 2 ? 1 : -1} />); });

  // ---------- piezas, todas clavadas a la voz ----------
  const sc = (q: V) => screenOf(t, q);
  const O: React.ReactNode[] = [];
  // min 2 · presentación
  O.push(<Golpe key="prueba" t={t} at={w("haz la prueba", 127.5)} out={tPres - 0.15} x={960} y={880} words={[{ at: w("haz la prueba", 127.5), w: "TÚ" }, { at: w("haz la prueba", 127.5) + 0.25, w: "HAZ LA PRUEBA", col: CH.maiz }]} size={96} />);
  O.push(<Letrero key="let1" t={t} at={w("me dicen lupe", 131.8)} out={tNaci - 0.2} x={1340} y={170} l1="DON LUPE" l2="71 AÑOS · MICHOACÁN" l2at={w("71 anos", 133.4)} />);
  O.push(<Mapa key="mapa" t={t} at={tNaci} out={R[0].ms - 0.05} x={1200} y={560} lit={w("de michoacan", 135.0)} pin={w("de michoacan", 135.0) + 0.5} label="EL RANCHO" />);
  { const m = sc([CA[0], CA[1] + 0.06, CA[2]]); O.push(<Tag key="come" t={t} at={w("se come todo", 142.5)} x={m.x} y={m.y} dx={-360} dy={-220} text="EL QUE SE COME TODO" col={CH.crema} out={tHago - 0.2} size={50} />); }
  O.push(<Golpe key="hago" t={t} at={w("la hago yo", 146.5)} out={w("eso no se lo dejo", 147.7) + 1.4} x={1380} y={880} words={[{ at: w("la hago yo", 146.5), w: "LA HAGO" }, { at: w("la hago yo", 146.5) + 0.35, w: "YO", col: CH.maiz }]} size={110} />);
  O.push(<Sello key="10a" t={t} at={w("a mis 10 anos", 150.8)} out={R[1].ms - 0.05} x={560} y={300} text="A MIS 10 AÑOS" rot={-7} col={CH.crema} />);
  { const h = sc([PT.hoyo[0], 0.3, PT.hoyo[2]]); O.push(<Tag key="hoyoab" t={t} at={tOlor + 0.7} x={h.x} y={h.y} dx={260} dy={-200} text="EL HOYO" sub="DEL ABUELO, DETRÁS DEL CORRAL" col={CH.maiz} out={R[1].ms - 0.05} size={52} />); }
  O.push(<Tag key="olia" t={t} at={Math.max(R[1].me + 0.1, w("que olia a maguey", 158.0))} x={1250} y={330} dx={140} dy={-120} text="OLÍA A MAGUEY" col={CH.crema} out={tRap - 0.15} size={52} />);
  O.push(<Campanita key="camp1" t={t} at={w("suscribete y dale", 163.8) - 0.6} out={tDigo - 0.15} x={960} y={300} click={w("suscribete y dale", 163.8) + 0.3} bell={w("a la campanita", 164.6)} />);
  O.push(<Lista key="merc" t={t} at={w("puro chile", 173.6) - 0.5} out={tAsi - 0.1} x={1180} y={200} title="DEL MERCADO, NADA MÁS" rows={[{ at: w("puro chile", 173.6), text: "puro chile" }, { at: w("pura sal", 174.4), text: "pura sal" }, { at: w("mucha paciencia", 175.4), text: "mucha paciencia" }]} />);
  O.push(<Golpe key="fogon" t={t} at={w("vamos al fogon", 179.4)} out={R[2].ms - 0.05} x={960} y={880} words={[{ at: w("vamos al fogon", 179.4), w: "VAMOS" }, { at: w("vamos al fogon", 179.4) + 0.3, w: "AL FOGÓN", col: CH.maiz }]} size={110} />);
  // min 3 · Don Teodoro · la boda · el niño de la lumbre
  O.push(<Letrero key="let2" t={t} at={w("mi abuelo se llamaba", 183.9) + 0.4} out={R[2].me - 0.2} x={1420} y={170} l1="DON TEODORO" l2="EL ABUELO · DON TEYO" l2at={w("le decian", 185.6)} />);
  O.push(<Sello key="s1" t={t} at={w("bautizos", 191.5)} out={tCaso - 0.15} x={480} y={250} text="BAUTIZOS" rot={-9} />);
  O.push(<Sello key="s2" t={t} at={w("bodas", 192.3)} out={tCaso - 0.15} x={1440} y={300} text="BODAS" rot={7} />);
  O.push(<Sello key="s3" t={t} at={w("el santo del pueblo", 192.9)} out={tCaso - 0.15} x={960} y={860} text="EL SANTO DEL PUEBLO" rot={-4} />);
  O.push(<BigNum key="200" t={t} at={w("para 200 gentes", 197.0)} text="200" size={260} x={640} y={470} col={CH.maiz} edge="#5a2a10" out={w("desde el viernes", 199.8) - 0.2} sub="GENTES · 2 HOYOS" />);
  O.push(<Calendario key="cal" t={t} at={w("desde el viernes", 199.8) - 0.3} out={w("a mi me tocaba", 203.5) - 0.1} x={1430} y={330} days={[{ at: w("desde el viernes", 199.8), d: "VIE", n: "empieza" }, { at: w("desde el viernes", 199.8) + 0.6, d: "SÁB", n: "la noche" }, { at: w("de domingo", 202.6), d: "DOM", n: "¡la boda!" }]} hi={2} />);
  O.push(<Tag key="mezq" t={t} at={w("lena de mezquite", 210.2)} x={1240} y={760} dx={150} dy={-120} text="LEÑA DE MEZQUITE" col={CH.maiz} out={tPied - 0.15} size={50} />);
  { const h = sc([PT.hoyo[0], -0.6, PT.hoyo[2]]); O.push(<Tag key="rojo" t={t} at={w("se ponian rojas", 212.6)} x={h.x} y={h.y} dx={-320} dy={-260} text="PIEDRAS AL ROJO" col="#ff8a4a" out={w("se me iba el sueno", 213.9) + 1.2} size={56} />); }
  O.push(<Dicho key="dicho1" t={t} at={w("no te duermas lupito", 217.0) - 0.3} out={R[4].me - 0.15} x={1400} y={360} w={760} text="No te duermas, Lupito: la lumbre floja da barbacoa dura." firma="Don Teodoro" dur={2.4} />);
  O.push(<Pregunta key="plaza" t={t} at={w("y la del senor de la plaza", 224.5)} out={tCont - 0.15} x={560} y={430} text="¿y la de la plaza no?" />);
  O.push(<Golpe key="miedo" t={t} at={w("le tiene miedo al tiempo", 228.0)} out={R[5].ms - 0.05} x={960} y={540} words={[{ at: w("miedo al tiempo", 228.6), w: "MIEDO" }, { at: w("al tiempo", 229.0), w: "AL TIEMPO", col: CH.maiz }]} size={140} />);
  O.push(<Sello key="bruj" t={t} at={w("cosa de brujeria", 233.0)} out={R[5].me - 0.15} x={1460} y={300} text="¿BRUJERÍA?" rot={8} col={CH.crema} />);
  // min 4 · SECRETO 1
  { const a0 = R[5].me, j = sc([JARS[0][0], TY + 0.17, JARS[0][2]]); O.push(<Ficha key="fj1" t={t} at={a0 + 0.3} out={TT.sec[0] + 0.3} i={0} x={j.x} y={j.y} sc={0.8} />); }
  O.push(<PlacaSecreto key="p1" t={t} at={TT.sec[0] + 0.15} out={tMitad - 0.9} x={960} y={330} n={1} name="LA CARNE" sub="con hueso · con grasa · en pedazos grandes" subAt={w("con hueso con grasa", 242.6)} />);
  O.push(<Tag key="mitad" t={t} at={w("la mitad de las barbacoas", 246.5)} x={1200} y={560} dx={160} dy={-160} text="AQUÍ EMPIEZA" sub="LA MITAD DE LAS DURAS" col={CH.maiz} out={R[6].ms - 0.05} size={52} />);
  O.push(<Burbuja key="cub" t={t} at={w("en cubitos", 254.0) - 0.4} out={R[6].me - 0.2} x={1500} y={330} r={240}><Clip k="r_cubitos" t={t} a={w("en cubitos", 254.0) - 0.4} z={[1.0, 1.08]} /></Burbuja>);
  { const m = sc([CA[0], CA[1] + 0.08, CA[2]]); O.push(<Tag key="seca" t={t} at={w("se te va a secar", 257.5)} x={m.x} y={m.y} dx={-380} dy={-160} text="SE SECA" sub="LA CARNE LIMPIA" col="#ff6a4a" out={tBorr - 0.15} size={60} />); }
  O.push(<Cortes key="borr" t={t} at={tBorr + 0.2} out={tRes - 0.15} x={960} y={520} kind="borrego" zones={[
    { at: w("la pierna", 260.5), label: "PIERNA", d: "M 140 120 Q 160 80 230 78 L 280 80 L 285 195 L 200 200 Q 140 190 140 120 Z", lx: 215, ly: 150 },
    { at: w("la espaldilla", 261.2), label: "ESPALDILLA", d: "M 500 72 Q 560 70 600 100 L 600 190 L 505 198 Z", lx: 552, ly: 240 },
    { at: w("y el costillar", 262.0), label: "COSTILLAR", d: "M 300 75 L 480 70 L 485 198 L 300 205 Z", lx: 392, ly: 145 }]} />);
  O.push(<Sello key="hueso" t={t} at={w("todo con su hueso", 262.9)} out={tRes - 0.15} x={960} y={880} text="TODO CON SU HUESO" rot={-3} col={CH.maiz} />);
  O.push(<Lista key="res" t={t} at={w("pide cachete", 267.3) - 0.4} out={R[7].me - 0.1} x={1200} y={180} title="SI ES DE RES" rows={[{ at: w("pide cachete", 267.3) + 0.2, text: "cachete" }, { at: w("pecho y chambarete", 268.3), text: "pecho" }, { at: w("chambarete con hueso", 268.8), text: "chambarete con hueso" }]} />);
  O.push(<Tag key="nerv" t={t} at={w("nervio y colageno", 272.6)} x={760} y={420} dx={-260} dy={-160} text="NERVIO + COLÁGENO" sub="LAS CARNES QUE TRABAJAN" col={CH.maiz} out={w("crudas son duras", 274.3) + 0.6} size={54} />);
  O.push(<Gelatina key="gel" t={t} at={w("crudas son duras", 274.3)} out={tDesh - 0.15} x={1250} y={560} soft={w("con horas de vapor", 276.3)} dur={3.2} />);
  { const m = sc([CA[0] - 0.05, CA[1] + 0.06, CA[2]]); O.push(<Tag key="boca" t={t} at={w("se deshaga en la boca", 281.7)} x={m.x} y={m.y} dx={-330} dy={-200} text="SE DESHACE" sub="EN LA BOCA" col={CH.maiz} out={R[8].ms - 0.05} size={58} />); }
  // min 5 · grasa, plato, pedazos, cubito
  O.push(<Cobija key="cob" t={t} at={R[8].me + 0.2} out={tSobra - 0.15} x={1400} y={560} melt={w("la grasa se derrite", 288.0)} />);
  O.push(<Sello key="plato" t={t} at={w("en el plato", 295.6)} out={tPed - 0.15} x={620} y={330} text="EN EL PLATO ✓" rot={-6} col={CH.nopal} />);
  O.push(<Sello key="tabla" t={t} at={w("no en la tabla", 296.4)} out={tPed - 0.15} x={1300} y={720} text="NO EN LA TABLA" rot={5} col={CH.guinda} />);
  O.push(<BigNum key="kilo" t={t} at={w("de un kilo", 298.9)} text="1 – 1½ KG" size={150} x={960} y={860} col={CH.maiz} edge="#5a2a10" out={R[9].ms - 0.05} sub="POR PEDAZO" />);
  O.push(<CuboCorte key="cubo" t={t} at={w("un cubito chiquito", 301.6)} out={tCarn - 0.15} x={1400} y={600} big={w("el pedazo grande", 306.0)} />);
  O.push(<Ticket key="tick" t={t} at={w("el borrego con hueso", 312.3) - 0.3} out={tErr - 0.15} x={1150} y={120} title="CARNICERÍA DEL PUEBLO" rows={[
    { at: w("unos 230 pesos", 314.0), l: "BORREGO C/HUESO", r: "$230/kg" }, { at: w("en unos 180", 317.6), l: "RES (CACHETE)", r: "$180/kg" }, { at: w("compras 3 kilos", 321.6), l: "3 KILOS · 10 PERS.", r: "" }]} total={{ at: w("entre 540", 323.4), l: "TOTAL", r: "$540–700" }} />);
  O.push(<Congelada key="cong" t={t} at={w("comprarla congelada", 328.0)} out={R[11].me - 0.15} x={1460} y={500} fix={w("ya descongelada", 332.3)} />);
  // min 6 · SECRETO 2
  { const j = sc([JARS[1][0], TY + 0.17, JARS[1][2]]); O.push(<Ficha key="fj2" t={t} at={R[11].me + 0.2} out={TT.sec[1] + 1.0} i={1} x={j.x} y={j.y} sc={0.8} />); }
  O.push(<PlacaSecreto key="p2" t={t} at={TT.sec[1] + 0.2} out={w("aqui es donde se van", 339.7) - 0.1} x={960} y={330} n={2} name="LA SAL" sub="va la noche antes" subAt={w("la sal va la noche antes", 338.1) + 0.4} />);
  O.push(<Salero key="sal2" t={t} at={w("aqui es donde se van", 339.7)} angry={w("se van a enojar", 340.6)} out={w("toda la vida", 341.7) - 0.1} x={1520} y={470} />);
  O.push(<Golpe key="endu" t={t} at={w("la sal endurece", 343.5)} out={tPos - 0.2} x={960} y={420} words={[{ at: w("la sal endurece", 343.5), w: "¿LA SAL" }, { at: w("endurece la carne", 344.0), w: "ENDURECE?", col: "#ff6a4a" }]} size={110} />);
  O.push(<Sello key="mito" t={t} at={tPos - 0.25} out={tPos + 0.05} x={960} y={600} text="MITO" rot={-10} size={110} />);
  { const m = sc([CA[0], CA[1] + 0.1, CA[2]]); O.push(<Tag key="sab" t={t} at={w("el sabado en la noche", 347.0)} x={m.x} y={m.y} dx={-360} dy={-220} text="SÁBADO EN LA NOCHE" col={CH.maiz} out={R[12].ms - 0.05} size={54} />); }
  O.push(<SalJugo key="sj1" t={t} at={R[12].me + 0.1} out={R[13].ms - 0.05} x={960} y={560} a1={w("si le pones la sal", 352.4)} a2={w("si la salas y la dejas", 359.1)} a3={1e9} />);
  O.push(<Tag key="reseca" t={t} at={w("ahi si se reseca", 358.0)} x={1300} y={300} dx={140} dy={-90} text="AHÍ SÍ SE RESECA" col="#ff6a4a" out={w("si la salas y la dejas", 359.1) - 0.1} size={48} />);
  O.push(<Tag key="adentro" t={t} at={w("para adentro", 365.5)} x={1300} y={600} dx={140} dy={-120} text="PARA ADENTRO" sub="YA CON LA SAL" col={CH.maiz} out={R[13].me - 0.1} size={54} />);
  O.push(<SalJugo key="sj2" t={t} at={R[13].me + 0.05} out={tMed - 0.15} x={960} y={560} a1={R[13].me - 9} a2={R[13].me - 6} a3={R[13].me + 0.1} />);
  O.push(<Cucharas key="cuch" t={t} at={w("una cucharada de sal", 375.0) - 0.3} out={R[14].ms - 0.05} x={960} y={500} hits={[w("una cucharada de sal", 375.0), w("tres cucharadas", 379.3), w("tres cucharadas", 379.3) + 0.3]} label="1 CUCHARADA DE SAL DE GRANO × KILO" labAt={w("por kilo de carne", 376.8)} />);
  // min 7 · 12 horas · SECRETO 3
  O.push(<Reloj key="r12" t={t} at={R[14].me + 0.1} out={TT.sec[2] - 0.15} x={1460} y={500} h0={20} h1={8} run={w("doce horas minimo", 386.4)} dur={2.4} label="12 HORAS MÍNIMO" labAt={w("doce horas minimo", 386.4)} />);
  O.push(<Tag key="oscura" t={t} at={w("mas oscura", 389.4)} x={700} y={560} dx={-250} dy={-200} text="MÁS OSCURA" sub="ASÍ TIENE QUE ESTAR" col={CH.maiz} out={TT.sec[2] - 0.15} size={54} />);
  { const j = sc([JARS[2][0], TY + 0.17, JARS[2][2]]); O.push(<Ficha key="fj3" t={t} at={TT.sec[2] + 0.2} out={TT.sec[2] + 1.6} i={2} x={j.x} y={j.y} sc={0.8} />); }
  O.push(<PlacaSecreto key="p3" t={t} at={TT.sec[2] + 0.5} out={R[15].ms - 0.05} x={960} y={330} n={3} name="EL ADOBO" sub="se unta, no se ahoga" subAt={w("y se unta", 396.9)} />);
  O.push(<Sello key="guis" t={t} at={w("eso es un guisado", 405.7)} out={tPara3 - 0.15} x={1320} y={380} text="ES GUISADO" rot={-10} size={90} />);
  O.push(<Chiles key="chil" t={t} at={w("8 chiles guajillo", 408.3) - 0.3} out={tComal - 0.15} x={160} y={250} gAt={w("8 chiles guajillo", 408.3)} aAt={w("3 chiles anchos", 409.6)} />);
  O.push(<Tag key="rabito" t={t} at={w("les quitas el rabito", 411.0)} x={1300} y={860} dx={120} dy={-100} text="SIN RABITO NI SEMILLAS" col={CH.crema} out={tComal - 0.15} size={46} />);
  O.push(<Comal key="comal" t={t} at={tComal + 0.3} out={R[16].ms - 0.05} x={1460} y={460} run={w("de 10 a 20 segundos", 415.0)} />);
  O.push(<Tag key="humo" t={t} at={w("si huelen a humo", 421.0)} x={1300} y={380} dx={120} dy={-100} text="¿HUELE A HUMO?" sub="SE QUEMÓ: SE TIRA" col="#ff6a4a" out={R[16].me - 0.1} size={52} />);
  if (t < tRem) O.push(<DrawX key="xq" t={t} at={w("un solo chile quemado", 424.3)} x={560} y={260} w={800} h={560} />);
  O.push(<Golpe key="amarga" t={t} at={w("amarga todo el adobo", 425.4)} out={tRem - 0.15} x={960} y={900} words={[{ at: w("amarga todo el adobo", 425.4), w: "AMARGA TODO", col: "#ff6a4a" }]} size={100} />);
  // min 8 · el adobo en la licuadora
  O.push(<Receta key="rec1" t={t} at={tRem + 0.2} out={w("tiene que quedar espeso", 444.2) - 0.15} x={1180} y={40} title="EL ADOBO · 3 KG DE CARNE" rows={[
    { at: w("los remojas 20 minutos", 426.7) + 0.5, q: "20 min", i: "en agua caliente" }, { at: w("5 dientes de ajo", 429.6), q: "5", i: "dientes de ajo" }, { at: w("un cuarto de cebolla", 431.0), q: "¼", i: "de cebolla" },
    { at: w("3 clavos", 432.8), q: "3", i: "clavos" }, { at: w("pimientas gordas", 434.4) - 0.3, q: "4", i: "pimientas gordas" }, { at: w("una cucharadita de comino", 435.5), q: "1 cdta", i: "comino" },
    { at: w("una de oregano", 437.0), q: "1 cdta", i: "orégano" }, { at: w("un chorrito de vinagre", 438.1), q: "2 cdas", i: "vinagre" }]} />);
  O.push(<Medidor key="med" t={t} at={w("tiene que quedar espeso", 444.2) - 0.1} out={tUnt - 0.15} x={960} y={520} run={w("como pasta", 445.8)} l="AGUADO" r="PASTA" lab="que se pegue a la carne" />);
  O.push(<Tag key="enc" t={t} at={w("encima de la sal", 449.0)} x={1250} y={300} dx={140} dy={-90} text="ENCIMA DE LA SAL" sub="CON LA MANO, APRETANDO" col={CH.maiz} out={R[18].ms - 0.05} size={50} />);
  O.push(<Tag key="vin" t={t} at={w("el vinagre ayuda", 454.0)} x={1380} y={330} dx={120} dy={-90} text="EL VINAGRE" sub="ABLANDA Y CORTA LO GRASOSO" col={CH.crema} out={R[18].me - 0.1} size={52} />);
  { const m = sc([CA[0], CA[1] + 0.08, CA[2]]); O.push(<Tag key="peg" t={t} at={w("se queda pegado", 460.9)} x={m.x} y={m.y} dx={-360} dy={-200} text="SE QUEDA PEGADO" sub="EL VAPOR NO LO LAVA" col={CH.maiz} out={TT.sec[3] - 0.15} size={54} />); }
  // min 9 · SECRETO 4 · la penca
  { const j = sc([JARS[3][0], TY + 0.17, JARS[3][2]]); O.push(<Ficha key="fj4" t={t} at={TT.sec[3] + 0.2} out={TT.sec[3] + 1.8} i={3} x={j.x} y={j.y} sc={0.8} />); }
  O.push(<PlacaSecreto key="p4" t={t} at={TT.sec[3] + 0.3} out={w("la penca es la hoja", 469.1) - 0.15} x={960} y={330} n={4} name="LA PENCA" sub="de maguey" subAt={w("la penca de maguey", 465.7) + 0.4} />);
  O.push(<Maguey2D key="mag" t={t} at={w("la penca es la hoja", 469.1)} out={R[19].ms - 0.05} x={1300} y={620} pick={w("la hoja grandota", 469.8)} esp={w("la carnosa", 471.0)} />);
  O.push(<Tag key="lumb" t={t} at={w("directo a la", 477.8)} x={1200} y={760} dx={160} dy={-120} text="DIRECTO A LA LUMBRE" col={CH.maiz} out={tAqui - 0.15} size={50} />);
  O.push(<CrudaAsada key="ca" t={t} at={w("la penca cruda no sirve", 481.0)} out={w("la pones encima", 484.1) + 0.6} x={960} y={360} a2={w("la tienes que asar", 482.5)} />);
  { const pf = sc([3.15, 0.5, 1.1]); O.push(<Tag key="color" t={t} at={w("cambia de color", 486.8)} x={pf.x} y={pf.y} dx={-320} dy={-240} text="HASTA QUE CAMBIA" sub="DE COLOR" col={CH.maiz} out={R[20].ms - 0.05} size={54} />); }
  O.push(<Muestrario key="mue" t={t} at={w("verde mas oscuro", 488.8) - 0.3} out={w("en ese momento", 493.2) + 1.0} x={1430} y={300} run={w("verde mas oscuro", 488.8)} dur={3.5} />);
  O.push(<Tag key="dulce" t={t} at={w("olor dulce", 498.5)} x={1250} y={330} dx={140} dy={-120} text="OLOR DULCE" sub="COMO A CAMPO" col={CH.crema} out={R[21].ms - 0.05} size={54} />);
  O.push(<Iconos key="tres" t={t} at={w("envuelve la carne", 502.2) - 0.2} out={w("por eso la carne se cuece", 510.3) - 0.2} x={1330} y={800} items={[{ at: w("envuelve la carne", 502.2), ic: IC.envuelve, text: "ENVUELVE" }, { at: w("le da su sabor", 505.4), ic: IC.sabor, text: "DA SABOR" }, { at: w("guarda el", 506.9), ic: IC.calor, text: "GUARDA EL CALOR" }]} />);
  O.push(<Tag key="pareja" t={t} at={w("se cuece pareja", 511.5)} x={1200} y={330} dx={160} dy={-120} text="PAREJA" sub="SIN UNA ORILLA SECA" col={CH.maiz} out={tCiud - 0.15} size={56} />);
  O.push(<Golpe key="sinp" t={t} at={w("no consigues penca", 516.4)} out={R[22].ms - 0.05} x={960} y={500} words={[{ at: w("no consigues penca", 516.4), w: "¿SIN PENCA?" }, { at: w("no te apures", 517.6), w: "NO TE APURES", col: CH.maiz }]} size={110} />);
  O.push(<Tag key="seg" t={t} at={w("unos segundos", 525.5)} x={1150} y={330} dx={160} dy={-120} text="UNOS SEGUNDOS" sub="HASTA QUE BRILLA" col={CH.maiz} out={tAgu - 0.75} size={54} />);
  O.push(<BigNum key="agua" t={t} at={tAgu - 0.3} text="5–6 HOJAS" size={150} x={960} y={420} col="#9ab86a" edge="#2a3a14" out={R[23].ms - 0.05} sub="DE AGUACATE SECAS · OLOR ANISADO" />);
  O.push(<Etiquetas key="etq" t={t} at={w("unos 30 pesos", 536.5) - 0.3} out={TT.sec[4] - 0.2} x={1160} y={300} tags={[{ at: w("unos 30 pesos", 536.5), t1: "PENCA", t2: "$30" }, { at: w("40 el paquete", 538.6), t1: "HOJA DE PLÁTANO", t2: "$40" }]} />);
  // min 10 · SECRETO 5 · vaporera y hoyo
  { const j = sc([JARS[4][0], TY + 0.17, JARS[4][2]]); O.push(<Ficha key="fj5" t={t} at={TT.sec[4] + 0.2} out={TT.sec[4] + 1.8} i={4} x={j.x} y={j.y} sc={0.8} />); }
  O.push(<PlacaSecreto key="p5" t={t} at={TT.sec[4] + 0.3} out={tImp - 0.9} x={960} y={330} n={5} name="EL HOYO" sub="o la vaporera" subAt={w("o la vaporera", 542.6)} />);
  O.push(<VaporCorte key="vc" t={t} at={tImp + 0.1} out={R[24].me - 0.1} x={1420} y={540} nunca={w("nunca toca la carne", 545.5)} />);
  O.push(<HoyoCorte key="hc1" t={t} at={w("el hoyo de mi abuelo media", 558.5) - 0.1} out={R[25].ms - 0.05} x={1350} y={560} med={w("como un metro", 559.6)} piedras={w("piedras de rio", 563.6)} />);
  { const h = sc([PT.hoyo[0], -0.3, PT.hoyo[2]]); O.push(<Tag key="brasa" t={t} at={w("hecha brasa", 572.0)} x={h.x} y={h.y} dx={-330} dy={-240} text="HECHA BRASA" sub="2 O 3 HORAS DE LEÑA" col="#ff8a4a" out={tBaj - 0.15} size={56} />); }
  O.push(<HoyoCorte key="hc2" t={t} at={tBaj + 0.1} out={R[26].ms - 0.05} x={960} y={560} med={-1} piedras={-1} capas={[
    { at: w("ahi bajaba la olla", 573.0) + 0.6, l: "LA OLLA", c: "#6a3a22" }, { at: w("encima la parrilla", 574.6), l: "PARRILLA", c: "#3a3836" }, { at: w("las pencas", 575.8), l: "PENCAS", c: "#4a5a26" },
    { at: w("la carne", 576.6), l: "LA CARNE", c: "#9a2a14" }, { at: w("mas pencas", 577.3), l: "MÁS PENCAS", c: "#4a5a26" }, { at: w("y lo tapaba", 578.2), l: "LÁMINA", c: "#8a8a8a" }]} />);
  O.push(<Tag key="dedos" t={t} at={w("unos cuatro dedos", 584.8)} x={1150} y={360} dx={160} dy={-120} text="4 DEDOS" sub="ABAJO DE LA PARRILLA" col={CH.maiz} out={tCama - 0.15} size={58} />);
  O.push(<Lista key="capas" t={t} at={tCama + 0.2} out={tTruco - 0.1} x={1200} y={180} title="EN CAPAS" rows={[{ at: w("una cama de hojas", 588.5), text: "cama de hojas" }, { at: w("la carne con su adobo", 589.8), text: "carne con su adobo" }, { at: w("la grasa para arriba", 591.4), text: "la grasa pa' arriba" }, { at: w("otra capa de hojas", 592.8), text: "otra capa de hojas" }]} />);
  O.push(<Tag key="tamal" t={t} at={w("de los tamales", 597.5)} x={1150} y={330} dx={160} dy={-120} text="EL TRUCO" sub="DE LOS TAMALES" col={CH.maiz} out={R[27].ms - 0.05} size={56} />);
  O.push(<Moneda key="mon" t={t} at={w("echa una moneda", 598.8)} out={TT.sec[5] - 0.2} x={1440} y={520} calla={w("si deja de sonar", 603.5)} />);
  // min 11 · SECRETO 6 · la olla escondida
  { const j = sc([JARS[5][0], TY + 0.17, JARS[5][2]]); O.push(<Ficha key="fj6" t={t} at={TT.sec[5] + 0.2} out={TT.sec[5] + 1.6} i={5} x={j.x} y={j.y} sc={0.8} />); }
  O.push(<PlacaSecreto key="p6" t={t} at={TT.sec[5] + 0.3} out={tAbajo - 0.9} x={960} y={330} n={6} name="LA OLLA ESCONDIDA" />);
  O.push(<Tag key="barro" t={t} at={w("una olla de barro", 614.0)} x={1150} y={380} dx={160} dy={-120} text="OLLA DE BARRO" sub="ABAJO DE LA CARNE" col={CH.maiz} out={R[28].ms - 0.05} size={56} />);
  O.push(<Goteo key="got" t={t} at={w("todo lo que la carne suda", 617.4)} out={tOro - 0.15} x={1450} y={540} names={[{ at: w("el jugo", 619.5), l: "jugo", c: "#c0281a" }, { at: w("la grasa", 620.2), l: "grasa", c: "#ffe9a8" }, { at: w("el adobo", 620.9), l: "adobo", c: "#8a1a14" }]} />);
  O.push(<Golpe key="oro" t={t} at={w("es oro", 625.0)} out={tParaQ - 0.15} x={960} y={880} words={[{ at: w("es oro", 625.0), w: "ES ORO:", col: CH.maiz }, { at: w("es el consome", 625.4), w: "EL CONSOMÉ" }]} size={100} />);
  O.push(<Receta key="rec2" t={t} at={tParaQ + 0.3} out={w("en la vaporera es igual", 646.9) - 0.15} x={1180} y={30} title="LA OLLA DEL CONSOMÉ" rows={[
    { at: w("dos litros y medio", 630.2), q: "2½ L", i: "de agua" }, { at: w("de garbanzo", 632.4), q: "½ taza", i: "garbanzo remojado" }, { at: w("de arroz", 634.5), q: "½ taza", i: "de arroz" },
    { at: w("dos zanahorias", 635.4), q: "2", i: "zanahorias" }, { at: w("una papa", 638.8), q: "1", i: "papa" }, { at: w("media cebolla", 639.5), q: "½", i: "cebolla" },
    { at: w("dos ajos", 640.4), q: "2", i: "ajos" }, { at: w("dos chiles guajillo", 641.2), q: "2", i: "chiles guajillo" }, { at: w("de epazote", 643.2), q: "1", i: "ramita de epazote" }]} />);
  O.push(<Lista key="servir" t={t} at={w("con cebolla cilantro", 654.4) - 0.3} out={tDecia - 0.15} x={1200} y={200} title="PA' SERVIRLO, HIRVIENDO" rows={[{ at: w("con cebolla cilantro", 654.4), text: "cebolla" }, { at: w("cilantro limon", 655.0), text: "cilantro" }, { at: w("limon y un chile", 655.6), text: "limón" }, { at: w("chile de arbol", 656.6), text: "chile de árbol" }]} />);
  O.push(<Orden key="ord" t={t} at={w("es lo primero que se toma", 660.3)} out={R[31].ms - 0.05} x={1350} y={960} a2={w("antes del primer taco", 661.9)} />);
  O.push(<Sobre key="sob" t={t} at={w("sabe a sobre", 667.8)} out={R[31].me - 0.1} x={1520} y={420} />);
  { const h = sc([PT.olla[0], PT.olla[1] + 0.25, PT.olla[2]]); O.push(<Tag key="nada" t={t} at={w("no hubo carne", 669.7)} x={h.x} y={h.y} dx={-380} dy={-200} text="NADA SUDÓ ENCIMA" sub="TODA LA NOCHE" col="#ff6a4a" out={TT.sec[6] - 0.15} size={54} />); }
  // min 12 · SECRETO 7 · el reloj
  { const j = sc([JARS[6][0], TY + 0.17, JARS[6][2]]); O.push(<Ficha key="fj7" t={t} at={TT.sec[6] + 0.2} out={TT.sec[6] + 1.6} i={6} x={j.x} y={j.y} sc={0.8} />); }
  O.push(<PlacaSecreto key="p7" t={t} at={TT.sec[6] + 0.3} out={w("no se puede apurar", 680.0) - 0.15} x={960} y={330} n={7} name="EL RELOJ" sub="el que nadie quiere oír" subAt={w("nadie quiere oir", 676.0)} />);
  O.push(<Golpe key="apur" t={t} at={w("no se puede apurar", 680.0)} out={R[32].ms - 0.05} x={960} y={540} words={[{ at: w("no se puede apurar", 680.0), w: "NO SE" }, { at: w("no se puede apurar", 680.0) + 0.3, w: "PUEDE" }, { at: w("no se puede apurar", 680.0) + 0.6, w: "APURAR", col: CH.maiz }]} size={130} />);
  O.push(<Reloj key="r22" t={t} at={w("el sabado a las 10", 683.0) - 0.3} out={w("el hoyo se tapa", 688.7) - 0.15} x={1460} y={480} h0={22} h1={6} run={w("lo abria el domingo", 684.0)} dur={2.4} label="SÁBADO → DOMINGO" />);
  O.push(<BigNum key="8h" t={t} at={w("ocho horas", 686.8)} text="8 HORAS" size={150} x={640} y={860} col={CH.maiz} edge="#5a2a10" out={tTapa - 0.15} sub="SIN ASOMARSE" />);
  O.push(<Lista key="tapa" t={t} at={tTapa + 0.2} out={tSello - 0.15} x={1220} y={200} title="ASÍ SE TAPA EL HOYO" rows={[{ at: w("con una lamina", 690.0), text: "una lámina" }, { at: w("un costal mojado", 691.2), text: "un costal mojado" }, { at: w("encima tierra", 692.4), text: "y tierra encima" }]} />);
  O.push(<Tag key="masa" t={t} at={w("cordon de masa", 697.4)} x={1150} y={330} dx={160} dy={-120} text="CORDÓN DE MASA" sub="O ALUMINIO + TRAPO HÚMEDO" col={CH.maiz} out={R[33].ms - 0.05} size={54} />);
  { const v = sc([PT.vaporera[0], PT.vaporera[1] + 0.15, PT.vaporera[2]]); O.push(<Tag key="esc" t={t} at={w("se te esta escapando", 704.5)} x={v.x} y={v.y} dx={-380} dy={-200} text="SE TE ESCAPA" sub="LA BARBACOA" col="#ff6a4a" out={tVap3 - 0.15} size={58} />); }
  O.push(<Barras key="bar" t={t} at={tVap3 + 0.2} out={R[34].ms - 0.05} x={260} y={330} max={5} rows={[{ at: w("borrego unas 4", 711.8), l: "BORREGO", v: 4, txt: "4 H" }, { at: w("res unas 5", 713.4), l: "RES", v: 5, txt: "5 H" }]} />);
  O.push(<Sello key="bajo" t={t} at={w("a fuego bajo", 710.5)} out={R[34].ms - 0.05} x={1500} y={240} text="FUEGO BAJO" rot={6} col={CH.maiz} />);
  O.push(<Destapa key="dest" t={t} at={w("y no la destapes", 714.8) + 0.3} out={tComo - 0.15} x={1440} y={460} hits={[w("un cuarto de hora", 721.0), w("a cada rato", 724.0)]} />);
  O.push(<Iconos key="senal" t={t} at={w("por tres cosas", 728.5) - 0.1} out={w("y cuando apagas", 739.0) - 0.15} x={960} y={820} items={[{ at: w("el hueso sale limpio", 729.7), ic: IC.hueso, text: "EL HUESO SALE LIMPIO" }, { at: w("se deshebra con el tenedor", 733.0), ic: IC.tenedor, text: "SE DESHEBRA SOLA" }, { at: w("como vidrio", 737.5), ic: IC.vidrio, text: "GRASA COMO VIDRIO" }]} />);
  O.push(<BigNum key="20m" t={t} at={w("20 minutos mas", 741.2)} text="20 MIN" size={160} x={1350} y={420} col={CH.maiz} edge="#5a2a10" out={R[36].ms - 0.05} sub="TAPADA, EN REPOSO" />);
  // min 13 · si te sale mal · la cuenta
  O.push(<Arreglo key="ar1" t={t} at={w("sigue dura", 751.6)} out={tNoF - 0.15} x={1430} y={430} mal="SIGUE DURA" bien="no le subas: tápala y 1 hora más" fixAt={w("dale una hora mas", 757.5)} />);
  O.push(<Gis key="gnf" t={t} at={tNoF + 0.05} out={tSeca - 0.15} a={[-2.4, 1.55, -2.59]} b={[-0.9, 1.55, -2.59]} text="NO FUISTE TÚ" size={1.05} />);
  O.push(<Arreglo key="ar2" t={t} at={tSeca + 0.2} out={R[37].ms - 0.05} x={1350} y={360} mal="SALIÓ SECA" bien="se secó el agua o no tenía grasa" fixAt={w("se te seco el agua", 761.5)} rot={2} />);
  O.push(<Arreglo key="ar3" t={t} at={w("salio palido", 765.5)} out={R[37].me - 0.1} x={1430} y={430} mal="CONSOMÉ PÁLIDO" bien="faltó adobo o sobró agua" fixAt={w("falto adobo", 767.3)} />);
  O.push(<Arreglo key="ar4" t={t} at={w("si salio salada", 769.5)} out={tCuen - 0.15} x={1350} y={430} mal="SALIÓ SALADA" bien="agua y garbanzo al consomé" fixAt={w("le echas agua", 771.6)} rot={-3} />);
  O.push(<Golpe key="arit" t={t} at={w("hay villanos", 776.0)} out={R[38].ms - 0.05} x={960} y={540} words={[{ at: w("no hay villanos", 775.9), w: "NO HAY VILLANOS:" }, { at: w("hay aritmetica", 777.3), w: "HAY ARITMÉTICA", col: CH.maiz }]} size={96} />);
  O.push(<Tag key="t500" t={t} at={w("en 500 pesos", 781.0)} x={1350} y={420} dx={120} dy={-100} text="$500 EL KILO" sub="Y EL CONSOMÉ APARTE" col="#ff8a6a" out={R[38].me - 0.1} size={58} />);
  O.push(<Cuenta key="c1" t={t} at={w("kilo y medio", 786.6) - 0.2} out={R[39].ms - 0.05} x={960} y={520} izq={{ at: w("750 pesos", 787.6), l: "TAQUERÍA · 1½ KG", v: 750 }} der={{ at: w("te cuestan unos 600", 794.0), l: "TU CASA · 3 KG", v: 600 }} />);
  O.push(<Tag key="t720" t={t} at={w("720 pesos", 798.0)} x={1350} y={420} dx={120} dy={-100} text="$600 + $120 = $720" sub="CHILES, HOJAS Y EL CONSOMÉ" col={CH.maiz} out={R[39].me - 0.1} size={54} />);
  O.push(<Cuenta key="c2" t={t} at={R[39].me + 0.05} out={tSob - 0.15} x={820} y={500} izq={{ at: R[39].me - 2, l: "TAQUERÍA", v: 750 }} der={{ at: R[39].me - 2, l: "TU CASA", v: 720 }} />);
  O.push(<Garrafa key="gar" t={t} at={R[39].me + 0.3} out={tSob - 0.15} x={1660} y={560} run={w("5 litros de consome", 802.0)} />);
  O.push(<Tag key="tapad" t={t} at={w("bien tapadita", 809.5)} x={1150} y={360} dx={160} dy={-120} text="CON SU CONSOMÉ" sub="BIEN TAPADITA" col={CH.maiz} out={tDom - 0.15} size={54} />);
  O.push(<Semana key="sem" t={t} at={tDom - 0.1} out={tUna - 0.15} x={960} y={830} days={[{ at: tDom, d: "DOMINGO", p: "tacos" }, { at: w("el lunes consome", 813.0), d: "LUNES", p: "consomé con arroz" }, { at: w("el martes tostadas", 815.0), d: "MARTES", p: "tostadas" }, { at: w("y el miercoles", 815.9), d: "MIÉRCOLES", p: "quesadillas" }]} />);
  O.push(<Golpe key="med2" t={t} at={w("media semana", 821.3)} out={tMet - 0.15} x={960} y={900} words={[{ at: w("media semana", 821.3), w: "MEDIA SEMANA", col: CH.maiz }, { at: w("media semana", 821.3) + 0.35, w: "DE COMER" }]} size={96} />);
  { const m = sc([CA[0], CA[1] + 0.08, CA[2]]); O.push(<Tag key="rica" t={t} at={tMet + 0.3} x={m.x} y={m.y} dx={-380} dy={-200} text="CADA DÍA MÁS RICA" sub="EL ADOBO SE VA METIENDO" col={CH.maiz} out={R[40].ms - 0.05} size={54} />); }
  // min 14 · cierre: 2 cambios · descripción · pregunta · campanita · próximo
  O.push(<BigNum key="2c" t={t} at={w("dos cosas", 831.6)} text="2 COSAS" size={150} x={1440} y={420} col={CH.maiz} edge="#5a2a10" out={R[40].me - 0.1} />);
  O.push(<Lista key="dos" t={t} at={R[40].me + 0.1} out={tSiete - 0.15} x={1160} y={240} title="ESTA SEMANA, NOMÁS" rows={[{ at: w("salala la noche antes", 832.8), text: "sálala la noche antes" }, { at: w("que el agua no toque", 834.6), text: "que el agua no toque la carne" }]} w={700} />);
  JARS.forEach((q, k) => { const j = sc([q[0], TY + 0.17, q[2]]); O.push(<Ficha key={"fz" + k} t={t} at={tSiete + 0.2 + k * 0.18} out={R[41].ms - 0.1} i={k} x={j.x} y={j.y} sc={0.62} />); });
  O.push(<Golpe key="desc" t={t} at={w("en la descripcion", 841.0)} out={R[41].ms - 0.05} x={960} y={160} words={[{ at: w("en la descripcion", 841.0), w: "CON SUS MEDIDAS," }, { at: w("en la descripcion", 841.0) + 0.3, w: "EN LA DESCRIPCIÓN", col: CH.maiz }]} size={64} />);
  O.push(<Encuesta key="enc1" t={t} at={w("en tu tierra la barbacoa", 846.0) - 0.3} out={R[41].me - 0.1} x={1430} y={470} q="¿En tu tierra la barbacoa es de…?" opts={[{ at: w("de borrego", 847.6), l: "BORREGO" }, { at: w("de res o de chivo", 848.2), l: "RES" }, { at: w("o de chivo", 848.6), l: "CHIVO" }]} />);
  O.push(<Encuesta key="enc2" t={t} at={R[41].me + 0.1} out={tQuiero - 0.15} x={1300} y={460} q="¿Y la hacen en…?" opts={[{ at: w("en hoyo", 850.3), l: "HOYO" }, { at: w("o en vaporera", 850.7), l: "VAPORERA" }]} />);
  O.push(<Mapa key="mapa2" t={t} at={tQuiero + 0.05} out={tGusto - 0.15} x={960} y={540} lit={tQuiero + 0.4} pin={tQuiero + 0.8} label="¿Y TÚ DE DÓNDE?" />);
  O.push(<Campanita key="camp2" t={t} at={tGusto + 0.3} out={tProx - 0.15} x={960} y={300} click={w("suscribete y dale", 854.0) + 0.3} bell={w("a la campanita", 855.2)} />);
  O.push(<Letrero key="let3" t={t} at={tProx + 0.4} out={R[42].ms - 0.05} x={960} y={170} l1="FRIJOLES CHARROS" l2="EL PRÓXIMO DOMINGO" l2at={tProx + 1.0} />);
  O.push(<Dicho key="dicho2" t={t} at={w("no se hace con fuego", 866.8) - 0.4} out={R[42].me + 2.6} x={1400} y={400} w={760} text="La barbacoa no se hace con fuego: se hace con paciencia." firma="Don Teodoro" dur={2.2} />);
  O.push(<Golpe key="nos" t={t} at={w("nos vemos el domingo", 869.8)} out={1e9} x={960} y={880} words={[{ at: w("nos vemos el domingo", 869.8), w: "NOS VEMOS" }, { at: w("nos vemos el domingo", 869.8) + 0.4, w: "EL DOMINGO", col: CH.maiz }]} size={100} />);
  O.push(<Flash key="fl" t={t} at={R[0].ms} col="#fff1cf" peak={0} />);

  const fin = e(t, TOTAL_END - 1.2, TOTAL_END - 0.1);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}{O}{fin > 0 && <AbsoluteFill style={{ background: "#000", opacity: fin }} />}</AbsoluteFill>;
};
