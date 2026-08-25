// MovVerdict.tsx — MOVIMIENTO 1 · "EL RELOJ DE RETORNO" · 960 frames @30fps (32 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA. Una atmósfera (<RingAtmos/>) montada UNA vez, un PhotoPlane de fondo
// que nunca se cambia (el baño donde pasó todo), UNA cámara `gcam(f, …)` que viaja z −180 → +240
// y NUNCA vuelve a cero, y una LUZ que va FRÍO → ROJO (la lejía, la que pierde) → CÁLIDO (la
// resolución). Encima, un `view` que ABRE el encuadre (1.34 → 0.74) para que el z creciente se
// lea de verdad como "cámara alta y alejada" y no como un simple acercamiento.
//
// LA MATERIA QUE CRUZA TODAS LAS FRONTERAS: **EL CALENDARIO**. Los 120 cuadraditos nacen UNA vez
// (f146) y NUNCA se redibujan: se DESENVUELVEN (4 filas de 30 en la pared → una regla horizontal
// de días) y se ENCIENDEN hasta el 38. La cinta azul del piso del acto 1 es, literalmente, el eje
// de esa regla. Las barras de días crecen desde el BORDE de la tarjeta de cada contendiente y
// aterrizan sobre esa misma regla, con un pelo vertical que las ata al cuadradito exacto.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF — nada se reinicia entre actos
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–150 · "THE RIG"   (protagonista: la tarjeta con el clip de la CINTA AZUL)
//   enterFrom cam {z −180, view 1.34, ry +5, rx −3 — hereda el corte del avatar en plano medio}
//             luz {FRÍA, key izq 0.22, intensidad 0.95}
//             materia {la cinta azul del piso empieza a correr de izq. a der. — será el EJE}
//   exitTo    cam {z −64, view 1.14}   luz {FRÍA, key 0.31}
//             materia {la tarjeta hero contraída al tamaño EXACTO de un cuadradito de calendario}
//   ── FRONTERA A @128-172 ····· MATCH-SHAPE ·······································
//      La MediaCard del bluetape se encoge (1000×563 → 34×42) hasta el rect del DÍA 1; una tapa
//      de cuadradito cierra sobre ella (wipe abajo→arriba), la tarjeta se desmonta debajo, y la
//      tapa se abre hacia arriba dejando el cuadradito real. Mismo rectángulo, otro contenido.
//
// ACTO 2 · f150–382 · "FOUR MONTHS"   (protagonista: LA GRILLA que se extiende)
//   enterFrom cam {z −64}  luz {FRÍA, key 0.31}  materia {el DÍA 1 recién nacido}
//   exitTo    cam {z +18, panX −40}  luz {FRÍA alta, key 0.46, intensidad 1.20}
//             materia {120 cuadraditos vivos, ya desenvolviéndose hacia la regla}
//   ── FRONTERA B @364-396 ····· WIPE POR MATERIA (<SeamWipeMatter/>) ···············
//      La descarga de agua cruza el cuadro; DEBAJO del vapor la grilla termina de desenvolverse
//      (u 0→1) y el carrusel de los tres contendientes ya está montado detrás.
//
// ACTO 3 · f382–506 · "THREE CONTENDERS"   (protagonista: el <Carousel3D/> de clips reales)
//   enterFrom cam {z +18}  luz {vira a ROJO — el que peor sale tiñe la escena}
//             materia {la regla de días ya es el eje; las barras nacen del borde de la tarjeta}
//   exitTo    cam {z +82, panY −26}  luz {ROJO pleno, key 0.58}
//             materia {tres barras aterrizadas: 9 · 16 · 19}
//   ── FRONTERA C @498-514 ····· OCLUSIÓN (<SeamOcclude/>) ·························
//      "A fourth test broke the whole thing open": una losa cruza el cuadro entero y detrás ya
//      no está el carrusel, está la tarjeta hero del peróxido. La regla NO se toca.
//
// ACTO 4 · f506–722 · "THE FOURTH"   (protagonista: la MediaCard del peróxido sobre el aro)
//   enterFrom cam {z +82}  luz {ROJO cediendo}  materia {la barra 4 sale del borde de la tarjeta}
//   exitTo    cam {z +186, view 0.86}  luz {ROJO → neutro, empieza el cálido}
//             materia {38 cuadraditos encendidos; la barra hueso cruza casi todo el cuadro}
//   (beat interno @636: <SeamFlash/> — la tarjeta cambia de material EN EL MISMO RECT: el clip
//    del peróxido pasa a ser la foto del muro de marcas = "los 20 años anteriores")
//   ── FRONTERA D @700-740 ····· ZOOM-THROUGH ······································
//      La tarjeta del muro de marcas escala ×4.2 y PASA el plano de la cámara (nos comemos la
//      foto); detrás ya está la lámina real de la guía. Sin fundido: nos atravesó.
//
// ACTO 5 · f722–960 · "TAKE IT AND GO"   (protagonista: la lámina `lam_daysback` de la guía)
//   enterFrom cam {z +192}  luz {CÁLIDA naciendo}  materia {la regla entera encendida, 38 días}
//   exitTo    cam {z +240, view 0.74 — alta y alejada}  luz {CÁLIDA baja, intensidad 0.82}
//             materia {LA GRILLA DEL CALENDARIO ILUMINADA — es lo que recibe el próximo mov.}
//   (beat @907 <SeamFlash/> cálido: "I'm not holding it hostage")
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero blur grande a pantalla · cero fade.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import {
  RING, F_SANS, rgba, lerp, clamp01, rnd, gcam, light,
  RingAtmos, Layers, Plane, MediaCard, Carousel3D, PhotoPlane,
  SeamOcclude, SeamWipeMatter, SeamFlash, Kick, Head, Em, Bed,
} from "./RingStage";

export const MOVVERDICT_FRAMES = 960;
const END = MOVVERDICT_FRAMES;

/* ── anclas del guion (frames absolutos: el audio manda) ─────────────────────────────────── */
const K = {
  phone: 105, counted: 236, pulled: 388,
  fourth: 506, idiot: 630, answer: 719, godo: 830, hostage: 907,
};
const A1 = 0, A2 = 150, A3 = 382, A4 = 506, A5 = 722;
const SEAM_A = 128, SEAM_B = 364, SEAM_C = 498, SEAM_D = 700;

type Ease = (t: number) => number;
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1) as Ease,
  push: Easing.bezier(0.58, 0.0, 0.22, 1) as Ease,
  snap: Easing.bezier(0.14, 0.86, 0.22, 1) as Ease,
  soft: Easing.bezier(0.42, 0.06, 0.36, 1) as Ease,
  brake: Easing.bezier(0.05, 0.84, 0.12, 1) as Ease,
  settle: Easing.poly(5) as Ease,
  lin: ((t: number) => t) as Ease,
};

/** rampa multi-key con easing POR SEGMENTO — el easing nunca es constante en toda la pieza */
const keyed = (f: number, ks: number[], vs: number[], e: Ease | Ease[] = EZ.glide): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const t = clamp01((f - ks[i]) / (ks[i + 1] - ks[i]));
  const ef: Ease = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL INSTRUMENTO — geometría en px de frame (1920×1080). La grilla y las barras COMPARTEN el
   plano z=0 para que un día mida exactamente lo mismo en las dos.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const DAYS = 120;              // cuatro meses
const GRID_P = 30;             // días por fila del calendario de pared
const GRID_X = 232, GRID_Y = 452, GX = 46, GY = 58;
const RULER_X = 232, RULER_Y = 706, RPITCH = 40;
const AXIS_Y = RULER_Y + 32;
const GRID_BIRTH = 146;

const cellRect = (i: number, u: number) => {
  const col = i % GRID_P;
  const row = (i - col) / GRID_P;
  return {
    x: lerp(GRID_X + col * GX, RULER_X + i * RPITCH, u),
    y: lerp(GRID_Y + row * GY, RULER_Y, u),
    w: lerp(34, 30, u),
    h: lerp(42, 26, u),
  };
};
// rect del DÍA 1 — es el objetivo del MATCH-SHAPE del acto 1
const D1 = cellRect(0, 0);

const DayGrid: React.FC<{ f: number; u: number; reach: number; glow: string }> = ({ f, u, reach, glow }) => (
  <>
    {Array.from({ length: DAYS }, (_, i) => {
      const born = clamp01((f - (GRID_BIRTH + i * 1.42)) / 13);
      if (born <= 0.002) return null;
      const b = EZ.snap(born);
      const r = cellRect(i, u);
      const hot = clamp01(reach - i);
      const lead = hot > 0.02 && hot < 0.98 ? 1 : 0;
      return (
        <div key={i} style={{
          position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h,
          transform: `translateY(${((1 - b) * -18).toFixed(2)}px) scale(${(0.46 + b * 0.54).toFixed(3)})`,
          borderRadius: 3, opacity: b,
          background: hot > 0
            ? `linear-gradient(180deg, ${rgba(glow, 0.30 + 0.44 * hot)} 0%, ${rgba(glow, 0.55 + 0.34 * hot)} 100%)`
            : `linear-gradient(180deg, ${rgba(RING.bone, 0.13)} 0%, ${rgba(RING.cold, 0.06)} 100%)`,
          border: `1px solid ${hot > 0 ? rgba(glow, 0.55) : rgba(RING.cold, 0.24)}`,
          boxShadow: hot > 0
            ? `0 0 ${(9 + 16 * hot + lead * 14).toFixed(0)}px ${rgba(glow, 0.34 * hot + lead * 0.2)}, inset 0 1px 0 ${rgba(RING.white, 0.22)}`
            : `inset 0 1px 0 ${rgba(RING.white, 0.10)}`,
        }} />
      );
    })}
  </>
);

/* ── EL EJE: la cinta azul del piso del acto 1 se convierte en la regla de días ─────────── */
const TapeAxis: React.FC<{ f: number; u: number }> = ({ f, u }) => {
  const grow = EZ.glide(clamp01((f - 34) / 54));
  const y = lerp(786, AXIS_Y, u);
  const w = lerp(1360, 38 * RPITCH, u) * grow;
  const on = clamp01((u - 0.32) / 0.4);
  return (
    <div style={{ position: "absolute", left: RULER_X, top: y, width: w, height: lerp(11, 5, u) }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 2,
        background: `linear-gradient(90deg, ${rgba(RING.cold, 0.30)} 0%, ${rgba(RING.cold, 0.72)} 8%, ${rgba(RING.cold, 0.62)} 88%, ${rgba(RING.cold, 0.22)} 100%)`,
        boxShadow: `0 6px 18px ${rgba(RING.ink0, 0.72)}, inset 0 1px 0 ${rgba(RING.white, 0.35)}`,
      }} />
      {on > 0.01 && Array.from({ length: 3 }, (_, t) => {
        const d = (t + 1) * 10;
        return (
          <div key={t} style={{ position: "absolute", left: d * RPITCH - 1, top: -2, opacity: on }}>
            <div style={{ width: 2, height: 16, background: rgba(RING.cold, 0.6) }} />
            <div style={{
              position: "absolute", left: -14, top: 20, width: 30, textAlign: "center",
              fontFamily: F_SANS, fontWeight: 800, fontSize: 17, letterSpacing: 1.2, color: rgba(RING.cold, 0.82),
            }}>{d}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ── LA BARRA DE DÍAS — nace en el BORDE de la tarjeta y aterriza en la regla ───────────── */
const Bar: React.FC<{
  f: number; y: number; h: number; days: number; at: number;
  name: string; sub: string; heat: number; hero?: boolean; ox: number; oy: number;
}> = ({ f, y, h, days, at, name, sub, heat, hero = false, ox, oy }) => {
  if (f < at) return null;
  const run = keyed(f, [at, at + 13, at + 13 + days * 3.1], [0, 0, days], [EZ.lin, EZ.brake]);
  const land = EZ.snap(clamp01((f - at) / 26));
  const dx = (ox - RULER_X) * (1 - land);
  const dy = (oy - y) * (1 - land);
  const w = Math.max(3, run * RPITCH - 6);
  const col = hero ? RING.bone : light(heat, "cold", "red");
  const shown = Math.round(run);
  const done = clamp01((run - days + 0.6) / 0.6);
  const pulse = 1 + Math.sin(f / 26 + y) * 0.012;
  const riser = Math.max(0, y - RULER_Y - 26) * done;
  return (
    <div style={{ position: "absolute", left: RULER_X, top: y, transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` }}>
      {/* riel: los 38 días completos, apagados */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: 38 * RPITCH - 6, height: h, borderRadius: 4,
        background: `linear-gradient(180deg, ${rgba(RING.white, 0.045)} 0%, ${rgba(RING.ink0, 0.30)} 100%)`,
        border: `1px solid ${rgba(RING.cold, 0.13)}`,
      }} />
      {/* rótulo — a la izquierda del cero */}
      <div style={{ position: "absolute", left: -178, top: h * 0.5 - 26, width: 162, textAlign: "right" }}>
        <div style={{
          fontFamily: F_SANS, fontWeight: 800, fontSize: hero ? 24 : 21, letterSpacing: 1.8,
          color: hero ? RING.white : rgba(RING.white, 0.86), textTransform: "uppercase",
          textShadow: "0 3px 14px rgba(0,0,0,0.9)",
        }}>{name}</div>
        <div style={{
          fontFamily: F_SANS, fontWeight: 600, fontSize: 15, letterSpacing: 0.6, marginTop: 3,
          color: rgba(RING.cold, 0.78), textShadow: "0 3px 12px rgba(0,0,0,0.9)",
        }}>{sub}</div>
      </div>
      {/* la barra */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 4,
        transform: `scaleY(${pulse.toFixed(4)})`, transformOrigin: "50% 50%",
        background: `linear-gradient(180deg, ${rgba(col, hero ? 0.97 : 0.88)} 0%, ${rgba(col, hero ? 0.70 : 0.48)} 100%)`,
        boxShadow: `0 12px 30px ${rgba(RING.ink0, 0.72)}, inset 0 1px 0 ${rgba(RING.white, 0.42)}, 0 0 ${hero ? 30 : 18}px ${rgba(col, 0.28)}`,
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: 4,
          background: `linear-gradient(92deg, rgba(255,255,255,0) 62%, ${rgba(RING.white, 0.22)} 84%, rgba(255,255,255,0) 100%)`,
        }} />
      </div>
      {/* pip del día en que VOLVIÓ el aro + pelo vertical que lo ata al cuadradito de la regla */}
      <div style={{
        position: "absolute", left: w - 3, top: -riser, width: 3, height: riser + h,
        background: rgba(RING.redHot, 0.55 * done),
        boxShadow: `0 0 12px ${rgba(RING.red, 0.6 * done)}`,
      }} />
      {/* el número */}
      {hero ? (
        <div style={{ position: "absolute", left: Math.max(24, w - 236), top: h * 0.5 - 46, display: "flex", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 84, lineHeight: 0.9, color: RING.ink0, letterSpacing: -2 }}>{shown}</div>
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 26, letterSpacing: 4, color: rgba(RING.ink0, 0.66) }}>DAYS</div>
        </div>
      ) : (
        <div style={{ position: "absolute", left: w + 20, top: h * 0.5 - 24, display: "flex", alignItems: "baseline", gap: 8 }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 46, lineHeight: 0.9, color: RING.white, textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}>{shown}</div>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 17, letterSpacing: 3, color: rgba(RING.cold, 0.8) }}>DAYS</div>
        </div>
      )}
    </div>
  );
};

/* ── partículas del aire del baño (hold VIVO en el plano de adelante) ───────────────────── */
const Motes: React.FC<{ f: number; tint: string; n?: number }> = ({ f, tint, n = 32 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(i * 2.17), b = rnd(i * 5.03);
      const x = a * 100 + Math.sin(f / (68 + b * 62) + i) * 2.3;
      const y = ((b * 1240 - f * (0.13 + a * 0.36)) % 1240 + 1240) % 1240;
      const d = 1.5 + b * 3.4;
      return <div key={i} style={{
        position: "absolute", left: `${x}%`, top: 1180 - y, width: d, height: d, borderRadius: "50%",
        background: rgba(tint, 0.9), opacity: 0.13 + a * 0.4,
      }} />;
    })}
  </>
);

/* ── CUE de texto: entra y sale por WIPE (clip-path), jamás por opacity ─────────────────── */
const Cue: React.FC<{
  f: number; from: number; to: number; side: "tl" | "tr" | "bl" | "br";
  px: number; py: number; children: React.ReactNode;
}> = ({ f, from, to, side, px, py, children }) => {
  if (f < from || f > to + 2) return null;
  const i = EZ.snap(clamp01((f - from) / 16));
  const o = EZ.push(clamp01((f - (to - 14)) / 14));
  const top = side.charAt(0) === "t";
  const right = side.charAt(1) === "r";
  const float = Math.sin(f / 71) * 2.2;
  const box: React.CSSProperties = {
    position: "absolute",
    textAlign: right ? "right" : "left",
    transform: `translate(0px, ${((1 - i) * 34 - o * 26 + float).toFixed(2)}px)`,
    clipPath: `inset(${(o * 100).toFixed(1)}% 0px ${((1 - i) * 100).toFixed(1)}% 0px)`,
  };
  if (top) box.top = py; else box.bottom = py;
  if (right) box.right = px; else box.left = px;
  return <div style={box}>{children}</div>;
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovVerdict: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(Math.max(frame, 0), END - 1);           // aguanta durationInFrames ≠ 960
  const last = Math.max(90, Math.min(durationInFrames, END));

  /* ── LA CÁMARA: UNA sola llamada a gcam sobre el frame GLOBAL. Nunca vuelve a 0. ──────── */
  const G = gcam(f, { z0: -180, z1: 240, panX: -104, panY: -38, ry: -6, rx: 3, dur: END });
  // micro-acentos por acto: siempre hacia adelante (el z total nunca retrocede)
  const mz = keyed(f, [A1, A2, A3, A4, SEAM_D, A5, END],
    [0, 16, 30, 44, 62, 66, 70], [EZ.soft, EZ.glide, EZ.push, EZ.push, EZ.snap, EZ.settle]);
  const mx = keyed(f, [A1, 96, A2, 260, A3, 470, A4, 640, A5, END],
    [0, -18, -6, 26, 8, -22, 14, -6, 10, 0],
    [EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.settle]);
  const my = keyed(f, [A1, A2, A3, A4, 660, A5, END],
    [0, 10, -8, -22, -6, 6, 18], [EZ.glide, EZ.soft, EZ.push, EZ.soft, EZ.glide, EZ.settle]);
  // el ENCUADRE abre: compensa la escala de perspectiva del z creciente y sobre-abre al final
  const view = keyed(f, [A1, A2, A3, A4, SEAM_D, A5, 900, END],
    [1.34, 1.16, 1.00, 0.94, 0.88, 0.84, 0.77, 0.74],
    [EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.push, EZ.glide, EZ.settle]);
  const camStr =
    `${G.transform} translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, ${mz.toFixed(2)}px) scale(${view.toFixed(4)})`;

  /* ── LA LUZ: FRÍO → ROJO (la lejía pierde) → CÁLIDO (la resolución) ───────────────────── */
  const redPhase = clamp01((f - A3 + 8) / 78) * (1 - clamp01((f - 596) / 110));
  const warmPhase = clamp01((f - SEAM_D + 10) / 190);
  const tint = warmPhase > 0.02 ? light(warmPhase, "cold", "warm") : light(redPhase, "cold", "red");
  const glow = warmPhase > 0.02 ? light(warmPhase * 0.86, "red", "warm") : RING.red;
  const keyPos = keyed(f, [A1, A2, A3, A4, 660, A5, END],
    [0.22, 0.31, 0.46, 0.58, 0.44, 0.34, 0.27], [EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.settle]);
  const intensity = keyed(f, [A1, A2, A3, A4, A5, END], [0.95, 1.10, 1.20, 1.14, 0.94, 0.82], EZ.soft);

  /* ── LA MATERIA: la grilla. u = desenvolverse; reach = días encendidos ────────────────── */
  const u = keyed(f, [340, 396], [0, 1], EZ.push);
  const RUN: { days: number; at: number }[] = [
    { days: 9, at: 404 }, { days: 16, at: 438 }, { days: 19, at: 470 }, { days: 38, at: 546 },
  ];
  const reach = RUN.reduce((m, r) =>
    Math.max(m, keyed(f, [r.at, r.at + 13, r.at + 13 + r.days * 3.1], [0, 0, r.days], [EZ.lin, EZ.brake])), 0);

  /* ── ACTO 1 · MATCH-SHAPE: la tarjeta hero se contrae al rect del DÍA 1 ───────────────── */
  const shrink = EZ.push(clamp01((f - SEAM_A) / 22));                 // 128 → 150
  const heroW = lerp(1000, D1.w, shrink);
  const heroH = lerp(563, D1.h, shrink);
  const heroX = lerp(46, ((D1.x + D1.w / 2) / 1920) * 100, shrink);
  const heroY = lerp(44, ((D1.y + D1.h / 2) / 1080) * 100, shrink);
  const capIn = EZ.snap(clamp01((f - 138) / 12));
  const capOut = EZ.push(clamp01((f - 160) / 12));

  /* ── ACTO 3 · el carrusel de los tres ─────────────────────────────────────────────────── */
  const spin = keyed(f, [378, 418, 452, 506], [0, -0.3333, -0.6667, -0.6667],
    [EZ.push, EZ.snap, EZ.settle]) + Math.sin(f / 96) * 0.006;
  const focus = f < 418 ? 0 : f < 452 ? 1 : 2;
  // "I pulled it out of my own house": el carrusel recibe un TIRÓN lateral en K.pulled
  const yank = EZ.snap(clamp01((f - K.pulled) / 22)) * (1 - EZ.push(clamp01((f - K.pulled - 40) / 26)));

  /* ── ACTO 4 · la tarjeta hero y el ZOOM-THROUGH ───────────────────────────────────────── */
  const heroIn = EZ.snap(clamp01((f - A4) / 22));
  const through = EZ.push(clamp01((f - SEAM_D) / 40));                // 700 → 740
  const thruScale = lerp(1, 4.2, through);
  const lamGrow = EZ.snap(clamp01((f - 706) / 30));

  /* ── salida ──────────────────────────────────────────────────────────────────────────── */
  const outro = clamp01((frame - (last - 46)) / 46);

  return (
    <AbsoluteFill style={{ backgroundColor: RING.ink0, overflow: "hidden" }}>
      {/* ATMÓSFERA — montada UNA vez para los 960 frames. Nunca se remonta entre actos. */}
      <RingAtmos tint={tint} keyFrom={keyPos} intensity={intensity} />

      {/* EL MUNDO, bajo UNA sola cámara, en 6 planos de parallax */}
      <Layers cam={camStr}>
        {/* z −560 · el baño donde pasó todo: UNA foto de fondo para los 32 s */}
        <Plane z={-560}>
          <PhotoPlane src="img/mdring_h26_standlook.jpg" z={0} scale={1.26} dim={0.70} />
        </Plane>

        {/* z −360 · la ventanita fría alta a la izquierda: el haz de la key */}
        <Plane z={-360}>
          <AbsoluteFill style={{
            background: `linear-gradient(172deg, ${rgba(tint, 0.20 * intensity)} 0%, ${rgba(tint, 0.05)} 30%, rgba(0,0,0,0) 62%)`,
            mixBlendMode: "screen",
          }} />
          <div style={{
            position: "absolute", left: `${(4 + keyPos * 18).toFixed(1)}%`, top: "-24%", width: 560, height: "156%",
            transform: `rotate(${(9 - keyPos * 5).toFixed(2)}deg)`,
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(tint, 0.11 * intensity)} 46%, rgba(0,0,0,0) 100%)`,
            mixBlendMode: "screen",
          }} />
        </Plane>

        {/* z −180 · eco lejano de la grilla en los azulejos: profundidad, no información */}
        <Plane z={-180} style={{ opacity: 0.2 }}>
          <div style={{
            position: "absolute", left: 120, top: 300, width: 1700, height: 540,
            transform: `translateX(${(Math.sin(f / 133) * 10).toFixed(1)}px)`,
            background:
              `repeating-linear-gradient(90deg, ${rgba(RING.cold, 0.10)} 0 1px, rgba(0,0,0,0) 1px 46px),` +
              `repeating-linear-gradient(180deg, ${rgba(RING.cold, 0.10)} 0 1px, rgba(0,0,0,0) 1px 58px)`,
          }} />
        </Plane>

        {/* z 0 · EL INSTRUMENTO — eje + grilla + barras. Un día mide lo mismo en todos. */}
        <Plane z={0}>
          <TapeAxis f={f} u={u} />
          <DayGrid f={f} u={u} reach={reach} glow={glow} />
          <Bar f={f} y={774} h={36} days={9} at={404} heat={1}
            name="Bleach" sub="poured into a full bowl" ox={946} oy={588} />
          <Bar f={f} y={826} h={36} days={16} at={438} heat={0.62}
            name="Acid gel" sub="only if it is mineral" ox={946} oy={588} />
          <Bar f={f} y={878} h={36} days={19} at={470} heat={0.46}
            name="Bleach" sub="water off · poultice" ox={946} oy={588} />
          <Bar f={f} y={932} h={46} days={38} at={546} heat={0} hero
            name="Peroxide" sub="water off · poultice" ox={1012} oy={664} />
        </Plane>

        {/* z +40 · el carrusel 3D de los tres contendientes, con sus clips corriendo adentro */}
        {f > 376 && f < 512 && (
          <Plane z={40} style={{
            transform: `translateZ(40px) translateX(${(yank * -260).toFixed(1)}px) rotate(${(yank * -2.4).toFixed(2)}deg)`,
          }}>
            <Carousel3D
              items={[
                { src: "broll/mdring_h34_bleachpour.mp4", kind: "video", label: "BLEACH · FULL BOWL" },
                { src: "broll/mdring_h42_gelunderrim.mp4", kind: "video", label: "ACID GEL · UNDER THE RIM" },
                { src: "img/mdring_h34_bleachpour.jpg", kind: "photo", label: "BLEACH · WATER OFF" },
              ]}
              spin={spin} radius={540} cardW={520} cardH={293} y={40} focus={focus}
            />
          </Plane>
        )}

        {/* z +120 · las tarjetas hero: UNA protagonista por acto, siempre con material real */}
        <Plane z={120}>
          {/* ACTO 1 — la cinta azul en el piso (el rig) */}
          {f < 149 && (
            <MediaCard src="broll/mdring_h23_bluetape.mp4" kind="video"
              w={heroW} h={heroH} x={heroX} y={heroY} z={0}
              ry={lerp(7, 0, shrink)} rx={lerp(-2, 0, shrink)} radius={lerp(14, 3, shrink)}
              sheenAt={16} lit={1} label={shrink < 0.12 ? "TAPE ON THE FLOOR" : undefined} />
          )}
          {/* ACTO 1 — el teléfono apoyado en la marca (entra deslizándose, jamás por opacity) */}
          {f > K.phone - 12 && f < 176 && (
            <MediaCard src="broll/mdring_h24_phoneonmark.mp4" kind="video"
              w={556} h={313}
              x={keyed(f, [K.phone - 12, K.phone + 10, 158, 176], [122, 76, 78, 128], [EZ.snap, EZ.lin, EZ.push])}
              y={68} z={180} ry={-13} rx={3} radius={12} sheenAt={K.phone + 2} label="PHONE ON THE MARK" />
          )}
          {/* la TAPA del cuadradito — cierra sobre la tarjeta y se abre dejando el DÍA 1 */}
          {f > 137 && f < 174 && (
            <div style={{
              position: "absolute", left: D1.x, top: D1.y, width: D1.w, height: D1.h, borderRadius: 3,
              clipPath: `inset(${(capOut * 100).toFixed(1)}% 0px ${((1 - capIn) * 100).toFixed(1)}% 0px)`,
              background: `linear-gradient(180deg, ${rgba(RING.bone, 0.20)} 0%, ${rgba(RING.cold, 0.09)} 100%)`,
              border: `1px solid ${rgba(RING.cold, 0.5)}`,
              boxShadow: `0 0 22px ${rgba(RING.cold, 0.36)}, inset 0 1px 0 ${rgba(RING.white, 0.4)}`,
            }} />
          )}

          {/* ACTO 2 — el calendario de la pared: la mano escribe el número del día */}
          {f > 162 && f < 288 && (
            <MediaCard src="broll/mdring_h25_calendar.mp4" kind="video"
              w={604} h={340}
              x={keyed(f, [162, 184, 268, 288], [-16, 22, 21, -18], [EZ.snap, EZ.lin, EZ.push])}
              y={24} z={140} ry={11} rx={-3} radius={12} sheenAt={186} label="DAYS COUNTED" />
          )}
          {/* ACTO 2 — el muro de marcas (el mismo material que vuelve en el acto 4) */}
          {f > 250 && f < 380 && (
            <MediaCard src="broll/mdring_h52_calendarmarks.mp4" kind="video"
              w={556} h={313}
              x={keyed(f, [250, 272, 356, 380], [118, 78, 79, 120], [EZ.snap, EZ.lin, EZ.push])}
              y={26} z={210} ry={-12} rx={3} radius={12} sheenAt={274} label="FOUR MONTHS" />
          )}

          {/* ACTO 4 — el peróxido sobre el aro y, EN EL MISMO RECT, el muro de los 20 años.
              El grupo entero escala ×4.2 en la FRONTERA D: nos pasa por al lado (zoom-through) */}
          {f > A4 - 4 && f < 741 && (
            <div style={{
              position: "absolute", inset: 0, transformStyle: "preserve-3d",
              transform: `scale(${thruScale.toFixed(3)})`, transformOrigin: "32% 40%",
            }}>
              {f < 638 ? (
                <MediaCard src="broll/mdring_h15_pouronring.mp4" kind="video"
                  w={lerp(560, 780, heroIn)} h={lerp(315, 439, heroIn)} x={32} y={40} z={0}
                  ry={lerp(-9, 2, heroIn)} rx={lerp(4, -1, heroIn)} radius={14}
                  sheenAt={A4 + 12} label="PEROXIDE · WATER OFF" />
              ) : (
                <MediaCard src="img/mdring_h52_calendarmarks.jpg" kind="photo"
                  w={780} h={439} x={32} y={40} z={0} ry={2} rx={-1}
                  radius={lerp(14, 0, through)} sheenAt={642}
                  label={through < 0.1 ? "20 YEARS OF DOING IT WRONG" : undefined} />
              )}
            </div>
          )}

          {/* ACTO 5 — LA LÁMINA REAL DE LA GUÍA: la respuesta, en la mano, sin rehén */}
          {f > 704 && (
            <MediaCard src="img/mdring_lam_daysback.jpg" kind="photo"
              w={lerp(352, 412, lamGrow)} h={lerp(528, 618, lamGrow)}
              x={71} y={36} z={40} ry={lerp(-13, -5, lamGrow)} rx={2} radius={10}
              sheenAt={742} label="DAYS BACK · THE ANSWER" />
          )}
          {/* ACTO 5 — el plano del fondo se viene ADELANTE, ahora en movimiento */}
          {f > 760 && f < 894 && (
            <MediaCard src="broll/mdring_h26_standlook.mp4" kind="video"
              w={452} h={254}
              x={keyed(f, [760, 782, 872, 894], [-14, 25, 24, -16], [EZ.snap, EZ.lin, EZ.push])}
              y={52} z={170} ry={10} rx={-2} radius={12} sheenAt={786} label="SAME TOILETS" />
          )}
        </Plane>

        {/* z +330 · el aire delante de la cámara */}
        <Plane z={330} style={{ opacity: 0.8 }}>
          <Motes f={f} tint={tint} n={32} />
        </Plane>
      </Layers>

      {/* ══ CAPA DE TEXTO — fuera de la cámara (la safe area no se deforma). 1 idea por acto ══ */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${(-mx * 0.16).toFixed(1)}px, ${(-my * 0.14).toFixed(1)}px)` }}>
        <Cue f={f} from={18} to={132} side="bl" px={96} py={108}>
          <Bed pad={30}>
            <Kick>THREE WEEKS LATER</Kick>
            <div style={{ height: 12 }} />
            <Head size={72}>Same toilets. <Em>Same mark.</Em></Head>
          </Bed>
        </Cue>

        <Cue f={f} from={K.counted - 44} to={352} side="br" px={96} py={112}>
          <Bed pad={30}>
            <Kick>CALENDAR ON THE WALL</Kick>
            <div style={{ height: 12 }} />
            <Head size={68}>Days counted. <Em>Four months.</Em></Head>
          </Bed>
        </Cue>

        <Cue f={f} from={K.pulled + 4} to={488} side="tl" px={96} py={96}>
          <Bed pad={30}>
            <Kick>THREE CONTENDERS</Kick>
            <div style={{ height: 12 }} />
            <Head size={64}>One I pulled <Em>from my house.</Em></Head>
          </Bed>
        </Cue>

        <Cue f={f} from={K.fourth + 18} to={K.idiot + 62} side="tr" px={96} py={96}>
          <Bed pad={30}>
            <Kick>THE FOURTH TEST</Kick>
            <div style={{ height: 12 }} />
            <Head size={66}><Em>Thirty-eight days.</Em> Still gone.</Head>
          </Bed>
        </Cue>

        <Cue f={f} from={K.answer + 32} to={END - 6} side="tl" px={96} py={96}>
          <Bed pad={30}>
            <Kick>HERE IS THE ANSWER</Kick>
            <div style={{ height: 12 }} />
            <Head size={68}>Not holding it <Em>hostage.</Em></Head>
          </Bed>
        </Cue>
      </div>

      {/* ══ LAS COSTURAS — una distinta por frontera. ⛔ ninguna es un fundido ═════════════ */}
      {/* A @128-172 · MATCH-SHAPE: lo resuelven la contracción de la tarjeta y la tapa del
          cuadradito. Le sumo el destello de refracción del instante en que la forma "cuaja". */}
      {f > 142 && f < 168 && (
        <AbsoluteFill style={{
          pointerEvents: "none",
          background: `radial-gradient(46% 40% at ${((D1.x / 1920) * 100).toFixed(1)}% ${((D1.y / 1080) * 100).toFixed(1)}%, ${rgba(RING.cold, 0.30 * Math.sin(clamp01((f - 142) / 26) * Math.PI))} 0%, rgba(0,0,0,0) 70%)`,
        }} />
      )}
      {/* B @364-396 · WIPE POR MATERIA: la descarga cruza; detrás la grilla ya es una regla */}
      <SeamWipeMatter at={SEAM_B} dur={32} tint={RING.cold} />
      {/* C @498-514 · OCLUSIÓN: la losa cruza el cuadro entero y cambia el protagonista */}
      <SeamOcclude at={SEAM_C} dur={16} color={RING.ink2} angle={-7} />
      {/* D @700-740 · ZOOM-THROUGH: la foto pasa el plano de la cámara y nos deja en la lámina */}
      {f > 716 && f < 744 && (
        <AbsoluteFill style={{
          pointerEvents: "none",
          background: `radial-gradient(80% 66% at 32% 40%, rgba(0,0,0,0) 30%, ${rgba(RING.ink0, 0.42 * Math.sin(clamp01((f - 716) / 28) * Math.PI))} 100%)`,
        }} />
      )}
      {/* beats internos (no son fronteras): el cambio de material @636 y el remate @907 */}
      <SeamFlash at={638} color={RING.redHot} dur={6} />
      <SeamFlash at={K.hostage} color={RING.warm} dur={6} />
      {f > K.godo - 8 && f < K.godo + 18 && (
        <AbsoluteFill style={{
          pointerEvents: "none", mixBlendMode: "screen",
          background: `linear-gradient(90deg, ${rgba(RING.warm, 0.14 * Math.sin(clamp01((f - K.godo + 8) / 26) * Math.PI))} 0%, rgba(0,0,0,0) 46%)`,
        }} />
      )}

      {/* viñeta que respira + aberración cromática en los picos (no es un blur global) */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(90% 74% at 50% 50%, rgba(0,0,0,0) 44%, rgba(0,0,0,${(0.2 + outro * 0.14).toFixed(3)}) 100%)`,
      }} />
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: interpolate(f, [K.fourth - 20, K.fourth + 26, 620, 660], [0, 0.11, 0.11, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        background: `linear-gradient(90deg, ${rgba(RING.red, 0.2)} 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, ${rgba(RING.cold, 0.16)} 100%)`,
      }} />
      {/* grano: la misma piel de imagen en los cinco actos */}
      <AbsoluteFill style={{
        pointerEvents: "none", opacity: 0.05,
        backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)",
        backgroundSize: "3px 3px", mixBlendMode: "overlay",
      }} />
    </AbsoluteFill>
  );
};
