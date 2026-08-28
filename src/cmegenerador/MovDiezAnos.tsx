// MovDiezAnos.tsx — S3 · 1500 frames (50 s) · arranca en el segundo 290.0 del video
// ESPINA: «La prueba semanal: doce minutos por semana, diez años, para tener luz treinta horas.»
//
// ╔═══════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del N                          ║
// ╠══════╤════════════╤════════════════════════════════════════╤═══════════════════════════════════╣
// ║ acto │ frames     │ enterFrom (cámara · luz · materia)     │ exitTo (cámara · luz · materia)   ║
// ╟──────┼────────────┼────────────────────────────────────────┼───────────────────────────────────╢
// ║  1   │    0 → 330 │ CÁM gcam e=0 · z −70 · pan 0 · ry 0    │ CÁM e=.264 · z +62 · panX −45 ·   ║
// ║      │            │ LUZ key fría arriba-izq, keyFrom .26,  │     panY −48 · ry −2.1° · rx +1.5°║
// ║      │            │     intensity .98, sombra dura         │ LUZ keyFrom .34, intensity .95    ║
// ║      │            │ MAT la pila de piezas sobre el banco   │ MAT las 3 piezas YA convertidas   ║
// ║      │            │     (heredada de MovDesglose)          │     en 3 celdas con material      ║
// ╟──────┼────────────┼────────────────────────────────────────┼───────────────────────────────────╢
// ║  2   │  330 → 690 │ CÁM e=.264 · z +62 · panX −45 ·ry−2.1°│ CÁM e=.500 · z +180 · panX −85 ·  ║
// ║      │            │ LUZ keyFrom .34, intensity .95         │     panY −90 · ry −4.0° · rx +2.8°║
// ║      │            │ MAT las 3 celdas con material dentro   │ LUZ keyFrom .52, intensity .80,   ║
// ║      │            │     de la grilla de 520 semanas        │     tint volt→sky (se enfría)     ║
// ║      │            │                                        │ MAT la ÚLTIMA CELDA ENCENDIDA,    ║
// ║      │            │                                        │     suelta, viajando por el aire  ║
// ╟──────┼────────────┼────────────────────────────────────────┼───────────────────────────────────╢
// ║  3   │ 690 → 1050 │ CÁM e=.500 · z +180 · panX −85·ry−4.0°│ CÁM e=.671 · z +265 · panX −114 · ║
// ║      │            │ LUZ keyFrom .52, intensity .80         │     panY −121 ·ry −5.4°· rx +3.7°║
// ║      │            │ MAT la celda viajera ATERRIZA como la  │ LUZ keyFrom .60, intensity .55,   ║
// ║      │            │     rejilla encendida del generador    │     tint→torch (noche)            ║
// ║      │            │                                        │ MAT las 3 cifras (9.400 / 3.000 / ║
// ║      │            │                                        │     +GAS) flotando sobre la noche ║
// ╟──────┼────────────┼────────────────────────────────────────┼───────────────────────────────────╢
// ║  4   │1050 → 1320 │ CÁM e=.671 · z +265 · panX −114       │ CÁM e=.759 · z +309 · panX −129 · ║
// ║      │            │ LUZ keyFrom .60, intensity .55         │     panY −137 ·ry −6.1°· rx +4.2°║
// ║      │            │ MAT las 3 cifras ATERRIZAN sobre la    │ LUZ keyFrom .63, intensity .40    ║
// ║      │            │     losa y se suman                    │ MAT la cifra 12.500 (lo único que ║
// ║      │            │                                        │     sobrevive a la chapa)         ║
// ╟──────┼────────────┼────────────────────────────────────────┼───────────────────────────────────╢
// ║  5   │1320 → 1500 │ CÁM e=.759 · z +309 · panX −129       │ CÁM e=.806 · z +333 · panX −137 · ║
// ║      │            │ LUZ keyFrom .63, intensity .40         │     panY −145 ·ry −6.4°· rx +4.4°║
// ║      │            │ MAT la cifra 12.500 sobre la losa      │ LUZ keyFrom .66, intensity .20,   ║
// ║      │            │                                        │     floor .93 — NEGRO CASI TOTAL  ║
// ║      │            │                                        │ MAT 12.500 GRABADO en la losa,    ║
// ║      │            │                                        │     solo en el cuadro → MovEtiqueta║
// ╚══════╧════════════╧════════════════════════════════════════╧═══════════════════════════════════╝
// (la cámara es UNA sola llamada `gcam(gFrame, {... dur:4200})`: `dur` supera al movimiento a propósito
//  para que a los 1500 frames siga VIAJANDO — nunca se detiene ni vuelve a 0. Encima lleva acentos
//  keyframeados continuos por acto, que jamás rompen la continuidad.)
//
// COSTURAS (una distinta por frontera · ninguna es un fade):
//   F1 @330  MATCH-SHAPE  — las 3 MediaCards del banco encogen y se acomodan como celdas de la grilla
//   F2 @690  MATCH-MOVE   — la cámara sigue su vector y el mundo se desliza: la grilla SE ACABA por la
//                           izquierda y detrás ya está el patio de noche (baldosa B a +2950px)
//   F3 @1050 WIPE POR MATERIA — el humo de escape cruza el cuadro (V.concrete + V.steel) y detrás ya
//                           está la losa con la suma
//   F4 @1320 OCLUSIÓN     — una chapa V.steel cruza y deja la cifra sola
//
// UNA sola atmósfera (montada una vez, props animados) · UNA sola cámara función de gFrame (gcam,
// jamás vuelve a 0) · la luz evoluciona volt→sky→torch · materia que cruza CADA frontera.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, SeamFlash,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

// ── constantes de tiempo (fronteras) ────────────────────────────────────────────────────────
const F_A2 = 330;
const F_A3 = 690;
const F_A4 = 1050;
const F_A5 = 1320;
const F_END = 1500;

// separación entre la baldosa A (banco + grilla) y la baldosa B (patio de noche + losa).
const WORLD_GAP = 2950;

const EASE = Easing.bezier(0.22, 0.61, 0.28, 1);
const EASE_IN = Easing.bezier(0.55, 0, 0.24, 1);

const ip = (x: number, xs: number[], ys: number[], ez?: (n: number) => number) =>
  interpolate(x, xs, ys, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ez });

// ── LA GRILLA DE 520 SEMANAS (10 años × 52) — es un GRÁFICO, se dibuja con divs ──────────────
const COLS = 52;
const ROWS = 10;
const PITCH = 34;
const CELL = 26;
const GW = COLS * PITCH;   // 1768
const GH = ROWS * PITCH;   // 340
// la celda que se desprende en la frontera 2 (fila 5, columna 30: bien dentro del cuadro)
const DONOR_C = 30;
const DONOR_R = 5;
const DONOR_I = DONOR_R * COLS + DONOR_C;

// centro de una celda, en % del contenedor de la grilla
const cellX = (col: number) => ((col * PITCH + CELL / 2) / GW) * 100;
const cellY = (row: number) => ((row * PITCH + CELL / 2) / GH) * 100;
// pantalla (%) → contenedor de la grilla (%) — la grilla está centrada en 50% / 46%
const gx = (sx: number) => ((((sx - 50) / 100) * 1920 + GW / 2) / GW) * 100;
const gy = (sy: number) => ((((sy - 46) / 100) * 1080 + GH / 2) / GH) * 100;

const Grilla: React.FC<{ g: number; litN: number }> = ({ g, litN }) => (
  <>
    {Array.from({ length: ROWS }, (_, r) => {
      const rp = ip(g, [298 + r * 4, 338 + r * 4], [0, 1], EASE);
      if (rp <= 0.004) return null;
      return (
        <div
          key={r}
          style={{
            position: "absolute", left: 0, top: r * PITCH, width: GW, height: CELL,
            transform: `scaleX(${rp.toFixed(4)})`, transformOrigin: "0% 50%",
          }}
        >
          {Array.from({ length: COLS }, (_, c) => {
            const i = r * COLS + c;
            if (i === DONOR_I && g >= 630) return null;       // esta celda se DESPRENDE (materia F2)
            const d = litN - i;
            const on = d >= 0;
            const fresh = on && d < 18 ? 1 - d / 18 : 0;
            const idle = 0.055 + 0.028 * Math.sin((g + i * 7.3) / 24);
            const a = on ? 0.24 + 0.64 * fresh : Math.max(0.028, idle);
            return (
              <div
                key={c}
                style={{
                  position: "absolute", left: c * PITCH, top: 0, width: CELL, height: CELL, borderRadius: 3,
                  background: on ? rgba(V.volt, a) : rgba(V.white, a),
                  boxShadow: fresh > 0.02
                    ? `0 0 ${Math.round(6 + 24 * fresh)}px ${rgba(V.volt, 0.55 * fresh)}`
                    : `inset 0 1px 0 ${rgba(V.white, 0.05)}`,
                }}
              />
            );
          })}
        </div>
      );
    })}
  </>
);

// ── bloque de tipografía con entrada/salida propias (NO es una costura: es texto) ────────────
const Blk: React.FC<{
  g: number; from: number; to: number; x: number; y: number; w?: number; children: React.ReactNode;
}> = ({ g, from, to, x, y, w = 660, children }) => {
  const a = ip(g, [from, from + 15], [0, 1], EASE) * ip(g, [to - 15, to], [1, 0]);
  if (a <= 0.004) return null;
  const ty = (1 - ip(g, [from, from + 24], [0, 1], EASE)) * 34 + ip(g, [to - 15, to], [0, -24]);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w,
      opacity: a, transform: `translateY(${ty.toFixed(1)}px)`,
    }}>
      {children}
    </div>
  );
};

// ── el cielo del patio: el plano más lejano, la luz que evoluciona ──────────────────────────
const Cielo: React.FC<{ g: number }> = ({ g }) => {
  const noche = ip(g, [F_A3 - 60, F_A4, F_END], [0, 0.62, 1]);
  const col = light(noche, "sky", "torch");
  return (
    <Plane z={-900} style={{ transform: "translateZ(-900px) scale(2.72)", transformStyle: "preserve-3d" }}>
      <AbsoluteFill style={{
        background: `radial-gradient(112% 76% at 42% 2%, ${rgba(col, 0.13 * (1 - noche * 0.78))} 0%, rgba(0,0,0,0) 64%)`,
      }} />
      <AbsoluteFill style={{
        background: `linear-gradient(180deg, rgba(0,0,0,0) 38%, ${rgba(V.ink0, 0.55 + 0.4 * noche)} 100%)`,
      }} />
    </Plane>
  );
};

// ── la cifra 12.500: NACE en el acto 4 y CRUZA la chapa hasta quedar grabada en la losa ──────
const Cifra: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1143) return null;
  const post = g >= 1319;                                   // del otro lado de la chapa de acero
  const pop = ip(g, [1143, 1158], [1.2, 1], EASE);
  const x = post ? ip(g, [1424, 1472, F_END], [70, 50, 42], EASE) : 73;
  const y = post ? ip(g, [1424, 1472], [40, 64], EASE) : 64;
  const size = post ? ip(g, [1424, 1472], [172, 206], EASE) : 168;
  const rise = post ? ip(g, [1319, 1356], [30, 0], EASE) : 0;
  const bob = Math.sin(g / 57) * 2.1;
  const col = post ? rgba(V.concrete, 0.97) : V.amber;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translateY(${(rise + bob).toFixed(2)}px) scale(${pop.toFixed(3)})`,
      textAlign: "center", whiteSpace: "nowrap",
    }}>
      {!post && (
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.6,
          textTransform: "uppercase", color: rgba(V.white, 0.72), marginBottom: 8,
          textShadow: "0 4px 18px rgba(0,0,0,0.92)",
        }}>Total en diez años</div>
      )}
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(size), lineHeight: 0.9, color: col,
        transform: post ? "rotateX(16deg)" : "none", transformOrigin: "50% 100%",
        textShadow: post
          ? `0 3px 0 ${rgba(V.white, 0.10)}, 0 -3px 6px rgba(0,0,0,0.96), 0 -1px 0 ${rgba(V.ink0, 0.95)}, 0 30px 66px rgba(0,0,0,0.92)`
          : `0 0 ${Math.round(size * 0.42)}px ${rgba(V.amber, 0.36)}, 0 8px 30px rgba(0,0,0,0.94)`,
      }}>$12.500</div>
      {post && (
        <>
          {/* el filo frío que agarra la talla en el concreto */}
          <div style={{
            width: "62%", height: 2, margin: "16px auto 0",
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.volt, 0.42)} 50%, rgba(0,0,0,0) 100%)`,
            opacity: ip(g, [1330, 1372], [0, 1]),
          }} />
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 4.2, marginTop: 16,
            textTransform: "uppercase", color: rgba(V.white, 0.5),
            opacity: ip(g, [1396, 1418], [0, 1]) * ip(g, [1478, F_END], [1, 0.35]),
            textShadow: "0 4px 18px rgba(0,0,0,0.95)",
          }}>Guarda este número</div>
        </>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
export const MovDiezAnos: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const g = Math.max(0, Math.min(F_END, gFrame));
  // los helpers del Stage leen useCurrentFrame(): este offset hace que sus `at` sean frames DE MI
  // MOVIMIENTO, esté montado dentro de una Sequence o suelto en la composición.
  const off = useCurrentFrame() - g;

  // ── LA CÁMARA: una sola llamada, dur = el movimiento entero. Ningún acto la reinicia ────────
  const cam = gcam(g, { z0: -70, z1: 430, panX: -170, panY: -180, ry: -8, rx: 5.5, dur: 4200 });
  const accX = ip(g, [0, F_A2, F_A3, F_A4, F_A5, F_END], [26, 0, -34, 8, 30, 12], EASE);
  const accY = ip(g, [0, F_A2, F_A3, F_A4, F_A5, F_END], [18, 0, -22, -6, 10, 22], EASE);
  const accRz = ip(g, [0, F_A2, F_A3, F_A4, F_A5, F_END], [0.5, 0.1, -0.45, 0.2, 0.4, 0], EASE);
  const camT = `${cam.transform} translate3d(${accX.toFixed(2)}px, ${accY.toFixed(2)}px, 0) rotate(${accRz.toFixed(3)}deg)`;

  // ── LA LUZ: evoluciona, no salta. volt (medición) → sky (frío) → torch (noche) ─────────────
  const frio = ip(g, [F_A2, F_A3, F_A4], [0, 0.55, 1]);
  const noche = ip(g, [F_A3, F_A4, F_END], [0, 0.55, 1]);
  const atTint = light(frio, "volt", "sky");
  const atTint2 = light(noche, "amber", "torch");
  const atKey = ip(g, [0, F_A2, F_A3, F_A4, F_A5, F_END], [0.26, 0.34, 0.52, 0.60, 0.63, 0.66], EASE);
  const atInt = ip(g, [0, 13, F_A2, F_A3, F_A4, F_A5, F_END], [0.52, 0.98, 0.95, 0.80, 0.55, 0.40, 0.20], EASE);
  const atFloor = ip(g, [0, F_A2, F_A3, F_A4, F_A5, F_END], [0.58, 0.62, 0.72, 0.80, 0.86, 0.93], EASE);

  // ── EL MUNDO: dos baldosas contiguas. F2 (MATCH-MOVE) es la cámara siguiendo su vector y
  //    deslizándose de la A a la B. WORLD_GAP está calculado para que (a) la baldosa B NUNCA asome
  //    por la derecha antes de la costura y (b) NUNCA quede un hueco negro entre las dos: sus dos
  //    planos de fondo se solapan durante todo el viaje.
  const worldX = ip(g, [630, 790], [0, -WORLD_GAP], EASE_IN);

  // ── ACTO 1→2 · MATCH-SHAPE: las 3 piezas se acomodan como celdas ───────────────────────────
  const m = ip(g, [306, 362], [0, 1], EASE_IN);
  const litN = Math.round(ip(g, [346, 648], [0, 520], Easing.bezier(0.34, 0, 0.5, 1)));

  // la grilla viaja hacia la cámara durante todo el acto 2 (esto es "la cámara la recorre")
  const gS = ip(g, [0, 300, F_A3], [1, 1, 1.34], EASE);
  const gOx = ip(g, [300, F_A3], [0, -128], EASE);
  const gOy = ip(g, [300, F_A3], [0, 42], EASE);

  // ── ACTO 2→3 · la CELDA DONANTE se desprende y se vuelve la rejilla del generador ─────────
  // arranca EXACTAMENTE pegada a su celda (misma geometría que la grilla) y termina sobre el
  // respiradero del generador, ya en la baldosa B: por eso la materia cruza la frontera entera.
  const viaja = ip(g, [630, 800], [0, 1], EASE_IN);
  const donorX = 50 + ((gOx + (DONOR_C * PITCH + CELL / 2 - GW / 2) * gS) / 1920) * 100;
  const donorY = 46 + ((gOy + (DONOR_R * PITCH + CELL / 2 - GH / 2) * gS) / 1080) * 100;
  const ventX = ((WORLD_GAP + 0.55 * 1920) / 1920) * 100;
  const celdaX = lerp(donorX, ventX, viaja);
  const celdaY = lerp(donorY, 56, viaja);
  const celdaS = lerp(26 * gS, 148, viaja);
  const celdaH = celdaS * lerp(1, 0.46, ip(viaja, [0.42, 0.86], [0, 1], EASE));
  const celdaCol = light(viaja, "volt", "torch");

  // ── ACTO 3→4 · el humo del escape (WIPE POR MATERIA) ───────────────────────────────────────
  const humo = ip(g, [1026, 1078], [0, 1]);
  const humoA = Math.pow(Math.sin(clamp01(humo) * Math.PI), 0.55);
  const enActo4 = g >= 1052;

  // ── ACTO 4→5 · la chapa de acero (OCLUSIÓN) ────────────────────────────────────────────────
  const enActo5 = g >= 1319;

  // ── ACTO 5 · la barra de 87.600 horas con su segmento minúsculo ────────────────────────────
  const barP = ip(g, [1330, 1394], [0, 1], EASE);
  const barSink = ip(g, [1388, 1444], [0, 1], EASE);

  // ── las 3 cifras: nacen sobre la noche (acto 3) y ATERRIZAN en la losa (acto 4) ────────────
  const viajeCifras = ip(g, [1030, 1094], [0, 1], EASE_IN);
  const cifraX = lerp(24, 71, viajeCifras);

  const velo = ip(g, [1402, F_END], [0, 0.58], EASE);

  return (
    <AbsoluteFill id={`movdiezanos-a${acto}`} style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez; sus props evolucionan, nunca se remonta ────────── */}
      <VoltAtmos tint={atTint} tint2={atTint2} keyFrom={atKey} intensity={atInt} floor={atFloor} />

      {/* ── EL MUNDO EN 3D (7 planos con parallax propio) ─────────────────────────────────── */}
      <Layers cam={camT}>
        {/* el cielo del patio es UNO SOLO: no viaja con el mundo, evoluciona con la luz */}
        <Cielo g={g} />
        <div style={{
          position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
          transform: `translateX(${worldX.toFixed(1)}px)`, transformStyle: "preserve-3d",
        }}>
          {/* ═════ BALDOSA A · el banco de trabajo y la grilla (actos 1 y 2) ═════ */}
          {g < 812 && (
            <div style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
              transformStyle: "preserve-3d",
            }}>
              {/* plano de material real a sangre: el banco con las piezas */}
              <Plane z={-380} style={{ transform: "translateZ(-380px)", transformStyle: "preserve-3d" }}>
                <PhotoPlane
                  src="broll/cmegenerador/cmeg_mv_diez1.mp4"
                  kind="video" z={0} scale={1.62}
                  dim={ip(g, [0, 300, 470], [0.5, 0.58, 0.86], EASE)}
                  tint={V.volt}
                />
              </Plane>

              {/* la losa del patio, siempre debajo de todo lo que flota */}
              <Plane z={-200} style={{ transform: "translateZ(-200px)", transformStyle: "preserve-3d" }}>
                <PadPlane y={78} w={1500} h={330} rx={63} lit={ip(g, [0, 330, 690], [0.95, 0.72, 0.4], EASE)} z={0} />
              </Plane>

              {/* ── LA GRILLA + las 3 piezas que SE VUELVEN celdas (materia que cruza F1) ── */}
              <Plane z={-40} style={{ transform: "translateZ(-40px)", transformStyle: "preserve-3d" }}>
                <div style={{
                  position: "absolute", left: "50%", top: "46%", width: GW, height: GH,
                  marginLeft: -GW / 2, marginTop: -GH / 2,
                  transform: `translate(${gOx.toFixed(1)}px, ${gOy.toFixed(1)}px) scale(${gS.toFixed(4)})`,
                  transformStyle: "preserve-3d",
                }}>
                  {/* rótulo de la grilla (estructura gráfica) */}
                  <div style={{
                    position: "absolute", left: GW / 2, top: -62, transform: "translateX(-50%)",
                    opacity: ip(g, [330, 356], [0, 1]) * ip(g, [648, 690], [1, 0.35]),
                  }}>
                    <Kick color={rgba(V.white, 0.62)}>Diez años · 520 semanas</Kick>
                  </div>

                  <Grilla g={g} litN={litN} />

                  {/* PIEZA 1 · la lata, el filtro y las bujías → celda (col 6, fila 1) */}
                  <MediaCard
                    src="img/cmegenerador/cmeg_mv_diez1.png" kind="photo"
                    w={lerp(780, 136, m)} h={lerp(470, 98, m)}
                    x={lerp(gx(58), cellX(6), m)}
                    y={lerp(gy(40 + (1 - ip(g, [10, 34], [0, 1], EASE)) * 3), cellY(1), m)}
                    z={0} ry={lerp(-5, 0, m)} rot={lerp(-1.6, 0, m)}
                    radius={lerp(16, 4, m)} lit={lerp(1, 0.85, m)} litColor={V.volt}
                    sheenAt={26 + off} opacity={ip(g, [8, 32], [0, 1], EASE)}
                  />
                  {/* PIEZA 2 · el calendario de pared → celda (col 24, fila 4) */}
                  <MediaCard
                    src="broll/cmegenerador/cmeg_mv_diez2.mp4" kind="video"
                    w={lerp(360, 136, m)} h={lerp(224, 98, m)}
                    x={lerp(gx(20), cellX(24), m)}
                    y={lerp(gy(30 + (1 - ip(g, [150, 176], [0, 1], EASE)) * 3), cellY(4), m)}
                    z={0} ry={lerp(7, 0, m)} rot={lerp(2.4, 0, m)}
                    radius={lerp(14, 4, m)} lit={lerp(0.9, 0.85, m)} litColor={V.volt}
                    sheenAt={168 + off} opacity={ip(g, [150, 176], [0, 1], EASE)}
                  />
                  {/* PIEZA 3 · la factura del servicio → celda (col 41, fila 7) */}
                  <MediaCard
                    src="img/cmegenerador/cmeg_mv_diez5.png" kind="photo"
                    w={lerp(320, 136, m)} h={lerp(214, 98, m)}
                    x={lerp(gx(86), cellX(41), m)}
                    y={lerp(gy(74 + (1 - ip(g, [226, 252], [0, 1], EASE)) * 3), cellY(7), m)}
                    z={0} ry={lerp(-9, 0, m)} rot={lerp(-3.2, 0, m)}
                    radius={lerp(14, 4, m)} lit={lerp(0.86, 0.85, m)} litColor={V.amber}
                    sheenAt={244 + off} opacity={ip(g, [226, 252], [0, 1], EASE)}
                  />
                </div>
              </Plane>
            </div>
          )}

          {/* ═════ BALDOSA B · el patio de noche, la losa y la suma (actos 3, 4 y 5) ═════ */}
          <div style={{
            position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
            transform: `translateX(${WORLD_GAP}px)`, transformStyle: "preserve-3d",
          }}>
            {/* ── ACTO 3 · el generador encendiéndose solo de noche ── */}
            {g >= 548 && g < 1052 && (
              <>
                <Plane z={-400} style={{ transform: "translateZ(-400px)", transformStyle: "preserve-3d" }}>
                  <PhotoPlane
                    src="img/cmegenerador/cmeg_mv_diez3.png" kind="photo"
                    z={0} scale={1.66} dim={ip(g, [620, 760, 1040], [0.5, 0.74, 0.82], EASE)} tint={V.torch}
                  />
                </Plane>
                <Plane z={-30} style={{ transform: "translateZ(-30px)", transformStyle: "preserve-3d" }}>
                  {/* PROTAGONISTA: material real dentro de vidrio */}
                  <MediaCard
                    src="broll/cmegenerador/cmeg_mv_diez3.mp4" kind="video"
                    w={940} h={545} x={60} y={40} z={0}
                    ry={ip(g, [660, 1040], [-8, 3], EASE)} rot={-0.8} radius={16}
                    lit={ip(g, [660, 800, 1040], [0.4, 1, 0.7], EASE)} litColor={V.torch}
                    sheenAt={806 + off} label="03:12 A.M. · LA PRUEBA SEMANAL"
                    opacity={ip(g, [648, 700], [0, 1], EASE)}
                  />
                </Plane>
              </>
            )}

            {/* ── la LOSA compartida por los actos 4 y 5 (cruza la chapa) ── */}
            {g >= 1036 && (
              <Plane z={-190} style={{ transform: "translateZ(-190px)", transformStyle: "preserve-3d" }}>
                <PadPlane
                  y={72} w={1580} h={380} rx={64}
                  lit={ip(g, [1036, F_A5, F_END], [0.9, 0.62, 0.4], EASE)} z={0}
                />
              </Plane>
            )}

            {/* ── ACTO 4 · la suma sobre la losa ── */}
            {enActo4 && !enActo5 && (
              <>
                <Plane z={-400} style={{ transform: "translateZ(-400px)", transformStyle: "preserve-3d" }}>
                  <PhotoPlane
                    src="img/cmegenerador/cmeg_mv_diez4.png" kind="photo"
                    z={0} scale={1.66} dim={ip(g, [1052, 1180], [0.6, 0.76], EASE)} tint={V.amber}
                  />
                </Plane>
                <Plane z={-120} style={{ transform: "translateZ(-120px)", transformStyle: "preserve-3d" }}>
                  {/* PROTAGONISTA: la mano escribiendo los tres números */}
                  <MediaCard
                    src="broll/cmegenerador/cmeg_mv_diez4.mp4" kind="video"
                    w={800} h={490} x={30} y={48} z={0}
                    ry={ip(g, [1052, 1310], [9, -2], EASE)} rot={1.1} radius={16}
                    lit={ip(g, [1052, 1120], [0.45, 1], EASE)} litColor={V.amber}
                    sheenAt={1132 + off} label="LA CUENTA DE DIEZ AÑOS"
                    opacity={ip(g, [1052, 1084], [0, 1], EASE)}
                  />
                  {/* la factura, más chica y más abajo (escala distinta, misma familia) */}
                  <MediaCard
                    src="broll/cmegenerador/cmeg_mv_diez5.mp4" kind="video"
                    w={320} h={200} x={26} y={80} z={0}
                    ry={-12} rot={-2.4} radius={12}
                    lit={0.8} litColor={V.amber} sheenAt={1206 + off}
                    opacity={ip(g, [1186, 1218], [0, 1], EASE)}
                  />
                </Plane>
              </>
            )}

            {/* ── ACTO 5 · la losa casi a oscuras + el último material real ── */}
            {enActo5 && (
              <Plane z={-160} style={{ transform: "translateZ(-160px)", transformStyle: "preserve-3d" }}>
                <MediaCard
                  src="img/cmegenerador/cmeg_mv_diez5.png" kind="photo"
                  w={300} h={200}
                  x={80} y={ip(g, [1330, 1452], [30, 40], EASE)} z={0}
                  ry={-14} rot={-2} radius={12}
                  lit={ip(g, [1330, 1400, 1462], [0.8, 0.55, 0.18], EASE)} litColor={V.sky}
                  sheenAt={1344 + off}
                  opacity={ip(g, [1326, 1352], [0, 1], EASE) * ip(g, [1440, 1490], [1, 0.1], EASE)}
                />
              </Plane>
            )}

            {/* ── LAS 3 CIFRAS: materia que CRUZA el humo (acto 3 → acto 4) ── */}
            {g >= 906 && g < 1319 && (
              <Plane z={-140} style={{ transform: "translateZ(-140px)", transformStyle: "preserve-3d" }}>
                {[
                  { n: "$9.400", l: "Equipo e instalación", at: 918 },
                  { n: "$3.000", l: "Mantenimiento · 10 años", at: 962 },
                  { n: "+ GAS", l: "La prueba de cada semana", at: 1005 },
                ].map((it, i) => {
                  const ent = ip(g, [it.at, it.at + 20], [0, 1], EASE);
                  if (ent <= 0.004) return null;
                  const yy = lerp(46 + 12 * i, 30 + 12 * i, viajeCifras);
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${cifraX}%`, top: `${yy}%`,
                      transform: `translate(-50%,-50%) translateX(${((1 - ent) * -30).toFixed(1)}px)`,
                      opacity: ent,
                    }}>
                      <Bed pad={16} w={380}>
                        <div style={{
                          fontFamily: F_BODY, fontWeight: 700, fontSize: 19, lineHeight: 1.2,
                          letterSpacing: 1.7, textTransform: "uppercase", marginBottom: 4,
                          color: rgba(V.bone, 0.74), whiteSpace: "nowrap",
                        }}>{it.l}</div>
                        <Num size={lerp(62, 72, viajeCifras)} color={i === 2 ? V.danger : V.amber}>{it.n}</Num>
                      </Bed>
                    </div>
                  );
                })}
              </Plane>
            )}

            {/* ── MATERIA F2 · la celda donante se desprende de la grilla (baldosa A) y aterriza
                 como el respiradero encendido del generador (baldosa B): cruza la frontera entera ── */}
            {g >= 630 && g < 1052 && (
              <Plane z={-10} style={{ transform: "translateZ(-10px)", transformStyle: "preserve-3d" }}>
                <div style={{
                  position: "absolute", left: `${celdaX.toFixed(3)}%`, top: `${celdaY.toFixed(3)}%`,
                  width: celdaS, height: celdaH,
                  marginLeft: -celdaS / 2, marginTop: -celdaH / 2,
                  borderRadius: lerp(3, 7, viaja),
                  background: `linear-gradient(180deg, ${rgba(celdaCol, 0.92)} 0%, ${rgba(celdaCol, 0.4)} 100%)`,
                  boxShadow: `0 0 ${Math.round(lerp(18, 96, viaja))}px ${rgba(celdaCol, 0.5 + 0.2 * Math.sin(g / 11))}`,
                  opacity: ip(g, [960, 1046], [1, 0.5], EASE),
                  transform: `rotate(${lerp(0, -6, viaja).toFixed(2)}deg)`,
                }} />
              </Plane>
            )}
          </div>
        </div>
      </Layers>

      {/* ══════ CAPA DE PANTALLA: tipografía, instrumentos y la partícula de primer plano ══════ */}

      {/* polvo de primer plano — hold VIVO, nunca hay un frame quieto */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: ip(g, [0, 14], [0, 0.55], EASE) }}>
        {Array.from({ length: 16 }, (_, i) => {
          const sp = 0.5 + rnd(i * 4.1) * 1.6;
          const yy = (((rnd(i * 8.3) * 132 - (g * sp) / 8.5) % 132) + 132) % 132 - 14;
          const s = 3 + rnd(i * 2.2) * 5;
          return (
            <div key={i} style={{
              position: "absolute", left: `${(rnd(i * 11.7) * 104 - 2).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
              width: s, height: s, borderRadius: "50%",
              background: rgba(V.white, 0.06 + rnd(i * 5.5) * 0.1),
            }} />
          );
        })}
      </AbsoluteFill>

      {/* ACTO 1 · titular */}
      <Blk g={g} from={92} to={294} x={6} y={66} w={720}>
        <Kick>La cuenta que no termina</Kick>
        <div style={{ height: 10 }} />
        <Head size={86}>TODOS LOS AÑOS,</Head>
        <Head size={86} color={V.volt}>PARA SIEMPRE</Head>
        <div style={{ height: 10 }} />
        <Body size={33}>250 a 400 dólares por año. <Em>Todos los años.</Em></Body>
      </Blk>

      {/* ACTO 1 · los tres consumibles que se nombran en el guion (f282) */}
      {[
        { t: "Aceite", x: 52, at: 286 },
        { t: "Filtro", x: 61, at: 294 },
        { t: "Bujías", x: 70, at: 302 },
      ].map((c) => {
        const a = ip(g, [c.at, c.at + 12], [0, 1], EASE) * ip(g, [322, 346], [1, 0]);
        if (a <= 0.004) return null;
        return (
          <div key={c.t} style={{
            position: "absolute", left: `${c.x}%`, top: "64%", transform: `translate(-50%,-50%) translateY(${((1 - a) * 14).toFixed(1)}px)`,
            opacity: a, padding: "8px 18px", borderRadius: 8,
            background: rgba(V.ink0, 0.82), border: `1px solid ${rgba(V.volt, 0.3)}`,
            boxShadow: `0 10px 30px ${rgba(V.ink0, 0.8)}`,
          }}>
            <Kick color={rgba(V.white, 0.9)}>{c.t}</Kick>
          </div>
        );
      })}

      {/* ACTO 2 · titular + instrumentos */}
      <Blk g={g} from={356} to={668} x={6} y={72} w={620}>
        <Kick>La prueba semanal</Kick>
        <div style={{ height: 10 }} />
        <Head size={80}>DOCE MINUTOS</Head>
        <Head size={80} color={V.volt}>POR SEMANA</Head>
      </Blk>

      <AbsoluteFill style={{
        pointerEvents: "none",
        opacity: ip(g, [346, 366], [0, 1], EASE) * ip(g, [652, 676], [1, 0]),
      }}>
        <Readout
          value={String(litN)} unit="/520" label="Semanas quemando gas"
          at={352 + off} x={50} y={15} size={104} color={V.volt}
        />
        <IconPng src="img/cmegenerador/cmeg_ic_calendario.png" x={90} y={22} size={128} z={0} opacity={0.9} rot={-6} glow={V.ink0} />
      </AbsoluteFill>

      {/* la firma del canal: 12 minutos DE una semana entera (una celda de sesenta) */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: ip(g, [470, 496], [0, 1], EASE) * ip(g, [646, 672], [1, 0]) }}>
        <DutyField duty={1 / 60} cells={60} on={1} tint={V.volt} y={90} w={560} h={20} cycle={110} />
        <div style={{ position: "absolute", left: "50%", top: "84%", transform: "translateX(-50%)" }}>
          <Kick color={rgba(V.white, 0.66)}>Una semana · 12 minutos encendido</Kick>
        </div>
      </AbsoluteFill>

      {/* ACTO 3 · titular */}
      <Blk g={g} from={726} to={908} x={6} y={68} w={620}>
        <Kick color={V.torch}>Nadie en casa. Nadie mirando.</Kick>
        <div style={{ height: 10 }} />
        <Head size={80}>QUEMANDO GAS</Head>
        <Head size={80} color={V.danger}>PARA NADA</Head>
      </Blk>

      {/* ACTO 4 · la moneda que acompaña la suma */}
      {enActo4 && !enActo5 && (
        <AbsoluteFill style={{ pointerEvents: "none", opacity: ip(g, [1100, 1132], [0, 1], EASE) }}>
          <IconPng src="img/cmegenerador/cmeg_ic_moneda.png" x={60} y={22} size={110} z={0} opacity={0.92} rot={8} glow={V.ink0} />
        </AbsoluteFill>
      )}

      {/* ACTO 5 · la barra de 87.600 horas con el segmento minúsculo */}
      {enActo5 && (
        <>
          <div style={{
            position: "absolute", left: "6%", top: "62%", width: "88%", height: 30,
            transform: `translateY(${(barSink * 52).toFixed(1)}px) rotateX(${(barSink * 26).toFixed(1)}deg)`,
            transformOrigin: "50% 100%",
            opacity: ip(g, [1326, 1344], [0, 1], EASE) * (1 - barSink * 0.88),
            borderRadius: 4, background: rgba(V.ink2, 0.9),
            boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.12)}, 0 18px 44px ${rgba(V.ink0, 0.85)}`,
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: `${(barP * 100).toFixed(2)}%`,
              background: `linear-gradient(90deg, ${rgba(V.concrete, 0.42)} 0%, ${rgba(V.concrete, 0.2)} 100%)`,
            }} />
            {/* las 30 horas reales, a escala honesta */}
            <div style={{
              position: "absolute", left: "26%", top: 0, bottom: 0, width: 6,
              background: V.volt,
              opacity: ip(barP, [0.26, 0.31], [0, 1]),
              boxShadow: `0 0 ${Math.round(16 + 12 * Math.sin(g / 9))}px ${rgba(V.volt, 0.85)}`,
            }} />
          </div>

          <div style={{
            position: "absolute", left: "6%", top: "56.5%",
            opacity: ip(g, [1334, 1356], [0, 1], EASE) * (1 - barSink),
          }}>
            <Kick color={rgba(V.white, 0.6)}>Diez años · 87.600 horas</Kick>
          </div>
          <div style={{
            position: "absolute", left: "28.9%", top: "50%", transform: "translateX(-50%)",
            textAlign: "center", opacity: ip(g, [1348, 1372], [0, 1], EASE) * (1 - barSink),
          }}>
            <Kick color={V.volt}>30 h</Kick>
            <div style={{ width: 2, height: 70, margin: "6px auto 0", background: `linear-gradient(180deg, ${rgba(V.volt, 0.8)}, rgba(0,0,0,0))` }} />
          </div>
          <AbsoluteFill style={{ pointerEvents: "none", opacity: ip(g, [1352, 1380], [0, 1], EASE) * (1 - barSink) }}>
            <IconPng src="img/cmegenerador/cmeg_ic_lupa.png" x={33.5} y={57} size={92} z={0} opacity={0.85} rot={-12} glow={V.ink0} />
          </AbsoluteFill>

          <Blk g={g} from={1330} to={1424} x={6} y={70} w={660}>
            <Kick color={V.torch}>Con suerte</Kick>
            <div style={{ height: 8 }} />
            <Head size={66}>TREINTA HORAS EN DIEZ AÑOS</Head>
            <div style={{ height: 8 }} />
            <Body size={30}>Toda la década de apagones cabe en <Em>ese hilo verde.</Em></Body>
          </Blk>
        </>
      )}

      {/* ── el negro casi total del final (la entrega a MovEtiqueta) ─────────────────────────── */}
      <AbsoluteFill style={{ background: rgba(V.ink0, velo), pointerEvents: "none" }} />

      {/* la cifra queda SOLA, por encima del velo */}
      <Cifra g={g} />

      {/* ══════════════════════ COSTURAS ══════════════════════ */}

      {/* F3 @1050 · WIPE POR MATERIA: el humo de escape cruza y detrás ya está la losa */}
      <SeamWipeMatter at={1026 + off} dur={52} tint={V.concrete} />
      <SeamWipeMatter at={1034 + off} dur={44} tint={V.steel} />
      {humoA > 0.01 && g > 1020 && g < 1084 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {Array.from({ length: 22 }, (_, i) => {
            const o = rnd(i * 3.7);
            const p = clamp01(humo * 1.45 - o * 0.36);
            const sz = 320 + o * 420;
            return (
              <div key={i} style={{
                position: "absolute", top: `${(4 + rnd(i * 6.1) * 84).toFixed(1)}%`,
                left: `${lerp(-34, 132, p).toFixed(1)}%`,
                width: sz, height: sz, marginLeft: -sz / 2, marginTop: -sz / 2, borderRadius: "50%",
                background: `radial-gradient(circle, ${rgba(i % 2 ? V.steel : V.concrete, 0.4 * humoA)} 0%, rgba(0,0,0,0) 70%)`,
                filter: "blur(18px)",
              }} />
            );
          })}
          {/* el frente denso del escape: la materia que tapa el cambio de acto */}
          <div style={{
            position: "absolute", top: "-20%", height: "140%", width: "150%",
            left: `${lerp(-150, 100, clamp01(humo)).toFixed(1)}%`,
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.concrete, 0.9 * humoA)} 26%, ${rgba(V.steel, 0.94 * humoA)} 56%, rgba(0,0,0,0) 100%)`,
            filter: "blur(10px)", transform: "rotate(-5deg)",
          }} />
        </AbsoluteFill>
      )}

      {/* F4 @1320 · OCLUSIÓN: una chapa de acero cruza y deja la cifra sola */}
      <SeamOcclude at={1310 + off} dur={18} color={V.steel} angle={-7} />

      {/* acento de beat sobre el total (f1143) — no es una frontera de acto */}
      <SeamFlash at={1143 + off} color={V.amber} dur={6} />
    </AbsoluteFill>
  );
};

export default MovDiezAnos;
