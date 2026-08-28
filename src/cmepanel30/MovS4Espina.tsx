// MovS4Espina.tsx — MOVIMIENTO S4 · "LA ESPINA: 740 ENTRANDO, 310 SALIENDO, 430 QUE NO CABEN"
// Video `cmepanel30` (Claudio Mendoza Constructor, ES). 5 actos · 0 → 1817 frames @30 = 60,57 s.
// Tramo global 12113 → 13930. Se monta ENCIMA del avatar real de Claudio.
// ⛔ CERO capas de color con opacidad sobre su cara: las ventanas son GEOMETRÍA (`clip-path`).
//
// ⭐ ESTE MOVIMIENTO CONTIENE LA TESIS DEL VIDEO:
//    "Un panel enchufable no te descuenta lo que produce. Te descuenta solamente lo que tu casa
//     está consumiendo en ese mismo segundo."
//
// ── CÓMO ESTÁ CONSTRUIDO ──────────────────────────────────────────────────────────────────────
// 1. EL MUNDO (atmósfera + soles + fondos a sangre) vive DENTRO de un único contenedor recortado
//    por LA APERTURA (`coverAt` → `clipOf`). Acá la apertura es un TRAPECIO: el borde superior
//    puede estar INCLINADO (shL ≠ shR), cosa que ningún movimiento hermano usa. Las cuatro
//    ventanas usan cuatro gestos distintos y ninguno repite los de MovS1/MovS2/MovS3:
//      W1 (136-274)    VISERA — el borde superior se levanta INCLINADO desde la derecha, se
//                      nivela, y CIERRA volviendo a inclinarse al revés y cayendo (izquierda
//                      primero). Se abre y se cierra con el mismo borde, con el slant invertido.
//                      Los primeros 136 frames van con el CUADRO CERRADO: el acto pide bajar el
//                      ruido antes de que él aparezca.
//      W2 (470-610)    TRONERA — los dos costados se abren de golpe a un hueco angosto de techo
//                      bajo y plano, y CIERRA con la banda IZQUIERDA barriendo hasta chocar con la
//                      derecha: una puerta que se corre, no dos hojas que se juntan.
//      W3 (852-930)    GOLPE — se abre de un SNAP de 5 frames sobre "no hay batería", se va
//                      ANGOSTANDO mientras habla, y cierra con el techo BAJANDO (persiana).
//      W4 (1296-1592)  LA ESPINA — se abre LENTO (44 f) como una rendija alta que se ensancha, y
//                      NO CIERRA: queda abierta 220 frames (el tiempo de leer la tesis dos veces)
//                      y muere adentro de la oclusión de papel. Contención pura.
// 2. EL PRIMER PLANO no está recortado. Con la apertura ABIERTA todo vive fuera del hueco y nunca
//    entra en la caja de la cara (30-70 % · 10-90 %): jamás nada sobre boca ni mentón.
// 3. UNA sola cámara `camAt(g)`, función pura de g. Ningún acto la reinicia. UNA sola atmósfera.
// 4. LA MATERIA QUE CRUZA CADA FRONTERA es siempre un objeto, nunca un efecto: el rectángulo
//    iluminado (display → panel), el bloque de los 430 (que se va por un riel y le entrega el riel
//    al cable), la ropa tendida del vecino, la hoja de papel.
//
// ⭐⭐ CÓMO SE LEEN LOS 430 COMO CANTIDAD FÍSICA Y NO COMO UNA RESTA ESCRITA (acto 2):
//    No hay ningún "740 − 310 = 430" en pantalla. Hay UNA COLUMNA de 74 rebanadas de 10 W cada una
//    (la unidad se declara una sola vez y después no se vuelve a nombrar). La casa es una CAJA
//    REAL — con la foto del congelador adentro — que ocupa exactamente las 31 rebanadas de abajo,
//    y su tapa es un REBORDE DE HORMIGÓN a la altura de los 310. Las 43 rebanadas que sobran
//    quedan APOYADAS SOBRE ESE REBORDE, en el aire, sin nada que las sostenga: se ve que el
//    recipiente terminó y que la cantidad sigue. Se inclinan, la pila se bambolea, y en el frame
//    700 SE VA ENTERA por el riel. Los 310 bajan en CÁLIDO (`flujo("queda")`) porque la casa se
//    los come; los 430 son FRÍOS (`flujo("cobran")`) porque se van a la compañía. La resta nunca
//    se escribe: se DERRAMA.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⇐ ENTRA DESDE `MovS4Pinza` (el 310 → 40 en la pinza):
//   cam {encuadre ABRIÉNDOSE del cable hacia el patio, cámara SUBIENDO (grúa −140 → −88), push 1.10}
//   luz {HORA.cenital 90°, hueso, amb 1.00 → HORA.mediodia 88°, blanco, amb 0.95 (rampa 12 f)}
//   materia {EL PANEL AL SOL VISTO DESDE ABAJO — `cmep30_s4c_panel_sol_calor.mp4`}
//
// ACTO 1 · 0-262 · "ACÁ ESTÁ ESCONDIDO TODO"   protagonista: EL PANEL AL SOL   texto: ACÁ ESTÁ ESCONDIDO TODO EL VIDEO
//   entra  cam {grúa −140, push 1.10, foco 44/62}          luz {cenital 90°, hueso, amb 0.86 → 1.00 en 12 f}
//          materia {el panel al sol visto desde abajo, aire caliente subiendo del vidrio}
//   sale   cam {grúa −52, push 1.02, foco 38/50}           luz {mediodía 88°, blanco, amb 0.95}
//          materia {EL DISPLAY DE LA PINZA — un rectángulo iluminado con 310 adentro}
//   ── FRONTERA A @262 ···· MATCH-SHAPE: ese mismo rectángulo iluminado crece de 430×258 a
//      1500×844, su radio baja de 14 a 4 y le nace LA GRILLA DE CELDAS: se convierte en EL PANEL
//      (`PanelForm`, la forma madre del video). La superficie se REPINTA con un borde duro que
//      viaja de izquierda a derecha con el especular montado encima — nunca un fundido: en cada
//      frame hay una línea neta entre las dos materias. El objeto no suelta el cuadro. ·········
// ACTO 2 · 262-717 · ⭐ "740 − 310 = 430"      protagonista: LA COLUMNA        texto: NO ENTRAN EN TU CASA
//   entra  cam {grúa −52 → −14, push 1.02 → 1.08, foco 38/50}  luz {mediodía 88°, blanco, amb 0.95}
//          materia {el panel a sangre, la grilla de celdas todavía viva}
//   sale   cam {grúa +44, push 1.02, foco 24/48}           luz {88° → 86°, amb 0.86, frío desde arriba}
//          materia {EL BLOQUE DE LAS 43 REBANADAS, ya deslizándose sobre el reborde a −1,35 %/f}
//   ── FRONTERA B @717 ···· MATCH-MOVE: el bloque de los 430 sale de cuadro hacia la izquierda a
//      −1,35 % de pantalla por frame, y EL CABLE DE ENTRADA A LA CASA entra desde la derecha con
//      exactamente la misma velocidad, la misma dirección y la misma altura: los dos viajan sobre
//      el mismo riel (`railPct`). Nada frena, nada arranca de cero, no hay corte. ··············
// ACTO 3 · 717-1172 · "NO SE GUARDAN"          protagonista: EL CABLE Y EL DISCO  texto: NO HAY BATERÍA
//   entra  cam {grúa +44 → +26, push 1.02 → 1.06, foco 24/48}   luz {86°, blanco, amb 0.86}
//          materia {el cable, viajando sobre el riel, con la corriente fría corriendo adentro}
//   sale   cam {grúa +2, push 1.10, foco 46/44}            luz {48° → 44°, amb 0.58, frío}
//          materia {LA ROPA TENDIDA DEL VECINO moviéndose en el viento}
//   (costura INTERNA @934 ···· ZOOM-THROUGH: la cámara sube por el cable y entra por la ventanita
//    redonda de vidrio del medidor (fx 58 / fy 26); sale del otro lado ya sobre el disco de
//    aluminio. El disco se monta 18 f ANTES, debajo: un zoom-through contra nada es un fundido.
//    costura INTERNA @1081 ···· CORTE EN EL BEAT: corte seco sobre "a alimentar la casa del
//    vecino", del disco a la casa de al lado. La BISAGRA es la CORRIENTE FRÍA: la misma línea de
//    guiones, en la misma diagonal y a la misma velocidad, a los dos lados del corte durante 20
//    frames — recién después se abre hacia la casa.)
//   ── FRONTERA C @1172 ···· WIPE POR MATERIA: las SÁBANAS BLANCAS de la ropa tendida del vecino
//      cruzan el cuadro flameando y detrás ya está el patio del acto 4. La materia es tela hueso
//      (#E9E3D2) — es lo que está colgado en el plano anterior, no un efecto inventado. ········
// ACTO 4 · 1172-1580 · ⭐ LA ESPINA            protagonista: CLAUDIO A CÁMARA   texto: LA TESIS, 13 palabras
//   entra  cam {grúa +10, push 1.06, foco 50/48}           luz {44° → 88°, blanco, amb 0.74 → 0.92}
//          materia {el patio a mediodía, los dos parados donde pasó todo}
//   sale   cam {grúa +34, push 1.01, foco 50/50, deriva viva}   luz {mediodía 86°, blanco, amb 0.88}
//          materia {LA HOJA DE PAPEL EN BLANCO (la factura sin escribir)}
//   (contención: en los 296 frames de ventana abierta NO hay una sola tarjeta flotante. Sólo él,
//    el patio en las dos bandas, y las dos mitades de la tesis en tipografía grande — la primera
//    baja FRÍA desde arriba porque es la regla que te aplican; la segunda sube CÁLIDA desde abajo
//    porque es tu casa. `flujo()` literal. La frase se sostiene 264 y 171 frames: alcanza para
//    leerla dos veces.)
//   ── FRONTERA D @1580 ···· OCLUSIÓN: LA HOJA DE PAPEL cruza de izquierda a derecha con su
//      doblez, su fibra y su sombra de contacto, y tapa el 100 % entre los frames 1578 y 1586. El
//      acto cambia ADENTRO de esos 8 frames. El color es el del PAPEL (#EFE8D6), jamás el del
//      fondo: con el del fondo esto es un fundido a negro que se ve. ·························
// ACTO 5 · 1580-1817 · "LA FACTURA NO TE FELICITA"  protagonista: LA FACTURA   texto: NI UN VATIO MÁS
//   entra  cam {grúa +22, push 1.10, foco 50/50}           luz {86° → 64°, amb 0.88 → 0.70}
//          materia {la hoja, ya aterrizada sobre la mesa del taller}
//   sale   cam {grúa −42, push 1.22, foco 58/58 — la deriva FRENA pero no se detiene}
//          luz {HORA.penumbra 8°, sky, amb 0.22}
//          materia {LA TAPA DEL MEDIDOR EN LA SOMBRA DE LA PARED}
//   (costura INTERNA @1773 ···· CORTE EN EL BEAT sobre "lo que le pediste a ella", de la factura a
//    la pared del medidor. La BISAGRA es el rótulo LO QUE PEDISTE: misma x, misma y, mismo cuerpo
//    a los dos lados del corte durante 18 frames.)
//
// ⇒ SALE HACIA la sección del consumo de fondo (cómo medirlo en tu medidor):
//   cam {CERRANDO sobre la caja del medidor, deriva frenando sin detenerse}
//   luz {HORA.penumbra 8°, sky, amb 0.22}   materia {la tapa del medidor en la sombra de la pared}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero blur grande full-screen · cero fade en
// ninguna frontera · dos fronteras seguidas nunca repiten costura · cero capa de color con
// opacidad sobre el avatar · TODA tarjeta flotante lleva FOTO o CLIP REAL adentro (`MediaCard`);
// la columna, el reborde y las flechas son GRÁFICA de apoyo, nunca hacen de objeto real.
// ⛔ Rutas LITERALES en el punto de uso: el build escanea este .tsx por TEXTO y una ruta armada
// por template literal no viaja en el tar → 404 → chunk muerto con un error que miente.
// ⚠️ Ningún `kind="video"` se monta más de 145 frames (los clips duran ~151 a 30 fps).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rgba, rnd,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, PanelForm, zoomThrough, SunKey, HORA, flujo,
  Body, Bed,
} from "./PanelStage";

// ── EL RELOJ DEL MOVIMIENTO (frames locales, 30 fps, anclados al ms de Whisper) ───────────────
const A1 = 0;      // 12113 · "Pero fíjate en algo."
const A2 = 262;    // 12375 · "¿Y sabes cuánto estaba dando el panel en ese mismo momento?"
const A3 = 717;    // 12830 · "Y esos 430 vatios no se guardan en ningún lado."
const A4 = 1172;   // 13285 · "Esa es la espina de este video."
const A5 = 1580;   // 13693 · "Ni un vatio más."
const G_END = 1817;

// los frames en que el VISUAL cambia de acto: caen ADENTRO de la costura, nunca en el beat exacto
const SW3 = A3 + 2;    // 719  · adentro del riel del match-move (arranca en 700)
const SW4 = A4 + 2;    // 1174 · adentro del wipe de sábanas (cobertura 1166-1182)
const SW5 = A5 + 3;    // 1583 · adentro de la oclusión de papel (cobertura 1578-1586)

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pc = (px: number) => (px / 1080) * 100;      // px verticales → % de pantalla
const pcx = (px: number) => (px / 1920) * 100;     // px horizontales → % de pantalla
const es = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
const esOut = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.42, 0, 0.24, 1) });
const esSnap = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.08, 0.86, 0.2, 1) });

// LAS MATERIAS de las costuras. ⛔ Ninguna es el color del fondo.
const TELA = "#E9E3D2";     // la sábana del vecino (frontera C)
const PAPEL = "#EFE8D6";    // la hoja de la factura (frontera D)
const HORMIGON = "#8E8C81"; // el reborde de la casa: donde se termina lo que cabe

// ── LA COLUMNA: la geometría de la cantidad ──────────────────────────────────────────────────
// 74 rebanadas de 10 W. La casa ocupa las 31 de abajo; las 43 de arriba quedan en el aire.
const COL_W = 240;
const BASE_Y = 946;                 // px sobre 1080 — el piso del patio
const U = 830 / 740;                // px por vatio (1,1216)
const H310 = 310 * U;               // 347,7 px — lo que cabe
const H430 = 430 * U;               // 482,3 px — lo que no
const RIM_Y = BASE_Y - H310;        // 598,3 px — el reborde
const TOP_Y = RIM_Y - H430;         // 116,0 px — la punta de la pila
const SLICE = 830 / 74;             // 11,216 px por rebanada

// ── EL RIEL DEL MATCH-MOVE (frontera B) ──────────────────────────────────────────────────────
// UNA sola velocidad para el bloque que se va y para el cable que llega. Ése es todo el truco.
const RAIL_V = -1.35;                                  // % de pantalla por frame
const railPct = (g: number) => (g - 700) * RAIL_V;     // 0 en el frame 700

// ══ LA APERTURA — trapecio: el borde superior puede ir INCLINADO (shL ≠ shR) ══════════════════
type Cover = { gL: number; gR: number; shL: number; shR: number; open: boolean };
const CERRADO: Cover = { gL: 50, gR: 50, shL: 0, shR: 0, open: false };

const coverAt = (g: number): Cover => {
  // W1 · VISERA — el borde se levanta inclinado desde la derecha, se nivela, y cae al revés.
  // Abre reciÉn en 136 (sobre "mi casa a mediodía pedía 310 vatios"): el aviso de los primeros
  // 130 frames se dice con el CUADRO CERRADO, que es lo que pide el acto — bajar el ruido.
  if (g >= 136 && g < 274) {
    const lados = es(clamp01((g - 136) / 32));
    const subeR = esOut(clamp01((g - 136) / 26));
    const subeL = esOut(clamp01((g - 150) / 30));
    const caeL = es(clamp01((g - 214) / 42));
    const caeR = es(clamp01((g - 228) / 42));
    const shL = lerp(lerp(102, 8, subeL), 104, caeL);
    const shR = lerp(lerp(102, 8, subeR), 104, caeR);
    return {
      gL: lerp(50, 22, lados), gR: lerp(50, 78, lados),
      shL, shR, open: Math.min(shL, shR) < 98.5,
    };
  }
  // W2 · TRONERA — hueco angosto de techo bajo; cierra la banda IZQUIERDA barriendo hasta la derecha
  if (g >= 470 && g < 610) {
    const abre = esSnap(clamp01((g - 470) / 26));
    const techo = esOut(clamp01((g - 470) / 22));
    const barre = esOut(clamp01((g - 556) / 38));
    const gL = lerp(lerp(50, 27, abre), 73, barre);
    const sh = lerp(102, 7, techo);
    return { gL, gR: 73, shL: sh, shR: sh, open: sh < 98.5 && gL < 71.6 };
  }
  // W3 · GOLPE — SNAP de 5 frames, se angosta mientras habla, cierra con el techo bajando
  if (g >= 852 && g < 932) {
    const snap = clamp01((g - 852) / 5);
    const angosta = es(clamp01((g - 860) / 44));
    const persiana = esOut(clamp01((g - 902) / 28));
    const sh = lerp(lerp(102, 9, snap), 103, persiana);
    return {
      gL: lerp(lerp(50, 25, snap), 29, angosta),
      gR: lerp(lerp(50, 75, snap), 71, angosta),
      shL: sh, shR: sh, open: sh < 98.5,
    };
  }
  // W4 · LA ESPINA — rendija alta que se ensancha LENTO y NO cierra: muere en la oclusión de papel
  if (g >= 1296 && g < 1594) {
    const rendija = esOut(clamp01((g - 1296) / 34));
    const ancha = es(clamp01((g - 1300) / 44));
    const muere = es(clamp01((g - 1578) / 14));      // escondido adentro de la hoja de papel
    const sh = lerp(102, 8, rendija);
    const gL = lerp(lerp(46, 28, ancha), 50, muere);
    const gR = lerp(lerp(54, 72, ancha), 50, muere);
    return { gL, gR, shL: sh, shR: sh, open: sh < 98.5 && gR - gL > 1.2 };
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
//    gradiente se apoya sobre la cara. Dos placas con el canto lamido por la luz, no una máscara.
const CantoV: React.FC<{ x: number; dir: -1 | 1; hot: number }> = ({ x, dir, hot }) => (
  <div style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 0 }}>
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 3, left: dir === -1 ? -3 : 0,
      background: `linear-gradient(180deg, ${rgba(V.volt, 0.28 * hot)}, ${rgba(V.bone, 0.66 * hot)} 46%, ${rgba(V.volt, 0.22 * hot)})`,
    }} />
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 124, left: dir === -1 ? -127 : 3,
      background: dir === -1
        ? `linear-gradient(270deg, ${rgba(V.bone, 0.14 * hot)}, rgba(0,0,0,0) 48%), linear-gradient(270deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.58)})`
        : `linear-gradient(90deg, ${rgba(V.bone, 0.14 * hot)}, rgba(0,0,0,0) 48%), linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.58)})`,
    }} />
  </div>
);
// el canto de arriba puede ir INCLINADO: se dibuja con un SVG, no con un borde recto
const CantoDiag: React.FC<{ c: Cover; hot: number }> = ({ c, hot }) => (
  <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <defs>
      <linearGradient id="s4espCanto" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={rgba(V.ink0, 0.56)} />
        <stop offset="70%" stopColor={rgba(V.bone, 0.1 * hot)} />
        <stop offset="100%" stopColor={rgba(V.bone, 0.0)} />
      </linearGradient>
    </defs>
    <polygon
      points={`${c.gL * 19.2},${c.shL * 10.8 - 96} ${c.gR * 19.2},${c.shR * 10.8 - 96} ` +
        `${c.gR * 19.2},${c.shR * 10.8} ${c.gL * 19.2},${c.shL * 10.8}`}
      fill="url(#s4espCanto)"
    />
    <line x1={c.gL * 19.2} y1={c.shL * 10.8} x2={c.gR * 19.2} y2={c.shR * 10.8}
      stroke={rgba(V.bone, 0.62 * hot)} strokeWidth={3} />
  </svg>
);

// ── FRONTERA C · WIPE POR MATERIA — LAS SÁBANAS DEL VECINO ───────────────────────────────────
// Es literalmente lo que está colgado en el plano anterior (`cmep30_s4c_casa_vecino_ropa.mp4`):
// la tela cruza flameando y detrás ya está el acto 4. Materia TELA, jamás el color del fondo.
const Sabanas: React.FC<{ at: number; dur?: number }> = ({ at, dur = 44 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const tapa = Math.sin(clamp01(p) * Math.PI);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 9 }, (_, i) => {
        const o = rnd(i * 4.3);
        const q = clamp01(p * 1.34 - o * 0.26);
        const x = lerp(-118, 128, esOut(q));
        const w = 560 + o * 720;
        const h = 620 + rnd(i * 8.9) * 460;
        const y = -14 + rnd(i * 2.1) * 62;
        const flap = Math.sin(q * 7.4 + i) * 4.2;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(1)}%`,
            width: w, height: h,
            transform: `rotate(${(flap - 3 + o * 6).toFixed(2)}deg) skewY(${(flap * 0.5).toFixed(2)}deg)`,
            background:
              `linear-gradient(102deg, ${rgba(TELA, 0.0)} 0%, ${TELA} 7%, #F6F2E6 34%, ` +
              `#D6CFBB 58%, ${TELA} 82%, ${rgba(TELA, 0.0)} 100%)`,
            boxShadow: `0 28px 90px ${rgba(V.ink0, 0.72)}`,
            borderRadius: 6,
          }}>
            {/* los pliegues verticales: la tela tiene materia, no es un rectángulo plano */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.5,
              backgroundImage:
                `repeating-linear-gradient(94deg, ${rgba(V.ink0, 0.12)} 0px, ${rgba(V.ink0, 0.12)} 3px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 46px)`,
            }} />
          </div>
        );
      })}
      {/* el instante de cobertura total: la tela llena el cuadro y ahí adentro cambia el acto */}
      <AbsoluteFill style={{ background: rgba(TELA, 0.92 * clamp01(tapa * 1.9 - 0.72)) }} />
    </AbsoluteFill>
  );
};

// ── FRONTERA D · OCLUSIÓN — LA HOJA DE PAPEL ─────────────────────────────────────────────────
// Una sola hoja, con su doblez, su fibra y su sombra de contacto. Cruza de IZQUIERDA a DERECHA
// (al revés que las sábanas) y tapa el 100 % entre 1578 y 1586. Color = PAPEL, nunca el fondo.
const OcluyeHoja: React.FC<{ at: number; dur?: number }> = ({ at, dur = 34 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(-176, 118, esOut(p));
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-26%", left: `${L.toFixed(2)}%`, width: "170%", height: "152%",
        transform: `rotate(${(-4 + p * 7).toFixed(2)}deg)`,
        background:
          `linear-gradient(268deg, ${rgba(V.white, 0.6)} 0%, rgba(255,255,255,0) 2.4%),` +
          `linear-gradient(166deg, #FBF7EC 0%, ${PAPEL} 38%, #DCD4BE 74%, #C4BCA6 100%)`,
        boxShadow: `0 0 140px ${rgba(V.ink0, 0.92)}`,
        overflow: "hidden",
      }}>
        {/* el DOBLEZ de la hoja: una cresta de luz y su valle */}
        <div style={{
          position: "absolute", left: "41%", top: "-10%", width: 26, height: "120%",
          transform: "rotate(6deg)",
          background: `linear-gradient(90deg, ${rgba(V.ink0, 0.16)}, ${rgba(V.white, 0.85)} 46%, ${rgba(V.ink0, 0.1)})`,
        }} />
        {/* la FIBRA del papel: rayado finísimo, lo que separa "hoja" de "rectángulo claro" */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.34,
          backgroundImage:
            `repeating-linear-gradient(88deg, ${rgba(V.concrete, 0.1)} 0px, ${rgba(V.concrete, 0.1)} 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 9px)`,
        }} />
        {/* la sombra de contacto del canto que viene entrando */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 180,
          background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.34)})`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ── LA CORRIENTE FRÍA — gráfica de APOYO sobre el material real (nunca hace de objeto) ────────
// Guiones que viajan por una diagonal fija. Es la BISAGRA del corte en el beat del frame 1081:
// la misma línea, la misma velocidad, la misma diagonal a los dos lados del corte.
const Corriente: React.FC<{
  g: number; x0: number; y0: number; x1: number; y1: number; n?: number; speed?: number;
  color?: string; op?: number; w?: number;
}> = ({ g, x0, y0, x1, y1, n = 14, speed = 0.014, color = V.sky, op = 1, w = 7 }) => {
  if (op <= 0.01) return null;
  const ang = (Math.atan2((y1 - y0) * 10.8, (x1 - x0) * 19.2) * 180) / Math.PI;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const t = ((g * speed) + i / n) % 1;
        const x = lerp(x0, x1, t);
        const y = lerp(y0, y1, t);
        const a = Math.sin(t * Math.PI) * op;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
            width: 56 + i % 3 * 16, height: w, marginLeft: -28, marginTop: -w / 2,
            transform: `rotate(${ang.toFixed(2)}deg)`, borderRadius: w,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(color, 0.92 * a)} 44%, rgba(0,0,0,0))`,
            boxShadow: `0 0 ${(16 * a).toFixed(0)}px ${rgba(color, 0.6 * a)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── TIPOGRAFÍA propia del movimiento ─────────────────────────────────────────────────────────
const Rotulo: React.FC<{
  children: React.ReactNode; x: number; y: number; color?: string; size?: number; op?: number; align?: "left" | "center" | "right";
}> = ({ children, x, y, color = V.bone, size = 32, op = 1, align = "center" }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    transform: `translate(${align === "left" ? "0%" : align === "right" ? "-100%" : "-50%"},-50%)`,
    opacity: op,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 3.2, color,
    textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.95)",
  }}>{children}</div>
);

// cartel que ATERRIZA (nada arranca de cero: entra con desplazamiento y escala)
const Cartel: React.FC<{
  g: number; at: number; out: number; x: number; y: number; size?: number; color?: string;
  dy?: number; children: React.ReactNode;
}> = ({ g, at, out, x, y, size = 50, color = V.white, dy = 0, children }) => {
  const inP = es(clamp01((g - at) / 14));
  const outP = clamp01((g - out) / 16);
  if (g < at || outP >= 1) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y + pc(dy)}%`,
      transform: `translate(-50%,-50%) translateY(${((1 - inP) * 26 + outP * 22 + Math.sin(g / 59) * 2.1).toFixed(1)}px) ` +
        `scale(${(0.92 + 0.08 * inP - outP * 0.05).toFixed(3)})`,
      opacity: Math.min(1, inP * 1.7) * (1 - outP),
    }}>
      <Bed pad={20}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 1.6, color,
          textTransform: "uppercase", lineHeight: 1.05, whiteSpace: "nowrap",
          textShadow: "0 5px 22px rgba(0,0,0,0.95)",
        }}>{children}</div>
      </Bed>
    </div>
  );
};

// ⭐ EL BLOQUE DE LA TESIS (acto 4). Sin cama, sin marco, sin adorno: escala y aire.
// Entra línea por línea con el desplazamiento que le manda `flujo()`.
const BloqueTesis: React.FC<{
  g: number; at: number; lines: { t: string; hot?: boolean }[]; side: "left" | "right";
  tipo: "cobran" | "queda"; size: number; y: number; hotColor: string;
}> = ({ g, at, lines, side, tipo, size, y, hotColor }) => {
  if (g < at) return null;
  return (
    <div style={{
      position: "absolute",
      left: side === "left" ? "9%" : undefined,
      right: side === "right" ? "9%" : undefined,
      top: `${y}%`,
      textAlign: side === "left" ? "left" : "right",
      transform: `translateY(${(Math.sin(g / 71) * 2.2).toFixed(2)}px)`,
    }}>
      {lines.map((ln, i) => {
        const t0 = at + i * 9;
        const fl = flujo(tipo, clamp01((g - t0) / 24));
        return (
          <div key={i} style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1.04,
            letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
            color: ln.hot ? hotColor : V.white,
            opacity: fl.opacity,
            transform: `translateY(${(fl.dy * 0.28).toFixed(2)}px)`,
            textShadow: `0 6px 30px rgba(0,0,0,0.95), 0 2px 7px rgba(0,0,0,0.9)` +
              (ln.hot ? `, 0 0 ${Math.round(size * 0.5)}px ${rgba(hotColor, 0.3)}` : ""),
          }}>{ln.t}</div>
        );
      })}
    </div>
  );
};

// ⭐⭐ LA COLUMNA — el corazón del acto 2. La cantidad como OBJETO, no como cuenta.
const Columna: React.FC<{ g: number; cx: number }> = ({ g, cx }) => {
  const llena = es(clamp01((g - 408) / 58));            // las 74 rebanadas caen y se apilan
  const come = es(clamp01((g - 534) / 42));             // las 31 de abajo se vuelven CÁLIDAS
  const frio = es(clamp01((g - 624) / 36));             // las 43 de arriba se vuelven FRÍAS
  const reborde = es(clamp01((g - 620) / 20));          // aparece la tapa de la casa
  const golpe = g >= 640 && g < 645 ? 1 - (g - 640) / 5 : 0;   // la pila asienta sobre el reborde
  const bambolea = clamp01((g - 648) / 30) * clamp01(1 - (g - 706) / 8);
  const riel = g >= 700 ? railPct(g) : 0;               // FRONTERA B: el bloque se va por el riel
  const rielPx = (riel / 100) * 1920;
  if (g < 400) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: `${cx}%`, top: 0, width: COL_W, height: 1080, marginLeft: -COL_W / 2 }}>

        {/* EL TUBO: el recipiente donde se mide. Vidrio delgado, nada más. */}
        <div style={{
          position: "absolute", left: -10, top: TOP_Y - 14, width: COL_W + 20, height: 830 + 28,
          border: `2px solid ${rgba(V.bone, 0.2)}`, borderRadius: 6,
          boxShadow: `inset 0 0 60px ${rgba(V.ink0, 0.6)}`,
          opacity: clamp01((g - 402) / 16),
        }} />

        {/* LA CASA: caja REAL con la foto del congelador adentro. Ocupa las 31 rebanadas de abajo
            y no una más. Sube desde ABAJO y en CÁLIDO — ley `flujo("queda")`. */}
        {g >= 528 && (
          <div style={{
            position: "absolute", left: 0, top: RIM_Y, width: COL_W, height: H310,
            transform: `translateY(${((1 - es(clamp01((g - 528) / 30))) * 120).toFixed(1)}px)`,
            opacity: es(clamp01((g - 528) / 22)),
          }}>
            <MediaCard src="img/cmepanel30/cmep30_s4_congelador_garaje.png" kind="photo"
              w={COL_W} h={H310} x={50} y={50} z={0} lit={1} litColor={V.amber} radius={4} />
          </div>
        )}

        {/* LAS 74 REBANADAS. Abajo (0-30) lo que la casa se come; arriba (31-73) lo que sobra. */}
        {Array.from({ length: 74 }, (_, i) => {
          const vis = clamp01(llena * 78 - i);
          if (vis <= 0.01) return null;
          const arriba = i >= 31;
          const top = BASE_Y - (i + 1) * SLICE + 0.9;
          // el bamboleo: cuanto más alto, más se escapa. La pila NO está sostenida por nada.
          const lean = arriba ? bambolea * Math.sin(g / 11 + i * 0.12) * ((i - 31) / 43) * 13 : 0;
          const dx = (arriba ? rielPx : 0) + lean;
          const dy = arriba ? golpe * -7 : 0;
          const c = arriba
            ? lerp(0, 1, frio)     // frío: se van a la red
            : -lerp(0, 1, come);   // cálido: se los come la casa
          const col = c > 0
            ? `linear-gradient(180deg, ${rgba(V.sky, 0.2 + 0.72 * c)}, ${rgba(V.sky, 0.1 + 0.34 * c)})`
            : c < 0
              ? `linear-gradient(180deg, ${rgba(V.amber, 0.24 + 0.74 * -c)}, ${rgba(V.amber, 0.12 + 0.36 * -c)})`
              : `linear-gradient(180deg, ${rgba(V.volt, 0.86)}, ${rgba(V.voltSoft, 0.4)})`;
          return (
            <div key={i} style={{
              position: "absolute", left: 0, top,
              width: COL_W, height: SLICE - 1.9,
              transform: `translate(${dx.toFixed(1)}px, ${(dy + (1 - vis) * -16).toFixed(1)}px)`,
              opacity: vis,
              background: col,
              boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.24)}, 0 2px 5px ${rgba(V.ink0, 0.5)}`,
            }} />
          );
        })}

        {/* EL REBORDE: la tapa de la casa. Acá se termina lo que cabe. Hormigón, con su sombra. */}
        {reborde > 0.01 && (
          <div style={{
            position: "absolute", left: -22, top: RIM_Y - 9, width: COL_W + 44, height: 17,
            transform: `scaleX(${(0.5 + 0.5 * reborde).toFixed(3)}) translateY(${(golpe * 2).toFixed(1)}px)`,
            background: `linear-gradient(180deg, #B7B4A6 0%, ${HORMIGON} 44%, #55544D 100%)`,
            boxShadow: `0 14px 30px ${rgba(V.ink0, 0.86)}, inset 0 1px 0 ${rgba(V.white, 0.5)}`,
            borderRadius: 2,
          }} />
        )}

        {/* la línea de los 310: dónde termina el recipiente. Se dice UNA vez. */}
        {g >= 546 && g < 720 && (
          <div style={{
            position: "absolute", left: COL_W + 30, top: RIM_Y - 20,
            opacity: clamp01((g - 546) / 14) * clamp01(1 - (g - 706) / 12),
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 2.4,
            color: rgba(V.amber, 0.95), whiteSpace: "nowrap",
            textShadow: "0 4px 18px rgba(0,0,0,0.95)",
          }}>
            HASTA ACÁ CABE
          </div>
        )}

        {/* la UNIDAD, dicha una sola vez y nunca repetida */}
        {g >= 430 && g < 540 && (
          <div style={{
            position: "absolute", left: COL_W + 30, top: TOP_Y + 30,
            opacity: clamp01((g - 430) / 14) * clamp01(1 - (g - 524) / 14),
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 31, letterSpacing: 3,
            color: rgba(V.bone, 0.8), whiteSpace: "nowrap",
            textShadow: "0 4px 18px rgba(0,0,0,0.95)",
          }}>
            CADA RAYA · 10 VATIOS
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── LA CÁMARA · una sola función de g, con deriva viva, que NUNCA vuelve a cero ───────────────
const KF = [0, 124, 262, 340, 411, 470, 537, 627, 700, 790, 852, 934, 960, 1081,
  1158, 1172, 1296, 1372, 1440, 1560, 1583, 1660, 1740, G_END];
const camAt = (g: number) => {
  const base = gcam(g, { z0: -140, z1: 120, panX: 128, panY: -34, ry: 4.2, rx: -1.4, dur: G_END });
  const crane = interpolate(
    g, KF,
    [-140, -88, -52, -30, -14, 2, 14, 30, 44, 26, 8, -10, -34, -18,
      2, 10, 20, 26, 30, 34, 22, 6, -16, -42],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  const push = interpolate(
    g, KF,
    [1.10, 1.04, 1.02, 1.08, 1.03, 1.00, 1.02, 1.06, 1.02, 1.06, 1.02, 1.30, 1.14, 1.04,
      1.10, 1.06, 1.02, 1.00, 1.02, 1.01, 1.10, 1.04, 1.08, 1.22],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) },
  );
  const FK = [0, 262, 411, 537, 700, 852, 934, 1081, 1172, 1316, 1580, 1740, G_END];
  const fx = interpolate(g, FK, [44, 38, 52, 30, 24, 40, 58, 46, 50, 50, 50, 56, 58], CL);
  const fy = interpolate(g, FK, [62, 50, 44, 56, 48, 44, 26, 44, 48, 50, 50, 54, 58], CL);
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
export const MovS4Espina: React.FC<{ acto?: number; gFrame?: number }> = ({ gFrame }) => {
  const cf = useCurrentFrame();
  const g = gFrame === undefined ? cf : gFrame;
  const toCF = (t: number) => cf - g + t;   // pasa un frame mío al reloj de las primitivas del Stage

  // ── LA LUZ: función continua de g. Entra en HORA.cenital, vive en HORA.mediodia, se enfría en
  //    el acto 3 (la red se lleva los 430), vuelve al mediodía pleno para la espina, y baja a
  //    HORA.penumbra en el aterrizaje sobre el medidor. Evoluciona, nunca salta. ──────────────
  const LK = [0, 130, 262, 411, 537, 717, 852, 965, 1081, 1172, 1316, 1560, 1620, 1740, G_END];
  const sunAng = interpolate(
    g, LK,
    [HORA.cenital.ang, HORA.mediodia.ang, 88, 88, 87, 86, 82, 74, 48, 44, HORA.mediodia.ang,
      86, 64, 30, HORA.penumbra.ang], CL,
  );
  const amb = interpolate(
    g, [0, 12, 262, 411, 537, 717, 852, 965, 1081, 1172, 1316, 1560, 1620, 1740, G_END],
    [0.86, HORA.cenital.amb, HORA.mediodia.amb, 0.95, 0.92, 0.86, 0.78, 0.66, 0.58, 0.74, 0.92,
      0.88, 0.70, 0.40, HORA.penumbra.amb], CL,
  );
  // los tres soles: cálido (lo que te queda) · frío (lo que te cobran) · blanco (el día pleno)
  const warmW = interpolate(g, LK, [0.2, 0.24, 0.3, 0.34, 0.74, 0.5, 0.3, 0.18, 0.14, 0.3, 0.44, 0.5, 0.66, 0.4, 0.16], CL);
  const coldW = interpolate(g, LK, [0.16, 0.2, 0.26, 0.3, 0.4, 0.74, 0.86, 0.94, 0.9, 0.6, 0.3, 0.26, 0.34, 0.66, 0.84], CL);
  const dayW = interpolate(g, LK, [0.9, 1.0, 1.0, 1.0, 0.92, 0.8, 0.66, 0.5, 0.4, 0.66, 1.0, 0.96, 0.7, 0.34, 0.12], CL);
  const coolMix = interpolate(g, LK, [0.06, 0.08, 0.12, 0.16, 0.24, 0.56, 0.74, 0.9, 0.86, 0.5, 0.16, 0.2, 0.34, 0.7, 0.92], CL);
  const keyFrom = interpolate(g, LK, [0.3, 0.34, 0.42, 0.5, 0.34, 0.24, 0.3, 0.44, 0.58, 0.5, 0.4, 0.36, 0.5, 0.66, 0.76], CL);
  const inten = interpolate(g, [0, 12, 262, 537, 717, 934, 1081, 1172, 1316, 1583, 1740, G_END],
    [0.78, 1.06, 1.0, 0.96, 0.9, 0.7, 0.62, 0.86, 1.04, 0.94, 0.62, 0.46], CL);
  const floorDim = interpolate(g, [0, 262, 537, 717, 965, 1172, 1316, 1583, G_END],
    [0.42, 0.48, 0.56, 0.62, 0.74, 0.6, 0.5, 0.58, 0.82], CL);

  const cam = camAt(g);
  const cov = coverAt(g);
  const clip = clipOf(cov);
  const cantoHot = cov.open ? clamp01((cov.gR - cov.gL) / 22) : 0;

  // ── ACTO 1 → 2 · FRONTERA A · MATCH-SHAPE. El rectángulo iluminado no suelta el cuadro.
  const morfP = clamp01((g - 262) / 62);
  const morf = es(morfP);
  const mw = lerp(430, 1500, morf);
  const mh = lerp(258, 844, morf);
  // el objeto ENTRA viajando desde fuera de cuadro (nada arranca de cero) y sigue viajando cuando
  // empieza el morph: es un solo recorrido, no dos movimientos pegados
  const mxIn = es(clamp01((g - 238) / 26));
  const mx = lerp(lerp(-14, 31, mxIn), 50, morf);
  const my = lerp(54, 47, morf);
  const cells = clamp01((g - 274) / 44);
  // el BORDE DURO que repinta la superficie: en cada frame hay una línea neta, nunca un fundido
  const sweep = clamp01((g - 268) / 50);
  const verMorfo = g >= 236 && g < 352;

  // ── ACTO 3 · el riel del match-move, el zoom-through al medidor y el corte al vecino
  const cableX = 152 + railPct(g);                       // el cable llega por el MISMO riel
  const zw = g >= 934 && g < 964 ? zoomThrough(g, 934, 26, 58, 26) : null;
  const zs: React.CSSProperties = zw
    ? { transform: zw.out, opacity: zw.opacity, transformStyle: "preserve-3d" }
    : { transformStyle: "preserve-3d" };

  // mounts (los fondos se montan ANTES de su costura: un zoom-through o un corte contra nada es
  // un fundido a negro)
  const bgPatio = g < 800;
  const bgCable = g >= 690 && g < 962;
  const bgDisco = g >= 916 && g < 1088;
  const bgVecino = g >= 1081 && g < 1200;
  const bgEspina = g >= 1166 && g < 1600;
  const bgFactura = g >= 1556 && g < 1792;
  const bgMedidor = g >= 1752;

  return (
    <AbsoluteFill>
      {/* ════ EL MUNDO — todo lo que puede tapar al avatar vive acá dentro, y ESTO es lo único que
          la apertura recorta. Ni un solo píxel de estas capas llega nunca a su cara. ════ */}
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {/* la atmósfera se monta UNA vez para los 60 s: nunca se remonta entre actos */}
        <VoltAtmos
          tint={light(coolMix, "volt", "sky")} tint2={V.amber}
          keyFrom={keyFrom} intensity={inten} floor={floorDim}
        />
        {/* el SOL es un personaje: su ángulo marca la hora. El FRÍO entra siempre desde arriba. */}
        <SunKey ang={sunAng} temp="torch" amb={warmW * amb} soft={66} />
        <SunKey ang={96} temp="sky" amb={coldW * amb * 0.8} soft={80} />
        <SunKey ang={sunAng} temp="bone" amb={dayW * amb * 0.72} soft={88} />

        <Layers cam={cam}>
          {/* ── ACTOS 1-2 · EL PATIO A MEDIODÍA. Un solo fondo para los dos actos: lo que cambia
              entre ellos es la luz, la columna y el objeto, no el mundo. ──────────────────── */}
          {bgPatio && (
            <Plane z={-860}>
              <PhotoPlane src="img/cmepanel30/cmep30_s4_panel_sol_mediodia.png" kind="photo" z={0}
                scale={interpolate(g, [0, 262, 411, 717, 800], [1.34, 1.24, 1.16, 1.22, 1.26], CL)}
                dim={interpolate(g, [0, 40, 262, 340, 411, 537, 717], [0.5, 0.4, 0.5, 0.34, 0.58, 0.68, 0.72], CL)}
                tint={V.white} />
            </Plane>
          )}

          {/* ── ACTO 3a · EL CABLE. Entra por el MISMO riel y a la MISMA velocidad que el bloque
              de los 430 que se está yendo: eso es el MATCH-MOVE de la frontera B. ─────────── */}
          {bgCable && (
            <AbsoluteFill style={zs}>
              <div style={{ position: "absolute", inset: 0, transform: `translateX(${cableX.toFixed(2)}%)` }}>
                <Plane z={-820}>
                  <PhotoPlane src="img/cmepanel30/cmep30_s4_cable_entrada_casa.png" kind="photo" z={0}
                    scale={interpolate(g, [700, 830, 934], [1.3, 1.2, 1.34], CL)}
                    dim={interpolate(g, [700, 800, 900, 934], [0.44, 0.56, 0.62, 0.5], CL)} tint={V.sky} />
                </Plane>
              </div>
              {/* el clip real del cable con su sombra: entra cuando el riel ya lo puso en cuadro */}
              {g >= 800 && g < 934 && (
                <Plane z={-560}>
                  <MediaCard src="broll/cmepanel30/cmep30_s4c_cable_medidor_sombra.mp4" kind="video"
                    w={lerp(560, 720, es(clamp01((g - 800) / 90)))}
                    h={lerp(336, 432, es(clamp01((g - 800) / 90)))}
                    x={lerp(96, 74, es(clamp01((g - 800) / 60)))} y={44} z={0}
                    ry={-11} rx={2} startFrom={2} lit={0.96} litColor={V.sky}
                    label="EL MISMO CABLE" sheenAt={toCF(856)} radius={12} />
                </Plane>
              )}
            </AbsoluteFill>
          )}

          {/* ── ACTO 3b · EL DISCO DEL MEDIDOR. Se monta 18 f ANTES del zoom-through. ──────── */}
          {bgDisco && (
            <Plane z={-880}>
              <PhotoPlane src="img/cmepanel30/cmep30_s4_medidor_disco.png" kind="photo" z={0}
                scale={interpolate(g, [916, 960, 1020, 1088], [2.1, 1.3, 1.2, 1.24], CL)}
                dim={interpolate(g, [916, 960, 1020, 1088], [0.3, 0.44, 0.56, 0.6], CL)} tint={V.sky} />
            </Plane>
          )}

          {/* ── ACTO 3c · LA CASA DEL VECINO. CORTE EN EL BEAT @1081, sin transición. ──────── */}
          {bgVecino && (
            <>
              <Plane z={-900}>
                <PhotoPlane src="img/cmepanel30/cmep30_s4_casa_vecino.png" kind="photo" z={0}
                  scale={interpolate(g, [1081, 1172], [1.3, 1.2], CL)}
                  dim={interpolate(g, [1081, 1120, 1172], [0.5, 0.44, 0.5], CL)} tint={V.sky} />
              </Plane>
              {g >= 1086 && g < 1200 && (
                <Plane z={-700}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s4c_casa_vecino_ropa.mp4" kind="video"
                    z={0} startFrom={0}
                    scale={interpolate(g, [1086, 1172], [1.24, 1.16], CL)}
                    dim={interpolate(g, [1086, 1130, 1172], [0.4, 0.3, 0.36], CL)} tint={V.bone} />
                </Plane>
              )}
            </>
          )}

          {/* ── ACTO 4 · EL PATIO DONDE PASÓ TODO. Un solo fondo para los 408 frames: contención.
              Con la ventana abierta queda SÓLO en las dos bandas. ─────────────────────────── */}
          {bgEspina && (
            <Plane z={-880}>
              <PhotoPlane src="img/cmepanel30/cmep30_s4_dos_parados_patio.png" kind="photo" z={0}
                scale={interpolate(g, [1166, 1296, 1440, 1596], [1.3, 1.22, 1.18, 1.22], CL)}
                dim={interpolate(g, [1166, 1250, 1296, 1400, 1580], [0.46, 0.4, 0.52, 0.62, 0.6], CL)}
                tint={V.white} />
            </Plane>
          )}

          {/* ── ACTO 5 · LA FACTURA EN BLANCO SOBRE LA MESA, y el ATERRIZAJE en el medidor ──── */}
          {bgFactura && (
            <Plane z={-860}>
              <PhotoPlane src="img/cmepanel30/cmep30_s4_factura_blanca_mesa.png" kind="photo" z={0}
                scale={interpolate(g, [1556, 1650, 1780], [1.34, 1.2, 1.14], CL)}
                dim={interpolate(g, [1556, 1620, 1700, 1780], [0.34, 0.28, 0.4, 0.54], CL)} tint={V.amber} />
            </Plane>
          )}
          {bgMedidor && (
            <>
              <Plane z={-900}>
                <PhotoPlane src="img/cmepanel30/cmep30_s5_medidor_penumbra.png" kind="photo" z={0}
                  scale={interpolate(g, [1752, 1817], [1.3, 1.16], CL)}
                  dim={interpolate(g, [1752, 1790, 1817], [0.62, 0.5, 0.46], CL)} tint={V.sky} />
              </Plane>
              {g >= 1758 && (
                <Plane z={-660}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s5_clip_gira_hacia_medidor.mp4" kind="video"
                    z={0} startFrom={0}
                    scale={interpolate(g, [1758, 1817], [1.26, 1.14], CL)}
                    dim={interpolate(g, [1758, 1790, 1817], [0.56, 0.44, 0.4], CL)} tint={V.sky} />
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
            <CantoDiag c={cov} hot={cantoHot} />
          )}
        </>
      )}

      {/* ════ EL PRIMER PLANO — no está recortado. Con la apertura ABIERTA todo vive fuera del
          hueco: nunca en la caja de la cara, nunca sobre boca ni mentón. ════ */}
      <Layers cam={cam}>

        {/* ═══ ACTO 1 · "ACÁ ESTÁ ESCONDIDO TODO EL VIDEO" ═════════════════════════════════════ */}
        {/* la materia ENTRANTE: el panel al sol visto desde abajo, el aire caliente subiendo.
            Se va de cuadro VIAJANDO hacia la izquierda (no se apaga) antes de que abra la visera. */}
        {g < 144 && (
          <Plane z={140}>
            <MediaCard src="broll/cmepanel30/cmep30_s4c_panel_sol_calor.mp4" kind="video"
              w={lerp(1180, 520, es(clamp01((g - 30) / 88)))}
              h={lerp(664, 294, es(clamp01((g - 30) / 88)))}
              x={lerp(50, -22, es(clamp01((g - 30) / 100)))}
              y={lerp(50, 36, es(clamp01((g - 30) / 100)))}
              z={0} ry={lerp(-3, 15, es(clamp01((g - 30) / 100)))} rx={2}
              startFrom={0} lit={1} litColor={V.white}
              label={g >= 12 ? "740 VATIOS AL SOL" : undefined}
              sheenAt={toCF(24)} radius={14} />
          </Plane>
        )}

        {/* el aviso, con el CUADRO CERRADO: es todo lo que hay en pantalla. Bajar el ruido. */}
        <Plane z={200}>
          <Cartel g={g} at={46} out={118} x={50} y={72} size={62} color={V.white}>
            ACÁ ESTÁ ESCONDIDO<br />TODO EL <span style={{ color: V.volt }}>VIDEO</span>
          </Cartel>
        </Plane>

        {/* con la visera abierta: el 310 en la banda IZQUIERDA y la pinza real en la DERECHA */}
        {g >= 150 && g < 234 && (
          <Plane z={210}>
            <div style={{ opacity: clamp01((g - 150) / 10) * clamp01(1 - (g - 220) / 14) }}>
              <Readout value="310" unit="W" label="MI CASA A MEDIODÍA" at={toCF(153)}
                x={12} y={44} size={96} color={V.volt} />
            </div>
          </Plane>
        )}
        {g >= 140 && g < 274 && (
          <Plane z={160}>
            <MediaCard src="broll/cmepanel30/cmep30_s4c_pinza_abraza_cable.mp4" kind="video"
              w={290} h={174}
              x={lerp(116, 86.5, es(clamp01((g - 140) / 34)))}
              y={lerp(40, 36, es(clamp01((g - 140) / 60)))}
              z={0} ry={-13} rx={2} startFrom={4} lit={1} litColor={V.volt}
              label="LA PINZA EN EL CABLE" sheenAt={toCF(190)} radius={10} />
          </Plane>
        )}

        {/* ═══ FRONTERA A · MATCH-SHAPE — EL RECTÁNGULO ILUMINADO QUE SE VUELVE EL PANEL ═══════
            El objeto NO suelta el cuadro: crece, se le achica el radio, le nace la grilla de
            celdas y la superficie se repinta con un borde DURO que viaja. Nunca un fundido. ══ */}
        {verMorfo && (
          <Plane z={120}>
            <div style={{
              position: "absolute", left: `${mx.toFixed(3)}%`, top: `${my.toFixed(3)}%`,
              width: mw, height: mh, marginLeft: -mw / 2, marginTop: -mh / 2,
              transform: `rotateY(${lerp(-9, 0, morf).toFixed(2)}deg) rotateX(${lerp(3, 0, morf).toFixed(2)}deg) ` +
                `translateY(${(Math.sin(g / 47) * 2.4).toFixed(2)}px)`,
              transformStyle: "preserve-3d",
            }}>
              <PanelForm w={mw} h={mh} cells={cells} tint="#0E1A2B" style={{ position: "absolute", inset: 0 }}>
                {/* SUPERFICIE 1 · el display de la pinza (la materia que viene del acto 1) */}
                <MediaCard src="img/cmepanel30/cmep30_s4_pinza_macro_display.png" kind="photo"
                  w={mw} h={mh} x={50} y={50} z={0} lit={1} litColor={V.volt}
                  sheenAt={toCF(186)} radius={lerp(14, 4, morf)} />
                {/* SUPERFICIE 2 · el panel. Se revela con un BORDE NETO, no con opacidad. */}
                {sweep > 0.001 && (
                  <div style={{
                    position: "absolute", inset: 0,
                    clipPath: `inset(0% ${((1 - sweep) * 100).toFixed(2)}% 0% 0%)`,
                    WebkitClipPath: `inset(0% ${((1 - sweep) * 100).toFixed(2)}% 0% 0%)`,
                  }}>
                    <MediaCard src="img/cmepanel30/cmep30_s4_panel_sol_mediodia.png" kind="photo"
                      w={mw} h={mh} x={50} y={50} z={0} lit={1} litColor={V.white}
                      radius={lerp(14, 4, morf)} />
                    {/* la GRILLA DE CELDAS: la forma madre de todas las costuras del video */}
                    <div style={{
                      position: "absolute", inset: 0, opacity: 0.72 * cells,
                      backgroundImage:
                        `linear-gradient(${rgba(V.bone, 0.26)} 2px, transparent 2px),` +
                        `linear-gradient(90deg, ${rgba(V.bone, 0.26)} 2px, transparent 2px)`,
                      backgroundSize: `${(mw / 6).toFixed(2)}px ${(mh / 4).toFixed(2)}px`,
                    }} />
                  </div>
                )}
                {/* el especular montado sobre el borde: lo que hace que se lea como una superficie
                    que se REPINTA y no como dos capas cruzándose */}
                {sweep > 0.001 && sweep < 0.999 && (
                  <div style={{
                    position: "absolute", top: 0, bottom: 0, left: `${(sweep * 100).toFixed(2)}%`,
                    width: 130, marginLeft: -65,
                    background: `linear-gradient(90deg, rgba(255,255,255,0), ${rgba(V.white, 0.5)} 48%, rgba(255,255,255,0))`,
                    mixBlendMode: "screen",
                  }} />
                )}
              </PanelForm>
              {/* la cifra viaja ADENTRO del objeto y muere cuando la superficie se repinta */}
              {g >= 242 && g < 296 && (
                <div style={{ position: "absolute", inset: 0, ...mcSync(cf, 50, 50) }}>
                  <Readout value="310" unit="W" label="LO QUE PEDÍA MI CASA" at={toCF(245)}
                    x={50} y={50} size={lerp(112, 58, morf)} color={V.volt} />
                </div>
              )}
            </div>
          </Plane>
        )}

        {/* ═══ ACTO 2 · ⭐ LA ARITMÉTICA COMO CANTIDAD FÍSICA ══════════════════════════════════ */}
        {g >= 268 && g < 800 && (
          <>
            {/* la pregunta: Ernesto levanta la vista de la pinza y mira el panel — exactamente el
                beat de "¿y sabes cuánto estaba dando el panel?". Material real, no un titular solo. */}
            {g >= 274 && g < 410 && (
              <Plane z={180}>
                <MediaCard src="broll/cmepanel30/cmep30_s4c_ernesto_mira_pinza_panel.mp4" kind="video"
                  w={470} h={282}
                  x={lerp(-16, 20, es(clamp01((g - 274) / 40)))}
                  y={lerp(74, 68, es(clamp01((g - 274) / 70)))}
                  z={0} ry={12} rx={-2} startFrom={2} lit={1} litColor={V.white}
                  label="¿CUÁNTO ESTABA DANDO?" sheenAt={toCF(330)} radius={12} />
              </Plane>
            )}

            {/* ⭐ LA COLUMNA — la cantidad, no la cuenta */}
            <Plane z={100}>
              <Columna
                g={g}
                cx={interpolate(g, [262, 411, 440, 478, 606, 650, 700], [36, 34, 34, 17, 17, 21, 24], CL)}
              />
            </Plane>

            {/* LOS TRES NÚMEROS. Ninguno se escribe como resta: cada uno es el rótulo de una zona
                física de la columna, y entra por donde le manda la ley `flujo()`. */}
            <Plane z={210}>
              {/* 740 — el golpe. Entra con el panel, arriba, blanco de mediodía. */}
              {g >= 408 && g < 560 && (
                <div style={{ opacity: clamp01((g - 408) / 8) * clamp01(1 - (g - 542) / 16) }}>
                  <Readout value="740" unit="W" label="ENTRANDO POR EL CABLE" at={toCF(411)}
                    x={interpolate(g, [411, 438, 472], [62, 62, 87], CL)}
                    y={interpolate(g, [411, 472], [30, 24], CL)}
                    size={interpolate(g, [411, 452, 540], [186, 132, 126], CL)} color={V.white} />
                </div>
              )}
              {/* 310 — lo que la casa se come. CÁLIDO y desde ABAJO. */}
              {g >= 534 && g < 730 && (() => {
                const fl = flujo("queda", clamp01((g - 534) / 26));
                return (
                  <div style={{
                    transform: `translateY(${(fl.dy * 0.5).toFixed(1)}px)`,
                    opacity: fl.opacity * clamp01(1 - (g - 712) / 16),
                  }}>
                    <Readout value="310" unit="W" label="SE LO COME TU CASA" at={toCF(537)}
                      x={interpolate(g, [537, 606, 664], [86, 86, 70], CL)} y={74}
                      size={132} color={V.amber} />
                  </div>
                );
              })()}
              {/* 430 — lo que sobra. FRÍO y desde ARRIBA. Y viaja con el bloque: cuando la pila se
                  va por el riel, el número se va CON ella. Ahí deja de ser un rótulo y pasa a ser
                  la etiqueta de una cosa que se está yendo. */}
              {g >= 624 && g < 760 && (() => {
                const fl = flujo("cobran", clamp01((g - 624) / 28));
                const rielX = g >= 700 ? railPct(g) : 0;
                return (
                  <div style={{
                    transform: `translate(${rielX.toFixed(2)}%, ${(fl.dy * 0.5).toFixed(1)}px)`,
                    opacity: fl.opacity,
                  }}>
                    <Readout value="430" unit="W" label="SOBRABAN" at={toCF(627)}
                      x={interpolate(g, [627, 664, 700], [86, 70, 62], CL)} y={26}
                      size={150} color={V.sky} />
                  </div>
                );
              })()}
            </Plane>

            {/* los aparatos que se comen los 310: material REAL, no un ícono solo */}
            {g >= 545 && g < 676 && (
              <Plane z={170}>
                <MediaCard src="broll/cmepanel30/cmep30_s4c_congelador_vibra.mp4" kind="video"
                  w={352} h={212}
                  x={lerp(-14, 16, es(clamp01((g - 545) / 34)))}
                  y={lerp(48, 44, es(clamp01((g - 545) / 60)))}
                  z={0} ry={12} rx={-2} startFrom={6} lit={0.96} litColor={V.amber}
                  label="MIS APARATOS" sheenAt={toCF(600)} radius={10} />
              </Plane>
            )}

            {/* EL TITULAR DEL ACTO. Una idea, siete palabras, cuando el reborde ya está puesto. */}
            <Plane z={230}>
              <Cartel g={g} at={640} out={712} x={68} y={52} size={62} color={V.white}>
                NO ENTRAN<br />EN <span style={{ color: V.amber }}>TU CASA</span>
              </Cartel>
              {g >= 300 && g < 400 && (
                <Rotulo x={72} y={82} size={33} color={rgba(V.bone, 0.9)}
                  op={clamp01((g - 300) / 12) * clamp01(1 - (g - 384) / 14)}>
                  EN ESE MISMO MOMENTO
                </Rotulo>
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 3 · "NO SE GUARDAN EN NINGÚN LADO" ════════════════════════════════════════ */}
        {g >= SW3 - 20 && g < 1200 && (
          <>
            {/* la corriente fría que corre por el cable — gráfica de APOYO sobre el material real.
                Es la BISAGRA del corte en el beat del 1081: la misma diagonal, la misma velocidad
                a los dos lados del corte. */}
            <Plane z={60}>
              {/* con el cuadro CERRADO cruza entero; cuando abre la ventana W3 (852) se retira a
                  la banda izquierda: nunca un guión sobre su cara */}
              <Corriente g={g} x0={22} y0={92} x1={64} y1={16} n={16} speed={0.0125} color={V.sky}
                op={clamp01((g - 786) / 22) * clamp01(1 - (g - 836) / 14)} />
              <Corriente g={g} x0={10} y0={94} x1={23} y1={12} n={10} speed={0.0125} color={V.sky}
                op={clamp01((g - 848) / 14) * clamp01(1 - (g - 918) / 14)} />
              <Corriente g={g} x0={34} y0={78} x1={72} y1={22} n={13} speed={0.0125} color={V.sky}
                op={clamp01((g - 962) / 16) * clamp01(1 - (g - 1148) / 16)} />
            </Plane>

            {/* "no se guardan en ningún lado" — el titular que abre el acto */}
            <Plane z={220}>
              <Cartel g={g} at={724} out={840} x={31} y={22} size={56} color={V.white}>
                NO SE GUARDAN<br />EN NINGÚN LADO
              </Cartel>
            </Plane>

            {/* "No hay batería": el ícono entra FRÍO desde arriba (es lo que la compañía se lleva,
                no lo que a vos te queda) y una barra de hormigón lo tacha. Objeto de la escena. */}
            {g >= 846 && g < 936 && (() => {
              const fl = flujo("cobran", clamp01((g - 846) / 22));
              const tacha = es(clamp01((g - 862) / 16));
              return (
                <Plane z={240}>
                  <div style={{ transform: `translateY(${(fl.dy * 0.6).toFixed(1)}px)`, opacity: fl.opacity * clamp01(1 - (g - 920) / 14) }}>
                    <IconPng src="img/cmepanel30/cmep30_ic_bateria.png" x={15} y={40} size={168}
                      z={0} opacity={0.94} rot={-7} glow={V.ink0} />
                  </div>
                  {tacha > 0.01 && (
                    <div style={{
                      position: "absolute", left: "6%", top: "40%", width: `${(18 * tacha).toFixed(2)}%`,
                      height: 13, marginTop: -6,
                      transform: "rotate(-14deg)", transformOrigin: "0% 50%",
                      background: `linear-gradient(180deg, #B7B4A6, ${HORMIGON} 46%, #55544D)`,
                      boxShadow: `0 8px 22px ${rgba(V.ink0, 0.85)}`,
                      opacity: clamp01(1 - (g - 920) / 14),
                    }} />
                  )}
                  <Rotulo x={15} y={57} size={44} color={V.white}
                    op={clamp01((g - 858) / 12) * clamp01(1 - (g - 918) / 14)}>
                    NO HAY BATERÍA
                  </Rotulo>
                </Plane>
              );
            })()}

            {/* "No se acumulan": las rebanadas intentan apilarse sobre el cable y SE RESBALAN.
                Es la misma unidad del acto 2 — la cantidad sigue siendo la misma cosa. */}
            {g >= 880 && g < 940 && (
              <Plane z={150}>
                {Array.from({ length: 7 }, (_, i) => {
                  const o = rnd(i * 6.1);
                  const q = ((g - 880) / 46 + o) % 1;
                  const sube = clamp01(q * 2.4);
                  const cae = clamp01((q - 0.46) / 0.54);
                  const x = 84 + cae * 16 + o * 2;
                  const y = 66 - sube * 22 + cae * cae * 34;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
                      width: 132, height: 10, marginLeft: -66,
                      transform: `rotate(${(cae * 26 - 4).toFixed(1)}deg)`,
                      background: `linear-gradient(180deg, ${rgba(V.sky, 0.9)}, ${rgba(V.sky, 0.34)})`,
                      boxShadow: `0 3px 9px ${rgba(V.ink0, 0.7)}`,
                      opacity: (1 - cae * 0.9) * clamp01((g - 880) / 10) * clamp01(1 - (g - 928) / 12),
                    }} />
                  );
                })}
                <Rotulo x={84} y={78} size={40} color={V.white}
                  op={clamp01((g - 890) / 12) * clamp01(1 - (g - 926) / 12)}>
                  NO SE ACUMULAN
                </Rotulo>
              </Plane>
            )}

            {/* "Salen por el mismo cable" — con la apertura ya cerrada, centro liberado */}
            <Plane z={220}>
              <Cartel g={g} at={934} out={1012} x={30} y={80} size={52} color={V.white}>
                SALEN POR EL<br />MISMO CABLE
              </Cartel>
              <Cartel g={g} at={972} out={1064} x={70} y={22} size={54} color={V.white}>
                CRUZAN EL MEDIDOR<br /><span style={{ color: V.sky }}>PARA EL OTRO LADO</span>
              </Cartel>
            </Plane>

            {/* el disco que gira AL REVÉS: la flecha es gráfica de apoyo SOBRE la foto real del
                disco de aluminio, nunca un disco dibujado. */}
            {g >= 968 && g < 1080 && (
              <Plane z={190}>
                <IconPng src="img/cmepanel30/cmep30_ic_flecha.png"
                  x={46} y={50} size={124} z={0}
                  opacity={0.92 * clamp01((g - 968) / 12) * clamp01(1 - (g - 1064) / 14)}
                  rot={lerp(20, 200, es(clamp01((g - 972) / 46)))} glow={V.ink0} />
              </Plane>
            )}

            {/* Claudio señalando el medidor: material real sobre el momento clave */}
            {g >= 990 && g < 1122 && (
              <Plane z={170}>
                <MediaCard src="broll/cmepanel30/cmep30_s4c_claudio_senala_medidor.mp4" kind="video"
                  w={430} h={258}
                  x={lerp(-16, 18, es(clamp01((g - 990) / 36)))}
                  y={lerp(52, 48, es(clamp01((g - 990) / 66)))}
                  z={0} ry={12} rx={-2} startFrom={4} lit={1} litColor={V.sky}
                  label="HACIA LA RED" sheenAt={toCF(1046)} radius={12} />
              </Plane>
            )}

            {/* "a alimentar la casa del vecino" + EL GOLPE: GRATIS.
                Silencio alrededor: 24 frames antes se apagan todos los rótulos, y el GRATIS queda
                solo en el cuadro. Sobrevive el wipe de sábanas y muere ya adentro del acto 4. */}
            <Plane z={230}>
              <Cartel g={g} at={1088} out={1142} x={30} y={80} size={50} color={V.white}>
                LA CASA DEL VECINO
              </Cartel>
            </Plane>
            <Plane z={260}>
              {g >= 1150 && g < 1244 && (
                <div style={{
                  position: "absolute", left: "50%", top: "50%",
                  transform: `translate(-50%,-50%) scale(${(1 + (1 - es(clamp01((g - 1150) / 10))) * 0.2).toFixed(3)}) ` +
                    `translateY(${(Math.sin(g / 53) * 2.4).toFixed(2)}px)`,
                  opacity: clamp01((g - 1150) / 6) * clamp01(1 - (g - 1228) / 16),
                }}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 214, lineHeight: 0.9,
                    letterSpacing: 6, color: V.white, textTransform: "uppercase",
                    textShadow: `0 0 90px ${rgba(V.sky, 0.34)}, 0 10px 40px rgba(0,0,0,0.96)`,
                  }}>GRATIS</div>
                  <div style={{
                    height: 6, marginTop: 14,
                    width: `${(100 * es(clamp01((g - 1162) / 22))).toFixed(1)}%`,
                    background: `linear-gradient(90deg, ${rgba(V.amber, 0.9)}, ${rgba(V.amber, 0.1)})`,
                  }} />
                </div>
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 4 · ⭐ LA ESPINA ══════════════════════════════════════════════════════════
            Contención: en los 296 frames de ventana abierta NO hay una sola tarjeta flotante.
            Sólo él, el patio en las bandas, y la tesis en tipografía grande. ═══════════════ */}
        {g >= SW4 - 8 && g < 1600 && (
          <>
            {/* 1172-1290 · el aviso, con la apertura cerrada */}
            <Plane z={230}>
              <Cartel g={g} at={1180} out={1288} x={50} y={30} size={64} color={V.white}>
                ESA ES <span style={{ color: V.volt }}>LA ESPINA</span><br />DE ESTE VIDEO
              </Cartel>
            </Plane>
            {/* la hoja en blanco: lo que va a recibir "todas las letras". Planta la materia de la
                frontera D y del acto 5 — cuando el papel cruce, ya lo vimos. */}
            {g >= 1236 && g < 1310 && (
              <Plane z={180}>
                <MediaCard src="img/cmepanel30/cmep30_s4_factura_blanca_mesa.png" kind="photo"
                  w={lerp(400, 470, es(clamp01((g - 1236) / 60)))}
                  h={lerp(240, 282, es(clamp01((g - 1236) / 60)))}
                  x={lerp(114, 76, es(clamp01((g - 1236) / 38)))}
                  y={lerp(72, 66, es(clamp01((g - 1236) / 60)))}
                  z={0} ry={-11} rx={3} lit={1} litColor={V.amber}
                  label="CON TODAS LAS LETRAS" sheenAt={toCF(1282)} radius={12} />
              </Plane>
            )}

            {/* ⭐ LA TESIS. Dos bloques, uno a cada lado de él, en las bandas del mundo.
                El primero BAJA FRÍO desde arriba: es la regla que te aplican.
                El segundo SUBE CÁLIDO desde abajo: es tu casa. `flujo()` literal, sin adorno. */}
            <Plane z={250}>
              {g >= 1316 && g < 1596 && (
                <div style={{ opacity: clamp01(1 - (g - 1582) / 12) }}>
                  <BloqueTesis
                    g={g} at={1316} side="left" tipo="cobran" size={58} y={28} hotColor={V.volt}
                    lines={[
                      { t: "UN PANEL" },
                      { t: "ENCHUFABLE" },
                      { t: "NO TE" },
                      { t: "DESCUENTA" },
                      { t: "LO QUE", hot: true },
                      { t: "PRODUCE", hot: true },
                    ]}
                  />
                </div>
              )}
              {g >= 1421 && g < 1596 && (
                <div style={{ opacity: clamp01(1 - (g - 1582) / 12) }}>
                  <BloqueTesis
                    g={g} at={1421} side="right" tipo="queda" size={52} y={26} hotColor={V.amber}
                    lines={[
                      { t: "TE DESCUENTA" },
                      { t: "SOLAMENTE" },
                      { t: "LO QUE TU CASA", hot: true },
                      { t: "ESTÁ", hot: true },
                      { t: "CONSUMIENDO", hot: true },
                      { t: "EN ESE MISMO" },
                      { t: "SEGUNDO" },
                    ]}
                  />
                </div>
              )}
              {/* un solo objeto de escena en la banda derecha: la casa. Nada más. */}
              {g >= 1452 && g < 1580 && (
                <IconPng src="img/cmepanel30/cmep30_ic_casa.png" x={90} y={80} size={108} z={0}
                  opacity={0.82 * clamp01((g - 1452) / 16) * clamp01(1 - (g - 1566) / 14)}
                  rot={-4} glow={V.ink0} />
              )}
              {g >= 1346 && g < 1420 && (
                <IconPng src="img/cmepanel30/cmep30_ic_panelsolar.png" x={11} y={80} size={104} z={0}
                  opacity={0.8 * clamp01((g - 1346) / 16) * clamp01(1 - (g - 1406) / 12)}
                  rot={5} glow={V.ink0} />
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 5 · "LA FACTURA NO TE FELICITA" ═══════════════════════════════════════════ */}
        {g >= 1568 && (
          <>
            <Plane z={240}>
              {/* "Ni un vatio más." — el remate de la tesis, sobre la hoja ya aterrizada */}
              {g >= 1584 && g < 1690 && (
                <div style={{
                  position: "absolute", left: "50%", top: "42%",
                  transform: `translate(-50%,-50%) scale(${(1 + (1 - es(clamp01((g - 1584) / 12))) * 0.14).toFixed(3)}) ` +
                    `translateY(${(Math.sin(g / 61) * 2.2).toFixed(2)}px)`,
                  opacity: clamp01((g - 1584) / 8) * clamp01(1 - (g - 1672) / 16),
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 148, lineHeight: 0.92,
                    letterSpacing: 3, color: V.white, textTransform: "uppercase",
                    textShadow: "0 10px 40px rgba(0,0,0,0.96)",
                  }}>
                    NI UN VATIO<br /><span style={{ color: V.danger }}>MÁS</span>
                  </div>
                </div>
              )}
            </Plane>

            {/* la factura macro: material REAL adentro de la tarjeta, con el renglón que NO existe */}
            {g >= 1630 && g < 1768 && (
              <Plane z={180}>
                <MediaCard src="img/cmepanel30/cmep30_s4_factura_blanca_mesa.png" kind="photo"
                  w={lerp(520, 600, es(clamp01((g - 1630) / 80)))}
                  h={lerp(312, 360, es(clamp01((g - 1630) / 80)))}
                  x={lerp(-18, 26, es(clamp01((g - 1630) / 40)))}
                  y={lerp(58, 52, es(clamp01((g - 1630) / 70)))}
                  z={0} ry={11} rx={-3} lit={1} litColor={V.amber}
                  label="AL FINAL DEL MES" sheenAt={toCF(1698)} radius={12} />
              </Plane>
            )}

            <Plane z={230}>
              <Cartel g={g} at={1636} out={1736} x={72} y={34} size={52} color={V.white}>
                NO TE FELICITA<br />POR LO QUE <span style={{ color: V.volt }}>PRODUJISTE</span>
              </Cartel>
              {/* el ícono del billete: lo que te cobran, desde ARRIBA y en FRÍO */}
              {g >= 1660 && g < 1760 && (() => {
                const fl = flujo("cobran", clamp01((g - 1660) / 24));
                return (
                  <div style={{
                    transform: `translateY(${(fl.dy * 0.5).toFixed(1)}px)`,
                    opacity: fl.opacity * clamp01(1 - (g - 1746) / 12),
                  }}>
                    <IconPng src="img/cmepanel30/cmep30_ic_billete.png" x={72} y={68} size={124}
                      z={0} opacity={0.92} rot={-6} glow={V.ink0} />
                  </div>
                );
              })()}
            </Plane>

            {/* ── costura INTERNA @1773 · CORTE EN EL BEAT. La BISAGRA es este rótulo: misma x,
                misma y, mismo cuerpo a los dos lados del corte durante 18 frames. ──────────── */}
            <Plane z={250}>
              {g >= 1757 && (
                <Rotulo x={50} y={22} size={56} color={V.white}
                  op={clamp01((g - 1757) / 10)}>
                  LO QUE LE <span style={{ color: V.amber }}>PEDISTE</span>
                </Rotulo>
              )}
            </Plane>

            {/* EL ATERRIZAJE: la tapa del medidor en la sombra de la pared. La cámara CIERRA sobre
                ella y la deriva frena sin detenerse. Materia saliente hacia S5. */}
            {g >= 1776 && (
              <Plane z={160}>
                <MediaCard src="img/cmepanel30/cmep30_s5_medidor_penumbra.png" kind="photo"
                  w={lerp(380, 560, es(clamp01((g - 1776) / 41)))}
                  h={lerp(228, 336, es(clamp01((g - 1776) / 41)))}
                  x={lerp(74, 60, es(clamp01((g - 1776) / 41)))}
                  y={lerp(64, 58, es(clamp01((g - 1776) / 41)))}
                  z={0} ry={-9} rx={2} lit={0.9} litColor={V.sky}
                  label="TU MEDIDOR" sheenAt={toCF(1794)} radius={12} />
                <IconPng src="img/cmepanel30/cmep30_ic_medidor.png" x={26} y={70} size={112} z={0}
                  opacity={0.86 * clamp01((g - 1786) / 12)} rot={4} glow={V.ink0} />
              </Plane>
            )}
          </>
        )}
      </Layers>

      {/* ════ LAS COSTURAS, siempre por encima de todo ════════════════════════════════════════
          A @262 · MATCH-SHAPE  — vive adentro del objeto (el rectángulo que se repinta): no hay
                                  nada que dibujar acá arriba.
          B @717 · MATCH-MOVE   — vive en el riel (`railPct`): tampoco hay overlay.
          C @1172 · WIPE POR MATERIA — las sábanas del vecino cruzan el cuadro.
          D @1580 · OCLUSIÓN    — la hoja de papel tapa el 100 % entre 1578 y 1586. */}
      <Sabanas at={1150} dur={44} />
      <OcluyeHoja at={1566} dur={34} />

      {/* el aire caliente del mediodía, en los dos exteriores duros: el patio nunca está quieto */}
      {(g < 760 || (g >= 1290 && g < 1580)) && (
        <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.5 }}>
          {Array.from({ length: 9 }, (_, i) => {
            const o = rnd(i * 7.9);
            const yy = ((rnd(i * 3.3) * 100 - (g * (0.22 + o * 0.4)) / 8) % 106 + 106) % 106;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(3 + rnd(i * 5.7) * 94).toFixed(1)}%`, top: `${yy.toFixed(1)}%`,
                width: 1.4, height: 30 + o * 74,
                background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.torch, 0.08 + o * 0.08)}, rgba(0,0,0,0))`,
              }} />
            );
          })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
