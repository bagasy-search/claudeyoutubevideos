// MovSuma.tsx — S4 · UN MOVIMIENTO CONTINUO de 54 s (1620 frames · arranca en el seg. 462.0)
// "Trescientos ocho sumados, mil cuatrocientos cincuenta en el peor instante,
//  y la maquina de veintidos mil al siete por ciento toda la noche."
//
// ═══════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF  (el acto N+1 arranca EXACTAMENTE en el exitTo del acto N)
// ═══════════════════════════════════════════════════════════════════════════════════════════
// acto 1 · 0 → 330   TRESCIENTOS OCHO
//   enterFrom  CAM  z≈10, pan 0 — la camara viene bajando con el haz de `MovEtiqueta`
//              LUZ  el verde del display (V.volt) domina · keyFrom 0.55 · intensity 0.72
//              MAT  LA CURVA DEL CONSUMO dibujada en el aire (la deja `MovEtiqueta`)
//   exitTo     CAM  z≈116, panX −6, ry +0.5 (la camara ya viaja hacia la derecha)
//              LUZ  volt tibiandose hacia ambar (light 0 → 0.5)
//              MAT  la FICHA DEL CONGELADOR (clip real) se desprende de la columna y viaja
//
// acto 2 · 330 → 660  SEISCIENTOS OCHO
//   enterFrom  CAM  z≈116, panX −6, ry +0.5  ·  LUZ volt→ambar  ·  MAT la ficha del congelador
//   exitTo     CAM  z≈120, panX −44, ry +0.5 ·  LUZ ambar pleno (la caldera calienta el cuadro)
//              MAT  el AIRE CALIENTE de la caldera cruzando el cuadro
//
// acto 3 · 660 → 1020  MIL CUATROCIENTOS CINCUENTA
//   enterFrom  CAM  z≈120, panX −44  ·  LUZ ambar  ·  MAT el aire caliente se disipa sobre la pinza
//   exitTo     CAM  z≈346 — la camara ENTRA en el pico — panX −74, ry −1.7
//              LUZ  ambar→volt: vuelve el verde de la medicion justo en el instante del pico
//              MAT  la MAQUINA ya esta ahi, minuscula, EN el punto del pico (la camara la atraviesa)
//
// acto 4 · 1020 → 1350  AL SIETE POR CIENTO
//   enterFrom  CAM  z≈−170 (salio del otro lado del pico), panX −42  ·  LUZ volt
//              MAT  la maquina crece desde el punto del pico hasta llenar el cuadro
//   exitTo     CAM  z≈187, panX +15, rx +0.3 — frio duro desde arriba sobre la maquina apagada
//              LUZ  volt→steel · keyFrom 0.5 · intensity 1.0
//              MAT  la CHAPA GRIS del generador (V.steel) ocluye el 100 % del cuadro
//
// acto 5 · 1350 → 1620  NO ES SOLO CARA
//   enterFrom  CAM  z≈187, panX +15  ·  LUZ steel  ·  MAT el hollin del escape (entro en el acto 4)
//   exitTo     CAM  z≈400 — la camara CERRADA sobre el escape, el metal llena el cuadro
//              LUZ  frio duro (steel/sky), keyFrom 0.46
//              MAT  el METAL DEL ESCAPE a sangre → es con lo que abre `MovFaltan`
//
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ───────────────────────────────
//   1→2  MATCH-MOVE       f300-352  la columna se desliza a la izquierda y entra la caldera
//   2→3  WIPE POR MATERIA f634      aire caliente (SeamWipeMatter tint = V.torch)
//   3→4  ZOOM-THROUGH     f1002     la camara entra por el pico y sale en el patio
//   4→5  OCLUSION         f1336     la chapa del generador (SeamOcclude color = V.steel)
//
// ── CONTRATO ────────────────────────────────────────────────────────────────────────────────
//   UNA VoltAtmos montada una sola vez (sus props evolucionan, jamas se remonta) ·
//   UNA camara funcion de gFrame que nunca vuelve a 0 · rutas SOLO literales ·
//   cero Math.random / Date.now / backdrop-filter / Easing.quint.
//   ⚠ los ROTULOS viven FUERA del volumen 3D: dentro, un plano de texto con translateZ negativo
//   queda DETRAS de las tarjetas (el orden entre hermanos lo decide su propio z, no el de la
//   camara) y ademas la perspectiva lo escupe fuera de la safe area. Toma su parallax del
//   MISMO pan de camara, amortiguado.
// ═══════════════════════════════════════════════════════════════════════════════════════════

import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

// ── helper: tarjeta de VIDEO que LOOPEA. Los clips duran 5,1 s = 153 frames y los actos duran
// mas: cada vuelta es su propia <Sequence layout="none">, asi el frame de origen del clip queda
// anclado y el material nunca se congela (regla del hold VIVO). `fromL` va en frames LOCALES.
const VideoCard: React.FC<{
  fromL: number; loops?: number; src: string;
  w: number; h: number; x: number; y: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; label?: string; opacity?: number; sheenAt?: number;
}> = ({ fromL, loops = 3, sheenAt, ...rest }) => (
  <>
    {Array.from({ length: loops }, (_, k) => (
      <Sequence key={k} from={fromL + k * 150} durationInFrames={150} layout="none">
        <MediaCard kind="video" {...rest} sheenAt={k === 0 && sheenAt !== undefined ? sheenAt : -999} />
      </Sequence>
    ))}
  </>
);

// ── las cinco fichas que suman 308 (120 + 45 + 18 + 95 + 30) ────────────────────────────────
// Cada una lleva MATERIAL REAL adentro; el icono PNG es el emblema y el numero vive al lado.
const ROWS: {
  src: string; kind: "video" | "photo"; ic: string; label: string; w: number; watts: number;
}[] = [
  { src: "broll/cmegenerador/cmeg_mv_suma1.mp4", kind: "video", ic: "img/cmegenerador/cmeg_ic_congelador.png", label: "CONGELADOR", w: 300, watts: 120 },
  { src: "img/cmegenerador/cmeg_mv_suma3.jpg",   kind: "photo", ic: "img/cmegenerador/cmeg_ic_foco.png",       label: "FOCOS LED",  w: 272, watts: 45 },
  { src: "broll/cmegenerador/cmeg_mv_suma3.mp4", kind: "video", ic: "img/cmegenerador/cmeg_ic_telefono.png",   label: "MÓDEM",      w: 288, watts: 18 },
  { src: "img/cmegenerador/cmeg_mv_suma1.jpg",   kind: "photo", ic: "img/cmegenerador/cmeg_ic_enchufe.png",    label: "TELEVISOR",  w: 296, watts: 95 },
  { src: "img/cmegenerador/cmeg_mv_suma3.jpg",   kind: "photo", ic: "img/cmegenerador/cmeg_ic_bateria.png",    label: "CARGADORES", w: 264, watts: 30 },
];
const ROW_Y = [19.5, 33.5, 47.5, 61.5, 75.5];   // % de pantalla, centro de cada ficha
const ROW_F = [40, 86, 132, 178, 224];          // frame en el que cae cada ficha

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EZ = Easing.bezier(0.22, 0.72, 0.24, 1);

export const MovSuma: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const local = useCurrentFrame();
  const g = Math.max(0, Math.min(1620, gFrame));
  // gFrame (frame del MOVIMIENTO) -> frame del contexto local, para todo prop `at` / `from`.
  const off = local - gFrame;
  const L = (x: number) => x + off;
  const marca = "suma-acto-" + Math.max(1, Math.min(5, acto || 1));

  // ── LA CÁMARA: UNA sola, funcion de gFrame, jamas vuelve a 0 ──────────────────────────────
  const base = gcam(g, { z0: 10, z1: 180, panX: -70, panY: -22, ry: 2.6, rx: -0.9, dur: 1620 });
  const KF = [0, 300, 352, 645, 860, 1002, 1020, 1120, 1350, 1470, 1620];
  const kz  = interpolate(g, KF, [0, 35, 20, 55, 85, 190, -170, -55, 15, 95, 220], { easing: EZ, ...CLAMP });
  const kx  = interpolate(g, KF, [0, -6, -30, -44, -64, -74, -42, -20, 15, 30, 44], { easing: EZ, ...CLAMP });
  const ky  = interpolate(g, KF, [0, -5, -16, -30, -46, -62, 16, 30, 40, 18, -12], { easing: EZ, ...CLAMP });
  const kry = interpolate(g, KF, [0, 0.5, 1.3, 0.5, -0.7, -1.7, 1.4, 0.6, -0.4, -1.0, -1.6], { easing: EZ, ...CLAMP });
  const krx = interpolate(g, KF, [0, -0.3, -0.5, -0.2, 0.4, 0.9, -0.7, -0.3, 0.3, 0.55, 0.85], { easing: EZ, ...CLAMP });
  const camK =
    "translateZ(" + kz.toFixed(2) + "px) translate3d(" + kx.toFixed(2) + "px, " + ky.toFixed(2) + "px, 0) " +
    "rotateY(" + kry.toFixed(3) + "deg) rotateX(" + krx.toFixed(3) + "deg)";
  // parallax amortiguado de la capa de rotulos: mismo pan de camara, sin la escala de perspectiva
  const ovT = "translate(" + (kx * 0.86).toFixed(2) + "px, " + (ky * 0.86).toFixed(2) + "px)";

  // ── LA LUZ QUE EVOLUCIONA (continua en cada frontera: llega y sale con el mismo color) ─────
  const keyCol =
    g < 660 ? light(clamp01(g / 660), "volt", "amber")
    : g < 1020 ? light(clamp01((g - 660) / 360), "amber", "volt")
    : light(clamp01((g - 1020) / 560), "volt", "steel");
  const key2 =
    g < 1020 ? light(clamp01(g / 1020), "amber", "torch")
    : light(clamp01((g - 1020) / 600), "torch", "sky");
  const keyFrom = interpolate(g, [0, 660, 1020, 1620], [0.55, 0.4, 0.5, 0.46], CLAMP);
  const inten = interpolate(g, [0, 330, 900, 1020, 1620], [0.72, 0.8, 0.86, 1.0, 0.92], CLAMP);
  const flr = interpolate(g, [0, 1020, 1620], [0.55, 0.62, 0.74], CLAMP);
  const bgDim = interpolate(g, [0, 996, 1086, 1620], [0.78, 0.74, 0.62, 0.7], CLAMP);

  // el HAZ que baja (heredado de MovEtiqueta) y que en el acto 4 se vuelve el reflector frio
  const beamX = interpolate(g, [0, 660, 1020, 1350, 1620], [30, 42, 52, 50, 49], CLAMP) + Math.sin(g / 71) * 1.1;
  const beamOp = interpolate(g, [0, 330, 1002, 1090, 1350, 1620], [0.36, 0.24, 0.2, 0.46, 0.34, 0.16], CLAMP);

  // ═══ ACTO 1 ═══ la curva del consumo se pliega y se vuelve el RIEL de la columna ═══════════
  const foldE = interpolate(clamp01((g - 6) / 46), [0, 1], [0, 1], { easing: Easing.bezier(0.3, 0.85, 0.25, 1) });
  const curvePts = Array.from({ length: 26 }, (_, i) => {
    const x0 = 90 + (i / 25) * 1740;
    const y0 = 640 - rnd(i * 4.3) * 260 - Math.sin(i / 2.6) * 70;
    const x = lerp(x0, 300, foldE);
    const y = lerp(y0, 196 + (i / 25) * 700, foldE);
    return x.toFixed(1) + "," + y.toFixed(1);
  }).join(" ");
  const railHead = 196 + ((g * 3.4) % 700);
  const a1out = interpolate(g, [300, 352], [0, -1240], { easing: Easing.bezier(0.5, 0, 0.36, 1), ...CLAMP });

  // el total que se suma en vivo y despues salta a 608
  let tot = 0;
  for (let i = 0; i < 5; i++) {
    tot += ROWS[i].watts * interpolate(g, [ROW_F[i] + 14, ROW_F[i] + 26], [0, 1], { easing: EZ, ...CLAMP });
  }
  const t608 = interpolate(g, [392, 424], [0, 1], { easing: EZ, ...CLAMP });
  const totalShown = Math.round(tot + 300 * t608);
  const totPulse = 1 + 0.11 * clamp01(1 - Math.abs(g - 277) / 15) + 0.11 * clamp01(1 - Math.abs(g - 424) / 15);

  // ═══ LA FICHA DEL CONGELADOR: la materia que cruza las fronteras 1→2 y 2→3 ═════════════════
  const f1 = interpolate(g, [300, 352], [0, 1], { easing: EZ, ...CLAMP });   // columna -> mini del acto 2
  const f2 = interpolate(g, [645, 700], [0, 1], { easing: EZ, ...CLAMP });   // mini -> acto 3
  const f3 = interpolate(g, [830, 872], [0, 1], { easing: Easing.out(Easing.back(1.4)), ...CLAMP }); // arranca el compresor
  const f4 = interpolate(g, [940, 988], [0, 1], { easing: Easing.bezier(0.5, 0, 0.4, 1), ...CLAMP }); // sale de cuadro
  const frzDrop = interpolate(g, [ROW_F[0], ROW_F[0] + 22], [0, 1], { easing: Easing.out(Easing.back(1.5)), ...CLAMP });
  const frzW = lerp(lerp(lerp(300, 196, f1), 210, f2), 264, f3);
  const frzH = lerp(lerp(lerp(152, 112, f1), 120, f2), 150, f3);
  const frzX = lerp(lerp(30, 11, f1), 13.5, f2) - 30 * f4;
  const frzY = lerp(lerp(ROW_Y[0], 17, f1), 20.5, f2) + (1 - frzDrop) * -15;
  const frzOn = g >= ROW_F[0] && g < 1026;

  // ═══ ACTO 2 ═══ la caldera entra desde la derecha (MATCH-MOVE) ═════════════════════════════
  const a2in = interpolate(g, [300, 356], [0, 1], { easing: Easing.bezier(0.32, 0.75, 0.26, 1), ...CLAMP });
  const caldX = lerp(112, 46, a2in);
  const chip300 = interpolate(g, [366, 400], [0, 1], { easing: Easing.out(Easing.back(1.35)), ...CLAMP });
  const dutyOn = interpolate(g, [446, 500, 640, 700, 940, 1000], [0, 0.92, 0.92, 0.3, 0.3, 0], CLAMP);

  // ═══ ACTO 3 ═══ la aguja salta y vuelve en menos de un segundo ═════════════════════════════
  const GN = 180, gx0 = 1090, gx1 = 1750, gyTop = 262, gyBot = 806;
  const gval = (i: number) => {
    const b = 592 + Math.sin(i / 6.2) * 15 + rnd(i * 2.1) * 24;
    const s = Math.pow(clamp01(1 - Math.abs(i - 141) / 9), 1.7);
    return b + (1450 - b) * s;
  };
  const gxOf = (i: number) => gx0 + (i / (GN - 1)) * (gx1 - gx0);
  const gyOf = (v: number) => gyBot - clamp01(v / 1600) * (gyBot - gyTop);
  const revealN = Math.max(2, Math.floor(interpolate(g, [740, 900], [0, GN], CLAMP)));
  const plotPts = Array.from({ length: revealN }, (_, i) => gxOf(i).toFixed(1) + "," + gyOf(gval(i)).toFixed(1)).join(" ");
  const peakX = gxOf(141), peakY = gyOf(1450);
  const peakOn = clamp01((g - 866) / 10);
  const ringP = clamp01(((g - 866) % 44) / 44);
  const a3settle = interpolate(g, [645, 700], [1.07, 1], { easing: EZ, ...CLAMP });
  const zt = zoomThrough(g, 1002, 18, 79, 30);

  // ═══ ACTO 4 ═══ la maquina enorme con la franja minuscula encendida ════════════════════════
  const a4p = interpolate(g, [996, 1002, 1090], [0, 0, 1], { easing: Easing.bezier(0.2, 0.72, 0.24, 1), ...CLAMP });
  const a4w = lerp(150, 1240, a4p), a4h = lerp(84, 660, a4p);
  const a4x = lerp(79, 44, a4p), a4y = lerp(30, 52, a4p);
  const colTop = 250, colH = 620, colLeft = 1318, colW = 72;
  const colP = interpolate(g, [1092, 1148], [0, 1], { easing: EZ, ...CLAMP });   // se dibuja hacia ARRIBA
  const litP = interpolate(g, [1148, 1166], [0, 1], { easing: Easing.out(Easing.back(1.8)), ...CLAMP });
  const litH = colH * 0.0659;                                                     // 1.450 de 22.000 = 6,59 %
  const litGlow = 0.5 + 0.5 * Math.sin((g - 1148) / 9) * clamp01((g - 1148) / 40);
  const a4titulo = interpolate(g, [1186, 1226], [0, 1], { easing: EZ, ...CLAMP });

  // ═══ ACTO 5 ═══ el hollin: entra en el acto 4 y CRUZA la oclusion ══════════════════════════
  const sIn = interpolate(g, [1272, 1308], [0, 1], { easing: Easing.out(Easing.back(1.3)), ...CLAMP });
  const sBig = interpolate(g, [1332, 1466], [0, 1], { easing: Easing.bezier(0.32, 0, 0.2, 1), ...CLAMP });
  const sEx = interpolate(g, [1466, 1620], [0, 1], { easing: Easing.bezier(0.4, 0, 0.6, 1), ...CLAMP });
  const sootW = lerp(lerp(250, 1420, sBig), 1560, sEx);
  const sootH = lerp(lerp(146, 790, sBig), 868, sEx);
  const sootX = lerp(72, 50, sBig);
  const sootY = lerp(87 + (1 - sIn) * 10, 50, sBig);
  const a5kick = interpolate(g, [1400, 1438], [0, 1], { easing: EZ, ...CLAMP });
  const a5head = interpolate(g, [1592, 1616], [0, 1], { easing: Easing.out(Easing.back(1.2)), ...CLAMP });

  const rowBlock = (i: number) => {
    const dp = interpolate(g, [ROW_F[i], ROW_F[i] + 22], [0, 1], { easing: Easing.out(Easing.back(1.5)), ...CLAMP });
    return { dp, dy: (1 - dp) * -168, sc: lerp(1.07, 1, dp) };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ATMOSFERA: montada UNA sola vez para los 1620 frames — solo evolucionan sus props */}
      <VoltAtmos tint={keyCol} tint2={key2} keyFrom={keyFrom} intensity={inten} floor={flr} />

      {/* ══════════════ EL VOLUMEN 3D (7 planos con parallax propio) ══════════════════════ */}
      <Layers cam={base.transform}>
        <AbsoluteFill style={{ transform: camK, transformStyle: "preserve-3d" }}>

          {/* PLANO 1 · z −620 — el patio de noche (la misma maquina que se revela en el acto 4) */}
          <PhotoPlane src="img/cmegenerador/cmeg_mv_suma4.jpg" kind="photo" z={-620} scale={1.24} dim={bgDim} tint={V.steel} />

          {/* PLANO 2 · z −470 — EL HAZ que baja (viene de MovEtiqueta) y se vuelve reflector frio */}
          <Plane z={-470} style={{ transform: "translateZ(-470px) translateX(" + (Math.sin(g / 103) * 9).toFixed(1) + "px)" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
              clipPath: "polygon(" + (beamX - 7).toFixed(1) + "% 0%, " + (beamX + 7).toFixed(1) + "% 0%, " +
                (beamX + 31).toFixed(1) + "% 100%, " + (beamX - 31).toFixed(1) + "% 100%)",
              background: "linear-gradient(180deg, " + rgba(keyCol, 0.34 * beamOp) + " 0%, " +
                rgba(keyCol, 0.11 * beamOp) + " 46%, rgba(0,0,0,0) 84%)",
              mixBlendMode: "screen",
            }} />
          </Plane>

          {/* PLANO 3 · z −300 — LA LOSA del patio: el suelo donde aterrizan todas las sombras */}
          <PadPlane y={82} w={1520} h={340} rx={64} lit={interpolate(g, [0, 1020, 1620], [0.5, 0.85, 0.62], CLAMP)} z={-300} />

          {/* PLANO 4 · z −140 — capa grafica: el ciclo de trabajo real (8 celdas de cada 30) */}
          <Plane z={-140} style={{ transform: "translateZ(-140px) translateX(" + (Math.sin(g / 137) * 5).toFixed(1) + "px)" }}>
            <DutyField duty={8 / 30} cells={30} on={dutyOn} tint={g < 660 ? V.amber : V.volt} y={89} w={1120} h={36} cycle={150} />
          </Plane>

          {/* PLANO 5a · z −120 — la CURVA que se pliega hasta volverse el riel de la columna */}
          {g < 352 && (
            <Plane z={-120} style={{ transform: "translateZ(-120px) translateX(" + a1out.toFixed(1) + "px)" }}>
              <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", left: 0, top: 0 }}>
                <polyline points={curvePts} fill="none" stroke={rgba(V.volt, 0.14)} strokeWidth={14} strokeLinejoin="round" />
                <polyline points={curvePts} fill="none" stroke={rgba(V.volt, 0.5)} strokeWidth={3.5} strokeLinejoin="round" />
                {foldE > 0.85 && <circle cx={300} cy={railHead} r={7} fill={V.volt} opacity={0.9} />}
                {ROW_Y.map((ry, i) => (
                  <line key={i} x1={300} y1={ry * 10.8} x2={lerp(300, 430, clamp01((g - ROW_F[i]) / 14))} y2={ry * 10.8}
                    stroke={rgba(V.volt, 0.45)} strokeWidth={2.5} />
                ))}
              </svg>
            </Plane>
          )}

          {/* PLANO 5b · z −140 — el PICO dibujado: sube y vuelve en menos de un segundo */}
          {g >= 645 && g < 1022 && (
            <Plane z={-140} style={{ transform: "translateZ(-140px) " + (zt.out === "none" ? "" : zt.out), opacity: zt.opacity }}>
              <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", left: 0, top: 0 }}>
                <line x1={gx0 - 34} y1={gyTop - 20} x2={gx0 - 34} y2={gyBot} stroke={rgba(V.white, 0.24)} strokeWidth={2} />
                <line x1={gx0 - 34} y1={gyBot} x2={gx1 + 20} y2={gyBot} stroke={rgba(V.white, 0.24)} strokeWidth={2} />
                <line x1={gx0 - 34} y1={gyOf(608)} x2={gx1 + 20} y2={gyOf(608)} stroke={rgba(V.white, 0.16)} strokeWidth={2} strokeDasharray="9 11" />
                <polyline points={plotPts} fill="none" stroke={rgba(keyCol, 0.16)} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />
                <polyline points={plotPts} fill="none" stroke={keyCol} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
                {peakOn > 0 && (
                  <>
                    <line x1={peakX} y1={peakY} x2={peakX} y2={gyBot} stroke={rgba(V.amber, 0.5 * peakOn)} strokeWidth={2} strokeDasharray="7 9" />
                    <circle cx={peakX} cy={peakY} r={9 + 16 * (1 - peakOn)} fill="none" stroke={rgba(V.amber, 0.85 * peakOn)} strokeWidth={3} />
                    <circle cx={peakX} cy={peakY} r={6} fill={V.amber} opacity={peakOn} />
                    <circle cx={peakX} cy={peakY} r={16 + 26 * ringP} fill="none"
                      stroke={rgba(V.amber, 0.34 * peakOn * (1 - ringP))} strokeWidth={2.5} />
                  </>
                )}
              </svg>
              <div style={{
                position: "absolute", left: gx0 + 8, top: gyOf(608) + 12,
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 2,
                color: rgba(V.white, 0.62), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
              }}>608 W · LA BASE</div>
            </Plane>
          )}

          {/* ── PLANO 6 · z +20..40 — EL MATERIAL REAL ─────────────────────────────────────── */}

          {/* LA FICHA DEL CONGELADOR: materia que cruza las fronteras 1→2 y 2→3 */}
          {frzOn && (
            <VideoCard
              fromL={L(ROW_F[0])} loops={8}
              src="broll/cmegenerador/cmeg_mv_suma1.mp4"
              w={frzW} h={frzH} x={frzX} y={frzY} z={22}
              ry={lerp(-4, 2, f1)} lit={0.92} litColor={keyCol}
              label={f2 > 0.5 ? "COMPRESOR" : "308 W"} sheenAt={30} />
          )}

          {/* ACTO 1 — las otras cuatro fichas caen en columna (la 0 vive aparte: es la que viaja) */}
          {g < 352 && ROWS.map((r, i) => {
            if (i === 0 || g < ROW_F[i]) return null;
            const b = rowBlock(i);
            return r.kind === "video" ? (
              <VideoCard key={"c" + i} fromL={L(ROW_F[i])} loops={2} src={r.src}
                w={r.w * b.sc} h={152 * b.sc} x={30 + a1out / 19.2} y={ROW_Y[i] + b.dy / 10.8} z={20}
                ry={lerp(-8, -2.5, b.dp)} lit={0.9} litColor={keyCol} sheenAt={30} />
            ) : (
              <MediaCard key={"c" + i} src={r.src} kind="photo"
                w={r.w * b.sc} h={152 * b.sc} x={30 + a1out / 19.2} y={ROW_Y[i] + b.dy / 10.8} z={20}
                ry={lerp(-8, -2.5, b.dp)} lit={0.9} litColor={keyCol} sheenAt={L(ROW_F[i] + 26)} />
            );
          })}

          {/* ACTO 2 — la caldera entra desde la derecha */}
          {g >= 300 && g < 652 && (
            <VideoCard fromL={L(300)} loops={3}
              src="broll/cmegenerador/cmeg_mv_suma2.mp4"
              w={920} h={540} x={caldX} y={52} z={40}
              ry={lerp(-14, -2, a2in)} lit={0.95} litColor={keyCol}
              label="CALDERA · EL VENTILADOR ARRANCA" sheenAt={62} />
          )}

          {/* ACTO 3 — la pinza: la aguja salta y vuelve */}
          {g >= 645 && g < 1022 && (
            <div style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
              transform: zt.out, opacity: zt.opacity, transformStyle: "preserve-3d",
            }}>
              <VideoCard fromL={L(645)} loops={3}
                src="broll/cmegenerador/cmeg_mv_suma3.mp4"
                w={720 * a3settle} h={470 * a3settle} x={35} y={50} z={30}
                ry={-3.2} lit={1} litColor={keyCol} label="LA AGUJA SALTA Y VUELVE" sheenAt={40} />
            </div>
          )}

          {/* ACTO 4 — la maquina crece desde el punto exacto del pico */}
          {g >= 996 && g < 1346 && (
            <VideoCard fromL={L(996)} loops={3}
              src="broll/cmegenerador/cmeg_mv_suma4.mp4"
              w={a4w} h={a4h} x={a4x} y={a4y} z={20}
              ry={lerp(6, -1.4, a4p)} lit={lerp(0.5, 0.84, a4p)} litColor={keyCol}
              label={a4p > 0.9 ? "22.000 W · TODA LA NOCHE" : undefined} sheenAt={110} />
          )}

          {/* EL HOLLIN — entra en el acto 4 y CRUZA la oclusion hacia el acto 5 */}
          {g >= 1272 && (
            <VideoCard fromL={L(1272)} loops={3}
              src="broll/cmegenerador/cmeg_mv_suma5.mp4"
              w={sootW} h={sootH} x={sootX} y={sootY} z={26}
              ry={lerp(7, 0, sBig)} lit={lerp(0.8, 0.62, sBig)} litColor={keyCol}
              label={sBig < 0.25 ? "HOLLÍN" : undefined} radius={lerp(14, 6, sBig)} sheenAt={40} />
          )}

          {/* PLANO 7 · z +320 — motas en primer plano (el aire del patio nunca esta limpio) */}
          <Plane z={320} style={{ transform: "translateZ(320px)", pointerEvents: "none" }}>
            {Array.from({ length: 16 }, (_, i) => {
              const sp = 0.5 + rnd(i * 8.7) * 1.5;
              const yy = (((rnd(i * 3.9) * 130 - (g * sp) / 13) % 130) + 130) % 130 - 12;
              const s = 3 + rnd(i * 5.1) * 5;
              return (
                <div key={i} style={{
                  position: "absolute", left: (rnd(i * 11.3) * 104 - 2).toFixed(2) + "%", top: yy.toFixed(2) + "%",
                  width: s, height: s, borderRadius: "50%",
                  background: rgba(V.white, 0.06 + rnd(i * 6.2) * 0.1),
                }} />
              );
            })}
          </Plane>

        </AbsoluteFill>
      </Layers>

      {/* ══════════════ CAPA DE ROTULOS (fuera del volumen: siempre delante y legible) ══════ */}
      <AbsoluteFill style={{ transform: ovT, pointerEvents: "none" }}>

        {/* ACTO 1 — iconos, rotulos y vatios de cada ficha (viajan con el MATCH-MOVE) */}
        {g < 352 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: "translateX(" + a1out.toFixed(1) + "px)" }}>
            {ROWS.map((r, i) => {
              if (g < ROW_F[i] + 4) return null;
              const b = rowBlock(i);
              const np = interpolate(g, [ROW_F[i] + 10, ROW_F[i] + 24], [0, 1], { easing: Easing.out(Easing.back(1.6)), ...CLAMP });
              return (
                <div key={"t" + i} style={{ opacity: clamp01(b.dp * 1.4), transform: "translateY(" + (b.dy * 0.4).toFixed(1) + "px)" }}>
                  <IconPng src={r.ic} x={44} y={ROW_Y[i] - 4.2} size={92} z={0} opacity={0.96} glow={V.ink0} />
                  <div style={{ position: "absolute", left: "49.5%", top: ROW_Y[i] + "%", transform: "translateY(-50%)" }}>
                    <Kick color={rgba(V.white, 0.8)}>{r.label}</Kick>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 9, transform: "scale(" + np.toFixed(3) + ")", transformOrigin: "0% 50%" }}>
                      <Num size={58} color={keyCol}>{r.watts}</Num>
                      <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, color: rgba(V.white, 0.62) }}>W</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ACTOS 1 y 2 — la suma en vivo: 0 → 308 → 608 (un solo bloque, nunca se remonta) */}
        {g < 652 && (
          <div style={{ position: "absolute", left: "70%", top: "27%", width: 430 }}>
            <div style={{ opacity: clamp01((g - 30) / 14) }}>
              <Kick color={rgba(V.white, 0.72)}>{g < 330 ? "TODA LA CASA, DE NOCHE" : "LA CALDERA ARRANCA"}</Kick>
            </div>
            <div style={{
              marginTop: 10,
              opacity: clamp01((g - (g < 330 ? 258 : 396)) / 12),
              transform: "translateY(" + interpolate(g, g < 330 ? [258, 282] : [396, 420], [26, 0], { easing: EZ, ...CLAMP }).toFixed(1) + "px)",
            }}>
              <Head size={62}>
                {g < 330
                  ? <><div>TRESCIENTOS</div><div>OCHO</div></>
                  : <><div>SEISCIENTOS</div><div>OCHO</div></>}
              </Head>
            </div>
            <div style={{
              marginTop: 22, display: "flex", alignItems: "baseline", gap: 12,
              transform: "scale(" + totPulse.toFixed(3) + ")", transformOrigin: "0% 50%",
            }}>
              <Num size={148} color={keyCol}>{totalShown}</Num>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 52, color: rgba(V.white, 0.6) }}>W</div>
            </div>
            <div style={{ marginTop: 4, opacity: 0.72 }}>
              <Body size={26} color={rgba(V.white, 0.62)}>
                {g < 330 ? "sumado circuito por circuito" : "y esto todavía no es el pico"}
              </Body>
            </div>
          </div>
        )}

        {/* ACTO 2 — el +300 de la caldera */}
        {g >= 300 && g < 652 && (
          <>
            <IconPng src="img/cmegenerador/cmeg_ic_calentador.png" x={11} y={22} size={104} z={0}
              opacity={0.95 * clamp01(chip300 * 1.3)} rot={-6} glow={V.ink0} />
            <div style={{
              position: "absolute", left: "7.5%", top: "35%",
              opacity: clamp01(chip300 * 1.3), transform: "translateY(" + ((1 - chip300) * 26).toFixed(1) + "px)",
            }}>
              <Bed pad={20} w={286}>
                <Kick color={rgba(V.white, 0.78)}>CUANDO ARRANCA</Kick>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <Num size={92} color={V.amber}>+300</Num>
                  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, color: rgba(V.white, 0.62) }}>W</div>
                </div>
              </Bed>
            </div>
          </>
        )}

        {/* ACTO 3 — el pico (viaja con el ZOOM-THROUGH, igual que la escena) */}
        {g >= 645 && g < 1022 && (
          <div style={{
            position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
            transform: zt.out, opacity: zt.opacity,
          }}>
            <Readout value="1.450" unit="W" label="EL PICO" at={L(866)} x={73} y={17} size={122} color={V.amber} />
            <div style={{
              position: "absolute", left: "9%", top: "74%",
              opacity: clamp01((g - 884) / 14),
              transform: "translateY(" + interpolate(g, [884, 912], [30, 0], { easing: EZ, ...CLAMP }).toFixed(1) + "px)",
            }}>
              <Kick color={rgba(V.white, 0.74)}>EL PEOR INSTANTE DE LA NOCHE</Kick>
              <div style={{ marginTop: 8 }}>
                <Head size={56}><div>MIL CUATROCIENTOS</div><div>CINCUENTA</div></Head>
              </div>
            </div>
            <IconPng src="img/cmegenerador/cmeg_ic_pinza.png" x={7.5} y={64} size={96} z={0}
              opacity={0.9 * clamp01((g - 700) / 20)} rot={-8} glow={V.ink0} />
          </div>
        )}

        {/* ACTO 4 — LA COLUMNA DE CAPACIDAD sobre el costado de la maquina:
            22.000 W de alto y SOLO el 6,59 % de abajo encendido. Que se vea cuanto sobra. */}
        {g >= 1086 && g < 1346 && (
          <>
            <div style={{
              position: "absolute", left: colLeft, top: colTop + colH * (1 - colP), width: colW, height: colH * colP,
              border: "2px solid " + rgba(V.steel, 0.62), borderRadius: 4,
              background: "linear-gradient(180deg, " + rgba(V.steel, 0.1) + " 0%, " + rgba(V.ink0, 0.42) + " 100%)",
              boxShadow: "inset 0 0 30px " + rgba(V.ink0, 0.8), overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: 0.5,
                backgroundImage: "repeating-linear-gradient(48deg, " + rgba(V.steel, 0.22) + " 0 2px, rgba(0,0,0,0) 2px 13px)",
              }} />
            </div>
            {litP > 0 && (
              <div style={{
                position: "absolute", left: colLeft, top: colTop + colH - litH * litP, width: colW, height: litH * litP,
                background: "linear-gradient(180deg, " + rgba(V.volt, 0.95) + " 0%, " + rgba(V.volt, 0.72) + " 100%)",
                boxShadow: "0 0 " + (18 + 26 * litGlow).toFixed(0) + "px " + rgba(V.volt, 0.6 + 0.3 * litGlow) +
                  ", inset 0 1px 0 " + rgba(V.white, 0.6),
                borderRadius: 3,
              }} />
            )}
            <div style={{ position: "absolute", left: colLeft + colW + 22, top: colTop - 14, opacity: clamp01((g - 1100) / 14) }}>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 46, color: rgba(V.steel, 0.95), textShadow: "0 4px 18px rgba(0,0,0,0.92)" }}>22.000 W</div>
              <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 25, color: rgba(V.white, 0.5), textShadow: "0 3px 14px rgba(0,0,0,0.9)" }}>lo que da la máquina</div>
            </div>
            <div style={{ position: "absolute", left: colLeft + colW + 22, top: colTop + colH - 54, opacity: clamp01((g - 1152) / 12) }}>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 46, color: V.volt, textShadow: "0 0 26px " + rgba(V.volt, 0.5) + ", 0 4px 18px rgba(0,0,0,0.92)" }}>1.450 W</div>
              <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 25, color: rgba(V.white, 0.5), textShadow: "0 3px 14px rgba(0,0,0,0.9)" }}>lo que usa la casa</div>
            </div>

            <Readout value="7" unit="%" label="DE SU CAPACIDAD" at={L(1164)} x={20} y={28} size={196} color={V.volt} />

            <div style={{
              position: "absolute", left: "6%", top: "62%", opacity: clamp01(a4titulo * 1.3),
              transform: "translateY(" + ((1 - a4titulo) * 30).toFixed(1) + "px)",
            }}>
              <Bed pad={24} w={520}>
                <Kick color={rgba(V.white, 0.74)}>TODA LA NOCHE</Kick>
                <div style={{ marginTop: 6 }}>
                  <Head size={60}><div>AL SIETE</div><div>POR CIENTO</div></Head>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Body size={28} color={rgba(V.bone, 0.86)}>quemando gas para no hacer nada</Body>
                </div>
              </Bed>
            </div>
            <IconPng src="img/cmegenerador/cmeg_ic_medidor.png" x={90} y={80} size={94} z={0}
              opacity={0.85 * clamp01((g - 1180) / 20)} rot={6} glow={V.ink0} />
          </>
        )}

        {/* ACTO 5 — el remate */}
        {g >= 1396 && (
          <>
            <div style={{
              position: "absolute", left: "50%", top: "71%", width: 1080, marginLeft: -540,
              textAlign: "center", opacity: clamp01(a5kick * 1.3),
            }}>
              <div style={{ transform: "translateY(" + ((1 - a5kick) * 24).toFixed(1) + "px)" }}>
                <Kick color={rgba(V.white, 0.76)}>ANDA FRÍO · SE ENSUCIA POR DENTRO</Kick>
              </div>
              <div style={{
                marginTop: 14, opacity: clamp01(a5head * 1.4),
                transform: "scale(" + lerp(0.9, 1, a5head).toFixed(3) + ")",
              }}>
                <Head size={78}>NO ES SOLO CARA</Head>
              </div>
            </div>
            <IconPng src="img/cmegenerador/cmeg_ic_termometro.png" x={11} y={19} size={92} z={0}
              opacity={0.82 * clamp01((g - 1420) / 24)} rot={-7} glow={V.ink0} />
          </>
        )}

      </AbsoluteFill>

      {/* ── COSTURA 2→3 · WIPE POR MATERIA: el aire caliente de la caldera cruza el cuadro ── */}
      <SeamWipeMatter at={L(634)} dur={22} tint={V.torch} />
      {/* ── COSTURA 4→5 · OCLUSION con la CHAPA del generador (V.steel = la MATERIA, no el fondo) */}
      <SeamOcclude at={L(1336)} dur={18} color={V.steel} angle={-7} />

      <div data-mov={marca} style={{ display: "none" }} />
    </AbsoluteFill>
  );
};
