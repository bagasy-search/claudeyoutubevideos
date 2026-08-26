// MovClose.tsx — MOVIMIENTO DE CIERRE del video `mdmold` (canal Mike Dalton, EN).
// 1530 frames @ 30fps = 51s. UN SOLO MOVIMIENTO CONTINUO en 5 actos que se FUNDEN.
//
// LA IDEA: el error nunca fue el producto, fue la VARA DE MEDICIÓN. Estabas midiendo COLOR —
// "limpio" quería decir "blanco". El día que medís MUERTO en vez de BLANCO, se acabó el problema.
// Después: la hoja imprimible (⛔ sin precio, sin link, sin QR), el plan de una sola cosa para
// esta noche, y el remate que cierra el arco del video.
//
// HILO CONDUCTOR (materia que cruza TODAS las fronteras): LA HOJA.
//   mancha blanqueada → superficie pintada → chapa de pintura → la vara de medir →
//   la regla roja → la hoja impresa → la hoja pegada con cinta en la puerta del mueble →
//   la fila del inodoro → el riel de la lista → la junta del rincón de la ducha.
//
// ════════════════════════════════════════════════════════════════════════════════════════════
//  TABLA DE HANDOFF  (nada se reinicia: cámara, luz y atmósfera son funciones del frame GLOBAL)
// ════════════════════════════════════════════════════════════════════════════════════════════
//
//  ACTO 1 · LA VARA EQUIVOCADA · frames 0–292
//    enterFrom  cam { z≈-96, plano de azulejos en rotateX 64°, deriva viva desde el frame 0 }
//               luz { FRÍO LAVADO — MD.cold, intensity 1.34, key a la izquierda (0.20), velo
//                     blanco encima: el "blanco falso" }
//               materia { la junta con el moho latiendo debajo }
//    exitTo     cam { z→+58, el plano rota a 88° y COLAPSA en una línea = el horizonte del acto 2 }
//               luz { intensity 1.34→1.10, el velo blanco se apaga: la pintura deja de mentir }
//               materia { las 4 chapas de pintura se FUNDEN en UNA sola chapa blanca (la LOSA) }
//    ── FRONTERA @292 · MATCH-SHAPE ──────────────────────────────────────────────────────────
//       El MISMO nodo DOM (la LOSA blanca, con su estampa "PAINT.") gira de acostada (rotateX 62°)
//       a de frente (0°) y se angosta hasta ser la BARRA de la vara de medir. Se elige match-shape
//       porque el corte conceptual (la pintura ES la vara equivocada) tiene que verse literal:
//       el objeto que te vendían se convierte en el instrumento con el que medías mal.
//
//  ACTO 2 · EL CAMBIO DE VARA · frames 292–500
//    enterFrom  cam { z≈+58, horizonte bajo heredado del plano colapsado }
//               luz { fría todavía, key viajando 0.20→0.34, intensity 1.10 }
//               materia { la LOSA convertida en barra WHITE + el horizonte }
//    exitTo     cam { z→+14 (la cámara se abre para el papel) }
//               luz { primer viraje tibio (t≈0.16), key 0.38 }
//               materia { la REGLA ROJA se despega de la barra DEAD y sale volando hacia arriba }
//    ── FRONTERA @500 · OCLUSIÓN (<Occluder/>) ───────────────────────────────────────────────
//       La regla roja crece hasta ser una banda que tapa el 100% del cuadro 14 frames; detrás ya
//       está la hoja, y la banda aterriza como el filete rojo del encabezado. Se elige oclusión
//       porque es el único cambio de MATERIAL duro del movimiento (metal/luz → papel): hay que
//       tapar para no delatar la costura.
//
//  ACTO 3 · LA GUÍA · frames 500–1012   (sub-beats 921 y 943)
//    enterFrom  cam { z≈+14, la hoja llega ya en vuelo desde detrás de la banda }
//               luz { tibia baja (t 0.16→0.55), intensity 0.98 — el papel es la zona clara }
//               materia { el filete rojo del encabezado }
//    ── SUB-FRONTERA @921 · CORTE EN EL BEAT ("Print it.") ───────────────────────────────────
//       1 frame: la hoja SALTA de pose (rotateY -6°→+12°, escala 1.00→1.16) con destello especular
//       de 3 frames y sombra de contacto nueva. Sin interpolar: es el golpe de la frase.
//    ── SUB-FRONTERA @943 · MATCH-MOVE ("Tape it inside the cabinet door") ───────────────────
//       La hoja CONSERVA la velocidad del corte (arranque rápido, Easing.out(cubic)) y la puerta
//       del mueble entra girando hasta ACOPLAR su rotateY con el de la hoja: quedan coplanares y
//       la cinta las cose. Ninguna de las dos frena: por eso match-move y no otra costura.
//    exitTo     cam { z→0 }
//               luz { ÁMBAR de pasillo entrando por abajo-derecha, key 0.62, intensity 0.86 }
//               materia { la FILA "TOILET · under the rim · OVERNIGHT" se despega de la hoja }
//    ── FRONTERA @1012 · WIPE POR MATERIA (<VaporWipe/>) ─────────────────────────────────────
//       El vapor del baño cruza y detrás ya está la lista viva. Se elige wipe por materia porque
//       el salto es de LUGAR (debajo de la pileta → el plan de esta noche) sin cambiar de objeto:
//       la fila del inodoro entra al vapor y sale siendo el encabezado de la lista.
//
//  ACTO 4 · EL PLAN DE ESTA NOCHE · frames 1012–1302
//    enterFrom  cam { z≈0, la fila del inodoro viajando hacia el encabezado }
//               luz { ámbar bajo, key 0.62, intensity 0.86 }
//               materia { la fila TOILET → título "DO THE TOILET" }
//    exitTo     cam { z→+118 y el riel se centra en x=960 }
//               luz { key 0.72, el riel se apaga a brasa }
//               materia { el RIEL vertical de la lista, que ya está alineado con la junta }
//    ── FRONTERA @1302 · ZOOM-THROUGH ────────────────────────────────────────────────────────
//       La cámara ATRAVIESA el riel (el grupo del acto 4 sale a translateZ +900 mientras el rincón
//       entra desde -760) y el riel se convierte en la JUNTA vertical del rincón. Se elige
//       zoom-through porque el cierre tiene que volver AL LUGAR del principio: atravesamos, no
//       cortamos.
//
//  ACTO 5 · EL REMATE · frames 1302–1530
//    enterFrom  cam { z desde -760 asentando a 0 hasta 1358, sin frenar de golpe }
//               luz { ámbar cálido bajo (t→1), key 0.78, intensity 0.86→0.96 }
//               materia { la junta vertical = el riel del acto 4 }
//    exitTo     último frame ENCENDIDO: rincón ámbar, junta limpia color hueso, remate en pantalla.
//
// ⛔ Sin Math.random / Date · sin backdrop-filter · sin blur grande a pantalla completa ·
// ⛔ sin fades globales · sin precio/link/QR · sin Easing.quint (no existe) · imports sólo de
//    remotion / react / ./Stage.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  MD,
  F_SANS,
  F_SERIF,
  rgba,
  lerp,
  clamp01,
  rnd,
  cam,
  light,
  Atmos,
  glassStyle,
  Sheen,
  Occluder,
  VaporWipe,
  Kicker,
  Title,
  Em,
  TextBed,
} from "./Stage";

/* ── utilidades locales ─────────────────────────────────────────────────────────────────── */
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ID = (x: number) => x;
const ip = (f: number, inR: number[], outR: number[], e: (x: number) => number = ID) =>
  interpolate(f, inR, outR, { ...CL, easing: e });

const E_SOFT = Easing.bezier(0.22, 0.61, 0.28, 1);
const E_SNAP = Easing.bezier(0.62, 0.02, 0.12, 1);
const E_OVER = Easing.bezier(0.2, 1.42, 0.32, 1); // overshoot sin Easing.back
const E_OUT = Easing.out(Easing.cubic);
const E_IN = Easing.in(Easing.cubic);
const E_LONG = Easing.bezier(0.16, 0.84, 0.24, 1);

// tintas de IMPRENTA (el papel es zona clara: acá el texto va OSCURO)
const INK_P = "#191A1D";
const INK_P2 = "#4A4C52";
const RED_P = "#B02A21";
const PAPER0 = "#F7F3EA";
const PAPER1 = "#E4DCCB";

/* Palabra por palabra: cada palabra entra sola (⛔ nunca un opacity global). */
const Words: React.FC<{
  f: number;
  at: number;
  text: string;
  size: number;
  color?: string;
  step?: number;
  weight?: number;
  serifOn?: string[];
  accent?: string;
  shadow?: string;
}> = ({ f, at, text, size, color = MD.white, step = 3.4, weight = 800, serifOn = [], accent = MD.redHot, shadow }) => (
  <div style={{ fontFamily: F_SANS, fontWeight: weight, fontSize: size, lineHeight: 1.05, color }}>
    {text.split(" ").map((w, i) => {
      const a = at + i * step;
      const o = ip(f, [a, a + 8], [0, 1], E_OUT);
      const dy = ip(f, [a, a + 11], [size * 0.24, 0], E_OUT);
      const bl = ip(f, [a, a + 9], [0.55, 0], E_OUT);
      const isSerif = serifOn.indexOf(w.replace(/[.,]/g, "")) >= 0;
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: size * 0.24,
            opacity: o,
            transform: `translateY(${dy.toFixed(2)}px) scaleY(${(1 + bl * 0.1).toFixed(3)})`,
            fontFamily: isSerif ? F_SERIF : F_SANS,
            fontStyle: isSerif ? "italic" : "normal",
            fontWeight: isSerif ? 500 : weight,
            color: isSerif ? accent : color,
            textShadow: shadow ?? "0 6px 30px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.85)",
          }}
        >
          {w}
        </span>
      );
    })}
  </div>
);

/* Sombra de contacto que ATERRIZA (elipse por gradiente — nada de filter:blur). */
const Contact: React.FC<{ w: number; h: number; y: number; o: number; x?: number }> = ({ w, h, y, o, x = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: y,
      width: w,
      height: h,
      transform: `translate(-50%,-50%) translateX(${x}px)`,
      background: `radial-gradient(closest-side, rgba(0,0,0,${(0.72 * o).toFixed(3)}) 0%, rgba(0,0,0,${(0.3 * o).toFixed(
        3,
      )}) 48%, rgba(0,0,0,0) 78%)`,
      pointerEvents: "none",
    }}
  />
);

/* Motas de polvo — 5º plano, parallax propio, siempre vivas. */
const Motes: React.FC<{ f: number; n?: number; tint: string; op?: number }> = ({ f, n = 26, tint, op = 1 }) => (
  <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(i * 1.7);
      const b = rnd(i * 5.1 + 2);
      const c = rnd(i * 9.3 + 4);
      const z = lerp(-160, 190, c);
      const sp = lerp(0.14, 0.5, b);
      const x = (a * 118 - 9 + Math.sin(f / (52 + b * 40) + i) * 2.6) % 118;
      const y = (b * 108 - 4 + ((f * sp) / 26) * 3.1) % 112;
      const s = lerp(1.6, 4.4, a) * (1 + c * 0.5);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${100 - y}%`,
            width: s,
            height: s,
            borderRadius: "50%",
            background: rgba(tint, 0.5),
            boxShadow: `0 0 ${6 + c * 10}px ${rgba(tint, 0.34)}`,
            opacity: (0.16 + a * 0.4) * op,
            transform: `translateZ(${z.toFixed(1)}px)`,
          }}
        />
      );
    })}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 1 — LA VARA EQUIVOCADA. El plano de azulejos: se vuelve blanco… y el negro sigue latiendo.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
const MOLDS = Array.from({ length: 11 }, (_, i) => ({
  x: 8 + rnd(i * 3.1) * 84,
  y: 12 + rnd(i * 7.7 + 1) * 74,
  w: 90 + rnd(i * 2.3 + 5) * 210,
  h: 40 + rnd(i * 4.9 + 9) * 120,
  ph: rnd(i * 11.3) * 6.28,
  sp: 26 + rnd(i * 13.1) * 30,
}));

const TilePlane: React.FC<{ f: number }> = ({ f }) => {
  const col = ip(f, [292, 348], [0, 1], E_SNAP); // COLAPSA a línea = horizonte del acto 2
  const sink = ip(f, [438, 516], [0, 1], E_IN); // el horizonte se hunde: salida GEOMÉTRICA, sin fade
  const rx = lerp(64, 88.6, col);
  const ty = lerp(0, 236, col) + sink * 760 + Math.sin(f / 68) * 7 * col; // el horizonte respira
  const paint = ip(f, [104, 216], [0, 1], Easing.bezier(0.34, 0, 0.22, 1)); // el barrido de "limpio"
  const dim = ip(f, [292, 360], [1, 0.34], E_OUT);
  const tile = 214;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "58%",
        width: 2560,
        height: 1780,
        transformStyle: "preserve-3d",
        transform: `translate(-50%,-50%) rotateX(${rx.toFixed(2)}deg) translateY(${ty.toFixed(1)}px) translateZ(-40px)`,
        opacity: dim,
      }}
    >
      {/* azulejo + junta */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            `repeating-linear-gradient(0deg, ${rgba(MD.ink0, 0.94)} 0 13px, rgba(0,0,0,0) 13px ${tile}px)`,
            `repeating-linear-gradient(90deg, ${rgba(MD.ink0, 0.94)} 0 13px, rgba(0,0,0,0) 13px ${tile}px)`,
            `linear-gradient(180deg, ${MD.ink2} 0%, ${MD.ink1} 62%, ${MD.ink0} 100%)`,
          ].join(", "),
          boxShadow: `inset 0 0 260px rgba(0,0,0,0.8)`,
        }}
      />
      {/* brillo frío de la ventanita sobre el esmalte */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(70% 52% at 26% 6%, ${rgba(MD.cold, 0.2)} 0%, rgba(0,0,0,0) 62%)`,
        }}
      />
      {/* EL MOHO — debajo, fuerte, vivo */}
      {MOLDS.map((m, i) => {
        const pulse = 0.62 + Math.sin(f / m.sp + m.ph) * 0.2;
        return (
          <div
            key={`u${i}`}
            style={{
              position: "absolute",
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.w,
              height: m.h,
              transform: `translate(-50%,-50%) rotate(${(rnd(i * 17) * 60 - 30).toFixed(1)}deg)`,
              borderRadius: "48% 52% 44% 56% / 56% 44% 58% 42%",
              background: `radial-gradient(closest-side, ${rgba(MD.mold, 0.94 * pulse)} 0%, ${rgba(
                MD.mold,
                0.44 * pulse,
              )} 52%, rgba(0,0,0,0) 82%)`,
            }}
          />
        );
      })}
      {/* LA PINTURA: barrido que "limpia" */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${((1 - paint) * 100).toFixed(2)}% 0 0)`,
          background: `linear-gradient(174deg, ${rgba("#F4F2EC", 0.95)} 0%, ${rgba("#DCD8D0", 0.9)} 46%, ${rgba(
            "#C8C6C0",
            0.86,
          )} 100%)`,
          boxShadow: `inset 0 0 140px rgba(0,0,0,0.22)`,
        }}
      />
      {/* la línea de junta vuelve a leerse sobre la pintura (pintaron encima, nada más) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${((1 - paint) * 100).toFixed(2)}% 0 0)`,
          background: [
            `repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 13px, rgba(0,0,0,0) 13px ${tile}px)`,
            `repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0 13px, rgba(0,0,0,0) 13px ${tile}px)`,
          ].join(", "),
        }}
      />
      {/* la BABA del rodillo — el borde húmedo que avanza */}
      {paint > 0.001 && paint < 0.999 && (
        <div
          style={{
            position: "absolute",
            top: "-2%",
            bottom: "-2%",
            left: `${(paint * 100).toFixed(2)}%`,
            width: 30,
            transform: "translateX(-50%)",
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba("#FFFFFF", 0.5)} 42%, ${rgba(
              "#B9B6AE",
              0.6,
            )} 62%, rgba(0,0,0,0) 100%)`,
            borderRadius: 20,
          }}
        />
      )}
      {/* EL NEGRO QUE SIGUE LATIENDO A TRAVÉS DE LA PINTURA */}
      {MOLDS.map((m, i) => {
        const pulse = 0.5 + Math.sin(f / m.sp + m.ph) * 0.5;
        const thru = ip(f, [130, 300], [0, 1], E_OUT) * lerp(0.1, 0.34, pulse);
        return (
          <div
            key={`t${i}`}
            style={{
              position: "absolute",
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.w * 0.86,
              height: m.h * 0.86,
              transform: `translate(-50%,-50%)`,
              borderRadius: "48% 52% 44% 56% / 56% 44% 58% 42%",
              clipPath: `inset(0 ${((1 - paint) * 100).toFixed(2)}% 0 0)`,
              background: `radial-gradient(closest-side, ${rgba("#0B0D09", thru)} 0%, rgba(0,0,0,0) 78%)`,
              mixBlendMode: "multiply",
            }}
          />
        );
      })}
    </div>
  );
};

/* Las chapas de pintura: "an industry happy to sell you white". */
const CHIPS = [
  { n: "BRIGHT WHITE", x: 1300, y: 250, r: -7 },
  { n: "FRESH LINEN", x: 1560, y: 400, r: 5 },
  { n: "SPRING RAIN", x: 1290, y: 545, r: -3 },
  { n: "SNOW", x: 1570, y: 690, r: 8 },
];

const PaintChips: React.FC<{ f: number }> = ({ f }) => {
  if (f > 300) return null;
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", pointerEvents: "none" }}>
      {CHIPS.map((c, i) => {
        const at = 112 + i * 26;
        const inT = ip(f, [at, at + 22], [0, 1], E_OVER);
        if (inT <= 0) return null;
        const merge = ip(f, [256, 292], [0, 1], E_IN); // se FUNDEN en la LOSA
        const x = lerp(lerp(c.x + 520, c.x, inT), 960, merge);
        const y = lerp(c.y, 636, merge);
        const rot = lerp(c.r * (1 - (1 - inT) * 2.2), 0, merge);
        const sc = lerp(1, 0.72, merge);
        const float = Math.sin(f / (34 + i * 7) + i) * 5 * (1 - merge);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + float,
              width: 336,
              height: 112,
              transform: `translate(-50%,-50%) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)}) translateZ(${(
                60 -
                i * 14
              ).toFixed(0)}px)`,
              borderRadius: 8,
              background: `linear-gradient(160deg, #FBFAF6 0%, #EAE7DF 58%, #D9D6CE 100%)`,
              boxShadow: `0 22px 46px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.9)`,
              display: "flex",
              alignItems: "center",
              paddingLeft: 22,
              opacity: 1 - merge * 0.15,
            }}
          >
            <div style={{ width: 58, height: 58, borderRadius: 4, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }} />
            <div
              style={{
                marginLeft: 18,
                fontFamily: F_SANS,
                fontWeight: 800,
                fontSize: 30,
                letterSpacing: 1.6,
                color: INK_P,
              }}
            >
              {c.n}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════════════════
   LA LOSA — el nodo que CRUZA la frontera 1→2 (match-shape): chapa de pintura → barra de medir.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
const Slab: React.FC<{ f: number }> = ({ f }) => {
  if (f < 254 || f > 512) return null;
  const morph = ip(f, [292, 344], [0, 1], Easing.bezier(0.5, 0.02, 0.16, 1));
  const rx = lerp(62, 0, morph);
  const w = lerp(470, 980, morph);
  const h = lerp(300, 132, morph);
  const top = lerp(650, 452, morph);
  const stamp = ip(f, [264, 282], [0, 1], E_OVER);
  const stampOut = ip(f, [300, 322], [0, 1], E_IN);
  const ticks = ip(f, [318, 352], [0, 1], E_SOFT);
  // el CLIC: la barra WHITE se corre a la derecha y sale, la barra DEAD ocupa el centro
  const kick = ip(f, [366, 402], [0, 1], E_SNAP);
  const out = ip(f, [372, 430], [0, 1], E_IN);
  const x = lerp(0, 760, kick) + out * 980; // sale del cuadro por la derecha: geometría, no fade
  const rotOut = lerp(0, 13, out);
  const breath = Math.sin(f / 39) * 2.4 * (1 - kick);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top,
        width: w,
        height: h,
        transformStyle: "preserve-3d",
        transform: `translate(-50%,-50%) translateX(${(x + breath).toFixed(2)}px) rotateX(${rx.toFixed(
          2,
        )}deg) rotateZ(${rotOut.toFixed(2)}deg) translateZ(${lerp(0, 46, morph).toFixed(1)}px)`,
      }}
    >
      <Contact w={w * 1.02} h={h * 0.5} y={h + 26} o={0.8 * (1 - out)} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: lerp(10, 12, morph),
          background: `linear-gradient(158deg, #FBFAF6 0%, #E9E6DE 52%, #CFCCC4 100%)`,
          boxShadow: `0 30px 66px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.92), inset 0 -2px 0 rgba(0,0,0,0.14)`,
          overflow: "hidden",
        }}
      >
        {/* estampa PAINT. (chapa) → se va a la izquierda y deja lugar a la escala */}
        <div
          style={{
            position: "absolute",
            left: lerp(38, 26, stampOut),
            top: lerp(h * 0.5 - 30, 16, stampOut),
            fontFamily: F_SANS,
            fontWeight: 900,
            fontSize: lerp(64, 30, stampOut),
            letterSpacing: lerp(4, 3.2, stampOut),
            color: INK_P,
            opacity: stamp,
            transform: `scaleY(${(1 - stampOut * 0.02).toFixed(3)})`,
          }}
        >
          {stampOut > 0.55 ? "WHITE" : "PAINT."}
        </div>
        {/* la escala equivocada: DULL → BRIGHT */}
        {ticks > 0.01 && (
          <div style={{ position: "absolute", left: 26, right: 26, bottom: 20, height: 66, opacity: ticks }}>
            {Array.from({ length: 21 }, (_, i) => {
              const big = i % 5 === 0;
              const t = ip(f, [318 + i * 1.5, 330 + i * 1.5], [0, 1], E_OUT);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${(i / 20) * 100}%`,
                    bottom: 22,
                    width: big ? 3 : 2,
                    height: (big ? 34 : 19) * t,
                    background: INK_P,
                    opacity: big ? 0.85 : 0.5,
                  }}
                />
              );
            })}
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: -2,
                fontFamily: F_SANS,
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: 2,
                color: INK_P2,
              }}
            >
              DULL
            </div>
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: -2,
                fontFamily: F_SANS,
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: 2,
                color: INK_P2,
              }}
            >
              BRIGHT
            </div>
          </div>
        )}
        {/* aguja de la vara equivocada, temblando: nunca se decide */}
        {ticks > 0.4 && (
          <div
            style={{
              position: "absolute",
              left: `${(50 + Math.sin(f / 13) * 22).toFixed(2)}%`,
              top: 8,
              width: 4,
              height: h - 34,
              background: RED_P,
              boxShadow: `0 0 16px ${rgba(MD.red, 0.6)}`,
              opacity: ticks,
            }}
          />
        )}
      </div>
    </div>
  );
};

/* La barra correcta: DEAD. Sube desde abajo y ENCASTRA (el clic). */
const DeadBar: React.FC<{ f: number }> = ({ f }) => {
  if (f < 330 || f > 514) return null;
  const rise = ip(f, [336, 372], [0, 1], Easing.bezier(0.4, 0.02, 0.2, 1));
  const seat = ip(f, [366, 380], [0, 1], E_OVER); // el CLIC
  const y = lerp(880, 452, rise);
  const needle = ip(f, [382, 432], [0, 1], Easing.bezier(0.3, 1.34, 0.36, 1));
  const lock = ip(f, [452, 476], [0, 1], E_OVER);
  const w = 980;
  const h = 132;
  const flyRule = ip(f, [472, 502], [0, 1], E_IN); // la REGLA ROJA se despega → costura @500
  const breath = Math.sin(f / 44) * 2 * rise;
  const gone = ip(f, [492, 510], [0, 1], E_IN) * 1000; // se va HACIA ARRIBA tapada por el Occluder

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y + breath - gone,
        width: w,
        height: h,
        transformStyle: "preserve-3d",
        transform: `translate(-50%,-50%) scaleY(${(1 + (1 - seat) * 0.06 * rise).toFixed(3)}) translateZ(46px)`,
      }}
    >
      <Contact w={w * 1.04} h={70} y={h + 30} o={0.85 * rise} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          ...glassStyle({ radius: 12, lit: 1 }),
          background: `linear-gradient(158deg, ${rgba(MD.ink2, 0.98)} 0%, ${rgba(MD.ink0, 0.99)} 60%, ${rgba(
            MD.ink1,
            0.98,
          )} 100%)`,
          overflow: "hidden",
        }}
      >
        {/* dientes que encastran arriba (el encaje mecánico) */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 12, display: "flex" }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                marginRight: 3,
                height: lerp(12, 5, seat),
                background: i % 2 === 0 ? rgba(MD.white, 0.24) : rgba(MD.red, 0.5),
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 26,
            top: 18,
            fontFamily: F_SANS,
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: 3.2,
            color: MD.redHot,
          }}
        >
          DEAD
        </div>
        {/* escala ALIVE → DEAD */}
        <div style={{ position: "absolute", left: 26, right: 26, bottom: 20, height: 66 }}>
          {Array.from({ length: 21 }, (_, i) => {
            const big = i % 5 === 0;
            const t = ip(f, [352 + i * 1.4, 364 + i * 1.4], [0, 1], E_OUT);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(i / 20) * 100}%`,
                  bottom: 22,
                  width: big ? 3 : 2,
                  height: (big ? 34 : 19) * t,
                  background: MD.bone,
                  opacity: big ? 0.9 : 0.42,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 0, bottom: -2, fontFamily: F_SANS, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: rgba(MD.bone, 0.6) }}>
            ALIVE
          </div>
          <div style={{ position: "absolute", right: 0, bottom: -2, fontFamily: F_SANS, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: MD.redHot }}>
            DEAD
          </div>
        </div>
        {/* la aguja SE DECIDE y se queda */}
        <div
          style={{
            position: "absolute",
            left: `${lerp(8, 92, needle).toFixed(2)}%`,
            top: 6,
            width: 5,
            height: h - 30,
            background: MD.white,
            boxShadow: `0 0 20px ${rgba(MD.white, 0.85)}, 0 0 44px ${rgba(MD.red, 0.5)}`,
            transform: `translateX(-50%) rotate(${((1 - needle) * -6).toFixed(2)}deg)`,
          }}
        />
        {/* el TRINQUETE que la deja fija ("and it stays fixed") */}
        <div
          style={{
            position: "absolute",
            left: "92%",
            top: -4,
            width: 26,
            height: lerp(2, 22, lock),
            transform: "translateX(-50%)",
            background: MD.redHot,
            borderRadius: 3,
            boxShadow: `0 0 ${(10 + lock * 22).toFixed(0)}px ${rgba(MD.redHot, 0.8)}`,
            opacity: lock,
          }}
        />
        <Sheen at={392} dur={30} angle={14} />
      </div>

      {/* LA REGLA ROJA — la materia que cruza a la hoja */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: h + 22,
          width: lerp(w * 0.72, 2600, flyRule),
          height: lerp(6, 22, flyRule),
          transform: `translate(-50%,0) translateY(${lerp(0, -520, flyRule).toFixed(1)}px) rotate(${lerp(
            0,
            -6,
            flyRule,
          ).toFixed(2)}deg)`,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${MD.red} 12%, ${MD.redHot} 50%, ${MD.red} 88%, rgba(0,0,0,0) 100%)`,
          boxShadow: `0 0 ${(18 + flyRule * 60).toFixed(0)}px ${rgba(MD.red, 0.7)}`,
          borderRadius: 4,
          opacity: ip(f, [400, 418], [0, 1], E_OUT),
        }}
      />

      {/* medidores que bajan: "easier and cheaper" */}
      {[0, 1].map((i) => {
        const lab = i === 0 ? "EFFORT" : "COST";
        const a = 392 + i * 16;
        const inT = ip(f, [a, a + 18], [0, 1], E_OUT);
        const drop = ip(f, [a + 12, a + 62], [1, 0.24], E_LONG);
        if (inT <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i === 0 ? -300 : w + 118,
              top: -132,
              width: 176,
              transform: `translateY(${((1 - inT) * 22).toFixed(1)}px)`,
              opacity: inT,
            }}
          >
            <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 2.6, color: rgba(MD.bone, 0.72), marginBottom: 10 }}>
              {lab}
            </div>
            <div style={{ width: 176, height: 16, borderRadius: 8, background: rgba(MD.white, 0.09), overflow: "hidden" }}>
              <div
                style={{
                  width: `${(drop * 100).toFixed(1)}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${MD.red}, ${MD.redHot})`,
                  boxShadow: `0 0 16px ${rgba(MD.red, 0.6)}`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 3 — LA HOJA. Papel de verdad: fibra, curvatura, sombra propia, cinta con brillo.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
const ROWS: [string, string, string][] = [
  ["GROUT", "3% straight", "10–15 min"],
  ["CAULK LINE", "paste + towel", "1–2 h"],
  ["TOILET", "under the rim", "OVERNIGHT"],
  ["SHOWER TRACK", "3% + spray", "20 min"],
  ["WASHER GASKET", "wipe + hot cycle", "after cycle"],
  ["SINK DRAIN", "1 cup, no rinse", "30 min"],
  ["WINDOW SILL", "3% + paper", "45 min"],
  ["ROOM ORDER", "bath → laundry → kitchen", "one afternoon"],
];
const ROW_AT = (i: number) => 548 + i * 40;
const SH_W = 1240;
const SH_H = 856;

const Tape: React.FC<{ f: number; at: number; x: number; y: number; rot: number }> = ({ f, at, x, y, rot }) => {
  const t = ip(f, [at, at + 12], [0, 1], E_OVER);
  if (t <= 0) return null;
  const squash = 1 + (1 - t) * 0.5;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 178,
        height: 56,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${squash.toFixed(3)}, ${(2 - squash).toFixed(3)})`,
        background: `linear-gradient(122deg, rgba(246,244,236,0.34) 0%, rgba(255,255,255,0.2) 42%, rgba(232,228,216,0.34) 100%)`,
        border: `1px solid ${rgba(MD.white, 0.26)}`,
        boxShadow: `0 6px 16px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.5)`,
        opacity: t,
      }}
    >
      <div style={{ position: "absolute", left: "12%", right: "12%", top: "26%", height: 2, background: rgba(MD.white, 0.5) }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(104deg, rgba(255,255,255,0) 38%, rgba(255,255,255,0.36) 50%, rgba(255,255,255,0) 62%)` }} />
    </div>
  );
};

const Sheet: React.FC<{ f: number; taped: boolean }> = ({ f, taped }) => {
  const enter = ip(f, [500, 556], [0, 1], E_OUT);
  const cut = f >= 921; // CORTE EN EL BEAT — sin interpolar
  const move = ip(f, [943, 1006], [0, 1], E_OUT); // MATCH-MOVE hacia la puerta
  const drift = ip(f, [921, 943], [0, 1], ID);

  // pose antes / después del corte (el salto es el corte)
  const baseRY = cut ? lerp(12, 6, drift) : lerp(-16, -6, enter);
  const baseRX = cut ? 2 : lerp(12, 6, enter);
  const baseSc = cut ? 1.16 : lerp(0.9, 1, enter);
  const baseX = cut ? lerp(-40, -90, drift) : lerp(120, 0, enter);
  const baseY = cut ? 0 : lerp(60, 0, enter);

  const ry = lerp(baseRY, -30, move);
  const rx = lerp(baseRX, 3, move);
  const sc = lerp(baseSc, 0.8, move);
  const px = lerp(baseX, -376, move);
  const py = lerp(baseY, 54, move);
  const float = Math.sin(f / 46) * 4 * (1 - move);
  const flash = cut && f < 927 ? ip(f, [921, 927], [0.4, 0], ID) : 0;
  const paperLit = lerp(1, 0.86, move);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: SH_W,
        height: SH_H,
        transformStyle: "preserve-3d",
        transform: `translate(-50%,-50%) translate3d(${px.toFixed(1)}px, ${(py + float).toFixed(
          1,
        )}px, ${lerp(0, -60, move).toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(
          2,
        )}deg) scale(${sc.toFixed(3)})`,
      }}
    >
      <Contact w={SH_W * 0.94} h={116} y={SH_H + lerp(46, 18, move)} o={lerp(0.7, 0.95, cut ? 1 : 0)} x={-30} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 5,
          background: `linear-gradient(168deg, ${PAPER0} 0%, #F1ECE1 44%, ${PAPER1} 100%)`,
          boxShadow: `0 44px 92px rgba(0,0,0,0.72), 0 4px 0 rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.9)`,
          overflow: "hidden",
          filter: paperLit < 0.999 ? `brightness(${paperLit.toFixed(3)})` : undefined,
        }}
      >
        {/* FIBRA del papel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: [
              `repeating-linear-gradient(93deg, rgba(90,80,60,0.045) 0 1px, rgba(0,0,0,0) 1px 4px)`,
              `repeating-linear-gradient(4deg, rgba(90,80,60,0.03) 0 1px, rgba(0,0,0,0) 1px 6px)`,
            ].join(", "),
          }}
        />
        {/* CURVATURA: la hoja no es plana */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(101deg, rgba(0,0,0,0.13) 0%, rgba(255,255,255,0.2) 22%, rgba(0,0,0,0.02) 56%, rgba(0,0,0,0.11) 100%)`,
          }}
        />
        {flash > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(102deg, rgba(255,255,255,0) 28%, rgba(255,255,255,${flash.toFixed(
                3,
              )}) 50%, rgba(255,255,255,0) 72%)`,
            }}
          />
        )}

        {/* ENCABEZADO */}
        <div style={{ position: "absolute", left: 58, top: 46, right: 58 }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 46, letterSpacing: 1.2, color: INK_P }}>
            WHOLE-HOUSE CHECKLIST
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: F_SANS,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 3.4,
              color: RED_P,
              opacity: ip(f, [524, 542], [0, 1], E_OUT),
            }}
          >
            PRINTED · IN THE DESCRIPTION
          </div>
          {/* el FILETE ROJO = la regla que voló del acto 2 */}
          <div
            style={{
              marginTop: 16,
              height: 7,
              width: `${(ip(f, [508, 540], [0, 100], E_OUT)).toFixed(1)}%`,
              background: `linear-gradient(90deg, ${RED_P}, #D8463A)`,
              borderRadius: 2,
            }}
          />
          {/* rótulos de columna */}
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontFamily: F_SANS,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 2.6,
              color: INK_P2,
              opacity: ip(f, [536, 552], [0, 1], E_OUT),
            }}
          >
            <div style={{ width: 400 }}>AREA</div>
            <div style={{ width: 466 }}>MIX</div>
            <div style={{ width: 258 }}>DWELL</div>
          </div>
          <div style={{ marginTop: 8, height: 2, background: rgba(INK_P, 0.22), opacity: ip(f, [540, 556], [0, 1], E_OUT) }} />
        </div>

        {/* FILAS — cada una se imprime con su pasada de cabezal */}
        {ROWS.map((r, i) => {
          const at = ROW_AT(i);
          const p = ip(f, [at, at + 26], [0, 1], Easing.bezier(0.3, 0, 0.24, 1));
          if (p <= 0) return null;
          const isToilet = i === 2;
          const hi = isToilet ? ip(f, [770, 800], [0, 1], E_OUT) * (1 - ip(f, [980, 1004], [0, 1], ID)) : 0;
          const dimOthers = !isToilet ? ip(f, [776, 800], [0, 0.44], E_OUT) * (1 - ip(f, [860, 888], [0, 1], E_OUT)) : 0;
          const leave = isToilet ? ip(f, [986, 1012], [0, 1], E_IN) : 0; // se despega → costura @1012
          const y = 268 + i * 66;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 58,
                top: y,
                width: SH_W - 116,
                height: 58,
                opacity: 1 - dimOthers - leave * 0.15,
                transform: `translate(${(leave * 250).toFixed(1)}px, ${(leave * -190).toFixed(1)}px) scale(${(
                  1 +
                  hi * 0.035 +
                  leave * 0.1
                ).toFixed(3)})`,
                transformOrigin: "left center",
              }}
            >
              {hi > 0.02 && (
                <div
                  style={{
                    position: "absolute",
                    left: -18,
                    right: -14,
                    top: -6,
                    bottom: -6,
                    background: rgba("#D8463A", 0.1 * hi),
                    borderLeft: `${(6 * hi).toFixed(1)}px solid ${RED_P}`,
                    borderRadius: 3,
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  clipPath: `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`,
                  fontFamily: F_SANS,
                  fontSize: 32,
                  color: INK_P,
                }}
              >
                <div style={{ width: 400, fontWeight: 800, letterSpacing: 0.6 }}>{r[0]}</div>
                <div style={{ width: 466, fontWeight: 500, color: INK_P2 }}>{r[1]}</div>
                <div
                  style={{
                    width: 258,
                    fontWeight: isToilet ? 900 : 600,
                    color: isToilet ? RED_P : INK_P,
                    letterSpacing: isToilet ? 1 : 0,
                  }}
                >
                  {r[2]}
                </div>
              </div>
              {/* la duda tachada: ¿overnight o una hora? */}
              {isToilet && hi > 0.2 && (
                <div style={{ position: "absolute", left: SH_W - 300, top: 4, opacity: ip(f, [792, 812], [0, 1], E_OUT) }}>
                  <div style={{ fontFamily: F_SERIF, fontStyle: "italic", fontSize: 34, color: rgba(INK_P, 0.55) }}>1 h?</div>
                  <div
                    style={{
                      position: "absolute",
                      left: -6,
                      top: 22,
                      width: `${(ip(f, [812, 834], [0, 92], E_OUT)).toFixed(0)}px`,
                      height: 4,
                      background: RED_P,
                      transform: "rotate(-9deg)",
                    }}
                  />
                </div>
              )}
              {/* cabezal de impresión */}
              {p > 0.02 && p < 0.98 && (
                <div
                  style={{
                    position: "absolute",
                    left: `${(p * 100).toFixed(2)}%`,
                    top: -8,
                    width: 5,
                    height: 74,
                    background: rgba(INK_P, 0.35),
                    boxShadow: `0 0 12px ${rgba("#D8463A", 0.5)}`,
                  }}
                />
              )}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: -6, height: 1, background: rgba(INK_P, 0.12), transform: `scaleX(${p.toFixed(3)})`, transformOrigin: "left" }} />
            </div>
          );
        })}

        {/* pie: nada de precio, nada de link — sólo el gesto */}
        <div
          style={{
            position: "absolute",
            left: 58,
            bottom: 34,
            fontFamily: F_SERIF,
            fontStyle: "italic",
            fontSize: 32,
            color: rgba(INK_P, 0.62),
            opacity: ip(f, [880, 906], [0, 1], E_OUT),
          }}
        >
          measure dead — not white
        </div>
        <div
          style={{
            position: "absolute",
            right: 58,
            bottom: 30,
            width: 96,
            height: 42,
            borderRadius: 4,
            border: `2px dashed ${rgba(INK_P, 0.3)}`,
            opacity: ip(f, [890, 912], [0, 1], E_OUT),
          }}
        />
      </div>

      {taped && (
        <>
          <Tape f={f} at={972} x={128} y={26} rot={-8} />
          <Tape f={f} at={986} x={SH_W - 120} y={SH_H - 22} rot={6} />
        </>
      )}
    </div>
  );
};

/* La puerta del mueble bajo la pileta — entra girando y ACOPLA su plano con el de la hoja. */
const CabinetDoor: React.FC<{ f: number }> = ({ f }) => {
  if (f < 924) return null;
  const swing = ip(f, [928, 1004], [0, 1], E_OUT);
  const ry = lerp(-86, -30, swing);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 1560,
        height: 1040,
        transformStyle: "preserve-3d",
        transform: `translate(-50%,-50%) translate3d(${lerp(560, -300, swing).toFixed(1)}px, 40px, ${lerp(
          -240,
          -110,
          swing,
        ).toFixed(1)}px) rotateY(${ry.toFixed(2)}deg)`,
      }}
    >
      {/* cara interior de la puerta */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(122deg, #2A241E 0%, #191612 46%, #221D18 100%)`,
          boxShadow: `inset 0 0 160px rgba(0,0,0,0.8), 0 40px 90px rgba(0,0,0,0.7)`,
        }}
      />
      {/* veta */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(88deg, rgba(255,255,255,0.028) 0 2px, rgba(0,0,0,0) 2px 13px)`,
        }}
      />
      {/* moldura */}
      <div style={{ position: "absolute", inset: 54, border: `3px solid rgba(255,255,255,0.055)`, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.05)" }} />
      {/* lamido cálido del pasillo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(70% 60% at 84% 108%, ${rgba(MD.warm, 0.24)} 0%, rgba(0,0,0,0) 62%)`,
        }}
      />
    </div>
  );
};

/* Silueta del sifón: contexto de "under the sink". */
const Trap: React.FC<{ f: number }> = ({ f }) => {
  const o = ip(f, [934, 972], [0, 1], E_OUT) * (1 - ip(f, [1008, 1022], [0, 1], ID));
  if (o <= 0.01) return null;
  return (
    <svg
      style={{ position: "absolute", right: 96, bottom: 0, opacity: o, transform: `translateZ(120px)` }}
      width="360"
      height="620"
      viewBox="0 0 360 620"
    >
      <path
        d="M170 0 L170 300 C170 380, 90 380, 90 452 C90 522, 200 522, 236 470 L300 380"
        fill="none"
        stroke="#0B0C0E"
        strokeWidth={52}
        strokeLinecap="round"
      />
      <path
        d="M170 0 L170 300 C170 380, 90 380, 90 452 C90 522, 200 522, 236 470 L300 380"
        fill="none"
        stroke={rgba(MD.warm, 0.34)}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 4 — EL PLAN DE ESTA NOCHE. Lista VIVA colgada de un riel de luz.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
const StepIcon: React.FC<{ i: number; f: number; at: number }> = ({ i, f, at }) => {
  const t = clamp01((f - at) / 26);
  const loop = Math.sin(f / 21 + i) * 0.5 + 0.5;
  const S = { stroke: MD.white, strokeWidth: 5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="86" height="86" viewBox="0 0 86 86">
      {i === 0 && (
        <>
          <circle cx="43" cy="43" r="24" {...S} opacity={0.9} />
          <path d="M43 19 L43 6 M19 43 L6 43 M43 67 L43 80 M67 43 L80 43" {...S} opacity={0.5} />
          <path
            d="M26 26 L60 60"
            {...S}
            stroke={MD.redHot}
            strokeDasharray={48}
            strokeDashoffset={48 * (1 - t)}
          />
        </>
      )}
      {i === 1 && (
        <>
          <path d="M16 20 C16 62, 30 74, 43 74 C56 74, 70 62, 70 20" {...S} />
          <path d={`M20 ${(34 + t * 26).toFixed(0)} L66 ${(34 + t * 26).toFixed(0)}`} {...S} stroke={rgba(MD.cold, 0.85)} strokeWidth={4} />
        </>
      )}
      {i === 2 && (
        <>
          <path d="M12 24 C34 12, 52 12, 74 24" {...S} />
          {[0, 1, 2].map((d) => (
            <circle
              key={d}
              cx={26 + d * 17}
              cy={34 + ((f * 1.3 + d * 19) % 40)}
              r={4.4}
              fill={MD.redHot}
              opacity={t * (0.85 - d * 0.14)}
            />
          ))}
        </>
      )}
      {i === 3 && (
        <>
          <ellipse cx="43" cy="58" rx="30" ry="12" {...S} opacity={0.8} />
          <rect x={17} y={50 - t * 24} width="52" height="26" rx="3" {...S} stroke={MD.bone} opacity={0.4 + t * 0.6} />
        </>
      )}
      {i === 4 && (
        <>
          <path d="M22 46 C22 26, 64 26, 64 46 C64 60, 22 60, 22 46 Z" {...S} opacity={0.7 + loop * 0.3} />
          <path d="M14 62 L72 62" {...S} strokeWidth={6} opacity={0.6} />
        </>
      )}
    </svg>
  );
};

const STEPS = [
  { t: "VALVE OFF", at: 1132 },
  { t: "BOWL DOWN", at: 1170 },
  { t: "PEROXIDE UNDER THE RIM", at: 1208 },
  { t: "PAPER ON THE RING", at: 1246 },
  { t: "GO TO BED", at: 1284 },
];

const LiveList: React.FC<{ f: number }> = ({ f }) => {
  const railX = lerp(452, 960, ip(f, [1272, 1302], [0, 1], E_LONG)); // el riel se centra: queda alineado con la junta
  const railTop = 252;
  const railBot = 968;
  const draw = ip(f, [1064, 1300], [0, 1], Easing.bezier(0.24, 0.7, 0.3, 1));
  const shimmer = ((f * 5.2) % 260) / 260;
  const collapse = ip(f, [1286, 1312], [0, 1], E_IN);

  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      {/* "1" fantasma: una sola cosa esta noche */}
      <div
        style={{
          position: "absolute",
          left: 1330,
          top: 130,
          fontFamily: F_SANS,
          fontWeight: 900,
          fontSize: 640,
          letterSpacing: -20,
          color: rgba(MD.white, 0.035),
          opacity: ip(f, [1030, 1080], [0, 1], E_OUT) * (1 - collapse),
          transform: `translateZ(-160px) translateY(${(Math.sin(f / 70) * 6).toFixed(1)}px)`,
        }}
      >
        1
      </div>

      {/* EL RIEL — la materia que cruza al acto 5 */}
      <div
        style={{
          position: "absolute",
          left: railX,
          top: railTop,
          width: lerp(6, 30, collapse),
          height: (railBot - railTop) * draw,
          transform: `translateX(-50%) translateZ(${lerp(0, 190, collapse).toFixed(0)}px)`,
          background: `linear-gradient(180deg, ${rgba(MD.white, 0.9)} 0%, ${rgba(MD.warm, 0.85)} 62%, ${rgba(
            MD.warm,
            0.35,
          )} 100%)`,
          boxShadow: `0 0 ${(20 + collapse * 90).toFixed(0)}px ${rgba(MD.warm, 0.55)}`,
          borderRadius: 4,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -4,
            width: 14,
            top: `${(shimmer * 100).toFixed(1)}%`,
            height: 90,
            background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.75)} 50%, rgba(255,255,255,0) 100%)`,
            borderRadius: 8,
            opacity: 0.7,
          }}
        />
      </div>

      {STEPS.map((s, i) => {
        const inT = ip(f, [s.at, s.at + 22], [0, 1], E_OVER);
        if (inT <= 0) return null;
        const y = railTop + 52 + i * 142;
        const last = i === STEPS.length - 1;
        const pulse = 0.7 + Math.sin(f / 17 + i * 1.4) * 0.3;
        const settle = clamp01((f - s.at - 22) / 40);
        const dimOut = collapse * (last ? 0.5 : 0.85);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: railX + 46,
              top: y,
              transform: `translateY(${((1 - inT) * 34).toFixed(1)}px) translateX(${((1 - inT) * -70).toFixed(
                1,
              )}px) translateZ(${(40 - i * 6).toFixed(0)}px) scale(${(1 - collapse * 0.06).toFixed(3)})`,
              opacity: (1 - dimOut) * Math.min(1, inT * 1.4),
            }}
          >
            {/* nodo sobre el riel */}
            <div
              style={{
                position: "absolute",
                left: -46,
                top: 44,
                width: 26,
                height: 26,
                borderRadius: "50%",
                transform: "translate(-50%,-50%)",
                background: last ? MD.warm : MD.redHot,
                boxShadow: `0 0 ${(14 + pulse * 20).toFixed(0)}px ${rgba(last ? MD.warm : MD.red, 0.85)}`,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "18px 40px 18px 26px",
                ...glassStyle({ radius: 14, lit: last ? 0.7 : 1 }),
                transform: `rotateY(${((1 - settle) * -7).toFixed(2)}deg)`,
                transformOrigin: "left center",
              }}
            >
              <div style={{ opacity: 0.5 + settle * 0.5 }}>
                <StepIcon i={i} f={f} at={s.at} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: F_SANS,
                    fontWeight: 800,
                    fontSize: 30,
                    letterSpacing: 3,
                    color: last ? rgba(MD.warm, 0.9) : rgba(MD.redHot, 0.9),
                  }}
                >
                  {last ? "THEN" : `STEP ${i + 1}`}
                </div>
                <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 50, color: MD.white, lineHeight: 1.06, marginTop: 4 }}>
                  {s.t}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* La fila del inodoro que sobrevive al vapor y se vuelve el título del acto 4. */
const FlyingRow: React.FC<{ f: number }> = ({ f }) => {
  if (f < 1000 || f > 1064) return null;
  const t = ip(f, [1004, 1052], [0, 1], E_OUT);
  const x = lerp(760, 200, t);
  const y = lerp(360, 218, t);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${lerp(-8, 0, t).toFixed(2)}deg) scale(${lerp(1, 1.16, t).toFixed(3)})`,
        opacity: 1 - ip(f, [1044, 1062], [0, 1], ID),
        fontFamily: F_SANS,
        fontWeight: 900,
        fontSize: 34,
        letterSpacing: 1.4,
        color: lerp(0, 1, t) > 0.5 ? MD.redHot : INK_P,
        padding: "10px 18px",
        background: t < 0.5 ? rgba(PAPER0, 0.9 * (1 - t * 2)) : "transparent",
        borderLeft: `6px solid ${t < 0.5 ? RED_P : MD.redHot}`,
      }}
    >
      TOILET · under the rim · OVERNIGHT
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 5 — EL RINCÓN DE LA DUCHA. Cierra el círculo: la junta que abría el video.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
const Wall: React.FC<{ side: "l" | "r"; f: number; kill: number }> = ({ side, f, kill }) => {
  const left = side === "l";
  const warm = ip(f, [1330, 1470], [0, 1], E_SOFT);
  return (
    <div
      style={{
        position: "absolute",
        [left ? "left" : "right"]: 0,
        top: -120,
        width: 1180,
        height: 1320,
        transformOrigin: left ? "right center" : "left center",
        transform: `rotateY(${left ? 36 : -36}deg) translateZ(-60px)`,
        background: [
          `repeating-linear-gradient(0deg, ${rgba(MD.ink0, 0.9)} 0 11px, rgba(0,0,0,0) 11px 168px)`,
          `repeating-linear-gradient(90deg, ${rgba(MD.ink0, 0.9)} 0 11px, rgba(0,0,0,0) 11px 168px)`,
          `linear-gradient(${left ? 100 : 80}deg, ${MD.ink2} 0%, ${MD.ink1} 60%, ${MD.ink0} 100%)`,
        ].join(", "),
        boxShadow: "inset 0 0 200px rgba(0,0,0,0.85)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(80% 70% at ${left ? "88%" : "12%"} 88%, ${rgba(MD.warm, 0.1 + warm * 0.2)} 0%, rgba(0,0,0,0) 66%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 44% at ${left ? "18%" : "82%"} 2%, ${rgba(MD.cold, 0.13 * (1 - warm * 0.7))} 0%, rgba(0,0,0,0) 60%)`,
        }}
      />
      {/* el esmalte devuelve un poco de luz cuando ya está muerto */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${left ? 96 : 84}deg, rgba(255,255,255,0) 40%, ${rgba(MD.bone, 0.06 * kill)} 62%, rgba(255,255,255,0) 84%)` }} />
    </div>
  );
};

const FILA = Array.from({ length: 14 }, (_, i) => ({
  y: 520 + rnd(i * 3.3) * 250,
  len: 40 + rnd(i * 8.1 + 2) * 120,
  dir: rnd(i * 5.5) > 0.5 ? 1 : -1,
  ang: (rnd(i * 2.9) - 0.5) * 44,
  ph: rnd(i * 12.7) * 6.28,
}));

const Corner: React.FC<{ f: number; kill: number }> = ({ f, kill }) => {
  const seamW = 34;
  const stainO = 1 - kill;
  const alive = 0.62 + Math.sin(f / 15) * 0.2 * stainO + Math.sin(f / 6.4) * 0.06 * stainO;
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      <Wall side="l" f={f} kill={kill} />
      <Wall side="r" f={f} kill={kill} />
      {/* piso */}
      <div
        style={{
          position: "absolute",
          left: -300,
          right: -300,
          bottom: -300,
          height: 900,
          transformOrigin: "top center",
          transform: "rotateX(74deg) translateZ(-40px)",
          background: `linear-gradient(180deg, ${MD.ink1} 0%, ${MD.ink0} 70%)`,
          boxShadow: "inset 0 60px 120px rgba(0,0,0,0.85)",
        }}
      />
      {/* LA JUNTA — es el riel del acto 4 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: -60,
          width: seamW,
          height: 1200,
          transform: "translateX(-50%) translateZ(14px)",
          background: `linear-gradient(180deg, ${rgba(MD.ink2, 1)} 0%, ${rgba(MD.ink1, 1)} 100%)`,
          boxShadow: `inset 2px 0 6px rgba(0,0,0,0.9), inset -2px 0 6px rgba(0,0,0,0.9)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(MD.bone, 0.36 * kill)} 34%, ${rgba(
              MD.bone,
              0.5 * kill,
            )} 62%, rgba(0,0,0,0) 100%)`,
          }}
        />
      </div>

      {/* filamentos: la raíz METIDA en la junta */}
      {FILA.map((r, i) => {
        const grow = ip(f, [1392, 1454], [0, 1], E_OUT);
        const retract = kill;
        const len = r.len * lerp(0.42, 1, grow) * (1 - retract);
        if (len < 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960,
              top: r.y + Math.sin(f / 40 + r.ph) * 2,
              width: len,
              height: lerp(9, 3, rnd(i * 4.4)),
              transformOrigin: r.dir > 0 ? "left center" : "right center",
              transform: `translateX(${r.dir > 0 ? 8 : -len - 8}px) rotate(${(r.ang + Math.sin(f / 52 + i) * 1.6).toFixed(
                2,
              )}deg) translateZ(12px)`,
              background: `linear-gradient(${r.dir > 0 ? 90 : 270}deg, ${rgba(MD.mold, 0.95 * alive)} 0%, ${rgba(
                MD.moldLit,
                0.28 * alive,
              )} 72%, rgba(0,0,0,0) 100%)`,
              borderRadius: 6,
            }}
          />
        );
      })}

      {/* la mancha */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 640,
          width: 240 * (1 - kill * 0.7),
          height: 340 * (1 - kill * 0.55),
          transform: `translate(-50%,-50%) translateZ(16px) scale(${(1 + Math.sin(f / 23) * 0.02 * stainO).toFixed(3)})`,
          borderRadius: "46% 54% 42% 58% / 58% 42% 56% 44%",
          background: `radial-gradient(closest-side, ${rgba("#090C08", 0.98 * alive)} 0%, ${rgba(
            MD.mold,
            0.8 * alive,
          )} 40%, ${rgba(MD.mold, 0.24 * alive)} 68%, rgba(0,0,0,0) 88%)`,
          boxShadow: `0 0 60px ${rgba(MD.mold, 0.4 * stainO)}`,
        }}
      />
      {/* el CASCO: "armored" */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 640,
          width: 300,
          height: 400,
          transform: "translate(-50%,-50%) translateZ(20px)",
          borderRadius: "46% 54% 42% 58% / 58% 42% 56% 44%",
          border: `3px solid ${rgba(MD.moldLit, 0.6 * ip(f, [1384, 1412], [0, 1], E_OUT) * stainO)}`,
          boxShadow: `inset 0 0 40px ${rgba(MD.moldLit, 0.22 * stainO)}`,
          opacity: 1 - kill,
        }}
      />
      {/* ceniza: lo que queda cuando muere */}
      {kill > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 640,
            width: 200,
            height: 280,
            transform: "translate(-50%,-50%) translateZ(18px)",
            borderRadius: "46% 54% 42% 58% / 58% 42% 56% 44%",
            background: `radial-gradient(closest-side, ${rgba("#8C8578", 0.3 * kill)} 0%, rgba(0,0,0,0) 76%)`,
          }}
        />
      )}
    </div>
  );
};

const Stamps: React.FC<{ f: number; endAt: number }> = ({ f, endAt }) => {
  const items = [
    { t: "ARMORED", at: 1382 },
    { t: "ROOTED", at: 1416 },
    { t: "ALIVE", at: 1450 },
  ];
  return (
    <div style={{ position: "absolute", right: 130, top: 372 }}>
      {items.map((it, i) => {
        const at = Math.min(it.at, endAt - 24 - (2 - i) * 22);
        const t = ip(f, [at, at + 14], [0, 1], E_OVER);
        if (t <= 0) return null;
        const strike = ip(f, [endAt - 6 + i * 5, endAt + 12 + i * 5], [0, 1], E_SNAP);
        return (
          <div
            key={i}
            style={{
              position: "relative",
              marginBottom: 20,
              padding: "12px 26px",
              textAlign: "right",
              transform: `translateX(${((1 - t) * 44).toFixed(1)}px) scale(${(0.94 + t * 0.06).toFixed(3)})`,
              opacity: t,
              background: "linear-gradient(180deg, rgba(6,6,8,0.84), rgba(6,6,8,0.6))",
              borderRight: `5px solid ${rgba(MD.redHot, 1 - strike * 0.6)}`,
              borderRadius: 8,
              boxShadow: "0 18px 46px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 44, letterSpacing: 3.4, color: strike > 0.5 ? rgba(MD.bone, 0.45) : MD.white }}>
              {it.t}
            </div>
            <div
              style={{
                position: "absolute",
                left: 18,
                right: 18,
                top: "52%",
                height: 5,
                background: MD.redHot,
                boxShadow: `0 0 14px ${rgba(MD.red, 0.8)}`,
                transform: `scaleX(${strike.toFixed(3)})`,
                transformOrigin: "right center",
                borderRadius: 3,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovClose: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  // piso defensivo: las rampas de luz/cámara usan D como último keyframe y deben quedar
  // estrictamente crecientes aunque el farm entregue una duración corta.
  const D = Math.max(1400, durationInFrames);
  const f = frame;

  // fronteras
  const A2 = 292;
  const A3 = 500;
  const A3B = 921;
  const A3C = 943;
  const A4 = 1012;
  const A5 = 1302;
  const T_END = Math.min(1495, D - 30); // el remate, robusto ante ±30
  const T_KILL = T_END - 4;

  /* ── LUZ: un solo viaje, frío lavado → ámbar cálido bajo. Nunca se reinicia. ───────────── */
  const lt = ip(f, [0, A3, A4, A5, D], [0, 0.16, 0.55, 0.86, 1], E_SOFT);
  const airTint = light(lt, "cold", "warm");
  const keyFrom = ip(f, [0, A2, A3, A4, A5, D], [0.2, 0.34, 0.4, 0.62, 0.72, 0.8], E_SOFT);
  const atmInt = ip(f, [0, 240, A2, A3, A3C, A4, A5, T_END, D], [1.34, 1.34, 1.1, 0.98, 0.9, 0.86, 0.84, 0.9, 0.96], E_SOFT);
  // el velo del BLANCO FALSO: sólo el acto 1
  const veil = ip(f, [40, 150, 244, 320], [0, 0.17, 0.16, 0], E_SOFT);

  /* ── CÁMARA: UNA sola, función del frame GLOBAL. ⛔ nunca vuelve a 0. ───────────────────── */
  const C = cam(f, { z0: -96, z1: 96, panX: -54, panY: -22, ry: 5.2, rx: -1.6, dur: 1460 });
  const camZ = ip(
    f,
    [0, A2, 372, A3, 720, A3B, A3C, A4, 1180, 1290, A5 + 14, 1372, D],
    [0, 58, 34, 14, 30, 40, 22, 0, 26, 84, 118, 46, 74],
    E_SOFT,
  );
  const camRot = ip(f, [0, A3, A4, A5, D], [0, -1.2, 0.9, -0.6, 0.5], E_SOFT);

  /* ── grupos de acto: entradas/salidas por GEOMETRÍA, nunca por fade global ─────────────── */
  const a1 = f < 520;
  const a2 = f > 250 && f < 516;
  const a3 = f > A3 - 12 && f < A4 + 20;
  const a4 = f > A4 - 24 && f < A5 + 26;
  const a5 = f > A5 - 8;

  // zoom-through 1288→1318: el acto 4 SALE hacia la cámara, el rincón ENTRA desde el fondo
  const through = ip(f, [1288, A5 + 16], [0, 1], E_IN);
  const arrive = ip(f, [A5 - 6, 1366], [0, 1], Easing.bezier(0.12, 0.72, 0.2, 1));
  // el acto 3 se va POR ABAJO (nos levantamos de debajo de la pileta) tapado por el vapor
  const leaveSink = ip(f, [A4 - 8, A4 + 18], [0, 1], E_IN);

  const kill = ip(f, [T_KILL, T_KILL + 34], [0, 1], Easing.bezier(0.32, 0, 0.18, 1));

  // deriva de la capa de textos (parallax propio, SIN entrar al mundo 3D → safe area intacta)
  const tx = Math.sin(f / 53) * 5 + Math.sin(f / 121) * 3;
  const ty = Math.cos(f / 67) * 4;

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* UNA sola atmósfera, montada UNA vez, para los 51 segundos */}
      <Atmos tint={airTint} keyFrom={keyFrom} intensity={atmInt} />

      {/* EL MUNDO */}
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: C.transform }}>
        <AbsoluteFill
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${camZ.toFixed(2)}px) rotateZ(${camRot.toFixed(3)}deg)`,
          }}
        >
          {/* plano profundo de bruma (parallax propio) */}
          <div
            style={{
              position: "absolute",
              inset: "-14%",
              transform: `translateZ(-320px) translateX(${(Math.sin(f / 140) * 26).toFixed(1)}px)`,
              background: `radial-gradient(60% 46% at ${(38 + keyFrom * 24).toFixed(0)}% 24%, ${rgba(
                airTint,
                0.1,
              )} 0%, rgba(0,0,0,0) 70%)`,
            }}
          />

          {a1 && (
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
              <TilePlane f={f} />
              <PaintChips f={f} />
            </div>
          )}

          {a2 && (
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
              <Slab f={f} />
              <DeadBar f={f} />
            </div>
          )}

          {a3 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                transform: `translate3d(0px, ${(leaveSink * 1260).toFixed(1)}px, ${(leaveSink * -460).toFixed(1)}px)`,
              }}
            >
              <CabinetDoor f={f} />
              <Trap f={f} />
              <Sheet f={f} taped={f >= 960} />
            </div>
          )}

          {a4 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                transform: `translateZ(${(through * 900).toFixed(1)}px) scale(${(1 + through * 0.02).toFixed(3)})`,
                opacity: 1 - ip(f, [A5 + 8, A5 + 24], [0, 1], ID),
              }}
            >
              <FlyingRow f={f} />
              <LiveList f={f} />
            </div>
          )}

          {a5 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                transform: `translateZ(${lerp(-760, 0, arrive).toFixed(1)}px) rotateY(${(
                  (1 - arrive) * 3.4
                ).toFixed(2)}deg)`,
              }}
            >
              <Corner f={f} kill={kill} />
            </div>
          )}

          {/* motas: viven en todo el movimiento, se enfrían y se entibian con la luz */}
          <Motes f={f} tint={airTint} op={0.55 + lt * 0.5} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* velo del BLANCO FALSO (acto 1) */}
      {veil > 0.002 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(96% 76% at 42% 34%, ${rgba("#FFFFFF", veil)} 0%, ${rgba(
              "#FFFFFF",
              veil * 0.34,
            )} 46%, rgba(255,255,255,0) 78%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* golpe de luz del CLIC (acto 2) */}
      {f >= 366 && f < 374 && (
        <AbsoluteFill style={{ background: rgba(MD.white, ip(f, [366, 374], [0.1, 0], ID)), pointerEvents: "none" }} />
      )}
      {/* golpe del corte en el beat "Print it." */}
      {f >= A3B && f < A3B + 4 && (
        <AbsoluteFill style={{ background: rgba(MD.bone, ip(f, [A3B, A3B + 4], [0.12, 0], ID)), pointerEvents: "none" }} />
      )}

      {/* ── COSTURAS ────────────────────────────────────────────────────────────────────── */}
      {/* @500 OCLUSIÓN: la regla roja tapa el 100% y detrás ya está el papel */}
      <Occluder at={A3 - 6} dur={16} color={MD.red} angle={-6} />
      <Occluder at={A3 - 2} dur={14} color={MD.ink0} angle={-6} />
      {/* @1012 WIPE POR MATERIA: el vapor del baño */}
      <VaporWipe at={A4 - 14} dur={30} />
      <VaporWipe at={A4 - 4} dur={26} />
      {/* brillos vivos en los holds */}
      <Sheen at={228} dur={30} angle={22} />
      <Sheen at={868} dur={34} angle={12} />
      <Sheen at={T_END + 16} dur={40} angle={16} />

      {/* ── TEXTO (fuera del mundo 3D: legible y dentro de la safe area) ─────────────────── */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)` }}>
        {/* ACTO 1 */}
        {f < 300 && (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 104,
              width: 1020,
              transform: `translateY(${(ip(f, [262, 296], [0, 190], E_IN)).toFixed(1)}px)`,
              clipPath: `inset(0 0 ${(ip(f, [268, 296], [0, 100], E_IN)).toFixed(1)}% 0)`,
            }}
          >
            <TextBed pad={30}>
              <div style={{ opacity: ip(f, [10, 24], [0, 1], E_OUT), transform: `translateX(${ip(f, [10, 26], [-18, 0], E_OUT).toFixed(1)}px)` }}>
                <Kicker>You were measuring color</Kicker>
              </div>
              <div style={{ marginTop: 14 }}>
                <Words f={f} at={60} text="GONE MEANT WHITE." size={76} serifOn={["WHITE"]} />
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: F_SANS,
                  fontWeight: 600,
                  fontSize: 32,
                  color: rgba(MD.bone, 0.72),
                  opacity: ip(f, [112, 132], [0, 1], E_OUT),
                }}
              >
                and there is an industry delighted to sell it
              </div>
            </TextBed>
          </div>
        )}

        {/* ACTO 2 */}
        {f > 300 && f < 520 && (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 104,
              width: 1120,
              transform: `translateY(${(ip(f, [486, 510], [0, 200], E_IN)).toFixed(1)}px)`,
            }}
          >
            <TextBed pad={30}>
              <div style={{ opacity: ip(f, [304, 318], [0, 1], E_OUT) }}>
                <Kicker>Change the ruler</Kicker>
              </div>
              <div style={{ marginTop: 14 }}>
                <Words f={f} at={330} text="MEASURE DEAD, NOT WHITE." size={70} serifOn={["DEAD"]} />
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: F_SERIF,
                  fontStyle: "italic",
                  fontSize: 34,
                  color: rgba(MD.bone, 0.8),
                  opacity: ip(f, [452, 470], [0, 1], E_OUT),
                  transform: `translateX(${ip(f, [452, 474], [-14, 0], E_OUT).toFixed(1)}px)`,
                }}
              >
                and it stays fixed
              </div>
            </TextBed>
          </div>
        )}

        {/* ACTO 4 — el texto va arriba: la lista ocupa el centro */}
        {f > A4 + 10 && f < A5 + 6 && (
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 92,
              width: 1160,
              transform: `translateY(${(ip(f, [1286, 1308], [0, -170], E_IN)).toFixed(1)}px)`,
              opacity: 1 - ip(f, [1290, 1308], [0, 1], ID),
            }}
          >
            <TextBed pad={28}>
              <div style={{ opacity: ip(f, [1026, 1042], [0, 1], E_OUT) }}>
                <Kicker>If you do one thing tonight</Kicker>
              </div>
              <div style={{ marginTop: 12 }}>
                <Words f={f} at={1046} text="DO THE TOILET." size={74} serifOn={["TOILET"]} step={4} />
              </div>
            </TextBed>
          </div>
        )}

        {/* ACTO 5 */}
        {f > A5 + 6 && (
          <>
            {f < T_END - 12 && (
              <div
                style={{
                  position: "absolute",
                  left: 104,
                  bottom: 128,
                  width: 880,
                  transform: `translateY(${(ip(f, [T_END - 36, T_END - 14], [0, 260], E_IN)).toFixed(1)}px)`,
                  clipPath: `inset(0 0 ${(ip(f, [T_END - 34, T_END - 14], [0, 100], E_IN)).toFixed(1)}% 0)`,
                }}
              >
                <TextBed pad={26}>
                  <div style={{ opacity: ip(f, [1316, 1332], [0, 1], E_OUT) }}>
                    <Kicker>That spot was never</Kicker>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Words f={f} at={1336} text="STUBBORN." size={72} serifOn={["STUBBORN"]} />
                  </div>
                </TextBed>
              </div>
            )}
            <Stamps f={f} endAt={T_END} />
          </>
        )}

        {/* EL REMATE — el último frame queda ENCENDIDO */}
        {f >= T_END - 24 && (
          <div
            style={{
              position: "absolute",
              left: 104,
              bottom: 132,
              width: 1300,
              transform: `translateY(${(ip(f, [T_END - 22, T_END - 6], [46, 0], E_OUT)).toFixed(1)}px)`,
            }}
          >
            <TextBed pad={32}>
              <div style={{ opacity: ip(f, [T_END - 22, T_END - 8], [0, 1], E_OUT) }}>
                <Kicker color={MD.warm}>It was never actually dead</Kicker>
              </div>
              <div style={{ marginTop: 14 }}>
                <Words
                  f={f}
                  at={T_END + 2}
                  text="NOW YOU KNOW HOW TO KILL IT."
                  size={68}
                  step={2.2}
                  serifOn={["KILL"]}
                  accent={MD.redHot}
                />
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 5,
                  width: `${(ip(f, [T_END + 10, T_END + 40], [0, 96], E_OUT)).toFixed(1)}%`,
                  background: `linear-gradient(90deg, ${MD.warm}, ${rgba(MD.warm, 0)})`,
                  boxShadow: `0 0 18px ${rgba(MD.warm, 0.7)}`,
                  borderRadius: 3,
                }}
              />
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      {/* rebote cálido final: el cuarto queda habitado, nunca en negro */}
      {f > A5 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(74% 58% at 78% 104%, ${rgba(MD.warm, 0.1 + ip(f, [A5, D], [0, 0.14], E_SOFT))} 0%, rgba(0,0,0,0) 62%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
