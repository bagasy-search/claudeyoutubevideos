// MovS4Pinza.tsx — MOVIMIENTO S4 · "310 → 40, Y LAS SEIS VECES"
// Video `cmepanel30` (Claudio Mendoza Constructor, ES). 5 actos · 0 → 1684 frames @30 = 56,13 s.
// Tramo global 10429 → 12113. ES EL CORAZÓN DEL VIDEO: los 24 minutos existen para llegar acá.
// Se monta ENCIMA del avatar real de Claudio. ⛔ CERO capas de color con opacidad sobre su cara:
//    las ventanas son GEOMETRÍA (`clip-path`), nunca un fundido.
//
// ── CÓMO ESTÁ CONSTRUIDO ──────────────────────────────────────────────────────────────────────
// 0. EL RITMO DE LAS SEIS VECES (lo que hace que la sexta no se parezca a la primera):
//    intervalo 108 · 54 · 17 · 14 · 11 frames — un accelerando real, de dos ciclos narrados a un
//    stretto de cuatro · rampa de la aguja 32 · 33 · 30 · 5 · 4 · 2 frames (leer el número deja
//    de ser un acontecimiento y pasa a ser un interruptor) · golpe de cámara cada vez más CORTO y
//    más DURO (22f/0,055 → 7f/0,125) · un ENCUADRE distinto por vuelta, que salta en UN frame:
//    pantalla completa → el número abajo → esquina a 124 px → centro a 252 → tercio derecho a
//    132 → ⭐ 430 px a sangre, el número más grande del video · y debajo de las cuatro últimas
//    corre SIEMPRE el mismo clip (`ciclo_enchufe`), así que lo que cambia es el encuadre y no el
//    material: el ritmo se siente en el cuerpo y no se lee como una tanda de cortes.
// 1. UNA SOLA ESPINA NUMÉRICA: `vatiosAt(g)`. La lectura de la pinza es una función pura del
//    frame, y de ella cuelga TODO lo demás: la cifra en pantalla, la densidad de carga que corre
//    por la columna del cable, cuánta luz FRÍA cae desde arriba (la compañía), cuánto ÁMBAR sube
//    desde abajo (lo que te queda) y el golpe de cámara. Cuando el número baja, BAJA EL MUNDO.
//    Por eso la caída de 310 a 40 se siente física y no tipográfica.
// 2. EL MUNDO (atmósfera + soles + placas a sangre + el MARCO) vive DENTRO de un único contenedor
//    recortado por LA APERTURA (`coverAt` → `clipOf`). Hueco cerrado = el mundo tapa la pantalla.
//    Hueco abierto = el mundo queda sólo en los tercios y Claudio se ve LIMPIO en el medio.
//    Las CUATRO ventanas usan cuatro gestos DISTINTOS, y ninguno repite los de S1/S2/S3:
//      W1 (96-300)    MORDAZAS: las dos hojas se abren PASÁNDOSE de largo (overshoot, como unas
//                     mordazas que saltan) y cierran por CONVERGENCIA DESCENTRADA — se juntan en
//                     el 63 %, no en el medio: la hoja izquierda viaja 2,4× más que la derecha.
//      W2 (462-566)   ⭐ la única con HUECO RECTANGULAR (la forma del display de la pinza): se
//                     despliega desde la esquina inferior izquierda hacia afuera, y CIERRA CON UN
//                     OBTURADOR QUE SUBE DESDE ABAJO hasta chocar con la banda superior. Cerrar
//                     desde abajo no lo puede hacer ninguna de las ventanas en U de los hermanos.
//      W3 (1006-1140) TRINQUETE: se abre en TRES escalones de UN frame (1006 · 1014 · 1022) que
//                     ensanchan las dos hojas (42/58 → 30/70 → 20/80) con la banda superior ya
//                     arriba, y entre escalón y escalón NO SE MUEVE: es el ritmo del interruptor
//                     ensayándose antes de empezar. Muere de un CORTE SECO de un frame sobre
//                     "Lo apagué" — la única costura seca del movimiento.
//      W4 (1420-1556) RETIRADA RADIAL: laterales y banda superior se van A LA VEZ con la misma
//                     curva (el mundo se abre en cruz desde el centro) y cierra con una VISERA
//                     INCLINADA: la banda superior baja con el borde en diagonal (la derecha
//                     llega 11 frames después que la izquierda).
// 3. EL PRIMER PLANO (tarjetas, cifras, íconos, titulares) NO está recortado. Con la apertura
//    ABIERTA todo vive en x<27 % o x>73 % y nada entra jamás en la caja de la cara (30-70 % ·
//    10-90 %) medida SOBRE LA ESCALA YA APLICADA por la cámara. Nada sobre boca ni mentón.
// 4. UNA sola cámara `camAt(g)`, función pura de g, con deriva viva y con los GOLPES de los seis
//    ciclos sumados encima. Ningún acto la reinicia. UNA sola atmósfera montada una vez.
// 5. LA MATERIA QUE CRUZA: el MARCO (`Marco`) es literalmente el mismo objeto del frame 84 al
//    594 — nace como el rectángulo del display de la pinza, viaja al tercio derecho, vuelve al
//    centro, crece a pantalla completa y adentro un BARRIDO (no un fundido) cambia el display por
//    la cocina vacía: el display SE VUELVE la casa. Después toma la posta LA COLUMNA
//    (`Columna`), el cable de entrada real con la carga corriendo adentro, que vive del 636 al
//    1500 y es la que contesta a cada uno de los seis interruptores.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⇐ ENTRA DESDE MovS3Ernesto:
//   cam {CERRADO sobre el cable de entrada, push 1,93 total, BAJANDO}   luz {cenital 90°, hueso, amb 1,00}
//   materia {LA PINZA AMARILLA a punto de abrazar el cable} — el clip sigue corriendo (startFrom 46),
//   no se reinicia: es el MISMO plano que venía.
//
// ACTO 1 · 0-444 · "LA PINZA EN EL CABLE"     protagonista: LA PINZA     texto: EL CABLE QUE ENTRA
//   entra  cam {push 1,60, grúa −140 subiendo a −34, foco 50/58}  luz {cenital 90°, hueso, amb 1,00, SIN rampa}
//          materia {las mordazas cerrándose sobre el cable de entrada}
//   sale   cam {push 1,10, grúa −6, foco 50/48}                   luz {cenital 90°, amb 0,96, frío desde ARRIBA a full}
//          materia {EL MARCO DEL DISPLAY con el 310 adentro, a pantalla completa}
//   ── FRONTERA A @444 ···· MATCH-SHAPE: ese mismo marco (un solo objeto, `Marco`, que nunca
//      suelta el cuadro) crece y adentro un BARRIDO geométrico reemplaza el display por la cocina
//      vacía. El display SE VUELVE la casa; el 310 no se mueve un píxel. ⛔ no hay fundido. ······
// ACTO 2 · 444-594 · "310 = MI CASA VACÍA"    protagonista: EL 310       texto: SIN HACER NADA
//   entra  cam {push 1,10, grúa −6}                               luz {cenital 90°, amb 0,96}
//          materia {la casa vacía adentro del marco del display}
//   sale   cam {push 1,08, grúa +6, foco 50/46}                   luz {cenital 90°, amb 0,96, frío pleno}
//          materia {EL 310 SOLO, centrado, enorme, respirando}
//   ── FRONTERA B @594 ···· CORTE EN EL BEAT sobre "Enchufé el panel": en UN frame el mundo salta
//      de la casa vacía al macro del enchufe entrando. BISAGRA: el 310 está en la MISMA x, la
//      misma y, el mismo cuerpo y el mismo color a los dos lados del corte. ⛔ sin flash. ········
// ACTO 3 · 594-979 · "⭐ 310 → 40"             protagonista: LA COLUMNA   texto: CUARENTA VATIOS
//   entra  cam {push 1,08, grúa +6}                               luz {cenital 90°, frío 0,60 desde arriba}
//          materia {el enchufe entrando + el 310 colgado}
//   sale   cam {push 1,12, grúa +18, foco 50/44}                  luz {89°, amb 0,94, frío casi apagado 0,17}
//          materia {EL MEDIDOR y el cable con la carga en gota a gota}
//   (costura INTERNA @706 ···· ZOOM-THROUGH: la cámara entra por la pantalla de la pinza — fx 50 /
//    fy 46 — y sale del otro lado ya DENTRO de la casa, en el congelador del garaje. El tramo de
//    la casa se monta 16 frames antes, DEBAJO: un zoom-through contra nada es un fundido a negro.)
//   ── FRONTERA C @979 ···· OCLUSIÓN: LA PINZA AMARILLA cruza el cuadro de izquierda a derecha con
//      su mordaza, su goma negra y su canto lamido por el sol, y tapa el 100 % entre 977 y 984.
//      El color es el AMARILLO DE LA PINZA (la materia que cruza), ⛔ nunca el del fondo. ········
// ACTO 4 · 979-1359 · "⭐ LAS SEIS VECES"      protagonista: EL INTERRUPTOR  texto: SEIS VECES
//   entra  cam {push 1,04, grúa −6, foco 50/50}                   luz {89°, amb 0,94, frío 0,17}
//          materia {Ernesto quieto con la pinza en la mano}
//   sale   cam {push 1,30 en el sexto golpe, grúa +6}             luz {89°, amb 1,00, volt inundado}
//          materia {LA TARJETA DEL DISPLAY viajando a −0,95 %/frame hacia la izquierda}
//   ── FRONTERA D @1359 ···· MATCH-MOVE: esa tarjeta cruza el corte sin cambiar de velocidad, de
//      dirección ni de y. Detrás de ella el mundo entero pasa al plano abierto de los dos en el
//      patio. Nada frena, nada arranca de cero. ⛔ sin corte percibido. ······················
// ACTO 5 · 1359-1684 · "VERLO EN EL NÚMERO"   protagonista: EL PANEL AL SOL  texto: TE CAMBIA LA CABEZA
//   entra  cam {push 1,08, grúa −2, foco 50/50}                   luz {88°, amb 0,96}
//          materia {los dos riéndose en el patio}
//   sale   cam {ABIERTO al patio entero, push 1,02, SUBIENDO grúa +122, foco 50/40}
//          luz {mediodía 88°, blanco, amb 0,95}
//          materia {EL PANEL AL SOL VISTO DESDE ABAJO, con el aire caliente ondulando}
//   (costura INTERNA @1540 ···· WIPE POR MATERIA: el polvo seco del patio cruza y detrás ya está
//    el panel al sol. Ninguna frontera repite la costura de su vecina.)
//
// ⇒ SALE HACIA MovS4Espina (los 430 que sobran):
//   cam {encuadre ABIERTO del cable al patio entero, subiendo}   luz {mediodía 88°, blanco, amb 0,95}
//   materia {el panel al sol, visto desde abajo}
//
// LAS SEIS COSTURAS DEL MOVIMIENTO, en orden y sin repetir jamás la vecina:
//   MATCH-SHAPE (444) · CORTE EN EL BEAT (594) · ZOOM-THROUGH (706) · OCLUSIÓN (979) ·
//   MATCH-MOVE (1359) · WIPE POR MATERIA (1540).
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero blur grande a pantalla completa · cero
//    fade en ninguna frontera · toda tarjeta flotante lleva FOTO o CLIP real adentro · ningún clip
//    se pide por más de 151 frames (duran 121 f @24 = 5,04 s).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rgba, rnd,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamWipeMatter, zoomThrough, SunKey, HORA,
  Head, Em, Bed,
} from "./PanelStage";

// ── EL RELOJ DEL MOVIMIENTO (frames locales, 30 fps, anclados al ms de Whisper) ───────────────
const A1 = 0, A2 = 444, A3 = 594, A4 = 979, A5 = 1359;
const G_END = 1684;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const es = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
const esOut = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.42, 0, 0.24, 1) });
const esHit = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.62, 0, 0.1, 1) });

// ══════════════════════════════════════════════════════════════════════════════════════════════
// LA ESPINA · `vatiosAt(g)` — LA LECTURA DE LA PINZA COMO FUNCIÓN PURA DEL FRAME
// De acá cuelga todo: la cifra, la carga de la columna, la luz fría de arriba, el ámbar de abajo
// y el golpe de cámara. Cada transición trae su propio SOBREPASO: el número no llega, se PASA y
// se acomoda — como una aguja de verdad. Y los sobrepasos se van achicando: la primera caída dura
// 32 frames y se pasa 16 vatios por debajo; la última dura 2 frames y no se pasa nada.
// ══════════════════════════════════════════════════════════════════════════════════════════════
const TRANS = [
  { at: 636, ks: [0, 13, 21, 32], vs: [310, 78, 24, 40] },     // ⭐ LA CAÍDA
  { at: 1146, ks: [0, 14, 22, 33], vs: [40, 262, 336, 310] },  // ciclo 1 · vuelve a 310
  { at: 1254, ks: [0, 12, 20, 30], vs: [310, 92, 30, 40] },    // ciclo 2 · vuelve a 40
  { at: 1306, ks: [0, 3, 5], vs: [40, 324, 310] },             // ciclo 3 · ya casi sin rampa
  { at: 1322, ks: [0, 2, 4], vs: [310, 31, 40] },              // ciclo 4
  { at: 1336, ks: [0, 2], vs: [40, 310] },                     // ciclo 5 · sin rampa: SNAP
  { at: 1347, ks: [0, 2], vs: [310, 40] },                     // ciclo 6 · SNAP y se queda
];
const vatiosAt = (g: number) => {
  let v = 310;
  for (const t of TRANS) {
    if (g >= t.at) v = interpolate(g, t.ks.map((k) => t.at + k), t.vs, CL);
  }
  return v;
};

// LOS SIETE INTERRUPTORES. El primero (610) es el enchufe original y NO cuenta en las seis; los
// seis siguientes son "lo hicimos como seis veces". `dur` y `amp` son el GOLPE de cámara de cada
// uno: cada vez más corto y más duro — así el sexto no se parece en nada al primero.
const SW = [
  { at: 610, on: true, n: 0, dur: 20, amp: 0.05 },
  { at: 1140, on: false, n: 1, dur: 22, amp: 0.055 },
  { at: 1248, on: true, n: 2, dur: 18, amp: 0.065 },
  { at: 1304, on: false, n: 3, dur: 12, amp: 0.075 },
  { at: 1321, on: true, n: 4, dur: 10, amp: 0.085 },
  { at: 1335, on: false, n: 5, dur: 8, amp: 0.10 },
  { at: 1346, on: true, n: 6, dur: 7, amp: 0.125 },
];
/** el golpe de cámara acumulado (se suma al push): un puñetazo que decae, nunca un salto */
const kickAt = (g: number) => {
  let k = 0;
  for (const s of SW) {
    if (g >= s.at - 1 && g < s.at + s.dur) {
      const p = clamp01((g - s.at) / s.dur);
      k += s.amp * (1 - p) * (1 - p);
    }
  }
  return k;
};
/** cuántos de los seis ya pasaron (para la cuenta de rayos) */
const tallyAt = (g: number) => {
  let n = 0;
  for (const s of SW) if (s.n > 0 && g >= s.at) n = s.n;
  return n;
};
/** el estado del enchufe: sirve para elegir el material sin volver a mirar la cifra */
const onAt = (g: number) => {
  let on = false;
  for (const s of SW) if (g >= s.at) on = s.on;
  return on;
};

// ══ LA APERTURA ══════════════════════════════════════════════════════════════════════════════
// gL = borde derecho de la banda IZQUIERDA · gR = borde izquierdo de la banda DERECHA
// shL/shR = altura de la banda SUPERIOR en cada lado (si difieren, el borde queda INCLINADO)
// sb = altura de la banda INFERIOR (sólo W2: es la única que puede cerrar desde abajo).
type Cover = { gL: number; gR: number; shL: number; shR: number; sb: number; open: boolean };
const CERRADO: Cover = { gL: 50, gR: 50, shL: 0, shR: 0, sb: 0, open: false };

const coverAt = (g: number): Cover => {
  // W1 · ACTO 1 — MORDAZAS: abre con OVERSHOOT (las hojas se pasan de largo y vuelven) y cierra
  //   por CONVERGENCIA DESCENTRADA en el 63 %: la izquierda viaja 44 puntos, la derecha 18.
  if (g >= 96 && g < 300) {
    const t = clamp01((g - 96) / 30);
    const over = Math.sin(clamp01((g - 96) / 22) * Math.PI) * 4.2;   // el salto de la mordaza
    const sh = lerp(100, 11, esOut(clamp01((g - 96) / 24)));
    const vivo = Math.sin(g / 57) * 0.34;                             // hold VIVO: nunca clavada
    const junta = esHit(clamp01((g - 284) / 16));
    const gL = lerp(lerp(50, 19, esOut(t)) - over + vivo, 63, junta);
    const gR = lerp(lerp(50, 81, esOut(t)) + over + vivo, 63, junta);
    return { gL, gR, shL: sh, shR: sh, sb: 0, open: gR - gL > 1.2 };
  }
  // W2 · ACTO 2 — ⭐ HUECO RECTANGULAR con la forma del display: se despliega desde la esquina
  //   inferior izquierda y CIERRA CON UN OBTURADOR QUE SUBE desde abajo.
  if (g >= 462 && g < 566) {
    const abre = es(clamp01((g - 462) / 30));
    const sube = esHit(clamp01((g - 548) / 18));
    const sh = lerp(62, 12, abre);
    const sb = lerp(7, 88, sube);
    const vivo = Math.sin(g / 63) * 0.3;
    return {
      gL: lerp(27, 21, abre) + vivo, gR: lerp(41, 79, abre) + vivo,
      shL: sh, shR: sh, sb, open: 100 - sb - sh > 1.4,
    };
  }
  // W3 · ACTO 4 — TRINQUETE: tres escalones de UN frame, y entre escalón y escalón no se mueve.
  //   Muere de un CORTE SECO de un frame sobre "Lo apagué" (1140).
  if (g >= 1006 && g < 1140) {
    const paso = g >= 1022 ? 2 : g >= 1014 ? 1 : 0;
    const gL = [42, 30, 20][paso];
    const gR = [58, 70, 80][paso];
    const sh = 11;
    const vivo = Math.sin(g / 71) * 0.26;
    return { gL: gL + vivo, gR: gR + vivo, shL: sh, shR: sh, sb: 0, open: true };
  }
  // W4 · ACTO 5 — RETIRADA RADIAL (todo se va a la vez) y cierre con VISERA INCLINADA: la banda
  //   superior baja con el borde en diagonal, la derecha 11 frames más tarde que la izquierda.
  if (g >= 1420 && g < 1556) {
    const abre = es(clamp01((g - 1420) / 32));
    const cL = esOut(clamp01((g - 1526) / 22));
    const cR = esOut(clamp01((g - 1534) / 20));
    const vivo = Math.sin(g / 61) * 0.3;
    const shL = lerp(lerp(100, 10, abre), 100, cL);
    const shR = lerp(lerp(100, 10, abre), 100, cR);
    return {
      gL: lerp(50, 18, abre) + vivo, gR: lerp(50, 82, abre) + vivo,
      shL, shR, sb: 0, open: Math.min(shL, shR) < 98.5,
    };
  }
  return CERRADO;
};

// U abierta hacia abajo (con el borde superior inclinado si shL ≠ shR) — la forma de los hermanos.
// HUECO RECTANGULAR (sólo W2): el contorno exterior va en un sentido y el hueco en el contrario,
// así la regla nonzero lo vacía. El segmento de ida y vuelta a (0,0) es degenerado: no se ve.
const clipOf = (c: Cover) => {
  if (!c.open) return "inset(0px)";
  const L = c.gL.toFixed(2), R = c.gR.toFixed(2);
  const TL = c.shL.toFixed(2), TR = c.shR.toFixed(2);
  if (c.sb > 0.6) {
    const B = (100 - c.sb).toFixed(2);
    return (
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, " +
      L + "% " + TL + "%, " + L + "% " + B + "%, " + R + "% " + B + "%, " +
      R + "% " + TR + "%, " + L + "% " + TL + "%, 0% 0%)"
    );
  }
  return (
    "polygon(0% 0%, 100% 0%, 100% 100%, " + R + "% 100%, " + R + "% " + TR + "%, " +
    L + "% " + TL + "%, " + L + "% 100%, 0% 100%)"
  );
};

// ── LOS CANTOS DE LA APERTURA. Todo su brillo sale HACIA AFUERA (hacia el mundo): ni un píxel de
//    gradiente se apoya sobre la cara. Es lo que hace que la apertura se lea como dos hojas con el
//    canto lamido por el sol y no como una máscara.
const CantoV: React.FC<{ x: number; dir: -1 | 1; hot: number }> = ({ x, dir, hot }) => (
  <div style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 0 }}>
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 3, left: dir === -1 ? -3 : 0,
      background: `linear-gradient(180deg, ${rgba(V.bone, 0.4 * hot)}, ${rgba(V.white, 0.74 * hot)} 46%, ${rgba(V.bone, 0.3 * hot)})`,
    }} />
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 124, left: dir === -1 ? -127 : 3,
      background: dir === -1
        ? `linear-gradient(270deg, ${rgba(V.bone, 0.16 * hot)}, rgba(0,0,0,0) 48%), linear-gradient(270deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.62)})`
        : `linear-gradient(90deg, ${rgba(V.bone, 0.16 * hot)}, rgba(0,0,0,0) 48%), linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.62)})`,
    }} />
  </div>
);
// canto superior con INCLINACIÓN (la visera de W4): se rota entre los dos extremos reales.
const CantoH: React.FC<{ x0: number; x1: number; y0: number; y1: number; hot: number; up?: boolean }> = ({
  x0, x1, y0, y1, hot, up = true,
}) => {
  const dx = ((x1 - x0) / 100) * 1920, dy = ((y1 - y0) / 100) * 1080;
  const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div style={{
      position: "absolute", left: `${x0}%`, top: `${y0}%`, width: len, height: 0,
      transform: `rotate(${ang.toFixed(3)}deg)`, transformOrigin: "0% 50%",
    }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: 3, top: up ? -3 : 0,
        background: `linear-gradient(90deg, ${rgba(V.sky, 0.2 * hot)}, ${rgba(V.white, 0.64 * hot)} 50%, ${rgba(V.sky, 0.2 * hot)})`,
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, height: 96, top: up ? -99 : 3,
        background: up
          ? `linear-gradient(0deg, ${rgba(V.bone, 0.12 * hot)}, rgba(0,0,0,0) 58%), linear-gradient(0deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.6)})`
          : `linear-gradient(180deg, ${rgba(V.bone, 0.12 * hot)}, rgba(0,0,0,0) 58%), linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.6)})`,
      }} />
    </div>
  );
};

// ══ FRONTERA C @979 · LA OCLUSIÓN ════════════════════════════════════════════════════════════
// LA PINZA cruza el cuadro y tapa el 100 % entre 977 y 984. Tiene cuerpo amarillo, la goma negra
// del mango, el gatillo y el canto lamido por el sol: se lee como LA HERRAMIENTA que pasa por
// delante de la lente, no como un flash. ⛔ El color es el de LA MATERIA (el amarillo de la
// pinza); con el color del fondo esto sería un fundido a negro y se ve.
const AMARILLO = "#F2C21A";
const PinzaOcluye: React.FC<{ g: number; at: number; dur?: number }> = ({ g, at, dur = 26 }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(-172, 118, esOut(p));
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-24%", left: `${L.toFixed(2)}%`, width: "158%", height: "150%",
        transform: "rotate(5deg)",
        background:
          `linear-gradient(266deg, ${rgba(V.white, 0.5)} 0%, rgba(255,255,255,0) 2.4%),` +
          `linear-gradient(172deg, #FFE066 0%, ${AMARILLO} 34%, #C89A08 76%, #8A6A05 100%)`,
        boxShadow: `0 0 140px ${rgba(V.ink0, 0.94)}`,
      }}>
        {/* la goma negra del mango: la pinza tiene partes, no es un rectángulo amarillo */}
        <div style={{
          position: "absolute", left: "26%", top: 0, bottom: 0, width: "17%",
          background: "linear-gradient(90deg, #14150F, #2A2C20 40%, #101109 100%)",
          boxShadow: `0 0 40px ${rgba(V.ink0, 0.8)}`,
        }} />
        {/* las estrías de agarre */}
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{
            position: "absolute", left: `${(27 + i * 1.72).toFixed(2)}%`, top: "12%", height: "76%", width: 5,
            background: rgba(V.ink0, 0.55),
          }} />
        ))}
        {/* el gatillo del gancho de la mordaza */}
        <div style={{
          position: "absolute", left: "51%", top: "22%", width: "9%", height: "26%", borderRadius: 18,
          background: "linear-gradient(180deg, #2A2C20, #0E0F0A)",
          boxShadow: `0 12px 30px ${rgba(V.ink0, 0.7)}`,
        }} />
        {/* el canto superior lamido por el cenital */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "16%", height: 10,
          background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.white, 0.5)} 40%, rgba(0,0,0,0))`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ══ LA MATERIA QUE CRUZA LA FRONTERA A · `Marco` ═════════════════════════════════════════════
// UN SOLO objeto del frame 84 al 594. Nace como el rectángulo del DISPLAY de la pinza —con la
// FOTO REAL del macro adentro, no un vector haciendo de objeto— y crece hasta ser la pantalla
// entera; adentro, un BARRIDO GEOMÉTRICO (⛔ jamás un fundido) reemplaza el display por la cocina
// vacía. El display SE VUELVE la casa. Trae la misma piel que las `MediaCard` del Stage: marco de
// vidrio, bisel, reflejo, sombra de contacto y micro-deriva.
const Marco: React.FC<{
  srcA: string; srcB: string; wipe: number;
  x: number; y: number; w: number; h: number; radius?: number;
  ry?: number; rx?: number; lit?: number; litColor?: string; label?: string; op?: number; g: number;
}> = ({
  srcA, srcB, wipe, x, y, w, h, radius = 12, ry = 0, rx = 0,
  lit = 1, litColor = V.volt, label, op = 1, g,
}) => {
  const drift = Math.sin(g / 43 + x) * 2.2;
  const driftR = Math.sin(g / 69 + y) * 0.42;
  const rev = `inset(0% ${((1 - clamp01(wipe)) * 100).toFixed(2)}% 0% 0%)`;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: op,
      transform: `rotateY(${(ry + driftR).toFixed(2)}deg) rotateX(${rx}deg) translateY(${drift.toFixed(2)}px)`,
      transformStyle: "preserve-3d", borderRadius: radius, overflow: "hidden",
      boxShadow: `0 ${Math.round(h * 0.15)}px ${Math.round(h * 0.2)}px ${rgba(V.ink0, 0.74)}, 0 4px 16px ${rgba(V.ink0, 0.6)}`,
      border: `1px solid ${rgba(litColor, 0.26 * lit)}`,
    }}>
      <Img src={staticFile(srcA)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {wipe > 0.001 && (
        <AbsoluteFill style={{ clipPath: rev, WebkitClipPath: rev }}>
          <Img src={staticFile(srcB)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
      {/* el filo del barrido: la línea de luz que separa un material del otro */}
      {wipe > 0.001 && wipe < 0.999 && (
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: `${(clamp01(wipe) * 100).toFixed(2)}%`,
          width: 4, marginLeft: -2,
          background: `linear-gradient(180deg, ${rgba(V.white, 0.2)}, ${rgba(V.volt, 0.92)} 44%, ${rgba(V.white, 0.2)})`,
          boxShadow: `0 0 28px ${rgba(V.volt, 0.7)}`,
        }} />
      )}
      <AbsoluteFill style={{ background: rgba(litColor, 0.055), mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.28 * lit)}, inset 0 0 ${Math.round(h * 0.18)}px ${rgba(V.ink0, 0.5)}` }} />
      <AbsoluteFill style={{ background: `linear-gradient(178deg, ${rgba(V.white, 0.12 * lit)} 0%, rgba(255,255,255,0) 26%)` }} />
      {label && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 16px 10px",
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.88) 62%)",
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 2.2,
          color: V.white, textTransform: "uppercase",
        }}>{label}</div>
      )}
    </div>
  );
};

// ══ LA MATERIA DE LOS ACTOS 3 Y 4 · `Columna` ════════════════════════════════════════════════
// El CABLE DE ENTRADA de la casa, de pie: la FOTO REAL adentro de su marco, y la carga corriendo
// por él hacia abajo. `carga` es la lectura de la pinza normalizada — o sea que ESTO es el número
// hecho materia. Cuando el panel entra, las cuentas de más abajo se aceleran y se lavan por el
// borde inferior: los 270 vatios que dejaron de venir de la compañía SE VAN, no se apagan.
const NMAX = 26;
const Columna: React.FC<{
  g: number; x: number; y: number; w: number; h: number; carga: number;
  op?: number; label?: string; lit?: number;
}> = ({ g, x, y, w, h, carga, op = 1, label, lit = 1 }) => {
  const c = clamp01(carga);
  const vivos = c * NMAX;
  const bead = Math.max(9, w * 0.16);
  const drift = Math.sin(g / 45 + x) * 2;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: op,
      transform: `translateY(${drift.toFixed(2)}px)`,
      borderRadius: 10, overflow: "hidden",
      boxShadow: `0 ${Math.round(h * 0.12)}px ${Math.round(h * 0.18)}px ${rgba(V.ink0, 0.78)}, 0 0 ${Math.round(w * 0.5)}px ${rgba(V.sky, 0.16 * c)}`,
      border: `1px solid ${rgba(V.bone, 0.26 * lit)}`,
    }}>
      {/* MATERIAL REAL: el cable que entra a la casa desde el medidor */}
      <Img src={staticFile("img/cmepanel30/cmep30_s4_cable_entrada_casa.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: rgba(V.ink0, 0.42) }} />
      <AbsoluteFill style={{ background: rgba(V.sky, 0.05), mixBlendMode: "soft-light" }} />
      {/* LA CARGA. Lo que baja por el cable es lo que la compañía te está mandando: FRÍO y desde
          ARRIBA (ley de dirección del Stage). Las cuentas que mueren se lavan por abajo. */}
      {Array.from({ length: NMAX }, (_, i) => {
        const muerta = clamp01(i - vivos);
        const vel = 0.0042 + 0.019 * c;
        const u = ((rnd(i * 4.3) + g * vel) % 1 + 1) % 1 + muerta * 1.35;
        if (u > 1.02) return null;
        const xx = 50 + (rnd(i * 8.9) - 0.5) * 34;
        const s = bead * (0.7 + rnd(i * 2.1) * 0.6);
        return (
          <div key={i} style={{
            position: "absolute", left: `${xx.toFixed(1)}%`, top: `${(u * 100).toFixed(2)}%`,
            width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, borderRadius: "50%",
            opacity: (0.35 + 0.65 * Math.sin(clamp01(u) * Math.PI)) * (1 - muerta * 0.2),
            background: `radial-gradient(circle at 34% 30%, ${rgba(V.sky, 0.98)}, ${rgba(V.sky, 0.34)} 58%, rgba(0,0,0,0) 72%)`,
            boxShadow: `0 0 ${Math.round(s * 1.2)}px ${rgba(V.sky, 0.66)}`,
          }} />
        );
      })}
      {/* la boca de arriba (entra la compañía) y la de abajo (entra a la casa) */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, height: Math.round(h * 0.1),
        background: `linear-gradient(180deg, ${rgba(V.ink0, 0.95)}, rgba(0,0,0,0))`,
        borderBottom: `2px solid ${rgba(V.sky, 0.5)}`,
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: Math.round(h * 0.1),
        background: `linear-gradient(0deg, ${rgba(V.ink0, 0.95)}, rgba(0,0,0,0))`,
        borderTop: `2px solid ${rgba(V.amber, 0.45)}`,
      }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.24)}, inset 0 0 ${Math.round(w * 0.4)}px ${rgba(V.ink0, 0.6)}` }} />
      {label && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 10px 8px",
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1.6,
          color: V.white, textTransform: "uppercase", textAlign: "center",
        }}>{label}</div>
      )}
    </div>
  );
};

// ── LA CIFRA VIVA (el `Readout` del Stage salta a un valor fijo; ésta SIGUE a la espina) ──────
const Cifra: React.FC<{
  v: number; x: number; y: number; size: number; color: string; unit?: string; op?: number; hot?: number;
}> = ({ v, x, y, size, color, unit = "W", op = 1, hot = 1 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.88, color, opacity: op,
    whiteSpace: "nowrap",
    textShadow: `0 0 ${Math.round(size * 0.44 * hot)}px ${rgba(color, 0.46 * hot)}, 0 8px 30px rgba(0,0,0,0.94)`,
  }}>
    {Math.round(v)}
    {unit && (
      <span style={{
        fontSize: Math.round(size * 0.3), marginLeft: Math.round(size * 0.07), color: rgba(color, 0.84),
      }}>{unit}</span>
    )}
  </div>
);

// ── rótulo de escena (detalle ≥30 px, sombra dura obligatoria sobre el negro) ─────────────────
const Rotulo: React.FC<{
  children: React.ReactNode; x: number; y: number; color?: string; size?: number; op?: number;
}> = ({ children, x, y, color = V.bone, size = 32, op = 1 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", opacity: op,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 3.2, color,
    textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.95)",
  }}>{children}</div>
);

// ── LA CUENTA DE LAS SEIS VECES. Seis rayos (PNG sin fondo, objetos de la escena) que se encienden
//    de a uno, y el que acaba de encenderse pega un salto de escala que se apaga en 8 frames.
const Tally: React.FC<{ n: number; g: number; x: number; y: number; size?: number; op?: number }> = ({
  n, g, x, y, size = 64, op = 1,
}) => {
  let ultimo = -1;
  for (const s of SW) if (s.n > 0 && g >= s.at) ultimo = s.at;
  const pop = ultimo < 0 ? 0 : Math.max(0, 1 - (g - ultimo) / 9);
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const on = i < n;
        const nuevo = on && i === n - 1;
        const k = on ? (nuevo ? 1 + 0.36 * pop * pop : 1) : 0.76;
        return (
          <IconPng key={i} src="img/cmepanel30/cmep30_ic_rayo.png"
            x={x + (i - 2.5) * 4.3} y={y} size={size * k} z={0}
            opacity={(on ? 0.98 : 0.15) * op} glow={on ? V.volt : V.ink0} />
        );
      })}
    </>
  );
};

// ── LA CÁMARA · una sola función de g. Entra CERRADA sobre el cable (push total ≈ 1,9, bajando)
//    y aterriza ABIERTA sobre el patio entero, SUBIENDO. Ningún acto la reinicia: los siete golpes
//    de los interruptores se SUMAN encima, no la reemplazan.
const camAt = (g: number) => {
  const base = gcam(g, { z0: 240, z1: 20, panX: -88, panY: 30, ry: -3.1, rx: 1.1, dur: G_END });
  const crane = interpolate(
    g,
    [A1, 60, 120, 300, A2, 520, A3, 660, 726, 860, A4, 1140, 1248, 1304, A5, 1420, 1500, 1560, 1620, G_END],
    [-140, -86, -34, -14, -6, 8, 6, 22, 4, 18, -6, 12, -14, 8, -2, 6, 26, 54, 86, 122],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  const push = interpolate(
    g,
    [A1, 60, 110, 176, 300, 380, A2, 500, 566, A3, 636, 668, 700, 726, 800, 880, A4, 1006, 1140,
      1200, 1248, 1304, 1346, A5, 1420, 1470, 1540, 1600, G_END],
    [1.60, 1.34, 1.12, 1.06, 1.10, 1.16, 1.10, 1.06, 1.14, 1.08, 1.12, 1.24, 1.16, 1.06, 1.10, 1.12,
      1.04, 1.05, 1.16, 1.08, 1.10, 1.14, 1.26, 1.08, 1.05, 1.07, 1.10, 1.05, 1.02],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) },
  ) + kickAt(g);
  const fx = interpolate(g, [A1, 300, A2, A3, 706, 880, A4, 1140, A5, 1560, G_END],
    [50, 50, 50, 50, 50, 46, 50, 50, 50, 50, 50], CL);
  const fy = interpolate(g, [A1, 300, A2, A3, 706, 880, A4, 1140, A5, 1560, G_END],
    [58, 50, 46, 46, 46, 44, 50, 50, 50, 46, 40], CL);
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(4)})`
  );
};

// ── LA GEOMETRÍA DEL MARCO (la materia de la frontera A). Un solo objeto, una sola trayectoria:
//    nace como el display de la pinza, crece a sangre, se va al tercio derecho mientras la ventana
//    está abierta, vuelve al centro, crece otra vez y adentro el barrido lo convierte en la casa.
const marcoAt = (g: number) => {
  const K = [84, 104, 140, 176, 296, 360, 430, 486, 594];
  return {
    w: interpolate(g, K, [700, 2400, 2400, 340, 340, 1420, 1420, 2400, 2400], CL),
    h: interpolate(g, K, [420, 1440, 1440, 204, 204, 852, 852, 1440, 1440], CL),
    x: interpolate(g, K, [50, 50, 50, 80, 80, 50, 50, 50, 50], CL),
    y: interpolate(g, K, [50, 50, 50, 32, 32, 50, 50, 50, 50], CL),
    ry: interpolate(g, K, [0, 0, 0, -12, -12, 0, 0, 0, 0], CL),
    radius: interpolate(g, K, [14, 2, 2, 10, 10, 8, 8, 0, 0], CL),
    label: g >= 150 && g < 300 ? "LA PINZA" : undefined,
    // ⭐ FRONTERA A · el barrido geométrico que convierte el display en la casa vacía
    wipe: es(clamp01((g - 436) / 44)),
  };
};

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovS4Pinza: React.FC<{ acto?: number; gFrame?: number }> = ({ gFrame }) => {
  const cf = useCurrentFrame();
  const g = gFrame === undefined ? cf : gFrame;
  const toCF = (t: number) => cf - g + t;   // pasa un frame mío al reloj interno de las primitivas

  // ── LA ESPINA. Todo lo que sigue cuelga de estas dos líneas.
  const vat = vatiosAt(g);
  const cia = clamp01((vat - 40) / 270);    // 1 = todo viene de la compañía · 0 = el panel lo tapa
  const enchufado = onAt(g);
  const seis = tallyAt(g);

  // ── LA LUZ: función continua de g Y de la espina. Entra en `cenital` (90°, hueso, amb 1,00) sin
  //    rampa —hereda la del vecino— y sale en `mediodia` (88°, blanco, amb 0,95). Nunca salta; lo
  //    único que la sacude son los interruptores, y los sacude porque BAJÓ EL NÚMERO.
  const sunAng = interpolate(
    g, [A1, 400, A2, A3, 726, 880, A4, 1140, A5, 1470, G_END],
    [HORA.cenital.ang, 90, 90, 90, 89, 89, 89, 89, 88, 88, HORA.mediodia.ang], CL,
  );
  const ambBase = interpolate(
    g, [A1, 300, A2, A3, 636, 668, 726, 880, A4, 1140, 1304, A5, 1470, 1560, G_END],
    [HORA.cenital.amb, 0.98, 0.96, 0.98, 0.98, 0.86, 0.92, 0.94, 0.94, 0.96, 1.0, 0.96, 0.94, 0.96,
      HORA.mediodia.amb], CL,
  );
  const amb = ambBase * (0.86 + 0.16 * (1 - cia));
  const boneW = 0.6 + 0.22 * (1 - cia);          // el cenital blanco de laboratorio
  const coldW = 0.14 + 0.46 * cia;               // lo que TE COBRAN: desde ARRIBA y en FRÍO
  const warmW = 0.2 + 0.42 * (1 - cia);          // lo que TE QUEDA: desde ABAJO y en CÁLIDO
  const coolMix = 0.1 + 0.48 * cia;
  const keyFrom = interpolate(g, [A1, 300, A2, A3, 726, A4, 1140, A5, G_END],
    [0.3, 0.46, 0.4, 0.52, 0.34, 0.46, 0.5, 0.4, 0.58], CL);
  const inten = interpolate(g, [A1, 120, A2, A3, 668, 726, A4, 1304, A5, G_END],
    [1.0, 0.98, 0.96, 1.0, 0.82, 0.94, 1.0, 1.08, 0.98, 1.02], CL) * (0.9 + 0.2 * (1 - cia));
  const floorDim = interpolate(g, [A1, A2, A3, 726, A4, A5, G_END],
    [0.5, 0.54, 0.5, 0.58, 0.52, 0.56, 0.46], CL);

  const cam = camAt(g);
  const cov = coverAt(g);
  const clip = clipOf(cov);
  const cantoHot = cov.open ? clamp01((cov.gR - cov.gL) / 24) : 0;
  const abierto = cov.open;

  const a1 = g < A2;
  const a2 = g >= A2 && g < A3;
  const a3 = g >= A3 && g < A4;
  const a4 = g >= A4 && g < A5;
  const a5 = g >= A5;

  // COSTURA INTERNA @706 · ZOOM-THROUGH por la pantalla de la pinza (fx 50 / fy 46). El tramo de
  // la casa se monta 16 frames ANTES, DEBAJO: un zoom-through contra nada es un fundido a negro.
  const z3 = g >= 706 && g < 740 ? zoomThrough(g, 706, 18, 50, 46) : null;
  const w3 = { transform: z3 ? z3.out : undefined, opacity: z3 ? z3.opacity : 1 };

  // FRONTERA D @1359 · MATCH-MOVE. UNA sola velocidad a los dos lados del corte: −0,55 %/frame.
  const MMV = -0.95;
  const mmDisplay = 92 + (g - 1330) * MMV;

  const mk = marcoAt(g);

  return (
    <AbsoluteFill>
      {/* ════ EL MUNDO — todo lo que puede tapar al avatar vive acá dentro, y ESTO es lo único que
          la apertura recorta. Ni un píxel de estas capas llega nunca a su cara. ════ */}
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {/* la atmósfera se monta UNA vez para los 56 s: nunca se remonta entre actos */}
        <VoltAtmos
          tint={light(coolMix, "volt", "sky")} tint2={V.amber}
          keyFrom={keyFrom} intensity={inten} floor={floorDim}
        />
        {/* el SOL es un personaje. El frío de arriba y el cálido de abajo los maneja LA ESPINA */}
        <SunKey ang={sunAng} temp="bone" amb={boneW * amb} soft={70} />
        <SunKey ang={102} temp="sky" amb={coldW * amb} soft={80} />
        <SunKey ang={-24} temp="amber" amb={warmW * amb * 0.8} soft={68} />

        <Layers cam={cam}>
          {/* ── ACTO 1 · el medidor de la pared, al fondo de todo ─────────────────────────── */}
          {g >= 56 && g < A2 && (
            <Plane z={-380}>
              <PhotoPlane src="img/cmepanel30/cmep30_s4_medidor_pared.png" kind="photo" z={0}
                scale={1.3} dim={interpolate(g, [56, 140, 300, A2], [0.5, 0.44, 0.5, 0.58], CL)}
                tint={V.sky} />
            </Plane>
          )}

          {/* ── LA MATERIA ENTRANTE: el clip que YA venía corriendo en el movimiento anterior.
                  `startFrom 46` = sigue exactamente donde lo dejó S3, no se reinicia. ────── */}
          {g < 104 && (
            <Plane z={-40}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_pinza_abraza_cable.mp4" kind="video"
                w={interpolate(g, [0, 102], [1900, 2400], CL)}
                h={interpolate(g, [0, 102], [1140, 1440], CL)}
                x={50} y={50} z={0} startFrom={46} lit={1} litColor={V.volt}
                radius={4} sheenAt={toCF(26)} />
            </Plane>
          )}

          {/* ── ⭐ EL MARCO · la materia que cruza la FRONTERA A. Un solo objeto del 84 al 594:
                  el display de la pinza que crece, se va al tercio, vuelve, y adentro un BARRIDO
                  lo convierte en la cocina vacía. ⛔ ni un fundido en toda la trayectoria. ── */}
          {g >= 84 && g < A3 && (
            <Plane z={-40}>
              <Marco g={g}
                srcA="img/cmepanel30/cmep30_s4_pinza_macro_display.png"
                srcB="img/cmepanel30/cmep30_s3_refrigerador_abierto.png"
                wipe={mk.wipe}
                x={mk.x} y={mk.y} w={mk.w} h={mk.h} radius={mk.radius} ry={mk.ry}
                lit={1} litColor={mk.wipe > 0.5 ? V.amber : V.volt} label={mk.label} />
            </Plane>
          )}

          {/* ═══ ACTO 3 · el enchufe entrando (llega por el CORTE EN EL BEAT del 594) ═══════ */}
          {g >= A3 && g < 664 && (
            <Plane z={-40}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_enchufa_panel_on.mp4" kind="video"
                w={2400} h={1440} x={50} y={50} z={0} startFrom={6}
                lit={1} litColor={V.volt} radius={0} sheenAt={toCF(600)} />
            </Plane>
          )}

          {/* ⭐ EL DISPLAY BAJANDO. Entra como tarjeta y crece hasta la pantalla entera justo
              mientras el número se desploma: los dígitos que ves cambiar son los REALES. */}
          {g >= 616 && g < 740 && (
            <Plane z={-40}>
              <AbsoluteFill style={{ ...w3, transformStyle: "preserve-3d" }}>
                <MediaCard src="broll/cmepanel30/cmep30_s4c_display_baja.mp4" kind="video"
                  w={interpolate(g, [616, 656], [660, 2400], CL)}
                  h={interpolate(g, [616, 656], [396, 1440], CL)}
                  x={50} y={interpolate(g, [616, 656], [46, 50], CL)} z={0} startFrom={4}
                  lit={1} litColor={V.volt}
                  radius={interpolate(g, [616, 656], [12, 0], CL)} sheenAt={toCF(624)} />
              </AbsoluteFill>
            </Plane>
          )}

          {/* salimos del zoom-through YA DENTRO de la casa: el congelador del garaje */}
          {g >= 690 && g < 802 && (
            <Plane z={-60}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_congelador_vibra.mp4" kind="video"
                w={2400} h={1440} x={50} y={50} z={0} startFrom={4}
                lit={0.96} litColor={V.amber} radius={0} sheenAt={toCF(742)} />
            </Plane>
          )}

          {/* el refrigerador, que sigue enfriando igual */}
          {g >= 786 && g < 886 && (
            <Plane z={-50}>
              <MediaCard src="img/cmepanel30/cmep30_s3_refrigerador_abierto.png" kind="photo"
                w={interpolate(g, [786, 822], [760, 2400], CL)}
                h={interpolate(g, [786, 822], [456, 1440], CL)}
                x={50} y={50} z={0} lit={0.96} litColor={V.amber}
                radius={interpolate(g, [786, 822], [12, 0], CL)} sheenAt={toCF(796)} />
            </Plane>
          )}

          {/* de la compañía ya casi no entra nada: la sombra del cable moviéndose sola */}
          {g >= 866 && g < 992 && (
            <Plane z={-50}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_cable_medidor_sombra.mp4" kind="video"
                w={interpolate(g, [866, 902], [740, 2400], CL)}
                h={interpolate(g, [866, 902], [444, 1440], CL)}
                x={50} y={50} z={0} startFrom={4} lit={0.94} litColor={V.sky}
                radius={interpolate(g, [866, 902], [12, 0], CL)} sheenAt={toCF(876)} />
            </Plane>
          )}

          {/* ═══ ACTO 4 · LAS SEIS VECES ════════════════════════════════════════════════════ */}
          {g >= A4 && g < 1062 && (
            <Plane z={-40}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_ernesto_sostiene_quieto.mp4" kind="video"
                w={2400} h={1440} x={50} y={50} z={0} startFrom={4}
                lit={1} litColor={V.bone} radius={0} sheenAt={toCF(996)} />
            </Plane>
          )}
          {g >= 1047 && g < 1146 && (
            <Plane z={-50}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_ernesto_mira_pinza_panel.mp4" kind="video"
                w={2400} h={1440} x={50} y={50} z={0} startFrom={2}
                lit={1} litColor={V.volt} radius={0} sheenAt={toCF(1060)} />
            </Plane>
          )}
          {/* CICLO 1 · OFF — el enchufe que sale, a pantalla completa */}
          {g >= 1140 && g < 1212 && (
            <Plane z={-40}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_desenchufa_off.mp4" kind="video"
                w={2400} h={1440} x={50} y={50} z={0} startFrom={4}
                lit={1} litColor={V.sky} radius={0} sheenAt={toCF(1148)} />
            </Plane>
          )}
          {/* CICLO 1 · el display SUBIENDO: crece desde tarjeta mientras el número trepa */}
          {g >= 1196 && g < 1258 && (
            <Plane z={-50}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_display_sube.mp4" kind="video"
                w={interpolate(g, [1196, 1228], [820, 2400], CL)}
                h={interpolate(g, [1196, 1228], [492, 1440], CL)}
                x={50} y={50} z={0} startFrom={4} lit={1} litColor={V.sky}
                radius={interpolate(g, [1196, 1228], [12, 0], CL)} sheenAt={toCF(1204)} />
            </Plane>
          )}
          {/* CICLO 2 · ON — el enchufe entrando otra vez */}
          {g >= 1248 && g < 1312 && (
            <Plane z={-40}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_enchufa_panel_on.mp4" kind="video"
                w={2400} h={1440} x={50} y={50} z={0} startFrom={8}
                lit={1} litColor={V.volt} radius={0} sheenAt={toCF(1254)} />
            </Plane>
          )}
          {/* CICLOS 3 a 6 · el clip que fue hecho para esto: el enchufe entrando y saliendo una y
              otra vez. Corre CONTINUO debajo de los cuatro golpes: lo que salta es el ENCUADRE,
              no el material — por eso el ritmo se siente en el cuerpo y no se ve como cortes. */}
          {g >= 1296 && g < 1374 && (
            <Plane z={-40}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_ciclo_enchufe.mp4" kind="video"
                w={2400} h={1440} x={50} y={50} z={0} startFrom={2}
                lit={1} litColor={enchufado ? V.volt : V.sky} radius={0} sheenAt={toCF(1304)} />
            </Plane>
          )}

          {/* ═══ ACTO 5 · el patio, los dos, y el panel al sol ══════════════════════════════ */}
          {g >= A5 && g < 1500 && (
            <Plane z={-40}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_dos_rien_patio.mp4" kind="video"
                w={2400} h={1440} x={50} y={50} z={0} startFrom={4}
                lit={1} litColor={V.amber} radius={0} sheenAt={toCF(1372)} />
            </Plane>
          )}
          {g >= 1462 && g < 1560 && (
            <Plane z={-30}>
              <MediaCard src="img/cmepanel30/cmep30_s4_dos_parados_patio.png" kind="photo"
                w={interpolate(g, [1462, 1496], [900, 2400], CL)}
                h={interpolate(g, [1462, 1496], [540, 1440], CL)}
                x={50} y={50} z={0} lit={0.98} litColor={V.amber}
                radius={interpolate(g, [1462, 1496], [12, 0], CL)} sheenAt={toCF(1472)} />
            </Plane>
          )}
          {/* EL ATERRIZAJE: el panel al sol, con el aire caliente ondulando. Es la materia que le
              entrego al movimiento siguiente. Aparece DETRÁS del polvo de la costura @1540. */}
          {g >= 1540 && (
            <Plane z={-40}>
              <MediaCard src="broll/cmepanel30/cmep30_s4c_panel_sol_calor.mp4" kind="video"
                w={2400} h={1440} x={50} y={50} z={0} startFrom={2}
                lit={1} litColor={V.volt} radius={0} sheenAt={toCF(1568)} />
            </Plane>
          )}
        </Layers>
      </AbsoluteFill>

      {/* los cantos de la apertura: el brillo sale SIEMPRE hacia el mundo, jamás hacia la cara */}
      {abierto && (
        <>
          <CantoV x={cov.gL} dir={-1} hot={cantoHot} />
          <CantoV x={cov.gR} dir={1} hot={cantoHot} />
          {Math.min(cov.shL, cov.shR) > 0.5 && Math.min(cov.shL, cov.shR) < 99 && (
            <CantoH x0={cov.gL} x1={cov.gR} y0={cov.shL} y1={cov.shR} hot={cantoHot} />
          )}
          {cov.sb > 0.6 && cov.sb < 99 && (
            <CantoH x0={cov.gL} x1={cov.gR} y0={100 - cov.sb} y1={100 - cov.sb} hot={cantoHot} up={false} />
          )}
        </>
      )}

      {/* ════ EL PRIMER PLANO — no está recortado. Mientras la apertura esté ABIERTA todo esto
          vive en x<27 % o x>73 %: nunca en la caja de la cara (30-70 % · 10-90 %) medida SOBRE la
          escala que ya le aplicó la cámara. Nada sobre boca ni mentón. ════ */}
      <Layers cam={cam}>

        {/* ═══ ACTO 1 · LA PINZA EN EL CABLE ═══════════════════════════════════════════════ */}
        {a1 && (
          <>
            {/* la materia entrante todavía nombrada: el plano que venía del movimiento anterior */}
            <Plane z={120}>
              <Rotulo x={50} y={90} color={rgba(V.volt, 0.96)} size={34}
                op={clamp01((g - 8) / 12) * clamp01(1 - (g - 76) / 14)}>
                EL CABLE QUE ENTRA DESDE EL MEDIDOR
              </Rotulo>
            </Plane>

            {/* LAS 12 Y MEDIA — tercio izquierdo, ventana abierta */}
            <Plane z={100}>
              {g >= 150 && g < 290 && (
                <>
                  <IconPng src="img/cmepanel30/cmep30_ic_reloj.png" x={23} y={20}
                    size={lerp(0, 104, es(clamp01((g - 150) / 18)))} z={0}
                    opacity={0.96 * clamp01(1 - (g - 272) / 16)} glow={V.ink0} />
                  <Readout value="12:30" at={toCF(158)} x={23} y={34} size={124} color={V.bone} />
                  <Rotulo x={23} y={46} color={rgba(V.bone, 0.92)} size={32}
                    op={clamp01((g - 168) / 12) * clamp01(1 - (g - 272) / 16)}>
                    A MEDIODÍA
                  </Rotulo>
                </>
              )}
            </Plane>

            {/* LOS TRES QUE ESTABAN ANDANDO — tercio derecho, uno por microacción, cada uno con
                su consumo EN LA TARJETA (nunca un número suelto sin material que lo sostenga) */}
            <Plane z={150}>
              {g >= 186 && g < 300 && (
                <MediaCard src="img/cmepanel30/cmep30_s3_refrigerador_abierto.png" kind="photo"
                  w={330} h={198}
                  x={lerp(120, 77, es(clamp01((g - 186) / 26)))} y={24}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.amber}
                  label="REFRIGERADOR · 120 W" sheenAt={toCF(206)} radius={10} />
              )}
              {g >= 214 && g < 300 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_modem_luces.png" kind="photo"
                  w={330} h={198}
                  x={lerp(120, 77, es(clamp01((g - 214) / 26)))} y={50}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.amber}
                  label="EL MÓDEM · 15 W" sheenAt={toCF(234)} radius={10} />
              )}
              {g >= 244 && g < 300 && (
                <MediaCard src="broll/cmepanel30/cmep30_s4c_congelador_vibra.mp4" kind="video"
                  w={330} h={198}
                  x={lerp(120, 77, es(clamp01((g - 244) / 26)))} y={76}
                  z={0} ry={-12} rx={2} startFrom={6} lit={1} litColor={V.amber}
                  label="EL CONGELADOR · 90 W" sheenAt={toCF(266)} radius={10} />
              )}
            </Plane>

            {/* EL TITULAR DEL ACTO, con la apertura YA cerrada: el centro está liberado */}
            <Plane z={210}>
              {g >= 362 && g < 440 && (
                <div style={{
                  position: "absolute", left: "50%",
                  top: `${lerp(78, 74, es(clamp01((g - 362) / 22))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)",
                  opacity: clamp01((g - 362) / 10) * clamp01(1 - (g - 426) / 12),
                }}>
                  <Bed pad={22}>
                    <Head size={58} color={V.white}>MARCABA <Em>310 VATIOS</Em></Head>
                  </Bed>
                </div>
              )}
              {g >= 380 && g < 400 && (
                <IconPng src="img/cmepanel30/cmep30_ic_pinza.png" x={50} y={22}
                  size={lerp(0, 96, es(clamp01((g - 380) / 14)))} z={0} opacity={0.95} glow={V.ink0} />
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 2 · 310 = MI CASA VACÍA ════════════════════════════════════════════════ */}
        {a2 && (
          <>
            <Plane z={110}>
              {g >= 458 && g < 552 && (
                <IconPng src="img/cmepanel30/cmep30_ic_casa.png" x={23} y={16}
                  size={lerp(0, 108, es(clamp01((g - 458) / 18)))} z={0}
                  opacity={0.96 * clamp01(1 - (g - 536) / 14)} glow={V.ink0} />
              )}
              {g >= 462 && g < 540 && (
                <Rotulo x={23} y={42} color={rgba(V.bone, 0.95)} size={33}
                  op={clamp01((g - 466) / 12) * clamp01(1 - (g - 520) / 14)}>
                  MI CASA VACÍA
                </Rotulo>
              )}
              {g >= 526 && g < 566 && (
                <Rotulo x={23} y={42} color={rgba(V.amber, 0.96)} size={33}
                  op={clamp01((g - 526) / 10) * clamp01(1 - (g - 552) / 12)}>
                  SIN HACER NADA
                </Rotulo>
              )}
            </Plane>

            {/* los dos que siguen andando en la casa vacía, entrando desde ABAJO y en CÁLIDO
                (ley de dirección del Stage: esto es lo que TU CASA se come) */}
            <Plane z={140}>
              {g >= 470 && g < 548 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_modem_luces.png" kind="photo"
                  w={320} h={192}
                  x={77} y={lerp(118, 30, es(clamp01((g - 470) / 28)))}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.amber}
                  label="15 W · SIEMPRE" sheenAt={toCF(492)} radius={10} />
              )}
              {g >= 492 && g < 548 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_congelador_garaje.png" kind="photo"
                  w={320} h={192}
                  x={77} y={lerp(118, 66, es(clamp01((g - 492) / 28)))}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.amber}
                  label="90 W · SIEMPRE" sheenAt={toCF(514)} radius={10} />
              )}
            </Plane>

            {/* el rótulo del consumo de fondo, con la ventana ya cerrada */}
            <Plane z={210}>
              {g >= 572 && (
                <Rotulo x={50} y={70} color={rgba(V.sky, 0.96)} size={36}
                  op={clamp01((g - 572) / 12)}>
                  CONSUMO DE FONDO
                </Rotulo>
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 3 · ⭐ 310 → 40 ════════════════════════════════════════════════════════ */}
        {a3 && (
          <>
            {/* ── 3a · el enchufe y LA CAÍDA. Todo este grupo entra en el zoom-through junto con
                    la pantalla: la cámara se mete POR el display, no por al lado. ────────── */}
            {g < 740 && (
              <AbsoluteFill style={{ ...w3, transformStyle: "preserve-3d" }}>
                <Plane z={130}>
                  {g >= 596 && g < 646 && (
                    <Rotulo x={50} y={86} color={rgba(V.volt, 0.96)} size={36}
                      op={clamp01((g - 596) / 10) * clamp01(1 - (g - 632) / 12)}>
                      ENCHUFÉ EL PANEL
                    </Rotulo>
                  )}
                  {g >= 600 && g < 640 && (
                    <IconPng src="img/cmepanel30/cmep30_ic_enchufe.png" x={22} y={24}
                      size={lerp(0, 110, es(clamp01((g - 600) / 16)))} z={0}
                      opacity={0.96 * clamp01(1 - (g - 626) / 12)} glow={V.ink0} />
                  )}

                  {/* ⭐ LA COLUMNA. El cable de entrada de pie, con la carga corriendo adentro:
                      cuando el número cae, las cuentas de abajo se lavan por el borde inferior.
                      LOS 270 VATIOS SE VAN, no se apagan. */}
                  {g >= 626 && (
                    <Columna g={g} x={20} y={52} w={300}
                      h={lerp(0, 620, es(clamp01((g - 626) / 22)))}
                      carga={cia} label="EL CABLE DE ENTRADA"
                      op={clamp01((g - 626) / 10)} />
                  )}

                  {/* lo que DEJÓ DE ENTRAR baja desde ARRIBA y en FRÍO: es lo que te cobran */}
                  {g >= 664 && g < 712 && (
                    <>
                      <Cifra v={-270} x={79}
                        y={lerp(6, 30, es(clamp01((g - 664) / 22)))}
                        size={132} color={V.sky} unit="W"
                        op={clamp01((g - 664) / 8) * clamp01(1 - (g - 700) / 10)} hot={0.8} />
                      <Rotulo x={79} y={42} color={rgba(V.sky, 0.94)} size={32}
                        op={clamp01((g - 678) / 10) * clamp01(1 - (g - 700) / 10)}>
                        DEJÓ DE ENTRAR
                      </Rotulo>
                    </>
                  )}

                  {g >= 688 && g < 712 && (
                    <IconPng src="img/cmepanel30/cmep30_ic_pinza.png" x={50} y={18}
                      size={lerp(0, 104, es(clamp01((g - 688) / 14)))} z={0}
                      opacity={0.95 * clamp01(1 - (g - 702) / 8)} glow={V.ink0} />
                  )}
                  {g >= 686 && g < 712 && (
                    <Rotulo x={50} y={84} color={rgba(V.volt, 0.98)} size={38}
                      op={clamp01((g - 686) / 8) * clamp01(1 - (g - 702) / 8)}>
                      CUARENTA VATIOS
                    </Rotulo>
                  )}
                </Plane>
              </AbsoluteFill>
            )}

            {/* ── 3b · ya DENTRO de la casa. Acá se lee la LEY DE DIRECCIÓN entera de un vistazo:
                    lo que la compañía te manda cae desde ARRIBA y en FRÍO; lo que tu casa se come
                    sube desde ABAJO y en CÁLIDO. Los dos números conviven, y ése es el punto. */}
            {g >= 730 && (
              <Plane z={150}>
                <Cifra v={40} x={77}
                  y={lerp(4, 22, es(clamp01((g - 736) / 22)))}
                  size={148} color={V.sky} unit="W"
                  op={clamp01((g - 736) / 10)} hot={0.7} />
                <Rotulo x={77} y={34} color={rgba(V.sky, 0.94)} size={32}
                  op={clamp01((g - 748) / 10)}>
                  DE LA COMPAÑÍA
                </Rotulo>
                <Readout value="310" unit="W" at={toCF(762)} x={23}
                  y={lerp(96, 74, es(clamp01((g - 762) / 22)))} size={166} color={V.amber} />
                <Rotulo x={23} y={86} color={rgba(V.amber, 0.95)} size={32}
                  op={clamp01((g - 776) / 10)}>
                  LA CASA, IGUAL
                </Rotulo>
              </Plane>
            )}

            <Plane z={190}>
              {g >= 742 && g < 800 && (
                <Rotulo x={50} y={54} color={rgba(V.white, 0.96)} size={38}
                  op={clamp01((g - 742) / 10) * clamp01(1 - (g - 786) / 12)}>
                  TODO SEGUÍA ANDANDO
                </Rotulo>
              )}
              {g >= 800 && g < 862 && (
                <Rotulo x={50} y={54} color={rgba(V.white, 0.96)} size={38}
                  op={clamp01((g - 800) / 10) * clamp01(1 - (g - 846) / 12)}>
                  ENFRIANDO IGUAL
                </Rotulo>
              )}
              {/* "ya casi no entraba nada": la columna vuelve, ahora en gota a gota */}
              {g >= 878 && (
                <Columna g={g} x={79} y={50} w={252}
                  h={lerp(0, 640, es(clamp01((g - 878) / 24)))}
                  carga={cia} label="LO QUE ENTRA" op={clamp01((g - 878) / 10)} />
              )}
              {g >= 892 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_medidor_disco.png" kind="photo"
                  w={340} h={204}
                  x={lerp(-16, 21, es(clamp01((g - 892) / 30)))} y={34}
                  z={0} ry={11} rx={-2} lit={0.96} litColor={V.sky}
                  label="EL MEDIDOR" sheenAt={toCF(918)} radius={10} />
              )}
              {g >= 906 && (
                <div style={{
                  position: "absolute", left: "21%",
                  top: `${lerp(72, 68, es(clamp01((g - 906) / 20))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)", opacity: clamp01((g - 906) / 10),
                }}>
                  <Bed pad={20}>
                    <Head size={52} color={V.white}>YA CASI<br /><Em>NO ENTRABA</Em></Head>
                  </Bed>
                </div>
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 4 · ⭐ LAS SEIS VECES ══════════════════════════════════════════════════ */}
        {a4 && (
          <>
            <Plane z={130}>
              {g >= 984 && g < 1006 && (
                <Rotulo x={50} y={88} color={rgba(V.bone, 0.96)} size={36}
                  op={clamp01((g - 984) / 10) * clamp01(1 - (g - 996) / 10)}>
                  SE QUEDÓ MIRANDO LA PINZA
                </Rotulo>
              )}
              {/* tercio izquierdo: la cara de Ernesto y la orden */}
              {g >= 1014 && g < 1136 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_cara_ernesto_asombro.png" kind="photo"
                  w={330} h={198}
                  x={lerp(-16, 22, es(clamp01((g - 1014) / 28)))} y={30}
                  z={0} ry={11} rx={-2} lit={1} litColor={V.bone}
                  label="ERNESTO" sheenAt={toCF(1038)} radius={10} />
              )}
              {g >= 1050 && g < 1136 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_panel_sol_mediodia.png" kind="photo"
                  w={330} h={198}
                  x={lerp(120, 78, es(clamp01((g - 1050) / 28)))} y={30}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.volt}
                  label="DESPUÉS, EL PANEL" sheenAt={toCF(1074)} radius={10} />
              )}
              {/* la columna sigue viva en el tercio derecho: es la que va a contestar seis veces */}
              {g >= 1030 && g < 1140 && (
                <Columna g={g} x={79} y={72} w={168} h={306} carga={cia}
                  op={clamp01((g - 1030) / 12)} lit={0.9} />
              )}
              {/* APÁGALO */}
              {g >= 1090 && g < 1140 && (
                <div style={{
                  position: "absolute", left: "22%",
                  top: `${lerp(76, 72, es(clamp01((g - 1090) / 18))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)",
                  opacity: clamp01((g - 1090) / 8),
                }}>
                  <Bed pad={22}>
                    <Head size={64} color={V.white}><Em color={V.amber}>APÁGALO</Em></Head>
                  </Bed>
                </div>
              )}
            </Plane>

            {/* ── EL RITMO DE LAS SEIS. Con la ventana cerrada de un corte seco en 1140, el centro
                    queda libre y la cifra pasa a mandar. Lo que cambia en cada vuelta NO es el
                    material (el enchufe sigue entrando y saliendo abajo): es EL ENCUADRE, que
                    salta de golpe a una escala distinta, y el intervalo, que se acorta. ──── */}
            <Plane z={200}>
              {g >= 1142 && g < 1188 && (
                <Rotulo x={50} y={86} color={rgba(V.sky, 0.97)} size={38}
                  op={clamp01((g - 1142) / 8) * clamp01(1 - (g - 1176) / 10)}>
                  LO APAGUÉ
                </Rotulo>
              )}
              {g >= 1180 && g < 1240 && (
                <Rotulo x={50} y={86} color={rgba(V.sky, 0.97)} size={38}
                  op={clamp01((g - 1180) / 8) * clamp01(1 - (g - 1226) / 12)}>
                  VOLVIÓ A 310
                </Rotulo>
              )}
              {g >= 1250 && g < 1300 && (
                <Rotulo x={50} y={22} color={rgba(V.volt, 0.97)} size={38}
                  op={clamp01((g - 1250) / 8) * clamp01(1 - (g - 1288) / 10)}>
                  LO PRENDÍ
                </Rotulo>
              )}
              {g >= 1306 && (
                <Rotulo x={50} y={78} color={rgba(V.white, 0.97)} size={40}
                  op={clamp01((g - 1306) / 8)}>
                  LO HICIMOS SEIS VECES
                </Rotulo>
              )}
              {/* la cuenta: seis rayos que se encienden de a uno, y el último pega un salto */}
              {g >= 1140 && <Tally n={seis} g={g} x={50} y={90} size={58} op={clamp01((g - 1140) / 10)} />}
              {/* la columna contesta a cada interruptor: se llena y se vacía seis veces */}
              {g >= 1146 && g < 1352 && (
                <Columna g={g} x={15} y={50} w={172} h={430} carga={cia}
                  op={clamp01((g - 1146) / 12) * clamp01(1 - (g - 1344) / 10)} lit={0.92} />
              )}
              {/* ⭐ FRONTERA D · la tarjeta que cruza el corte a velocidad constante */}
              {g >= 1332 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_pinza_macro_display.png" kind="photo"
                  w={300} h={180} x={mmDisplay} y={20}
                  z={0} ry={-8} rx={2} lit={1} litColor={V.volt}
                  label="LA PINZA" sheenAt={toCF(1340)} radius={10} />
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 5 · VERLO EN EL NÚMERO ═════════════════════════════════════════════════ */}
        {a5 && (
          <>
            {/* la tarjeta del match-move SIGUE viajando: misma velocidad, misma y, misma escala */}
            <Plane z={200}>
              {g < 1434 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_pinza_macro_display.png" kind="photo"
                  w={300} h={180} x={mmDisplay} y={20}
                  z={0} ry={-8} rx={2} lit={1} litColor={V.volt}
                  label="LA PINZA" sheenAt={toCF(1340)} radius={10} />
              )}
              {g >= 1366 && g < 1418 && (
                <Rotulo x={50} y={88} color={rgba(V.amber, 0.97)} size={38}
                  op={clamp01((g - 1366) / 10) * clamp01(1 - (g - 1404) / 12)}>
                  COMO DOS NENES CON UN INTERRUPTOR
                </Rotulo>
              )}
            </Plane>

            {/* ventana abierta: los dos, uno en cada tercio */}
            <Plane z={150}>
              {g >= 1426 && g < 1530 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_cara_claudio_sonrisa.png" kind="photo"
                  w={330} h={198}
                  x={lerp(-16, 22, es(clamp01((g - 1426) / 28)))}
                  y={30 + lerp(0, 60, es(clamp01((g - 1512) / 20)))}
                  z={0} ry={11} rx={-2} lit={1} litColor={V.amber}
                  label="LOS DOS" sheenAt={toCF(1450)} radius={10} />
              )}
              {g >= 1440 && g < 1496 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_cara_ernesto_asombro.png" kind="photo"
                  w={330} h={198}
                  x={lerp(120, 78, es(clamp01((g - 1440) / 26)))} y={30}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.bone}
                  label="ERNESTO" sheenAt={toCF(1462)} radius={10} />
              )}
              {g >= 1486 && g < 1552 && (
                <MediaCard src="broll/cmepanel30/cmep30_s4c_panel_sol_calor.mp4" kind="video"
                  w={330} h={198}
                  x={78} y={lerp(114, 30, es(clamp01((g - 1486) / 26)))}
                  z={0} ry={-12} rx={2} startFrom={4} lit={1} litColor={V.volt}
                  label="EL PANEL" sheenAt={toCF(1508)} radius={10} />
              )}
              {g >= 1492 && g < 1546 && (
                <IconPng src="img/cmepanel30/cmep30_ic_panelsolar.png" x={78} y={58}
                  size={lerp(0, 104, es(clamp01((g - 1492) / 16)))} z={0}
                  opacity={0.96 * clamp01(1 - (g - 1532) / 12)} glow={V.ink0} />
              )}
              {g >= 1489 && g < 1548 && (
                <div style={{
                  position: "absolute", left: "22%",
                  top: `${lerp(74, 70, es(clamp01((g - 1489) / 20))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)",
                  opacity: clamp01((g - 1489) / 10) * clamp01(1 - (g - 1534) / 12),
                }}>
                  <Bed pad={20}>
                    <Head size={54} color={V.white}>UN PANEL<br /><Em>ENCHUFABLE</Em></Head>
                  </Bed>
                </div>
              )}
            </Plane>

            {/* EL CIERRE. Los dos números por última vez, cada uno entrando por donde le toca:
                el de la compañía desde ARRIBA y en frío, el que queda desde ABAJO y en volt. */}
            <Plane z={210}>
              {g >= 1562 && g < 1652 && (
                <>
                  <Cifra v={310} x={24}
                    y={lerp(2, 26, es(clamp01((g - 1562) / 24)))}
                    size={140} color={V.sky} unit="W"
                    op={clamp01((g - 1562) / 10) * clamp01(1 - (g - 1638) / 14)} hot={0.7} />
                  <Rotulo x={24} y={38} color={rgba(V.sky, 0.94)} size={32}
                    op={clamp01((g - 1578) / 10) * clamp01(1 - (g - 1638) / 14)}>
                    SIN EL PANEL
                  </Rotulo>
                </>
              )}
              {g >= 1574 && g < 1660 && (
                <>
                  <Cifra v={40} x={76}
                    y={lerp(98, 70, es(clamp01((g - 1574) / 24)))}
                    size={178} color={V.volt} unit="W"
                    op={clamp01((g - 1574) / 10) * clamp01(1 - (g - 1646) / 14)} hot={1} />
                  <Rotulo x={76} y={82} color={rgba(V.volt, 0.96)} size={32}
                    op={clamp01((g - 1590) / 10) * clamp01(1 - (g - 1646) / 14)}>
                    CON EL PANEL
                  </Rotulo>
                </>
              )}
              {g >= 1598 && g < 1666 && (
                <div style={{
                  position: "absolute", left: "50%",
                  top: `${lerp(54, 50, es(clamp01((g - 1598) / 22))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)",
                  opacity: clamp01((g - 1598) / 12) * clamp01(1 - (g - 1652) / 14),
                }}>
                  <Bed pad={24}>
                    <Head size={60} color={V.white}>VERLO EN EL NÚMERO<br /><Em>TE CAMBIA LA CABEZA</Em></Head>
                  </Bed>
                </div>
              )}
            </Plane>
          </>
        )}

      </Layers>

      {/* ⭐ LA CIFRA DE LA PINZA — vive FUERA de los actos porque es la única cosa que no se
          interrumpe nunca: es la espina. Con la ventana abierta se va a un tercio; con la ventana
          cerrada manda el centro; en los seis golpes SALTA de encuadre en un frame. */}
      <Layers cam={cam}>
        <Plane z={240}>
          {g >= 392 && g < 1352 && (() => {
            const K = [392, 452, 476, 556, 578, 594, 636, 652, 664, 704];
            const pre = {
              x: interpolate(g, K, [50, 50, 23, 23, 50, 50, 50, 50, 50, 50], CL),
              y: interpolate(g, K, [44, 44, 30, 30, 46, 46, 46, 46, 46, 46], CL),
              s: interpolate(g, K, [232, 232, 146, 146, 300, 300, 296, 268, 396, 396], CL),
            };
            // los seis encuadres del acto 4: cada uno salta en UN frame, ninguno se repite
            const snap =
              g >= 1346 ? { x: 50, y: 46, s: 430 }
                : g >= 1335 ? { x: 74, y: 78, s: 132 }
                  : g >= 1321 ? { x: 50, y: 50, s: 252 }
                    : g >= 1304 ? { x: 82, y: 20, s: 124 }
                      : g >= 1248 ? { x: 50, y: 74, s: 212 }
                        : { x: 50, y: 46, s: 300 };
            const L = g >= 1140 ? snap : pre;
            // del 742 al 1140 la espina no se dibuja acá: en el tramo de la casa mandan los DOS
            // números de la ley de dirección (40 frío desde arriba · 310 cálido desde abajo).
            if (g >= 740 && g < 1140) return null;
            const zoomed = g >= 706 && g < 740;   // se va POR el zoom-through, no se apaga
            return (
              <AbsoluteFill style={zoomed ? { ...w3, transformStyle: "preserve-3d" } : undefined}>
                <Cifra v={vat} x={L.x} y={L.y} size={L.s}
                  color={light(clamp01(1 - cia), "sky", "volt")}
                  unit="W" op={clamp01((g - 392) / 8) * clamp01(1 - (g - 1344) / 8)}
                  hot={0.7 + 0.5 * (1 - cia)} />
              </AbsoluteFill>
            );
          })()}
        </Plane>
      </Layers>

      {/* ════ LAS COSTURAS, siempre por encima de todo ════ */}
      {/* FRONTERA C @979 · OCLUSIÓN — LA PINZA cruza y tapa el 100 % entre 977 y 984. El color es
          el AMARILLO DE LA PINZA (la materia que cruza), ⛔ nunca el del fondo. */}
      <PinzaOcluye g={g} at={968} dur={26} />
      {/* COSTURA INTERNA @1540 · WIPE POR MATERIA — el polvo seco del patio cruza y detrás ya está
          el panel al sol. Ninguna frontera repite la costura de su vecina. */}
      <SeamWipeMatter at={toCF(1536)} dur={30} tint={V.concrete} />
    </AbsoluteFill>
  );
};
