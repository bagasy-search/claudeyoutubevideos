// MovS11Numeros.tsx — MOVIMIENTO S11 · "LOS TRES NÚMEROS QUE TIENES QUE ANOTAR HOY"
// Video `cmepanel30` (Claudio Mendoza Constructor, ES). 4 actos · 0 → 1775 frames @30 = 59,17 s.
// Tramo global 36760 → 38535 (frame local = global − 36760). Se monta ENCIMA del avatar real.
//
// ⛔⛔ REQUISITO ESTRUCTURAL — ESTE MOVIMIENTO TAPA UN SALTO DEL VIDEO DE FONDO.
//     El mp4 del avatar dura 10:22 y el audio 24:15, así que va EN BUCLE: en el frame global
//     37379 (LOCAL 619) vuelve a cero y Claudio cambia de pose de golpe. Por eso los frames
//     LOCALES 604 → 694 (±1,5 s del salto) van a PANTALLA COMPLETA OPACA: sin ventanas, sin
//     huecos, sin transparencia. La opacidad está garantizada por CUATRO capas independientes,
//     ninguna de las cuales depende de las otras (ver §OPACIDAD más abajo).
//     El salto cae justo entre el número 1 y el número 2, o sea en una frontera natural, y se
//     usa como tal: ahí adentro vive la FRONTERA B (oclusión por la hoja de papel).
//
// ⛔ Y ADEMÁS: acá el avatar está EN BUCLE y su lipsync NO coincide con la voz. Es FONDO, nunca
//    plano. Las cuatro ventanas suman 384 de 1775 frames y ninguna pasa de 96 f (3,20 s); todas
//    abren a partir del 63-64 % de altura, así que se le ven EL BANCO, EL TORSO Y LAS MANOS y
//    NUNCA la boca. ⛔ Ninguna capa de color con opacidad sobre su cara: las ventanas son
//    GEOMETRÍA (`clip-path`) y el brillo de los cantos sale SIEMPRE hacia afuera, hacia el mundo.
//
// ── ⭐ EL GESTO NUEVO DE APERTURA: **EL RENGLÓN Y LA GOMA** ────────────────────────────────────
//    Los hermanos ya usaron bandas laterales, guillotina, telón, persiana, escalonada, trapecio,
//    visera, tronera, mordazas con overshoot, hueco rectangular con obturador, trinquete
//    horizontal, retirada radial, cuña de sombra, escuadra en L, ventana que viaja, tres clics y
//    volteo de formato. Éste es otro, y es el gesto que ESTE movimiento necesitaba:
//      1. EL TRAZO — el hueco nace como una raya finísima pegada al borde inferior (97,4 % de
//         altura) que se DIBUJA de punta a punta a VELOCIDAD CONSTANTE, como un lápiz rayando un
//         renglón. Al final hay el levantón del lápiz: un overshoot de 3,4 % que vuelve.
//      2. EL RENGLÓN SE ABRE — el papel de arriba se levanta desde la raya y el renglón se vuelve
//         el espacio de la fila: el techo sube de 97,4 % a 63-64 % con un snap.
//      3. HOLD VIVO — el techo respira ±0,34 % (nada queda quieto).
//      4. LA GOMA — el techo vuelve a caer a la raya y después el trazo se BORRA al revés, de
//         punta a punta y también a velocidad constante: una goma que pasa por encima.
//    W1 y W3 se escriben de izquierda a derecha; W2 y W4 al revés (y por lo tanto se borran al
//    revés también). Ningún hermano abre con una raya que se escribe y se borra.
//
// ── ⭐⭐ CÓMO SE EVITA QUE LOS TRES NÚMEROS SE LEAN COMO TRES TARJETAS NUMERADAS ───────────────
//    Es el riesgo de este tramo y se ataca por tres lados, ninguno tipográfico:
//    (1) EL ORDINAL NO ES UNA INSIGNIA, ES UN TRAZO DE LÁPIZ. No existe "1." ni "2." ni "3." en
//        pantalla. Lo que hay es UNA HOJA REAL (`cmep30_s11_anota_tres_numeros.png`, él inclinado
//        sobre el cuaderno del banco) a la que se le va agregando UNA RAYA DE GRAFITO: la primera
//        se escribe en el acto 0, la segunda en la página del frame 619, la tercera en la página
//        del cierre. La cuenta es acumulación FÍSICA, no numeración.
//    (2) LA HOJA ES EL MARCO DEL MOVIMIENTO, NO UNA DIAPOSITIVA. Salimos de ella tres veces y
//        volvemos tres veces. Cada número es una EXPEDICIÓN fuera del cuaderno, no un ítem.
//    (3) CADA NÚMERO VIVE EN SU PROPIA ESCALA Y SU PROPIA LUZ, y son TRES OBJETOS distintos:
//          nº1 = EL MEDIDOR PARPADEANDO · escala MACRO · penumbra azul de la noche (10°, sky)
//          nº2 = LA ETIQUETA DEL PANEL AL SOL · escala EXTERIOR/PRODUCTO · mediodía duro (88°)
//          nº3 = EL MEDIDOR OTRA VEZ, PERO DE DÍA Y CON OTRA PREGUNTA · escala MEDIA de pared ·
//                rasante ámbar de alerta (16°)
//        El medidor vuelve — a propósito — con otra distancia, otra hora y otra pregunta: la
//        primera vez te dice cuánto comes, la tercera te dice si te va a cobrar lo que sobra.
//    Y las tres reglas NUNCA coexisten en pantalla mientras se explican. Recién conviven en el
//    último plano, y no como tarjetas: como TRES RAYAS DE LÁPIZ en una hoja, escritas con tinta
//    oscura sobre el papel, que es exactamente lo que el espectador tiene que copiar.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⇐ ENTRA DESDE el tramo de los límites del panel:
//   cam {encuadre MEDIO de interior, push 1,14, derivando a la IZQUIERDA, grúa −22, foco 46/56}
//   luz {HORA.papel 70°, blanco, amb 0,88 (rampa de 13 f que arranca en 0,90 de su valor: la
//        imagen entra YA FORMADA, no desde negro)}
//   materia {LA HOJA DEL CUADERNO SOBRE LA MESA — `cmep30_s11_anota_tres_numeros.png`, a sangre}
//
// ACTO 0 · 0-93 · "LOS TRES QUE TIENES QUE ANOTAR"     protagonista: EL CUADERNO
//   entra  cam {push 1,14, grúa −22, foco 46/56, deriva a la izquierda}  luz {papel 70°, amb 0,88}
//          materia {la hoja del cuaderno sobre la mesa, a sangre}
//   sale   cam {push 1,22, grúa −34, foco 52/44 — la cámara YA está entrando en el papel}
//          luz {papel 70° → 58°, amb 0,88 → 0,82}
//          materia {LA PRIMERA RAYA DE GRAFITO, recién escrita @52-74}
//   ── FRONTERA A @84 ···· ZOOM-THROUGH: la cámara se mete DENTRO del primer trazo de lápiz
//      (fx 26 / fy 46) y sale del otro lado ya sobre la lucecita roja del medidor, de noche. La
//      cama del medidor se monta 10 f ANTES (@74) y por DEBAJO (z −880): un zoom-through contra
//      nada es un fundido a negro. ⛔ Jamás un fade. ····································
// ACTO 1 · 93-619 · ⭐ NÚMERO UNO: TU CONSUMO DE FONDO   protagonista: EL MEDIDOR PARPADEANDO
//   entra  cam {MACRO, push 1,10, grúa −10, foco 52/44}   luz {penumbra 14° → 10°, sky, amb 0,62}
//          materia {la lucecita roja del medidor en la penumbra azul}
//   sale   cam {push 1,12, grúa +4, foco 50/48}           luz {12°, sky, amb 0,62 → 0,72}
//          materia {LOS DÍGITOS DE LA PINZA TREPANDO — `cmep30_s11_clip_pinza_digitos.mp4`}
//   (EL MECANISMO: el conteo de parpadeos es REAL y tiene un solo reloj — `PARPADEO` = 19 frames.
//    Cada pulso de la lucecita agrega UNA raya a la cuenta y el Readout sube en ESE mismo frame.
//    Si los dos no salieran del mismo número, el espectador vería dos animaciones y no un
//    mecanismo. Siete rayas después, la cuenta se resuelve en una cifra: 200 W.)
//   (la ventana W1 · EL RENGLÓN abre 154-250, de izquierda a derecha, techo 64 %.)
//   (costura INTERNA @250 ···· MATCH-SHAPE: la tarjeta de él contando los parpadeos NO suelta el
//    cuadro: crece de 470×282 a 1120×640 y su superficie SE REPINTA de ARRIBA HACIA ABAJO, con un
//    borde duro y su especular montado encima, hasta ser la pantalla de la pinza que marca 200. Un
//    rectángulo iluminado en otro rectángulo iluminado: el objeto no se sustituye, se agranda.
//    costura INTERNA @507 ···· CORTE EN EL BEAT sobre "Si te da más de quinientos": corte seco.
//    LA BISAGRA es LA CIFRA — misma x, misma y, mismo cuerpo (178 px) a los dos lados del filo,
//    18 frames de cada lado. Sólo cambia el valor. Nada más sobrevive el corte.)
//   (la ventana W2 · EL RENGLÓN abre 392-488, esta vez de DERECHA A IZQUIERDA, techo 64 %.)
//   ── FRONTERA B @606 ⛔ EL SALTO DEL BUCLE ···· OCLUSIÓN: LA HOJA DEL CUADERNO cruza el cuadro
//      de izquierda a derecha con su fibra, su doblez y su sombra de contacto, y TAPA EL 100 %
//      entre los frames 612 y 630 — o sea adentro de la ventana obligatoria 604-694. El acto
//      cambia AHÍ DENTRO. El color es el del PAPEL (#EFE8D6), jamás el del fondo: con el color
//      del fondo esto es un fundido a negro que se ve. ··································
// ACTO 2 · 619-1312 · ⭐ NÚMERO DOS: LA ETIQUETA MIENTE   protagonista: LA ETIQUETA AL SOL
//   entra  cam {CENITAL sobre la hoja, push 1,12 → 1,05, grúa −14 → −30, foco 48/54}
//          luz {papel 30° → 62°, blanco, amb 0,72 → 0,86}
//          materia {LA HOJA, a sangre, con la primera raya ya escrita}
//   sale   cam {push 1,10, grúa +10, foco 46/52}   luz {mediodía 84° → alerta 40°, amb 0,90 → 0,72}
//          materia {EL PANEL INCLINADO Y LA ARENILLA DEL REVOQUE}
//   (619-748 es LA PÁGINA a pantalla completa: ahí se escribe la SEGUNDA raya @646-670 y ahí
//    caen los 90 frames opacos. Ni una ventana, ni un hueco, ni una tarjeta flotante: contención.)
//   (costura INTERNA @730 ···· MATCH-SHAPE: una tarjeta finita (560×96) que contiene UN RENGLÓN
//    REAL de la hoja crece hasta 1360×720 y se REPINTA de IZQUIERDA A DERECHA hasta ser la
//    etiqueta blanca del dorso del panel, ya al sol de mediodía. Papel blanco y etiqueta blanca:
//    el mismo rectángulo pálido, otra materia. Es la costura que justifica el salto de luz.
//    costura INTERNA @838 ···· MATCH-MOVE: la tarjeta del renglón se va y la del panel llega
//    sobre UN SOLO RIEL (`rielMM`) — la misma función de desplazamiento, o sea la misma
//    velocidad, la misma dirección y la misma distancia (102 % de pantalla). Cinta, no dos
//    entradas sueltas.
//    costura INTERNA @1155 ···· OCLUSIÓN: EL ALUMINIO DEL MARCO DEL PANEL (#A9AEB2) cruza de
//    derecha a izquierda con su anodizado y su canto, y tapa el 100 % entre 1163 y 1174.)
//   (la ventana W3 · EL RENGLÓN abre 906-1002, de izquierda a derecha, techo 63 %.)
//   ── FRONTERA C @1300 ···· WIPE POR MATERIA: la ARENILLA DEL REVOQUE (#C6BCA6) que la cámara
//      arranca de la pared al llegar cruza el cuadro en bocanadas, y detrás ya está el medidor.
//      Es literalmente lo que hay en el plano, no un efecto inventado. ⛔ Color ARENILLA. ······
// ACTO 3 · 1312-1775 · ⭐ NÚMERO TRES: EL MEDIDOR       protagonista: EL MEDIDOR DE DÍA
//   entra  cam {MEDIO de pared, push 1,12, grúa −18, foco 54/44}   luz {alerta 22°, ámbar, amb 0,66}
//          materia {la arenilla asentándose sobre el revoque, y la cara del medidor detrás}
//   sale   cam {CERRADO sobre la hoja, deriva a la DERECHA, grúa −34, push 1,10, foco 42/58}
//          luz {HORA.papel 70°, blanco, amb 0,88}
//          materia {LA HOJA DE LAS TRES FILAS — `cmep30_s11_clip_escribe_tres.mp4`}
//   (costura INTERNA @1400 ···· ZOOM-THROUGH: la cámara entra por la pantalla del teléfono que él
//    apoya contra el medidor (fx 66 / fy 36) y sale del otro lado sobre el reloj de los diez
//    minutos, que se monta 12 f ANTES y por debajo.
//    costura INTERNA @1492 ···· CORTE EN EL BEAT sobre "Si el número sube, no compres nada":
//    LA BISAGRA es EL RECTÁNGULO DE LA PANTALLA — la misma tarjeta, la misma x/y, el mismo tamaño
//    y el mismo marco a los dos lados del filo: del teléfono contra el medidor a las ruedas del
//    contador. Sólo cambia lo que hay adentro.
//    costura INTERNA @1630 ···· MATCH-SHAPE: la ventanita de las ruedas del contador (un
//    rectángulo con cifras) crece hasta pasarse del cuadro y se REPINTA DESDE EL CENTRO HACIA LOS
//    DOS COSTADOS hasta ser la hoja de las tres filas. Cifras impresas → cifras escritas a mano.
//    Es el aterrizaje exacto de MovS12Cierre, que arranca con esa misma materia a sangre.)
//   (la ventana W4 · EL RENGLÓN abre 1524-1620, de derecha a izquierda, techo 64 %.)
//
// ⇒ SALE HACIA `MovS12Cierre` ("no te vayas con las manos vacías"):
//   cam {CERRADO sobre una hoja con anotaciones, deriva a la DERECHA, grúa −34, push 1,10,
//        foco 42/58}
//   luz {HORA.papel 70°, blanco, amb 0,88}
//   materia {LA HOJA DE LAS TRES FILAS — `cmep30_s11_clip_escribe_tres.mp4`, él dibujando las
//            tres rayas una debajo de la otra}
//
// ── §OPACIDAD DE LOS FRAMES 604-694 (el requisito estructural) ────────────────────────────────
//   (a) `coverAt(g)` devuelve CERRADO para todo g en [604, 694]: las cuatro ventanas viven en
//       154-250, 392-488, 906-1002 y 1524-1620, y ninguna toca ese tramo. Con CERRADO el
//       `clipPath` es `inset(0px)`, o sea el contenedor del mundo cubre el 100 % del cuadro sin
//       recorte y sin polígono.
//   (b) `VoltAtmos` se monta como PRIMER hijo, FUERA de `Layers` (o sea, fuera de la cámara) y
//       trae `backgroundColor: V.ink0` OPACO: no existe un frame en que el cuadro no esté
//       pintado, pase lo que pase con la cámara.
//   (c) Camas a sangre montadas en TODOS y cada uno de los 91 frames, y DOS solapadas justo
//       encima de la costura: `bgPinza` (507-628) y `bgPagina2` (596-756). Las dos se montan con
//       `scale` ≥ 1,46 y la cámara nunca baja de `push` 1,05 en ese tramo, así que con la
//       perspectiva ya aplicada el plano cubre ≥ 1,53 del cuadro: ni la deriva (132 px) ni la
//       grúa (30 px) llegan nunca a mostrar un borde.
//   (d) La OCLUSIÓN de la frontera B pone además una placa de PAPEL que tapa el 100 % entre 612
//       y 630, y va FUERA del contenedor recortado (por encima de todo).
//   Verificado por script: `coverAt(g).open === false` y ≥1 cama a sangre montada, para los 91
//   frames de 604 a 694 inclusive.
//
// ⛔ cero Math.random/Date/new Date · cero backdrop-filter · cero blur grande full-screen · cero
// fade en ninguna frontera · dos costuras seguidas nunca repiten tipo · cero capa de color con
// opacidad sobre el avatar · TODA tarjeta flotante lleva FOTO o CLIP REAL adentro (`MediaCard`);
// las rayas de grafito, las barras del 900/740, la cuenta de parpadeos y la regla del −20 % son
// GRÁFICA de apoyo dibujada SOBRE material real, nunca hacen de objeto.
// ⛔ Rutas LITERALES en el punto de uso: el build escanea este .tsx por TEXTO y una ruta armada
// por template literal no viaja en el tar → 404 → chunk muerto con un error que miente.
// ⚠️ Ningún `kind="video"` se monta más de 136 frames (los clips duran 121 f @24 ≈ 151 f @30).
// ⚠️ Material de `MovS12Cierre` que NO se repite acá: `cmep30_s11_calculadora_papel.png` y
//    `cmep30_s11_un_solo_panel.png`. Lo único compartido es `cmep30_s11_clip_escribe_tres.mp4`,
//    y es compartido A PROPÓSITO: es LA MATERIA QUE CRUZA la frontera hacia S12.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rgba, rnd,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, zoomThrough, SunKey, HORA, flujo, SeamWipeMatter, Bed,
} from "./PanelStage";

// ── EL RELOJ DEL MOVIMIENTO (frames locales, 30 fps · global = local + 36760) ─────────────────
const A0 = 0;      // 36760 · "Por eso te dejo los tres números que tienes que anotar hoy."
const A1 = 93;     // 36853 · "El primero: tu consumo de fondo..."
const A2 = 619;    // 37379 · ⛔ EL SALTO DEL AVATAR · "El segundo: lo que el panel da de verdad"
const A3 = 1312;   // 38072 · "Y el tercero: qué hace tu medidor con lo que sobra."
const G_END = 1775;

// ⛔⛔ LA VENTANA OBLIGATORIA: pantalla completa opaca, sin un solo hueco.
const OPACO_0 = 604;
const OPACO_1 = 694;

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const es = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
const esOut = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.42, 0, 0.24, 1) });
const esSnap = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.06, 0.9, 0.18, 1) });

// LAS MATERIAS de las costuras. ⛔ Ninguna es el color del fondo.
const PAPEL = "#EFE8D6";     // la hoja del cuaderno (frontera B, la que tapa el salto del bucle)
const ALUMINIO = "#A9AEB2";  // el marco anodizado del panel (costura interna @1155)
const ARENILLA = "#C6BCA6";  // el revoque que la cámara arranca de la pared (frontera C)
const GRAFITO = "#3A3B34";   // el lápiz: la materia de las tres rayas
const TINTA = "#22251B";     // lo escrito a mano sobre el papel claro

// ── EL MECANISMO DEL ACTO 1: UN SOLO RELOJ PARA LA LUCECITA Y PARA LA CUENTA ──────────────────
// La lucecita del medidor pulsa cada `PARPADEO` frames y la cuenta sube +1 en ESE mismo frame.
// Si no salieran del mismo número, se verían dos animaciones y no un mecanismo.
const PARPADEO = 19;
const PARP_T0 = 140;
const PARP_N = 7;
const parpadeos = (g: number) => {
  if (g < PARP_T0) return 0;
  return Math.min(PARP_N, Math.floor((g - PARP_T0) / PARPADEO) + 1);
};
/** el frame exacto del último pulso (para clavar el golpe de la raya ahí, no cerca) */
const ultimoPulso = (g: number) => {
  const n = parpadeos(g);
  return n === 0 ? -999 : PARP_T0 + (n - 1) * PARPADEO;
};

// ── EL RIEL DE LA COSTURA @838 (MATCH-MOVE): una sola velocidad, una sola dirección ──────────
// La tarjeta que se va y la que llega comparten ESTA función. 102 % de pantalla en 34 frames.
const MM_AT = 838;
const rielMM = (g: number) => -102 * es(clamp01((g - MM_AT) / 34));

// ══ LA APERTURA — ⭐ EL RENGLÓN Y LA GOMA (gesto nuevo, ver cabecera) ═════════════════════════
const W_LINE = 97.4;    // la altura de LA RAYA: pegada al borde inferior, nunca cerca de la cara
const WIN_DUR = 96;     // 3,20 s — ninguna ventana pasa de ahí

type Cover = { gL: number; gR: number; top: number; open: boolean };
const CERRADO: Cover = { gL: 50, gR: 50, top: 100, open: false };

type Win = { at: number; xa: number; xb: number; band: number; dir: 1 | -1 };
// ⛔ NINGUNA toca 604-694. W1 muere en 250, W2 en 488, W3 nace en 906.
const WINS: Win[] = [
  { at: 154, xa: 15, xb: 83, band: 64, dir: 1 },    // 154-250 · "con la casa tranquila"
  { at: 392, xa: 24, xb: 86, band: 64, dir: -1 },   // 392-488 · "empieza con uno de un solo panel"
  { at: 906, xa: 18, xb: 82, band: 63, dir: 1 },    // 906-1002 · "se mide en laboratorio a 25"
  { at: 1524, xa: 22, xb: 84, band: 64, dir: -1 },  // 1524-1620 · "no compres nada"
];

const renglon = (g: number, w: Win): Cover => {
  const t = g - w.at;
  if (t < 0 || t >= WIN_DUR) return CERRADO;
  // 1. EL TRAZO — velocidad CONSTANTE (así se escribe una raya, no con easing)
  const traza = clamp01(t / 16);
  // el levantón del lápiz al final del trazo: un overshoot que vuelve
  const over = t >= 13 && t < 25 ? Math.sin(((t - 13) / 12) * Math.PI) * 0.034 : 0;
  // 4. LA GOMA — también a velocidad constante, y desde la otra punta
  const borra = clamp01((t - 82) / 14);
  const ext = Math.max(0, Math.min(traza + over, 1 - borra));
  // 2. EL RENGLÓN SE ABRE (snap) · 3. HOLD VIVO (respiración) · y vuelve a la raya
  const abre = esSnap(clamp01((t - 16) / 14));
  const cierra = es(clamp01((t - 70) / 12));
  const respira = t > 30 && t < 70 ? Math.sin((t - 30) / 8.5) * 0.34 : 0;
  const top = lerp(lerp(W_LINE, w.band, abre), W_LINE, cierra) + respira;
  const span = w.xb - w.xa;
  const gL = w.dir === 1 ? w.xa : w.xb - span * ext;
  const gR = w.dir === 1 ? w.xa + span * ext : w.xb;
  return { gL, gR, top, open: top < 99.2 && gR - gL > 0.8 };
};

const coverAt = (g: number): Cover => {
  for (let i = 0; i < WINS.length; i++) {
    const c = renglon(g, WINS[i]);
    if (c.open) return c;
  }
  return CERRADO;
};

const clipOf = (c: Cover) =>
  c.open
    ? `polygon(0% 0%, 100% 0%, 100% 100%, ${c.gR.toFixed(2)}% 100%, ` +
      `${c.gR.toFixed(2)}% ${c.top.toFixed(2)}%, ${c.gL.toFixed(2)}% ${c.top.toFixed(2)}%, ` +
      `${c.gL.toFixed(2)}% 100%, 0% 100%)`
    : "inset(0px)";

// ── LOS CANTOS DE LA APERTURA. Todo el brillo sale HACIA AFUERA (hacia el mundo): ni un píxel
//    de gradiente se apoya sobre él. El canto de arriba es LA RAYA DE LÁPIZ: grafito, no luz.
const CantoV: React.FC<{ x: number; dir: -1 | 1; hot: number }> = ({ x, dir, hot }) => (
  <div style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 0 }}>
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 3, left: dir === -1 ? -3 : 0,
      background: `linear-gradient(180deg, ${rgba(V.bone, 0.16 * hot)}, ${rgba(V.bone, 0.56 * hot)} 62%, ${rgba(V.volt, 0.2 * hot)})`,
    }} />
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 108, left: dir === -1 ? -111 : 3,
      background: dir === -1
        ? `linear-gradient(270deg, ${rgba(V.bone, 0.12 * hot)}, rgba(0,0,0,0) 48%), linear-gradient(270deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.58)})`
        : `linear-gradient(90deg, ${rgba(V.bone, 0.12 * hot)}, rgba(0,0,0,0) 48%), linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.58)})`,
    }} />
  </div>
);

const CantoRaya: React.FC<{ c: Cover; hot: number }> = ({ c, hot }) => (
  <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <defs>
      <linearGradient id="s11rengCanto" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={rgba(V.ink0, 0.54)} />
        <stop offset="74%" stopColor={rgba(V.bone, 0.09 * hot)} />
        <stop offset="100%" stopColor={rgba(V.bone, 0)} />
      </linearGradient>
    </defs>
    <polygon
      points={`${c.gL * 19.2},${c.top * 10.8 - 88} ${c.gR * 19.2},${c.top * 10.8 - 88} ` +
        `${c.gR * 19.2},${c.top * 10.8} ${c.gL * 19.2},${c.top * 10.8}`}
      fill="url(#s11rengCanto)"
    />
    {/* LA RAYA: grafito con su brillo, no una línea de luz */}
    <line x1={c.gL * 19.2} y1={c.top * 10.8} x2={c.gR * 19.2} y2={c.top * 10.8}
      stroke={rgba(GRAFITO, 0.92)} strokeWidth={7} />
    <line x1={c.gL * 19.2} y1={c.top * 10.8 - 2} x2={c.gR * 19.2} y2={c.top * 10.8 - 2}
      stroke={rgba(V.bone, 0.5 * hot)} strokeWidth={2} />
  </svg>
);

// ══ LAS COSTURAS PROPIAS ══════════════════════════════════════════════════════════════════════

// FRONTERA B @606 · OCLUSIÓN — LA HOJA DEL CUADERNO. ⛔ Color PAPEL, jamás el del fondo.
// Tapa el 100 % entre 612 y 630, o sea ADENTRO de la ventana obligatoria 604-694.
const OcluyeHoja: React.FC<{ g: number; at: number; dur?: number }> = ({ g, at, dur = 34 }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(-174, 118, esOut(p));
  const tapa = clamp01(Math.sin(p * Math.PI) * 2.3 - 0.86);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-24%", left: `${L.toFixed(2)}%`, width: "168%", height: "150%",
        transform: "rotate(4deg)",
        background:
          `linear-gradient(86deg, ${rgba(PAPEL, 0)} 0%, ${PAPEL} 7%, #FBF7EC 32%, ` +
          `#DCD3BC 60%, ${PAPEL} 88%, ${rgba(PAPEL, 0)} 100%)`,
        boxShadow: `0 28px 92px ${rgba(V.ink0, 0.78)}`,
      }}>
        {/* la fibra del papel y su doblez: tiene materia, no es un rectángulo plano */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.32,
          backgroundImage:
            `repeating-linear-gradient(88deg, ${rgba("#8A8171", 0.16)} 0px, ${rgba("#8A8171", 0.16)} 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 56px)`,
        }} />
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "41%", width: 28,
          background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba("#9C917D", 0.36)} 50%, rgba(0,0,0,0))`,
        }} />
        {/* el renglonado real de la hoja, apenas insinuado */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.16,
          backgroundImage:
            `repeating-linear-gradient(180deg, ${rgba("#6E6858", 0.5)} 0px, ${rgba("#6E6858", 0.5)} 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 44px)`,
        }} />
      </div>
      <AbsoluteFill style={{ background: rgba(PAPEL, 0.96 * tapa) }} />
    </AbsoluteFill>
  );
};

// COSTURA INTERNA @1155 · OCLUSIÓN — EL ALUMINIO DEL MARCO DEL PANEL. ⛔ Color ALUMINIO.
const OcluyeMarco: React.FC<{ g: number; at: number; dur?: number }> = ({ g, at, dur = 32 }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(112, -180, esOut(p));
  const tapa = clamp01(Math.sin(p * Math.PI) * 2.4 - 0.9);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-20%", left: `${L.toFixed(2)}%`, width: "170%", height: "142%",
        transform: "rotate(-6deg)",
        background:
          `linear-gradient(94deg, ${rgba(ALUMINIO, 0)} 0%, ${ALUMINIO} 6%, #C6CACC 22%, ` +
          `#84898D 50%, #BEC2C4 76%, ${ALUMINIO} 94%, ${rgba(ALUMINIO, 0)} 100%)`,
        boxShadow: `0 30px 96px ${rgba(V.ink0, 0.8)}`,
        borderRadius: 6,
      }}>
        {/* el anodizado cepillado del perfil */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.4,
          backgroundImage:
            `repeating-linear-gradient(95deg, ${rgba(V.ink0, 0.1)} 0px, ${rgba(V.ink0, 0.1)} 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 7px)`,
        }} />
        {/* el sol del mediodía lamiendo el canto del perfil */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(108deg, rgba(255,255,255,0) 32%, ${rgba(V.white, 0.46)} 47%, rgba(255,255,255,0) 58%)`,
        }} />
      </div>
      <AbsoluteFill style={{ background: rgba(ALUMINIO, 0.95 * tapa) }} />
    </AbsoluteFill>
  );
};

// FRONTERA C @1300 · WIPE POR MATERIA — la cobertura maciza de la ARENILLA del revoque.
// `SeamWipeMatter` (Stage) pone las bocanadas; esto pone los frames en que la arenilla tapa el
// 100 % y adentro de los cuales cambia el mundo. ⛔ Color ARENILLA, jamás el del fondo.
const ArenillaTapa: React.FC<{ g: number; at: number; dur?: number }> = ({ g, at, dur = 42 }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const tapa = clamp01(Math.sin(p * Math.PI) * 2.5 - 1.02);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 20 }, (_, i) => {
        const o = rnd(i * 4.7);
        const yy = 6 + rnd(i * 2.9) * 86;
        const d = 190 + o * 300;
        return (
          <div key={i} style={{
            position: "absolute", top: `${yy}%`,
            left: `${lerp(-34, 132, clamp01(p * 1.55 - o * 0.36)).toFixed(1)}%`,
            width: d, height: d, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(ARENILLA, 0.3 * Math.sin(p * Math.PI))}, rgba(0,0,0,0) 66%)`,
          }} />
        );
      })}
      <AbsoluteFill style={{ background: rgba(ARENILLA, 0.94 * tapa) }} />
    </AbsoluteFill>
  );
};

// ══ EL MATCH-SHAPE: UN SOLO RECTÁNGULO QUE CRECE Y SE REPINTA ═════════════════════════════════
// El objeto NO se sustituye: la MISMA caja crece y su superficie se repinta con un BORDE DURO y
// su especular montado encima. ⛔ Jamás un fundido entre las dos materias.
// `dirRepinta`: "abajo" (arriba→abajo) · "derecha" (izq→der) · "centro" (del centro a los lados)
type DirRepinta = "abajo" | "derecha" | "centro";
const insetDe = (dir: DirRepinta, k: number) => {
  const q = (100 - clamp01(k) * 100).toFixed(2);
  const c = ((100 - clamp01(k) * 100) / 2).toFixed(2);
  if (dir === "abajo") return `0% 0% ${q}% 0%`;
  if (dir === "derecha") return `0% ${q}% 0% 0%`;
  return `0% ${c}% 0% ${c}%`;
};

const Morf: React.FC<{
  g: number; cf: number;
  srcA: string; kindA: "video" | "photo";
  srcB: string; kindB: "video" | "photo";
  at: number; grow: number;          // frame en que arranca el crecimiento y su duración
  repAt: number; repDur: number;     // frame en que arranca el repintado y su duración
  dir: DirRepinta;
  x: number; y: number;
  w0: number; h0: number; w1: number; h1: number;
  z?: number; ry?: number; rx?: number;
  litA?: string; litB?: string;
  labelA?: string; labelB?: string;
  startFromB?: number;
  radius0?: number; radius1?: number;
  offX?: number;                     // desplazamiento del riel (match-move), en % de pantalla
}> = ({
  g, cf, srcA, kindA, srcB, kindB, at, grow, repAt, repDur, dir, x, y,
  w0, h0, w1, h1, z = 0, ry = 0, rx = 0, litA = V.volt, litB = V.white,
  labelA, labelB, startFromB = 0, radius0 = 14, radius1 = 3, offX = 0,
}) => {
  const p = es(clamp01((g - at) / grow));
  const k = esOut(clamp01((g - repAt) / repDur));
  const w = lerp(w0, w1, p);
  const h = lerp(h0, h1, p);
  const rad = lerp(radius0, radius1, p);
  const xx = x + offX;
  const ins = insetDe(dir, k);
  // el borde DURO del repintado, con su especular: la línea neta entre las dos materias
  const bordeStyle: React.CSSProperties =
    dir === "abajo"
      ? { left: `${xx}%`, top: `${y}%`, width: w, height: 6, marginLeft: -w / 2, marginTop: -h / 2 + h * clamp01(k) - 3 }
      : dir === "derecha"
        ? { left: `${xx}%`, top: `${y}%`, width: 6, height: h, marginLeft: -w / 2 + w * clamp01(k) - 3, marginTop: -h / 2 }
        : { left: `${xx}%`, top: `${y}%`, width: 6, height: h, marginLeft: -w / 2 + w * (0.5 + clamp01(k) / 2) - 3, marginTop: -h / 2 };
  return (
    <>
      <MediaCard src={srcA} kind={kindA} w={w} h={h} x={xx} y={y} z={z} ry={ry} rx={rx}
        lit={0.98} litColor={litA} label={labelA} radius={rad} />
      <AbsoluteFill style={{ clipPath: `inset(${ins})`, WebkitClipPath: `inset(${ins})` }}>
        <MediaCard src={srcB} kind={kindB} w={w} h={h} x={xx} y={y} z={z} ry={ry} rx={rx}
          startFrom={startFromB} lit={1} litColor={litB} label={labelB} radius={rad}
          sheenAt={cf - g + repAt + repDur} />
      </AbsoluteFill>
      {k > 0.005 && k < 0.995 && (
        <div style={{
          position: "absolute", ...bordeStyle,
          background: `linear-gradient(${dir === "abajo" ? "180deg" : "90deg"}, ${rgba(V.white, 0.86)}, ${rgba(V.white, 0)})`,
          boxShadow: `0 0 22px ${rgba(V.white, 0.44)}`,
        }} />
      )}
      {/* el mismo borde, espejado, cuando el repintado sale del centro hacia los DOS lados */}
      {dir === "centro" && k > 0.005 && k < 0.995 && (
        <div style={{
          position: "absolute", left: `${xx}%`, top: `${y}%`, width: 6, height: h,
          marginLeft: -w / 2 + w * (0.5 - clamp01(k) / 2) - 3, marginTop: -h / 2,
          background: `linear-gradient(270deg, ${rgba(V.white, 0.86)}, ${rgba(V.white, 0)})`,
          boxShadow: `0 0 22px ${rgba(V.white, 0.44)}`,
        }} />
      )}
    </>
  );
};

// ══ GRÁFICA DE APOYO — SIEMPRE dibujada SOBRE material real, nunca haciendo de objeto ═════════

/** LA RAYA DE LÁPIZ. Es el ordinal del movimiento: ⛔ no hay ningún "1." en pantalla. */
const Trazo: React.FC<{ g: number; at: number; x: number; y: number; w: number; dur?: number; op?: number }> = ({
  g, at, x, y, w, dur = 22, op = 1,
}) => {
  if (g < at || op <= 0.01) return null;
  const p = clamp01((g - at) / dur);      // velocidad CONSTANTE: es un lápiz, no un easing
  const ww = w * p;
  if (ww < 2) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: ww, height: 12, opacity: op,
      transform: "translateY(-50%) rotate(-0.9deg)",
    }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 3,
        background: `linear-gradient(92deg, ${rgba(GRAFITO, 0.9)} 0%, ${rgba(GRAFITO, 0.68)} 44%, ${rgba(GRAFITO, 0.94)} 100%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.5,
        backgroundImage:
          `repeating-linear-gradient(84deg, rgba(255,255,255,0.34) 0px, rgba(255,255,255,0.34) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) ${(3 + rnd(x) * 3).toFixed(1)}px)`,
      }} />
      {/* la mina del lápiz mientras todavía escribe */}
      <div style={{
        position: "absolute", right: -3, top: -3, width: 6, height: 18, borderRadius: 2,
        background: rgba(GRAFITO, 0.55 * (1 - p)),
      }} />
    </div>
  );
};

/** LO ESCRITO A MANO sobre el papel claro: tinta oscura, no tipografía blanca sobre negro. */
const Manuscrito: React.FC<{
  children: React.ReactNode; x: number; y: number; size?: number; op?: number; peso?: number;
}> = ({ children, x, y, size = 46, op = 1, peso = 700 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translateY(-50%) rotate(-0.7deg)",
    opacity: op, fontFamily: F_DISPLAY, fontWeight: peso, fontSize: size, letterSpacing: 1.6,
    color: TINTA, textTransform: "uppercase", whiteSpace: "nowrap", lineHeight: 1.04,
    textShadow: `0 1px 0 rgba(255,255,255,0.55), 0 4px 14px rgba(120,110,86,0.45)`,
  }}>{children}</div>
);

/** LA CUENTA DE PARPADEOS: rayas de grafito que caen EN EL FRAME EXACTO del pulso. */
const Cuenta: React.FC<{ g: number; cf: number; x: number; y: number; op: number }> = ({ g, cf, x, y, op }) => {
  const n = parpadeos(g);
  const golpe = ultimoPulso(g);
  const flash = golpe > -900 ? clamp01(1 - (g - golpe) / 7) : 0;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", opacity: op,
    }}>
      <Bed pad={22} w={452}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.4,
          color: rgba(V.bone, 0.9), textTransform: "uppercase",
        }}>CUENTA LOS PARPADEOS</div>
        <div style={{ position: "relative", height: 74, marginTop: 14 }}>
          {Array.from({ length: PARP_N }, (_, i) => {
            const on = i < n;
            const mio = golpe === PARP_T0 + i * PARPADEO;
            if (!on) return null;
            return (
              <div key={i} style={{
                position: "absolute", left: 8 + i * 58, top: 6 + (i % 2) * 3,
                width: 11, height: 58, borderRadius: 3,
                transform: `rotate(${(-9 + rnd(i * 3.7) * 16).toFixed(1)}deg) scaleY(${(0.9 + 0.1 * (mio ? 1 - flash : 1)).toFixed(3)})`,
                background: `linear-gradient(178deg, ${rgba(V.volt, 0.94)}, ${rgba(V.voltSoft, 0.8)})`,
                boxShadow: mio ? `0 0 ${(26 * flash).toFixed(0)}px ${rgba(V.volt, 0.7 * flash)}` : "none",
              }} />
            );
          })}
          {/* el pulso de la lucecita: la fuente del conteo, en su propio latido */}
          <div style={{
            position: "absolute", right: 10, top: 16,
            width: 26, height: 26, borderRadius: "50%",
            background: rgba(V.danger, 0.35 + 0.6 * flash),
            boxShadow: `0 0 ${(30 * flash + 8).toFixed(0)}px ${rgba(V.danger, 0.72 * flash + 0.14)}`,
          }} />
        </div>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: 2.6,
          color: V.white, textTransform: "uppercase", marginTop: 2,
          transform: `translateY(${(Math.sin((cf) / 47) * 1.4).toFixed(2)}px)`,
        }}>EN UN MINUTO · CASA QUIETA</div>
      </Bed>
    </div>
  );
};

/** LAS DOS BARRAS del acto 2 (900 de etiqueta contra 740 de pared). Gráfica sobre la etiqueta. */
const Barra: React.FC<{
  g: number; at: number; x: number; y: number; wMax: number; frac: number;
  color: string; op: number; grosor?: number;
}> = ({ g, at, x, y, wMax, frac, color, op, grosor = 34 }) => {
  const p = es(clamp01((g - at) / 26));
  if (g < at || op <= 0.01) return null;
  const w = wMax * frac * p;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: grosor,
      transform: "translateY(-50%)", opacity: op,
      background: `linear-gradient(90deg, ${rgba(color, 0.94)} 0%, ${rgba(color, 0.62)} 82%, ${rgba(color, 0.9)} 100%)`,
      boxShadow: `0 8px 26px ${rgba(V.ink0, 0.66)}, inset 0 1px 0 ${rgba(V.white, 0.34)}`,
      borderRadius: 3,
    }}>
      {/* hold VIVO: un especular que recorre la barra, nada queda quieto */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 3, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, bottom: 0, width: "34%",
          left: `${(((g * 0.9) % 160) - 40).toFixed(1)}%`,
          background: `linear-gradient(90deg, rgba(255,255,255,0), ${rgba(V.white, 0.28)}, rgba(255,255,255,0))`,
        }} />
      </div>
      {/* el tope duro de la barra */}
      <div style={{
        position: "absolute", right: -3, top: -7, width: 6, height: grosor + 14,
        background: rgba(color, 0.98), boxShadow: `0 0 18px ${rgba(color, 0.6)}`,
      }} />
    </div>
  );
};

// ── TIPOGRAFÍA propia del movimiento (titular ≥48 px · detalle ≥30 px) ────────────────────────
const Rotulo: React.FC<{
  children: React.ReactNode; x: number; y: number; color?: string; size?: number; op?: number;
}> = ({ children, x, y, color = V.bone, size = 42, op = 1 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", opacity: op,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 3.2, color,
    textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.96)",
  }}>{children}</div>
);

// cartel que ATERRIZA: entra con desplazamiento y escala, nunca con opacity sola
const Cartel: React.FC<{
  g: number; at: number; out: number; x: number; y: number; size?: number; color?: string;
  kick?: string; tipo?: "cobran" | "queda"; children: React.ReactNode;
}> = ({ g, at, out, x, y, size = 58, color = V.white, kick, tipo, children }) => {
  const inP = es(clamp01((g - at) / 15));
  const outP = clamp01((g - out) / 16);
  if (g < at || outP >= 1) return null;
  const fl = tipo ? flujo(tipo, clamp01((g - at) / 22)) : null;
  const dy = fl ? fl.dy * 0.3 : (1 - inP) * 26;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translateY(${(dy + outP * 22 + Math.sin(g / 59) * 2).toFixed(1)}px) ` +
        `scale(${(0.93 + 0.07 * inP - outP * 0.05).toFixed(3)})`,
      opacity: Math.min(1, inP * 1.7) * (1 - outP),
    }}>
      <Bed pad={22}>
        {kick && (
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 5.2,
            color: rgba(V.volt, 0.95), textTransform: "uppercase", marginBottom: 8,
          }}>{kick}</div>
        )}
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 1.5, color,
          textTransform: "uppercase", lineHeight: 1.05, whiteSpace: "nowrap",
          textShadow: "0 5px 24px rgba(0,0,0,0.96)",
        }}>{children}</div>
      </Bed>
    </div>
  );
};

// ── LA CÁMARA · una sola función de g, con deriva viva, que NUNCA vuelve a cero ────────────────
// ⚠️ `push` nunca baja de 1,02 y `z0`/`z1` son POSITIVOS: la escena jamás se achica por debajo del
// cuadro, así que ningún borde de plano entra a cámara (parte de la garantía de opacidad).
// ⚠️ `drift` es la DIRECCIÓN de la cámara y cambia de signo a propósito: entra derivando a la
// IZQUIERDA (el mundo corre a la derecha, valores subiendo) y SALE derivando a la DERECHA
// (valores bajando), que es como arranca MovS12Cierre.
const KF = [0, 84, 168, 250, 380, 507, 606, 668, 740, 838, 906, 1010, 1155, 1230, 1300, 1400,
  1492, 1560, 1650, G_END];
const camAt = (g: number) => {
  const base = gcam(g, { z0: 18, z1: 64, panX: 0, panY: -22, ry: 3.2, rx: -1.1, dur: G_END });
  const crane = interpolate(
    g, KF,
    [-22, -34, -10, 2, 16, 4, -14, -30, -12, 4, 18, 26, 10, -4, -18, 8,
      20, 6, -16, -34],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  const push = interpolate(
    g, KF,
    [1.14, 1.22, 1.10, 1.06, 1.03, 1.08, 1.12, 1.05, 1.14, 1.04, 1.02, 1.06, 1.10, 1.04, 1.12, 1.18,
      1.06, 1.03, 1.08, 1.10],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) },
  );
  const DK = [0, 93, 380, 619, 906, 1155, 1312, 1560, G_END];
  const drift = interpolate(g, DK, [0, 34, 96, 132, 118, 84, 44, -22, -104],
    { ...CL, easing: Easing.bezier(0.36, 0, 0.28, 1) });
  const FK = [0, 84, 250, 507, 606, 740, 838, 1010, 1155, 1300, 1400, 1492, 1650, G_END];
  const fx = interpolate(g, FK, [46, 52, 44, 56, 48, 42, 50, 58, 46, 54, 66, 58, 46, 42], CL);
  const fy = interpolate(g, FK, [56, 44, 50, 42, 54, 46, 48, 40, 52, 44, 36, 42, 50, 58], CL);
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translate3d(${drift.toFixed(1)}px, ${crane.toFixed(1)}px, 0) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(4)})`
  );
};

// el parallax propio de `PhotoPlane` (Stage). Lo que se apoya SOBRE la cama tiene que moverse
// igual o la gráfica patina sobre el material.
const hojaSync = (cf: number): React.CSSProperties => ({
  transform: `translateX(${(Math.sin(cf / 121) * 8).toFixed(1)}px)`,
});

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovS11Numeros: React.FC<{ acto?: number; gFrame?: number }> = ({ gFrame }) => {
  const cf = useCurrentFrame();
  const g = gFrame === undefined ? cf : gFrame;
  const toCF = (t: number) => cf - g + t;   // pasa un frame mío al reloj de las primitivas del Stage

  // ── LA LUZ: función continua de g. Entra en HORA.papel (la hoja sobre la mesa), cae a la
  //    penumbra azul del medidor de noche, sube al MEDIODÍA DURO de la etiqueta al sol, baja al
  //    ámbar rasante de alerta del medidor y VUELVE a HORA.papel para el handoff. Evoluciona,
  //    nunca salta. ⛔ Ningún tramo por debajo de luma 25: `amb` nunca baja de 0,60 y `inten`
  //    nunca de 0,90.
  const LK = [0, 40, 93, 168, 300, 507, 606, 668, 740, 838, 906, 1010, 1155, 1300, 1400, 1492,
    1616, 1660, G_END];
  const sunAng = interpolate(
    g, LK,
    [HORA.papel.ang, 70, 58, 14, 10, 12, 30, 62, 74, 82, HORA.mediodia.ang, 88, 84, 40, 22,
      HORA.alerta.ang, 16, 40, HORA.papel.ang],
    CL,
  );
  const amb = interpolate(
    g, LK,
    [0.88, 0.88, 0.82, 0.62, 0.60, 0.62, 0.72, 0.86, 0.90, 0.92, 0.95, 0.94, 0.90, 0.72, 0.66,
      0.64, 0.66, 0.78, 0.88],
    CL,
  );
  // los tres soles: cálido (lo que te queda) · frío cenital (lo que te cobran) · blanco (el día)
  const warmW = interpolate(g, LK, [0.30, 0.30, 0.26, 0.22, 0.22, 0.30, 0.36, 0.34, 0.34, 0.38,
    0.44, 0.46, 0.44, 0.56, 0.60, 0.58, 0.54, 0.42, 0.32], CL);
  const coldW = interpolate(g, LK, [0.34, 0.34, 0.44, 0.72, 0.76, 0.70, 0.52, 0.36, 0.32, 0.33,
    0.32, 0.34, 0.38, 0.44, 0.52, 0.58, 0.62, 0.44, 0.34], CL);
  const dayW = interpolate(g, LK, [0.86, 0.86, 0.72, 0.46, 0.44, 0.48, 0.66, 0.88, 0.94, 0.98,
    1.00, 0.98, 0.94, 0.72, 0.64, 0.62, 0.62, 0.80, 0.90], CL);
  const coolMix = interpolate(g, LK, [0.26, 0.26, 0.44, 0.82, 0.86, 0.80, 0.56, 0.30, 0.24, 0.23,
    0.20, 0.22, 0.28, 0.40, 0.48, 0.54, 0.56, 0.38, 0.26], CL);
  const keyFrom = interpolate(g, LK, [0.34, 0.34, 0.42, 0.62, 0.66, 0.58, 0.48, 0.38, 0.34, 0.32,
    0.28, 0.32, 0.40, 0.52, 0.56, 0.50, 0.44, 0.38, 0.32], CL);
  // ⚠️ RAMPA DE AMBIENTE de 13 frames que arranca en 0,90: el frame 0 entra con IMAGEN YA FORMADA
  const inten = interpolate(g, [0, 13, 300, 619, 906, 1155, 1312, 1650, G_END],
    [0.90, 1.02, 0.96, 1.04, 1.06, 1.02, 0.94, 1.00, 1.02], CL);
  const floorDim = interpolate(g, [0, 93, 300, 619, 906, 1155, 1312, 1650, G_END],
    [0.46, 0.44, 0.50, 0.42, 0.38, 0.44, 0.50, 0.42, 0.40], CL);

  const cam = camAt(g);
  const cov = coverAt(g);
  const clip = clipOf(cov);
  const cantoHot = cov.open ? clamp01((cov.gR - cov.gL) / 18) : 0;

  // ── FRONTERA A @84 · ZOOM-THROUGH por la primera raya de lápiz (fx 26 / fy 46)
  const zw = g >= 84 && g < 116 ? zoomThrough(g, 84, 28, 26, 46) : null;
  const zs: React.CSSProperties = zw
    ? { transform: zw.out, opacity: zw.opacity, transformStyle: "preserve-3d" }
    : { transformStyle: "preserve-3d" };

  // ── COSTURA INTERNA @1400 · ZOOM-THROUGH por la pantalla del teléfono (fx 66 / fy 36)
  const zw2 = g >= 1400 && g < 1432 ? zoomThrough(g, 1400, 28, 66, 36) : null;
  const zs2: React.CSSProperties = zw2
    ? { transform: zw2.out, opacity: zw2.opacity, transformStyle: "preserve-3d" }
    : { transformStyle: "preserve-3d" };

  // ── LAS CAMAS A SANGRE. Todas se montan ANTES de su costura y se solapan: una costura contra
  //    nada es un fundido a negro, y un frame sin cama es un frame transparente.
  //    ⛔⛔ 604-694: `bgPinza` (507-628) y `bgPagina2` (596-756) lo cubren DOS VECES.
  const bgPagina1 = g >= A0 && g < 124;        // la hoja del cuaderno (entrada)
  const bgMedidor = g >= 74 && g < 300;        // el medidor en la penumbra (bajo el zoom-through)
  const bgLinterna = g >= 288 && g < 520;      // él frente al medidor con la lámpara de gancho
  const bgPinza = g >= 507 && g < 628;         // CORTE EN EL BEAT: los dígitos trepando (121 f)
  const bgPagina2 = g >= 596 && g < 756;       // ⛔ LA PÁGINA DEL SALTO DEL BUCLE
  const bgEtiqueta = g >= 740 && g < 1180;     // la etiqueta blanca al sol de mediodía
  const bgGira = g >= 1163 && g < 1320;        // él inclinando el panel (bajo la oclusión de marco)
  const bgDigital = g >= 1308 && g < 1500;     // la cara del medidor digital (bajo el wipe)
  const bgRuedas = g >= 1492 && g < G_END;     // las ruedas del contador (CORTE EN EL BEAT)

  // ── las tres rayas: la 1ª se escribe en el acto 0, la 2ª en la página del salto, la 3ª al final
  const opPag1 = clamp01((g - 18) / 14) * clamp01(1 - (g - 96) / 16);
  const opPag2 = clamp01((g - 626) / 14) * clamp01(1 - (g - 748) / 16);
  const opPag3 = clamp01((g - 1660) / 14);

  return (
    <AbsoluteFill>
      {/* ════ EL MUNDO — todo lo que puede tapar al avatar vive acá dentro, y ESTO es lo único que
          el renglón recorta. Ni un solo píxel de estas capas llega nunca a su cara. ════ */}
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {/* (b) DE LA GARANTÍA DE OPACIDAD: la atmósfera va FUERA de `Layers` (fuera de la cámara)
            y trae `backgroundColor: V.ink0` opaco. No existe un frame sin el cuadro pintado. */}
        <VoltAtmos
          tint={light(coolMix, "volt", "sky")} tint2={V.amber}
          keyFrom={keyFrom} intensity={inten} floor={floorDim}
        />
        {/* EL SOL ES UN PERSONAJE. La luz siempre por su FUENTE: lo que te COBRAN entra desde
            ARRIBA y en FRÍO; lo que te QUEDA, desde ABAJO y en CÁLIDO. */}
        <SunKey ang={sunAng} temp="amber" amb={warmW * amb} soft={66} />
        <SunKey ang={95} temp="sky" amb={coldW * amb * 0.82} soft={82} />
        <SunKey ang={sunAng} temp="white" amb={dayW * amb * 0.7} soft={90} />

        <Layers cam={cam}>
          {/* ── ACTO 0 · LA HOJA DEL CUADERNO SOBRE LA MESA. Materia ENTRANTE, a sangre.
              (c) DE LA GARANTÍA: `scale` ≥ 1,30 en todo momento. ─────────────────────────── */}
          {bgPagina1 && (
            <Plane z={-840} style={zs}>
              <PhotoPlane src="img/cmepanel30/cmep30_s11_anota_tres_numeros.png" kind="photo" z={0}
                scale={interpolate(g, [0, 60, 124], [1.44, 1.34, 1.30], CL)}
                dim={interpolate(g, [0, 40, 92, 124], [0.44, 0.34, 0.32, 0.4], CL)} tint={V.white} />
            </Plane>
          )}
          {/* la PRIMERA raya de grafito. Se escribe @52-74 y es el punto de fuga del zoom-through. */}
          {bgPagina1 && (
            <Plane z={-812} style={{ ...hojaSync(cf), opacity: opPag1 }}>
              <Trazo g={g} at={52} x={20} y={46} w={210} dur={22} />
            </Plane>
          )}

          {/* ── ACTO 1a · EL MEDIDOR EN LA PENUMBRA AZUL. Escala MACRO: la lucecita roja. ──── */}
          {bgMedidor && (
            <Plane z={-880}>
              <PhotoPlane src="img/cmepanel30/cmep30_s11_medidor_parpadeo.png" kind="photo" z={0}
                scale={interpolate(g, [74, 160, 300], [1.62, 1.42, 1.34], CL)}
                dim={interpolate(g, [74, 120, 240, 300], [0.48, 0.34, 0.36, 0.44], CL)} tint={V.sky} />
            </Plane>
          )}
          {/* ── ACTO 1b · ÉL FRENTE AL MEDIDOR, DE NOCHE. El cambio de cama cae ADENTRO del
              match-shape @250-316: la propia caja que crece hace de tapa. ─────────────────── */}
          {bgLinterna && (
            <Plane z={-900}>
              <PhotoPlane src="img/cmepanel30/cmep30_s11_claudio_medidor_linterna.png" kind="photo" z={0}
                scale={interpolate(g, [288, 400, 520], [1.46, 1.34, 1.30], CL)}
                dim={interpolate(g, [288, 350, 460, 520], [0.5, 0.38, 0.4, 0.48], CL)} tint={V.sky} />
            </Plane>
          )}
          {/* ── ACTO 1c · LOS DÍGITOS DE LA PINZA TREPANDO. CORTE EN EL BEAT @507, exacto. ── */}
          {bgPinza && (
            <Plane z={-860}>
              <PhotoPlane src="broll/cmepanel30/cmep30_s11_clip_pinza_digitos.mp4" kind="video" z={0}
                startFrom={0}
                scale={interpolate(g, [507, 570, 628], [1.52, 1.40, 1.46], CL)}
                dim={interpolate(g, [507, 550, 600, 628], [0.44, 0.34, 0.36, 0.46], CL)} tint={V.volt} />
            </Plane>
          )}

          {/* ══ ACTO 2a ⛔⛔ LA PÁGINA DEL SALTO DEL BUCLE (596-756) ═══════════════════════════
              A sangre, cenital, sin una sola ventana ni tarjeta flotante. Acá se escribe la
              SEGUNDA raya. `scale` ≥ 1,46 y la cámara con `push` ≥ 1,05: cobertura ≥ 1,53. ══ */}
          {bgPagina2 && (
            <Plane z={-870}>
              <PhotoPlane src="img/cmepanel30/cmep30_s11_anota_tres_numeros.png" kind="photo" z={0}
                scale={interpolate(g, [596, 660, 756], [1.62, 1.52, 1.46], CL)}
                dim={interpolate(g, [596, 640, 716, 756], [0.46, 0.3, 0.3, 0.42], CL)} tint={V.white} />
            </Plane>
          )}
          {/* la primera raya YA ESTÁ escrita (con su fila) y la SEGUNDA se escribe @646-670.
              ⛔ Nada de "1." ni "2.": lo que avanza es el cuaderno. */}
          {bgPagina2 && (
            <Plane z={-842} style={{ ...hojaSync(cf), opacity: opPag2 }}>
              <Trazo g={g} at={626} x={16} y={40} w={196} dur={10} />
              <Manuscrito x={28} y={40} size={44} peso={600}
                op={clamp01((g - 632) / 14)}>TU CONSUMO DE FONDO</Manuscrito>
              <Trazo g={g} at={646} x={16} y={58} w={196} dur={24} />
              <Manuscrito x={28} y={58} size={64}
                op={clamp01((g - 672) / 16)}>LO QUE DA DE VERDAD EN TU PARED</Manuscrito>
              <Manuscrito x={28} y={74} size={46} peso={600}
                op={clamp01((g - 700) / 16) * clamp01(1 - (g - 742) / 14)}>NO LO QUE DICE LA ETIQUETA</Manuscrito>
            </Plane>
          )}

          {/* ── ACTO 2b · LA ETIQUETA BLANCA DEL DORSO, AL SOL DE MEDIODÍA. El cambio de cama
              cae ADENTRO del match-shape @730-806. ────────────────────────────────────────── */}
          {bgEtiqueta && (
            <Plane z={-890}>
              <PhotoPlane src="img/cmepanel30/cmep30_s11_etiqueta_dorso_panel.png" kind="photo" z={0}
                scale={interpolate(g, [740, 900, 1060, 1180], [1.48, 1.30, 1.24, 1.34], CL)}
                dim={interpolate(g, [740, 820, 1000, 1180], [0.5, 0.36, 0.34, 0.46], CL)} tint={V.white} />
            </Plane>
          )}
          {/* ── ACTO 2c · ÉL INCLINANDO EL PANEL. El swap cae ADENTRO de la oclusión de marco. ─ */}
          {bgGira && (
            <Plane z={-910}>
              <PhotoPlane src="img/cmepanel30/cmep30_s11_gira_panel_etiqueta.png" kind="photo" z={0}
                scale={interpolate(g, [1163, 1240, 1320], [1.44, 1.32, 1.30], CL)}
                dim={interpolate(g, [1163, 1210, 1280, 1320], [0.5, 0.36, 0.38, 0.48], CL)} tint={V.amber} />
            </Plane>
          )}

          {/* ── ACTO 3a · LA CARA DEL MEDIDOR DIGITAL, DE DÍA. El swap cae en la arenilla. ─── */}
          {bgDigital && (
            <Plane z={-880} style={zs2}>
              <PhotoPlane src="img/cmepanel30/cmep30_s11_medidor_digital_pantalla.png" kind="photo" z={0}
                scale={interpolate(g, [1308, 1380, 1500], [1.48, 1.34, 1.30], CL)}
                dim={interpolate(g, [1308, 1350, 1450, 1500], [0.48, 0.34, 0.36, 0.44], CL)} tint={V.amber} />
            </Plane>
          )}
          {/* ── ACTO 3b · LAS RUEDAS DEL CONTADOR. CORTE EN EL BEAT @1492, exacto. Sostiene el
              cuadro hasta el final: es la cama de la que nace el match-shape del cierre. ──── */}
          {bgRuedas && (
            <Plane z={-930}>
              <PhotoPlane src="img/cmepanel30/cmep30_s6_ruedas_numeros.png" kind="photo" z={0}
                scale={interpolate(g, [1492, 1560, 1650, G_END], [1.46, 1.34, 1.30, 1.32], CL)}
                dim={interpolate(g, [1492, 1540, 1620, G_END], [0.46, 0.34, 0.38, 0.5], CL)} tint={V.amber} />
            </Plane>
          )}

          {/* ══ COSTURA INTERNA @1630 · MATCH-SHAPE — LAS RUEDAS SE VUELVEN LA HOJA ═══════════
              La ventanita del contador (cifras impresas) crece hasta pasarse del cuadro y se
              repinta DESDE EL CENTRO hacia los dos costados hasta ser la hoja de las tres filas
              (cifras escritas a mano). Es la MATERIA que cruza hacia MovS12Cierre, y termina a
              sangre, que es exactamente como S12 la monta en su frame 0. ═══════════════════ */}
          {g >= 1624 && (
            <Plane z={-300}>
              <Morf
                g={g} cf={cf}
                srcA="img/cmepanel30/cmep30_s6_ruedas_numeros.png" kindA="photo"
                srcB="broll/cmepanel30/cmep30_s11_clip_escribe_tres.mp4" kindB="video"
                at={1624} grow={64} repAt={1650} repDur={46} dir="centro"
                x={50} y={49} w0={520} h0={312} w1={2600} h1={1500}
                z={0} ry={0} rx={0} litA={V.amber} litB={V.white}
                startFromB={0} radius0={14} radius1={2}
              />
            </Plane>
          )}
          {/* LAS TRES RAYAS, juntas por primera y única vez. ⛔ No son tres tarjetas: son tres
              renglones de grafito sobre el papel, escritos a lo largo de todo el movimiento. */}
          {g >= 1656 && (
            <Plane z={-276} style={{ ...hojaSync(cf), opacity: opPag3 }}>
              <Trazo g={g} at={1660} x={14} y={44} w={188} dur={9} />
              <Manuscrito x={25} y={44} size={46} peso={600}
                op={clamp01((g - 1672) / 14)}>TU CONSUMO DE FONDO</Manuscrito>
              <Trazo g={g} at={1676} x={14} y={60} w={188} dur={9} />
              <Manuscrito x={25} y={60} size={46} peso={600}
                op={clamp01((g - 1690) / 14)}>LO QUE DA EN TU PARED</Manuscrito>
              <Trazo g={g} at={1690} x={14} y={76} w={188} dur={22} />
              <Manuscrito x={25} y={76} size={46} peso={600}
                op={clamp01((g - 1704) / 14)}>QUÉ HACE TU MEDIDOR</Manuscrito>
            </Plane>
          )}
        </Layers>
      </AbsoluteFill>

      {/* los cantos del renglón: el brillo sale SIEMPRE hacia el mundo, jamás hacia la cara */}
      {cov.open && (
        <>
          <CantoV x={cov.gL} dir={-1} hot={cantoHot} />
          <CantoV x={cov.gR} dir={1} hot={cantoHot} />
          {cov.top > 0.5 && cov.top < 99.4 && <CantoRaya c={cov} hot={cantoHot} />}
        </>
      )}

      {/* ════ EL PRIMER PLANO — no está recortado. Con el renglón ABIERTO todo vive por encima
          del canto: durante las cuatro ventanas nada baja de y = 52 %, y el techo del hueco nunca
          sube de 63 %. Contención. ════ */}
      <Layers cam={cam}>

        {/* ═══ ACTO 0 · "LOS TRES NÚMEROS QUE TIENES QUE ANOTAR HOY" ══════════════════════════
            Pantalla completa sobre la hoja. Ni una tarjeta: el material ES el plano. ════════ */}
        <Plane z={96} style={zs}>
          <Cartel g={g} at={14} out={100} x={50} y={28} size={64} color={V.white}>
            LOS <span style={{ color: V.volt }}>TRES NÚMEROS</span>
          </Cartel>
          <Rotulo x={50} y={44} size={42} color={rgba(V.bone, 0.95)}
            op={clamp01((g - 34) / 14) * clamp01(1 - (g - 104) / 14)}>
            QUE TIENES QUE ANOTAR HOY
          </Rotulo>
        </Plane>

        {/* ═══ ACTO 1 · NÚMERO UNO: TU CONSUMO DE FONDO ═══════════════════════════════════════ */}
        {g >= 96 && g < 636 && (
          <>
            <Plane z={98}>
              <Cartel g={g} at={104} out={244} x={50} y={26} size={62} color={V.white}
                kick="EL PRIMERO" tipo="cobran">
                TU <span style={{ color: V.volt }}>CONSUMO DE FONDO</span>
              </Cartel>
            </Plane>

            {/* la lucecita real, en su propio latido */}
            {g >= 132 && g < 268 && (
              <Plane z={80}>
                <MediaCard src="broll/cmepanel30/cmep30_s11_clip_parpadeo_medidor.mp4" kind="video"
                  w={452} h={272}
                  x={lerp(-16, 32, es(clamp01((g - 132) / 34)))}
                  y={lerp(40, 36, es(clamp01((g - 132) / 60)))}
                  z={0} ry={12} rx={-2} startFrom={2} lit={1} litColor={V.sky}
                  label="LA LUCECITA, EN LA PENUMBRA" sheenAt={toCF(198)} radius={12} />
              </Plane>
            )}

            {/* EL MECANISMO: la cuenta sube EN EL FRAME del pulso, no cerca */}
            <Plane z={94}>
              <Cuenta g={g} cf={cf} x={70} y={40}
                op={clamp01((g - 136) / 14) * clamp01(1 - (g - 240) / 16)} />
            </Plane>
            <Plane z={99}>
              <Rotulo x={50} y={50} size={42} color={rgba(V.volt, 0.96)}
                op={clamp01((g - 150) / 14) * clamp01(1 - (g - 236) / 16)}>
                CON LA CASA TRANQUILA
              </Rotulo>
            </Plane>

            {/* ═══ COSTURA INTERNA @250 · MATCH-SHAPE ══════════════════════════════════════
                La tarjeta de él contando NO suelta el cuadro: crece y su superficie se repinta
                de ARRIBA HACIA ABAJO hasta ser la pantalla de la pinza. ══════════════════ */}
            {g >= 236 && g < 404 && (
              <Plane z={70}>
                <div style={{ opacity: clamp01((g - 236) / 12) * clamp01(1 - (g - 386) / 18) }}>
                  <Morf
                    g={g} cf={cf}
                    srcA="img/cmepanel30/cmep30_s5_contando_parpadeos.png" kindA="photo"
                    srcB="img/cmepanel30/cmep30_s11_pinza_doscientos.png" kindB="photo"
                    at={250} grow={66} repAt={268} repDur={42} dir="abajo"
                    x={44} y={44} w0={470} h0={282} w1={1120} h1={640}
                    z={0} ry={0} rx={0} litA={V.sky} litB={V.volt}
                    labelA="ÉL, CONTANDO" labelB="LA PINZA NO OPINA"
                    radius0={14} radius1={5}
                  />
                </div>
              </Plane>
            )}

            {/* LA CIFRA — y LA BISAGRA del corte en el beat @507: misma x, misma y, mismo cuerpo
                a los dos lados del filo. Sólo cambia el valor. */}
            {g >= 300 && g < 507 && (() => {
              const fl = flujo("cobran", clamp01((g - 300) / 22));
              return (
                <Plane z={101}>
                  <div style={{ transform: `translateY(${(fl.dy * 0.3).toFixed(1)}px)`, opacity: fl.opacity }}>
                    <Readout value="200" unit="W" label="SI TE DA MENOS DE" at={toCF(304)}
                      x={62} y={40} size={178} color={V.volt} />
                  </div>
                </Plane>
              );
            })()}
            {g >= 507 && g < 604 && (
              <Plane z={101}>
                <Readout value="500" unit="W" label="SI TE DA MÁS DE" at={toCF(507)}
                  x={62} y={40} size={178} color={V.volt} />
              </Plane>
            )}

            <Plane z={98}>
              <Cartel g={g} at={300} out={402} x={50} y={26} size={62} color={V.white}>
                MENOS DE <span style={{ color: V.volt }}>200 W</span>
              </Cartel>
              <Cartel g={g} at={408} out={500} x={50} y={26} size={54} color={V.white}>
                UN KIT DE <span style={{ color: V.volt }}>900</span> TE SOBRA
              </Cartel>
              <Rotulo x={50} y={50} size={42} color={rgba(V.amber, 0.96)}
                op={clamp01((g - 430) / 14) * clamp01(1 - (g - 488) / 14)}>
                EMPIEZA CON UNO SOLO
              </Rotulo>
            </Plane>

            {g >= 330 && g < 460 && (
              <Plane z={82}>
                <MediaCard src="broll/cmepanel30/cmep30_s10_clip_caja_kit.mp4" kind="video"
                  w={432} h={260}
                  x={lerp(-16, 32, es(clamp01((g - 330) / 32)))}
                  y={lerp(40, 36, es(clamp01((g - 330) / 56)))}
                  z={0} ry={12} rx={-2} startFrom={2} lit={1} litColor={V.volt}
                  label="UN KIT DE 900" sheenAt={toCF(392)} radius={12} />
              </Plane>
            )}
            {g >= 430 && g < 500 && (
              <Plane z={84}>
                <MediaCard src="broll/cmepanel30/cmep30_s3c_apoya_panel_soporte.mp4" kind="video"
                  w={412} h={248}
                  x={lerp(116, 70, es(clamp01((g - 430) / 28)))}
                  y={lerp(40, 36, es(clamp01((g - 430) / 46)))}
                  z={0} ry={-12} rx={2} startFrom={4} lit={1} litColor={V.amber}
                  label="EMPIEZA CON UNO" sheenAt={toCF(474)} radius={12} />
              </Plane>
            )}

            {/* ═══ COSTURA INTERNA @507 · CORTE EN EL BEAT ═════════════════════════════════ */}
            <Plane z={98}>
              <Cartel g={g} at={508} out={598} x={50} y={26} size={62} color={V.white}>
                MÁS DE <span style={{ color: V.volt }}>500 W</span>
              </Cartel>
              <Rotulo x={50} y={50} size={42} color={rgba(V.volt, 0.96)}
                op={clamp01((g - 516) / 14) * clamp01(1 - (g - 592) / 12)}>
                TE VA A RENDIR MUCHÍSIMO
              </Rotulo>
            </Plane>
            {g >= 512 && g < 600 && (
              <Plane z={82}>
                <MediaCard src="img/cmepanel30/cmep30_s11_aire_central_unidad.png" kind="photo"
                  w={412} h={248}
                  x={lerp(-16, 32, es(clamp01((g - 512) / 30)))}
                  y={lerp(40, 36, es(clamp01((g - 512) / 50)))}
                  z={0} ry={12} rx={-2} lit={0.96} litColor={V.sky}
                  label="SI TU CASA COME MUCHO" sheenAt={toCF(566)} radius={12} />
              </Plane>
            )}
            <Plane z={92}>
              <IconPng src="img/cmepanel30/cmep30_ic_medidor.png" x={26} y={62} size={108}
                opacity={clamp01((g - 168) / 14) * clamp01(1 - (g - 240) / 14) * 0.9}
                rot={-5} glow={V.ink0} />
            </Plane>
          </>
        )}

        {/* ═══ ACTO 2 · NÚMERO DOS: LA ETIQUETA MIENTE ════════════════════════════════════════
            ⛔ 619-756 NO tiene ni una tarjeta flotante: es LA PÁGINA a sangre. El primer plano
            del acto arranca recién con el match-shape @730. ═════════════════════════════════ */}
        {g >= 726 && g < 1320 && (
          <>
            {/* ═══ COSTURA INTERNA @730 · MATCH-SHAPE — UN RENGLÓN DE LA HOJA SE VUELVE LA
                ETIQUETA. Papel blanco → etiqueta blanca: el mismo rectángulo pálido, otra
                materia. Y desde @838 se va por EL RIEL del match-move. ═══════════════════ */}
            {g >= 726 && g < 900 && (
              <Plane z={68}>
                <div style={{ opacity: clamp01((g - 726) / 10) * clamp01(1 - (g - 878) / 20) }}>
                  <Morf
                    g={g} cf={cf}
                    srcA="img/cmepanel30/cmep30_s11_anota_tres_numeros.png" kindA="photo"
                    srcB="img/cmepanel30/cmep30_s11_etiqueta_dorso_panel.png" kindB="photo"
                    at={730} grow={70} repAt={760} repDur={46} dir="derecha"
                    x={50} y={48} w0={560} h0={96} w1={1360} h1={720}
                    z={0} ry={0} rx={0} litA={V.white} litB={V.white}
                    labelB="LO QUE DICE LA ETIQUETA"
                    radius0={10} radius1={4}
                    offX={rielMM(g)}
                  />
                </div>
              </Plane>
            )}

            {/* ═══ COSTURA INTERNA @838 · MATCH-MOVE ═══════════════════════════════════════
                La tarjeta del renglón se va y ÉSTA llega sobre EL MISMO RIEL: misma velocidad,
                misma dirección, misma distancia (102 % de pantalla). Cinta, no dos entradas. */}
            {g >= 838 && g < 968 && (
              <Plane z={80}>
                <MediaCard src="broll/cmepanel30/cmep30_s11_clip_levanta_panel_etiqueta.mp4" kind="video"
                  w={452} h={272} x={140 + rielMM(g)} y={36}
                  z={0} ry={-11} rx={2} startFrom={2} lit={1} litColor={V.white}
                  label="LA ETIQUETA, AL SOL" sheenAt={toCF(902)} radius={12} />
              </Plane>
            )}

            {/* LAS DOS BARRAS sobre la etiqueta real: 900 de fábrica contra 740 de tu pared.
                El 900 baja FRÍO desde arriba (es la promesa de la etiqueta, viene de afuera);
                el 740 sube CÁLIDO desde abajo (es lo que TE QUEDA en la pared). */}
            {g >= 846 && g < 1010 && (() => {
              const op = clamp01((g - 846) / 14) * clamp01(1 - (g - 992) / 16);
              const fl9 = flujo("cobran", clamp01((g - 846) / 22));
              return (
                <Plane z={96}>
                  <div style={{ transform: `translateY(${(fl9.dy * 0.24).toFixed(1)}px)`, opacity: op }}>
                    <Barra g={g} at={848} x={22} y={30} wMax={880} frac={1} color={V.sky} op={1} />
                    <Readout value="900" unit="W" label="DICE LA ETIQUETA" at={toCF(852)}
                      x={70} y={24} size={112} color={V.sky} align="left" />
                  </div>
                  <div style={{ opacity: clamp01((g - 906) / 14) * clamp01(1 - (g - 992) / 16) }}>
                    <Barra g={g} at={908} x={22} y={45} wMax={880} frac={0.822} color={V.amber} op={1} />
                    <Readout value="740" unit="W" label="DIO EN LA PARED" at={toCF(912)}
                      x={64} y={51} size={112} color={V.amber} align="left" />
                  </div>
                </Plane>
              );
            })()}

            <Plane z={99}>
              <Cartel g={g} at={880} out={1000} x={50} y={12} size={56} color={V.white}
                kick="EL SEGUNDO">
                NUNCA PASÓ DE <span style={{ color: V.amber }}>740</span>
              </Cartel>
            </Plane>

            {g >= 968 && g < 1090 && (
              <Plane z={82}>
                <MediaCard src="img/cmepanel30/cmep30_s10_caja_kit.png" kind="photo"
                  w={408} h={246}
                  x={lerp(116, 70, es(clamp01((g - 968) / 30)))}
                  y={lerp(38, 34, es(clamp01((g - 968) / 52)))}
                  z={0} ry={-12} rx={2} lit={0.96} litColor={V.sky}
                  label="LO QUE DICE LA CAJA" sheenAt={toCF(1030)} radius={12} />
              </Plane>
            )}

            {/* NO ES ESTAFA, ES FÍSICA: 25 grados de laboratorio contra 50 al sol de verdad. */}
            <Plane z={99}>
              <Cartel g={g} at={1016} out={1146} x={50} y={16} size={52} color={V.white}>
                LA ETIQUETA SE MIDE A <span style={{ color: V.sky }}>25°</span>
              </Cartel>
              <Rotulo x={50} y={52} size={44} color={rgba(V.amber, 0.96)}
                op={clamp01((g - 1064) / 14) * clamp01(1 - (g - 1140) / 14)}>
                TU PANEL ESTÁ A 50
              </Rotulo>
            </Plane>
            {g >= 1002 && g < 1132 && (
              <Plane z={80}>
                <MediaCard src="broll/cmepanel30/cmep30_s11_clip_toca_panel_caliente.mp4" kind="video"
                  w={442} h={266}
                  x={lerp(-16, 32, es(clamp01((g - 1002) / 32)))}
                  y={lerp(42, 38, es(clamp01((g - 1002) / 56)))}
                  z={0} ry={12} rx={-2} startFrom={2} lit={1} litColor={V.white}
                  label="EL VIDRIO QUEMA" sheenAt={toCF(1066)} radius={12} />
              </Plane>
            )}
            {g >= 1058 && g < 1190 && (
              <Plane z={84}>
                <MediaCard src="img/cmepanel30/cmep30_s11_termometro_sobre_panel.png" kind="photo"
                  w={418} h={252}
                  x={lerp(116, 70, es(clamp01((g - 1058) / 30)))}
                  y={lerp(44, 40, es(clamp01((g - 1058) / 52)))}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.amber}
                  label="50 GRADOS EN TU PARED" sheenAt={toCF(1122)} radius={12} />
              </Plane>
            )}
            <Plane z={92}>
              <IconPng src="img/cmepanel30/cmep30_ic_lupa.png" x={26} y={20} size={104}
                opacity={clamp01((g - 1022) / 14) * clamp01(1 - (g - 1140) / 14) * 0.92}
                rot={6} glow={V.ink0} />
              <IconPng src="img/cmepanel30/cmep30_ic_sol.png" x={78} y={18} size={98}
                opacity={clamp01((g - 1046) / 14) * clamp01(1 - (g - 1140) / 14) * 0.9}
                rot={-4} glow={V.ink0} />
            </Plane>

            {/* LA REGLA PRÁCTICA: las MISMAS barras vuelven y a la de 900 le comen el 20 %.
                No es una tarjeta nueva: es la conclusión de la que ya estaba. */}
            {g >= 1176 && g < 1306 && (() => {
              const op = clamp01((g - 1176) / 14) * clamp01(1 - (g - 1288) / 16);
              const corte = es(clamp01((g - 1192) / 44));
              return (
                <Plane z={96}>
                  <div style={{ opacity: op }}>
                    <Barra g={g} at={1178} x={22} y={34} wMax={880} frac={lerp(1, 0.8, corte)}
                      color={V.sky} op={1} />
                    <Barra g={g} at={1186} x={22} y={49} wMax={880} frac={0.822}
                      color={V.amber} op={1} />
                    <IconPng src="img/cmepanel30/cmep30_ic_regla.png"
                      x={lerp(68, 58, corte)} y={41} size={132} opacity={0.94 * op} rot={2}
                      glow={V.ink0} />
                    <Readout value="-20" unit="%" label="CUENTA CON" at={toCF(1198)}
                      x={74} y={26} size={128} color={V.volt} align="left" />
                  </div>
                </Plane>
              );
            })()}
            <Plane z={99}>
              <Cartel g={g} at={1176} out={1296} x={50} y={12} size={62} color={V.white}>
                CUENTA CON UN <span style={{ color: V.volt }}>20% MENOS</span>
              </Cartel>
              <Rotulo x={50} y={62} size={42} color={rgba(V.bone, 0.94)}
                op={clamp01((g - 1216) / 14) * clamp01(1 - (g - 1290) / 12)}>
                Y NO TE LLEVAS SORPRESAS
              </Rotulo>
            </Plane>
            {g >= 1190 && g < 1306 && (
              <Plane z={78}>
                <MediaCard src="img/cmepanel30/cmep30_s11_panel_junto_aire.png" kind="photo"
                  w={392} h={236}
                  x={lerp(-16, 30, es(clamp01((g - 1190) / 28)))}
                  y={lerp(38, 34, es(clamp01((g - 1190) / 48)))}
                  z={0} ry={12} rx={-2} lit={0.94} litColor={V.white}
                  label="LO QUE DE VERDAD LLEGA" sheenAt={toCF(1252)} radius={11} />
              </Plane>
            )}
          </>
        )}

        {/* ═══ ACTO 3 · NÚMERO TRES: EL MEDIDOR ═══════════════════════════════════════════════
            El mismo objeto del número uno, pero de día, en escala de pared y con OTRA pregunta:
            no cuánto comes, sino qué hace con lo que te sobra. ══════════════════════════════ */}
        {g >= 1312 && (
          <>
            <Plane z={99}>
              <Cartel g={g} at={1320} out={1440} x={50} y={20} size={54} color={V.white}
                kick="Y EL TERCERO" tipo="cobran">
                QUÉ HACE TU MEDIDOR<br />CON <span style={{ color: V.amber }}>LO QUE SOBRA</span>
              </Cartel>
            </Plane>

            {g >= 1326 && g < 1452 && (
              <Plane z={80} style={zs2}>
                <MediaCard src="broll/cmepanel30/cmep30_s11_clip_foto_medidor.mp4" kind="video"
                  w={442} h={266}
                  x={lerp(116, 66, es(clamp01((g - 1326) / 32)))}
                  y={lerp(40, 36, es(clamp01((g - 1326) / 56)))}
                  z={0} ry={-11} rx={2} startFrom={2} lit={1} litColor={V.torch}
                  label="LA PRIMERA FOTO" sheenAt={toCF(1388)} radius={12} />
              </Plane>
            )}

            {/* ═══ COSTURA INTERNA @1400 · ZOOM-THROUGH — se monta 12 f ANTES y por DEBAJO ══ */}
            {g >= 1388 && g < 1520 && (
              <Plane z={72}>
                <MediaCard src="broll/cmepanel30/cmep30_s11_clip_reloj_diez_minutos.mp4" kind="video"
                  w={lerp(360, 448, es(clamp01((g - 1388) / 60)))}
                  h={lerp(216, 270, es(clamp01((g - 1388) / 60)))}
                  x={lerp(-16, 34, es(clamp01((g - 1400) / 32)))}
                  y={lerp(44, 40, es(clamp01((g - 1400) / 56)))}
                  z={0} ry={12} rx={-2} startFrom={0} lit={1} litColor={V.amber}
                  label="DIEZ MINUTOS" sheenAt={toCF(1462)} radius={12} />
              </Plane>
            )}
            <Plane z={101}>
              <div style={{
                opacity: clamp01((g - 1414) / 14) * clamp01(1 - (g - 1480) / 14),
              }}>
                <Readout value="10" unit="MIN" label="Y DOS FOTOS" at={toCF(1416)}
                  x={70} y={30} size={158} color={V.volt} />
              </div>
              <IconPng src="img/cmepanel30/cmep30_ic_reloj.png" x={44} y={22} size={102}
                opacity={clamp01((g - 1420) / 14) * clamp01(1 - (g - 1478) / 12) * 0.92}
                rot={-6} glow={V.ink0} />
            </Plane>

            {/* ═══ COSTURA INTERNA @1492 · CORTE EN EL BEAT ════════════════════════════════
                LA BISAGRA es EL RECTÁNGULO DE LA PANTALLA: la misma tarjeta, la misma x/y, el
                mismo tamaño y el mismo marco a los dos lados del filo. Sólo cambia lo de
                adentro. 40 frames antes y 68 después. ══════════════════════════════════════ */}
            {g >= 1452 && g < 1492 && (
              <Plane z={86}>
                <MediaCard src="img/cmepanel30/cmep30_s11_telefono_contra_medidor.png" kind="photo"
                  w={440} h={264} x={64} y={42}
                  z={0} ry={-10} rx={2} lit={1} litColor={V.torch}
                  label="LA LECTURA DE ANTES" radius={12} />
              </Plane>
            )}
            {g >= 1492 && g < 1560 && (
              <Plane z={86}>
                <MediaCard src="img/cmepanel30/cmep30_s6_ruedas_numeros.png" kind="photo"
                  w={440} h={264} x={64} y={42}
                  z={0} ry={-10} rx={2} lit={1} litColor={V.danger}
                  label="Y LA DE DESPUÉS" sheenAt={toCF(1508)} radius={12} />
              </Plane>
            )}

            <Plane z={99}>
              <Cartel g={g} at={1496} out={1614} x={50} y={20} size={66} color={V.white} tipo="cobran">
                SI EL NÚMERO <span style={{ color: V.danger }}>SUBE</span>
              </Cartel>
              <Rotulo x={50} y={52} size={44} color={rgba(V.volt, 0.96)}
                op={clamp01((g - 1530) / 14) * clamp01(1 - (g - 1606) / 12)}>
                NO COMPRES NADA TODAVÍA
              </Rotulo>
            </Plane>
            {g >= 1500 && g < 1626 && (
              <Plane z={80}>
                <MediaCard src="broll/cmepanel30/cmep30_s11_clip_niega_cabeza.mp4" kind="video"
                  w={422} h={254}
                  x={lerp(-16, 30, es(clamp01((g - 1500) / 30)))}
                  y={lerp(40, 36, es(clamp01((g - 1500) / 52)))}
                  z={0} ry={12} rx={-2} startFrom={2} lit={1} litColor={V.amber}
                  label="HASTA CAMBIAR EL MEDIDOR" sheenAt={toCF(1564)} radius={12} />
              </Plane>
            )}

            {/* EL REMATE: es el único de los tres que te puede COSTAR dinero. Entra FRÍO Y DESDE
                ARRIBA, porque es lo que te cobran. */}
            <Plane z={100}>
              <Cartel g={g} at={1616} out={1716} x={50} y={18} size={54} color={V.white} tipo="cobran">
                EL ÚNICO QUE TE PUEDE<br /><span style={{ color: V.danger }}>COSTAR DINERO</span>
              </Cartel>
            </Plane>
            {g >= 1616 && g < 1740 && (
              <Plane z={78}>
                <MediaCard src="broll/cmepanel30/cmep30_s5_clip_lucecita_pulsa.mp4" kind="video"
                  w={392} h={236}
                  x={lerp(116, 74, es(clamp01((g - 1616) / 28)))}
                  y={lerp(32, 28, es(clamp01((g - 1616) / 48)))}
                  z={0} ry={-12} rx={2} startFrom={2} lit={0.96} litColor={V.danger}
                  label="EL MISMO DE ANTES · OTRA PREGUNTA" sheenAt={toCF(1678)} radius={11} />
              </Plane>
            )}
            <Plane z={92}>
              <IconPng src="img/cmepanel30/cmep30_ic_billete.png" x={26} y={26} size={112}
                opacity={clamp01((g - 1626) / 14) * clamp01(1 - (g - 1712) / 14) * 0.92}
                rot={-6} glow={V.ink0} />
            </Plane>
          </>
        )}
      </Layers>

      {/* ════ LAS COSTURAS QUE TIENEN QUE TAPAR EL 100 % — van FUERA del contenedor recortado y
          FUERA de la cámara: una oclusión achicada por el `push` deja una rendija. ════ */}

      {/* ⛔⛔ FRONTERA B @606 · LA HOJA DEL CUADERNO. Tapa el 100 % entre 612 y 630, o sea
          ADENTRO de la ventana obligatoria 604-694. ⛔ Color PAPEL, jamás el del fondo. */}
      <OcluyeHoja g={g} at={606} dur={34} />

      {/* COSTURA INTERNA @1155 · EL ALUMINIO DEL MARCO. Tapa el 100 % entre 1163 y 1174. */}
      <OcluyeMarco g={g} at={1155} dur={32} />

      {/* FRONTERA C @1300 · WIPE POR MATERIA: la arenilla del revoque. Las bocanadas las pone el
          Stage; la cobertura maciza (1310-1332), `ArenillaTapa`. ⛔ Color ARENILLA. */}
      <SeamWipeMatter at={toCF(1300)} dur={42} tint={ARENILLA} />
      <ArenillaTapa g={g} at={1300} dur={42} />
    </AbsoluteFill>
  );
};
