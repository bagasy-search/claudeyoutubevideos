// MovCurve.tsx — MOVIMIENTO 5 · "IT NEVER LEFT" · 1140 frames @ 30 fps (38 s)
// Canal Mike Dalton (EN) · video `mdring`. ⛔ NO es un gráfico plano: es UN PLANO SECUENCIA
// de 38 s con material real adentro. El gráfico es el ESQUELETO; los días son CLIPS.
//
// LA IDEA: el aro no volvió — nunca se fue. La colonia DUPLICA. El 1% que dejaste es invisible
// hasta el día 8 y el 90% del aro se construye en los ÚLTIMOS DOS DÍAS. Por eso parece que
// apareció de un día para el otro. El pico es f922→f992: nothing · nothing · nothing → EVERYTHING.
//
// LA MATERIA QUE CRUZA LAS 4 FRONTERAS: **EL PUNTO ROJO**. En el acto 1 es una colonia macro
// pegada a la porcelana (hereda la banda roja con la que termina MovDilution), en el acto 2 es
// el 1% que sobrevive al spray, en el acto 3 es el marcador del día sobre la curva, en el acto 4
// es la pared vertical del día 10 y en el acto 5 son los tres "nothing" que revientan en el aro.
//
// UNA cámara: `gcam(camClock(f), …)` — el reloj está DEFORMADO por acto (el easing nunca es
// constante: la curva es exponencial y la cámara la acompaña), pero es MONÓTONO, así que z va
// de −420 a +560 y NUNCA vuelve. UNA atmósfera `<RingAtmos/>` montada una sola vez.
// LA LUZ: FRÍO (0) → ROJO (la explosión de la curva, f700-990) → CÁLIDO (la resolución, f1040+).
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⟵ ENTRA DEL MOVIMIENTO ANTERIOR (MovDilution)
//     cam {z −420, macro pegado a un punto rojo} · luz {FRÍA baja, key 0.18} · materia {rojo sólido
//     sobre porcelana: la banda que MovDilution dejó pintada}
//
// ACTO 1 · f0-193 · "A COLONY, NOT A LINE"    (protagonista: LA COLONIA MACRO — el punto rojo)
//   enterFrom cam {z −420, net 3.30, foco en el punto} luz {FRÍA, key 0.18, int 0.86}
//             materia {UN blob rojo húmedo sobre porcelana}  material {foto h54_spraywaterline al fondo}
//   f97 "They double." → 1 → 2 → 4 → 8 por mitosis real (cada hijo NACE del padre, no es ruido)
//   exitTo    cam {z ≈ −300, net 1.95} luz {FRÍA, key 0.24} materia {los 8 blobs CONVERGEN en un punto}
//   ── FRONTERA A @f180-206 ····· MATCH-SHAPE ·············································
//      La colonia colapsa su `spread` de 96 → 9 px: la MISMA mancha, misma posición de pantalla,
//      se vuelve el PUNTO DE DATO DEL DÍA 0 — y de abajo de ella nace el eje X. Cero fade.
//
// ACTO 2 · f193-348 · "THE 1% YOU LEFT"       (protagonista: EL 1% que sobrevive)
//   enterFrom cam {z ≈ −300, net 1.95} luz {FRÍA, key 0.26} materia {el punto = día 0}
//   material  {CLIP `h54_spraywaterline.mp4` — los dos golpes de spray en la línea de agua}
//   f205-244 el barrido de limpieza cruza la colonia y se lleva 63 de 64 blobs: queda UNO.
//   f306 "1% is invisible" → nacen el eje Y y LA LÍNEA DEL UMBRAL DEL OJO; el punto queda debajo.
//   exitTo    cam {z ≈ −180, net 1.34} luz {FRÍA alta, key 0.32}
//   ── FRONTERA B @f340-356 ····· MATCH-MOVE ··············································
//      El dedo del clip `h52_calendarmarks` recorre los días marcados hacia la derecha; la cámara
//      truckea a la MISMA velocidad y la fila de tarjetas de los días entra ARRASTRADA por él.
//
// ACTO 3 · f348-599 · "DAY 3. DAY 6. DAY 8."  (protagonista: LA FILA DE TARJETAS EN PROFUNDIDAD)
//   enterFrom cam {z ≈ −180, net 1.34} luz {FRÍA alta} materia {el punto trepando, gris, bajo la línea}
//   material  {DÍA 3 = `h52_calendarmarks.mp4` · DÍA 6 = `h22_weeklysplash.mp4` ·
//              DÍA 8 = `h25_calendar.mp4` — cada una con su clip CORRIENDO adentro, encendiéndose
//              mientras la curva avanza por debajo}
//   exitTo    cam {z ≈ +40, net 1.00} luz {arranca el viraje: 35% de rojo} materia {el trazo toca la línea}
//   ── FRONTERA C @f592-608 ····· OCLUSIÓN ················································
//      La BARRA VERTICAL DEL DÍA 10 sube desde la base, se ensancha a 300% y tapa el 100% del
//      cuadro entre f597 y f604. El corte de acto cae adentro (f599). Es un objeto del gráfico.
//
// ACTO 4 · f599-860 · "IT DIDN'T SHOW UP OVERNIGHT" (protagonista: LA PARED — el 90%)
//   enterFrom cam {z ≈ +40, net 1.00} luz {ROJA plena, key 0.5} materia {la pared roja del día 10}
//   material  {DÍA 10 = `h53_doorwaysatisfied.mp4` (mira la taza que cree limpia) → a f738 la misma
//              tarjeta pasa a la FOTO bajo un barrido especular, sin salto}
//   f710 "It didn't." → un pulso rojo recorre la curva de día 0 a día 10: SIEMPRE estuvo trepando.
//   f746 → se pinta el bloque día 8 → día 10. f800 → el número 90%.
//   exitTo    cam {z ≈ +300, net 0.90} luz {ROJA} materia {la masa roja del bloque}
//   ── FRONTERA D @f846-880 ····· WIPE POR MATERIA (`SeamWipeMatter` teñido ROJO) ··········
//      La propia colonia barre el cuadro y detrás ya está la escalera de duplicación.
//
// ACTO 5 · f860-1140 · "NOTHING → EVERYTHING" (protagonista: EL CRESCENDO)
//   f860 "that's what doubling does" → la escalera 1·2·4·8…1024 se enciende sobre la curva.
//   f925 / f948 / f971 → tres CORTES EN EL BEAT (`SeamFlash`) — "it's nothing" ×3.
//   f948-1006 → ZOOM-THROUGH: la cámara ATRAVIESA la tarjeta del día 10 (clip a pantalla completa).
//   f992 "and then it's everything" → salimos del otro lado en PLANO GENERAL.
//   f1061 "You never see the rebuild." · material {lámina real `lam_curve.jpg` + `h22_weeklysplash.mp4`}
//   exitTo ⟶ cam {z +560, EL GRÁFICO ENTERO A LA VISTA} · luz {CÁLIDA, resolución} · hold vivo
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero blur grande full-screen · cero fade.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import {
  RING, F_SANS, clamp01, lerp, rnd, rgba,
  gcam, light, RingAtmos, Layers, Plane, MediaCard, PhotoPlane,
  SeamWipeMatter, SeamFlash, Kick, Head, Em, Bed,
} from "./RingStage";

/* ── ANCLAS DEL GUION (frames absolutos — el audio manda) ─────────────────────────────────── */
const K = {
  colony: 0, double: 97, onePct: 193, invisible: 306,
  day3: 348, day6: 409, day8: 487, day10: 599,
  didnt: 710, ninety: 746, doubling: 860,
  nothing: 922, everything: 992, rebuild: 1061,
};
const A2 = 193, A3 = 348, A4 = 599, A5 = 860, END = 1140;

export const MOVCURVE_FRAMES = 1140;

/* ── EASINGS — nunca uno solo para todo (⛔ Easing.quint no existe) ────────────────────────── */
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.58, 0.0, 0.22, 1),
  snap: Easing.bezier(0.12, 0.88, 0.2, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  expo: Easing.poly(5),
  lin: (t: number) => t,
};

/** rampa multi-key con easing POR SEGMENTO */
const keyed = (
  f: number, ks: number[], vs: number[],
  e: ((t: number) => number) | ((t: number) => number)[] = EZ.glide,
): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const t = clamp01((f - ks[i]) / (ks[i + 1] - ks[i]));
  const ef = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL GRÁFICO — acá los vectores SÍ son legítimos: una curva ES una curva.
   Coordenadas en el "mundo" de 1920×1080; la cámara se encarga del encuadre.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const D_MAX = 10;
const X0 = 390, X1 = 1660, Y0 = 819, YTOP = 241;
const amt = (d: number) => Math.pow(2, d) / 1024;              // 0..1 · duplicación pura
const CX = (d: number) => X0 + (d / D_MAX) * (X1 - X0);
const CY = (a: number) => Y0 - a * (Y0 - YTOP);
const EYE_A = 0.2;                                             // el umbral del ojo
const EYE_Y = CY(EYE_A);
const D_EYE = Math.log2(EYE_A * 1024) / 1;                     // ≈ 7.678 → cruza entre el día 7 y el 8

const curveTo = (dEnd: number, dStart = 0) => {
  const s = Math.max(0, dStart);
  const e2 = Math.max(s, Math.min(D_MAX, dEnd));
  let p = `M ${CX(s).toFixed(1)},${CY(amt(s)).toFixed(1)}`;
  for (let i = 1; i <= 90; i++) {
    const dd = s + ((e2 - s) * i) / 90;
    p += ` L ${CX(dd).toFixed(1)},${CY(amt(dd)).toFixed(1)}`;
  }
  return p;
};
const areaTo = (dEnd: number, dStart: number) => {
  const e2 = Math.max(dStart, Math.min(D_MAX, dEnd));
  return `${curveTo(e2, dStart)} L ${CX(e2).toFixed(1)},${Y0} L ${CX(dStart).toFixed(1)},${Y0} Z`;
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   LA MATERIA — LA COLONIA. Cada blob NACE DEL PADRE (i>>1): es duplicación de verdad,
   no un campo de ruido. Las posiciones se calculan UNA vez, con rnd(), nunca con Math.random.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const COLPOS: [number, number][] = (() => {
  const pts: [number, number][] = [[0, 0]];
  for (let i = 1; i < 64; i++) {
    const p = pts[i >> 1];
    const a = rnd(3.3 + i * 3.71) * Math.PI * 2;
    const g = Math.floor(Math.log2(i + 1));
    const r = (0.52 + rnd(3.3 + i * 9.13) * 0.62) / Math.pow(1.22, g);
    pts.push([p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r * 0.82]);
  }
  return pts;
})();

const Blob: React.FC<{ f: number; x: number; y: number; r: number; hot: number; i: number }> = ({ f, x, y, r, hot, i }) => {
  const wob = 1 + Math.sin(f / 23 + i * 1.7) * 0.055;
  const rr = r * wob;
  if (rr < 0.4) return null;
  return (
    <div style={{
      position: "absolute", left: x - rr, top: y - rr * 0.86,
      width: rr * 2, height: rr * 1.72, borderRadius: "50%",
      background:
        `radial-gradient(58% 56% at 38% 30%, ${rgba(RING.redHot, 0.96)} 0%, ${rgba(RING.red, 0.94)} 40%, ` +
        `rgba(92,17,13,0.96) 76%, rgba(38,8,6,0.94) 100%)`,
      boxShadow:
        `inset 0 ${(-rr * 0.2).toFixed(1)}px ${(rr * 0.5).toFixed(1)}px rgba(30,6,5,0.8), ` +
        `0 ${(rr * 0.3).toFixed(1)}px ${(rr * 0.6).toFixed(1)}px ${rgba(RING.ink0, 0.72)}, ` +
        `0 0 ${(rr * 1.1).toFixed(1)}px ${rgba(RING.red, 0.3 * hot)}`,
    }}>
      <div style={{
        position: "absolute", left: "24%", top: "14%", width: "28%", height: "24%", borderRadius: "50%",
        background: `radial-gradient(circle, ${rgba(RING.white, 0.55)} 0%, rgba(255,255,255,0) 72%)`,
      }} />
    </div>
  );
};

const Colony: React.FC<{
  f: number; gen: number; cx: number; cy: number; spread: number; unit: number; hot: number; op: number; kill?: number;
}> = ({ f, gen, cx, cy, spread, unit, hot, op, kill = 0 }) => (
  <div style={{ position: "absolute", inset: 0, opacity: op, pointerEvents: "none" }}>
    {COLPOS.map(([px, py], i) => {
      const birth = Math.log2(i + 1);
      const grow = clamp01((gen - birth) / 0.62);
      if (grow <= 0) return null;
      // el barrido de limpieza del acto 2 se lleva TODOS menos el índice 0 (el 1%)
      const survive = i === 0 ? 1 : 1 - clamp01((kill - rnd(i * 5.9) * 0.34) / 0.5);
      const s = grow * survive;
      if (s <= 0.02) return null;
      const r = unit * (0.62 + rnd(i * 6.31 + 7) * 0.66) * s;
      return <Blob key={i} f={f} i={i} x={cx + px * spread} y={cy + py * spread} r={r} hot={hot} />;
    })}
  </div>
);

/* ── el barrido del spray que se lleva el 99% (acto 2) ─────────────────────────────────────── */
const CleanSweep: React.FC<{ f: number; at: number; dur: number; cx: number; cy: number }> = ({ f, at, dur, cx, cy }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const x = lerp(-520, 720, EZ.push(p));
  return (
    <div style={{
      position: "absolute", left: cx + x, top: cy - 300, width: 260, height: 600,
      transform: "rotate(-9deg)", pointerEvents: "none",
      background:
        `linear-gradient(96deg, rgba(255,255,255,0) 0%, ${rgba(RING.cold, 0.22 * Math.sin(p * Math.PI))} 34%, ` +
        `${rgba(RING.white, 0.34 * Math.sin(p * Math.PI))} 52%, rgba(255,255,255,0) 100%)`,
    }} />
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA C · OCLUSIÓN — la barra vertical del DÍA 10 sube y se come el cuadro.
   No es un fade ni un flash: es el objeto del gráfico creciendo hasta tapar el 100%.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const ColumnOcclude: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const w = keyed(p * 100, [0, 26, 44, 62, 100], [30, 420, 3400, 3400, 40], [EZ.push, EZ.expo, EZ.lin, EZ.expo]);
  const h = keyed(p * 100, [0, 30, 100], [0, 260, 260], EZ.push);
  const lean = lerp(-2.4, 2.4, p);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: w, height: `${h}%`,
        transform: `translate(-50%,-50%) rotate(${lean.toFixed(2)}deg)`,
        background:
          `linear-gradient(180deg, rgba(10,4,4,0.98) 0%, ${rgba(RING.red, 0.92)} 22%, ` +
          `${rgba(RING.redHot, 0.96)} 48%, ${rgba(RING.red, 0.9)} 74%, rgba(10,4,4,0.98) 100%)`,
        boxShadow: `0 0 120px ${rgba(RING.red, 0.6)}`,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.55) 100%)`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL GRÁFICO dibujado (SVG · vectores legítimos: eje, curva, umbral del ojo, bloque del 90%)
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Chart: React.FC<{
  f: number; dEnd: number; axis: number; eye: number; block: number; wall: number; pulse: number; ladder: number;
}> = ({ f, dEnd, axis, eye, block, wall, pulse, ladder }) => {
  const grey = curveTo(Math.min(dEnd, D_EYE));
  const hotOn = dEnd > D_EYE;
  const hotPath = hotOn ? curveTo(dEnd, D_EYE) : "";
  const blockOn = block > 0.02 && dEnd > 8;
  const breathe = 1 + Math.sin(f / 71) * 0.004; // hold VIVO: el gráfico nunca queda congelado
  const pulseD = pulse > 0 && pulse < 1 ? lerp(0, D_MAX, pulse) : -1;
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
      <g transform={`translate(960 540) scale(${breathe.toFixed(4)}) translate(-960 -540)`}>
        {/* eje X — NACE del punto del día 0 (frontera A: match-shape) */}
        <line x1={X0} y1={Y0} x2={X1 + 46} y2={Y0}
          stroke={rgba(RING.bone, 0.34)} strokeWidth={3}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(axis)} />
        {/* eje Y */}
        <line x1={X0} y1={Y0} x2={X0} y2={YTOP - 24}
          stroke={rgba(RING.bone, 0.22)} strokeWidth={3}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(axis * 1.4 - 0.4)} />
        {/* rejilla de días */}
        {[2, 4, 6, 8, 10].map((d) => (
          <line key={d} x1={CX(d)} y1={Y0} x2={CX(d)} y2={YTOP - 10}
            stroke={rgba(RING.white, 0.05)} strokeWidth={1.5}
            opacity={clamp01(axis * 1.6 - 0.5)} />
        ))}
        {[0, 2, 4, 6, 8, 10].map((d) => (
          <text key={`t${d}`} x={CX(d)} y={Y0 + 42} textAnchor="middle"
            fontFamily={F_SANS} fontSize={23} fontWeight={800} letterSpacing={2.4}
            fill={rgba(RING.bone, 0.5)} opacity={clamp01(axis * 1.7 - 0.6)}>
            {`DAY ${d}`}
          </text>
        ))}

        {/* EL BLOQUE DEL 90% — los últimos dos días */}
        {blockOn && (
          <>
            <path d={areaTo(lerp(8, Math.min(dEnd, D_MAX), clamp01(block)), 8)}
              fill={rgba(RING.red, 0.2)} />
            <line x1={CX(8)} y1={Y0} x2={CX(8)} y2={CY(amt(8))}
              stroke={rgba(RING.redHot, 0.75)} strokeWidth={3} strokeDasharray="10 9" />
          </>
        )}

        {/* LA LÍNEA DEL UMBRAL DEL OJO */}
        <line x1={X0 - 34} y1={EYE_Y} x2={X1 + 46} y2={EYE_Y}
          stroke={rgba(RING.cold, 0.62)} strokeWidth={3} strokeDasharray="16 12"
          pathLength={1} strokeDashoffset={0} opacity={clamp01(eye)} />
        <text x={X1 + 44} y={EYE_Y - 20} textAnchor="end"
          fontFamily={F_SANS} fontSize={25} fontWeight={800} letterSpacing={3.2}
          fill={rgba(RING.cold, 0.9)} opacity={clamp01(eye * 1.3 - 0.3)}>
          WHAT YOUR EYE CAN SEE
        </text>

        {/* LA PARED DEL DÍA 10 */}
        {wall > 0.01 && (
          <rect x={CX(10) - 15} y={CY(amt(10)) + (1 - clamp01(wall)) * (Y0 - CY(amt(10)))}
            width={30} height={clamp01(wall) * (Y0 - CY(amt(10)))}
            fill={rgba(RING.red, 0.62)} />
        )}

        {/* LA CURVA — gris mientras está por debajo del ojo, ROJA cuando cruza */}
        <path d={grey} fill="none" stroke={rgba(RING.bone, 0.34)} strokeWidth={13} strokeLinecap="round" />
        <path d={grey} fill="none" stroke={rgba(RING.bone, 0.78)} strokeWidth={6} strokeLinecap="round" />
        {hotOn && (
          <>
            <path d={hotPath} fill="none" stroke={rgba(RING.red, 0.34)} strokeWidth={26} strokeLinecap="round" />
            <path d={hotPath} fill="none" stroke={rgba(RING.redHot, 0.98)} strokeWidth={8} strokeLinecap="round" />
          </>
        )}

        {/* f710 "It didn't." — el pulso que recorre la curva de día 0 a día 10: SIEMPRE estuvo trepando */}
        {pulseD >= 0 && (
          <circle cx={CX(pulseD)} cy={CY(amt(pulseD))} r={16 + Math.sin(f / 6) * 3}
            fill={rgba(RING.redHot, 0.95)} opacity={Math.sin(clamp01(pulse) * Math.PI)} />
        )}

        {/* marcadores de día: el MISMO punto rojo, ahora como dato */}
        {[3, 6, 8, 10].map((d) => {
          const on = clamp01((dEnd - d) / 0.35);
          if (on <= 0) return null;
          const big = d === 10;
          return (
            <g key={`m${d}`} opacity={on}>
              <line x1={CX(d)} y1={CY(amt(d))} x2={CX(d)} y2={Y0}
                stroke={rgba(RING.white, 0.16)} strokeWidth={2} strokeDasharray="5 8" />
              <circle cx={CX(d)} cy={CY(amt(d))} r={(big ? 17 : 11) + Math.sin(f / 17 + d) * 1.2}
                fill={big ? RING.redHot : rgba(RING.bone, 0.9)}
                stroke={rgba(RING.ink0, 0.9)} strokeWidth={3} />
            </g>
          );
        })}

        {/* f860 "that's what doubling does" — la escalera 1·2·4·8…1024 sobre la curva */}
        {ladder > 0.01 && Array.from({ length: 11 }, (_, d) => {
          const on = clamp01((ladder * 11.6 - d) / 0.9);
          if (on <= 0) return null;
          return (
            <text key={`l${d}`} x={CX(d) + (d > 8 ? -26 : 16)} y={CY(amt(d)) - 22}
              textAnchor={d > 8 ? "end" : "start"}
              fontFamily={F_SANS} fontSize={d > 7 ? 34 : 24} fontWeight={800} letterSpacing={1.4}
              fill={d > 7 ? RING.redHot : rgba(RING.bone, 0.7)} opacity={on}>
              {Math.pow(2, d)}
            </text>
          );
        })}
      </g>
    </svg>
  );
};

/* ── el número 90% clavado sobre el bloque (acto 4) ────────────────────────────────────────── */
const NinetyTag: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - (K.ninety + 46)) / 16);
  const out = clamp01((f - 992) / 14);
  if (p <= 0 || out >= 1) return null;
  const s = lerp(0.7, 1, EZ.snap(p));
  return (
    <div style={{
      position: "absolute", left: (CX(8) + CX(10)) / 2, top: CY(0.56),
      transform: `translate(-50%,-50%) scale(${s.toFixed(3)}) translateY(${(Math.sin(f / 43) * 3).toFixed(1)}px)`,
      opacity: p * (1 - out), textAlign: "center", pointerEvents: "none",
    }}>
      <div style={{
        fontFamily: F_SANS, fontWeight: 800, fontSize: 122, lineHeight: 0.9, color: RING.white,
        textShadow: `0 8px 40px rgba(0,0,0,0.95), 0 0 60px ${rgba(RING.red, 0.7)}`,
      }}>90%</div>
      <div style={{
        marginTop: 8, fontFamily: F_SANS, fontWeight: 800, fontSize: 24, letterSpacing: 3.4,
        color: RING.redHot, textShadow: "0 4px 18px rgba(0,0,0,0.95)",
      }}>IN THE LAST TWO DAYS</div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   LAS TARJETAS DE LOS DÍAS — MATERIAL REAL. El clip corre 150 frames dentro de su <Sequence>
   (así NUNCA se congela) y después la MISMA tarjeta pasa a la FOTO bajo un barrido especular.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const DayCard: React.FC<{
  f: number; slug: string; label: string; mount: number; out: number;
  x: number; y: number; z: number; w: number; h: number; ry: number; lit: number; op: number;
}> = ({ f, slug, label, mount, out, x, y, z, w, h, ry, lit, op }) => {
  const VID = 150;
  const swap = mount + VID;
  if (f < mount || f >= out) return null;
  const common = { w, h, x, y, z, ry, label, lit, opacity: op, radius: 12 };
  return f < swap ? (
    <Sequence from={mount} durationInFrames={VID} layout="none">
      <MediaCard src={`broll/${slug}.mp4`} kind="video" {...common} sheenAt={12} />
    </Sequence>
  ) : (
    <Sequence from={swap} durationInFrames={Math.max(2, out - swap)} layout="none">
      <MediaCard src={`img/${slug}.jpg`} kind="photo" {...common} sheenAt={0} />
    </Sequence>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ZOOM-THROUGH — la cámara ATRAVIESA la tarjeta del día 10 y sale en el plano general.
   Se toma la posta de la tarjeta del mundo EXACTAMENTE en el beat f948 (corte tapado por el
   SeamFlash), crece hasta cubrir el 100% (f≈985) y se va del otro lado.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const ZoomCard: React.FC<{ f: number }> = ({ f }) => {
  if (f < 948 || f >= 1006) return null;
  const s = keyed(f, [948, 971, 992, 1006], [1, 2.05, 6.2, 16], [EZ.push, EZ.expo, EZ.expo]);
  const cx = keyed(f, [948, 992], [72.2, 50], EZ.push);
  const cy = keyed(f, [948, 992], [33.4, 50], EZ.push);
  return (
    <AbsoluteFill style={{
      overflow: "hidden", pointerEvents: "none",
      perspective: "1500px", transformStyle: "preserve-3d",
    }}>
      <AbsoluteFill style={{ transform: `scale(${s.toFixed(3)})`, transformOrigin: `${cx}% ${cy}%`, transformStyle: "preserve-3d" }}>
        <Sequence from={948} durationInFrames={58} layout="none">
          <MediaCard src="broll/mdring_h53_doorwaysatisfied.mp4" kind="video"
            w={460} h={290} x={cx} y={cy} z={0} radius={12} lit={1} sheenAt={16} label="DAY 10" />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── polvo en primer plano: profundidad real, siempre en movimiento ────────────────────────── */
const Dust: React.FC<{ f: number; n: number; seed: number; tint: string; op: number }> = ({ f, n, seed, tint, op }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(seed + i * 2.17), b = rnd(seed + i * 5.03);
      const x = a * 108 - 4 + Math.sin(f / (64 + b * 70) + i) * 2.2;
      const y = ((b * 1240 - f * (0.2 + a * 0.5)) % 1240 + 1240) % 1240;
      const d = 2 + b * 4.6;
      return <div key={i} style={{
        position: "absolute", left: `${x}%`, top: 1200 - y, width: d, height: d, borderRadius: "50%",
        background: rgba(tint, 0.5), opacity: (0.2 + a * 0.6) * op,
      }} />;
    })}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════════════════
   LA CÁMARA — UNA sola. `camClock` deforma el tiempo por acto (la curva es exponencial y la
   cámara la acompaña) pero es MONÓTONO: z va de −420 a +560 y no retrocede ni un frame.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const CLK_K = [0, K.double, A2, K.invisible, A3, K.day6, K.day8, A4, K.didnt, K.ninety, A5, K.nothing, K.everything, K.rebuild, END];
const CLK_V = [0, 62, 150, 250, 300, 372, 448, 546, 640, 676, 780, 848, 940, 1050, 1140];
const CLK_E = [EZ.soft, EZ.glide, EZ.soft, EZ.lin, EZ.glide, EZ.lin, EZ.push, EZ.soft, EZ.lin, EZ.glide, EZ.push, EZ.expo, EZ.soft, EZ.glide];

/* encuadre: qué punto del MUNDO queda en el centro de pantalla, y a qué aumento neto */
const FOC_K = [0, K.double, A2, K.invisible, A3, K.day6, K.day8, A4, K.didnt, A5, 930, 984, 991, 992, END];
const FOC_X = [390, 400, 430, 500, 585, 700, 830, 960, 1010, 1040, 1120, 1574, 1574, 1000, 1000];
const FOC_Y = [819, 812, 795, 760, 720, 680, 640, 585, 555, 540, 470, 280, 280, 545, 540];
const FOC_E = [EZ.soft, EZ.glide, EZ.soft, EZ.lin, EZ.glide, EZ.lin, EZ.soft, EZ.glide, EZ.lin, EZ.push, EZ.expo, EZ.lin, EZ.snap, EZ.soft];

const NET_K = [0, K.double, A2, K.invisible, A3, K.day6, K.day8, A4, K.didnt, A5, 930, 984, 991, 992, 1010, END];
const NET_V = [3.3, 2.6, 1.95, 1.48, 1.34, 1.2, 1.08, 1.0, 0.96, 0.9, 0.94, 1.06, 1.12, 0.62, 0.68, 0.78];
const NET_E = [EZ.soft, EZ.glide, EZ.soft, EZ.lin, EZ.glide, EZ.lin, EZ.soft, EZ.glide, EZ.lin, EZ.push, EZ.expo, EZ.lin, EZ.snap, EZ.push, EZ.glide];

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovCurve: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const f = useCurrentFrame();
  const D = durationInFrames;

  /* ── cámara ────────────────────────────────────────────────────────────────────────────── */
  const clk = keyed(f, CLK_K, CLK_V, CLK_E);
  const g = gcam(clk, { z0: -420, z1: 560, dur: END, ry: -6, rx: 2.4 });
  const mag = 1500 / (1500 - g.z);                  // aumento que ya aporta la perspectiva
  const net = keyed(f, NET_K, NET_V, NET_E);
  const ws = net / mag;                             // escala del mundo para que el ENCUADRE sea el pedido
  const fx = keyed(f, FOC_K, FOC_X, FOC_E);
  const fy = keyed(f, FOC_K, FOC_Y, FOC_E);
  const panX = 960 - fx, panY = 540 - fy;
  const bgScale = keyed(f, [0, A2, A3, A4, A5, END], [2.5, 2.0, 1.7, 1.5, 1.4, 1.3], EZ.soft);

  /* ── luz: FRÍO → ROJO → CÁLIDO. Un solo viaje, sin volver. ─────────────────────────────── */
  const stage = keyed(f, [0, 520, K.day10, K.didnt, 960, 1000, 1046, END], [0, 0, 0.35, 1, 1, 1, 1.72, 2],
    [EZ.lin, EZ.push, EZ.snap, EZ.lin, EZ.lin, EZ.push, EZ.soft]);
  const tint = stage <= 1 ? light(stage, "cold", "red") : light(stage - 1, "red", "warm");
  const keyLift = keyed(f, [0, A2, A3, A4, A5, K.everything, END], [0.18, 0.26, 0.32, 0.5, 0.58, 0.66, 0.74], EZ.soft);
  const inten = keyed(f, [0, A2, A3, A4, K.ninety, K.nothing, 992, END], [0.86, 0.92, 1.0, 1.1, 1.18, 1.0, 0.82, 0.94], EZ.soft);

  /* ── la colonia (acto 1 y 2) ───────────────────────────────────────────────────────────── */
  const gen = keyed(f, [0, 88, K.double, 132, 168, 190], [0, 0, 0.18, 1.5, 3.0, 5.9], [EZ.lin, EZ.snap, EZ.push, EZ.glide, EZ.push]);
  const spread = keyed(f, [0, 150, 180, 206, 300, 470], [96, 104, 92, 9, 6, 4], [EZ.soft, EZ.lin, EZ.expo, EZ.soft, EZ.lin]);
  const unit = keyed(f, [0, 150, 180, 206, 320, 470], [26, 27, 25, 7.5, 6, 5.4], [EZ.soft, EZ.lin, EZ.expo, EZ.soft, EZ.lin]);
  const kill = keyed(f, [205, 246], [0, 1], EZ.push);                     // el spray se lleva el 99%
  const colOp = keyed(f, [0, 430, 480], [1, 1, 0], [EZ.lin, EZ.soft]);
  const colHot = keyed(f, [0, K.double, 260, 470], [0.5, 1, 0.7, 0.5], EZ.soft);

  /* ── el gráfico ────────────────────────────────────────────────────────────────────────── */
  const dEnd = keyed(f,
    [180, 206, 300, K.day3, K.day6, K.day8, 560, K.day10, 646, END],
    [0, 0.02, 0.9, 3, 6, 8, 8.45, 8.6, 10, 10],
    [EZ.lin, EZ.soft, EZ.glide, EZ.glide, EZ.glide, EZ.lin, EZ.lin, EZ.expo, EZ.lin]);
  const axis = keyed(f, [188, 206, 262, 300], [0, 0.55, 0.9, 1], [EZ.push, EZ.soft, EZ.soft]);
  const eye = keyed(f, [K.invisible - 6, K.invisible + 22, 340], [0, 0.8, 1], [EZ.push, EZ.soft]);
  const block = keyed(f, [K.ninety, K.ninety + 54], [0, 1], EZ.push);
  const wall = keyed(f, [K.day10 + 4, K.day10 + 34], [0, 1], EZ.expo);
  const pulse = f > K.didnt && f < K.didnt + 46 ? (f - K.didnt) / 46 : -1;
  const ladder = keyed(f, [A5, A5 + 62], [0, 1], EZ.glide);

  /* ── ventanas de montaje (cada acto se apaga sólo cuando su costura ya lo tapó) ─────────── */
  const showColony = f < 486;
  const showChart = f > 180;
  const showRow = f >= 340 && f < 1002;
  const showWide = f >= 992;

  /* ── tarjetas de los días: luz y presencia según el beat ────────────────────────────────── */
  const litOf = (at: number, peakEnd: number) =>
    keyed(f, [at - 18, at + 12, peakEnd, peakEnd + 60], [0.2, 1, 1, 0.34], [EZ.push, EZ.lin, EZ.soft]);
  const opOf = (mount: number, out: number) =>
    keyed(f, [mount, mount + 14, out - 26, out], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);

  /* ── texto: UNA idea por acto, dentro de la safe area de 60 px ──────────────────────────── */
  const paraX = -panX * 0.016, paraY = -panY * 0.012;
  const t1 = f > 18 && f < 182;
  const t2 = f > K.onePct + 20 && f < 336;
  const t3 = f > K.day3 + 16 && f < 584;
  const t4 = f > K.ninety - 22 && f < 846;
  const t5 = f > K.nothing + 2;

  const nothings = [925, 948, 971];
  const evP = clamp01((f - K.everything) / 15);
  const rbP = clamp01((f - K.rebuild) / 16);

  return (
    <AbsoluteFill style={{ backgroundColor: RING.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA — montada UNA vez para los 1140 frames. No se remonta entre actos. ── */}
      <RingAtmos tint={tint} keyFrom={keyLift} intensity={inten} />

      {/* ── EL MUNDO, bajo UNA sola cámara ─────────────────────────────────────────────────── */}
      <Layers cam={g.transform}>
        {/* fondo de MATERIAL REAL, fuera de la escala del mundo (siempre cubre el cuadro) */}
        {f < A3 + 10 ? (
          <PhotoPlane src="img/mdring_h54_spraywaterline_blur.jpg" z={-520} scale={bgScale} dim={0.66} />
        ) : (
          <PhotoPlane src="img/mdring_h25_calendar_blur.jpg" z={-520} scale={bgScale} dim={0.7} />
        )}

        <AbsoluteFill style={{
          transform: `scale(${ws.toFixed(4)}) translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px)`,
          transformStyle: "preserve-3d",
        }}>
          {/* plano lejano: la vaharada de la ventanita fría */}
          <Plane z={-320}>
            <div style={{
              position: "absolute", left: "6%", top: "2%", width: "56%", height: "62%",
              background: `radial-gradient(60% 60% at 30% 20%, ${rgba(tint, 0.1)} 0%, rgba(0,0,0,0) 70%)`,
            }} />
          </Plane>

          {/* plano del gráfico */}
          <Plane z={-60}>
            {showChart && (
              <Chart f={f} dEnd={dEnd} axis={axis} eye={eye} block={block} wall={wall} pulse={pulse} ladder={ladder} />
            )}
            {f > K.ninety + 40 && f < 1006 && <NinetyTag f={f} />}
          </Plane>

          {/* plano de LA MATERIA: la colonia macro que se vuelve el punto del día 0 */}
          <Plane z={20}>
            {showColony && (
              <>
                <Colony f={f} gen={gen} cx={CX(0)} cy={CY(amt(0)) - 4} spread={spread} unit={unit}
                  hot={colHot} op={colOp} kill={kill} />
                <CleanSweep f={f} at={205} dur={42} cx={CX(0)} cy={CY(amt(0))} />
              </>
            )}
          </Plane>

          {/* ── ACTO 2 · MATERIAL REAL: el spray en la línea de agua ── */}
          {f >= 198 && f < 348 && (
            <Plane z={140}>
              <Sequence from={198} durationInFrames={150} layout="none">
                <MediaCard src="broll/mdring_h54_spraywaterline.mp4" kind="video"
                  w={600} h={352} x={72} y={36} z={0} ry={-9} radius={12} label="YOU CLEAN IT"
                  sheenAt={16} lit={0.92} opacity={keyed(f, [198, 212, 330, 348], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
              </Sequence>
            </Plane>
          )}

          {/* ── ACTO 3/4 · LA FILA DE TARJETAS EN PROFUNDIDAD, un clip corriendo en cada una ── */}
          {showRow && (
            <Plane z={40}>
              <DayCard f={f} slug="mdring_h52_calendarmarks" label="DAY 3" mount={340} out={640}
                x={26} y={25} z={-240} w={400} h={244} ry={12} lit={litOf(K.day3, K.day6)} op={opOf(340, 640)} />
              <DayCard f={f} slug="mdring_h22_weeklysplash" label="DAY 6" mount={400} out={720}
                x={45} y={26} z={-70} w={430} h={262} ry={7} lit={litOf(K.day6, K.day8)} op={opOf(400, 720)} />
              <DayCard f={f} slug="mdring_h25_calendar" label="DAY 8" mount={478} out={820}
                x={65} y={26.5} z={90} w={450} h={274} ry={2} lit={litOf(K.day8, K.day10)} op={opOf(478, 820)} />
              <DayCard f={f} slug="mdring_h53_doorwaysatisfied" label="DAY 10" mount={588} out={948}
                x={84} y={26} z={270} w={460} h={290} ry={-5} lit={litOf(K.day10, 944)} op={opOf(588, 948)} />
            </Plane>
          )}

          {/* ── ACTO 5b · PLANO GENERAL: la lámina real de la guía + la dosis semanal ── */}
          {showWide && (
            <Plane z={180}>
              <MediaCard src="img/mdring_lam_curve.jpg" kind="photo"
                w={430} h={300} x={20} y={70} z={40} ry={11} radius={10} label="THE CURVE"
                sheenAt={1000} lit={0.9}
                opacity={keyed(f, [1000, 1016], [0, 1], EZ.push)} />
              {f >= 1012 && (
                <Sequence from={1012} durationInFrames={Math.max(2, D - 1012)} layout="none">
                  <MediaCard src="broll/mdring_h22_weeklysplash.mp4" kind="video"
                    w={390} h={236} x={82} y={72} z={110} ry={-12} radius={10} label="HIT DAY SIX"
                    sheenAt={18} lit={0.95} />
                </Sequence>
              )}
            </Plane>
          )}

          {/* primer plano: polvo y suciedad en el aire */}
          <Plane z={300}>
            <Dust f={f} n={16} seed={17} tint={stage > 1 ? RING.warm : RING.cold} op={0.5} />
          </Plane>
        </AbsoluteFill>
      </Layers>

      {/* ══ COSTURA D @f846-880 · WIPE POR MATERIA: la propia colonia barre el cuadro ══════ */}
      <SeamWipeMatter at={846} dur={34} tint={RING.red} />

      {/* ══ COSTURA C @f592-608 · OCLUSIÓN: la barra del día 10 tapa el 100% ═══════════════ */}
      <ColumnOcclude f={f} at={591} dur={18} />

      {/* ══ ZOOM-THROUGH @f948-1006: atravesamos la tarjeta del día 10 ═════════════════════ */}
      <ZoomCard f={f} />

      {/* ══ CORTE EN EL BEAT: "it's nothing" ×3 + el golpe de "everything" ═════════════════ */}
      {nothings.map((n) => <SeamFlash key={n} at={n} color={RING.red} dur={6} />)}
      <SeamFlash at={K.everything} color={RING.white} dur={9} />
      {/* bloom de salida del zoom-through (refracción del vidrio, NO un fundido) */}
      {f > 998 && f < 1016 && (
        <AbsoluteFill style={{
          pointerEvents: "none", mixBlendMode: "screen",
          background: `radial-gradient(62% 52% at 50% 46%, ${rgba(RING.bone, 0.3 * Math.sin(clamp01((f - 998) / 18) * Math.PI))} 0%, rgba(0,0,0,0) 72%)`,
        }} />
      )}

      {/* ══ TIPOGRAFÍA — una idea por acto, ≤7 palabras, cama oscura obligatoria ═══════════ */}
      {t1 && (
        <div style={{
          position: "absolute", left: 96, bottom: 108,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(34, 0, EZ.snap(clamp01((f - 18) / 14))).toFixed(1)}px)`,
          opacity: clamp01((f - 18) / 14) * (1 - clamp01((f - 164) / 18)),
        }}>
          <Bed pad={28} w={880}>
            <Kick>YOUR RING IS A COLONY</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>THEY DOUBLE. THEY DON'T <Em>ADD</Em>.</Head>
          </Bed>
        </div>
      )}
      {t2 && (
        <div style={{
          position: "absolute", left: 96, bottom: 108,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(30, 0, EZ.snap(clamp01((f - K.onePct - 20) / 14))).toFixed(1)}px)`,
          opacity: clamp01((f - K.onePct - 20) / 14) * (1 - clamp01((f - 318) / 18)),
        }}>
          <Bed pad={28} w={760}>
            <Kick>DOWN IN THE PITS</Kick>
            <div style={{ height: 12 }} />
            <Head size={80}>YOU LEFT <Em>ONE PERCENT</Em></Head>
          </Bed>
        </div>
      )}
      {t3 && (
        <div style={{
          position: "absolute", left: 96, bottom: 108,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(28, 0, EZ.snap(clamp01((f - K.day3 - 16) / 14))).toFixed(1)}px)`,
          opacity: clamp01((f - K.day3 - 16) / 14) * (1 - clamp01((f - 566) / 18)),
        }}>
          <Bed pad={28} w={700}>
            <Kick>DAY 3 · DAY 6 · DAY 8</Kick>
            <div style={{ height: 12 }} />
            <Head size={82}>INVISIBLE ISN'T <Em>GONE</Em></Head>
          </Bed>
        </div>
      )}
      {t4 && (
        <div style={{
          position: "absolute", left: 96, bottom: 108,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(30, 0, EZ.snap(clamp01((f - K.ninety + 22) / 14))).toFixed(1)}px)`,
          opacity: clamp01((f - K.ninety + 22) / 14) * (1 - clamp01((f - 828) / 18)),
        }}>
          <Bed pad={28} w={900}>
            <Kick>IT DIDN'T SHOW UP OVERNIGHT</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>IT WAS ALWAYS <Em>BUILDING</Em></Head>
          </Bed>
        </div>
      )}

      {/* ── ACTO 5 · EL CRESCENDO: nothing · nothing · nothing → EVERYTHING ── */}
      {t5 && (
        <div style={{
          position: "absolute", left: 96, bottom: 104, right: 96,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px)`,
        }}>
          <Bed pad={30} w={evP > 0 ? 1180 : 620}>
            <div style={{ display: "flex", gap: 26, alignItems: "flex-end", flexWrap: "wrap" }}>
              {nothings.map((n, i) => {
                const p = clamp01((f - n) / 9);
                if (p <= 0) return null;
                const shrink = 1 - 0.42 * clamp01((f - 986) / 14);
                return (
                  <div key={n} style={{
                    fontFamily: F_SANS, fontWeight: 800, letterSpacing: 1,
                    fontSize: (46 + i * 12) * shrink,
                    color: rgba(RING.bone, 0.42 + i * 0.16),
                    transform: `translateY(${lerp(20, 0, EZ.snap(p)).toFixed(1)}px) scale(${lerp(0.86, 1, EZ.snap(p)).toFixed(3)})`,
                    textShadow: "0 6px 26px rgba(0,0,0,0.92)",
                    opacity: p,
                  }}>NOTHING.</div>
                );
              })}
            </div>
            {evP > 0 && (
              <div style={{
                marginTop: 14,
                transform: `translateY(${lerp(26, 0, EZ.snap(evP)).toFixed(1)}px) scale(${lerp(0.9, 1, EZ.snap(evP)).toFixed(3)})`,
                opacity: evP,
              }}>
                <Head size={104}>AND THEN IT'S <Em color={RING.redHot}>EVERYTHING</Em></Head>
              </div>
            )}
            {rbP > 0 && (
              <div style={{ marginTop: 16, opacity: rbP, transform: `translateY(${lerp(16, 0, EZ.soft(rbP)).toFixed(1)}px)` }}>
                <Kick color={RING.warm}>YOU NEVER SEE THE REBUILD</Kick>
              </div>
            )}
          </Bed>
        </div>
      )}

      {/* ── viñeta viva: el plano no se cierra, sigue respirando hasta el corte ── */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(90% 74% at 50% 50%, rgba(0,0,0,0) 44%, rgba(0,0,0,${(0.2 + 0.06 * Math.sin(f / 97) + clamp01((f - (D - 40)) / 40) * 0.1).toFixed(3)}) 100%)`,
      }} />
      {/* aberración cromática sutil en los picos de energía (nunca un blur full-screen) */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: keyed(f, [K.day10 - 10, K.day10 + 20, K.ninety + 90, K.everything, K.everything + 40], [0, 0.11, 0.11, 0.14, 0], [EZ.push, EZ.lin, EZ.lin, EZ.soft]),
        background: `linear-gradient(92deg, ${rgba(RING.red, 0.2)} 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, ${rgba(RING.cold, 0.16)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
