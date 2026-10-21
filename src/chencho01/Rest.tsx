// chencho01 · EL RESTO (2:28 → 12:36). La misma toma única del minuto 1: el pueblo 3D es el mundo y la cámara nunca se corta
// dentro de él (de la plaza al cuaderno, del cuaderno al medidor, de la banqueta a la calle = vuelos continuos). Las fotos reales
// (gente haciendo) y el avatar entran y salen con barridos de cámara con desenfoque de movimiento, nunca con corte seco.
// Cada minuto trae piezas NUEVAS a medida (piezas2.tsx). Todo clavado a la voz con at("frase"). Audio fuera de Remotion.
// C2 el tianguis · C3 tortillería, tiendita, gas, luz · C4 agua, combi, salud, renglones chiquitos · C5 la suma, Guadalajara,
// un día de Chencho · C6 lo malo, la renta, 3 consejos, la tarea, el cierre. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, NB, screenOf, camSpeed, setKeys, win } from "./pueblo3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { CH, P, Tag, at, e, ei, s } from "./lib";
import { Clip, Slide, Pensado, Sello, Polaroid, MIN1_END, oo } from "./Min1";
import {
  Pestana, KmRuta, Ticket, Por4, Balanza, RelojHora, Mitad, Huevera, Matas, SemanaMenu, LatasX, Bascula22, DosPrecios, MaizCarton, Torre,
  NoSeTira, Anaquel, Costal, TanqueMeses, CeroGas, Division, Ventilador, MuroCorte, SolGratis, Faena, Radio10, Combi24, Sentado, Menos6,
  Receta, Lejos40, Papelitos, Recarga, Predial, Sumadora, Cochinito, LibretaCiudad, Pilas, DosHoras, DiaLinea, Saludos, Arena, LoMalo,
  Senal, ConRenta, Consejos, Tarea, MapaPueblos, Billete500, FinalFrase,
} from "./piezas2";

const REEL = (AVAIL as { reel: boolean }).reel;
type Win = { ms: number; me: number; off: number };
export const FULL_END = 756;
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms >= MIN1_END - 0.2);
const PAD = 0.25; // el avatar se ve un poquito antes/después de su ventana: lo justo para el barrido

// ---------------- tiempos clavados a la voz ----------------
const T = {
  r2: at("renglon numero", 277), r3: at("renglon numero", 312), r4: at("renglon numero", 341), r5: at("renglon numero", 369),
  r6: at("renglon numero", 410), r7: at("renglon numero", 427), r8: at("renglon numero", 462),
  // C2 · el tianguis
  frente: at("frente a la iglesia", 150), senoras: at("llegan las senoras", 150), camionJ: at("no viene en camion", 160), cortaron: at("lo cortaron", 160),
  jit: at("un kilo de jitomate", 168), ceb: at("medio kilo de cebolla", 170), chi: at("los chiles serranos", 170), papa: at("un kilo de papa", 170),
  cala: at("un kilo de calabacita", 170), nop: at("una bolsa de nopales", 170), queso: at("un cuarto de queso", 170), pollo: at("un kilo de pollo", 170),
  cil: at("cilantro y epazote", 170), agu: at("un aguacate grandote", 170), fruta: at("y fruta de temporada", 170),
  cuanto: at("sabes cuanto da", 200), comoToda: at("y con eso como toda", 200), cuatroDom: at("por cuatro domingos", 200), alMes1: at("al mes", 205),
  enCiudad: at("en la ciudad", 209), hora: at("es la hora", 212), una: at("a la una", 216), mitad: at("a la mitad", 220), temprano: at("yo voy temprano", 224),
  noCompro: at("lo que no compro", 229), gallinas: at("tengo seis gallinas", 233), cero: at("cero pesos", 240), limonero: at("mi limonero", 245),
  licha: at("mi hermana licha", 250), domingo: at("el domingo caldo", 254), lunes: at("para el lunes", 254), martes: at("el martes", 254),
  jueves: at("jueves nopales", 260), viernes: at("el viernes", 262), sabado: at("el sabado lo que", 262), deVerdad: at("comida de verdad", 270), latas: at("ni latas", 270),
  // C3 · tortillería, tiendita, gas, luz
  kilo22: at("el kilo esta", 280), gdl: at("en guadalajara ya lo pagaba", 280), huele: at("huele a maiz", 285), carton: at("a carton", 285),
  medioK: at("medio kilo diario", 292), alMes2: at("al mes", 297), mama: at("de mi mama", 299), noTira: at("no se tira", 300), tostada: at("se vuelve tostada", 300),
  dinero: at("tambien es dinero", 308), aceite: at("un litro de", 315), arroz: at("dos kilos de arroz", 315), frijol: at("tres kilos de frijol", 315),
  azucar: at("un kilo de azucar", 315), cafe: at("cafe", 328), jabon: at("el jabon", 328), papel: at("papel", 332), masMenos: at("mas o menos", 332),
  costal: at("del costal", 338), bolsita: at("en bolsita", 338), tanque: at("el tanque de", 343), dura: at("me dura", 345), fogon: at("fogon de lena", 350),
  litro: at("ni un litro", 355), lena: at("la lena la junto", 355), gasSale: at("el gas me sale", 365), recibo: at("el recibo de la luz", 372),
  dosMeses: at("pesos por dos meses", 375), oSea: at("o sea", 377), ventilador: at("el ventilador", 380), gruesas: at("las paredes son gruesas", 388),
  fresquito: at("esta fresquito", 390), focos: at("cambie todos los focos", 396), gallo: at("con el gallo", 405), luzDia: at("la luz del dia", 405),
  // C4 · agua, combi, salud, renglones chiquitos
  noRecibo: at("aqui no hay recibo", 410), comite: at("comite del agua", 414), cuota: at("la cuota es de", 418), faena: at("nos toca la faena", 420),
  aPie: at("todo esta a", 432), tienda: at("la tienda", 435), tortilleria: at("la tortilleria", 435), plaza: at("la plaza", 435), iglesia: at("la iglesia", 435),
  combi: at("agarro la combi", 443), pongamos: at("pongamos", 448), sentado: at("me la pasaba sentado", 452), camino: at("aqui camino", 456),
  baje: at("y baje", 460), coraje: at("te va a dar coraje", 465), pastillas: at("las pastillas de la presion", 468), pomada: at("alguna pomada", 474),
  yerbas: at("sus yerbitas", 480), clinica: at("la clinica esta", 484), noche: at("de noche", 487), refri: at("en la puerta del refri", 490),
  chiquitos: at("los renglones chiquitos", 498), recarga: at("la recarga del telefono", 503), predial: at("el predial", 508), oSea2: at("o sea", 512),
  gustito: at("y mi gustito", 513), carnitas: at("tacos de carnitas", 515), noQuito: at("eso no lo quito", 524), esLaVida: at("eso es la vida", 524),
  // C5 · la suma, Guadalajara, un día
  sumar: at("ahora vamos a sumar", 524), sTia: at("tianguis", 527), sTor: at("tortillas", 529), sTie: at("la tiendita", 529), sGas: at("gas", 533),
  sLuz: at("luz", 533), sAgua: at("agua", 533), sCombi: at("combi", 537), sTel: at("telefono", 537), sSalud: at("salud", 537), sPred: at("predial", 537),
  sCarn: at("las carnitas del domingo", 540), total: at("total", 546), cochinito: at("al cochinito", 548), gastaba: at("lo que gastaba en guadalajara", 550),
  rentaD: at("la renta del departamento", 554), camionD: at("el camion", 556), comida: at("la comida del super", 560), servicios: at("la luz el agua", 563),
  alMes3: at("pesos al mes", 568), cuatroV: at("mas de cuatro veces", 570), peor: at("y comia peor", 570), seCome: at("se come mejor", 576),
  huevoG: at("el huevo es de mis gallinas", 579), dosH: at("se cuece en dos horas", 584), cortaronA: at("la verdura la cortaron", 588), prisa: at("de bolsa y de prisa", 592),
  nino: at("lo mismo que comia de nino", 594), seis: at("me levanto a las seis", 600), cafeOlla: at("pongo el cafe de olla", 604), ocho: at("ocho ya estoy", 608),
  tortillas2: at("luego voy por las tortillas", 612), mundo: at("me para todo el mundo", 616), riego: at("en la tarde riego", 618), sienta: at("a las seis me siento", 622),
  apura: at("nadie me apura", 627), noCobra: at("la vida no me cobra", 630), sobraT: at("me sobra tiempo", 634),
  // C6 · lo malo, la renta, consejos, tarea, cierre
  loMalo: at("te prometi lo malo", 635), primero: at("primero la clinica", 638), segundo: at("segundo", 642), tercero: at("tercero el internet", 646),
  senal: at("la senal llega", 648), cuarto: at("y cuarto la soledad", 650), extrane: at("extrane el ruido", 656), noPago: at("yo no pago renta", 664),
  rentas: at("si tu rentas", 666), enMitad: at("en la mitad", 672), completa: at("haz la cuenta completa", 674), consejos: at("tres consejos", 682),
  c1: at("antes de vender todo", 686), c2: at("pregunta donde esta la clinica", 694), c3: at("apunta todo en un", 700), seVa: at("lo que no se apunta", 704),
  tarea: at("de tarea", 708), chicle: at("hasta el chicle", 712), suma: at("suma", 717), cuentame: at("cuentame aqui abajo", 718), quePueblo: at("de que pueblo eres", 720),
  bolsa500: at("pesos en la bolsa", 735), invitada: at("de invitada", 738), regar: at("a regar mi", 744), noEsMas: at("la vida no es mas", 748), deUno: at("es mas de uno", 750),
  nosVemos: at("nos vemos", 752),
};

// ---------------- tomas: el mundo (W) o una foto/clip real; el avatar se mete encima en sus ventanas ----------------
const SH: [number, string][] = [
  [140, "W"], [T.senoras, "h_tianguis"], [161.64, "W"], [171.2, "t_bolsa"], [187.1, "W"], [219.4, "t_montones"], [T.temprano, "t_temprano"],
  [235.7, "W"], [240.4, "t_gallinas"], [254, "W"], [272.7, "t_frijol"], [279.38, "W"], [282, "t_tortilleria"], [288.9, "W"], [306, "t_tostada"],
  [T.r3 + 1.2, "t_tienda"], [322.6, "W"], [T.tanque - 0.4, "t_tanque"], [355, "t_fogon"], [T.lena - 0.3, "t_lena"], [368.4, "W"], [T.recibo + 0.3, "t_recibo"],
  [384.2, "W"], [T.focos - 0.2, "t_foco"], [T.gallo - 0.3, "W"], [416.3, "t_pozo"], [433.9, "W"], [T.combi - 2.6, "t_combi2"], [452.1, "t_caminar"],
  [466.9, "t_clinica"], [482.8, "W"], [T.recarga - 0.3, "t_telefono"], [T.predial - 0.3, "W"], [517, "t_carnitas"], [T.sumar - 0.1, "W"],
  [T.cortaronA - 0.3, "t_milpa"], [598.9, "W"], [614.6, "h_calle"], [T.riego + 0.5, "W"], [T.cuarto - 0.1, "t_banca"], [667.1, "W"],
  [T.c3 + 1.8, "h_cuaderno"], [715.8, "h_cuaderno_mano"], [T.cuentame - 0.3, "W"], [750.7, "t_noche"],
];
const inAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
const shotAt = (t: number) => { let i = 0; while (i < SH.length - 1 && SH[i + 1][0] <= t) i++; return SH[i]; };
const keyAt = (t: number) => (inAv(t) ? "AV" : shotAt(t)[1]);
const BOUNDS = [...SH.map((x) => x[0]), ...WIN.flatMap((w) => [w.ms, w.me])].filter((b) => b > MIN1_END - 0.5).sort((a, b) => a - b)
  .filter((b) => keyAt(b - 0.002) !== keyAt(b + 0.002) && !(keyAt(b - 0.002) === "W" && keyAt(b + 0.002) === "W"));

// ---------------- cámara del resto (se suma a la del minuto 1) ----------------
const V3 = (a: number, b: number, c: number): [number, number, number] => [a, b, c];
const NBP = V3(-3.3, 0.65, 3.7), NBC = V3(-3.35, 0.58, 3.58), NBL = V3(NB[0], NB[1], NB[2] - 0.01);
const STREET = V3(0.6, 1.72, 8.2), STREET_L = V3(-0.6, 1.85, -30);
const GALL = PT.gallinas, MESA = PT.mesa, AER = V3(7.5, 15.5, 14), AER_L = V3(0, 0, -24);
const WALL_L = V3(-4.3, 1.4, 5.6);
setKeys([
  { t: 152.8, p: V3(0.5, 2.6, -27), l: V3(0, 1.4, -42), fov: 44 },             // la plaza frente a la iglesia
  { t: 157.6, p: V3(0.9, 2.3, -29.5), l: V3(0, 1.2, -42), fov: 42 },
  { t: 161.64, p: V3(1.6, 1.7, -35.5), l: V3(-0.5, 1.0, -40), fov: 38 },       // entre los puestos
  { t: 167.0, p: V3(1.2, 1.6, -36.6), l: V3(-0.5, 1.0, -40), fov: 34 },
  { t: 187.1, p: V3(-1.0, 1.55, -36.8), l: V3(0.6, 1.0, -41), fov: 36 },       // el otro lado de los puestos
  { t: 197.3, p: V3(-0.6, 1.5, -37.6), l: V3(0.6, 1.0, -41), fov: 32 },
  { t: 201.8, p: NBP, l: NB, fov: 30 },                                         // el cuaderno: renglón 1
  { t: 209.5, p: NBC, l: NBL, fov: 29 },
  { t: 215.1, p: V3(-3.2, 0.72, 3.78), l: NB, fov: 31 },
  { t: 235.7, p: V3(-7.0, 1.4, 0.8), l: GALL, fov: 38 },                        // el corral: seis gallinas
  { t: 240.4, p: V3(-7.4, 1.2, 0.3), l: GALL, fov: 34 },
  { t: 254.0, p: V3(-7.2, 1.6, 3.2), l: MESA, fov: 40 },                        // la mesa del patio: la semana
  { t: 260.5, p: V3(-7.5, 1.5, 2.9), l: MESA, fov: 37 },
  { t: 267.5, p: V3(-7.6, 1.4, 2.6), l: MESA, fov: 34 },
  { t: 279.38, p: NBP, l: NB, fov: 30 },                                        // renglón 2
  { t: 282.0, p: NBC, l: NBL, fov: 29 },
  { t: 288.9, p: STREET, l: STREET_L, fov: 42 },                                // la calle: huele a maíz
  { t: 294.0, p: V3(0.3, 1.7, 6.5), l: STREET_L, fov: 42 },
  { t: 295.8, p: NBP, l: NB, fov: 30, arc: 0.3 },                               // vuela al cuaderno: renglón 2 = $330
  { t: 301.3, p: NBC, l: NBL, fov: 29 },
  { t: 322.6, p: V3(-1.2, 1.6, -6), l: V3(4.3, 1.5, -10), fov: 40 },            // la tiendita de la esquina
  { t: 333.0, p: V3(0, 1.55, -7.5), l: V3(4.3, 1.5, -10), fov: 36 },
  { t: 337.9, p: NBP, l: NB, fov: 30 },                                         // renglón 3
  { t: 343.7, p: NBC, l: NBL, fov: 29 },
  { t: 368.4, p: NBP, l: NB, fov: 30 },                                         // renglón 4 → el medidor
  { t: 371.2, p: NBC, l: NBL, fov: 29 },
  { t: 372.9, p: V3(-2.1, 1.62, 4.7), l: PT.recibo, fov: 34, arc: 0.2 },
  { t: 375.7, p: V3(-2.45, 1.68, 4.25), l: PT.recibo, fov: 31 },
  { t: 384.2, p: V3(-1.2, 1.5, 4.6), l: WALL_L, fov: 40 },                      // el muro de adobe
  { t: 396.5, p: V3(-1.7, 1.45, 4.9), l: WALL_L, fov: 34 },
  { t: 405.9, p: STREET, l: V3(-0.6, 2.4, -30), fov: 42 },                      // amanece en la calle
  { t: 411.6, p: V3(0.4, 1.9, 6.0), l: V3(-0.6, 3.0, -30), fov: 40 },
  { t: 433.9, p: AER, l: AER_L, fov: 44 },                                      // vista aérea: todo a pie
  { t: 442.5, p: V3(6.8, 15, 12.4), l: AER_L, fov: 44 },
  { t: 482.8, p: V3(0.4, 1.7, 7.8), l: V3(-0.6, 1.9, -30), fov: 42 },          // la calle de noche
  { t: 494.8, p: V3(0.3, 1.7, 5.5), l: V3(-0.6, 1.9, -30), fov: 40 },
  { t: 500.5, p: NBP, l: NB, fov: 30 },                                         // los renglones chiquitos
  { t: 505.4, p: NBC, l: NBL, fov: 29 },
  { t: 508.6, p: NBP, l: NB, fov: 30 },                                         // el predial
  { t: 512.2, p: NBC, l: NBL, fov: 29 },
  { t: 526.2, p: V3(-3.1, 0.82, 3.9), l: NB, fov: 32 },                         // la suma
  { t: 529.2, p: V3(-3.2, 0.74, 3.8), l: NB, fov: 31 },
  { t: 533.2, p: NBP, l: NB, fov: 30 },
  { t: 543.3, p: NBC, l: NBL, fov: 29 },
  { t: 548.1, p: V3(-3.2, 0.8, 3.8), l: NB, fov: 31 },
  { t: 553.3, p: V3(-3.0, 1.0, 4.2), l: NB, fov: 34 },
  { t: 555.4, p: STREET, l: STREET_L, fov: 42, arc: 0.5 },                      // a la calle: Guadalajara se come el color
  { t: 561.6, p: V3(0.4, 1.75, 6.5), l: STREET_L, fov: 41 },
  { t: 566.7, p: V3(0.5, 1.8, 7.0), l: V3(-0.6, 1.9, -30), fov: 42 },
  { t: 578.0, p: V3(0.2, 1.7, 4.0), l: V3(-0.6, 1.9, -30), fov: 40 },
  { t: 583.8, p: V3(-7.2, 1.6, 3.2), l: MESA, fov: 40 },                        // la mesa: el frijol nuevo
  { t: 591.7, p: V3(-7.6, 1.4, 2.6), l: MESA, fov: 34 },
  { t: 598.9, p: V3(-7.0, 1.5, 1.5), l: V3(-10.6, 0.6, -1.4), fov: 40 },        // el patio al amanecer: un día de Chencho
  { t: 610.6, p: V3(-7.5, 1.4, 0.9), l: V3(-10.6, 0.6, -1.4), fov: 36 },
  { t: 619.5, p: V3(-1.4, 1.0, 6.4), l: V3(-3.6, 0.5, 2.6), fov: 40 },          // la banqueta al atardecer
  { t: 625.8, p: V3(-1.6, 0.95, 6.0), l: V3(-3.6, 0.5, 2.6), fov: 38 },
  { t: 631.4, p: V3(-1.2, 1.1, 7.0), l: V3(-3.6, 0.6, 2.6), fov: 42 },
  { t: 637.6, p: V3(-0.6, 1.3, 7.8), l: V3(-3.6, 0.8, 2.6), fov: 42 },
  { t: 640.4, p: STREET, l: STREET_L, fov: 42 },                                // la calle: lo malo
  { t: 643.9, p: V3(0.5, 1.75, 7.0), l: STREET_L, fov: 41 },
  { t: 649.4, p: V3(0.4, 1.8, 6.0), l: V3(-0.6, 2.2, -30), fov: 40 },
  { t: 653.9, p: V3(0.3, 1.8, 5.0), l: V3(-0.6, 2.2, -30), fov: 38 },
  { t: 667.1, p: NBP, l: NB, fov: 30 },                                         // el cuaderno: si rentas
  { t: 677.5, p: V3(-3.1, 0.85, 3.95), l: NB, fov: 32 },
  { t: 681.9, p: AER, l: AER_L, fov: 44 },                                      // vista aérea: 3 consejos
  { t: 695.0, p: V3(6.4, 14.2, 11.5), l: AER_L, fov: 44 },
  { t: 698.8, p: STREET, l: STREET_L, fov: 42 },
  { t: 703.6, p: V3(0.3, 1.7, 6.0), l: STREET_L, fov: 40 },
  { t: 718.4, p: V3(0.5, 2.6, -27), l: V3(0, 1.4, -42), fov: 44 },              // la plaza al anochecer
  { t: 726.9, p: V3(0.6, 2.4, -28.5), l: V3(0, 1.3, -42), fov: 42 },
  { t: 732.0, p: V3(0.9, 2.1, -34.6), l: V3(0, 1.0, -40), fov: 36 },
  { t: 746.2, p: V3(0.6, 1.9, -36.0), l: V3(0, 0.95, -40), fov: 34 },
]);

// ---------------- estado del mundo ----------------
const ROWS = [T.alMes1 + 0.3, T.alMes2 + 0.6, 338.3, T.gasSale + 1.6, T.oSea + 0.3, T.cuota + 1.0, T.pongamos + 0.6, T.recarga + 1.2, T.recarga + 1.7, T.oSea2 + 0.4, T.sumar - 1.5];
const NIGHT: [number, number] = [482.8, 494.8];
const worldAt = (t: number): WorldProps => ({
  t,
  nbOpen: 1,
  nbRows: ROWS.reduce((a, x) => a + win(t, x, x + 0.6), 0),
  nbTotal: win(t, T.total - 0.1, T.total + 0.9),
  nbHide: t > T.total - 0.1 ? 0 : 1,
  nbTitle: "Octubre · en limpio",
  porton: [[234, 241], [253, 268], [583, 592], [598, 611]].some(([a, b]) => t > a && t < b) ? 1 : 0, // abierto sólo cuando la cámara anda en el patio
  books: 0,
  bell: 0,
  tianguis: 1,
  stones: 0,
  dusk: Math.max(0.3 * win(t, 405.5, 406.5) * (1 - win(t, 410, 412)), 0.25 * win(t, 598.5, 599.5) * (1 - win(t, 607, 612)), 0.7 * win(t, 619, 637)) ,
});
const World: React.FC<{ t: number; gray?: number }> = ({ t, gray = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mr" + Math.round(t * 30);
  const mb = v.bx + v.by > 0.6 ? `url(#${id})` : "";
  const night = win(t, NIGHT[0] - 0.3, NIGHT[0] + 0.2) * (1 - win(t, NIGHT[1], NIGHT[1] + 0.3));
  const fl = [mb, gray > 0.01 ? `grayscale(${gray}) brightness(${1 - 0.25 * gray})` : "", night > 0.01 ? `brightness(${1 - 0.55 * night}) saturate(${1 - 0.35 * night})` : ""].join(" ").trim();
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: fl || undefined }}><WorldRaw {...worldAt(t)} /></AbsoluteFill>
      {night > 0.01 && <AbsoluteFill style={{ background: "rgba(20,40,110,.35)", mixBlendMode: "multiply", opacity: night }} />}
    </AbsoluteFill>
  );
};

// ---------------- avatar (preroll de 10 cuadros; se ve PAD antes/después para el barrido) ----------------
// el reel trae 0,1 s de corrimiento desde la ventana de 411 s (medido por correlación de audio reel↔mezcla)
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms - PAD) - 10} durationInFrames={s(w.me - w.ms + 2 * PAD) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - PAD && t < w.me + PAD ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off - (w.ms > 405 ? 0.1 : 0) - PAD) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

const GRAY = (t: number) => win(t, 553.6, 555.4) * (1 - win(t, 577.2, 578.0));
const Dim: React.FC<{ t: number; a: number; out: number; k?: number }> = ({ t, a, out, k = 0.55 }) => <AbsoluteFill style={{ background: `rgba(14,9,6,${k})`, opacity: oo(t, a, out, 0.3, 0.4) }} />;

export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  if (t < MIN1_END - 0.6) return null;
  if (t < MIN1_END - 0.2) return <AbsoluteFill style={{ opacity: 0 }}><Avatar t={t} /></AbsoluteFill>; // sólo el preroll del avatar (el minuto 1 va encima)
  const shotStart = (k: string) => (SH.find((x) => x[1] === k) ?? [0])[0];
  const base = (k: string, tt: number) => k === "AV" ? <Avatar t={tt} /> : k === "W" ? <World t={tt} gray={GRAY(tt)} /> : <Clip k={k} t={tt} a={shotStart(k)} z={[1.03, 1.11]} dur={9} />;
  const L: React.ReactNode[] = [];

  // la base: una sola toma; en cada cambio, barrido de cámara con desenfoque (salvo mundo→mundo, que es vuelo continuo)
  const b = BOUNDS.find((x) => t >= x - 0.2 && t < x + 0.25);
  if (b !== undefined) {
    const A = keyAt(b - 0.002), B = keyAt(b + 0.002);
    L.push(<Slide key={"sl" + b} t={t} a={b - 0.2} d={0.45} A={base(A, A === "W" ? Math.min(t, b - 0.01) : t)} B={base(B, B === "W" ? Math.max(t, b) : t)} />);
  } else L.push(<React.Fragment key="base">{base(keyAt(t), t)}</React.Fragment>);

  const sc = (q: [number, number, number]) => screenOf(t, q);
  // ================= C2 · RENGLÓN 1: el tianguis =================
  L.push(<Pestana key="p1" t={t} at={148.3} out={152.4} n={1} title="el tianguis" />);
  L.push(<Pensado key="fi" t={t} at={T.frente - 0.6} out={T.senoras - 0.2} x={960} y={240} text="los domingos, frente a la iglesia" size={78} />);
  L.push(<KmRuta key="km" t={t} at={T.camionJ - 0.2} out={166.8} />);
  L.push(<Sello key="cs" t={t} at={T.cortaron + 0.1} text="CORTADO EL SÁBADO" x={1420} y={300} out={170.9} rot={-6} size={70} col={CH.guinda} />);
  L.push(<Ticket key="tk" t={t} at={T.jit - 0.3} out={T.enCiudad - 0.2} totalAt={T.cuanto + 1.4} x={1460 - 1060 * ei(t, 201.5, 202.4)} y={560} sc={0.95} rows={[
    { at: T.jit, item: "1 kg jitomate", v: 25 }, { at: T.ceb, item: "½ kg cebolla", v: 12 }, { at: T.chi, item: "chiles serranos", v: 10 },
    { at: T.papa, item: "1 kg papa", v: 25 }, { at: T.cala, item: "1 kg calabacita", v: 20 }, { at: T.nop, item: "nopales limpios", v: 15 },
    { at: T.queso, item: "¼ queso fresco", v: 35 }, { at: T.pollo, item: "1 kg pollo", v: 85 }, { at: T.cil, item: "cilantro, epazote", v: 10 },
    { at: T.agu, item: "aguacate grandote", v: 25 }, { at: T.fruta, item: "guayaba, mandarina", v: 40 }]} />);
  L.push(<Por4 key="p4" t={t} at={T.cuatroDom - 0.2} totalAt={T.alMes1 - 0.5} out={T.enCiudad - 0.2} x={1180} y={900} />);
  L.push(<Dim key="dB" t={t} a={T.enCiudad - 0.3} out={215.0} />);
  L.push(<Balanza key="bz" t={t} at={T.enCiudad - 0.2} out={215.0} />);
  L.push(<RelojHora key="rh" t={t} at={T.hora - 0.2} unaAt={T.una} out={223.8} x={1430} y={470} />);
  L.push(<Mitad key="mi" t={t} at={T.mitad} out={T.temprano - 0.2} x={1420} y={420} />);
  L.push(<Pensado key="vt" t={t} at={T.temprano + 0.2} out={229.8} x={1240} y={220} text="temprano: pollo y queso… al final: la verdura" size={64} />);
  L.push(<Pensado key="nc" t={t} at={T.noCompro} out={235.6} x={1420} y={240} text="lo que no compro también cuenta" size={70} />);
  L.push(<Huevera key="hv" t={t} at={T.gallinas + 0.2} ceroAt={T.cero} out={247.9} x={1420} y={540} />);
  L.push(<Matas key="mt" t={t} at={T.limonero - 0.2} lichaAt={T.licha} out={253.9} x={1400} y={540} />);
  L.push(<SemanaMenu key="sm" t={t} at={T.domingo - 0.6} out={T.deVerdad - 0.5} x={1300 - 880 * ei(t, 267.2, 267.8)} y={540} sc={1.0} days={[
    ["DOMINGO", "caldo de pollo", T.domingo], ["LUNES", "lo que quedó del caldo", T.lunes], ["MAR · MIÉ", "frijoles de la olla", T.martes],
    ["JUEVES", "nopales con jitomate", T.jueves], ["VIERNES", "calabacitas con queso", T.viernes], ["SÁBADO", "taquitos de lo que sobró", T.sabado]]} />);
  L.push(<Dim key="dS" t={t} a={T.domingo - 0.6} out={267.4} k={0.3} />);
  L.push(<Sello key="cv" t={t} at={T.deVerdad} text="COMIDA DE VERDAD" sub="HECHA EN CASA" x={560} y={230} out={279.2} rot={-5} size={74} col={CH.guinda} />);
  L.push(<LatasX key="lx" t={t} at={T.latas} out={279.2} x={1380} y={720} />);

  // ================= C3 · tortillería, tiendita, gas, luz =================
  L.push(<Pestana key="p2" t={t} at={T.r2} out={T.r2 + 3.4} n={2} title="la tortillería" />);
  L.push(<Bascula22 key="b22" t={t} at={T.kilo22 - 0.3} out={284.5} x={1400} y={760} />);
  L.push(<DosPrecios key="dp" t={t} at={284.7} gdlAt={Math.max(T.gdl, 285)} out={288.7} x={1420} y={520} />);
  L.push(<MaizCarton key="mc" t={t} at={T.huele - 0.2} cartonAt={T.carton} out={294.4} />);
  L.push(<Torre key="tr" t={t} at={T.medioK} amtAt={T.alMes2 + 0.4} out={301.2} x={540} y={960} />);
  L.push(<Pensado key="mm" t={t} at={T.mama - 0.3} out={T.noTira - 0.2} x={1420} y={240} text="lo que aprendí de mi mamá" size={76} />);
  L.push(<NoSeTira key="nt" t={t} at={T.noTira} tostAt={T.tostada} dineroAt={T.dinero} out={T.r3 + 1.0} x={1240} y={860} />);
  L.push(<Pestana key="p3" t={t} at={T.r3} out={T.r3 + 3.4} n={3} title="la tiendita" />);
  L.push(<Anaquel key="aq" t={t} at={T.aceite - 0.3} out={337.7} totalAt={T.masMenos} x={1470} y={500} sc={0.98} items={[
    ["aceite", 45, T.aceite], ["arroz 2 kg", 56, T.arroz], ["frijol 3 kg", 105, T.frijol], ["azúcar", 30, T.azucar],
    ["café", 60, T.cafe], ["jabón", 50, T.jabon], ["papel", 40, T.papel], ["", 0, 1e9]].filter((x) => x[0]) as [string, number, number][]} />);
  { const tp = sc([4.3, 2.7, -9.5]); L.push(<Tag key="tdt" t={t} at={322.8} x={tp.x} y={tp.y} dx={-380} dy={-160} text="LA TIENDITA" sub="DE LA ESQUINA" col={CH.maiz} out={T.aceite + 4} size={52} />); }
  L.push(<Costal key="co" t={t} at={T.costal - 0.4} bolsaAt={T.bolsita} out={343.5} x={560} y={760} />);
  L.push(<Pestana key="p4p" t={t} at={T.r4} out={T.r4 + 3.4} n={4} title="el gas" />);
  L.push(<TanqueMeses key="tm" t={t} at={T.tanque + 0.3} duraAt={T.dura} out={351.0} x={1440} y={560} />);
  L.push(<Pensado key="fg" t={t} at={T.fogon - 0.2} out={354.8} x={1400} y={250} text="fogón de leña, como mi mamá" size={74} />);
  L.push(<CeroGas key="cg" t={t} at={T.litro - 0.3} out={T.lena - 0.4} x={1380} y={860} />);
  L.push(<Pensado key="ln" t={t} at={T.lena + 0.2} out={364.8} x={1300} y={230} text="las ramas que se caen del encino" size={70} />);
  L.push(<Pestana key="p5" t={t} at={T.r5} out={T.r5 + 3.4} n={5} title="la luz" />);
  L.push(<Division key="dv" t={t} at={T.dosMeses - 0.4} resAt={T.oSea + 0.2} out={384.0} x={960} y={860} />);
  L.push(<Ventilador key="vn" t={t} at={384.4} out={389.5} x={1440} y={520} />);
  L.push(<Dim key="dM" t={t} a={T.gruesas - 0.4} out={396.3} k={0.35} />);
  L.push(<MuroCorte key="mu" t={t} at={T.gruesas - 0.2} frescoAt={T.fresquito - 0.7} out={396.4} />);
  L.push(<Sello key="fo" t={t} at={T.focos + 0.6} text="FOCOS AHORRADORES" sub="Y LA TELE, NOMÁS EN LA NOCHE" x={1380} y={860} out={T.gallo - 0.4} rot={-4} size={68} col={CH.nopal} />);
  L.push(<SolGratis key="sg" t={t} at={T.luzDia - 0.6} out={411.5} />);

  // ================= C4 · agua, combi, salud, renglones chiquitos =================
  L.push(<Pestana key="p6" t={t} at={T.r6} out={T.r6 + 3.4} n={6} title="el agua" />);
  L.push(<Pensado key="nr" t={t} at={T.noRecibo} out={T.comite + 0.6} x={1350} y={250} text="aquí no hay recibo…" size={84} />);
  L.push(<Sello key="cm" t={t} at={T.comite + 0.2} text="COMITÉ DEL AGUA" sub="LOS MISMOS VECINOS" x={1350} y={420} out={T.cuota - 0.2} rot={-4} size={66} col="#2f7fc1" />);
  L.push(<Faena key="fa" t={t} at={T.cuota} faenaAt={T.faena} out={429.5} x={960} y={800} />);
  L.push(<Pestana key="p7" t={t} at={T.r7} out={T.r7 + 3.4} n={7} title="la combi" />);
  {
    const home = sc([-1.5, 0.3, -9]);
    const pin = (q: [number, number, number]) => { const p = sc(q); return [p.x, p.y] as [number, number]; };
    const [tx, ty] = pin([4.3, 1.5, -10]), [rx, ry] = pin([-4.3, 1.5, -14]), [px, py] = pin([0, 1, -40]), [ix, iy] = pin([3.5, 9, -58]);
    L.push(<Radio10 key="r10" t={t} at={T.aPie - 0.2} out={442.3} cx={home.x} cy={home.y}
      pins={[["la tienda", tx, ty, T.tienda], ["la tortillería", rx, ry, T.tortilleria], ["la plaza", px, py, T.plaza], ["la iglesia", ix, iy, T.iglesia]]} />);
  }
  L.push(<Combi24 key="c24" t={t} at={T.combi + 0.4} redAt={T.pongamos} out={455.4} x={1420} y={520} />);
  L.push(<Sentado key="se" t={t} at={T.sentado - 0.2} horaAt={T.camino} out={462.3} x={960} y={820} />);
  L.push(<Menos6 key="m6" t={t} at={T.baje} out={T.r8 - 0.2} x={1440} y={520} />);
  L.push(<Pestana key="p8" t={t} at={T.r8} out={T.r8 + 3.4} n={8} title="la salud" />);
  L.push(<Receta key="rc" t={t} at={T.pastillas - 0.2} jarAt={T.pomada} out={479.2} x={1400} y={520} />);
  L.push(<Polaroid key="yb" t={t} at={483.0} out={T.clinica - 0.3} img="img_t_yerbas.jpg" x={1450} y={500} cap="las yerbitas de Licha" rot={4} w={480} />);
  L.push(<Lejos40 key="l40" t={t} at={T.clinica - 0.2} nocheAt={T.noche} out={494.6} />);
  L.push(<Papelitos key="pl" t={t} at={T.refri} out={500.3} x={1440} y={540} />);
  L.push(<Pensado key="rch" t={t} at={T.chiquitos - 0.2} out={T.recarga - 0.4} x={1300} y={230} text="los renglones chiquitos también suman" size={70} />);
  L.push(<Recarga key="rg" t={t} at={T.recarga + 0.2} out={T.predial - 0.4} x={1380} y={560} />);
  L.push(<Predial key="pd" t={t} at={T.predial} resAt={T.oSea2 + 0.2} out={T.gustito - 0.1} x={1420} y={820} />);
  L.push(<Pensado key="gu" t={t} at={T.gustito} out={516.9} x={1420} y={260} text="y mi gustito…" size={88} />);
  L.push(<Sello key="nq" t={t} at={T.noQuito} text="ESO NO SE QUITA" sub="ESO ES LA VIDA" x={1300} y={300} out={T.sumar - 0.2} rot={-6} size={68} col={CH.guinda} />);

  // ================= C5 · la suma, Guadalajara, un día de Chencho =================
  L.push(<Sumadora key="su" t={t} at={T.sumar + 0.2} out={T.cochinito + 2.0} totalAt={T.total + 0.2} x={1650} y={40} sc={1.0} rows={[
    ["tianguis", 1200, T.sTia], ["tortillas", 330, T.sTor], ["tiendita", 400, T.sTie], ["gas", 230, T.sGas], ["luz", 73, T.sLuz], ["agua", 70, T.sAgua],
    ["combi", 100, T.sCombi], ["teléfono", 100, T.sTel], ["salud", 60, T.sSalud], ["predial", 27, T.sPred], ["carnitas", 360, T.sCarn]]} />);
  L.push(<Cochinito key="ch" t={t} at={T.cochinito} out={555.0} x={520} y={700} />);
  L.push(<LibretaCiudad key="lc" t={t} at={T.gastaba} out={T.cuatroV - 1.6} x={1380} y={520} sc={0.86} totAt={T.alMes3} rows={[
    ["renta del depa", "$6,500", T.rentaD], ["camión", "$1,200", T.camionD], ["súper y fonda", "+$4,000", T.comida], ["luz, agua, gas, internet", "$1,500", T.servicios]]} />);
  L.push(<Dim key="dP" t={t} a={T.cuatroV - 1.6} out={577.9} k={0.4} />);
  L.push(<Pilas key="pi" t={t} at={T.cuatroV - 1.5} out={577.9} />);
  L.push(<Pensado key="pe" t={t} at={T.peor} out={578.2} x={960} y={200} text="…y comía peor" size={110} rot={-3} />);
  L.push(<Polaroid key="hu" t={t} at={T.huevoG - 0.2} out={583.6} img="img_t_huevos.jpg" x={1450} y={500} cap="la yema anaranjada" rot={-4} w={480} />);
  L.push(<Dim key="dD" t={t} a={T.dosH - 0.4} out={591.5} k={0.35} />);
  L.push(<DosHoras key="dh" t={t} at={T.dosH - 0.3} out={591.5} x={1100} y={260} />);
  L.push(<Pensado key="pr" t={t} at={T.prisa - 0.8} out={T.nino + 0.4} x={1360} y={250} text="de lata, de bolsa y de prisa" size={78} />);
  L.push(<Pensado key="ni" t={t} at={T.nino + 0.5} out={598.7} x={1360} y={250} text="como comía de niño" size={82} col={CH.maiz} />);
  L.push(<DiaLinea key="dl" t={t} at={T.seis - 0.4} out={T.loMalo - 0.2} marks={[
    ["6:00", "con el gallo", T.seis], ["8:00", "barrer la banqueta", T.ocho - 0.2], ["", "por las tortillas", T.tortillas2], ["tarde", "regar las plantas", T.riego], ["18:00", "la banqueta", T.sienta]]} />);
  L.push(<Saludos key="sl2" t={t} at={T.tortillas2 + 1.4} out={T.riego + 0.3} />);
  L.push(<Pensado key="na" t={t} at={T.apura - 0.1} out={633.8} x={1300} y={230} text="nadie me apura" size={96} />);
  L.push(<Arena key="ar" t={t} at={T.noCobra - 0.2} out={T.loMalo - 0.2} x={1420} y={460} />);

  // ================= C6 · lo malo, la renta, consejos, tarea, cierre =================
  L.push(<LoMalo key="lm" t={t} at={T.loMalo} out={662.2} x={1340} y={430} sc={0.8} items={[
    ["la clínica, lejos", T.primero], ["la combi: hasta las 6", T.segundo], ["la señal, cuando quiere", T.tercero], ["la soledad", T.cuarto]]} />);
  L.push(<Senal key="sn" t={t} at={T.senal - 0.2} out={T.cuarto - 0.2} x={560} y={820} />);
  L.push(<Pensado key="ex" t={t} at={T.extrane - 0.2} out={662.2} x={960} y={900} text="extrañé el ruido de la ciudad" size={70} />);
  L.push(<Sello key="np" t={t} at={T.noPago + 0.2} text="YO NO PAGO RENTA" sub="LA CASA ERA DE MIS PAPÁS" x={1380} y={300} out={T.rentas - 0.2} rot={-5} size={70} col={CH.guinda} />);
  L.push(<Dim key="dR" t={t} a={T.rentas - 0.2} out={677.3} k={0.45} />);
  L.push(<ConRenta key="cr" t={t} at={T.rentas} mitadAt={T.enMitad} out={677.3} />);
  L.push(<Sello key="hc" t={t} at={T.completa} text="HAZ LA CUENTA COMPLETA" x={1380} y={860} out={681.7} rot={-4} size={60} col={CH.maiz} />);
  L.push(<Consejos key="cj" t={t} out={710.2} x={960} y={820} sc={0.82} items={[
    ["quédate un mes entero", "no un fin de semana", T.c1], ["¿dónde está la clínica?", "y cuánto tarda la combi", T.c2], ["apúntalo todo", "en un cuaderno", T.c3]]} />);
  L.push(<Tarea key="ta" t={t} at={T.tarea} chicleAt={T.chicle} sumaAt={T.suma} out={T.cuentame - 0.4} x={1420} y={520} />);
  L.push(<Dim key="dMa" t={t} a={T.cuentame - 0.3} out={726.7} k={0.5} />);
  L.push(<MapaPueblos key="mp" t={t} at={T.cuentame} out={726.7} />);
  L.push(<Pensado key="qp" t={t} at={T.quePueblo} out={726.7} x={640} y={940} text="¿de qué pueblo eres?" size={80} />);
  L.push(<Billete500 key="bi" t={t} at={T.bolsa500 - 1.4} out={746.0} x={1400} y={480} />);
  L.push(<Pensado key="pv" t={t} at={T.invitada - 0.4} out={746.0} x={1400} y={820} text="…y con Chayo de invitada" size={70} />);
  L.push(<Pensado key="rl" t={t} at={T.regar - 0.2} out={750.5} x={1400} y={260} text="a regar mi limonero" size={80} />);
  if (t > 750.4) L.push(<AbsoluteFill key="dk" style={{ background: "linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.55))", opacity: e(t, 750.6, 751.4) }} />);
  L.push(<FinalFrase key="ff" t={t} at={T.noEsMas - 0.2} at2={T.deUno} />);
  L.push(<AbsoluteFill key="end" style={{ background: "#000", opacity: e(t, FULL_END - 1.0, FULL_END - 0.2) }} />);

  return <AbsoluteFill style={{ background: "#0b0907" }}>{L}</AbsoluteFill>;
};
