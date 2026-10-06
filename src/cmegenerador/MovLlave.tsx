// MovLlave.tsx — S9 · LA LLAVE DEL VIDEO: el interruptor de transferencia / la PLACA DE ENCLAVAMIENTO.
// 66 s = 1980 frames @30fps. Arranca en el segundo 1024.0 del video.
//
// LA ESPINA: la batería de 3 kWh y la placa metálica del tablero son la pieza que convierte esto en
// una INSTALACIÓN. Y la idea tiene que quedar FÍSICA, no conceptual: las dos palancas no pueden estar
// arriba al mismo tiempo porque EL METAL NO LO PERMITE. Por eso el acto 4 es un MACRO del tope
// mecánico: la palanca sube, CHOCA contra el labio de la placa, y rebota. Tres veces. Con sonido
// visual (anillo de choque, esquirlas, polvo, patada de cámara, ping de acero).
//
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// (viene de MovEscalones: luz de producto neutra en el garaje · materia = el panel plegable ABIERTO)
//
// | acto | frame | enterFrom (cám · luz · materia)                          | exitTo (cám · luz · materia)                              |
// |------|-------|----------------------------------------------------------|-----------------------------------------------------------|
// | 1    | 0     | cám z=-300 ry 0, plano general del garaje · luz de producto neutra (bone→volt 0.00, keyFrom .46, amber cálido) · el PLANO ABIERTO tumbado (rx 58) = el panel plegable heredado | cám ya viajando a la derecha (nudX→-240, ry +7) · luz volt 0.25 · materia: la TARJETA DE VIDRIO que se puso de pie y ahora sale por izquierda |
// | 2    | 420   | cám panéandose a la derecha (hereda -240 y su inercia) · luz volt 0.25, ámbar todavía cálido · la tarjeta de vidrio entrando por derecha con el generador | cám recentrada (nudX -60), empieza el empuje · luz volt 0.55 · materia: LA BARRA DE ACERO (el asa del generador ya rotada 90° = la palanca) |
// | 3    | 840   | cám recentrada empujando (z rail +90) · luz volt 0.55 · la BARRA vertical, que se abre en la placa del tablero | cám entrando por la RANURA (zoom-through, fx 60 fy 48) · luz volt 0.85 / ámbar→acero · materia: la RANURA de la placa en macro |
// | 4    | 1380  | cám SALIENDO de la ranura, adentro del macro (nudZ +340) · luz volt 0.85, contra ya acero · la RANURA, ahora el labio de la placa a tamaño de puño | cám retrocediendo un paso (nudZ +120) · luz de taller cerrada (keyFrom .22, floor .70) · materia: LA PLACA DE ACERO barriendo la pantalla |
// | 5    | 1800  | cám un paso atrás, tablero al centro · luz de taller cerrada · la placa de acero que acaba de barrer, ahora es la puerta del tablero con el directorio | cám quieta sobre el tablero (nudX -8, z rail 210) · luz de taller cerrada sobre el tablero (keyFrom .20, floor .73, acero) · materia: LA PLACA METÁLICA DEL TABLERO con sus dos palancas |
//
// (va a MovTresDias: luz de taller cerrado sobre el tablero · materia = la palanca del tablero) ✅
//
// ── COSTURAS (una distinta por frontera · ninguna es un fade) ────────────────────────────────
//   1→2  f396 · MATCH-MOVE   — la cámara no corta: sigue su vector a la derecha y el contenido cambia
//                              detrás (la batería sale por izquierda, el generador ya venía entrando).
//   2→3  f826 · MATCH-SHAPE  — la tarjeta del generador se estruja hasta ser una BARRA VERTICAL de
//                              150×400 y la tarjeta del tablero nace EXACTAMENTE en esa barra y se
//                              abre hacia afuera. Misma forma, distinto material. Sin opacidades.
//   3→4  f1362 · ZOOM-THROUGH — la cámara entra por la ranura de la placa (`zoomThrough`) y sale
//                              adentro del macro. El acto 3 ya está a sangre, así que tapa el 100%.
//   4→5  f1786 · OCLUSIÓN     — `SeamOcclude color={V.steel}` (el color de LA MATERIA que cruza, la
//                              chapa; ⛔ nunca el del fondo) barre y del otro lado ya está el tablero.
//
// ── NOTA TÉCNICA QUE COSTÓ ENTENDER (vale para todo el video) ────────────────────────────────
// El build monta CADA ACTO en su propio `<Sequence from={start}>` y le pasa `gFrame = frameGlobal -
// inicioDelMovimiento`. Resultado: `useCurrentFrame()` DENTRO de los helpers del VoltStage (VoltAtmos,
// PadPlane, Readout `at`, SeamOcclude `at`, DutyField…) arranca en 0 en CADA acto → la atmósfera se
// "remontaría", el polvo saltaría y las costuras nunca dispararían en su frame.
// Solución: `<Rebase>` = un `<Sequence from={-(gFrame - useCurrentFrame())} layout="none">` que
// re-basa el reloj interno de esos helpers a gFrame. `layout="none"` no mete DOM, así que la cadena
// `preserve-3d` queda intacta. ⛔ Las MediaCard con `kind="video"` van FUERA del Rebase a propósito:
// ahí sí queremos el reloj LOCAL, para que el clip (153 cuadros = 5,1 s) arranque de cero en cada cue
// y su auto-loop interno (`CLIP_FRAMES`) cuente desde ahí, sin pedir nunca un frame fuera de rango.
// Todo lo que las posiciona, escala e ilumina igual sale de `gFrame`: el movimiento sigue siendo
// continuo, sólo el reloj del decodificador es local.

import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── frames de los actos y de las costuras ───────────────────────────────────────────────────
const A2 = 420, A3 = 840, A4 = 1380, A5 = 1800, END = 1980;
const S12 = 396;    // MATCH-MOVE
const S23 = 826;    // MATCH-SHAPE
const S34 = 1362;   // ZOOM-THROUGH
const S45 = 1786;   // OCLUSIÓN (V.steel)
const IMP = [1452, 1534, 1612];        // los tres golpes contra el tope
const IMP_A = [17, 11.5, 7];           // cada golpe pega menos: el metal gana

// ── helpers puros de gFrame ─────────────────────────────────────────────────────────────────
/** rampa multi-keyframe con easing por tramo. Monótona, nunca reinicia. */
const path = (g: number, ks: number[], vs: number[]): number => {
  if (g <= ks[0]) return vs[0];
  const n = ks.length;
  for (let i = 0; i < n - 1; i++) {
    if (g <= ks[i + 1]) {
      const d = ks[i + 1] - ks[i];
      return eio(vs[i], vs[i + 1], d <= 0 ? 1 : (g - ks[i]) / d);
    }
  }
  return vs[n - 1];
};
const ramp = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
/** ventana con entrada y salida (para tipografía y rótulos). */
const win = (g: number, a: number, b: number, fin = 13, fout = 13) =>
  Math.min(ramp(g, a, a + fin), 1 - ramp(g, b - fout, b));

/** Re-basa el reloj interno de los helpers del Stage a gFrame. Ver nota técnica arriba. */
const Rebase: React.FC<{ shift: number; children: React.ReactNode }> = ({ shift, children }) => (
  <Sequence from={-shift} layout="none">{children}</Sequence>
);

// ── LA PALANCA (capa gráfica de estructura, registrada sobre el material real) ───────────────
const Palanca: React.FC<{
  cx: number; top: number; w: number; h: number; up?: number; hot?: number; tint?: string; opacity?: number;
}> = ({ cx, top, w, h, up = 0, hot = 0, tint = V.volt, opacity = 1 }) => {
  const bolt = Math.max(8, w * 0.3);
  return (
    <div style={{
      position: "absolute", left: cx, top, width: w, height: h, marginLeft: -w / 2,
      transform: `translateY(${(-up).toFixed(2)}px)`, opacity,
      borderRadius: Math.max(4, w * 0.2),
      background: `linear-gradient(96deg, #23261F 0%, ${V.steel} 20%, #F1F3ED 42%, ${V.steel} 64%, #1B1E18 100%)`,
      boxShadow: `0 ${Math.round(h * 0.07)}px ${Math.round(h * 0.14)}px rgba(0,0,0,.78), inset 0 1px 0 rgba(255,255,255,.55), inset 0 -2px 7px rgba(0,0,0,.62)`,
      border: `1px solid ${rgba(V.ink0, 0.85)}`,
    }}>
      {/* la punta que se enciende cuando la palanca está ARRIBA */}
      <div style={{
        position: "absolute", left: "13%", right: "13%", top: "5%", height: "17%",
        borderRadius: Math.max(2, w * 0.06),
        background: rgba(tint, 0.14 + 0.76 * clamp01(hot)),
        boxShadow: hot > 0.03 ? `0 0 ${Math.round(16 + 46 * hot)}px ${rgba(tint, 0.6 * hot)}` : "none",
      }} />
      {/* estrías del mango */}
      <div style={{
        position: "absolute", left: "16%", right: "16%", top: "30%", bottom: "22%", opacity: 0.46,
        backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,.46) 0 2px, rgba(255,255,255,.14) 2px 6px)",
      }} />
      {/* perno del pivote: aterriza la palanca en la chapa */}
      <div style={{
        position: "absolute", left: "50%", bottom: -bolt * 0.42, width: bolt, height: bolt, marginLeft: -bolt / 2,
        borderRadius: "50%",
        background: `radial-gradient(circle at 34% 28%, #F2F4EE, ${V.steel} 46%, #1D201A 100%)`,
        boxShadow: "0 4px 13px rgba(0,0,0,.82)",
      }} />
    </div>
  );
};

// ── LA PLACA DE ENCLAVAMIENTO: un LABIO de acero con una RANURA. Lo único que separa los dos ──
// mundos. La ranura se corre: donde está la ranura, la palanca pasa; donde está la chapa, NO pasa.
const Placa: React.FC<{
  left: number; top: number; w: number; h: number; slotCx: number; slotW: number; opacity?: number; lit?: number;
}> = ({ left, top, w, h, slotCx, slotW, opacity = 1, lit = 1 }) => {
  const face = `linear-gradient(178deg, #C9CDC6 0%, ${V.steel} 26%, #6E7370 62%, #3A3E38 100%)`;
  const seg = (l: number, ww: number, k: number) => (
    <div key={k} style={{
      position: "absolute", left: l, top: 0, width: Math.max(0, ww), height: h,
      background: face,
      boxShadow: `inset 0 2px 0 ${rgba(V.white, 0.5 * lit)}, inset 0 -3px 8px rgba(0,0,0,.6), 0 ${Math.round(h * 0.3)}px ${Math.round(h * 0.5)}px rgba(0,0,0,.66)`,
      borderTop: `1px solid ${rgba(V.white, 0.34 * lit)}`,
    }}>
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.3,
        backgroundImage: "repeating-linear-gradient(97deg, rgba(255,255,255,.34) 0 1px, rgba(0,0,0,0) 1px 5px)",
      }} />
      {/* tornillos de montaje: esto va ATORNILLADO al tablero */}
      {ww > h * 2.2 && [0.16, 0.5, 0.84].map((f, i) => (
        <div key={i} style={{
          position: "absolute", left: `${f * 100}%`, top: "50%", width: h * 0.3, height: h * 0.3,
          marginLeft: -h * 0.15, marginTop: -h * 0.15, borderRadius: "50%",
          background: `radial-gradient(circle at 36% 30%, #EFF1EB, #7C817C 52%, #23261F 100%)`,
          boxShadow: "inset 0 -1px 3px rgba(0,0,0,.7)",
        }} />
      ))}
    </div>
  );
  const sL = slotCx - slotW / 2;
  const sR = slotCx + slotW / 2;
  return (
    <div style={{ position: "absolute", left, top, width: w, height: h, opacity }}>
      {seg(0, sL, 0)}
      {seg(sR, w - sR, 1)}
      {/* los cantos de la ranura: el filo contra el que golpea la palanca */}
      <div style={{
        position: "absolute", left: sL - 3, top: -2, width: 3, height: h + 4,
        background: rgba(V.white, 0.5 * lit), boxShadow: `0 0 10px ${rgba(V.white, 0.3 * lit)}`,
      }} />
      <div style={{
        position: "absolute", left: sR, top: -2, width: 3, height: h + 4,
        background: rgba(V.white, 0.5 * lit), boxShadow: `0 0 10px ${rgba(V.white, 0.3 * lit)}`,
      }} />
    </div>
  );
};

// ── EL TOPE: el sonido visual del golpe (anillo, esquirlas, polvo, núcleo blanco) ────────────
const Tope: React.FC<{ g: number; at: number; x: number; y: number; s?: number }> = ({ g, at, x, y, s = 1 }) => {
  const d = g - at;
  if (d < 0 || d > 26) return null;
  const p = clamp01(d / 20);
  const flash = clamp01(1 - d / 4);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      {/* núcleo blanco de contacto: 4 frames, localizado (⛔ no es un flash de pantalla) */}
      <div style={{
        position: "absolute", left: -70 * s, top: -70 * s, width: 140 * s, height: 140 * s, borderRadius: "50%",
        background: `radial-gradient(circle, ${rgba(V.white, 0.85 * flash)} 0%, ${rgba(V.torch, 0.4 * flash)} 34%, rgba(0,0,0,0) 68%)`,
      }} />
      {/* anillo de choque */}
      <div style={{
        position: "absolute", left: -46 * s, top: -46 * s, width: 92 * s, height: 92 * s, borderRadius: "50%",
        border: `${Math.max(1, 5 * (1 - p))}px solid ${rgba(V.steel, 0.85 * (1 - p))}`,
        transform: `scale(${(0.3 + p * 2.9).toFixed(3)})`,
      }} />
      {/* esquirlas: acero que salta */}
      {Array.from({ length: 11 }, (_, i) => {
        const a = rnd(i * 3.7 + at) * Math.PI * 2;
        const L = (26 + rnd(i * 8.1 + at) * 96) * s * (0.35 + p);
        const w = 2 + rnd(i * 5.5) * 2.4;
        return (
          <div key={i} style={{
            position: "absolute", left: 0, top: 0, width: L, height: w, marginTop: -w / 2,
            transformOrigin: "0% 50%", transform: `rotate(${((a * 180) / Math.PI).toFixed(1)}deg)`,
            background: `linear-gradient(90deg, ${rgba(V.torch, 0.9 * (1 - p))}, rgba(0,0,0,0))`,
            opacity: 1 - p,
          }} />
        );
      })}
      {/* polvo de la pared: el golpe suelta yeso */}
      {Array.from({ length: 6 }, (_, i) => {
        const o = rnd(i * 2.3 + at);
        return (
          <div key={i} style={{
            position: "absolute",
            left: (-60 + o * 120) * s, top: (10 + o * 46) * s + p * 40,
            width: (46 + o * 70) * s, height: (46 + o * 70) * s, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(V.concrete, 0.3 * (1 - p))}, rgba(0,0,0,0) 66%)`,
          }} />
        );
      })}
    </div>
  );
};

// ── LA CORRIENTE: el respaldo alimentando los circuitos por los cables que YA están en la pared ─
const Corriente: React.FC<{ g: number; from: number; x1: number; y1: number; x2: number; y2: number; on: number }> = ({
  g, from, x1, y1, x2, y2, on,
}) => {
  const n = 26;
  const head = ((g - from) / 34) % 1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, opacity: clamp01(on) }}>
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        const px = lerp(x1, x2, t) + Math.sin(t * 3.4) * 26;
        const py = lerp(y1, y2, t) + Math.sin(t * 5.1) * 16;
        const d = Math.abs(((t - head + 1) % 1));
        const hot = clamp01(1 - d / 0.16);
        const sz = 7 + hot * 12;
        return (
          <div key={i} style={{
            position: "absolute", left: px, top: py, width: sz, height: sz, marginLeft: -sz / 2, marginTop: -sz / 2,
            borderRadius: "50%",
            background: rgba(V.volt, 0.22 + 0.75 * hot),
            boxShadow: hot > 0.05 ? `0 0 ${Math.round(10 + 34 * hot)}px ${rgba(V.volt, 0.7 * hot)}` : "none",
          }} />
        );
      })}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════════════════════
export const MovLlave: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const localF = useCurrentFrame();
  const g = Math.max(0, Math.min(END, gFrame));
  const shift = Math.round(gFrame - localF);       // ver NOTA TÉCNICA del encabezado
  const gritSeed = 3.1 + acto * 1.7;               // el grano de primer plano cambia de acto a acto

  // ── LA CÁMARA: UNA sola, función de gFrame, sin reinicios ──────────────────────────────────
  // riel largo (plano general del garaje → primer plano del tablero) + matices por acto encima.
  const rail = gcam(g, { z0: -300, z1: 210, panX: 58, panY: -26, ry: -5.5, rx: 1.2, dur: END });
  let nx = path(g, [0, 340, 470, A3, 1180, A4, 1660, A5, END], [0, 12, -240, -62, -30, 22, 8, 0, -8]);
  let ny = path(g, [0, 340, 470, A3, A4, 1700, A5, END], [0, -4, -12, -30, 38, 16, 8, 0]);
  const nz = path(g, [0, A2, A3, 1290, A4, 1660, A5, END], [0, 20, 62, 150, 340, 250, 120, 46]);
  const nry = path(g, [0, 340, 470, A3, A4, A5, END], [0, 2.2, 7, -1.4, 0.6, -1.8, 0]);
  // patada de cámara en cada tope: la única aceleración brusca del movimiento
  for (let i = 0; i < IMP.length; i++) {
    const d = g - IMP[i];
    if (d >= 0 && d < 42) {
      const dec = Math.exp(-d / 7);
      nx += Math.sin(d / 1.35) * IMP_A[i] * dec;
      ny += Math.cos(d / 1.1) * IMP_A[i] * 0.62 * dec;
    }
  }
  const cam = `${rail.transform} translate3d(${nx.toFixed(2)}px, ${ny.toFixed(2)}px, ${nz.toFixed(1)}px) rotateY(${nry.toFixed(2)}deg)`;

  // ── LA LUZ: evoluciona de "producto neutro en el garaje" a "taller cerrado sobre el tablero" ─
  const keyFrom = path(g, [0, A2, A3, A4, END], [0.46, 0.42, 0.33, 0.24, 0.20]);
  const inten = path(g, [0, A3, A4, END], [1.0, 0.94, 0.86, 0.82]);
  const floorV = path(g, [0, A3, A4, END], [0.52, 0.6, 0.68, 0.73]);
  const tKey = path(g, [0, A2, 900, END], [0, 0.25, 0.8, 1]);
  const tWarm = path(g, [0, A3, 1500, END], [0, 0.2, 0.8, 1]);
  const keyCol = light(tKey, "bone", "volt");            // la MEDICIÓN se va imponiendo
  const warmCol = light(tWarm, "amber", "steel");        // la casa cálida cede al acero del taller

  // ── ZOOM-THROUGH de la frontera 3→4 (entra por la ranura de la placa) ──────────────────────
  const zt = zoomThrough(g, S34, 18, 60, 48);

  // ── ACTO 1 · la batería: el plano tumbado se PONE DE PIE ───────────────────────────────────
  const h1w = path(g, [0, 34, 140, 340, S12, 456], [900, 900, 560, 604, 604, 520]);
  const h1h = path(g, [0, 34, 140, 340], [300, 306, 620, 640]);
  const h1x = path(g, [0, 340, S12, 456], [50, 46, 44, -22]);
  const h1y = path(g, [0, 34, 140], [62, 62, 50]);
  const h1rx = path(g, [0, 34, 140], [58, 56, 0]);

  // ── ACTO 2 · el generador chico · y el ASA que se vuelve PALANCA (MATCH-SHAPE) ─────────────
  const h2w = path(g, [372, 490, 770, S23], [620, 620, 686, 150]);
  const h2h = path(g, [372, 490, 770, S23], [360, 360, 372, 400]);
  const h2z = path(g, [372, 490, S23], [-60, 18, 44]);
  const h2x = path(g, [372, 490, 770, S23], [132, 50, 50, 44]);
  const h2y = path(g, [372, 490, S23], [52, 54, 48]);

  // ── ACTO 3 · el tablero: la barra se ABRE en la placa · geometría compartida con el rig ────
  const p3w = path(g, [S23, 900, 1290, 1336], [150, 920, 1000, 1980]);
  const p3h = path(g, [S23, 900, 1290, 1336], [400, 560, 600, 1180]);
  const p3z = path(g, [S23, 900, 1336], [46, 70, 190]);
  const p3x = path(g, [S23, 900, 1336], [44, 48, 50]);
  const p3y = path(g, [S23, 900, 1336], [48, 50, 50]);
  const rigOn = ramp(g, 900, 960);
  const slot3 = path(g, [1000, 1218, 1258], [-0.22, -0.22, 0.12]) * p3w;
  const upA3 = path(g, [1055, 1092, 1186, 1214], [0, 1, 1, 0]);
  const upB3 = path(g, [1262, 1300], [0, 1]) + (g >= 1140 && g < 1178 ? path(g, [1140, 1152, 1166, 1178], [0, 0.13, 0.13, 0]) : 0);

  // ── ACTO 4 · EL MACRO DEL TOPE: la palanca choca contra el labio de la placa ───────────────
  // labio de acero 414..458 · palanca en reposo top 482 · libre sube 140 · bloqueada sólo 24
  // (coordenadas de MUNDO: la cámara del acto 4 las magnifica ~1,5x, por eso el rig está tan arriba).
  const UP_FREE = 140, UP_BLOCK = 24;
  let upResp = 0;
  for (let i = 0; i < IMP.length; i++) {
    const f = IMP[i];
    if (g >= f - 17 && g < f) upResp = eio(0, UP_BLOCK, (g - (f - 17)) / 17);
    else if (g >= f && g < f + 30) {
      const d = g - f;
      upResp = UP_BLOCK - eio(0, UP_BLOCK, clamp01(d / 24)) + Math.sin(d / 1.25) * 5.5 * Math.exp(-d / 5);
    }
  }
  const upRedFree = path(g, [1380, 1648, 1666], [UP_FREE, UP_FREE, 0]);
  const slot4 = path(g, [1666, 1700], [700, 1101]);
  const upRespFree = path(g, [1700, 1734], [0, UP_FREE]);
  const upResp4 = Math.max(upResp, upRespFree);
  const corrOn = ramp(g, 1734, 1758) * (1 - ramp(g, S45, S45 + 8));

  // ── ACTO 5 · los circuitos y el handoff a MovTresDias ──────────────────────────────────────
  const h5w = path(g, [1793, 1852, 1900, 1952], [820, 1060, 1060, 470]);
  const h5h = path(g, [1793, 1852, 1900, 1952], [470, 610, 610, 280]);
  const h5x = path(g, [1793, 1852, 1900, 1952], [50, 46, 46, 80]);
  const plw = path(g, [1912, END], [120, 780]);
  const plh = path(g, [1912, END], [76, 470]);

  // ── tipografía (HUD, fuera de la cámara: la safe area de 60 px no se negocia) ──────────────
  const t1 = win(g, 96, 402);
  const t2 = win(g, 452, 800);
  const t3 = win(g, 880, 1300);
  const t4 = win(g, 1400, 1712);
  const t5 = win(g, 1812, 1948);
  const hudY = Math.sin(g / 71) * 3.4;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta (Rebase = reloj continuo) ───── */}
      <Rebase shift={shift}>
        <VoltAtmos tint={keyCol} tint2={warmCol} keyFrom={keyFrom} intensity={inten} floor={floorV} />
      </Rebase>

      <Layers cam={cam}>
        {/* PLANO 1 — la pared del garaje, lejísimos */}
        <Plane z={-680} style={{ transform: `translateZ(-680px) translate3d(${(nx * -0.16).toFixed(1)}px, 0px, 0px)` }}>
          <Rebase shift={shift}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_llav1.jpg" kind="photo" z={0} scale={1.52}
              dim={path(g, [0, A3, END], [0.6, 0.7, 0.78])} tint={keyCol} />
          </Rebase>
        </Plane>

        {/* PLANO 2 — el haz de la lámpara de trabajo + el listado de vigas: profundidad de taller */}
        <Plane z={-430} style={{ transform: `translateZ(-430px) translate3d(${(nx * -0.06).toFixed(1)}px, ${(ny * -0.1).toFixed(1)}px, 0px)` }}>
          <div style={{
            position: "absolute", left: `${(10 + keyFrom * 58).toFixed(1)}%`, top: "-24%", width: 760, height: 1500,
            marginLeft: -380, transform: "rotate(11deg)",
            background: `linear-gradient(180deg, ${rgba(keyCol, 0.13 * inten)} 0%, rgba(0,0,0,0) 62%)`,
          }} />
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={{
              position: "absolute", left: `${6 + i * 14.5}%`, top: "6%", width: 12, height: "56%",
              background: `linear-gradient(180deg, ${rgba(V.ink2, 0.85)}, ${rgba(V.ink0, 0.2)})`,
              opacity: 0.55,
            }} />
          ))}
        </Plane>

        {/* PLANO 3 — el banco de trabajo: TODO lo que flota aterriza acá */}
        <Plane z={-250} style={{ transform: `translateZ(-250px) translate3d(0px, ${(ny * 0.24).toFixed(1)}px, 0px)` }}>
          <Rebase shift={shift}>
            <PadPlane y={path(g, [0, A3, END], [78, 84, 92])} w={1420} h={320} rx={64}
              lit={path(g, [0, A3, A4, END], [1, 0.86, 0.6, 0.5])} z={0} />
            <DutyField duty={8 / 30} cells={30} tint={keyCol} y={87} w={1080} h={22} cycle={150}
              on={win(g, 206, 404, 30, 40) * 0.7} />
          </Rebase>
        </Plane>

        {/* ═══ ACTOS 1-2-3: viven dentro del zoom-through (el acto 3 se los lleva por la ranura) */}
        <div style={{
          position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
          transform: zt.out === "none" ? undefined : zt.out,
          opacity: zt.opacity, transformStyle: "preserve-3d",
        }}>
          {/* PLANO 4 — material secundario (fotos, dentro del Rebase) */}
          <Plane z={-60} style={{ transform: `translateZ(-60px) translate3d(${(nx * 0.1).toFixed(1)}px, 0px, 0px)` }}>
            <Rebase shift={shift}>
              {g >= 186 && g < 396 && (
                <MediaCard src="img/cmegenerador/cmeg_mv_llav1.jpg" kind="photo" w={306} h={196}
                  x={79} y={29} z={40} ry={-13} lit={0.86} litColor={keyCol} sheenAt={200}
                  label="ESTADO DE CARGA" opacity={win(g, 186, 396, 14, 16)} />
              )}
              {g >= 470 && g < 712 && (
                <MediaCard src="img/cmegenerador/cmeg_mv_llav3.jpg" kind="photo" w={334} h={214}
                  x={79} y={28} z={54} ry={-14} lit={0.9} litColor={warmCol} sheenAt={484}
                  label="ENCLAVAMIENTO" opacity={win(g, 470, 712, 14, 16)} />
              )}
              {g >= 1100 && g < 1296 && (
                <MediaCard src="img/cmegenerador/cmeg_mv_llav4.jpg" kind="photo" w={330} h={248}
                  x={80} y={74} z={70} ry={-16} rx={3} lit={0.92} litColor={keyCol} sheenAt={1114}
                  label="SOBRE TU TABLERO" opacity={win(g, 1100, 1296, 14, 16)} />
              )}
            </Rebase>
          </Plane>

          {/* PLANO 5 — LOS PROTAGONISTAS (clips reales, FUERA del Rebase a propósito) */}
          <Plane z={20}>
            {/* ACTO 1 · la batería: el plano tumbado del panel plegable se pone de pie */}
            {g < 456 && (
              <MediaCard src="broll/cmegenerador/cmeg_mv_llav1.mp4" kind="video"
                w={h1w} h={h1h} x={h1x} y={h1y} z={path(g, [0, 140], [-40, 30])} rx={h1rx}
                ry={path(g, [0, 140, S12], [0, -4, -13])}
                lit={path(g, [0, 34, 150], [0.55, 0.62, 1])} litColor={keyCol} radius={16} />
            )}
            {/* ACTO 2 · el generador chico entrando por derecha, ya en camino antes del corte */}
            {g >= 372 && g < 848 && (
              <MediaCard src="broll/cmegenerador/cmeg_mv_llav2.mp4" kind="video"
                w={h2w} h={h2h} x={h2x} y={h2y} z={h2z}
                ry={path(g, [372, 490, S23], [16, -2, 0])}
                lit={path(g, [372, 470, 780], [0.42, 1, 0.92])} litColor={warmCol} radius={16} />
            )}
            {/* ACTO 3 · el tablero: NACE en la barra de 150×400 y se abre hacia afuera */}
            {g >= 820 && g < 1400 && (
              <MediaCard src="broll/cmegenerador/cmeg_mv_llav3.mp4" kind="video"
                w={p3w} h={p3h} x={p3x} y={p3y} z={p3z}
                ry={path(g, [S23, 900, 1290], [0, -3, 0])}
                lit={path(g, [820, 900], [0.7, 1])} litColor={keyCol}
                radius={path(g, [1290, 1336], [16, 0])} />
            )}

            {/* EL ASA QUE SE VUELVE PALANCA — la materia que cruza la frontera 2→3 */}
            {g >= 690 && g < 906 && (() => {
              // MISMA barra, dos vidas: acostada y estirada = EL ASA del generador · de pie y gruesa
              // = LA PALANCA del tablero. Rota 90° sobre su propio eje entre 770 y 826.
              const rot = path(g, [690, 770, S23], [-90, -90, 0]);
              const sxx = path(g, [690, 770, S23], [0.55, 0.55, 1]);     // grosor
              const syy = path(g, [690, 770, S23], [1.9, 1.9, 1]);       // largo
              const bx = path(g, [690, 770, S23, 906], [50, 50, 44, 41.6]) / 100 * 1920;
              const by = path(g, [690, 770, S23, 906], [37, 37, 45, 47]) / 100 * 1080;
              return (
                <div style={{
                  position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                  transform: `translateZ(${h2z.toFixed(1)}px)`, transformStyle: "preserve-3d",
                }}>
                  <div style={{
                    position: "absolute", left: bx, top: by, width: 0, height: 0,
                    transform: `rotate(${rot.toFixed(1)}deg) scale(${sxx.toFixed(3)}, ${syy.toFixed(3)})`,
                    transformOrigin: "50% 50%",
                  }}>
                    <Palanca cx={0} top={-107} w={104} h={214} up={0}
                      hot={path(g, [770, S23], [0.08, 0.55])} tint={keyCol}
                      opacity={win(g, 690, 906, 18, 22)} />
                  </div>
                </div>
              );
            })()}

            {/* EL RIG DEL TABLERO (acto 3): dos palancas + la placa con su ranura, registrados
                sobre el material real y escalando CON la tarjeta */}
            {g >= 900 && g < 1400 && rigOn > 0 && (
              <div style={{
                position: "absolute", left: `${p3x}%`, top: `${p3y}%`, width: p3w, height: p3h,
                marginLeft: -p3w / 2, marginTop: -p3h / 2, opacity: rigOn,
                transform: `translateZ(${p3z.toFixed(1)}px)`, transformStyle: "preserve-3d",
              }}>
                <Palanca cx={p3w * 0.28} top={p3h * 0.44} w={p3w * 0.085} h={p3h * 0.3}
                  up={upA3 * p3h * 0.19} hot={upA3} tint={warmCol} />
                <Palanca cx={p3w * 0.62} top={p3h * 0.44} w={p3w * 0.085} h={p3h * 0.3}
                  up={upB3 * p3h * 0.19} hot={clamp01(upB3 - 0.2)} tint={keyCol} />
                <Placa left={p3w * 0.16} top={p3h * 0.33 - (1 - ramp(g, 1000, 1044)) * p3h * 0.55}
                  w={p3w * 0.68} h={p3h * 0.085}
                  slotCx={p3w * 0.34 + slot3} slotW={p3w * 0.135}
                  opacity={ramp(g, 1000, 1030)} lit={1} />
                {/* el intento bloqueado del acto 3: un aviso chico de lo que viene */}
                <Tope g={g} at={1152} x={p3w * 0.62} y={p3h * 0.415} s={p3w / 1400} />
              </div>
            )}
          </Plane>
        </div>

        {/* ═══ ACTO 4 — EL MACRO DEL TOPE. Vive DETRÁS del zoom-through y aparece cuando el
             acto 3 ya está a sangre tapando el 100%: por eso no hay ni un frame de fundido. */}
        {g >= 1344 && g < 1793 && (
          <Plane z={0}>
            <MediaCard src="broll/cmegenerador/cmeg_mv_llav4.mp4" kind="video"
              w={1560} h={880} x={50} y={49} z={-150}
              lit={path(g, [1344, 1420], [0.5, 0.78])} litColor={keyCol} radius={0} />
            {/* el labio de la placa, a tamaño de puño: LO QUE NO DEJA PASAR */}
            <Placa left={240} top={414} w={1440} h={44} slotCx={slot4 - 240} slotW={210} lit={1.05} />
            <Palanca cx={700} top={482} w={132} h={210} up={upRedFree} hot={clamp01(upRedFree / UP_FREE)} tint={warmCol} />
            <Palanca cx={1101} top={482} w={132} h={210} up={upResp4} hot={clamp01((upResp4 - 60) / 80)} tint={keyCol} />
            {/* rótulos de estructura, ≥30 px */}
            <div style={{ position: "absolute", left: 550, top: 250, width: 300, textAlign: "center" }}>
              <Body size={32} color={rgba(V.white, 0.88)}>RED</Body>
            </div>
            <div style={{ position: "absolute", left: 926, top: 250, width: 350, textAlign: "center" }}>
              <Body size={32} color={rgba(V.white, 0.88)}>RESPALDO</Body>
            </div>
            {IMP.map((f, i) => (
              <Tope key={i} g={g} at={f} x={1101} y={458} s={1.05 - i * 0.14} />
            ))}
            <Corriente g={g} from={1734} x1={1101} y1={342} x2={1780} y2={780} on={corrOn} />
          </Plane>
        )}

        {/* ═══ ACTO 5 — los circuitos que TÚ elijas · y el tablero queda en el centro */}
        {g >= 1793 && (
          <Plane z={10}>
            <MediaCard src="broll/cmegenerador/cmeg_mv_llav5.mp4" kind="video"
              w={h5w} h={h5h} x={h5x} y={48} z={path(g, [1793, 1900, END], [-40, 30, 120])}
              ry={path(g, [1793, 1900, END], [10, 0, -9])}
              lit={path(g, [1793, 1850], [0.55, 1])} litColor={keyCol} radius={14} />
            <Rebase shift={shift}>
              {/* los cuatro circuitos encendiéndose, uno por uno */}
              {/* ⛔ cada ruta escrita como literal en su propia etiqueta: el empaquetador del farm
                  sólo ve las que están así (nada de arrays ni de template literals). */}
              <IconPng src="img/cmegenerador/cmeg_ic_congelador.png" x={20} y={25} size={88} z={30}
                opacity={win(g, 1808, 1946, 12, 16)} glow={V.ink0} />
              <IconPng src="img/cmegenerador/cmeg_ic_foco.png" x={20} y={41.5} size={88} z={30}
                opacity={win(g, 1823, 1946, 12, 16)} glow={V.ink0} />
              <IconPng src="img/cmegenerador/cmeg_ic_calentador.png" x={20} y={58} size={88} z={30}
                opacity={win(g, 1838, 1946, 12, 16)} glow={V.ink0} />
              <IconPng src="img/cmegenerador/cmeg_ic_enchufe.png" x={20} y={74.5} size={88} z={30}
                opacity={win(g, 1853, 1946, 12, 16)} glow={V.ink0} />
              {/* la lámina REAL de la guía: el material del CTA, dentro de su marco */}
              {g >= 1852 && g < 1948 && (
                <MediaCard src="img/cmegenerador/cmeg_lam_equipoC.jpg" kind="photo"
                  w={340} h={470} x={path(g, [1852, 1898], [86, 72])} y={45} z={40}
                  ry={-13} lit={1} litColor={warmCol} sheenAt={1876}
                  label="EQUIPO C" opacity={win(g, 1852, 1948, 16, 18)} />
              )}
              {/* HANDOFF: la PLACA METÁLICA vuelve al centro (materia de salida de este movimiento) */}
              {g >= 1912 && (
                <MediaCard src="img/cmegenerador/cmeg_mv_llav3.jpg" kind="photo"
                  w={plw} h={plh} x={50} y={50} z={0} lit={1} litColor={keyCol} radius={14} />
              )}
            </Rebase>
            {/* las dos palancas del tablero, servidas al movimiento que sigue */}
            {g >= 1930 && (
              <div style={{
                position: "absolute", left: "50%", top: "50%", width: plw, height: plh,
                marginLeft: -plw / 2, marginTop: -plh / 2, opacity: ramp(g, 1930, 1950),
              }}>
                <Palanca cx={plw * 0.31} top={plh * 0.36} w={plw * 0.085} h={plh * 0.31} up={0} hot={0.1} tint={warmCol} />
                <Palanca cx={plw * 0.63} top={plh * 0.36} w={plw * 0.085} h={plh * 0.31}
                  up={plh * 0.19} hot={0.95} tint={keyCol} />
                <Placa left={plw * 0.18} top={plh * 0.3} w={plw * 0.68} h={plh * 0.085}
                  slotCx={plw * 0.45} slotW={plw * 0.135} lit={1} />
              </div>
            )}
          </Plane>
        )}

        {/* PLANO 6 — primer plano fuera de foco: limaduras y polvo del taller */}
        <Plane z={400} style={{ transform: `translateZ(400px) translate3d(${(nx * 0.5).toFixed(1)}px, ${(ny * 0.4).toFixed(1)}px, 0px)` }}>
          {Array.from({ length: 16 }, (_, i) => {
            const o = rnd(i * gritSeed);
            const yy = (o * 130 + g * (0.05 + o * 0.1)) % 130;
            const sz = 3 + o * 8;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 7.7 + gritSeed) * 106 - 3).toFixed(2)}%`,
                top: `${(yy - 12).toFixed(2)}%`, width: sz, height: sz, borderRadius: "50%",
                background: rgba(i % 3 === 0 ? keyCol : V.steel, 0.1 + o * 0.2),
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── HUD: tipografía y cifras. Fuera de la cámara para blindar la safe area de 60 px. ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Rebase shift={shift}>
          {g >= 160 && g < 400 && (
            <div style={{ opacity: win(g, 160, 400, 12, 18) }}>
              <Readout value="3,0" unit="kWh" label="CAPACIDAD ÚTIL" at={168} x={24} y={30} size={124} color={keyCol} />
            </div>
          )}
          {g >= 446 && g < 700 && (
            <div style={{ opacity: win(g, 446, 700, 12, 18) }}>
              <Readout value="20" unit="kg" label="LO CARGAS SOLO" at={452} x={24} y={30} size={124} color={keyCol} />
            </div>
          )}
          {g >= 726 && g < 828 && (
            <div style={{ opacity: win(g, 726, 828, 12, 16) }}>
              <Readout value="300—450" unit="USD" label="CON ELECTRICISTA INCLUIDO" at={733} x={28} y={30} size={96} color={V.amber} />
            </div>
          )}
          {/* ping de acero en cada tope: 5 frames, no es un fundido */}
          {IMP.map((f, i) => (<SeamFlash key={i} at={f} color={V.steel} dur={5 - i} />))}
        </Rebase>

        {/* los titulares: 1 idea por acto, ≤7 palabras, cama oscura obligatoria */}
        {t1 > 0 && (
          <Titular kick="LO QUE YA TIENES" head="TRES KILOVATIOS HORA" o={t1} size={72} dy={hudY} col={keyCol} />
        )}
        {t2 > 0 && (
          <Titular kick="SE MUEVE SOLO" head="VEINTE KILOS" o={t2} size={76} dy={hudY} col={warmCol} />
        )}
        {t3 > 0 && (
          <Titular kick="LA PIEZA QUE FALTABA" head="LAS DOS NO PUEDEN A LA VEZ" o={t3} size={64} dy={hudY} col={keyCol} />
        )}
        {t4 > 0 && (
          <Titular kick="EL TOPE" head="PORQUE EL METAL NO LO PERMITE" o={t4} size={62} dy={hudY} col={V.steel} />
        )}
        {t5 > 0 && (
          <Titular kick="POR LOS CABLES DE LA PARED" head="LOS CIRCUITOS QUE TÚ ELIJAS" o={t5} size={60} dy={hudY} col={keyCol} />
        )}
      </AbsoluteFill>

      {/* ── LA COSTURA 4→5: OCLUSIÓN con el color de LA MATERIA que cruza (la chapa) ───────── */}
      <Rebase shift={shift}>
        <SeamOcclude at={S45} dur={14} color={V.steel} angle={7} />
      </Rebase>
    </AbsoluteFill>
  );
};

// ── el bloque de titular: cama oscura + kicker + head, anclado abajo-izquierda ───────────────
const Titular: React.FC<{ kick: string; head: string; o: number; size: number; dy: number; col: string }> = ({
  kick, head, o, size, dy, col,
}) => (
  <div style={{
    position: "absolute", left: "9%", bottom: "12%", maxWidth: 880,
    opacity: o, transform: `translateY(${((1 - o) * 26 + dy).toFixed(1)}px)`,
  }}>
    <Bed pad={26}>
      <div style={{ marginBottom: 10 }}><Kick color={col}>{kick}</Kick></div>
      <Head size={size}>{head}</Head>
    </Bed>
  </div>
);
