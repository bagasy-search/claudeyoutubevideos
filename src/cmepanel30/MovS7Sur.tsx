// MovS7Sur.tsx — MOVIMIENTO S7 · "LA ENERGÍA TOTAL NO ES TU ENERGÍA · GIRÉ UNO AL OESTE"
// Video `cmepanel30` (Claudio Mendoza Constructor, ES). 5 actos · 0 → 1530 frames @30 = 51,00 s.
// Tramo global 24286 → 25816 (frame local = global − 24286). Se monta ENCIMA del avatar EN BUCLE.
// ⛔ CERO capas de color con opacidad sobre su cara: las ventanas son GEOMETRÍA (`clip-path`).
//
// ⭐ ESTE MOVIMIENTO CONTIENE EL CONTRAINTUITIVO QUE LA GENTE VA A REPETIR:
//    "El panel del oeste produce un 12% MENOS en total y me ahorra un 19% MÁS. Porque mirando al
//     sur maximizás la energía TOTAL, y la energía total no le importa a nadie: lo que importa es
//     la energía que tu casa se come EN EL MOMENTO en que la produce."
//    Remate: "Los catálogos se hacen con la energía total, no con tu vida."
//
// ⭐⭐ EL RIESGO DE ESTE TRAMO ERA QUE SE LEYERA COMO UNA TABLA COMPARATIVA. NO LO ES.
//    No hay dos barras en ningún frame. Hay UN SOLO RIEL DE HORAS (de las 10 a las 8 de la noche),
//    registrado sobre el suelo del material real, y sobre ese riel hay UNA SOLA COSA: LA LUZ QUE
//    EL SOL APOYA SOBRE EL PANEL, tumbada a lo largo de las horas como un charco.
//    El panel del oeste NO es una segunda barra: es ESA MISMA MANCHA DE LUZ, que en el acto 3 se
//    DESPEGA de su lugar y CAMINA HACIA LA DERECHA (dos horas y media más tarde), perdiendo por el
//    camino un 12% de su cuerpo. Donde estaba queda una CENIZA: el contorno gris de donde estuvo.
//    Y entonces LA CASA SE DESPIERTA: desde ARRIBA y en FRÍO (ley de dirección: lo que te cobran)
//    baja una COLUMNA DE HORAS DESPIERTAS que aterriza sobre el riel entre las 5 y las 8 — con las
//    ventanas encendiéndose de verdad adentro, en material real.
//    ⭐ LA COINCIDENCIA NO SE ESCRIBE, SE PRENDE: el pedazo de luz que queda DEBAJO de la columna
//    ARDE (ámbar, a plena intensidad, y le prende fuego al borde de abajo de la columna); el pedazo
//    que queda AFUERA se apaga a ceniza. La mancha del sur queda casi entera afuera → un rescoldo.
//    La mancha del oeste queda casi entera adentro → se enciende de punta a punta.
//    Es SUPERPOSICIÓN, no comparación: se ve que la que gana no es la más alta, es la que ENCAJA.
//
// ── CÓMO ESTÁ CONSTRUIDO ──────────────────────────────────────────────────────────────────────
// 1. EL MUNDO (atmósfera + soles + fondos a sangre + el riel de las horas) vive DENTRO de un único
//    contenedor recortado por LA APERTURA (`coverAt` → `clipOf`).
//    ⭐ EL GESTO DE APERTURA DE ESTE MOVIMIENTO — inédito en el video: **EL HAZ DE LAS HORAS**.
//    El hueco es la FRANJA DE LUZ que un sol bajo apoya a través de una ventana: dos bordes
//    PARALELOS e inclinados (nunca convergen, nunca hay vértice) que no se abren simétricamente:
//    LA FRANJA CAMINA por el cuadro a medida que avanza la hora, y se ensancha o se angosta según
//    qué borde va más rápido. No es una puerta ni una cuña: es una hora del día cruzando la pared.
//    Ninguna repite el gesto de los hermanos (bandas laterales, guillotina, telón, persiana,
//    escalonada, trapecio, visera, tronera, mordazas, obturador, trinquete, retirada radial, cuña
//    de sombra, escuadra en L):
//      W1 (96-222)    NACE Y CAMINA — nace como una rendija pegada al borde izquierdo (los dos
//                     bordes juntos en x=22); el DERECHO se dispara hasta 82 y el izquierdo apenas
//                     lo sigue. CIERRA con el borde IZQUIERDO acelerando hasta ALCANZAR al derecho:
//                     el haz se lo traga POR DETRÁS y sale de cuadro por la derecha.
//      W2 (470-596)   SE ACUESTA — abre casi vertical (−26°, angosto y de pie) y SE TUMBA hasta −7°
//                     mientras se ensancha: el sol bajando. CIERRA VOLCÁNDOSE al revés (slant hasta
//                     +21°) mientras los dos bordes se juntan: el haz se da vuelta y se apaga.
//      W3 (960-1048)  EL SNAP — abre de un golpe de 7 frames sobre "produce menos y me ahorra más",
//                     y CIERRA con el borde DERECHO caminando a la izquierda MÁS RÁPIDO que el
//                     izquierdo: se angosta DESDE ADELANTE (al revés que W1, que se angostó desde
//                     atrás). Dos cierres opuestos con la misma pieza.
//      W4 (1272-1382) ⭐ SE VA AL OESTE — abre lento (46 f), el más ancho de los cuatro, y NO se
//                     cierra: EL HAZ ENTERO CAMINA FUERA DE CUADRO POR LA DERECHA (cL 18 → 118).
//                     La luz se va al oeste y no vuelve. Es el gesto y la tesis en el mismo objeto.
// 2. EL PRIMER PLANO (tarjetas con material real, cifras, íconos, titulares) NO está recortado. Con
//    la apertura ABIERTA todo vive en x<24 % o x>76 % o por encima de y=36 %: la caja de la cara
//    (30-70 % · 10-90 %) queda DENTRO del hueco a cualquier altura y jamás la toca nada.
// 3. UNA sola cámara `camAt(g)`, función pura de g, con deriva viva. Ningún acto la reinicia: entra
//    con la grúa en +38 y el push en 1.16 que le dejó `MovS7Oeste` y sigue de largo.
//    UNA sola atmósfera, montada una vez para los 51 s.
// 4. LA MATERIA QUE CRUZA CADA FRONTERA es siempre un objeto: la hoja del vendedor, el vapor del
//    calentador, el marco de aluminio del panel que gira, la mancha de luz que sale por el riel, la
//    moneda de arriba de la pila, el dial del temporizador.
//
// ⭐ CÓMO SE LEE "−12% Y +19%" SIN ESCRIBIR UNA RESTA (acto 4): UNA SOLA HOJA, DOS BORDES.
//    El objeto es LA HOJA DEL VENDEDOR (foto real del cuaderno adentro de la tarjeta), la misma que
//    abrió el movimiento. No hay dos tarjetas ni dos columnas: hay UN papel al que le pasan dos
//    cosas opuestas AL MISMO TIEMPO. Por ARRIBA se le DESPRENDE una tira del 12% de su alto, con el
//    borde roto, y se va FRÍA hacia arriba y afuera (`flujo("cobran")`): eso es lo que el vendedor
//    le resta. Por ABAJO, la hoja no se acorta: le CRECEN 19 REBANADAS CÁLIDAS (una por punto de
//    factura, la unidad se declara una sola vez) que se apilan desde abajo (`flujo("queda")`) y
//    empujan su canto inferior hacia el piso, con la foto real de las dos pilas de monedas apoyada
//    encima. La misma hoja se hace más corta arriba y más rica abajo, en el mismo cuadro y en el
//    mismo segundo. La resta nunca se escribe: se DESPRENDE de un lado y SE APILA del otro.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⇐ ENTRA DESDE `MovS7Oeste` (la sombra de la chimenea / los dos paneles al sur):
//   cam {grúa +38, push 1.16, foco 52/60, LA DERIVA SIGUE ANDANDO — no se resetea}
//   luz {HORA.rasante 6°, ámbar, amb 0.70 — sol bajo casi horizontal desde la izquierda}
//   materia {LA LUZ NARANJA DE LAS 6 DE LA TARDE APOYADA EN LA MESADA}
//
// ACTO 1 · 0-352 · "LA ENERGÍA TOTAL NO ME IMPORTA"  protagonista: LA HOJA DEL VENDEDOR
//                                                     texto: NO ES MI ENERGÍA
//   entra  cam {grúa 38, push 1.16, foco 52/60}        luz {rasante 6°, ámbar, amb 0.70 (rampa 14 f)}
//          materia {el rectángulo naranja de las 6 apoyado en la mesada — la misma luz que entregó S7O}
//   sale   cam {grúa −16, push 1.09, foco 58/42}       luz {rasante 5°, ámbar, amb 0.74}
//          materia {LA HOJA DEL VENDEDOR — un rectángulo de papel liso con su número frío encima}
//   (costura INTERNA @249 ···· WIPE POR MATERIA: el VAPOR del calentador de agua — el aparato más
//    grande de su casa, el que de verdad se come la energía — cruza el cuadro de abajo hacia
//    arriba, ancho y lento, y detrás ya está el clip real de la pinza en el calentador. Materia
//    VAPOR (#D8D2C4), jamás el color del fondo. Cobertura ~86 % entre 252 y 262.)
//   ── FRONTERA A @352 ···· MATCH-SHAPE: la HOJA (papel liso, radio 8, sin grilla) se endurece:
//      le NACE LA GRILLA DE CELDAS (`PanelForm cells` 0,05 → 1), le baja el radio, crece de 470×640
//      a 1180×664 y ES EL PANEL que él está por girar. La piel de papel se REPINTA con un borde
//      DURO que viaja de izquierda a derecha con el especular montado encima: en cada frame hay una
//      línea neta entre las dos materias, nunca un fundido, y el objeto no suelta el cuadro.
//      ⭐ Y EL MUNDO se repinta con EL MISMO `sweep`: un solo filo cruza el cuadro entero, objeto y
//      fondo a la vez. No hay ningún corte de fondo. ·············································
// ACTO 2 · 352-615 · ⭐ "GIRÉ UNO DE LOS DOS AL OESTE"  protagonista: EL PANEL QUE GIRA
//                                                       texto: GIRÉ UNO AL OESTE
//   entra  cam {grúa −16 → 4, push 1.09 → 1.03, foco 58/42}   luz {rasante 5°, ámbar, amb 0.74}
//          materia {el panel entero de frente, la grilla de celdas recién nacida}
//   sale   cam {grúa 22, push 1.01, foco 46/54}        luz {rasante 4°, ámbar, amb 0.76}
//          materia {EL MARCO DE ALUMINIO DEL PANEL, el canto ardiendo naranja por el sol bajo}
//   (⭐ A PARTIR DE ACÁ SON DOS PERSONAJES DISTINTOS, y la diferencia se ve en la LUZ, no en un
//    rótulo: los dos paneles son dos `PanelForm` con su FOTO REAL adentro. El de la izquierda queda
//    de frente y el sol le apoya en el vidrio un rectángulo naranja ANCHO. El de la derecha GIRA
//    (rotateY 0 → −46°) y ese mismo rectángulo se le ACORTA — el vidrio recibe el sol de costado.
//    El 12 % no es un número flotando: es cuánto se angostó el charco de luz sobre el vidrio.)
//   ── FRONTERA B @615 ···· OCLUSIÓN: EL MARCO DE ALUMINIO del panel que acaba de girar pasa a tres
//      dedos del lente, de izquierda a derecha — aluminio anodizado con su chaflán, su ranura y el
//      canto superior ARDIENDO naranja por el sol bajo — y tapa el 100 % entre los frames 610 y
//      618. El acto cambia ADENTRO de esos 8 frames. El color es el del ALUMINIO (#B9BEC4), jamás
//      el del fondo. ··············································································
// ACTO 3 · 615-931 · ⭐⭐ "LAS 5, LAS 6 Y LAS 7"  protagonista: EL RIEL DE LAS HORAS
//                                                 texto: LAS 5, LAS 6 Y LAS 7
//   entra  cam {grúa 22 → −10, push 1.01 → 1.12, foco 46/54 → 50/46}   luz {rasante 4°, ámbar, 0.74}
//          materia {la casa al atardecer con las ventanas encendiéndose una tras otra (clip real)}
//   sale   cam {grúa 6, push 1.02, foco 44/52}         luz {rasante 4°, ámbar, amb 0.72}
//          materia {LA MANCHA DE LUZ DEL OESTE, ya deslizándose por el riel a −2,2 %/frame}
//   (⭐⭐ EL ACTO CENTRAL — LA COINCIDENCIA, explicada arriba. Contención total: NINGUNA ventana de
//    avatar en los 316 frames, el riel tiene el cuadro entero. La casa que se despierta baja FRÍA
//    DESDE ARRIBA y la luz que él produce está tumbada CÁLIDA SOBRE EL PISO: la ley de dirección
//    del video hace todo el trabajo semántico sin una sola palabra.)
//   (costura INTERNA @726 ···· CORTE EN EL BEAT sobre "mi casa pide 2000 vatios en lugar de 300".
//    LA BISAGRA es EL RIEL: las mismas horas, en la misma x, con el mismo cuerpo y la misma mancha
//    encima a los dos lados del corte durante 20 frames — abajo cambia el suelo, arriba no se movió
//    nada. Sumado al rótulo LAS SEIS DE LA TARDE, idéntico a ambos lados.)
//   ── FRONTERA C @931 ···· MATCH-MOVE: el riel entero con su mancha encendida sale por la IZQUIERDA
//      a −2,2 % de pantalla por frame y LA HOJA DEL VENDEDOR entra por la DERECHA pegada a su canto,
//      sobre el mismo riel y a la misma velocidad. No existe un solo frame de hueco: a los dos lados
//      del canto hay un objeto viajando a la misma velocidad y en la misma dirección. ············
// ACTO 4 · 931-1202 · ⭐ "MENOS Y ME AHORRA MÁS"  protagonista: LA HOJA, DOS BORDES
//                                                 texto: −12% ARRIBA · +19% ABAJO
//   entra  cam {grúa 6 → −14, push 1.02 → 1.06, foco 44/52 → 56/44}   luz {rasante 4°, ámbar, 0.74}
//          materia {la hoja del vendedor entrando por el riel}
//   sale   cam {grúa 4, push 1.14, foco 50/58 — la cámara YA está entrando en la moneda de arriba}
//          luz {rasante 5°, ámbar, amb 0.72}
//          materia {LA MONEDA DE ARRIBA DE LA PILA}
//   ── FRONTERA D @1202 ···· ZOOM-THROUGH: la cámara entra en la moneda de arriba de la pila
//      (fx 50 / fy 82) y sale del otro lado ya en el pasillo de la casa que se enciende. El clip del
//      pasillo se monta 20 frames ANTES, debajo: un zoom-through contra nada es un fundido a negro.
// ACTO 5 · 1202-1530 · "LOS CATÁLOGOS Y TU VIDA"  protagonista: EL CATÁLOGO CONTRA LA CASA
//                                                  texto: NO CON TU VIDA
//   entra  cam {saliendo del túnel, push 1.14 → 1.04, grúa 4 → −22, foco 50/58}
//          luz {rasante 5°, ámbar, amb 0.72 — el sol bajo entrando por la puerta del pasillo}
//          materia {la puerta de entrada y la luz del pasillo}
//   sale   cam {grúa 30, push 1.13, foco 34/54 — la deriva SIGUE andando hacia la izquierda}
//          luz {HORA.rasante 6°, ámbar, amb 0.70}
//          materia {EL DIAL DE UN TEMPORIZADOR DE ENCHUFE, en macro}
//   (costura INTERNA @1440 ···· MATCH-SHAPE: el rectángulo de la hoja del catálogo se ACUESTA en
//    escorzo, se le van las esquinas y su rectángulo se cierra en EL DISCO del dial del
//    temporizador de enchufe. El papel del vendedor se convierte en la perilla que sí manda.)
//
// ⇒ SALE HACIA el tramo de mover las cargas de hora (la lavadora a la una, el calentador de 11 a 1):
//   cam {encuadre de INTERIOR con los aparatos de la casa a la vista, cámara derivando a la IZQUIERDA}
//   luz {HORA.rasante 6°, ámbar, amb 0.70}
//   materia {EL DIAL DE UN TEMPORIZADOR DE ENCHUFE}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero blur grande full-screen · cero fade en
// ninguna frontera · dos fronteras seguidas nunca repiten costura · cero capa de color con opacidad
// sobre el avatar · TODA tarjeta flotante lleva FOTO o CLIP REAL adentro (`MediaCard`); el riel, la
// mancha de luz, la columna de horas y las rebanadas son GRÁFICA DE APOYO en registro sobre
// material real, nunca hacen de objeto: el panel, la hoja, la casa, las monedas y el temporizador
// van SIEMPRE con su foto o su clip.
// ⛔ Rutas LITERALES en el punto de uso: el build escanea este .tsx por TEXTO y una ruta armada por
// template literal no viaja en el tar → 404 → chunk muerto con un error que miente.
// ⚠️ Ningún `kind="video"` se monta más de 140 frames (los clips duran ~151 a 30 fps).
// ⛔ Ningún acto baja de amb 0.70 después del frame 14 (luma <25 = pantalla negra en el render).
// ⛔ ORDEN DE PINTADO: adentro de `Layers` manda el `translateZ` del `Plane`, NO el orden del DOM.
// Cada fondo de destino va MÁS LEJOS que el que se está yendo (−880 → −1020), y los cambios de
// fondo caen adentro de su cobertura: 352 (el sweep del match-shape), 615 (aluminio), 726 (corte en
// el beat), 931 (match-move), 1202 (zoom-through), 1440 (match-shape del dial).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rgba, rnd,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, PanelForm, zoomThrough, SunKey, HORA, flujo, Bed,
} from "./PanelStage";

// ── EL RELOJ DEL MOVIMIENTO (frames locales, 30 fps, anclados al ms de Whisper) ────────────────
const A2 = 352;    // 24638 · "Entonces giré uno de los dos al oeste."
const A3 = 615;    // 24901 · "Sigue dando fuerte a las 5, a las 6 y a las 7."
const A4 = 931;    // 25217 · "Ese panel produce menos y me ahorra más."
const A5 = 1202;   // 25488 · "Si tú estás todo el día afuera... mira al oeste."
const G_END = 1530;

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const es = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
const esOut = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.42, 0, 0.24, 1) });
const esSnap = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.08, 0.86, 0.2, 1) });

// LAS MATERIAS de las costuras. ⛔ Ninguna es el color del fondo.
const NARANJA = "#F0A24A";    // la luz de las 6 de la tarde (materia ENTRANTE del handoff)
const VAPOR = "#D8D2C4";      // el vapor del calentador de agua (costura interna @249)
const ALUMINIO = "#B9BEC4";   // el marco del panel que gira (frontera B)
const ANOD = "#7F868D";       // la ranura anodizada del mismo marco
const PAPEL = "#E7DFC9";      // la hoja del vendedor (el objeto que abre y cierra el movimiento)
const LATON = "#C9A227";      // el latón de las monedas (materia del zoom-through)

// ── EL RIEL DEL MATCH-MOVE @931 (la mancha se va, la hoja entra pegada a su canto) ────────────
const RAIL_V = -2.2;                                       // % de pantalla por frame
const railPct = (g: number) => Math.min(0, (g - 916) * RAIL_V);

// ══ LA APERTURA — ⭐ EL HAZ DE LAS HORAS ══════════════════════════════════════════════════════
// El hueco es la FRANJA DE LUZ que un sol bajo apoya a través de una ventana. Sus dos bordes son
// PARALELOS (misma inclinación `slant`, nunca convergen: no hay vértice, no es una cuña) y se
// describen por dónde cortan la MITAD del cuadro: `cL` y `cR`, en % de pantalla.
// La franja CAMINA (cL y cR se corren juntos), se ENSANCHA (se corren distinto) y SE ACUESTA
// (`slant`). `yT` es el canto plano de arriba, el dintel de la ventana por donde entra.
// La conversión respeta el aspecto: dx_px = dy_px · tan(ang) → dx% = dy% · (1080/1920) · tan.
type Cover = { cL: number; cR: number; slant: number; yT: number };
const CERRADO: Cover = { cL: 50, cR: 50, slant: -8, yT: 7 };
const AR = 1080 / 1920;
const tanDeg = (d: number) => Math.tan((d * Math.PI) / 180);
const edgeX = (c: Cover, y: number, side: -1 | 1) =>
  (side < 0 ? c.cL : c.cR) + (50 - y) * AR * tanDeg(c.slant);
const yTopOf = (c: Cover) => Math.max(0, c.yT);
const isOpen = (c: Cover) => c.yT < 96 && c.cR - c.cL > 1.4;

const coverAt = (g: number): Cover => {
  // W1 · NACE Y CAMINA (96-222). Nace como una rendija pegada al borde izquierdo: los dos bordes
  // juntos en x=22. El DERECHO se dispara y el izquierdo apenas lo sigue. Cierra con el IZQUIERDO
  // acelerando hasta ALCANZARLO: el haz se lo traga POR DETRÁS y se va por la derecha.
  if (g >= 96 && g < 224) {
    const abreR = esOut(clamp01((g - 96) / 42));
    const abreL = es(clamp01((g - 104) / 58));
    const traga = esSnap(clamp01((g - 176) / 46));
    const cR = lerp(lerp(22, 82, abreR), 88, traga);
    const cL = lerp(lerp(22, 22, abreL), 88, traga * traga);
    return { cL, cR, slant: lerp(-6, -9, abreL), yT: lerp(11, 5, abreL) };
  }
  // W2 · SE ACUESTA (436-566). Abre casi vertical y angosto (−26°, un haz "de pie") y SE TUMBA a
  // −7° mientras se ensancha: el sol bajando sobre la pared. Cierra VOLCÁNDOSE al revés (+21°)
  // mientras los dos bordes se juntan en 57: el haz se da vuelta y se apaga.
  if (g >= 470 && g < 600) {
    const tumba = es(clamp01((g - 470) / 54));
    const vuelca = esOut(clamp01((g - 524) / 74));
    const cL = lerp(lerp(44, 21, tumba), 57.2, vuelca);
    const cR = lerp(lerp(54, 83, tumba), 57.8, vuelca);
    return {
      cL, cR,
      slant: lerp(lerp(-26, -7, tumba), 21, vuelca),
      yT: lerp(lerp(14, 6, tumba), 9, vuelca),
    };
  }
  // W3 · EL SNAP (960-1048). Abre de un golpe angular de 7 frames sobre "produce menos y me ahorra
  // más". Cierra con el borde DERECHO caminando a la izquierda MÁS RÁPIDO que el izquierdo: se
  // angosta DESDE ADELANTE — exactamente al revés que W1, que se angostó desde atrás.
  if (g >= 960 && g < 1050) {
    const snap = esSnap(clamp01((g - 960) / 7));
    const frena = esOut(clamp01((g - 1014) / 34));
    const cL = lerp(lerp(50, 20, snap), 22, frena);
    const cR = lerp(lerp(50, 84, snap), 23, frena * frena);
    return { cL, cR, slant: lerp(-4, -8, snap) + frena * 5, yT: lerp(10, 5, snap) };
  }
  // W4 · ⭐ SE VA AL OESTE (1236-1352). Abre lento (46 f), el más ancho de los cuatro, y NO se
  // cierra: EL HAZ ENTERO CAMINA FUERA DE CUADRO POR LA DERECHA. La luz se va al oeste, no vuelve.
  if (g >= 1272 && g < 1384) {
    const abre = es(clamp01((g - 1272) / 46));
    const va = esOut(clamp01((g - 1346) / 38));
    const cL = lerp(lerp(34, 18, abre), 118, va);
    const cR = lerp(lerp(38, 86, abre), 176, va);
    return { cL, cR, slant: lerp(lerp(-14, -6, abre), -3, va), yT: lerp(12, 5, abre) };
  }
  return CERRADO;
};

const clipOf = (c: Cover) => {
  if (!isOpen(c)) return "inset(0px)";
  const yt = yTopOf(c);
  const tl = edgeX(c, yt, -1), tr = edgeX(c, yt, 1);
  const bl = edgeX(c, 100, -1), br = edgeX(c, 100, 1);
  return (
    `polygon(0% 0%, 100% 0%, 100% 100%, ${br.toFixed(2)}% 100%, ` +
    `${tr.toFixed(2)}% ${yt.toFixed(2)}%, ${tl.toFixed(2)}% ${yt.toFixed(2)}%, ` +
    `${bl.toFixed(2)}% 100%, 0% 100%)`
  );
};

// ── LOS CANTOS DEL HAZ. Todo el brillo sale HACIA AFUERA (hacia el mundo): ni un píxel de
//    gradiente se apoya sobre su cara. El sol está a la IZQUIERDA y casi horizontal, así que el
//    canto izquierdo ARDE naranja y el derecho es su lado de sombra. Bordes inclinados → SVG.
const CantosHaz: React.FC<{ c: Cover; hot: number }> = ({ c, hot }) => {
  const yt = yTopOf(c);
  const tl = edgeX(c, yt, -1) * 19.2, tr = edgeX(c, yt, 1) * 19.2;
  const bl = edgeX(c, 100, -1) * 19.2, br = edgeX(c, 100, 1) * 19.2;
  const ytp = yt * 10.8;
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <linearGradient id="s7sHazL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgba(V.ink0, 0.0)} />
          <stop offset="58%" stopColor={rgba(V.ink0, 0.46)} />
          <stop offset="100%" stopColor={rgba(NARANJA, 0.3 * hot)} />
        </linearGradient>
        <linearGradient id="s7sHazR" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor={rgba(V.ink0, 0.0)} />
          <stop offset="58%" stopColor={rgba(V.ink0, 0.54)} />
          <stop offset="100%" stopColor={rgba(V.amber, 0.11 * hot)} />
        </linearGradient>
        <linearGradient id="s7sHazTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(V.ink0, 0.5)} />
          <stop offset="100%" stopColor={rgba(V.bone, 0.0)} />
        </linearGradient>
      </defs>
      {/* la lamida de luz sobre cada canto, siempre HACIA AFUERA del hueco */}
      <polygon points={`${tl - 150},${ytp} ${tl},${ytp} ${bl},1080 ${bl - 150},1080`} fill="url(#s7sHazL)" />
      <polygon points={`${tr},${ytp} ${tr + 132},${ytp} ${br + 132},1080 ${br},1080`} fill="url(#s7sHazR)" />
      <polygon points={`${tl},${ytp - 96} ${tr},${ytp - 96} ${tr},${ytp} ${tl},${ytp}`} fill="url(#s7sHazTop)" />
      {/* los dos filos paralelos: la línea neta del borde de una franja de sol */}
      <line x1={tl} y1={ytp} x2={bl} y2={1080} stroke={rgba(NARANJA, 0.72 * hot)} strokeWidth={3.5} />
      <line x1={tr} y1={ytp} x2={br} y2={1080} stroke={rgba(V.bone, 0.44 * hot)} strokeWidth={2.5} />
      <line x1={tl} y1={ytp} x2={tr} y2={ytp} stroke={rgba(V.amber, 0.46 * hot)} strokeWidth={2} />
    </svg>
  );
};

// ── COSTURA INTERNA @249 · WIPE POR MATERIA — EL VAPOR DEL CALENTADOR ─────────────────────────
// El calentador de agua es el animal más grande de su casa: lo que de verdad se come la energía.
// Su vapor cruza de ABAJO hacia ARRIBA, ancho y lento (no es polvo: es más gordo y más suave), y
// detrás ya está el clip real de la pinza en el calentador. Materia VAPOR, jamás el color del fondo.
const VaporCalentador: React.FC<{ at: number; dur?: number }> = ({ at, dur = 46 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const tapa = clamp01(Math.sin(p * Math.PI) * 2.05 - 1.05);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 15 }, (_, i) => {
        const o = rnd(i * 5.9);
        const q = clamp01(p * 1.38 - o * 0.32);
        const y = lerp(128, -42, esOut(q));
        const w = 520 + o * 760;
        const h = 420 + rnd(i * 7.1) * 560;
        const x = 8 + rnd(i * 3.3) * 84 + q * (o - 0.5) * 22;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
            width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(VAPOR, 0.4 * Math.sin(clamp01(q) * Math.PI))} 0%, rgba(0,0,0,0) 68%)`,
          }} />
        );
      })}
      {/* las lenguas finas: el vapor tiene hebras, no es una nube lisa */}
      {Array.from({ length: 18 }, (_, i) => {
        const o = rnd(i * 9.7);
        const q = clamp01(p * 1.6 - o * 0.36);
        const y = lerp(122, -14, q);
        const x = 6 + rnd(i * 4.9) * 88;
        const h = 130 + o * 250;
        return (
          <div key={`h${i}`} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
            width: 16 + o * 26, height: h, marginTop: -h / 2, borderRadius: 40,
            transform: `rotate(${((o - 0.5) * 22).toFixed(1)}deg)`,
            background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba("#F2EEE4", 0.34 * Math.sin(clamp01(q) * Math.PI))}, rgba(0,0,0,0))`,
          }} />
        );
      })}
      {/* el instante de cobertura: el vapor llena el cuadro y ahí adentro cambia el suelo */}
      <AbsoluteFill style={{ background: rgba(VAPOR, 0.86 * tapa) }} />
    </AbsoluteFill>
  );
};

// ── FRONTERA B @615 · OCLUSIÓN — EL MARCO DE ALUMINIO DEL PANEL ────────────────────────────────
// El panel que acaba de girar pasa a tres dedos del lente: perfil de aluminio anodizado con su
// chaflán, su ranura longitudinal y el canto superior ARDIENDO naranja por el sol bajo. Cruza de
// IZQUIERDA a DERECHA (al revés que la chimenea del movimiento vecino) y tapa el 100 % entre 610 y
// 618. El color es el del ALUMINIO, jamás el del fondo: con el color del fondo esto es un fundido.
const OcluyeMarco: React.FC<{ at: number; dur?: number }> = ({ at, dur = 36 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(-224, 116, esOut(p));
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-24%", left: `${L.toFixed(2)}%`, width: "210%", height: "150%",
        transform: `rotate(${(-2.2 + p * 4.4).toFixed(2)}deg)`,
        background:
          `linear-gradient(174deg, #D6DBE0 0%, ${ALUMINIO} 18%, #9AA1A8 46%, ${ANOD} 74%, #616870 100%)`,
        boxShadow: `0 0 160px ${rgba(V.ink0, 0.9)}`,
        overflow: "hidden",
      }}>
        {/* el CEPILLADO del aluminio: lo que separa "perfil" de "rectángulo gris" */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.34,
          backgroundImage:
            `repeating-linear-gradient(178deg, ${rgba(V.white, 0.3)} 0px, ${rgba(V.white, 0.3)} 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 5px)`,
        }} />
        {/* la RANURA longitudinal del perfil, con su sombra propia */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "41%", height: 46,
          background: `linear-gradient(180deg, ${rgba(V.ink0, 0.62)} 0%, ${rgba(V.ink0, 0.3)} 46%, ${rgba(V.white, 0.22)} 100%)`,
        }} />
        {/* el CHAFLÁN superior ARDIENDO: la fuente concreta de la luz en este cuadro */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, height: 62,
          background: `linear-gradient(180deg, ${rgba(NARANJA, 0.96)} 0%, ${rgba(NARANJA, 0.3)} 44%, rgba(0,0,0,0) 100%)`,
        }} />
        {/* el borde de fuga y su sombra de contacto */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 190,
          background: `linear-gradient(270deg, ${rgba(V.ink0, 0.5)}, rgba(0,0,0,0))`,
        }} />
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 120,
          background: `linear-gradient(90deg, ${rgba(V.ink0, 0.42)}, rgba(0,0,0,0))`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ── TIPOGRAFÍA propia del movimiento (titular ≥48 px, detalle ≥30 px, cama oscura obligatoria) ──
const Rotulo: React.FC<{
  children: React.ReactNode; x: number; y: number; color?: string; size?: number; op?: number;
  align?: "left" | "center" | "right"; g?: number;
}> = ({ children, x, y, color = V.bone, size = 34, op = 1, align = "center", g = 0 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    transform: `translate(${align === "left" ? "0%" : align === "right" ? "-100%" : "-50%"},-50%) ` +
      `translateY(${(Math.sin(g / 61 + x) * 1.8).toFixed(2)}px)`,
    opacity: op,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 3.2, color,
    textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.95)",
  }}>{children}</div>
);

// cartel que ATERRIZA (nada arranca de cero: entra con desplazamiento y escala, y respira)
const Cartel: React.FC<{
  g: number; at: number; out: number; x: number; y: number; size?: number; color?: string;
  children: React.ReactNode;
}> = ({ g, at, out, x, y, size = 54, color = V.white, children }) => {
  const inP = es(clamp01((g - at) / 15));
  const outP = clamp01((g - out) / 16);
  if (g < at || outP >= 1) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translateY(${((1 - inP) * 30 + outP * 24 + Math.sin(g / 55) * 2.2).toFixed(1)}px) ` +
        `scale(${(0.93 + 0.07 * inP - outP * 0.05).toFixed(3)})`,
      opacity: Math.min(1, inP * 1.7) * (1 - outP),
    }}>
      <Bed pad={20}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 1.6, color,
          textTransform: "uppercase", lineHeight: 1.06, whiteSpace: "nowrap",
          textShadow: "0 5px 22px rgba(0,0,0,0.95)",
        }}>{children}</div>
      </Bed>
    </div>
  );
};

// MediaCard tiene deriva propia (hold VIVO). Lo que se apoya ENCIMA tiene que derivar igual o la
// gráfica patina sobre el material.
const mcSync = (cf: number, x: number, y: number): React.CSSProperties => ({
  transform: `rotateY(${(Math.sin(cf / 67 + y) * 0.5).toFixed(3)}deg) translateY(${(Math.sin(cf / 41 + x) * 2.4).toFixed(2)}px)`,
});

// ══ ACTO 3 · ⭐⭐ EL RIEL DE LAS HORAS — LA COINCIDENCIA ═══════════════════════════════════════
// UN SOLO EJE: las horas, de las 10 de la mañana a las 8 de la noche, tumbado sobre el suelo del
// material real. Encima NO hay barras: hay UNA MANCHA DE LUZ — lo que el sol apoya sobre el vidrio
// del panel — tumbada a lo largo de las horas como un charco.
//   · `corre` 0→1: UNA COPIA de esa mancha SE DESPEGA y CAMINA hacia la derecha (13:12 → 15:30) y
//     por el camino pierde el 12 % de su cuerpo (área ∝ alto × ancho: 24,9×2,60 / 30,0×2,45 = 0,88).
//     La otra se queda donde estaba: es el panel que siguió mirando al sur. UNA forma se vuelve DOS
//     por movimiento propio, no por aparecer al lado.
//   · `cortina` 0→1: LA CASA SE DESPIERTA. Desde ARRIBA y en FRÍO (ley de dirección del video: lo
//     que te cobran) baja una COLUMNA que ocupa de las 5 a las 8 de la tarde y aterriza sobre el
//     riel. Adentro lleva material REAL (la tarjeta con el clip de las ventanas encendiéndose).
//   · `enciende` 0→1: ⭐ LA COINCIDENCIA. El pedazo de mancha que queda DEBAJO de la columna ARDE
//     a plena intensidad y le prende fuego al canto de abajo de la columna; el que queda AFUERA se
//     apaga a CENIZA. Misma ley para las dos manchas. La del sur queda casi entera afuera → un
//     rescoldo. La del oeste queda casi entera adentro → arde de punta a punta.
// ⛔ Es GRÁFICA DE APOYO en registro sobre material real: el suelo, la casa y la pinza son siempre
//    su foto o su clip. La gráfica jamás hace de objeto.
const H0 = 10, H1 = 20;              // el riel va de las 10 de la mañana a las 8 de la noche
const RX0 = 9, RX1 = 91;             // en % de pantalla
const BASE_Y = 78;                   // el piso del riel, en % de pantalla
const DESP_H0 = 16.8, DESP_H1 = 20;  // las horas en que la casa está despierta
const hx = (h: number) => RX0 + ((h - H0) / (H1 - H0)) * (RX1 - RX0);
const bell = (h: number, mu: number, sig: number) => Math.exp(-((h - mu) * (h - mu)) / (2 * sig * sig));
// la mancha del SUR (fija) y la del OESTE (la misma, corrida y con 12 % menos de cuerpo)
const SUR = { mu: 13.2, sig: 2.45, peak: 30.0 };
const OES = { mu: 15.5, sig: 2.60, peak: 24.9 };
const manchaPath = (mu: number, sig: number, peak: number) => {
  const pts: string[] = [];
  for (let h = H0; h <= H1 + 1e-6; h += 0.2) {
    pts.push(`${(hx(h) * 19.2).toFixed(1)},${((BASE_Y - peak * bell(h, mu, sig)) * 10.8).toFixed(1)}`);
  }
  return `M ${(hx(H0) * 19.2).toFixed(1)},${(BASE_Y * 10.8).toFixed(1)} L ${pts.join(" L ")} ` +
    `L ${(hx(H1) * 19.2).toFixed(1)},${(BASE_Y * 10.8).toFixed(1)} Z`;
};

const RielTarde: React.FC<{
  g: number; at: number; corre: number; cortina: number; enciende: number; op: number;
}> = ({ g, at, corre, cortina, enciende, op }) => {
  if (op <= 0.005) return null;
  const dibuja = es(clamp01((g - at) / 46));
  const X0 = hx(H0) * 19.2, X1 = hx(H1) * 19.2, YB = BASE_Y * 10.8;
  const dx = hx(DESP_H0) * 19.2, dw = (hx(DESP_H1) - hx(DESP_H0)) * 19.2;
  const dyB = YB * cortina;                       // el canto de abajo de la columna, bajando
  const pSur = manchaPath(SUR.mu, SUR.sig, SUR.peak);
  const pOes = manchaPath(
    lerp(SUR.mu, OES.mu, corre), lerp(SUR.sig, OES.sig, corre), lerp(SUR.peak, OES.peak, corre),
  );
  // el latido de la brasa: hold VIVO, nada perfectamente quieto
  const brasa = 0.9 + Math.sin(g / 23) * 0.1;
  const horas = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const rotulados: { h: number; t: string; big?: boolean }[] = [
    { h: 12, t: "12" }, { h: 14, t: "2" }, { h: 16, t: "4" },
    { h: 17, t: "5", big: true }, { h: 18, t: "6", big: true }, { h: 19, t: "7", big: true },
  ];
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: op }}>
      <defs>
        {/* la luz tumbada: más brillante donde toca la superficie, se apaga hacia arriba */}
        <linearGradient id="s7sArde" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(V.amber, 0.1)} />
          <stop offset="62%" stopColor={rgba(NARANJA, 0.5)} />
          <stop offset="100%" stopColor={rgba(NARANJA, 0.94)} />
        </linearGradient>
        <linearGradient id="s7sCeniza" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba("#6B675C", 0.06)} />
          <stop offset="100%" stopColor={rgba("#8C877A", 0.3)} />
        </linearGradient>
        {/* la casa despierta: frío que BAJA (lo que te cobran entra desde arriba) */}
        <linearGradient id="s7sDesp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(V.sky, 0.34)} />
          <stop offset="72%" stopColor={rgba(V.sky, 0.13)} />
          <stop offset="100%" stopColor={rgba(V.sky, 0.05)} />
        </linearGradient>
        <clipPath id="s7sDentro"><rect x={dx} y={0} width={dw} height={1080} /></clipPath>
        <clipPath id="s7sColumna"><rect x={dx} y={0} width={dw} height={Math.max(0, dyB)} /></clipPath>
      </defs>

      {/* ── LA COLUMNA DE LAS HORAS DESPIERTAS: baja desde arriba, en frío, y aterriza en el riel */}
      {cortina > 0.004 && (
        <g clipPath="url(#s7sColumna)">
          <rect x={dx} y={0} width={dw} height={1080} fill="url(#s7sDesp)" />
          <rect x={dx} y={0} width={3} height={1080} fill={rgba(V.sky, 0.5)} />
          <rect x={dx + dw - 3} y={0} width={3} height={1080} fill={rgba(V.sky, 0.5)} />
          {/* el canto de abajo de la columna, viniendo */}
          <rect x={dx} y={Math.max(0, dyB - 5)} width={dw} height={5} fill={rgba(V.sky, 0.78)} />
        </g>
      )}

      {/* ── LAS DOS MANCHAS EN CENIZA (todo lo que cae AFUERA de las horas despiertas) ────────── */}
      <g opacity={dibuja}>
        <path d={pSur} fill="url(#s7sCeniza)" />
        <path d={pSur} fill="none" stroke={rgba("#9A9384", 0.5)} strokeWidth={2.5} />
        {corre > 0.02 && (
          <>
            <path d={pOes} fill="url(#s7sCeniza)" />
            <path d={pOes} fill="none" stroke={rgba("#B0A894", 0.6)} strokeWidth={2.5} />
          </>
        )}
      </g>

      {/* ── ⭐ LA COINCIDENCIA: sólo el pedazo que cae DEBAJO de la columna ARDE ──────────────── */}
      {enciende > 0.004 && (
        <g clipPath="url(#s7sDentro)" opacity={enciende * brasa}>
          <path d={pSur} fill="url(#s7sArde)" style={{ mixBlendMode: "screen" }} />
          <path d={pOes} fill="url(#s7sArde)" style={{ mixBlendMode: "screen" }} />
          <path d={pOes} fill="none" stroke={rgba(NARANJA, 0.95)} strokeWidth={4} />
          {/* la columna se prende fuego DESDE ABAJO, ahí donde la mancha la toca */}
          <rect x={dx} y={YB - 250} width={dw} height={250}
            fill={rgba(NARANJA, 0.16)} style={{ mixBlendMode: "screen" }} />
        </g>
      )}

      {/* ── EL RIEL: la línea de las horas sobre el suelo, con sus marcas ─────────────────────── */}
      <g opacity={dibuja}>
        <line x1={X0} y1={YB} x2={lerp(X0, X1, dibuja)} y2={YB}
          stroke={rgba(V.bone, 0.82)} strokeWidth={4} />
        {horas.map((h) => {
          const X = hx(h) * 19.2;
          if (X > lerp(X0, X1, dibuja) + 4) return null;
          const noche = h >= DESP_H0;
          return (
            <rect key={h} x={X - 2} y={YB} width={4} height={noche ? 30 : 18}
              fill={rgba(noche ? V.amber : V.bone, noche ? 0.9 : 0.5)} />
          );
        })}
        {rotulados.map((r) => {
          const X = hx(r.h) * 19.2;
          if (X > lerp(X0, X1, dibuja) + 4) return null;
          const enc = r.big ? clamp01((g - at - 96 - (r.h - 17) * 26) / 12) : 1;
          return (
            <text key={r.h} x={X} y={YB + (r.big ? 88 : 68)} textAnchor="middle"
              fontFamily={F_DISPLAY} fontWeight={700}
              fontSize={r.big ? 54 : 34}
              fill={r.big ? rgba(V.amber, 0.35 + 0.65 * enc) : rgba(V.bone, 0.64)}
              style={{ letterSpacing: 2 }}>{r.t}</text>
          );
        })}
        <text x={X0} y={YB + 68} textAnchor="start" fontFamily={F_DISPLAY} fontWeight={700}
          fontSize={32} fill={rgba(V.bone, 0.52)} style={{ letterSpacing: 3 }}>MAÑANA</text>
        <text x={X1} y={YB + 68} textAnchor="end" fontFamily={F_DISPLAY} fontWeight={700}
          fontSize={32} fill={rgba(V.amber, 0.62)} style={{ letterSpacing: 3 }}>NOCHE</text>
      </g>
    </svg>
  );
};

// ══ ACTO 4 · ⭐ LA MISMA HOJA, DOS BORDES ═════════════════════════════════════════════════════
// No hay dos tarjetas ni dos columnas: hay UN papel (la foto real del cuaderno adentro) al que le
// pasan dos cosas opuestas AL MISMO TIEMPO. Arriba se le DESPRENDE el 12 % y se va FRÍO hacia
// arriba (lo que te resta el vendedor). Abajo le CRECEN 19 REBANADAS CÁLIDAS (una por punto de
// factura) que se apilan DESDE ABAJO y empujan su canto contra el piso (lo que te queda).

// LA TIRA QUE SE DESPRENDE — 12 % del alto de la hoja, con el borde ROTO (no es un corte limpio:
// es papel arrancado). Se va con la ley de dirección de lo que TE COBRAN: arriba y en frío.
const TiraDesprendida: React.FC<{
  g: number; at: number; x: number; y: number; w: number; h: number;
}> = ({ g, at, x, y, w, h }) => {
  const t = clamp01((g - at) / 62);
  if (t <= 0) return null;
  const f = flujo("cobran", 1 - es(t));            // e=1 → pegada · e=0 → ya se fue arriba
  const th = h * 0.12;
  // el borde roto: una tira de dientes irregulares, deterministas (`rnd`, nunca Math.random)
  const dientes: string[] = ["0% 0%", "100% 0%", "100% 76%"];
  for (let i = 12; i >= 0; i--) {
    dientes.push(`${(i / 12) * 100}% ${(70 + rnd(i * 6.1) * 26).toFixed(1)}%`);
  }
  dientes.push("0% 74%");
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w, height: th, marginLeft: -w / 2, marginTop: -h / 2 - th * 0.06,
      transform: `translateY(${f.dy.toFixed(1)}px) translateX(${(-f.dy * 0.42).toFixed(1)}px) ` +
        `rotate(${(-es(t) * 13).toFixed(2)}deg) scale(${(1 - es(t) * 0.1).toFixed(3)})`,
      opacity: f.opacity * 0.35 + 0.65 * clamp01(1 - (t - 0.72) / 0.28),
      clipPath: `polygon(${dientes.join(", ")})`,
      background: `linear-gradient(178deg, ${PAPEL} 0%, #CFC6AE 62%, #A79E88 100%)`,
      boxShadow: `0 10px 30px ${rgba(V.ink0, 0.7)}`,
    }}>
      {/* la lamida FRÍA que la marca como "lo que te cobran" */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, ${rgba(V.sky, 0.5)} 0%, rgba(0,0,0,0) 100%)`,
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, height: 3,
        background: rgba(V.sky, 0.85), boxShadow: `0 0 22px ${f.glow}`,
      }} />
    </div>
  );
};

// LAS 19 REBANADAS — una por punto de factura. La unidad se declara UNA sola vez y no se vuelve a
// nombrar. Llegan DESDE ABAJO y en CÁLIDO (lo que TE QUEDA) y empujan el canto de la hoja al piso.
const N_REB = 19;
const RebanadasFactura: React.FC<{
  g: number; at: number; x: number; y: number; w: number; h: number;
}> = ({ g, at, x, y, w, h }) => {
  const rh = h * 0.01;                               // cada punto = 1 % del alto de la hoja
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 0, height: 0 }}>
      {Array.from({ length: N_REB }, (_, i) => {
        const t = clamp01((g - at - i * 3) / 16);
        if (t <= 0) return null;
        const f = flujo("queda", t);
        const anch = w * (0.98 - i * 0.006);
        return (
          <div key={i} style={{
            position: "absolute",
            left: -anch / 2, top: h / 2 + i * rh,
            width: anch, height: rh - 1.2,
            transform: `translateY(${f.dy.toFixed(1)}px)`,
            opacity: f.opacity,
            background: `linear-gradient(90deg, ${rgba(NARANJA, 0.62)} 0%, ${rgba(V.amber, 0.95)} 42%, ${rgba(NARANJA, 0.6)} 100%)`,
            boxShadow: `0 0 ${(10 + rh).toFixed(0)}px ${rgba(V.amber, 0.3)}`,
            borderRadius: 2,
          }} />
        );
      })}
    </div>
  );
};

// ── LA CÁMARA · una sola función de g, con deriva viva, que NUNCA vuelve a cero ────────────────
// Entra con la grúa en +38 y el push en 1.16 que dejó `MovS7Oeste`, y sigue de largo.
// panX POSITIVO = el mundo viaja a la derecha = la cámara deriva hacia la IZQUIERDA (handoff).
const KF = [0, 96, 222, 352, 470, 596, 615, 726, 820, 931, 1015, 1100, 1202, 1300, 1393, 1460, G_END];
const camAt = (g: number) => {
  const base = gcam(g, { z0: 150, z1: 340, panX: 118, panY: -22, ry: -2.6, rx: -1.0, dur: G_END });
  const crane = interpolate(
    g, KF,
    [38, 24, 6, -16, 4, 12, 22, -10, 4, 6, -14, -2, 4, -22, -6, 16, 30],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  const push = interpolate(
    g, KF,
    [1.16, 1.06, 1.02, 1.09, 1.03, 1.01, 1.01, 1.12, 1.05, 1.02, 1.06, 1.10, 1.14, 1.04, 1.02, 1.07, 1.13],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) },
  );
  const FK = [0, 222, 352, 596, 615, 726, 931, 1015, 1202, 1393, G_END];
  const fx = interpolate(g, FK, [52, 44, 58, 46, 46, 50, 44, 56, 50, 40, 34], CL);
  const fy = interpolate(g, FK, [60, 48, 42, 54, 54, 46, 52, 44, 58, 46, 54], CL);
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(4)})`
  );
};

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovS7Sur: React.FC<{ acto?: number; gFrame?: number }> = ({ gFrame }) => {
  const cf = useCurrentFrame();
  const g = gFrame === undefined ? cf : gFrame;
  const toCF = (t: number) => cf - g + t;   // pasa un frame mío al reloj de las primitivas del Stage

  // ── LA LUZ: función continua de g. TODO el tramo es TARDE RASANTE — sol bajo casi horizontal
  //    entrando desde la izquierda, el mismo que `MovS7Oeste` dejó apoyado en la mesada. Nunca
  //    baja de amb 0.70 después del frame 14 (luma <25 = pantalla negra en el render), y su fuente
  //    está siempre EN el cuadro: el canto ardiendo del marco, el reflejo naranja corriendo por el
  //    vidrio, las ventanas amarillas encendiéndose una tras otra. ────────────────────────────
  const LK = [0, 14, 96, 222, 352, 470, 615, 726, 931, 1015, 1202, 1393, G_END];
  const sunAng = interpolate(g, LK,
    [HORA.rasante.ang, 6, 6, 5, 5, 4, 4, 3, 4, 4, 5, 5, HORA.rasante.ang], CL);
  const amb = interpolate(g, LK,
    [HORA.rasante.amb, 0.72, 0.74, 0.72, 0.74, 0.76, 0.74, 0.70, 0.72, 0.74, 0.72, 0.76, HORA.rasante.amb], CL);
  // los tres soles: cálido (la tarde que te queda) · frío (lo que te cobran) · blanco (el aire)
  const warmW = interpolate(g, LK,
    [0.90, 0.90, 0.88, 0.86, 0.84, 0.88, 0.90, 0.94, 0.86, 0.84, 0.88, 0.92, 0.90], CL);
  const coldW = interpolate(g, LK,
    [0.14, 0.16, 0.22, 0.26, 0.20, 0.18, 0.28, 0.34, 0.24, 0.30, 0.20, 0.16, 0.14], CL);
  const dayW = interpolate(g, LK,
    [0.26, 0.26, 0.28, 0.30, 0.32, 0.30, 0.28, 0.26, 0.30, 0.28, 0.26, 0.24, 0.22], CL);
  const coolMix = interpolate(g, LK,
    [0.06, 0.06, 0.10, 0.14, 0.10, 0.08, 0.16, 0.22, 0.12, 0.18, 0.10, 0.08, 0.06], CL);
  const keyFrom = interpolate(g, LK,
    [0.12, 0.12, 0.16, 0.22, 0.18, 0.14, 0.24, 0.30, 0.20, 0.26, 0.18, 0.14, 0.10], CL);
  const inten = interpolate(g, LK,
    [0.84, 0.86, 0.92, 0.96, 0.94, 0.98, 0.96, 0.92, 0.94, 0.96, 0.94, 0.98, 0.90], CL);
  const floorDim = interpolate(g, LK,
    [0.64, 0.62, 0.58, 0.56, 0.54, 0.56, 0.58, 0.60, 0.56, 0.54, 0.58, 0.56, 0.60], CL);

  const cam = camAt(g);
  const cov = coverAt(g);
  const abierta = isOpen(cov);
  const clip = clipOf(cov);
  const cantoHot = abierta ? clamp01((cov.cR - cov.cL) / 42) : 0;

  // ── FRONTERA A @352 · MATCH-SHAPE: la HOJA se endurece y ES EL PANEL ────────────────────────
  // El mismo objeto de punta a punta: la piel de papel se repinta con un borde DURO (`sweep`) que
  // cruza el objeto Y EL FONDO a la vez. Nunca un fundido: en cada frame hay una línea neta.
  const EO = { ...CL, easing: Easing.bezier(0.3, 0, 0.24, 1) };
  const pw = interpolate(g, [262, 336, 398, 440, 476, 590], [470, 470, 1180, 620, 420, 520], EO);
  const ph = interpolate(g, [262, 336, 398, 440, 476, 590], [640, 640, 664, 380, 258, 318], EO);
  const px = interpolate(g, [262, 336, 398, 440, 476, 600, 615], [50, 50, 50, 30, 11, 18, 34], EO);
  const py = interpolate(g, [262, 336, 398, 440, 476, 590], [50, 50, 50, 52, 46, 50], EO);
  const cells = interpolate(g, [336, 346, 392], [0.05, 0.05, 1], CL);
  const radio = interpolate(g, [336, 398], [8, 3], CL);
  const sweep = clamp01((g - 344) / 56);        // el filo duro que repinta objeto y mundo a la vez
  const verObj = g >= 262 && g < 620;

  // ── ACTO 2 · el panel de la DERECHA gira al oeste. Los dos personajes se separan en la LUZ:
  //    el charco naranja se le VA del vidrio al del sur y se le QUEDA al del oeste. ────────────
  const entraDer = es(clamp01((g - 386) / 46));
  const gira = es(clamp01((g - 402) / 64));
  const tarde = es(clamp01((g - 424) / 70));     // el sol sigue bajando: el charco se corre
  const pxDer = interpolate(g, [386, 430, 476, 600, 615], [118, 71, 90, 84, 70], EO);
  const pwDer = interpolate(g, [386, 430, 476, 590, 615], [620, 620, 420, 520, 980], EO);
  const phDer = interpolate(g, [386, 430, 476, 590, 615], [380, 380, 258, 318, 600], EO);

  // ── ACTO 3 · ⭐⭐ EL RIEL. `corre` despega la copia · `cortina` despierta la casa ·
  //    `enciende` es LA COINCIDENCIA · `pide` es el 300 → 2000 que la casa empieza a pedir. ────
  const corre = es(clamp01((g - 648) / 76));
  const cortina = esOut(clamp01((g - 704) / 44));
  const enciende = es(clamp01((g - 758) / 42));
  const pide = es(clamp01((g - 748) / 104));
  const vatios = Math.round(lerp(300, 2000, pide) / 10) * 10;

  // ── ACTO 4 · LA MISMA HOJA, DOS BORDES ──────────────────────────────────────────────────────
  const hx4 = interpolate(g, [916, 962, 1044, 1082], [185, 85, 85, 50], EO);
  const hw4 = interpolate(g, [916, 962, 1044, 1082], [286, 286, 286, 480], EO);
  const hh4 = interpolate(g, [916, 962, 1044, 1082], [386, 386, 386, 600], EO);
  const hy4 = interpolate(g, [916, 962, 1044, 1082], [50, 50, 50, 44], EO);

  // ── FRONTERA D @1202 · ZOOM-THROUGH por la moneda de arriba de la pila ──────────────────────
  const zw = g >= 1192 && g < 1228 ? zoomThrough(g, 1192, 32, 50, 82) : null;
  const zs: React.CSSProperties = zw
    ? { transform: zw.out, opacity: zw.opacity, transformStyle: "preserve-3d" }
    : { transformStyle: "preserve-3d" };

  // ── ACTO 5 · el MATCH-SHAPE interno @1440: la hoja del catálogo se acuesta y ES el DISCO del
  //    dial del temporizador. El mundo nuevo se revela por el RIM del disco creciendo (borde
  //    duro circular, jamás un fundido). ────────────────────────────────────────────────────────
  const dial = es(clamp01((g - 1440) / 46));
  const rimR = lerp(0, 160, es(clamp01((g - 1444) / 54)));

  // ── MOUNTS. Cada fondo de destino va MÁS LEJOS que el que se está yendo, y todo cambio de
  //    fondo cae ADENTRO de la cobertura de su costura. ⚠️ ningún `kind="video"` pasa de 140 f.
  const bgMesada = g < 268;                     // z −880 · handoff: la luz de las 6 en la mesada
  const bgCalentador = g >= 240 && g < 372;     // z −900 · 132 f · ADENTRO del vapor (252-262)
  const bgGira = g >= 344 && g < 478;           // z −920 · 134 f · se revela con el MISMO `sweep`
  const bgRasante = g >= 470 && g < 624;        // z −940 · foto
  const bgVentanas = g >= 608 && g < 742;       // z −960 · 134 f · ADENTRO del aluminio (611-620)
  const bgCasaTarde = g >= 726 && g < 968;      // z −980 · foto · entra en el CORTE EN EL BEAT
  const bgHoja = g >= 916 && g < 1082;          // z −1000 · foto · llega POR EL RIEL del match-move
  const bgMonedas = g >= 1062 && g < 1196;      // z −1020 · 134 f
  const bgPasillo = g >= 1182 && g < 1316;      // z −1040 · 134 f · montado 20 f ANTES del túnel
  const bgInterior = g >= 1300 && g < 1452;     // z −1060 · foto
  const bgDial = g >= 1440;                     // z −1080 · foto · se revela por el RIM del disco

  return (
    <AbsoluteFill>
      {/* ════ EL MUNDO — todo lo que puede tapar al avatar vive acá dentro, y ESTO es lo único que
          EL HAZ recorta. Ni un solo píxel de estas capas llega nunca a su cara. ════ */}
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {/* la atmósfera se monta UNA vez para los 51 s: nunca se remonta entre actos */}
        <VoltAtmos
          tint={light(coolMix, "amber", "sky")} tint2={V.amber}
          keyFrom={keyFrom} intensity={inten} floor={floorDim}
        />
        {/* el SOL es un personaje: acá entra BAJO y CASI HORIZONTAL por la IZQUIERDA */}
        <SunKey ang={sunAng} temp="amber" amb={warmW * amb} soft={72} />
        <SunKey ang={68} temp="sky" amb={coldW * amb * 0.7} soft={88} />
        <SunKey ang={sunAng} temp="white" amb={dayW * amb * 0.66} soft={92} />

        <Layers cam={cam}>
          {/* ── ACTO 1a · LA MESADA. Materia ENTRANTE del handoff: la luz naranja de las 6 ──── */}
          {bgMesada && (
            <Plane z={-880}>
              <PhotoPlane src="img/cmepanel30/cmep30_s8_herramientas_cargando_mesada.png" kind="photo"
                z={0}
                scale={interpolate(g, [0, 130, 268], [1.3, 1.2, 1.26], CL)}
                dim={interpolate(g, [0, 60, 190, 268], [0.4, 0.32, 0.42, 0.48], CL)} tint={V.amber} />
              {/* EL RECTÁNGULO NARANJA DE LAS 6 apoyado en la mesada: la misma luz que entregó
                  `MovS7Oeste`, en la misma superficie. Se retira a medida que avanza el acto. */}
              <div style={{
                position: "absolute", left: "40%", top: "66%", width: 960, height: 96,
                marginLeft: -480, marginTop: -48,
                transform: `rotate(-3.4deg) skewX(-26deg) translateX(${(-g * 0.16).toFixed(1)}px) ` +
                  `translateY(${(Math.sin(g / 57) * 2).toFixed(2)}px)`,
                background:
                  `linear-gradient(94deg, rgba(0,0,0,0) 0%, ${rgba(NARANJA, 0.46)} 14%, ` +
                  `${rgba(NARANJA, 0.7)} 50%, ${rgba(NARANJA, 0.4)} 86%, rgba(0,0,0,0) 100%)`,
                boxShadow: `0 0 120px ${rgba(NARANJA, 0.3)}`,
                mixBlendMode: "screen",
                opacity: clamp01(1 - (g - 150) / 110),
              }} />
            </Plane>
          )}
          {/* ── ACTO 1b · EL CALENTADOR: lo que su casa SE COME de verdad. Entra ADENTRO del
              vapor (costura interna @249). ────────────────────────────────────────────────── */}
          {bgCalentador && (
            <Plane z={-900}>
              <PhotoPlane src="broll/cmepanel30/cmep30_s8_clip_claudio_calentador_pinza.mp4" kind="video"
                z={0} startFrom={0}
                scale={interpolate(g, [240, 372], [1.26, 1.16], CL)}
                dim={interpolate(g, [240, 280, 372], [0.44, 0.34, 0.44], CL)} tint={V.amber} />
            </Plane>
          )}
          {/* ── ACTO 2 · EL PATIO DONDE GIRA EL PANEL. ⭐ Se revela con EL MISMO `sweep` que
              repinta el objeto: UN SOLO FILO cruza el cuadro entero, objeto y fondo a la vez. */}
          {bgGira && (
            <Plane z={-920}>
              <div style={{
                position: "absolute", inset: 0, overflow: "hidden",
                clipPath: `inset(0% ${((1 - sweep) * 100).toFixed(2)}% 0% 0%)`,
              }}>
                <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_claudio_gira_panel_oeste.mp4" kind="video"
                  z={0} startFrom={0}
                  scale={interpolate(g, [344, 478], [1.24, 1.16], CL)}
                  dim={interpolate(g, [344, 400, 478], [0.46, 0.36, 0.44], CL)} tint={V.amber} />
              </div>
              {/* el filo del `sweep`, la línea neta entre las dos materias */}
              {sweep > 0.001 && sweep < 0.999 && (
                <div style={{
                  position: "absolute", top: 0, bottom: 0, left: `${(sweep * 100).toFixed(2)}%`,
                  width: 5, marginLeft: -2.5,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(NARANJA, 0.95)}, rgba(0,0,0,0))`,
                  boxShadow: `0 0 40px ${rgba(NARANJA, 0.7)}`,
                }} />
              )}
            </Plane>
          )}
          {bgRasante && (
            <Plane z={-940}>
              <PhotoPlane src="img/cmepanel30/cmep30_s7_claudio_sol_rasante_costado.png" kind="photo"
                z={0}
                scale={interpolate(g, [470, 624], [1.28, 1.18], CL)}
                dim={interpolate(g, [470, 520, 624], [0.46, 0.36, 0.46], CL)} tint={V.amber} />
            </Plane>
          )}

          {/* ══ ACTO 3 · EL RIEL DE LAS HORAS. Todo el acto viaja en UN contenedor: en el frame
              916 ese contenedor arranca a salir por la izquierda (MATCH-MOVE de la frontera C) y
              la hoja entra por la derecha pegada a su canto, sobre el mismo riel. ══════════ */}
          {(bgVentanas || bgCasaTarde) && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${railPct(g).toFixed(2)}%)` }}>
              {bgVentanas && (
                <Plane z={-960}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_ventanas_casa_se_encienden.mp4" kind="video"
                    z={0} startFrom={0}
                    scale={interpolate(g, [608, 742], [1.26, 1.17], CL)}
                    dim={interpolate(g, [608, 660, 742], [0.5, 0.42, 0.5], CL)} tint={V.amber} />
                </Plane>
              )}
              {bgCasaTarde && (
                <Plane z={-980}>
                  <PhotoPlane src="img/cmepanel30/cmep30_s7_casa_ventanas_encendidas_tarde.png" kind="photo"
                    z={0}
                    scale={interpolate(g, [726, 968], [1.24, 1.16], CL)}
                    dim={interpolate(g, [726, 800, 968], [0.5, 0.44, 0.52], CL)} tint={V.amber} />
                </Plane>
              )}
              {/* ⭐⭐ LA COINCIDENCIA. Gráfica de APOYO en registro sobre el suelo del material
                  real: el riel se apoya en la calle de la foto, no flota. */}
              {g >= 622 && g < 1000 && (
                <Plane z={-260}>
                  <RielTarde g={g} at={628} corre={corre} cortina={cortina} enciende={enciende}
                    op={clamp01((g - 622) / 14)} />
                </Plane>
              )}
            </div>
          )}

          {/* ── ACTO 4 · LA MESA CON LA HOJA. Entra por la DERECHA pegada al canto del riel que se
              va: los dos embaldosan el cuadro, no hay un solo frame de hueco. ──────────────── */}
          {bgHoja && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${(100 + railPct(g)).toFixed(2)}%)` }}>
              <Plane z={-1000}>
                <PhotoPlane src="img/cmepanel30/cmep30_s8_claudio_cuaderno_mesa_tarde.png" kind="photo"
                  z={0}
                  scale={interpolate(g, [916, 1082], [1.26, 1.16], CL)}
                  dim={interpolate(g, [916, 1000, 1082], [0.5, 0.42, 0.5], CL)} tint={V.amber} />
              </Plane>
            </div>
          )}
          {bgMonedas && (
            <Plane z={-1020} style={zs}>
              <PhotoPlane src="broll/cmepanel30/cmep30_s8_clip_monedas_sombras_largas.mp4" kind="video"
                z={0} startFrom={0}
                scale={interpolate(g, [1062, 1196], [1.24, 1.15], CL)}
                dim={interpolate(g, [1062, 1120, 1196], [0.48, 0.4, 0.48], CL)} tint={V.amber} />
            </Plane>
          )}
          {/* ── ACTO 5 · EL PASILLO. Montado 20 f ANTES del túnel: un zoom-through contra nada es
              un fundido a negro. ─────────────────────────────────────────────────────────── */}
          {bgPasillo && (
            <Plane z={-1040}>
              <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_puerta_entrada_luz_pasillo.mp4" kind="video"
                z={0} startFrom={0}
                scale={interpolate(g, [1182, 1316], [1.3, 1.18], CL)}
                dim={interpolate(g, [1182, 1240, 1316], [0.5, 0.4, 0.48], CL)} tint={V.amber} />
            </Plane>
          )}
          {bgInterior && (
            <Plane z={-1060}>
              <PhotoPlane src="img/cmepanel30/cmep30_s8_claudio_temporizador_enchufe.png" kind="photo"
                z={0}
                scale={interpolate(g, [1300, 1452], [1.26, 1.16], CL)}
                dim={interpolate(g, [1300, 1370, 1452], [0.48, 0.4, 0.48], CL)} tint={V.amber} />
            </Plane>
          )}
          {/* el mundo nuevo se abre por el RIM DEL DISCO creciendo: borde duro circular, parte del
              MATCH-SHAPE de la hoja que se cierra en el dial. ⛔ jamás un fundido. */}
          {bgDial && (
            <Plane z={-1080}>
              <div style={{
                position: "absolute", inset: 0, overflow: "hidden",
                clipPath: `circle(${rimR.toFixed(1)}% at 50% 52%)`,
              }}>
                <PhotoPlane src="img/cmepanel30/cmep30_s8_macro_temporizador_barato.png" kind="photo"
                  z={0}
                  scale={interpolate(g, [1440, G_END], [1.3, 1.17], CL)}
                  dim={interpolate(g, [1440, 1490, G_END], [0.46, 0.38, 0.46], CL)} tint={V.amber} />
              </div>
            </Plane>
          )}
        </Layers>
      </AbsoluteFill>

      {/* los cantos del HAZ: todo el brillo sale HACIA AFUERA, ni un píxel sobre su cara */}
      {abierta && <CantosHaz c={cov} hot={cantoHot} />}

      {/* ════ EL PRIMER PLANO — NO está recortado. Con el haz ABIERTO todo vive en x<24 % o
          x>76 %: la caja de la cara (30-70 % · 10-90 %) jamás la toca nada. ════ */}
      <Layers cam={cam}>
        {/* ── ACTO 1 · LA HOJA DEL VENDEDOR. Entra al centro, se corre a la banda izquierda cuando
            el haz abre, y VUELVE al centro tapada por el vapor. Es el MISMO objeto que en el frame
            352 se endurece y se vuelve el panel. ──────────────────────────────────────────── */}
        {g >= 24 && g < 268 && (() => {
          const ent = es(clamp01((g - 24) / 22));
          const hx1 = interpolate(g, [24, 92, 114, 252], [44, 44, 16, 16], EO);
          const hw1 = interpolate(g, [24, 92, 114, 252], [470, 470, 300, 300], EO);
          const hh1 = interpolate(g, [24, 92, 114, 252], [640, 640, 410, 410], EO);
          return (
            <Plane z={180}>
              <MediaCard src="img/cmepanel30/cmep30_s8_claudio_cuaderno_mesa_tarde.png" kind="photo"
                w={hw1} h={hh1} x={hx1} y={50 + (1 - ent) * 6} z={0}
                ry={lerp(11, 3, ent)} rx={-2} lit={0.9} litColor={V.amber}
                label="LA HOJA DEL VENDEDOR" sheenAt={toCF(58)} radius={10} opacity={ent} />
            </Plane>
          );
        })()}
        {/* el número que el vendedor te vende: ENERGÍA TOTAL. Entra desde ARRIBA y en FRÍO. */}
        {g >= 112 && g < 240 && (() => {
          const f = flujo("cobran", clamp01((g - 112) / 24));
          const sale = clamp01(1 - (g - 218) / 20);
          return (
            <Plane z={225}>
              <div style={{ transform: `translateY(${f.dy.toFixed(1)}px)`, opacity: f.opacity * sale }}>
                <Readout value="142" unit="kWh" label="ENERGÍA TOTAL DEL MES" at={toCF(120)}
                  x={87} y={30} size={112} color={V.sky} />
                <IconPng src="img/cmepanel30/cmep30_ic_calculadora.png" x={87} y={51} size={112}
                  z={0} opacity={0.9} rot={-5} glow={V.ink0} />
                <Rotulo g={g} x={97} y={64} size={50} color={V.white} align="right">NO ES</Rotulo>
                <Rotulo g={g} x={97} y={72} size={50} color={V.sky} align="right">MI ENERGÍA</Rotulo>
              </div>
            </Plane>
          );
        })()}
        {/* "la energía que mi casa se come" — el calentador, el animal más grande de la casa */}
        <Plane z={240}>
          <Cartel g={g} at={262} out={332} x={50} y={20} size={58} color={V.white}>
            LA QUE <span style={{ color: V.amber }}>MI CASA SE COME</span>
          </Cartel>
        </Plane>
        {g >= 278 && g < 350 && (() => {
          const f = flujo("queda", clamp01((g - 278) / 22));
          const sale = clamp01(1 - (g - 330) / 18);
          return (
            <Plane z={214}>
              <div style={{ transform: `translateY(${f.dy.toFixed(1)}px)`, opacity: f.opacity * sale }}>
                <IconPng src="img/cmepanel30/cmep30_ic_calentador.png" x={85} y={62} size={124}
                  z={0} opacity={0.94} rot={4} glow={V.ink0} />
                <Rotulo g={g} x={50} y={86} size={36} color={rgba(V.bone, 0.96)}>
                  EL APARATO MÁS GRANDE
                </Rotulo>
              </div>
            </Plane>
          );
        })()}

        {/* ── ⭐ EL OBJETO QUE CRUZA LA FRONTERA A: la HOJA se endurece y ES EL PANEL. Un solo
            objeto, dos materias REALES adentro, y un filo duro que repinta de una a la otra. */}
        {verObj && (
          <Plane z={200}>
            <div style={{
              position: "absolute", left: `${px.toFixed(2)}%`, top: `${py.toFixed(2)}%`,
              width: pw, height: ph, marginLeft: -pw / 2, marginTop: -ph / 2,
              transformStyle: "preserve-3d",
              transform: `rotateY(${lerp(6, -5, clamp01((g - 336) / 90)).toFixed(2)}deg) ` +
                `translateY(${(Math.sin(g / 47) * 2.6).toFixed(2)}px)`,
            }}>
              <PanelForm w={pw} h={ph} cells={cells} tint="#0E1A2B" style={{ borderRadius: radio }}>
                <MediaCard src="img/cmepanel30/cmep30_s7_claudio_gira_panel_oeste.png" kind="photo"
                  w={Math.max(20, pw - 16)} h={Math.max(20, ph - 16)} x={50} y={50} z={0}
                  lit={0.92} litColor={V.amber} grade={false} radius={4} />
                {/* EL CHARCO NARANJA sobre el vidrio: al que quedó AL SUR se le VA del vidrio */}
                <div style={{
                  position: "absolute", left: `${lerp(26, -32, tarde).toFixed(1)}%`, top: "26%",
                  width: "46%", height: "40%", transform: "skewX(-24deg)",
                  background: `linear-gradient(96deg, rgba(0,0,0,0), ${rgba(NARANJA, 0.72)} 46%, rgba(0,0,0,0))`,
                  mixBlendMode: "screen",
                }} />
              </PanelForm>
              {/* la PIEL DE PAPEL, con su material real adentro, repintada por el filo del `sweep` */}
              {sweep < 0.999 && (
                <div style={{
                  position: "absolute", inset: 0, overflow: "hidden",
                  clipPath: `inset(0% 0% 0% ${(sweep * 100).toFixed(2)}%)`,
                }}>
                  <MediaCard src="img/cmepanel30/cmep30_s8_claudio_cuaderno_mesa_tarde.png" kind="photo"
                    w={pw} h={ph} x={50} y={50} z={0} lit={0.9} litColor={V.amber}
                    grade={false} radius={radio} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(178deg, ${rgba(PAPEL, 0.34)}, rgba(0,0,0,0) 60%)`,
                  }} />
                </div>
              )}
            </div>
          </Plane>
        )}
        {/* ── ACTO 2 · EL SEGUNDO PANEL: el que GIRA al oeste. A partir de acá son dos personajes,
            y la diferencia se ve en la LUZ: a éste el charco NO se le va del vidrio. ───────── */}
        {g >= 386 && g < 620 && (
          <Plane z={206}>
            <div style={{
              position: "absolute", left: `${pxDer.toFixed(2)}%`, top: `${(py - 2).toFixed(2)}%`,
              width: pwDer, height: phDer, marginLeft: -pwDer / 2, marginTop: -phDer / 2,
              transformStyle: "preserve-3d",
              transform: `rotateY(${lerp(2, -46, gira).toFixed(2)}deg) ` +
                `translateY(${(Math.sin(g / 43 + 2) * 2.6).toFixed(2)}px)`,
              opacity: entraDer,
            }}>
              <PanelForm w={pwDer} h={phDer} cells={1} tint="#0E1A2B" style={{ borderRadius: 3 }}>
                <MediaCard src="img/cmepanel30/cmep30_s7_claudio_sol_rasante_costado.png" kind="photo"
                  w={Math.max(20, pwDer - 16)} h={Math.max(20, phDer - 16)} x={50} y={50} z={0}
                  lit={1} litColor={V.amber} grade={false} radius={4} />
                <div style={{
                  position: "absolute", left: "24%", top: "24%", width: "44%", height: "44%",
                  transform: "skewX(-24deg)",
                  background: `linear-gradient(96deg, rgba(0,0,0,0), ${rgba(NARANJA, 0.5 + 0.42 * tarde)} 46%, rgba(0,0,0,0))`,
                  boxShadow: `0 0 ${(40 + 90 * tarde).toFixed(0)}px ${rgba(NARANJA, 0.36 * tarde)}`,
                  mixBlendMode: "screen",
                }} />
              </PanelForm>
            </div>
          </Plane>
        )}
        <Plane z={244}>
          <Cartel g={g} at={358} out={428} x={50} y={18} size={62} color={V.white}>
            GIRÉ UNO <span style={{ color: V.amber }}>AL OESTE</span>
          </Cartel>
        </Plane>
        {/* los rótulos de los dos personajes, siempre en las bandas mientras el haz está abierto */}
        {g >= 444 && g < 606 && (() => {
          const en = clamp01((g - 444) / 16) * clamp01(1 - (g - 590) / 16);
          const f = flujo("cobran", clamp01((g - 450) / 26));
          return (
            <Plane z={232}>
              <div style={{ opacity: en }}>
                <Rotulo g={g} x={11} y={66} size={44} color={rgba(V.bone, 0.96)}>AL SUR</Rotulo>
                <Rotulo g={g} x={90} y={66} size={44} color={V.amber}>AL OESTE</Rotulo>
                <div style={{ transform: `translateY(${f.dy.toFixed(1)}px)`, opacity: f.opacity }}>
                  <Readout value="−12" unit="%" label="EN TOTAL" at={toCF(452)}
                    x={90} y={80} size={92} color={V.sky} />
                </div>
                <Rotulo g={g} x={90} y={20} size={48} color={V.amber}>PERO MÁS TARDE</Rotulo>
                <IconPng src="img/cmepanel30/cmep30_ic_sol.png" x={11} y={22} size={104} z={0}
                  opacity={0.9} rot={-6} glow={V.ink0} />
              </div>
            </Plane>
          );
        })()}

        {/* ══ ACTO 3 · las piezas de material REAL que viven sobre el riel ══════════════════ */}
        <Plane z={248}>
          <Cartel g={g} at={626} out={698} x={50} y={16} size={62} color={V.white}>
            LAS 5, LAS 6 Y <span style={{ color: V.amber }}>LAS 7</span>
          </Cartel>
        </Plane>
        {/* LA CASA DESPIERTA, con material real ADENTRO de la columna fría */}
        {g >= 700 && g < 830 && (
          <Plane z={196}>
            <MediaCard src="broll/cmepanel30/cmep30_s7_clip_ventanas_casa_se_encienden.mp4" kind="video"
              w={360} h={216} x={77.8} y={lerp(16, 24, es(clamp01((g - 700) / 26)))} z={0}
              ry={-9} rx={2} lit={0.9} litColor={V.sky}
              label="SE ENCIENDE TODO" sheenAt={toCF(742)} radius={10}
              opacity={clamp01((g - 700) / 14) * clamp01(1 - (g - 812) / 18)} startFrom={0} />
          </Plane>
        )}
        {g >= 706 && g < 800 && (
          <Plane z={250}>
            {/* ⭐ LA BISAGRA DEL CORTE EN EL BEAT @726: misma x, misma y, mismo cuerpo a los dos
                lados del corte durante 20 frames antes y 30 después. Abajo cambia el suelo. */}
            <Rotulo g={g} x={50} y={24} size={54} color={V.white}
              op={clamp01((g - 706) / 8) * clamp01(1 - (g - 782) / 16)}>
              LAS <span style={{ color: NARANJA }}>SEIS DE LA TARDE</span>
            </Rotulo>
          </Plane>
        )}
        {/* lo que la casa PIDE: cálido y desde abajo (lo que se come), dentro de la columna */}
        {g >= 748 && g < 940 && (() => {
          const f = flujo("queda", clamp01((g - 748) / 24));
          const sale = clamp01(1 - (g - 912) / 22);
          return (
            <Plane z={238}>
              <div style={{
                transform: `translateY(${f.dy.toFixed(1)}px) translateX(${railPct(g).toFixed(2)}%)`,
                opacity: f.opacity * sale,
              }}>
                <Readout value={String(vatios)} unit="W" label="MI CASA PIDE" at={toCF(754)}
                  x={77.8} y={44} size={104} color={V.amber} />
                <Rotulo g={g} x={77.8} y={55} size={32} color={rgba(V.bone, 0.86)}>ANTES PEDÍA 300</Rotulo>
                <IconPng src="img/cmepanel30/cmep30_ic_bombillanoche.png" x={92} y={44} size={92}
                  z={0} opacity={0.8} rot={6} glow={V.ink0} />
              </div>
            </Plane>
          );
        })()}
        {g >= 792 && g < 918 && (
          <Plane z={190}>
            <MediaCard src="broll/cmepanel30/cmep30_s7_clip_pinza_sube_dos_mil.mp4" kind="video"
              w={380} h={228} x={17} y={30} z={0} ry={12} rx={-2} lit={1} litColor={V.amber}
              label="LA PINZA A LAS SIETE" sheenAt={toCF(842)} radius={10} startFrom={0}
              opacity={clamp01((g - 792) / 14) * clamp01(1 - (g - 900) / 18)} />
          </Plane>
        )}

        {/* ══ ACTO 4 · ⭐ LA MISMA HOJA, DOS BORDES. Entra por el riel del match-move. ═══════ */}
        {g >= 916 && g < 1216 && (
          <Plane z={204} style={zs}>
            <MediaCard src="img/cmepanel30/cmep30_s8_claudio_cuaderno_mesa_tarde.png" kind="photo"
              w={hw4} h={hh4} x={hx4} y={hy4} z={0}
              ry={lerp(10, 2, clamp01((g - 1044) / 44))} rx={-2} lit={0.94} litColor={V.amber}
              label="LA HOJA DEL VENDEDOR" sheenAt={toCF(1096)} radius={10}
              opacity={clamp01(1 - (g - 1196) / 24)} />
            {/* la tira del 12 % que SE DESPRENDE por arriba: fría, se va y no vuelve */}
            <div style={mcSync(cf, hx4, hy4)}>
              <TiraDesprendida g={g} at={1015} x={hx4} y={hy4} w={hw4} h={hh4} />
              {/* las 19 rebanadas que le CRECEN por abajo: cálidas, llegan desde el piso */}
              {g >= 1082 && <RebanadasFactura g={g} at={1082} x={hx4} y={hy4} w={hw4} h={hh4} />}
            </div>
            {/* la foto REAL de las dos pilas, apoyada encima de lo que se apiló */}
            {g >= 1104 && (
              <MediaCard src="img/cmepanel30/cmep30_s8_dos_pilas_monedas.png" kind="photo"
                w={300} h={170} x={50} y={81} z={40} ry={-6} rx={4} lit={1} litColor={LATON}
                sheenAt={toCF(1146)} radius={8}
                opacity={clamp01((g - 1104) / 16) * clamp01(1 - (g - 1196) / 24)} />
            )}
          </Plane>
        )}
        {g >= 940 && g < 1044 && (
          <Plane z={246}>
            <div style={{ opacity: clamp01((g - 940) / 14) * clamp01(1 - (g - 1026) / 18) }}>
              <Rotulo g={g} x={3} y={30} size={54} color={V.white} align="left">PRODUCE</Rotulo>
              <Rotulo g={g} x={3} y={39} size={54} color={V.sky} align="left">MENOS</Rotulo>
              <Rotulo g={g} x={3} y={50} size={54} color={V.amber} align="left">AHORRA MÁS</Rotulo>
            </div>
          </Plane>
        )}
        {g >= 1015 && g < 1200 && (() => {
          const fc = flujo("cobran", clamp01((g - 1018) / 24));
          const fq = flujo("queda", clamp01((g - 1096) / 26));
          const sale = clamp01(1 - (g - 1180) / 20);
          const enFrio = clamp01((g - 1015) / 14);
          return (
            <Plane z={242} style={zs}>
              <div style={{ transform: `translateY(${fc.dy.toFixed(1)}px)`, opacity: fc.opacity * enFrio * sale }}>
                <Readout value="−12" unit="%" label="EN LA HOJA DEL VENDEDOR" at={toCF(1022)}
                  x={g < 1052 ? 85 : 79} y={g < 1052 ? 18 : 20} size={98} color={V.sky} />
              </div>
              {g >= 1096 && (
                <div style={{ transform: `translateY(${fq.dy.toFixed(1)}px)`, opacity: fq.opacity * sale }}>
                  <Readout value="+19" unit="%" label="EN MI FACTURA" at={toCF(1102)}
                    x={19} y={60} size={104} color={V.amber} />
                  <Rotulo g={g} x={19} y={72} size={32} color={rgba(V.bone, 0.9)}>UNA REBANADA = UN PUNTO</Rotulo>
                  <IconPng src="img/cmepanel30/cmep30_ic_billete.png" x={19} y={77} size={98}
                    z={0} opacity={0.9} rot={-4} glow={V.ink0} />
                </div>
              )}
            </Plane>
          );
        })()}
        <Plane z={252}>
          <Cartel g={g} at={1124} out={1170} x={50} y={16} size={58} color={V.white}>
            <span style={{ color: V.amber }}>EL MISMO PANEL</span>
          </Cartel>
        </Plane>

        {/* ══ ACTO 5 · LOS CATÁLOGOS Y TU VIDA ═════════════════════════════════════════════ */}
        <Plane z={250}>
          <Cartel g={g} at={1208} out={1252} x={50} y={20} size={62} color={V.white}>
            MIRA <span style={{ color: V.amber }}>AL OESTE</span>
          </Cartel>
        </Plane>
        {g >= 1280 && g < 1392 && (
          <Plane z={236}>
            <div style={{ opacity: clamp01((g - 1280) / 14) * clamp01(1 - (g - 1370) / 20) }}>
              <Rotulo g={g} x={3} y={26} size={56} color={V.white} align="left">TODO EL DÍA</Rotulo>
              <Rotulo g={g} x={3} y={35} size={56} color={V.amber} align="left">AFUERA</Rotulo>
              <Rotulo g={g} x={97} y={62} size={46} color={rgba(V.bone, 0.96)} align="right">NADIE TE LO</Rotulo>
              <Rotulo g={g} x={97} y={70} size={46} color={V.sky} align="right">VA A DECIR</Rotulo>
            </div>
          </Plane>
        )}
        {g >= 1290 && g < 1404 && (
          <Plane z={188}>
            <MediaCard src="img/cmepanel30/cmep30_s8_calentador_agua_garaje.png" kind="photo"
              w={340} h={204} x={12} y={62} z={0} ry={14} rx={-3} lit={0.96} litColor={V.amber}
              label="EL CALENTADOR" sheenAt={toCF(1338)} radius={10}
              opacity={clamp01((g - 1290) / 14) * clamp01(1 - (g - 1386) / 18)} />
          </Plane>
        )}
        {g >= 1316 && g < 1436 && (
          <Plane z={186}>
            <MediaCard src="broll/cmepanel30/cmep30_s8_clip_telefonos_cargando_mediodia.mp4" kind="video"
              w={340} h={204} x={88} y={30} z={0} ry={-14} rx={-3} lit={0.96} litColor={V.amber}
              label="LOS TELÉFONOS" sheenAt={toCF(1364)} radius={10} startFrom={0}
              opacity={clamp01((g - 1316) / 14) * clamp01(1 - (g - 1418) / 18)} />
          </Plane>
        )}
        {g >= 1420 && (
          <Plane z={184}>
            <MediaCard src="img/cmepanel30/cmep30_s8_lavadora_sol_mediodia.png" kind="photo"
              w={320} h={192} x={15} y={72} z={0} ry={15} rx={-3} lit={0.94} litColor={V.amber}
              label="LA LAVADORA" sheenAt={toCF(1468)} radius={10}
              opacity={clamp01((g - 1420) / 16)} />
          </Plane>
        )}
        {/* ⭐ EL REMATE, con la ley de dirección aplicada a la frase: LO QUE TE VENDEN entra desde
            ARRIBA y en FRÍO · TU VIDA entra desde ABAJO y en CÁLIDO. Aire y escala. */}
        {g >= 1396 && (() => {
          const fc = flujo("cobran", clamp01((g - 1408) / 26));
          const fq = flujo("queda", clamp01((g - 1428) / 28));
          return (
            <Plane z={254}>
              <Rotulo g={g} x={50} y={15} size={52} color={rgba(V.bone, 0.96)}
                op={clamp01((g - 1396) / 14)}>LOS CATÁLOGOS SE HACEN</Rotulo>
              <div style={{ transform: `translateY(${fc.dy.toFixed(1)}px)`, opacity: fc.opacity }}>
                <Rotulo g={g} x={50} y={25} size={72} color={V.sky}>CON LA ENERGÍA TOTAL</Rotulo>
              </div>
              <div style={{ transform: `translateY(${fq.dy.toFixed(1)}px)`, opacity: fq.opacity }}>
                <Rotulo g={g} x={50} y={87} size={86} color={V.amber}>NO CON TU VIDA</Rotulo>
              </div>
            </Plane>
          );
        })()}
        {/* ── COSTURA INTERNA @1440 · MATCH-SHAPE: la hoja del catálogo se ACUESTA y su rectángulo
            se cierra en EL DISCO del dial. El papel del vendedor se vuelve la perilla que sí manda,
            y el mundo nuevo entra por el RIM del disco creciendo. ⛔ jamás un fundido. ────── */}
        {g >= 1362 && (() => {
          const w5 = lerp(520, 340, dial), h5 = lerp(660, 340, dial);
          const ent = clamp01((g - 1362) / 20);
          return (
            <Plane z={208}>
              <div style={{
                position: "absolute", left: "50%", top: `${lerp(46, 52, dial).toFixed(2)}%`,
                width: w5, height: h5, marginLeft: -w5 / 2, marginTop: -h5 / 2,
                transformStyle: "preserve-3d",
                transform: `rotateX(${lerp(-2, 26, dial).toFixed(2)}deg) rotate(${lerp(-3, 0, dial).toFixed(2)}deg) ` +
                  `translateY(${(Math.sin(g / 51) * 2.4).toFixed(2)}px)`,
                opacity: ent,
              }}>
                <MediaCard src="img/cmepanel30/cmep30_s8_claudio_cuaderno_mesa_tarde.png" kind="photo"
                  w={w5} h={h5} x={50} y={50} z={0} lit={0.94} litColor={V.amber}
                  radius={lerp(10, h5 / 2, dial)} sheenAt={toCF(1404)} label={dial < 0.4 ? "EL CATÁLOGO" : undefined} />
                {/* EL RIM del dial y sus marcas: la materia que le entrego al tramo siguiente */}
                {dial > 0.02 && (
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    border: `${(4 + 8 * dial).toFixed(1)}px solid ${rgba(ALUMINIO, 0.5 + 0.45 * dial)}`,
                    boxShadow: `0 0 ${(30 + 60 * dial).toFixed(0)}px ${rgba(NARANJA, 0.3 * dial)}, inset 0 0 40px ${rgba(V.ink0, 0.6)}`,
                    opacity: dial,
                  }} />
                )}
                {dial > 0.35 && Array.from({ length: 24 }, (_, i) => {
                  const a = (i / 24) * 360;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: "50%", top: "50%", width: 3, height: h5 / 2 - 10,
                      marginLeft: -1.5, transformOrigin: "50% 100%",
                      transform: `rotate(${a}deg) translateY(-${h5 / 2 - 10}px)`,
                      opacity: (dial - 0.35) / 0.65,
                    }}>
                      <div style={{
                        position: "absolute", top: 0, left: 0, width: 3, height: i % 6 === 0 ? 22 : 12,
                        background: rgba(i % 6 === 0 ? V.amber : V.bone, 0.8),
                      }} />
                    </div>
                  );
                })}
              </div>
              {dial > 0.35 && (
                <Rotulo g={g} x={50} y={72} size={34} color={rgba(V.bone, 0.94)}
                  op={clamp01((dial - 0.35) / 0.3)}>UN TEMPORIZADOR DE ENCHUFE</Rotulo>
              )}
            </Plane>
          );
        })()}
      </Layers>

      {/* ════ LAS COSTURAS, siempre por encima de todo ════════════════════════════════════════
          @249   · WIPE POR MATERIA (interna) — el vapor del calentador, cobertura 252-262.
          A @352 · MATCH-SHAPE  — vive adentro del objeto y del `sweep` del mundo: nada acá.
          B @615 · OCLUSIÓN     — el marco de aluminio tapa el 100 % entre 610 y 618.
          @726   · CORTE EN EL BEAT (interna) — la bisagra es el riel + el rótulo: nada acá.
          C @931 · MATCH-MOVE   — vive en `railPct`: nada acá.
          D @1202· ZOOM-THROUGH — vive en `zs` sobre la pila de monedas: nada acá.
          @1440  · MATCH-SHAPE (interna) — el disco del dial y su rim: nada acá. */}
      <VaporCalentador at={230} dur={46} />
      <OcluyeMarco at={592} dur={44} />

      {/* el aire de la tarde: polen bajo cruzado por el sol casi horizontal desde la izquierda.
          NUNCA se apoya sobre su cara (opacidad ínfima y partículas de 2,4 px: no es un scrim). */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.4 }}>
        {Array.from({ length: 12 }, (_, i) => {
          const o = rnd(i * 7.3);
          const xx = ((rnd(i * 4.1) * 108 + (g * (0.1 + o * 0.24)) / 9) % 112) - 6;
          const yy = 26 + rnd(i * 2.3) * 64 + Math.sin(g / (52 + o * 40) + i) * 3.4;
          return (
            <div key={i} style={{
              position: "absolute", left: `${xx.toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
              width: 2.4, height: 2.4, borderRadius: "50%",
              background: rgba(V.amber, 0.2 + o * 0.24),
            }} />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

