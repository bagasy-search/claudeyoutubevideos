// MovS6Cobra.tsx — MOVIMIENTO S6 · "EL MEDIDOR QUE TE COBRA LO QUE LE REGALÁS"
// Video `cmepanel30` (Claudio Mendoza Constructor, ES). 5 actos · 0 → 2340 frames @30 = 78,00 s.
// Tramo global 18695 → 21035. Se monta ENCIMA del avatar real de Claudio.
//
// ⛔⛔ REQUISITO ESTRUCTURAL — ESTE MOVIMIENTO TAPA UN SALTO DEL VIDEO DE FONDO.
//     El frame 0 de este archivo ES el frame global 18695: el mp4 del avatar vuelve a cero ahí y
//     Claudio cambia de pose de golpe (el avatar dura 10:22 y el audio 24:15, así que va en BUCLE).
//     Por eso los PRIMEROS 90 FRAMES (3,00 s) van a PANTALLA COMPLETA, opacos, sin una sola
//     ventana. La opacidad está garantizada por TRES capas independientes, ninguna de las cuales
//     depende de las otras (ver §OPACIDAD más abajo).
//     Y el frame 0 NO es una rampa desde negro: la imagen entra YA FORMADA (rampa de ambiente de
//     12 frames que arranca en 0,88 de su valor final, no en 0), porque viene de una escena en
//     curso — el tramo de los dos primeros medidores.
//
// ⛔ Y ADEMÁS: acá el avatar está EN BUCLE y su lipsync NO coincide con la voz. Funciona como
//    FONDO, nunca como plano sostenido. Las tres ventanas suman 241 de 2340 frames (10,3 %), son
//    angostas, y ninguna pasa de 100 frames. Y con el hueco ABIERTO no queda un solo elemento
//    del primer plano adentro de él: sólo un rótulo por encima del canto superior. ⛔ Ninguna capa de color con opacidad sobre su
//    cara: las ventanas son GEOMETRÍA (`clip-path`), y todo el brillo de los cantos sale hacia
//    AFUERA, hacia el mundo.
//
// ── CÓMO ESTÁ CONSTRUIDO ──────────────────────────────────────────────────────────────────────
// 1. EL MUNDO (atmósfera + soles + fondos a sangre + tarjetas) vive DENTRO de un único contenedor
//    recortado por LA APERTURA (`coverAt` → `clipOf`). Los tres gestos de apertura son NUEVOS,
//    ninguno repite los ya usados por los hermanos (bandas, guillotina, telón, persiana,
//    escalonada, trapecio, visera, tronera, mordazas, obturador, trinquete horizontal, radial):
//      W1 (296-378)   ⭐ LA VENTANA QUE VIAJA — se abre como una RANURA angosta pegada al borde
//                     DERECHO, y después la ranura VIAJA horizontalmente por el cuadro sin cambiar
//                     de ancho (como el visor de un medidor que barre la pared), se ensancha
//                     donde aterriza, y se va POR EL BORDE IZQUIERDO adelgazándose. No abre desde
//                     el centro ni cierra hacia el centro: entra por un borde y sale por el otro.
//      W2 (712-812)   LOS TRES CLICS — abre en TRES pasos discretos con retroceso de trinquete en
//                     cada uno (clic-recula-clic), y cierra con los mismos tres clics al revés.
//                     Es el trinquete del acto anterior hecho gesto de cámara.
//      W3 (930-1022)  EL VOLTEO DE FORMATO — abre como una BANDA ANCHA Y BAJA pegada al piso
//                     (buzón horizontal) y después VOLTEA de formato: se estrecha de los costados
//                     mientras el techo sube, de apaisado a vertical, sin dejar de estar abierta.
//                     Cierra volviendo a apaisada y barriendo los dos costados hacia el centro.
// 2. EL PRIMER PLANO no está recortado. Con la apertura ABIERTA todo vive fuera del hueco y nunca
//    entra en la caja de la cara (30-70 % · 10-90 %): durante las tres ventanas sólo hay un rótulo
//    de 36 px por encima del canto superior (W1 techo 194 px · W2 162 px · W3 173 px, y el rótulo
//    cae siempre entre los 60 px de safe area y ese techo, ya contada la magnificación). Contención.
// 3. UNA sola cámara `camAt(g)`, función pura de g, que jamás vuelve a cero. UNA sola atmósfera,
//    montada una vez para los 78 s. La luz EVOLUCIONA: penumbra del rincón del medidor → ámbar de
//    alerta (el que te cobra) → mediodía duro (la prueba) → plana de cielo cubierto (la salida).
// 4. LA LUZ SIEMPRE POR SU FUENTE, nunca "poca luz": la gris fría cenital que cae sobre el bisel
//    negro del medidor digital, la pantalla del teléfono que ilumina desde abajo, el reflejo en el
//    policarbonato, la bombilla del taller sobre el banco. ⛔ Ningún acto por debajo de luma 25:
//    ningún `dim` supera 0,52, el `amb` nunca baja de 0,55 y el `inten` nunca baja de 0,86.
// 5. ⚠️ SAFE AREA CON LA PERSPECTIVA YA APLICADA. `gcam` monta un `perspective(1500px)`, así que
//    todo lo que está en z POSITIVO se AGRANDA (1500/(1500−camZ−planeZ)) y encima lo multiplica el
//    `push`. Un cartel a y=80 en un plano z=230 con push 1,20 termina 15 px fuera del cuadro. Por
//    eso los planos del primer plano viven comprimidos entre 30 y 105, `camZ` entre 20 y 70, y
//    cada elemento está posicionado contra su tamaño YA escalado, con piso de 60 px.
//
// ⭐⭐ CÓMO SE LEE EL "VALOR ABSOLUTO" SIN NOMBRAR UNA MATEMÁTICA (acto 2) ─────────────────────
//    No hay ningún |x|, ningún signo, ninguna fórmula. Hay TRES cosas físicas:
//      · UN RIEL horizontal que atraviesa el medidor real (la foto del digital, de bisel negro).
//      · PAQUETES de energía que viajan por el riel. En la primera pasada van HACIA LA CASA
//        (izquierda → derecha) y son FRÍOS: es lo que te cobran, y entran desde arriba (`flujo`).
//        En la segunda pasada van AL REVÉS (derecha → izquierda) y son CÁLIDOS: son TUYOS, los
//        produjo tu panel y se están yendo a la red.
//      · EL SELLO: un tampón que BAJA desde arriba, en frío, cada vez que un paquete cruza el
//        centro del medidor, y estampa **+1**. El sello es exactamente el mismo objeto, en la
//        misma posición, del mismo tamaño y con el mismo golpe en las DOS pasadas.
//    La injusticia se lee porque la flecha cambia y el sello NO. El contador del medidor —dígitos
//    de verdad, tipografía de verdad, sincronizado al mismo período de 11 frames que los paquetes—
//    sube igual en las dos direcciones. Y cuando el guion dice 53 kWh, los 53 paquetes cálidos se
//    van hacia la red y el contador se lleva +53. Nunca se escribe una resta ni una suma: se ve un
//    tampón que no mira la flecha.
//
// ⭐ CÓMO SE HACE MEMORIZABLE LA PRUEBA DE LOS 10 MINUTOS (acto 4) ────────────────────────────
//    Se lee como RECETA, no como explicación: una TIRA DE PASOS vertical en la banda izquierda que
//    se llena y se queda (los pasos hechos siguen visibles con su tilde), y por cada paso UNA sola
//    tarjeta con el material real de esa acción y una orden de 2-5 palabras. Cada paso se sostiene
//    por encima del piso de lectura (2,8 s + 0,28 s por palabra sobre 3), calculado paso por paso
//    en la tabla de abajo. Al final los cinco pasos quedan juntos en pantalla: la receta entera de
//    un vistazo.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⇐ ENTRA DESDE el tramo de los dos primeros medidores (el del disco que gira al revés y el del
//   trinquete):
//   cam {encuadre CERRADO sobre el domo de vidrio del medidor viejo, push 1,26, derivando a la
//        DERECHA (el mundo corre hacia la izquierda), grúa −18}
//   luz {HORA.penumbra 8°, sky, amb 0,22 — sostenida por el reflejo del domo, no por un fill}
//   materia {EL DISCO DE ALUMINIO QUIETO DETRÁS DEL VIDRIO — `cmep30_s6_clip_disco_se_congela.mp4`}
//   ⚠️ pero los primeros 90 frames son PANTALLA COMPLETA: el domo entra a sangre, no en tarjeta.
//
// ACTO 1 · 0-386 · "REVÍSALO SÍ O SÍ"        protagonista: EL MEDIDOR DIGITAL   texto: REVÍSALA SÍ O SÍ
//   entra  cam {push 1,26 cerrado sobre el domo, grúa −18, foco 44/52}   luz {penumbra 8°, sky, amb 0,62 ← rampa 12 f desde 0,55}
//          materia {el disco quieto detrás del vidrio, a sangre}
//   sale   cam {push 1,10, grúa +8, foco 50/46}                          luz {alerta 14°, ámbar frío cenital, amb 0,66}
//          materia {LA PANTALLA DEL MEDIDOR DIGITAL — un rectángulo iluminado con dígitos}
//   (costura INTERNA @88 ···· OCLUSIÓN: LA TAPA DE POLICARBONATO GRIS del medidor cruza el cuadro
//    de derecha a izquierda con su reflejo y su canto rayado y tapa el 100 % entre 96 y 104. El
//    color es el del POLICARBONATO (#9A9C97), jamás el del fondo. Detrás ya están los tres
//    medidores sobre el banco.
//    costura INTERNA @146 ···· ZOOM-THROUGH: la cámara entra por la pantallita del TERCER medidor
//    de la fila (fx 74 / fy 47) y sale del otro lado ya sobre el digital a sangre. El digital se
//    monta 16 f ANTES, debajo: un zoom-through contra nada es un fundido.)
//   ── FRONTERA A @386 ···· MATCH-SHAPE: el rectángulo iluminado de la pantalla del medidor NO
//      suelta el cuadro: crece de 520×300 a 1180×620, se le achata el radio, y sobre esa misma
//      superficie NACE EL RIEL que la atraviesa de lado a lado. La cara del medidor sigue siendo
//      la misma foto todo el tiempo — el objeto no se sustituye, se agranda. ················
// ACTO 2 · 386-688 · ⭐ "NO LE IMPORTA PARA QUÉ LADO VA"  protagonista: EL SELLO   texto: TE COBRA LA ENERGÍA QUE REGALASTE
//   entra  cam {push 1,10, grúa +8, foco 50/46}          luz {alerta 14°, ámbar, amb 0,66, frío cenital fuerte}
//          materia {la cara del medidor, ya del tamaño de un tablero, con el riel encima}
//   sale   cam {push 1,20, grúa +12, foco 46/38}         luz {alerta 14° → 12°, amb 0,58}
//          materia {EL SELLO +1 BAJANDO — el tampón, a mitad de golpe}
//   ── FRONTERA B @688 ···· CORTE EN EL BEAT sobre "Y no es una leyenda": corte seco del medidor a
//      la cocina. LA BISAGRA es EL SELLO: el mismo tampón, la misma x/y, el mismo cuerpo y el
//      mismo golpe a los dos lados del corte durante 18 frames — sólo que del otro lado ya no
//      estampa el contador, estampa la factura. ······································
// ACTO 3 · 688-921 · "CULPANDO AL REFRIGERADOR"  protagonista: LA HELADERA   texto: MESES BUSCANDO DONDE NO ERA
//   entra  cam {push 1,20, grúa +12, foco 46/38}         luz {alerta 12° → plana de cocina 26°, amb 0,72}
//          materia {el sello, que cae sobre la factura}
//   sale   cam {push 1,02, grúa −22, foco 58/56}         luz {26° → 74°, amb 0,86 (ya es el mediodía de la prueba)}
//          materia {EL POLVO DEL RECTÁNGULO QUE QUEDÓ DETRÁS DE LA HELADERA}
//   ── FRONTERA C @921 ···· WIPE POR MATERIA: el POLVO gris-beige (#B9AE97) del rectángulo que
//      quedó marcado en las baldosas cruza el cuadro en bocanadas y detrás ya está el patio a
//      mediodía. Es literalmente lo que hay en el plano anterior, no un efecto inventado. ·····
// ACTO 4 · 921-1836 · ⭐ LA PRUEBA DE LOS 10 MINUTOS  protagonista: LA RECETA   texto: 5 PASOS
//   entra  cam {push 1,08, grúa −6, foco 50/50}          luz {mediodía 74°, blanco, amb 0,86}
//          materia {el polvo asentándose sobre el cemento del patio}
//   sale   cam {push 1,04, grúa −16, foco 52/48}         luz {mediodía 78° → 60°, amb 0,80}
//          materia {EL TELÉFONO CON LAS DOS LECTURAS — `cmep30_s6_dos_lecturas_telefono.png`}
//   (costura INTERNA @1146 ···· MATCH-SHAPE: el disco del RELOJ de los 10 minutos (una circun-
//    ferencia) crece, pierde las agujas y se vuelve EL SOL del "elige un día de sol". Círculo a
//    círculo, sin soltar el centro.
//    costura INTERNA @1626 ···· CORTE EN EL BEAT sobre "Ve al medidor con el teléfono": corte seco
//    del patio al rincón del medidor. LA BISAGRA es LA TIRA DE PASOS: idéntica, misma x, mismo
//    cuerpo, mismos tildes a los dos lados del corte.)
//   ── FRONTERA D @1836 ···· MATCH-SHAPE: el rectángulo del TELÉFONO con las dos lecturas gira a
//      plano, crece y se convierte en la primera TARJETA DE RESULTADO (el mismo marco, el mismo
//      radio, el mismo reflejo): la foto que sacaste ES el veredicto. ··················
// ACTO 5 · 1836-2340 · "LOS TRES RESULTADOS"   protagonista: LAS TRES TARJETAS   texto: SI SUBIÓ, PIDE EL BIDIRECCIONAL
//   entra  cam {push 1,04, grúa −16, foco 52/48}         luz {mediodía 60° → 40°, amb 0,78}
//          materia {el teléfono con las dos lecturas, ya de tarjeta}
//   sale   cam {ABRIENDO al patio, push 1,16, grúa −54 (la cámara SUBE), foco 50/40}
//          luz {plana de cielo cubierto: 88°, blanco de nube, amb 0,74 — sin dirección, sin sombra}
//          materia {EL VIDRIO DEL PANEL DEVOLVIENDO EL BLANCO DEL CIELO}
//   (costura INTERNA @2039 ···· MATCH-MOVE: las tres tarjetas viven sobre un mismo riel vertical;
//    cuando entra la tercera, TODAS suben a −1,05 % de pantalla por frame y el fondo viaja con
//    ellas a la misma velocidad y en la misma dirección. Nada frena, nada arranca de cero.
//    costura INTERNA @2216 ···· OCLUSIÓN: LA HOJA DE PAPEL de "que te lo contesten por escrito"
//    cruza de izquierda a derecha y tapa el 100 % entre 2224 y 2232. Color PAPEL (#EFE8D6).)
//
// ⇒ SALE HACIA los días nublados (el panel que depende del cielo):
//   cam {ABIERTO al patio, cámara SUBIENDO, grúa −54, push 1,16}
//   luz {plana de cielo blanco cubierto, 88°, amb 0,74, sin sombra dura}
//   materia {EL VIDRIO DEL PANEL DEVOLVIENDO EL BLANCO DEL CIELO —
//            `cmep30_s1_clip_panel_reflejo_cielo.mp4` sobre `cmep30_s7_paneles_cielo_gris.png`}
//
// ── §OPACIDAD DE LOS PRIMEROS 90 FRAMES (el requisito estructural) ────────────────────────────
//   (a) `coverAt(g)` devuelve CERRADO para todo g < 296 → `clipOf` = `inset(0px)`: el contenedor
//       del mundo cubre el 100 % del cuadro, sin recorte y sin polígono.
//   (b) `VoltAtmos` se monta como PRIMER hijo, FUERA de `Layers` (o sea, fuera de la cámara), y
//       trae `backgroundColor: V.ink0` opaco: no existe un frame en que el cuadro no esté pintado,
//       pase lo que pase con la cámara.
//   (c) el fondo a sangre del acto 1 se monta desde g=0 con `scale` 1,52 y la cámara arranca con
//       `push` 1,26 y `z0` POSITIVO (+20): con la perspectiva ya aplicada el plano cubre 1,59 del
//       cuadro, así que ni la deriva de 110 px ni la grúa de 54 px llegan nunca a mostrar su
//       borde. (Todos los fondos del movimiento están calculados para cubrir ≥1,20.)
//   (d) `Rampa` de ambiente: 12 frames, y arranca en 0,88 del valor final — imagen ya formada.
//
// ⛔ cero Math.random/Date/new Date · cero backdrop-filter · cero blur grande full-screen · cero
// fade en ninguna frontera · dos costuras seguidas nunca repiten tipo · cero capa de color con
// opacidad sobre el avatar · TODA tarjeta flotante lleva FOTO o CLIP REAL adentro (`MediaCard`);
// el riel, los paquetes, la tira de pasos y las flechas son GRÁFICA de apoyo, nunca hacen de
// objeto real (el medidor y el teléfono van con su FOTO).
// ⛔ Rutas LITERALES en el punto de uso: el build escanea este .tsx por TEXTO y una ruta armada
// por template literal no viaja en el tar → 404 → chunk muerto con un error que miente.
// ⚠️ Ningún `kind="video"` se monta más de 144 frames (los clips duran 121 f @24 ≈ 151 f @30).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rgba, rnd,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, zoomThrough, SunKey, HORA, flujo, SeamWipeMatter,
  Bed,
} from "./PanelStage";

// ── EL RELOJ DEL MOVIMIENTO (frames locales, 30 fps · global = local + 18695) ─────────────────
const A1 = 0;      // 18695 · (frame 3) "Y la tercera es la que tienes que revisar sí o sí."
const A2 = 386;    // 19081 · "Si pasa energía, la suman."
const A3 = 688;    // 19383 · "Y no es una leyenda."
const A4 = 921;    // 19616 · "Yo lo probé en mi casa..."
const A5 = 1836;   // 20531 · "Si el número bajó, tienes el medidor bueno."
const G_END = 2340;

// los frames en que el VISUAL cambia de acto: caen ADENTRO de la costura, nunca en el beat exacto
const SW2 = A2 + 2;    // 388  · adentro del match-shape de la pantalla (arranca en 380)
const SW3 = A3;        // 688  · el corte en el beat es EXACTO: ahí está el filo
const SW4 = A4 + 3;    // 924  · adentro del wipe de polvo (cobertura 915-935)
const SW5 = A5 + 2;    // 1838 · adentro del match-shape del teléfono (arranca en 1822)

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const es = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
const esOut = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.42, 0, 0.24, 1) });
const esSnap = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.06, 0.9, 0.18, 1) });

// LAS MATERIAS de las costuras. ⛔ Ninguna es el color del fondo.
const POLICARB = "#9A9C97";  // la tapa gris del medidor (costura interna @88)
const POLVO = "#B9AE97";     // el polvo del rectángulo detrás de la heladera (frontera C)
const PAPEL = "#EFE8D6";     // la hoja del "por escrito" (costura interna @2216)
const TINTA = "#243046";     // la tinta del sello: azul-negro de tampón, frío

// ── EL RIEL DEL ACTO 2: una sola velocidad, un solo período ───────────────────────────────────
// Todo el mecanismo del "valor absoluto" cuelga de este número: los paquetes cruzan el centro del
// medidor cada PERIODO frames, y el contador sube +1 exactamente en esos mismos frames. Si los dos
// no salen del mismo reloj, el espectador ve dos animaciones y no un mecanismo.
const PERIODO = 11;
const P1_T0 = 392;                       // primera pasada: hacia la casa (frío, ←→ derecha)
const P1_N = 6;
const P2_T0 = 470;                       // segunda pasada: hacia la red (cálido, ←)
const P2_N = 8;
const RUN_T0 = 566;                      // la corrida de los 53
const RUN_END = 620;
const RUN_N = 9;                         // la corrida sigue estampando: el sello no descansa
const BISAGRA = 684;                     // el golpe que cruza el corte en el beat de la frontera B

/** el número que el medidor tiene estampado. Sube en las DOS direcciones: ésa es toda la denuncia. */
const sumados = (g: number) => {
  if (g < P1_T0) return 0;
  if (g < P2_T0) return Math.min(P1_N, Math.floor((g - P1_T0) / PERIODO) + 1);
  if (g < RUN_T0) return P1_N + Math.min(P2_N, Math.floor((g - P2_T0) / PERIODO) + 1);
  const base = P1_N + P2_N;
  if (g >= RUN_END) return 53;
  return base + Math.round((53 - base) * es(clamp01((g - RUN_T0) / (RUN_END - RUN_T0))));
};
/** el frame exacto en que un paquete cruza el centro (para clavar el golpe del sello ahí) */
const golpeSello = (g: number) => {
  const marcas: number[] = [];
  for (let i = 0; i < P1_N; i++) marcas.push(P1_T0 + i * PERIODO);
  for (let i = 0; i < P2_N; i++) marcas.push(P2_T0 + i * PERIODO);
  for (let i = 0; i < RUN_N; i++) marcas.push(RUN_T0 + i * PERIODO);
  marcas.push(BISAGRA);
  let mejor = -999;
  for (let i = 0; i < marcas.length; i++) if (marcas[i] <= g && marcas[i] > mejor) mejor = marcas[i];
  return mejor;
};

// ── EL RIEL DEL ACTO 5 (match-move @2039): una sola velocidad para las tarjetas y para el fondo ─
const RAIL5_V = -0.09;                                   // % de pantalla por frame
const rail5 = (g: number) => (g < 2039 ? 0 : (g - 2039) * RAIL5_V);

// ══ LA APERTURA — el hueco por donde se ve el avatar. Trapecio capaz (shL ≠ shR) ═══════════════
type Cover = { gL: number; gR: number; shL: number; shR: number; open: boolean };
const CERRADO: Cover = { gL: 50, gR: 50, shL: 0, shR: 0, open: false };

// helper de los clics de W2: un escalón con retroceso de trinquete
const clic = (g: number, at: number, from: number, to: number) => {
  const golpe = esSnap(clamp01((g - at) / 5));
  const recula = clamp01((g - at - 5) / 6);
  const rebote = recula > 0 && recula < 1 ? Math.sin(recula * Math.PI) * (to - from) * 0.09 : 0;
  return lerp(from, to, golpe) - rebote;
};

const coverAt = (g: number): Cover => {
  // ⛔ g < 296 → CERRADO. Ahí adentro caen los 90 frames que tapan el salto del bucle.

  // W1 · ⭐ LA VENTANA QUE VIAJA — ranura que entra por el borde derecho, cruza el cuadro sin
  // cambiar de ancho, se ensancha donde aterriza, y se va por el borde izquierdo adelgazándose.
  if (g >= 296 && g < 378) {
    const abre = esSnap(clamp01((g - 296) / 13));           // la ranura nace pegada a la derecha
    const viaja = es(clamp01((g - 309) / 30));              // VIAJA: mismo ancho, otra posición
    const ancha = es(clamp01((g - 340) / 13));              // se ensancha donde aterrizó
    const sale = es(clamp01((g - 355) / 23));               // se va por el borde izquierdo
    const sh = lerp(102, 18, abre);
    const gL = lerp(lerp(lerp(75, 31, viaja), 31, ancha), -12, sale);
    const gR = Math.max(gL, lerp(lerp(lerp(75, 89, abre), 45, viaja), 64, ancha) - sale * 78);
    return { gL, gR, shL: sh, shR: sh, open: sh < 98.5 && gR - gL > 1.1 };
  }

  // W2 · LOS TRES CLICS — abre en tres pasos con retroceso de trinquete y cierra con los mismos
  // tres al revés. Ningún hermano abre en escalones con recule.
  if (g >= 712 && g < 812) {
    const shHi = lerp(102, 26, esSnap(clamp01((g - 712) / 6)));
    const sh2 = g >= 726 ? clic(g, 726, 26, 20) : shHi;
    const sh3 = g >= 740 ? clic(g, 740, 20, 15) : sh2;
    const cierra = g >= 776 ? clic(g, 776, 15, 21) : sh3;
    const cierra2 = g >= 788 ? clic(g, 788, 21, 30) : cierra;
    const sh = g >= 800 ? clic(g, 800, 30, 103) : cierra2;
    const w1 = clic(g, 712, 0, 7.5);
    const w2 = g >= 726 ? clic(g, 726, 7.5, 13.5) : w1;
    const w3 = g >= 740 ? clic(g, 740, 13.5, 20) : w2;
    const c1 = g >= 776 ? clic(g, 776, 20, 13.5) : w3;
    const c2 = g >= 788 ? clic(g, 788, 13.5, 7) : c1;
    const w = g >= 800 ? clic(g, 800, 7, 0) : c2;
    return { gL: 50 - w, gR: 50 + w, shL: sh, shR: sh, open: sh < 98.5 && w > 0.9 };
  }

  // W3 · EL VOLTEO DE FORMATO — buzón ancho y bajo pegado al piso que VOLTEA a vertical sin
  // cerrarse nunca, y vuelve a apaisado para barrer los costados al centro.
  if (g >= 930 && g < 1022) {
    const buzon = esOut(clamp01((g - 930) / 16));      // aparece el buzón apaisado
    const voltea = es(clamp01((g - 950) / 24));        // apaisado → vertical
    const vuelve = es(clamp01((g - 982) / 20));        // vertical → apaisado
    const barre = es(clamp01((g - 1000) / 20));        // los costados al centro
    const sh = lerp(lerp(102, 77, buzon), lerp(16, 78, vuelve), voltea);
    const half = lerp(lerp(0, 42, buzon), lerp(17, 41, vuelve), voltea) * (1 - barre);
    return { gL: 50 - half, gR: 50 + half, shL: sh, shR: sh, open: sh < 98.5 && half > 0.9 };
  }

  return CERRADO;
};

const clipOf = (c: Cover) =>
  c.open
    ? `polygon(0% 0%, 100% 0%, 100% 100%, ${c.gR.toFixed(2)}% 100%, ` +
      `${c.gR.toFixed(2)}% ${c.shR.toFixed(2)}%, ${c.gL.toFixed(2)}% ${c.shL.toFixed(2)}%, ` +
      `${c.gL.toFixed(2)}% 100%, 0% 100%)`
    : "inset(0px)";

// ── LOS CANTOS DE LA APERTURA. Todo el brillo sale HACIA AFUERA (hacia el mundo): ni un píxel de
//    gradiente se apoya sobre la cara. Dos placas con el canto lamido por la luz.
const CantoV: React.FC<{ x: number; dir: -1 | 1; hot: number }> = ({ x, dir, hot }) => (
  <div style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 0 }}>
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 3, left: dir === -1 ? -3 : 0,
      background: `linear-gradient(180deg, ${rgba(V.sky, 0.3 * hot)}, ${rgba(V.bone, 0.62 * hot)} 44%, ${rgba(V.volt, 0.24 * hot)})`,
    }} />
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 118, left: dir === -1 ? -121 : 3,
      background: dir === -1
        ? `linear-gradient(270deg, ${rgba(V.bone, 0.13 * hot)}, rgba(0,0,0,0) 46%), linear-gradient(270deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.6)})`
        : `linear-gradient(90deg, ${rgba(V.bone, 0.13 * hot)}, rgba(0,0,0,0) 46%), linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.6)})`,
    }} />
  </div>
);
const CantoTecho: React.FC<{ c: Cover; hot: number }> = ({ c, hot }) => (
  <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <defs>
      <linearGradient id="s6cobCanto" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={rgba(V.ink0, 0.58)} />
        <stop offset="72%" stopColor={rgba(V.bone, 0.1 * hot)} />
        <stop offset="100%" stopColor={rgba(V.bone, 0.0)} />
      </linearGradient>
    </defs>
    <polygon
      points={`${c.gL * 19.2},${c.shL * 10.8 - 92} ${c.gR * 19.2},${c.shR * 10.8 - 92} ` +
        `${c.gR * 19.2},${c.shR * 10.8} ${c.gL * 19.2},${c.shL * 10.8}`}
      fill="url(#s6cobCanto)"
    />
    <line x1={c.gL * 19.2} y1={c.shL * 10.8} x2={c.gR * 19.2} y2={c.shR * 10.8}
      stroke={rgba(V.bone, 0.6 * hot)} strokeWidth={3} />
  </svg>
);

// ── COSTURA INTERNA @88 · OCLUSIÓN — LA TAPA DE POLICARBONATO DEL MEDIDOR ─────────────────────
// Una placa curva de policarbonato gris, con su reflejo, su canto rayado y su sombra de contacto.
// Cruza de DERECHA a IZQUIERDA y tapa el 100 % entre 96 y 104. ⛔ Color POLICARB, nunca el fondo.
const OcluyeTapa: React.FC<{ g: number; at: number; dur?: number }> = ({ g, at, dur = 30 }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(112, -178, esOut(p));
  const tapa = clamp01(Math.sin(p * Math.PI) * 2.3 - 0.86);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-22%", left: `${L.toFixed(2)}%`, width: "168%", height: "144%",
        transform: "rotate(-5deg)",
        background:
          `linear-gradient(96deg, ${rgba(POLICARB, 0)} 0%, ${POLICARB} 6%, #B6B8B2 26%, ` +
          `#7C7E79 52%, #ADAFA9 74%, ${POLICARB} 94%, ${rgba(POLICARB, 0)} 100%)`,
        boxShadow: `0 30px 96px ${rgba(V.ink0, 0.8)}`,
        borderRadius: 8,
      }}>
        {/* el canto rayado del policarbonato: tiene materia, no es un rectángulo plano */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.42,
          backgroundImage:
            `repeating-linear-gradient(97deg, ${rgba(V.ink0, 0.1)} 0px, ${rgba(V.ink0, 0.1)} 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 34px)`,
        }} />
        {/* el reflejo del rincón sobre el plástico: la luz por su FUENTE */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(112deg, rgba(255,255,255,0) 30%, ${rgba(V.bone, 0.4)} 46%, rgba(255,255,255,0) 58%)`,
        }} />
      </div>
      <AbsoluteFill style={{ background: rgba(POLICARB, 0.95 * tapa) }} />
    </AbsoluteFill>
  );
};

// ── COSTURA INTERNA @2216 · OCLUSIÓN — LA HOJA DEL "POR ESCRITO" ──────────────────────────────
const OcluyeHoja: React.FC<{ g: number; at: number; dur?: number }> = ({ g, at, dur = 32 }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(-172, 116, esOut(p));
  const tapa = clamp01(Math.sin(p * Math.PI) * 2.4 - 0.9);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-24%", left: `${L.toFixed(2)}%`, width: "166%", height: "150%",
        transform: "rotate(4deg)",
        background:
          `linear-gradient(86deg, ${rgba(PAPEL, 0)} 0%, ${PAPEL} 7%, #FBF7EC 34%, ` +
          `#DED6C0 62%, ${PAPEL} 88%, ${rgba(PAPEL, 0)} 100%)`,
        boxShadow: `0 26px 88px ${rgba(V.ink0, 0.74)}`,
      }}>
        {/* la fibra y el doblez del papel */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.3,
          backgroundImage:
            `repeating-linear-gradient(88deg, ${rgba("#8A8171", 0.16)} 0px, ${rgba("#8A8171", 0.16)} 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 58px)`,
        }} />
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "44%", width: 26,
          background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba("#9C917D", 0.34)} 50%, rgba(0,0,0,0))`,
        }} />
      </div>
      <AbsoluteFill style={{ background: rgba(PAPEL, 0.94 * tapa) }} />
    </AbsoluteFill>
  );
};

// ── FRONTERA C · la cobertura total del WIPE DE POLVO ────────────────────────────────────────
// `SeamWipeMatter` (Stage) pone las bocanadas; esto pone los 8 frames en que el polvo tapa el
// 100 % y adentro de los cuales cambia el mundo. ⛔ Color POLVO, jamás el del fondo.
const PolvoTapa: React.FC<{ g: number; at: number; dur?: number }> = ({ g, at, dur = 40 }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const tapa = clamp01(Math.sin(p * Math.PI) * 2.5 - 1.02);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 7 }, (_, i) => {
        const o = rnd(i * 5.7);
        const q = clamp01(p * 1.4 - o * 0.22);
        const x = lerp(-34, 132, esOut(q));
        const d = 560 + o * 640;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${(4 + rnd(i * 3.3) * 62).toFixed(1)}%`,
            width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(POLVO, 0.62 * Math.sin(clamp01(p) * Math.PI))} 0%, ${rgba(POLVO, 0.24)} 46%, rgba(0,0,0,0) 72%)`,
          }} />
        );
      })}
      <AbsoluteFill style={{ background: rgba(POLVO, 0.96 * tapa) }} />
    </AbsoluteFill>
  );
};

// ── ⭐ EL SELLO — el objeto que hace legible el valor absoluto ─────────────────────────────────
// Un tampón que BAJA desde arriba (ley `flujo("cobran")`: lo que te cobran entra desde arriba y en
// frío) y estampa +1. Es EL MISMO objeto en las dos pasadas: misma posición, mismo tamaño, mismo
// golpe. Lo único que cambia entre pasada y pasada es la flecha del riel. Ahí está la injusticia.
// También es la BISAGRA del corte en el beat de la frontera B: sobrevive al corte 18 frames.
const Sello: React.FC<{
  g: number; at: number; x: number; y: number; size?: number; op?: number;
}> = ({ g, at, x, y, size = 168, op = 1 }) => {
  const p = clamp01((g - at) / 14);
  if (p <= 0 || g > at + 46) return null;
  const baja = esSnap(clamp01((g - at) / 7));            // cae de golpe
  const sube = es(clamp01((g - at - 9) / 13));           // se levanta
  const dy = lerp(-118, 0, baja) + sube * -74;
  const impacto = clamp01(1 - Math.abs(g - at - 7) / 7);
  const marca = clamp01((g - at - 6) / 4);
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, opacity: op, pointerEvents: "none" }}>
      {/* la marca que queda estampada (tinta fría) */}
      <div style={{
        position: "absolute", left: 0, top: 0, transform: "translate(-50%,-50%)",
        opacity: marca * clamp01(1 - (g - at - 30) / 16),
      }}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(size * 0.52),
          color: V.sky, letterSpacing: 2,
          textShadow: `0 0 26px ${rgba(V.sky, 0.5)}, 0 5px 20px rgba(0,0,0,0.95)`,
          transform: `scale(${(1 + (1 - marca) * 0.42).toFixed(3)}) rotate(-6deg)`,
        }}>+1</div>
      </div>
      {/* el cuerpo del tampón: mango de madera, base de goma, y su sombra de contacto */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        transform: `translate(-50%,-100%) translateY(${dy.toFixed(1)}px)`,
        width: size * 0.62, height: size * 0.86, marginLeft: -size * 0.31, marginTop: -size * 0.14,
      }}>
        <div style={{
          position: "absolute", left: "22%", right: "22%", top: 0, height: "44%",
          borderRadius: `${size * 0.1}px ${size * 0.1}px 4px 4px`,
          background: `linear-gradient(96deg, #6B5A44, #3A3025 62%, #574835)`,
          boxShadow: `inset 0 2px 0 ${rgba(V.bone, 0.24)}`,
        }} />
        <div style={{
          position: "absolute", left: 0, right: 0, top: "42%", height: "22%",
          borderRadius: 5,
          background: `linear-gradient(180deg, #2C3448, ${TINTA} 60%, #171E2C)`,
          boxShadow: `0 ${Math.round(size * 0.12)}px ${Math.round(size * 0.2)}px ${rgba(V.ink0, 0.8)}, inset 0 1px 0 ${rgba(V.sky, 0.5)}`,
        }} />
        <div style={{
          position: "absolute", left: "6%", right: "6%", top: "62%", height: "12%",
          borderRadius: 3, background: `linear-gradient(180deg, ${TINTA}, #0E141F)`,
        }} />
      </div>
      {/* la onda del golpe: 4 frames, nunca un flash de pantalla */}
      {impacto > 0.02 && (
        <div style={{
          position: "absolute", left: 0, top: 0,
          width: size * (1 + (1 - impacto) * 1.5), height: size * 0.34 * (1 + (1 - impacto) * 1.5),
          transform: "translate(-50%,-50%)", borderRadius: "50%",
          border: `3px solid ${rgba(V.sky, 0.6 * impacto)}`,
          boxShadow: `0 0 40px ${rgba(V.sky, 0.3 * impacto)}`,
        }} />
      )}
    </div>
  );
};

// ── ⭐ EL RIEL Y LOS PAQUETES — la energía como cantidad que VIAJA ─────────────────────────────
// Gráfica de apoyo sobre el material real (la foto del medidor digital). Los paquetes salen del
// MISMO reloj que el contador: cada cruce del centro es un +1. `dir` −1 = hacia la red (a la
// izquierda, cálido, TUYO) · +1 = hacia la casa (a la derecha, frío, te lo cobran).
const Paquetes: React.FC<{
  g: number; t0: number; n: number; dir: -1 | 1; y: number; color: string; op: number;
}> = ({ g, t0, n, dir, y, color, op }) => {
  if (op <= 0.01) return null;
  const items: React.ReactElement[] = [];
  for (let i = 0; i < n; i++) {
    const nace = t0 + i * PERIODO - 26;                  // llega al centro en t0 + i*PERIODO
    const q = (g - nace) / 52;
    if (q < -0.06 || q > 1.12) continue;
    const t = clamp01(q);
    const x = dir === 1 ? lerp(-16, 116, t) : lerp(116, -16, t);
    const cerca = clamp01(1 - Math.abs(x - 50) / 30);
    items.push(
      <div key={i} style={{
        position: "absolute", left: `${x.toFixed(2)}%`, top: `${y}%`,
        width: 54 + cerca * 16, height: 19, marginLeft: -27, marginTop: -9,
        borderRadius: 4,
        background: `linear-gradient(90deg, ${rgba(color, 0.32)}, ${color} 34%, ${color} 66%, ${rgba(color, 0.32)})`,
        boxShadow: `0 0 ${(16 + cerca * 26).toFixed(0)}px ${rgba(color, 0.5 + cerca * 0.3)}, 0 4px 12px ${rgba(V.ink0, 0.8)}`,
        opacity: op * (0.62 + cerca * 0.38),
      }} />,
    );
  }
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{items}</AbsoluteFill>;
};

const Riel: React.FC<{ g: number; y: number; op: number; dir: -1 | 1; color: string }> = ({ g, y, op, dir, color }) => {
  if (op <= 0.01) return null;
  const marcha = (g * 1.6 * dir) % 40;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      <div style={{
        position: "absolute", left: "-18%", right: "-18%", top: `${y}%`, height: 5, marginTop: -2.5,
        background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.bone, 0.3)} 12%, ${rgba(V.bone, 0.3)} 88%, rgba(0,0,0,0))`,
        boxShadow: `0 3px 10px ${rgba(V.ink0, 0.8)}`,
      }} />
      {/* los guiones que corren: dicen la DIRECCIÓN sin escribir la palabra */}
      <div style={{
        position: "absolute", left: "-20%", right: "-20%", top: `${y}%`, height: 5, marginTop: -2.5,
        transform: `translateX(${marcha.toFixed(2)}px)`,
        backgroundImage:
          `repeating-linear-gradient(90deg, ${rgba(color, 0.85)} 0px, ${rgba(color, 0.85)} 18px, rgba(0,0,0,0) 18px, rgba(0,0,0,0) 40px)`,
        opacity: 0.9,
      }} />
    </AbsoluteFill>
  );
};

// ── EL CONTADOR DEL MEDIDOR — dígitos de verdad (ningún motor de imagen escribe cifras) ───────
// Va APOYADO sobre la foto del medidor y deriva con ella (`mcSync`), o la gráfica patina.
const Contador: React.FC<{ g: number; x: number; y: number; size: number; op: number }> = ({ g, x, y, size, op }) => {
  if (op <= 0.01) return null;
  const n = 4218 + sumados(g);
  const txt = String(n);
  const ultimo = golpeSello(g);
  const salto = clamp01(1 - (g - ultimo) / 6);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
      opacity: op, pointerEvents: "none",
    }}>
      <div style={{
        display: "flex", gap: 5, padding: `${Math.round(size * 0.16)}px ${Math.round(size * 0.2)}px`,
        borderRadius: 8,
        background: "linear-gradient(180deg, #0B0E0C 0%, #14170F 100%)",
        boxShadow: `inset 0 2px 0 ${rgba(V.ink0, 0.9)}, 0 12px 34px ${rgba(V.ink0, 0.85)}`,
        border: `2px solid ${rgba(V.bone, 0.2)}`,
      }}>
        {txt.split("").map((d, i) => (
          <div key={i} style={{
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.94,
            color: i === txt.length - 1 ? light(clamp01(salto), "volt", "white") : V.volt,
            padding: "0 6px", minWidth: size * 0.56, textAlign: "center",
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.3))",
            borderRadius: 4,
            transform: i === txt.length - 1 ? `translateY(${(salto * -5).toFixed(2)}px)` : undefined,
            textShadow: `0 0 ${Math.round(size * 0.4)}px ${rgba(V.volt, 0.4)}, 0 4px 14px rgba(0,0,0,0.95)`,
          }}>{d}</div>
        ))}
        <div style={{
          alignSelf: "flex-end", fontFamily: F_DISPLAY, fontWeight: 700,
          fontSize: Math.round(size * 0.4), color: rgba(V.bone, 0.8), marginLeft: 8, paddingBottom: 4,
        }}>kWh</div>
      </div>
    </div>
  );
};

// ── LA TIRA DE PASOS (acto 4) — la receta que se puede repetir de memoria ──────────────────────
// Vive en la banda IZQUIERDA, fuera de la caja de la cara y con la ventana W3 ya cerrada. Los
// pasos hechos NO se borran: se quedan con su tilde. Al final, los cinco juntos = la receta.
const PASOS: { ic: string; t: string }[] = [
  { ic: "img/cmepanel30/cmep30_ic_sol.png", t: "DÍA DE SOL" },
  { ic: "img/cmepanel30/cmep30_ic_breaker.png", t: "APAGA TODO" },
  { ic: "img/cmepanel30/cmep30_ic_telefono.png", t: "FOTO" },
  { ic: "img/cmepanel30/cmep30_ic_reloj.png", t: "10 MINUTOS" },
  { ic: "img/cmepanel30/cmep30_ic_lupa.png", t: "OTRA FOTO" },
];
const HITOS = [1152, 1258, 1642, 1712, 1772];   // cuándo se enciende cada paso

const TiraPasos: React.FC<{ g: number; op: number }> = ({ g, op }) => {
  if (op <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: "15%", top: "20%", width: 320, opacity: op, pointerEvents: "none",
    }}>
      {PASOS.map((p, i) => {
        const nace = HITOS[i];
        const vive = clamp01((g - nace) / 14);
        if (vive <= 0) return null;
        const activo = i === PASOS.length - 1 ? g >= nace : g < HITOS[i + 1];
        const hecho = !activo;
        const fl = flujo("queda", clamp01((g - nace) / 20));   // la receta es TUYA: sube desde abajo
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 13,
            transform: `translateY(${(fl.dy * 0.24).toFixed(1)}px) translateX(${((1 - vive) * -26).toFixed(1)}px)`,
            opacity: vive * (hecho ? 0.62 : 1),
          }}>
            <div style={{
              width: 62, height: 62, borderRadius: 10, position: "relative", flexShrink: 0,
              background: activo
                ? `linear-gradient(180deg, ${rgba(V.volt, 0.24)}, ${rgba(V.ink1, 0.94)})`
                : `linear-gradient(180deg, ${rgba(V.ink2, 0.94)}, ${rgba(V.ink1, 0.94)})`,
              border: `2px solid ${activo ? rgba(V.volt, 0.8) : rgba(V.bone, 0.24)}`,
              boxShadow: activo
                ? `0 0 26px ${rgba(V.volt, 0.34)}, 0 10px 26px ${rgba(V.ink0, 0.8)}`
                : `0 8px 20px ${rgba(V.ink0, 0.72)}`,
            }}>
              <IconPng src={p.ic} x={50} y={12} size={40} opacity={activo ? 1 : 0.75} glow={V.ink0} />
              {hecho && (
                <div style={{
                  position: "absolute", right: -8, bottom: -8, width: 32, height: 32, borderRadius: "50%",
                  background: V.volt, boxShadow: `0 3px 10px ${rgba(V.ink0, 0.9)}`,
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 24, color: V.ink0,
                  textAlign: "center", lineHeight: "32px",
                }}>✓</div>
              )}
            </div>
            <div>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3,
                color: activo ? V.volt : rgba(V.bone, 0.7),
                textShadow: "0 3px 14px rgba(0,0,0,0.95)",
              }}>PASO {i + 1}</div>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 1.2,
                color: activo ? V.white : rgba(V.bone, 0.76), whiteSpace: "nowrap",
                textShadow: "0 4px 18px rgba(0,0,0,0.95)",
              }}>{p.t}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── LAS TRES TARJETAS DEL VEREDICTO (acto 5) — viajan por un mismo riel ───────────────────────
const Veredicto: React.FC<{
  g: number; at: number; out: number; y: number; flecha: string; titulo: string; sub: string; color: string;
}> = ({ g, at, out, y, flecha, titulo, sub, color }) => {
  const vive = es(clamp01((g - at) / 18));
  const muere = clamp01((g - out) / 16);
  if (vive <= 0 || muere >= 1) return null;
  return (
    <div style={{
      position: "absolute", left: "58%", top: `${(y + rail5(g)).toFixed(2)}%`,
      transform: `translate(-50%,-50%) translateX(${((1 - vive) * 92 - muere * 40).toFixed(1)}px)`,
      opacity: vive * (1 - muere), pointerEvents: "none",
    }}>
      <Bed pad={22} w={640}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 74, lineHeight: 0.9, color,
            width: 66, textAlign: "center",
            textShadow: `0 0 30px ${rgba(color, 0.44)}, 0 5px 20px rgba(0,0,0,0.95)`,
          }}>{flecha}</div>
          <div>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: 1.4,
              color: V.white, textTransform: "uppercase", lineHeight: 1.02, whiteSpace: "nowrap",
              textShadow: "0 5px 22px rgba(0,0,0,0.95)",
            }}>{titulo}</div>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 33, letterSpacing: 2.4,
              color, textTransform: "uppercase", whiteSpace: "nowrap", marginTop: 4,
              textShadow: "0 4px 16px rgba(0,0,0,0.95)",
            }}>{sub}</div>
          </div>
        </div>
      </Bed>
    </div>
  );
};

// ── TIPOGRAFÍA propia del movimiento ──────────────────────────────────────────────────────────
const Rotulo: React.FC<{
  children: React.ReactNode; x: number; y: number; color?: string; size?: number; op?: number;
}> = ({ children, x, y, color = V.bone, size = 34, op = 1 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", opacity: op,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 3.2, color,
    textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.96)",
  }}>{children}</div>
);

// cartel que ATERRIZA (nada arranca de cero: entra con desplazamiento y escala, nunca con opacity sola)
const Cartel: React.FC<{
  g: number; at: number; out: number; x: number; y: number; size?: number; color?: string;
  tipo?: "cobran" | "queda"; children: React.ReactNode;
}> = ({ g, at, out, x, y, size = 56, color = V.white, tipo, children }) => {
  const inP = es(clamp01((g - at) / 15));
  const outP = clamp01((g - out) / 16);
  if (g < at || outP >= 1) return null;
  const fl = tipo ? flujo(tipo, clamp01((g - at) / 22)) : null;
  const dy = fl ? fl.dy * 0.3 : (1 - inP) * 26;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translateY(${(dy + outP * 22 + Math.sin(g / 61) * 2).toFixed(1)}px) ` +
        `scale(${(0.93 + 0.07 * inP - outP * 0.05).toFixed(3)})`,
      opacity: Math.min(1, inP * 1.7) * (1 - outP),
    }}>
      <Bed pad={20}>
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
const KF = [0, 88, 146, 200, 296, 386, 470, 566, 623, 688, 731, 830, 921, 1030, 1146, 1258,
  1436, 1560, 1626, 1720, 1836, 1919, 2039, 2180, 2260, G_END];
const camAt = (g: number) => {
  // panX NEGATIVO = el mundo corre a la izquierda = la cámara DERIVA A LA DERECHA (el handoff)
  const base = gcam(g, { z0: 20, z1: 70, panX: -110, panY: -26, ry: 3.4, rx: -1.2, dur: G_END });
  const crane = interpolate(
    g, KF,
    [-18, -34, -52, -20, -6, 8, 16, 24, 12, 12, -8, -22, -6, 10, 22, 30,
      18, 6, -6, -16, -16, 6, 22, 6, -22, -54],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  const push = interpolate(
    g, KF,
    [1.26, 1.14, 1.30, 1.06, 1.02, 1.10, 1.04, 1.06, 1.12, 1.20, 1.06, 1.02, 1.08, 1.03, 1.06, 1.02,
      1.04, 1.08, 1.10, 1.04, 1.04, 1.03, 1.12, 1.06, 1.10, 1.16],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) },
  );
  const FK = [0, 88, 146, 296, 386, 566, 688, 830, 921, 1146, 1436, 1626, 1836, 2039, 2216, G_END];
  const fx = interpolate(g, FK, [44, 52, 74, 44, 50, 46, 46, 58, 58, 50, 44, 56, 52, 58, 46, 50], CL);
  const fy = interpolate(g, FK, [52, 48, 47, 50, 46, 38, 38, 50, 56, 50, 52, 44, 48, 42, 52, 40], CL);
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(4)})`
  );
};

// MediaCard tiene deriva propia (hold VIVO). Lo que se apoya ENCIMA tiene que derivar igual o la
// gráfica patina sobre el material.
const mcSync = (cf: number, x: number, y: number): React.CSSProperties => ({
  transform: `rotateY(${(Math.sin(cf / 67 + y) * 0.5).toFixed(3)}deg) translateY(${(Math.sin(cf / 41 + x) * 2.4).toFixed(2)}px)`,
});

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovS6Cobra: React.FC<{ acto?: number; gFrame?: number }> = ({ gFrame }) => {
  const cf = useCurrentFrame();
  const g = gFrame === undefined ? cf : gFrame;
  const toCF = (t: number) => cf - g + t;   // pasa un frame mío al reloj de las primitivas del Stage

  // ── LA LUZ: función continua de g. Entra en HORA.penumbra (el rincón del medidor), se vuelve
  //    HORA.alerta cuando aparece el que te cobra, sube al mediodía duro para la prueba, y sale
  //    plana de cielo cubierto. Evoluciona, nunca salta. ⛔ Ningún tramo por debajo de luma 25:
  //    `amb` nunca baja de 0,58 y `inten` nunca de 0,70.
  const LK = [0, 12, 88, 146, 296, 386, 470, 566, 623, 688, 731, 830, 921, 1030, 1146, 1258,
    1436, 1560, 1626, 1720, 1836, 1919, 2039, 2180, 2260, G_END];
  const sunAng = interpolate(
    g, LK,
    [HORA.penumbra.ang, 8, 9, 11, 12, HORA.alerta.ang, 14, 13, 12, 12, 18, 26, 34, 58, 74,
      76, 78, 78, 74, 72, 70, 66, 60, 74, 84, 88],
    CL,
  );
  const amb = interpolate(
    g, LK,
    [0.55, 0.62, 0.64, 0.66, 0.64, 0.66, 0.66, 0.64, 0.60, 0.58, 0.66, 0.72, 0.72, 0.80, 0.86,
      0.88, 0.86, 0.84, 0.82, 0.82, 0.80, 0.80, 0.78, 0.76, 0.74, 0.74],
    CL,
  );
  // los tres soles: cálido (lo que te queda) · frío cenital (lo que te cobran) · blanco (el día)
  const warmW = interpolate(g, LK, [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.34, 0.5, 0.44, 0.38, 0.44, 0.5,
    0.46, 0.4, 0.42, 0.44, 0.46, 0.44, 0.4, 0.4, 0.4, 0.42, 0.34, 0.28, 0.2, 0.16], CL);
  const coldW = interpolate(g, LK, [0.62, 0.66, 0.7, 0.78, 0.8, 0.9, 0.94, 0.9, 0.94, 0.9, 0.74, 0.6,
    0.5, 0.4, 0.34, 0.3, 0.3, 0.34, 0.36, 0.36, 0.4, 0.42, 0.6, 0.5, 0.44, 0.42], CL);
  const dayW = interpolate(g, LK, [0.34, 0.38, 0.4, 0.44, 0.46, 0.44, 0.44, 0.42, 0.4, 0.42, 0.52, 0.66,
    0.74, 0.88, 0.98, 1.0, 0.98, 0.94, 0.9, 0.9, 0.86, 0.86, 0.8, 0.86, 0.98, 1.0], CL);
  const coolMix = interpolate(g, LK, [0.86, 0.86, 0.84, 0.82, 0.8, 0.7, 0.66, 0.62, 0.6, 0.6, 0.5, 0.4,
    0.34, 0.26, 0.2, 0.18, 0.18, 0.22, 0.24, 0.24, 0.28, 0.3, 0.44, 0.4, 0.5, 0.56], CL);
  const keyFrom = interpolate(g, LK, [0.7, 0.7, 0.66, 0.6, 0.54, 0.5, 0.46, 0.42, 0.4, 0.4, 0.44, 0.5,
    0.54, 0.5, 0.46, 0.42, 0.38, 0.4, 0.44, 0.46, 0.5, 0.52, 0.56, 0.5, 0.46, 0.44], CL);
  // ⚠️ RAMPA DE AMBIENTE de 12 frames que arranca en 0,88: el frame 0 entra con IMAGEN YA FORMADA
  const inten = interpolate(g, [0, 12, 146, 386, 688, 921, 1146, 1626, 1836, 2216, G_END],
    [0.88, 1.0, 1.02, 1.04, 0.96, 0.92, 1.0, 1.02, 0.98, 0.9, 0.86], CL);
  const floorDim = interpolate(g, [0, 146, 386, 688, 921, 1146, 1626, 1836, 2260, G_END],
    [0.5, 0.46, 0.5, 0.54, 0.48, 0.4, 0.44, 0.46, 0.38, 0.3], CL);

  const cam = camAt(g);
  const cov = coverAt(g);
  const clip = clipOf(cov);
  const cantoHot = cov.open ? clamp01((cov.gR - cov.gL) / 20) : 0;

  // ── COSTURA INTERNA @146 · ZOOM-THROUGH por la pantallita del tercer medidor
  const zw = g >= 146 && g < 178 ? zoomThrough(g, 146, 28, 74, 47) : null;
  const zs: React.CSSProperties = zw
    ? { transform: zw.out, opacity: zw.opacity, transformStyle: "preserve-3d" }
    : { transformStyle: "preserve-3d" };

  // ── FRONTERA A @386 · MATCH-SHAPE. El rectángulo iluminado NO suelta el cuadro: crece.
  const morfP = clamp01((g - 380) / 66);
  const morf = es(morfP);
  // ⛔ COMPUERTA DE VENTANA: con W1 abierta (296-375) NADA del primer plano puede quedar adentro
  //    del hueco, y la cara del medidor es justo lo que estaba en el centro. Así que el objeto NO
  //    se apaga: SE VA VIAJANDO por la izquierda mientras la ranura entra por la derecha, y vuelve
  //    a entrar por la izquierda cuando la ranura ya se fue por ahí — los dos se cruzan sin
  //    tocarse. Cuando reentra, el mismo movimiento se convierte en el crecimiento del MATCH-SHAPE:
  //    es un solo recorrido, no dos.
  const preX = interpolate(g, [196, 288, 312, 364, 392], [50, 50, -30, -30, 50], CL);
  const mw = lerp(520, 1180, morf);
  const mh = lerp(300, 620, morf);
  const mx = lerp(preX, 50, morf);
  const my = lerp(48, 46, morf);
  const verTablero = g >= 196 && g < 688;   // muere EN el corte del beat, no con una rampa

  // ── ACTO 2 · las dos pasadas y el sello
  const selloAt = golpeSello(g);
  const verSello = g >= P1_T0 && g < 712;              // 27 f DESPUES del corte, y muerto antes de W2
  const opRiel1 = clamp01((g - 388) / 16) * clamp01(1 - (g - 452) / 14);
  const opRiel2 = clamp01((g - 462) / 16) * clamp01(1 - (g - 664) / 20);

  // ── FRONTERA D @1836 · MATCH-SHAPE del teléfono → primera tarjeta de resultado
  const telP = es(clamp01((g - 1822) / 52));

  // ── mounts (todo fondo se monta ANTES de su costura: una costura contra nada es un fundido)
  const bgDomo = g >= A1 && g < 108;                   // el swap cae adentro de la tapa (97-109)
  const bgTres = g >= 98 && g < 182;                   // z MAS CERCA que el domo y que el digital
  const bgDigital = g >= 130 && g < 688;               // se revela cuando el zoom-through se va
  const bgCocina = g >= SW3 && g < 938;                // CORTE EN EL BEAT: entra en el frame exacto
  const bgPatio = g >= 926 && g < 1650;                // el swap cae adentro del polvo macizo (922-932)
  const bgRincon = g >= 1626 && g < 2240;              // CORTE EN EL BEAT @1626
  const bgNublado = g >= 2228;                         // el swap cae adentro de la hoja (2225-2239)

  return (
    <AbsoluteFill>
      {/* ════ EL MUNDO — todo lo que puede tapar al avatar vive acá dentro, y ESTO es lo único que
          la apertura recorta. Ni un solo píxel de estas capas llega nunca a su cara. ════ */}
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {/* (b) DE LA GARANTÍA DE OPACIDAD: la atmósfera va FUERA de `Layers` (fuera de la cámara)
            y trae `backgroundColor` opaco. No existe un frame sin el cuadro pintado. */}
        <VoltAtmos
          tint={light(coolMix, "volt", "sky")} tint2={V.amber}
          keyFrom={keyFrom} intensity={inten} floor={floorDim}
        />
        {/* EL SOL ES UN PERSONAJE. La luz siempre por su FUENTE: el frío entra SIEMPRE desde
            arriba (la gris cenital que cae sobre el bisel negro), el cálido desde abajo. */}
        <SunKey ang={sunAng} temp="torch" amb={warmW * amb} soft={64} />
        <SunKey ang={94} temp="sky" amb={coldW * amb * 0.86} soft={82} />
        <SunKey ang={sunAng} temp="bone" amb={dayW * amb * 0.7} soft={90} />

        <Layers cam={cam}>
          {/* ── ACTO 1a · EL DOMO DEL MEDIDOR VIEJO, EL DISCO QUIETO. Materia ENTRANTE, a sangre.
              (c) DE LA GARANTÍA: `scale` ≥ 1,30 desde el frame 0. ───────────────────────────── */}
          {bgDomo && (
            <Plane z={-340}>
              <PhotoPlane src="broll/cmepanel30/cmep30_s6_clip_disco_se_congela.mp4" kind="video"
                z={0} startFrom={0}
                scale={interpolate(g, [0, 60, 108], [1.52, 1.44, 1.40], CL)}
                dim={interpolate(g, [0, 34, 88, 108], [0.36, 0.3, 0.36, 0.42], CL)} tint={V.sky} />
            </Plane>
          )}

          {/* ── ACTO 1b · LOS TRES MEDIDORES SOBRE EL BANCO. Detrás de la tapa de policarbonato. */}
          {bgTres && (
            <AbsoluteFill style={zs}>
              <Plane z={-300}>
                <PhotoPlane src="img/cmepanel30/cmep30_s6_tres_medidores_mesa.png" kind="photo" z={0}
                  scale={interpolate(g, [98, 146, 182], [1.44, 1.62, 2.30], CL)}
                  dim={interpolate(g, [98, 120, 146, 182], [0.44, 0.34, 0.3, 0.26], CL)} tint={V.amber} />
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── ACTOS 1c-2 · EL MEDIDOR DIGITAL. Un solo fondo para 570 frames: lo que cambia es
              la luz, el riel y el sello, no el mundo. Se monta 16 f ANTES del zoom-through. ── */}
          {bgDigital && (
            <Plane z={-320}>
              <PhotoPlane src="img/cmepanel30/cmep30_s6_digital_pantalla.png" kind="photo" z={0}
                scale={interpolate(g, [130, 178, 296, 386, 566, 688], [2.10, 1.52, 1.44, 1.48, 1.42, 1.48], CL)}
                dim={interpolate(g, [130, 178, 296, 386, 470, 623, 688], [0.24, 0.34, 0.4, 0.46, 0.5, 0.52, 0.48], CL)}
                tint={V.sky} />
            </Plane>
          )}

          {/* ── ACTO 3 · LA COCINA Y LA HELADERA. CORTE EN EL BEAT @688, sin transición. ────── */}
          {bgCocina && (
            <>
              <Plane z={-280}>
                <PhotoPlane src="img/cmepanel30/cmep30_s6_refri_culpado.png" kind="photo" z={0}
                  scale={interpolate(g, [688, 800, 938], [1.48, 1.40, 1.46], CL)}
                  dim={interpolate(g, [688, 740, 830, 938], [0.42, 0.34, 0.4, 0.46], CL)} tint={V.amber} />
              </Plane>
              {g >= 806 && g < 936 && (
                <Plane z={-262}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s6_clip_refri_apartado.mp4" kind="video"
                    z={0} startFrom={0}
                    scale={interpolate(g, [806, 936], [1.42, 1.34], CL)}
                    dim={interpolate(g, [806, 870, 936], [0.4, 0.32, 0.38], CL)} tint={V.bone} />
                </Plane>
              )}
            </>
          )}

          {/* ── ACTO 4a · EL PATIO A MEDIODÍA (la prueba). Detrás del wipe de polvo. ───────── */}
          {bgPatio && (
            <Plane z={-250}>
              <PhotoPlane src="img/cmepanel30/cmep30_s4_panel_sol_mediodia.png" kind="photo" z={0}
                scale={interpolate(g, [926, 1146, 1436, 1650], [1.44, 1.38, 1.36, 1.40], CL)}
                dim={interpolate(g, [926, 1030, 1146, 1436, 1650], [0.42, 0.34, 0.36, 0.44, 0.48], CL)}
                tint={V.white} />
            </Plane>
          )}

          {/* ── ACTO 4b-5 · EL RINCÓN DEL MEDIDOR. CORTE EN EL BEAT @1626. ─────────────────── */}
          {bgRincon && (
            <>
              <Plane z={-215}>
                <PhotoPlane src="img/cmepanel30/cmep30_s5_medidor_penumbra.png" kind="photo" z={0}
                  scale={interpolate(g, [1626, 1836, 2039, 2240], [1.40, 1.34, 1.32, 1.38], CL)}
                  dim={interpolate(g, [1626, 1720, 1836, 2039, 2240], [0.4, 0.34, 0.38, 0.42, 0.46], CL)}
                  tint={V.sky} />
              </Plane>
              {g >= 1630 && g < 1770 && (
                <Plane z={-200}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s6_clip_espera_diez_min.mp4" kind="video"
                    z={0} startFrom={0}
                    scale={interpolate(g, [1630, 1770], [1.36, 1.30], CL)}
                    dim={interpolate(g, [1630, 1700, 1770], [0.4, 0.32, 0.4], CL)} tint={V.bone} />
                </Plane>
              )}
            </>
          )}

          {/* ── SALIDA · EL PATIO BAJO CIELO CUBIERTO. La cámara SUBE y la luz se aplana. ──── */}
          {bgNublado && (
            <>
              <Plane z={-185}>
                <PhotoPlane src="img/cmepanel30/cmep30_s7_paneles_cielo_gris.png" kind="photo" z={0}
                  scale={interpolate(g, [2228, 2340], [1.38, 1.28], CL)}
                  dim={interpolate(g, [2228, 2280, 2340], [0.4, 0.32, 0.28], CL)} tint={V.bone} />
              </Plane>
              {g >= 2248 && (
                <Plane z={-170}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s1_clip_panel_reflejo_cielo.mp4" kind="video"
                    z={0} startFrom={0}
                    scale={interpolate(g, [2248, 2340], [1.34, 1.24], CL)}
                    dim={interpolate(g, [2248, 2300, 2340], [0.38, 0.28, 0.24], CL)} tint={V.bone} />
                </Plane>
              )}
            </>
          )}
        </Layers>
      </AbsoluteFill>

      {/* los cantos de la apertura: el brillo sale SIEMPRE hacia el mundo, jamás hacia la cara */}
      {cov.open && (
        <>
          <CantoV x={cov.gL} dir={-1} hot={cantoHot} />
          <CantoV x={cov.gR} dir={1} hot={cantoHot} />
          {Math.min(cov.shL, cov.shR) > 0.5 && Math.min(cov.shL, cov.shR) < 99 && (
            <CantoTecho c={cov} hot={cantoHot} />
          )}
        </>
      )}

      {/* ════ EL PRIMER PLANO — no está recortado. Con la apertura ABIERTA todo vive fuera del
          hueco: durante las tres ventanas sólo queda un rótulo por encima del canto. ════ */}
      <Layers cam={cam}>

        {/* ═══ ACTO 1 · "LA TERCERA ES LA QUE TIENES QUE REVISAR SÍ O SÍ" ═══════════════════════
            Los primeros 90 frames van a PANTALLA COMPLETA con el domo a sangre: acá es donde el
            video de fondo salta de pose y nadie lo ve. ══════════════════════════════════════ */}
        {g < 96 && (
          <Plane z={62}>
            {/* el rótulo de continuidad: venimos del medidor del trinquete */}
            <Rotulo x={26} y={22} size={34} color={rgba(V.bone, 0.86)}
              op={clamp01((g - 6) / 10) * clamp01(1 - (g - 62) / 14)}>
              EL DEL TRINQUETE
            </Rotulo>
            <Cartel g={g} at={14} out={80} x={50} y={66} size={70} color={V.white}>
              LA <span style={{ color: V.volt }}>TERCERA</span> FAMILIA
            </Cartel>
            <Cartel g={g} at={40} out={82} x={50} y={76} size={48} color={rgba(V.bone, 0.94)}>
              REVÍSALA SÍ O SÍ
            </Cartel>
          </Plane>
        )}

        {/* COSTURA INTERNA @88 · OCLUSIÓN — la tapa de policarbonato gris */}
        <OcluyeTapa g={g} at={88} dur={30} />

        {/* los tres medidores: la lupa se posa sobre el TERCERO justo antes del zoom-through */}
        {g >= 100 && g < 152 && (
          <Plane z={79}>
            <IconPng src="img/cmepanel30/cmep30_ic_lupa.png"
              x={interpolate(g, [100, 140], [40, 73], CL)} y={30} size={116}
              opacity={clamp01((g - 100) / 12) * clamp01(1 - (g - 142) / 10)} rot={-9} glow={V.ink0} />
            <Rotulo x={37} y={78} size={38} color={V.white}
              op={clamp01((g - 104) / 12) * clamp01(1 - (g - 140) / 10)}>
              TRES FAMILIAS · UNA TE COBRA
            </Rotulo>
          </Plane>
        )}

        {/* ═══ LA CARA DEL MEDIDOR DIGITAL — el objeto que cruza la FRONTERA A ════════════════
            De 520×300 (la pantalla) a 1180×620 (el tablero del riel). El objeto no se sustituye:
            es LA MISMA FOTO, agrandada. Eso es el MATCH-SHAPE. ═══════════════════════════════ */}
        {verTablero && (
          <Plane z={46}>
            <div style={{
              position: "absolute", left: `${mx.toFixed(3)}%`, top: `${my.toFixed(3)}%`,
              width: mw, height: mh, marginLeft: -mw / 2, marginTop: -mh / 2,
              transform: `rotateY(${lerp(-7, 0, morf).toFixed(2)}deg) rotateX(${lerp(3, 0, morf).toFixed(2)}deg)`,
              transformStyle: "preserve-3d",
              opacity: clamp01((g - 196) / 22),
            }}>
              <MediaCard src="img/cmepanel30/cmep30_s6_digital_pantalla.png" kind="photo"
                w={mw} h={mh} x={50} y={50} z={0} lit={1} litColor={V.sky}
                label={g >= 210 && g < 300 ? "BISEL NEGRO · DÍGITOS GRANDES" : undefined}
                sheenAt={toCF(232)} radius={lerp(14, 6, morf)} />

              {/* EL RIEL nace SOBRE la misma superficie cuando la forma termina de crecer */}
              <div style={{ position: "absolute", inset: 0, ...mcSync(cf, 50, 50) }}>
                <Riel g={g} y={50} op={opRiel1} dir={1} color={V.sky} />
                <Riel g={g} y={50} op={opRiel2} dir={-1} color={V.amber} />
                {/* PASADA 1 · hacia la casa: FRÍA (te la cobran) */}
                <Paquetes g={g} t0={P1_T0} n={P1_N} dir={1} y={50} color={V.sky} op={opRiel1} />
                {/* PASADA 2 · hacia la red: CÁLIDA (es TUYA, la produjo tu panel) */}
                <Paquetes g={g} t0={P2_T0} n={P2_N} dir={-1} y={50} color={V.amber} op={opRiel2} />
                {/* el contador de verdad, apoyado sobre la cara del medidor */}
                <Contador g={g} x={50} y={22} size={62}
                  op={clamp01((g - 396) / 18) * clamp01(1 - (g - 672) / 18)} />
              </div>
            </div>
          </Plane>
        )}

        {/* ═══ ACTO 1 (cierre) · "NO LE IMPORTA PARA QUÉ LADO VA" ═════════════════════════════ */}
        <Plane z={92}>
          {/* 4 palabras · piso de lectura 3,08 s · vive 158-284 = 4,20 s */}
          <Cartel g={g} at={158} out={268} x={50} y={76} size={58} color={V.white}>
            MIDE EN <span style={{ color: V.sky }}>VALOR ABSOLUTO</span>
          </Cartel>
          {/* ⛔ acá NO va ningún cartel: "no le importa para qué lado va" lo dice ÉL, con la
              ventana abierta, y lo demuestra el acto 2 entero. Con el hueco abierto lo único que
              queda en pantalla es este rótulo, POR ENCIMA del canto (W1 tiene techo en 18 %).
              2 palabras · piso 2,80 s · vive 300-386 = 2,87 s. */}
          <Rotulo x={50} y={14.6} size={36} color={rgba(V.bone, 0.9)}
            op={clamp01((g - 300) / 12) * clamp01(1 - (g - 372) / 14)}>
            EN CASTELLANO:
          </Rotulo>
        </Plane>

        {/* ═══ ACTO 2 · ⭐ EL MECANISMO ══════════════════════════════════════════════════════ */}
        {g >= SW2 - 6 && g < 706 && (
          <>
            <Plane z={96}>
              <Cartel g={g} at={390} out={446} x={50} y={20} size={58} color={V.white}>
                SI PASA ENERGÍA, <span style={{ color: V.sky }}>LA SUMA</span>
              </Cartel>
              {/* las dos direcciones, dichas con la flecha del riel y no con un párrafo */}
              <Rotulo x={78} y={62} size={34} color={rgba(V.sky, 0.96)}
                op={clamp01((g - 404) / 12) * clamp01(1 - (g - 448) / 12)}>
                ENTRA A TU CASA →
              </Rotulo>
              <Rotulo x={24} y={62} size={34} color={rgba(V.amber, 0.96)}
                op={clamp01((g - 480) / 12) * clamp01(1 - (g - 660) / 14)}>
                ← SALE A LA RED
              </Rotulo>
              {/* el mismo sello, la misma frase: es lo que NO cambia */}
              <Rotulo x={50} y={82} size={38} color={V.white}
                op={clamp01((g - 500) / 14) * clamp01(1 - (g - 556) / 14)}>
                EL SELLO NO MIRA LA FLECHA
              </Rotulo>
            </Plane>

            {/* los 53 kWh: son TUYOS, así que suben desde abajo y en cálido (`flujo("queda")`)… */}
            {g >= 452 && g < 660 && (() => {
              const fl = flujo("queda", clamp01((g - 452) / 26));
              return (
                <Plane z={100}>
                  <div style={{
                    transform: `translateY(${(fl.dy * 0.42).toFixed(1)}px)`,
                    opacity: fl.opacity * clamp01(1 - (g - 640) / 18),
                  }}>
                    <Readout value="53" unit="kWh" label="LO QUE LE MANDASTE" at={toCF(455)}
                      x={23} y={72} size={132} color={V.amber} />
                  </div>
                </Plane>
              );
            })()}
            {/* …y "TE LOS COBRA" baja FRÍO desde arriba y aterriza encima. La ley, literal. */}
            {g >= 566 && g < 660 && (() => {
              const fl = flujo("cobran", clamp01((g - 566) / 24));
              return (
                <Plane z={102}>
                  <div style={{
                    transform: `translateY(${(fl.dy * 0.42).toFixed(1)}px)`,
                    opacity: fl.opacity * clamp01(1 - (g - 642) / 16),
                  }}>
                    <Readout value="+53" unit="kWh" label="TE LOS COBRA IGUAL" at={toCF(569)}
                      x={80} y={72} size={132} color={V.sky} />
                  </div>
                </Plane>
              );
            })()}

            {/* el clip real de los dígitos subiendo, con su causalidad: cuenta para los dos lados */}
            {g >= 496 && g < 636 && (
              <Plane z={83}>
                <MediaCard src="broll/cmepanel30/cmep30_s6_clip_digital_sube.mp4" kind="video"
                  w={392} h={236}
                  x={lerp(114, 77, es(clamp01((g - 496) / 34)))}
                  y={lerp(30, 26, es(clamp01((g - 496) / 60)))}
                  z={0} ry={-12} rx={2} startFrom={2} lit={0.98} litColor={V.sky}
                  label="LOS DÍGITOS SUBEN IGUAL" sheenAt={toCF(560)} radius={11} />
              </Plane>
            )}

            {/* LA TESIS DEL ACTO. Baja fría desde arriba: es la regla que te aplican. */}
            <Plane z={105}>
              <Cartel g={g} at={626} out={676} x={50} y={52} size={66} color={V.white} tipo="cobran">
                TE COBRA LA ENERGÍA<br />QUE <span style={{ color: V.sky }}>REGALASTE</span>
              </Cartel>
            </Plane>
          </>
        )}

        {/* ═══ ⭐ EL SELLO · el objeto del "valor absoluto" Y la bisagra de la FRONTERA B ═════
            Mismo objeto, misma x/y, mismo cuerpo y mismo golpe en las DOS pasadas — lo único que
            cambia entre una y otra es la flecha del riel. Y vive FUERA del bloque del acto 2: el
            golpe clavado en 684 sigue bajando después del corte del beat y termina estampando la
            FACTURA en vez del contador. Ésa es la bisagra: no hay un frame sin él. ═══════════ */}
        {verSello && selloAt > 0 && (
          <Plane z={105}>
            <Sello g={g} at={selloAt} x={50} y={31} size={172} op={clamp01((g - 396) / 12)} />
          </Plane>
        )}

        {/* ═══ ACTO 3 · "MESES CULPANDO AL REFRIGERADOR" ═════════════════════════════════════ */}
        {g >= SW3 && g < 940 && (
          <>
            <Plane z={96}>
              {/* durante W2 (700-800) sólo el rótulo, por encima del canto (techo en 8 %) */}
              <Rotulo x={50} y={16.1} size={36} color={rgba(V.bone, 0.9)}
                op={clamp01((g - 718) / 12) * clamp01(1 - (g - 788) / 14)}>
                Y NO ES UNA LEYENDA
              </Rotulo>
              <Cartel g={g} at={806} out={868} x={62} y={20} size={58} color={V.white} tipo="cobran">
                LE SUBIÓ <span style={{ color: V.sky }}>LA FACTURA</span>
              </Cartel>
              <Cartel g={g} at={846} out={912} x={50} y={80} size={60} color={V.white}>
                MESES BUSCANDO<br />DONDE NO ERA
              </Cartel>
            </Plane>

            {/* las tres facturas que suben: objetos PNG de la escena, entrando frías desde arriba */}
            {g >= 812 && g < 902 && (
              <Plane z={88}>
                {[0, 1, 2].map((i) => {
                  const fl = flujo("cobran", clamp01((g - 812 - i * 13) / 22));
                  return (
                    <div key={i} style={{
                      transform: `translateY(${(fl.dy * 0.5).toFixed(1)}px)`,
                      opacity: fl.opacity * clamp01(1 - (g - 886) / 14),
                    }}>
                      <IconPng src="img/cmepanel30/cmep30_ic_billete.png"
                        x={70 + i * 8} y={44 - i * 8} size={96 + i * 14}
                        opacity={0.94} rot={-6 + i * 5} glow={V.ink0} />
                    </div>
                  );
                })}
              </Plane>
            )}

            {/* la lupa que busca detrás de la heladera y NO encuentra nada, y después se va a la
                pared: la historia humana contada con un objeto que se mueve, no con un dato */}
            {g >= 838 && g < 926 && (
              <Plane z={102}>
                <IconPng src="img/cmepanel30/cmep30_ic_lupa.png"
                  x={interpolate(g, [838, 878, 906, 926], [30, 24, 24, 15], CL)}
                  y={interpolate(g, [838, 878, 906, 926], [56, 62, 62, 40], CL)}
                  size={interpolate(g, [838, 906, 926], [120, 120, 96], CL)}
                  opacity={clamp01((g - 838) / 12) * clamp01(1 - (g - 916) / 12)}
                  rot={-12} glow={V.ink0} />
                <IconPng src="img/cmepanel30/cmep30_ic_congelador.png" x={35} y={74} size={96}
                  opacity={clamp01((g - 848) / 14) * clamp01(1 - (g - 898) / 14) * 0.9}
                  rot={4} glow={V.ink0} />
              </Plane>
            )}

            {/* la marca de polvo: la materia que va a cruzar la frontera C, ya presente en escena */}
            {g >= 862 && g < 936 && (
              <Plane z={75}>
                <MediaCard src="img/cmepanel30/cmep30_s6_refri_culpado.png" kind="photo"
                  w={410} h={246}
                  x={lerp(-14, 27, es(clamp01((g - 862) / 32)))}
                  y={lerp(36, 30, es(clamp01((g - 862) / 56)))}
                  z={0} ry={13} rx={-2} lit={0.94} litColor={V.amber}
                  label="LA MARCA EN LAS BALDOSAS" sheenAt={toCF(898)} radius={11} />
              </Plane>
            )}
          </>
        )}

        {/* ═══ FRONTERA C @921 · WIPE POR MATERIA — EL POLVO DEL RECTÁNGULO ═════════════════ */}
        <SeamWipeMatter at={toCF(906)} dur={40} tint={POLVO} />
        <PolvoTapa g={g} at={906} dur={40} />

        {/* ═══ ACTO 4 · ⭐ LA PRUEBA DE LOS 10 MINUTOS ══════════════════════════════════════ */}
        {g >= SW4 - 8 && g < 1856 && (
          <>
            <Plane z={97}>
              {/* con W3 abierta (930-1022) lo único en pantalla es este rótulo, por encima del
                  canto (techo en 16 %). 4 palabras · piso 3,08 s · vive 936-1032 = 3,20 s. */}
              <Rotulo x={50} y={15.6} size={36} color={rgba(V.bone, 0.9)}
                op={clamp01((g - 936) / 12) * clamp01(1 - (g - 1020) / 12)}>
                LO PROBÉ EN MI CASA
              </Rotulo>
              {/* y el titular del acto entra con la ventana YA cerrada, arriba, sin pisar los dos
                  sellos de la promesa. 5 palabras · piso 3,36 s · vive 1040-1146 = 3,53 s. */}
              <Cartel g={g} at={1040} out={1130} x={50} y={22} size={58} color={V.white}>
                HAZLO ANTES DE <span style={{ color: V.volt }}>GASTAR UN PESO</span>
              </Cartel>
            </Plane>

            {/* LOS DOS SELLOS DE LA PROMESA: 10 minutos y gratis. Son TUYOS: suben desde abajo. */}
            {g >= 1040 && g < 1200 && (() => {
              const fl = flujo("queda", clamp01((g - 1040) / 24));
              // el disco del reloj es el objeto que hace el MATCH-SHAPE @1146 (círculo → sol)
              const solP = es(clamp01((g - 1146) / 40));
              return (
                <Plane z={99}>
                  <div style={{
                    transform: `translateY(${(fl.dy * 0.4).toFixed(1)}px)`,
                    opacity: fl.opacity * clamp01(1 - (g - 1148) / 20),
                  }}>
                    <Readout value="10" unit="MIN" label="LO QUE TE LLEVA" at={toCF(1043)}
                      x={31} y={70} size={144} color={V.volt} />
                    <Readout value="$0" label="LO QUE TE CUESTA" at={toCF(1064)}
                      x={70} y={70} size={144} color={V.amber} />
                  </div>
                  {/* el DISCO del reloj: crece, pierde las agujas y se vuelve el sol del patio */}
                  <div style={{
                    position: "absolute", left: `${lerp(31, 24, solP).toFixed(2)}%`,
                    top: `${lerp(70, 22, solP).toFixed(2)}%`,
                    width: lerp(178, 430, solP), height: lerp(178, 430, solP),
                    marginLeft: lerp(-89, -215, solP), marginTop: lerp(-89, -215, solP),
                    borderRadius: "50%",
                    border: `${lerp(7, 0, solP).toFixed(1)}px solid ${rgba(V.volt, 0.7 * (1 - solP))}`,
                    background: `radial-gradient(circle, ${rgba(V.torch, 0.1 + 0.5 * solP)} 0%, ${rgba(V.amber, 0.34 * solP)} 46%, rgba(0,0,0,0) 72%)`,
                    // el aro se disuelve DENTRO del resplandor del sol ya formado: el círculo
                    // no se apaga contra el fondo, se lo come el objeto en el que se convirtió
                    opacity: clamp01((g - 1044) / 14) * clamp01(1 - (g - 1176) / 24),
                  }} />
                </Plane>
              );
            })()}

            {/* el sol ya formado, después del match-shape del disco */}
            {g >= 1150 && g < 1300 && (
              <Plane z={38}>
                <IconPng src="img/cmepanel30/cmep30_ic_sol.png"
                  x={interpolate(g, [1150, 1300], [24, 27], CL)}
                  y={interpolate(g, [1150, 1300], [22, 19], CL)} size={168}
                  opacity={clamp01((g - 1152) / 18) * clamp01(1 - (g - 1282) / 16)}
                  rot={0} glow={V.ink0} />
              </Plane>
            )}

            {/* ⭐ LA RECETA — la tira que se llena y se queda */}
            <Plane z={30}>
              <TiraPasos g={g} op={clamp01((g - 1152) / 20) * clamp01(1 - (g - 1840) / 26)} />
            </Plane>

            {/* PASO 1 · DÍA DE SOL, CERCA DEL MEDIODÍA (5 palabras → piso 3,36 s; vive 3,60 s) */}
            <Plane z={95}>
              <Cartel g={g} at={1156} out={1264} x={62} y={78} size={56} color={V.white}>
                DÍA DE SOL,<br />CERCA DEL MEDIODÍA
              </Cartel>
            </Plane>
            {g >= 1160 && g < 1300 && (
              <Plane z={82}>
                <MediaCard src="broll/cmepanel30/cmep30_s6_clip_espera_diez_min.mp4" kind="video"
                  w={470} h={282}
                  x={lerp(118, 66, es(clamp01((g - 1160) / 36)))}
                  y={lerp(42, 38, es(clamp01((g - 1160) / 64)))}
                  z={0} ry={-11} rx={2} startFrom={4} lit={1} litColor={V.white}
                  label="EL SOL A PLOMO" sheenAt={toCF(1226)} radius={12} />
              </Plane>
            )}

            {/* PASO 2 · APAGA TODO, EL REFRIGERADOR TAMBIÉN (5 palabras → 3,36 s; vive 5,60 s) */}
            <Plane z={95}>
              <Cartel g={g} at={1262} out={1430} x={62} y={78} size={56} color={V.white}>
                APAGA TODO.<br />EL <span style={{ color: V.volt }}>REFRIGERADOR</span> TAMBIÉN
              </Cartel>
            </Plane>
            {g >= 1268 && g < 1404 && (
              <Plane z={82}>
                <MediaCard src="broll/cmepanel30/cmep30_s6_clip_desenchufa_refri.mp4" kind="video"
                  w={492} h={296}
                  x={lerp(-16, 62, es(clamp01((g - 1268) / 38)))}
                  y={lerp(40, 36, es(clamp01((g - 1268) / 66)))}
                  z={0} ry={12} rx={-2} startFrom={2} lit={1} litColor={V.white}
                  label="10 MINUTOS NO LE HACEN NADA" sheenAt={toCF(1334)} radius={12} />
              </Plane>
            )}
            {g >= 1352 && g < 1444 && (
              <Plane z={78}>
                <MediaCard src="img/cmepanel30/cmep30_s6_tablero_bajado.png" kind="photo"
                  w={392} h={236}
                  x={lerp(116, 78, es(clamp01((g - 1352) / 32)))}
                  y={lerp(66, 62, es(clamp01((g - 1352) / 56)))}
                  z={0} ry={-13} rx={2} lit={0.96} litColor={V.sky}
                  label="LO QUE SE PUEDA BAJAR" sheenAt={toCF(1408)} radius={11} />
              </Plane>
            )}

            {/* EL PORQUÉ (no es un paso: es la razón del paso 2) · 8 palabras → 4,20 s; vive 5,86 s */}
            <Plane z={95}>
              <Cartel g={g} at={1444} out={1620} x={62} y={78} size={54} color={V.white}>
                LA CASA AL MÍNIMO.<br />EL <span style={{ color: V.volt }}>PANEL A FULL</span>
              </Cartel>
              <Rotulo x={62} y={20} size={38} color={rgba(V.amber, 0.96)}
                op={clamp01((g - 1508) / 14) * clamp01(1 - (g - 1600) / 16)}>
                PARA QUE SOBRE ENERGÍA SÍ O SÍ
              </Rotulo>
            </Plane>
            {g >= 1450 && g < 1590 && (
              <Plane z={82}>
                <MediaCard src="img/cmepanel30/cmep30_s5_casa_apagada.png" kind="photo"
                  w={430} h={258}
                  x={lerp(-16, 42, es(clamp01((g - 1450) / 34)))}
                  y={lerp(46, 42, es(clamp01((g - 1450) / 60)))}
                  z={0} ry={12} rx={-2} lit={0.9} litColor={V.amber}
                  label="LA CASA, EN SILENCIO" sheenAt={toCF(1520)} radius={11} />
              </Plane>
            )}

            {/* ═══ COSTURA INTERNA @1626 · CORTE EN EL BEAT ═════════════════════════════════
                LA BISAGRA es LA TIRA DE PASOS: idéntica, misma x, mismo cuerpo, mismos tildes a
                los dos lados del corte. Nada más sobrevive al filo. ══════════════════════ */}

            {/* PASO 3 · FOTO A LA LECTURA (4 palabras → 3,08 s; vive 3,60 s) */}
            <Plane z={95}>
              <Cartel g={g} at={1642} out={1750} x={62} y={78} size={58} color={V.white}>
                FOTO A LA LECTURA
              </Cartel>
            </Plane>
            {g >= 1646 && g < 1780 && (
              <Plane z={82}>
                <MediaCard src="broll/cmepanel30/cmep30_s5_clip_telefono_contra_caja.mp4" kind="video"
                  w={470} h={282}
                  x={lerp(118, 66, es(clamp01((g - 1646) / 36)))}
                  y={lerp(42, 38, es(clamp01((g - 1646) / 62)))}
                  z={0} ry={-11} rx={2} startFrom={2} lit={1} litColor={V.torch}
                  label="LA PANTALLA ILUMINA EL VIDRIO" sheenAt={toCF(1706)} radius={12} />
              </Plane>
            )}

            {/* PASO 4 · 10 MINUTOS — una CIFRA, no una frase: se lee de un vistazo */}
            {g >= 1716 && g < 1808 && (() => {
              const fl = flujo("queda", clamp01((g - 1716) / 22));
              return (
                <Plane z={99}>
                  <div style={{
                    transform: `translateY(${(fl.dy * 0.38).toFixed(1)}px)`,
                    opacity: fl.opacity * clamp01(1 - (g - 1792) / 16),
                  }}>
                    <Readout value="10" unit="MIN" label="SIN TOCAR NADA" at={toCF(1719)}
                      x={62} y={76} size={152} color={V.volt} />
                  </div>
                  <IconPng src="img/cmepanel30/cmep30_ic_reloj.png" x={38} y={72} size={112}
                    opacity={clamp01((g - 1722) / 14) * clamp01(1 - (g - 1790) / 14)}
                    rot={-6} glow={V.ink0} />
                </Plane>
              );
            })()}

            {/* PASO 5 · LA SEGUNDA FOTO — y el objeto que va a cruzar la FRONTERA D */}
            {g >= 1776 && g < 1830 && (
              <Plane z={82}>
                <MediaCard src="broll/cmepanel30/cmep30_s6_clip_segunda_foto.mp4" kind="video"
                  w={420} h={252}
                  x={lerp(-14, 40, es(clamp01((g - 1776) / 30)))}
                  y={lerp(44, 40, es(clamp01((g - 1776) / 48)))}
                  z={0} ry={12} rx={-2} startFrom={2} lit={1} litColor={V.torch}
                  label="Y AHORA LA SEGUNDA" sheenAt={toCF(1812)} radius={11} />
              </Plane>
            )}
          </>
        )}

        {/* ═══ FRONTERA D @1836 · MATCH-SHAPE — EL TELÉFONO SE VUELVE EL VEREDICTO ══════════
            El rectángulo del teléfono con las DOS lecturas gira a plano, crece, y se convierte en
            la primera tarjeta de resultado: la foto que sacaste ES el veredicto. ═══════════ */}
        {g >= 1822 && g < 1932 && (
          <Plane z={89}>
            <div style={{ opacity: clamp01((g - 1822) / 12) * clamp01(1 - (g - 1912) / 18) }}>
              <MediaCard src="img/cmepanel30/cmep30_s6_dos_lecturas_telefono.png" kind="photo"
                w={lerp(300, 560, telP)} h={lerp(180, 336, telP)}
                x={32} y={lerp(60, 66, telP)}
                z={0} ry={lerp(14, 0, telP)} rx={lerp(-8, 0, telP)}
                lit={1} litColor={V.torch}
                label="LAS DOS LECTURAS" sheenAt={toCF(1848)} radius={lerp(16, 12, telP)} />
            </div>
          </Plane>
        )}

        {/* ═══ ACTO 5 · LOS TRES RESULTADOS ════════════════════════════════════════════════ */}
        {g >= SW5 && g < 2240 && (
          <>
            <Plane z={98}>
              <Veredicto g={g} at={1842} out={2100} y={34} flecha="↓" titulo="SI EL NÚMERO BAJÓ"
                sub="TIENES EL MEDIDOR BUENO" color={V.volt} />
              <Veredicto g={g} at={1924} out={2150} y={55} flecha="=" titulo="SI QUEDÓ IGUAL"
                sub="ES EL DEL TRINQUETE · EL MÍO" color={V.amber} />
              <Veredicto g={g} at={2044} out={2224} y={76} flecha="↑" titulo="SI EL NÚMERO SUBIÓ"
                sub="TE VA A COBRAR LO QUE SOBRE" color={V.sky} />
            </Plane>

            {/* el material real de cada veredicto: tres tarjetas que viajan por el MISMO riel */}
            {g >= 1856 && g < 1980 && (
              <Plane z={83}>
                <MediaCard src="broll/cmepanel30/cmep30_s6_clip_ruedas_bajan.mp4" kind="video"
                  w={356} h={214}
                  x={lerp(-14, 27, es(clamp01((g - 1856) / 30)))} y={34 + rail5(g)}
                  z={0} ry={13} rx={-2} startFrom={2} lit={1} litColor={V.volt}
                  label="LOS NÚMEROS BAJAN" sheenAt={toCF(1912)} radius={10} />
              </Plane>
            )}
            {g >= 1936 && g < 2074 && (
              <Plane z={83}>
                <MediaCard src="broll/cmepanel30/cmep30_s6_clip_unita_traba.mp4" kind="video"
                  w={356} h={214}
                  x={lerp(-14, 27, es(clamp01((g - 1936) / 30)))} y={55 + rail5(g)}
                  z={0} ry={13} rx={-2} startFrom={2} lit={1} litColor={V.amber}
                  label="LA UÑITA LO TRABA" sheenAt={toCF(1998)} radius={10} />
              </Plane>
            )}
            {g >= 2050 && g < 2190 && (
              <Plane z={83}>
                <MediaCard src="broll/cmepanel30/cmep30_s6_clip_digital_sube.mp4" kind="video"
                  w={356} h={214}
                  x={lerp(-14, 27, es(clamp01((g - 2050) / 30)))} y={76 + rail5(g)}
                  z={0} ry={13} rx={-2} startFrom={6} lit={1} litColor={V.sky}
                  label="Y ÉSTE TE LO COBRA" sheenAt={toCF(2112)} radius={10} />
              </Plane>
            )}

            {/* EL CIERRE ÚTIL: lo que hay que pedir, y que te lo den por escrito */}
            <Plane z={102}>
              <Cartel g={g} at={2152} out={2214} x={50} y={27} size={62} color={V.white} tipo="cobran">
                PIDE UN MEDIDOR<br /><span style={{ color: V.volt }}>BIDIRECCIONAL</span>
              </Cartel>
              <Rotulo x={50} y={48} size={40} color={rgba(V.bone, 0.94)}
                op={clamp01((g - 2178) / 12) * clamp01(1 - (g - 2212) / 12)}>
                ANTES DE INSTALAR NADA
              </Rotulo>
            </Plane>
            {g >= 2160 && g < 2226 && (
              <Plane z={87}>
                <MediaCard src="img/cmepanel30/cmep30_s6_hoja_por_escrito.png" kind="photo"
                  w={392} h={236}
                  x={lerp(116, 78, es(clamp01((g - 2160) / 28)))}
                  y={lerp(74, 70, es(clamp01((g - 2160) / 46)))}
                  z={0} ry={-13} rx={2} lit={0.98} litColor={V.torch}
                  label="Y QUE TE LO DEN POR ESCRITO" sheenAt={toCF(2200)} radius={11} />
              </Plane>
            )}
          </>
        )}

        {/* ═══ COSTURA INTERNA @2216 · OCLUSIÓN — LA HOJA DEL "POR ESCRITO" ════════════════ */}
        <OcluyeHoja g={g} at={2216} dur={32} />

        {/* ═══ EL ATERRIZAJE · el patio bajo cielo cubierto. Cámara subiendo, luz plana. ═══ */}
        {g >= 2248 && (
          <Plane z={79}>
            <MediaCard src="broll/cmepanel30/cmep30_s7_clip_nubes_cruzan_paneles.mp4" kind="video"
              w={lerp(430, 520, es(clamp01((g - 2248) / 70)))}
              h={lerp(258, 312, es(clamp01((g - 2248) / 70)))}
              x={lerp(116, 70, es(clamp01((g - 2248) / 34)))}
              y={lerp(66, 58, es(clamp01((g - 2248) / 60)))}
              z={0} ry={-11} rx={2} startFrom={0} lit={0.94} litColor={V.bone}
              label="EL CIELO MANDA" sheenAt={toCF(2300)} radius={12} />
          </Plane>
        )}
      </Layers>
    </AbsoluteFill>
  );
};
