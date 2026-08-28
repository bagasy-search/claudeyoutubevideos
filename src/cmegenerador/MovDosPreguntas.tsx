// MovDosPreguntas.tsx — S6 · UN MOVIMIENTO CONTINUO de 50 s (1500 frames @30fps)
// ESPINA: "El generador se dimensiona por el PICO. La batería por el PROMEDIO. Son dos preguntas distintas."
//
// ──────────────────────────────────────────────────────────────────────────────────────────────
//  TABLA DE HANDOFF  (el acto N+1 arranca EXACTAMENTE en el exitTo del N · nada se reinicia)
// ──────────────────────────────────────────────────────────────────────────────────────────────
//  ACTO 1 · g 0 → 360 · "DOS PREGUNTAS DISTINTAS"
//    enterFrom  CÁMARA  worldX 0 · gcam z −70 · ry +3 · ya en marcha (deriva heredada de MovCiclo)
//               LUZ     volt puro y duro, laboratorio negro (tint volt, keyFrom .30, floor .70)
//               MATERIA la TIRA DEL DUTYFIELD ENCENDIDA y centrada (es lo que deja MovCiclo)
//    exitTo     CÁMARA  worldX 1990 con velocidad MÁXIMA hacia la izquierda (el cruce, sin frenar)
//               LUZ     volt duro, la key ya corrida a keyFrom .22 (siguiendo a la cámara)
//               MATERIA la tarjeta del TABLERO ROJO DEL GENERADOR (dosp2), que en el acto 2 es el héroe
//
//  ACTO 2 · g 360 → 780 · "SI NO DA, SE APAGA"
//    enterFrom  CÁMARA  worldX 1990, viniendo del cruce, desacelerando (misma inercia, mismo vector)
//               LUZ     volt duro keyFrom .22
//               MATERIA el tablero rojo del generador (dosp2) a tamaño héroe sobre la losa
//    exitTo     CÁMARA  worldX 2110 → lateral rapidísimo tapado por la CHAPA (steel) hasta 3770
//               LUZ     volt cayendo a torch (la casa se apagó: sólo queda la brasa ámbar)
//               MATERIA la CAJA NEGRA de la estación (dosp3), que entró chiquita a la derecha en g 608
//                       + LA BRASA ÁMBAR (capa de pantalla, continua: es la casa que se apaga y
//                         después es la luz de la cocina de noche)
//
//  ACTO 3 · g 780 → 1200 · "SE LO COME SIN DESPEINARSE"
//    enterFrom  CÁMARA  worldX 3770, asentándose (sigue el MISMO vector, nunca vuelve)
//               LUZ     torch (noche de cocina), keyFrom .55, intensidad .82
//               MATERIA la caja negra de la estación (dosp3) ahora a tamaño héroe + la brasa ámbar
//    exitTo     CÁMARA  worldX 3910, casi quieta, empuje z continuo (el match-shape no necesita viaje)
//               LUZ     torch virando a ámbar bajo
//               MATERIA la TARJETA DEL PANEL CON LA PANTALLA ENCENDIDA (dosp1), 470×300 en x76/y28
//
//  ACTO 4 · g 1200 → 1500 · "TRES KILOVATIOS HORA"
//    enterFrom  CÁMARA  worldX 3910, empuje z heredado
//               LUZ     ámbar bajando (keyFrom .72 → .82, intensidad .70 → .56)
//               MATERIA la MISMA tarjeta dosp1 que se estira a 1160×264 y se vuelve el cuadro de la cuenta
//    exitTo     CÁMARA  worldX 3964, z 120 (queda viva, nunca frena del todo)
//               LUZ     ÁMBAR BAJO (intensidad .56, floor .58)   → lo que pide MovTresNumeros
//               MATERIA la CAJA NEGRA de la estación de energía, sola, con LA CIFRA 3 encima
//                       → MovTresNumeros la toma como el primero de los tres números
// ──────────────────────────────────────────────────────────────────────────────────────────────
//  COSTURAS (una distinta por frontera · ninguna es un fade)
//    F1 g360  MATCH-MOVE   — la cámara cruza la partición a velocidad máxima y el contenido cambia
//                            detrás; la ranura de luz de la partición barre el lente al pasar.
//    F2 g764  OCLUSIÓN     — <SeamOcclude color={V.steel}> : la CHAPA del generador cruza y tapa.
//                            (color = la MATERIA que cruza, jamás el fondo)
//    F3 g1200 MATCH-SHAPE  — la MISMA <MediaCard> del panel cambia w/h/x/y/ry y se vuelve el cuadro
//                            de la cuenta. Sin corte, sin oclusión, sin fade.
// ──────────────────────────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  V, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

// ── helpers de curva (todo función pura del frame global) ────────────────────────────────────
type EK = "io" | "i" | "o" | "l";
const ez = (t: number, k: EK) =>
  interpolate(clamp01(t), [0, 1], [0, 1], {
    easing:
      k === "io" ? Easing.inOut(Easing.cubic)
        : k === "i" ? Easing.in(Easing.cubic)
          : k === "o" ? Easing.out(Easing.cubic)
            : Easing.linear,
  });
/** keyframes continuos: el valor del punto i es el arranque del tramo i→i+1. Nunca salta. */
const kf = (g: number, pts: [number, number, EK?][]) => {
  if (g <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i][0], va = pts[i][1], b = pts[i + 1][0], vb = pts[i + 1][1];
    if (g <= b) return lerp(va, vb, ez((g - a) / Math.max(1, b - a), pts[i][2] || "o"));
  }
  return pts[pts.length - 1][1];
};
const pico = (g: number, k: number, w: number) => Math.max(0, 1 - Math.abs(g - k) / w);

// ── un "escenario" del mundo: los tres se acuestan uno al lado del otro sobre el eje X ────────
const Stage: React.FC<{ x: number; on: boolean; children: React.ReactNode }> = ({ x, on, children }) =>
  on ? (
    <AbsoluteFill style={{ transform: `translateX(${x}px)`, transformStyle: "preserve-3d" }}>
      {children}
    </AbsoluteFill>
  ) : null;

// ── titular: entra y sale por BARRIDO (clip-path), nunca por opacidad ────────────────────────
const Titular: React.FC<{ g: number; inAt: number; outAt: number; w: number; children: React.ReactNode }> = ({
  g, inAt, outAt, w, children,
}) => {
  const pin = ez(clamp01((g - inAt) / 20), "o");
  const pout = ez(clamp01((g - outAt) / 16), "i");
  if (g < inAt || pout >= 1) return null;
  return (
    <div style={{
      position: "absolute", left: "5.5%", bottom: "9%", width: w,
      clipPath: `inset(0px ${((1 - pin) * 100).toFixed(1)}% 0px ${(pout * 100).toFixed(1)}%)`,
      transform: `translateY(${((1 - pin) * 24).toFixed(1)}px)`,
    }}>
      <Bed w={w} pad={26}>{children}</Bed>
    </div>
  );
};

// ── las cinco líneas de la cuenta (cada una con MATERIAL REAL en su cabecera) ────────────────
const FILAS: { n: string; v: string; ic: string; cap: string; at: number; y: number }[] = [
  { n: "REFRIGERADOR", v: "1,3", ic: "img/cmegenerador/cmeg_ic_termometro.png", cap: "img/cmegenerador/cmeg_mv_dosp3.png", at: 1296, y: 47.2 },
  { n: "CONGELADOR", v: "0,9", ic: "img/cmegenerador/cmeg_ic_congelador.png", cap: "img/cmegenerador/cmeg_mv_dosp1.png", at: 1324, y: 54.0 },
  { n: "INTERNET", v: "0,4", ic: "img/cmegenerador/cmeg_ic_nube.png", cap: "img/cmegenerador/cmeg_mv_dosp4.png", at: 1352, y: 60.8 },
  { n: "LUCES", v: "0,3", ic: "img/cmegenerador/cmeg_ic_foco.png", cap: "img/cmegenerador/cmeg_mv_dosp2.png", at: 1380, y: 67.6 },
  { n: "TELÉFONOS", v: "0,2", ic: "img/cmegenerador/cmeg_ic_telefono.png", cap: "img/cmegenerador/cmeg_mv_dosp3.png", at: 1408, y: 74.4 },
];

export const MovDosPreguntas: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const local = useCurrentFrame();
  const g = Math.max(0, Math.min(1500, gFrame));
  // los Seam*/Readout del Stage leen useCurrentFrame(): traduzco frame GLOBAL → frame LOCAL del montaje
  const off = gFrame - local;
  const L = (gf: number) => gf - off;

  // `acto` (el que el build está montando) sólo agrega un empujón de key al acto activo: nunca
  // decide qué se dibuja — todo el movimiento se dibuja en función de gFrame.
  const actoN = Math.min(4, Math.max(1, Math.round(acto || 1)));
  const actoG = g < 360 ? 1 : g < 780 ? 2 : g < 1200 ? 3 : 4;
  const keyBoost = 1 + 0.06 * Math.max(0, 1 - Math.abs(actoN - actoG));

  // ── LA CÁMARA: UNA sola, función de gFrame, jamás vuelve a 0 ───────────────────────────────
  const cam = gcam(g, { z0: -70, z1: 120, dur: 1470 });
  const worldX = kf(g, [
    [0, 0, "o"], [300, 70, "io"], [430, 1990, "o"], [748, 2070, "i"],
    [764, 2110, "io"], [778, 3770, "o"], [880, 3880, "o"], [1200, 3910, "o"], [1500, 3964],
  ]);
  const camY = kf(g, [[0, 0, "o"], [300, -18, "io"], [430, 12, "o"], [780, 10, "o"], [1200, -26, "o"], [1500, -42]]);
  const camRy = kf(g, [[0, 3, "o"], [300, 3, "io"], [430, -2.4, "o"], [780, -2, "o"], [1200, 1, "o"], [1500, 2]]);
  const camT =
    `${cam.transform} translate3d(${(-worldX).toFixed(1)}px, ${camY.toFixed(1)}px, 0) rotateY(${camRy.toFixed(2)}deg)`;

  // ── LA LUZ: evoluciona volt → torch → ámbar bajo. La atmósfera se monta UNA vez. ───────────
  const tintA = g < 980
    ? light(clamp01((g - 330) / 560), "volt", "torch")
    : light(clamp01((g - 980) / 300), "torch", "amber");
  const keyFrom = kf(g, [[0, 0.30, "o"], [300, 0.34, "io"], [430, 0.22, "o"], [780, 0.55, "o"], [1200, 0.72, "o"], [1500, 0.82]]);
  const inten = kf(g, [
    [0, 1.0, "o"], [500, 1.0, "i"], [531, 0.52, "o"], [566, 0.66, "o"], [620, 0.94, "o"],
    [780, 0.82, "o"], [1200, 0.70, "o"], [1440, 0.60, "o"], [1500, 0.56],
  ]) * keyBoost;
  const floor = kf(g, [[0, 0.70, "o"], [780, 0.66, "o"], [1500, 0.58]]);
  const intro = clamp01(g / 12);   // rampa de entrada ≤ 15 frames (nunca 2 s subiendo de negro)

  // ── ACTO 1 · la partición ───────────────────────────────────────────────────────────────────
  const stripX = kf(g, [[0, 0, "o"], [46, 0, "io"], [130, 420]]);
  const stripW = kf(g, [[0, 1240, "o"], [46, 1240, "io"], [130, 430]]);
  const stripY = kf(g, [[0, 50, "o"], [46, 50, "io"], [130, 60.6]]);
  const stripH = kf(g, [[0, 46, "o"], [46, 46, "io"], [130, 62]]);
  const stripOn = kf(g, [[0, 1, "o"], [300, 1, "o"], [424, 0.12]]);
  const rev = ez(clamp01((g - 46) / 88), "o");
  const apex = 268 - 34 * (pico(g, 232, 11) + pico(g, 300, 11)) - 5 * Math.sin(g / 23);
  const peakD = `M 150 690 L 400 688 L 478 686 L 512 ${apex.toFixed(0)} L 548 686 L 640 689 L 900 690`;
  const cardLY = kf(g, [[92, 62, "o"], [150, 41.5]]);
  const cardLO = kf(g, [[92, 0, "o"], [112, 1]]);
  const cardRY = kf(g, [[118, 62, "o"], [176, 41.5]]);
  const cardRO = kf(g, [[118, 0, "o"], [138, 1]]);
  const seamOn = kf(g, [[24, 0, "o"], [70, 1, "o"], [312, 1, "i"], [368, 0]]);
  const medidasOn = kf(g, [[178, 0, "o"], [222, 1, "i"], [316, 0]]);

  // ── ACTO 2 · el generador que no da ─────────────────────────────────────────────────────────
  const heroW = kf(g, [[300, 1120, "o"], [548, 1120, "io"], [612, 1330, "o"], [780, 1330]]);
  const heroLit = kf(g, [[300, 0.95, "i"], [518, 1.0, "i"], [531, 0.09, "o"], [560, 0.15, "o"], [614, 0.74, "o"], [780, 0.80]]);
  const tripA = kf(g, [[512, 0, "i"], [531, 0.74, "o"], [566, 0.5, "o"], [618, 0.1, "o"], [664, 0]]);
  const needleA = kf(g, [
    [300, 201, "o"], [382, 205, "io"], [518, 341, "o"], [530, 343, "i"], [535, 199, "o"], [566, 197, "o"], [780, 197],
  ]) + (g > 494 && g < 532 ? Math.sin(g * 1.9) * 2.3 : 0);
  const gaugeOn = kf(g, [[352, 0, "o"], [392, 1, "i"], [700, 1, "i"], [762, 0]]);
  const alarmA = kf(g, [[452, 0, "o"], [500, 1, "o"], [530, 1, "i"], [540, 0]]);
  const stX = kf(g, [[608, 104, "o"], [676, 86, "o"], [780, 82]]);
  const stO = kf(g, [[608, 0, "o"], [636, 1]]);

  // ── ACTO 3 · la estación que se lo come ─────────────────────────────────────────────────────
  const a3W = kf(g, [[786, 980, "o"], [1196, 980, "io"], [1276, 800, "o"], [1452, 800, "io"], [1500, 900]]);
  const a3X = kf(g, [[786, 36, "o"], [1196, 36, "io"], [1276, 50]]);
  const a3Y = kf(g, [[786, 53, "o"], [812, 46, "o"], [1196, 46, "io"], [1276, 57, "o"], [1452, 57, "io"], [1500, 52]]);
  const a3Z = kf(g, [[786, -10, "o"], [1196, -10, "io"], [1276, -250, "o"], [1452, -250, "io"], [1500, -140]]);
  const a3Lit = kf(g, [[786, 0.90, "o"], [1196, 0.90, "io"], [1300, 0.34, "o"], [1452, 0.30, "io"], [1500, 0.44]]);
  const a3Op = kf(g, [[780, 0, "o"], [806, 1, "o"], [1196, 1, "io"], [1300, 0.58, "o"], [1452, 0.58, "io"], [1500, 0.94]]);
  const a3LitC = light(clamp01((g - 1180) / 170), "torch", "amber");
  const barGrow = ez(clamp01((g - 906) / 74), "o");
  const barDouble = ez(clamp01((g - 1002) / 76), "o");
  const mark850 = ez(clamp01((g - 1046) / 60), "o");
  const dutyOn = kf(g, [[1062, 0, "o"], [1104, 1, "i"], [1188, 0]]);
  const a3Fade = kf(g, [[1180, 1, "i"], [1244, 0]]);   // la capa GRÁFICA del acto 3 se retira, el material NO

  // ── ACTO 4 · el match-shape y la cuenta ─────────────────────────────────────────────────────
  const mOn = g > 846;
  const mOp = kf(g, [[856, 0, "o"], [884, 1, "o"], [1440, 1, "io"], [1496, 0.16]]);
  const mW = kf(g, [[780, 470, "o"], [1196, 470, "io"], [1268, 1160]]);
  const mX = kf(g, [[780, 76, "o"], [1196, 76, "io"], [1268, 50]]);
  const mY = kf(g, [[856, 35, "o"], [900, 28, "o"], [1196, 28, "io"], [1268, 21]]);
  const mRy = kf(g, [[780, -12, "o"], [1196, -12, "io"], [1268, 0]]);
  const notaOp = kf(g, [[1236, 0, "o"], [1276, 1, "io"], [1444, 1, "io"], [1500, 0.30]]);
  const filasOp = kf(g, [[1444, 1, "io"], [1500, 0.34]]);
  const totX = kf(g, [[1330, 50, "o"], [1448, 50, "io"], [1478, 50]]);
  const totY = kf(g, [[1330, 21, "o"], [1448, 21, "io"], [1478, 49]]);
  const totS = kf(g, [[1330, 128, "o"], [1448, 128, "io"], [1478, 196]]);
  const totOp = kf(g, [[1468, 1, "i"], [1486, 0]]);
  const totC = light(clamp01((g - 1300) / 180), "volt", "amber");
  const subrayado = ez(clamp01((g - 1484) / 26), "o");

  // ── LA BRASA ÁMBAR: capa de PANTALLA, continua — es la materia que sobrevive a la frontera 2 ─
  const emX = kf(g, [[0, 88, "o"], [520, 88, "o"], [566, 84, "o"], [764, 80, "o"], [900, 64, "o"], [1500, 58]]);
  const emY = kf(g, [[0, 96, "o"], [566, 90, "o"], [764, 86, "o"], [900, 72, "o"], [1500, 66]]);
  const emA = kf(g, [[0, 0.10, "i"], [500, 0.10, "i"], [532, 0.32, "o"], [606, 0.18, "o"], [790, 0.24, "o"], [1120, 0.17, "o"], [1500, 0.14]]);
  const emR = kf(g, [[0, 40, "o"], [532, 26, "o"], [606, 34, "o"], [900, 52, "o"], [1500, 62]]);

  // ── EL BARRIDO DE LENTE del cruce (F1: MATCH-MOVE, no es un fade) ───────────────────────────
  const cruceT = clamp01((g - 336) / 56);
  const cruceA = Math.sin(cruceT * Math.PI);
  const cruceX = lerp(114, -16, cruceT);

  return (
    <AbsoluteFill style={{ opacity: intro, backgroundColor: V.ink0 }}>
      {/* LA ATMÓSFERA — se monta UNA sola vez para los 4 actos; sólo evolucionan sus valores */}
      <VoltAtmos tint={tintA} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floor} />

      <Layers cam={camT}>
        {/* ══════════ ACTO 1 · worldX 0 · LA PARTICIÓN ══════════ */}
        <Stage x={0} on={g < 452}>
          <Plane z={-380}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_dosp1.png" kind="photo" z={0} scale={1.26} dim={0.76} tint={V.volt} />
          </Plane>
          <Plane z={-262}>
            <AbsoluteFill style={{
              opacity: 0.22,
              backgroundImage:
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.10)} 0 1px, rgba(0,0,0,0) 1px 74px),` +
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.08)} 0 1px, rgba(0,0,0,0) 1px 74px)`,
            }} />
          </Plane>
          {/* la TIRA heredada de MovCiclo: se angosta, viaja a la derecha y SE VUELVE LA MESETA */}
          <Plane z={-148}>
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, transform: `translateX(${stripX.toFixed(1)}px)` }}>
              <DutyField duty={8 / 30} cells={30} on={stripOn} tint={V.volt} y={stripY} w={stripW} h={stripH} cycle={150} />
            </div>
          </Plane>
          {/* el PICO: estructura vectorial que crece detrás de la tarjeta (no reemplaza material) */}
          <Plane z={-62}>
            <svg viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
              <path d="M 120 690 L 1820 690" stroke={rgba(V.white, 0.22)} strokeWidth={2} fill="none" />
              <path d={`${peakD} L 900 704 L 150 704 Z`} fill={rgba(V.volt, 0.16 * rev)} stroke="none" />
              <path d={peakD} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - rev}
                stroke={V.volt} strokeWidth={5} fill="none" strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 16px ${rgba(V.volt, 0.7)})` }} />
            </svg>
          </Plane>
          {/* LA RANURA DE LUZ que parte el cuadro (y que barre el lente cuando la cámara la cruza) */}
          <Plane z={18}>
            <div style={{
              position: "absolute", left: "50%", top: "-12%", width: 3, height: "124%", marginLeft: -1.5,
              transform: "rotate(1.7deg)", opacity: seamOn,
              background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.volt, 0.9)} 20%, ${rgba(V.volt, 0.9)} 80%, rgba(0,0,0,0) 100%)`,
              boxShadow: `0 0 38px ${rgba(V.volt, 0.55)}`,
            }} />
            {Array.from({ length: 16 }, (_, i) => {
              const sp = 0.5 + rnd(i * 4.1) * 1.4;
              const yy = (rnd(i * 2.3) * 118 - (g * sp) / 13) % 118;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${(49.2 + rnd(i * 7.9) * 1.7).toFixed(2)}%`,
                  top: `${((yy + 118) % 118 - 9).toFixed(2)}%`,
                  width: 3 + rnd(i * 5.5) * 3, height: 3 + rnd(i * 5.5) * 3, borderRadius: "50%",
                  background: rgba(V.volt, (0.18 + rnd(i * 3.7) * 0.3) * seamOn),
                }} />
              );
            })}
          </Plane>
          {/* MATERIAL REAL a cada lado: el tablero del generador (vivo) vs el panel de la estación */}
          <Plane z={72}>
            <MediaCard src="broll/cmegenerador/cmeg_mv_dosp2.mp4" kind="video"
              w={520} h={318} x={27} y={cardLY} z={0} ry={13} rot={-1.2}
              lit={0.96} litColor={V.volt} sheenAt={L(140)} opacity={cardLO} label="EL PICO" />
            <MediaCard src="img/cmegenerador/cmeg_mv_dosp1.png" kind="photo"
              w={520} h={318} x={73} y={cardRY} z={-26} ry={-13} rot={1} radius={14}
              lit={0.80} litColor={V.amber} sheenAt={L(172)} opacity={cardRO} label="EL PROMEDIO" />
          </Plane>
          {/* las dos MEDIDAS: lo que dura cada cosa (estructura, no objeto) */}
          <Plane z={96}>
            <div style={{ opacity: medidasOn }}>
              <svg viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
                <path d="M 494 716 L 494 736 L 530 736 L 530 716" stroke={rgba(V.volt, 0.85)} strokeWidth={3} fill="none" />
                <path d="M 1165 716 L 1165 736 L 1595 736 L 1595 716" stroke={rgba(V.amber, 0.85)} strokeWidth={3} fill="none" />
              </svg>
              <div style={{ position: "absolute", left: "26.7%", top: "70.5%", transform: "translateX(-50%)" }}>
                <Body size={30} color={V.volt}>UN SEGUNDO</Body>
              </div>
              <div style={{ position: "absolute", left: "71.9%", top: "70.5%", transform: "translateX(-50%)" }}>
                <Body size={30} color={V.amber}>TODO EL DÍA</Body>
              </div>
            </div>
          </Plane>
          <Plane z={186}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 11.3) * 100).toFixed(2)}%`,
                top: `${(((rnd(i * 6.1) * 120 - (g * (0.4 + rnd(i) * 0.7)) / 22) % 120) + 120) % 120 - 10}%`,
                width: 10 + rnd(i * 2.9) * 14, height: 10 + rnd(i * 2.9) * 14, borderRadius: "50%",
                background: `radial-gradient(circle, ${rgba(V.white, 0.14)}, rgba(0,0,0,0) 70%)`,
              }} />
            ))}
          </Plane>
        </Stage>

        {/* ══════════ ACTO 2 · worldX 1920 · EL GENERADOR QUE NO DA ══════════ */}
        <Stage x={1920} on={g > 296 && g < 806}>
          <Plane z={-330}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_dosp2.png" kind="photo" z={0} scale={1.32} dim={0.80} tint={V.volt} />
          </Plane>
          <Plane z={-186}>
            <PadPlane y={80} w={1540} h={330} rx={64} lit={0.60} z={0} />
          </Plane>
          <Plane z={0}>
            <MediaCard src="broll/cmegenerador/cmeg_mv_dosp2.mp4" kind="video"
              w={heroW} h={heroW * 0.556} x={50} y={44} z={0} ry={-3}
              lit={heroLit} litColor={V.volt} sheenAt={L(394)} />
          </Plane>
          {/* EL INSTRUMENTO: la aguja que se pega al tope y muere (estructura sobre material real) */}
          <Plane z={116}>
            <div style={{ opacity: gaugeOn }}>
              <svg viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
                <path d="M 1256 286 A 170 170 0 0 1 1584 286" stroke={rgba(V.white, 0.30)} strokeWidth={12} fill="none" strokeLinecap="round" />
                <path d="M 1546 199 A 170 170 0 0 1 1584 286" stroke={rgba(V.amber, 0.92)} strokeWidth={13} fill="none" strokeLinecap="round" />
                {Array.from({ length: 11 }, (_, i) => {
                  const a = ((195 + (i * 150) / 10) * Math.PI) / 180;
                  return (
                    <path key={i}
                      d={`M ${(1420 + Math.cos(a) * 148).toFixed(1)} ${(330 + Math.sin(a) * 148).toFixed(1)} L ${(1420 + Math.cos(a) * 128).toFixed(1)} ${(330 + Math.sin(a) * 128).toFixed(1)}`}
                      stroke={rgba(V.white, 0.45)} strokeWidth={3} />
                  );
                })}
                <path
                  d={`M 1420 330 L ${(1420 + Math.cos((needleA * Math.PI) / 180) * 140).toFixed(1)} ${(330 + Math.sin((needleA * Math.PI) / 180) * 140).toFixed(1)}`}
                  stroke={needleA > 320 ? V.amber : V.volt} strokeWidth={7} strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 14px ${rgba(needleA > 320 ? V.amber : V.volt, 0.85)})` }} />
                <circle cx={1420} cy={330} r={14} fill={V.ink1} stroke={rgba(V.white, 0.5)} strokeWidth={3} />
              </svg>
            </div>
          </Plane>
          <Plane z={140}>
            <IconPng src="img/cmegenerador/cmeg_ic_rayo.png" x={24} y={64} size={104} z={0} opacity={alarmA * 0.95} glow={V.volt} />
            <IconPng src="img/cmegenerador/cmeg_ic_breaker.png" x={80} y={70} size={112} z={0}
              opacity={kf(g, [[524, 0, "o"], [546, 1, "i"], [700, 1, "i"], [758, 0]])} glow={V.amber} />
            {/* la batería asoma por la derecha: la CAJA NEGRA que cruza la frontera 2 */}
            <MediaCard src="img/cmegenerador/cmeg_mv_dosp3.png" kind="photo"
              w={300} h={190} x={stX} y={70} z={40} ry={-16} rot={1.6}
              lit={0.72} litColor={V.torch} opacity={stO} sheenAt={L(650)} label="LA BATERÍA NO" />
          </Plane>
          <Plane z={196}>
            <AbsoluteFill style={{ background: rgba(V.ink0, tripA) }} />
          </Plane>
          <Plane z={210}>
            <div style={{ opacity: kf(g, [[534, 1, "i"], [706, 1, "i"], [756, 0]]) }}>
              <Readout value="0" unit="W" label="EL GENERADOR" at={L(536)} x={30} y={22} size={112} color={V.white} />
            </div>
          </Plane>
        </Stage>

        {/* ══════════ ACTOS 3 y 4 · worldX 3840 · LA ESTACIÓN Y LA CUENTA ══════════ */}
        <Stage x={3840} on={g > 748}>
          <Plane z={-380}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_dosp3.png" kind="photo" z={0} scale={1.30}
              dim={kf(g, [[780, 0.70, "o"], [1200, 0.72, "o"], [1500, 0.84]])} tint={V.torch} />
          </Plane>
          <Plane z={-198}>
            <PadPlane y={83} w={1580} h={320} rx={65} lit={kf(g, [[780, 0.44, "o"], [1500, 0.26]])} z={0} />
          </Plane>
          {/* EL HÉROE del acto 3 y la MATERIA FINAL del movimiento: la caja negra de la estación */}
          {g > 770 && (
            <Plane z={0}>
              <MediaCard src="broll/cmegenerador/cmeg_mv_dosp3.mp4" kind="video"
                w={a3W} h={a3W * 0.563} x={a3X} y={a3Y} z={a3Z} ry={4}
                lit={a3Lit} litColor={a3LitC} opacity={a3Op} sheenAt={L(814)} />
            </Plane>
          )}
          {/* LA BARRA DE MARGEN: 600 continuos · el doble de pico · el arranque de 850 por debajo */}
          <Plane z={64}>
            <div style={{ opacity: a3Fade }}>
              <svg viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
                <path d="M 1200 896 L 1660 896" stroke={rgba(V.white, 0.28)} strokeWidth={3} fill="none" />
                <rect x={1270} y={896 - 170 * barGrow} width={110} height={170 * barGrow} rx={4}
                  fill={rgba(V.torch, 0.34)} stroke={rgba(V.torch, 0.9)} strokeWidth={2} />
                <rect x={1460} y={896 - 340 * barDouble} width={110} height={340 * barDouble} rx={4}
                  fill={rgba(V.volt, 0.26)} stroke={rgba(V.volt, 0.9)} strokeWidth={2} />
                <path d={`M 1210 655 L ${(1210 + 430 * mark850).toFixed(0)} 655`}
                  stroke={V.amber} strokeWidth={4} strokeDasharray="14 10" fill="none"
                  style={{ filter: `drop-shadow(0 0 12px ${rgba(V.amber, 0.6)})` }} />
              </svg>
              <Readout value="600" unit="W" label="CONTINUOS" at={L(912)} x={68.5} y={63} size={54} color={V.torch} />
              <Readout value="1.200" unit="W" label="PICO" at={L(1008)} x={79} y={47.5} size={54} color={V.volt} />
              <div style={{ position: "absolute", left: "74%", top: "56.5%", transform: "translateX(-50%)", opacity: mark850 }}>
                <Body size={30} color={V.amber}>850 W DE ARRANQUE</Body>
              </div>
            </div>
          </Plane>
          {/* el CICLO DE TRABAJO vuelve un segundo: "mientras el promedio sea bajo" */}
          <Plane z={44}>
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, transform: "translateX(430px)", opacity: dutyOn }}>
              <DutyField duty={8 / 30} cells={30} on={1} tint={V.torch} y={90} w={560} h={26} cycle={150} />
              <div style={{ position: "absolute", left: "72.4%", top: "84.5%", transform: "translateX(-50%)" }}>
                <Kick color={V.torch}>EL PROMEDIO SIGUE BAJO</Kick>
              </div>
            </div>
          </Plane>
          {/* ⭐ F3 · MATCH-SHAPE: ESTA MISMA tarjeta es la pantalla de la estación Y el cuadro de la cuenta */}
          {mOn && (
            <Plane z={124}>
              <MediaCard src="broll/cmegenerador/cmeg_mv_dosp1.mp4" kind="video"
                w={mW} h={mW * (g < 1196 ? 0.638 : lerp(0.638, 0.2276, ez((g - 1196) / 72, "io")))}
                x={mX} y={mY} z={0} ry={mRy}
                lit={0.95} litColor={g < 1220 ? V.torch : V.amber} opacity={mOp} sheenAt={L(1216)} />
            </Plane>
          )}
          {/* LA CUENTA: cinco líneas sobre el BLOC REAL, cada una con su cabecera de material real */}
          {g > 1230 && (
            <Plane z={148}>
              <MediaCard src="img/cmegenerador/cmeg_mv_dosp4.png" kind="photo"
                w={1160} h={430} x={50} y={62} z={0} ry={0}
                lit={0.58} litColor={V.amber} opacity={notaOp} sheenAt={L(1284)} />
              <div style={{ opacity: filasOp }}>
                {FILAS.map((f, i) => {
                  const p = ez(clamp01((g - f.at) / 22), "o");
                  if (p <= 0) return null;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                      clipPath: `inset(0px ${((1 - p) * 100).toFixed(1)}% 0px 0px)`,
                      transform: `translateX(${((1 - p) * -34).toFixed(1)}px)`,
                    }}>
                      <MediaCard src={f.cap} kind="photo" w={132} h={80} x={26.8} y={f.y} z={10}
                        ry={0} radius={8} lit={0.74} litColor={V.amber} />
                      <IconPng src={f.ic} x={26.8} y={f.y - 2.4} size={48} z={26} opacity={0.96} glow={V.ink0} />
                      <div style={{ position: "absolute", left: "32.6%", top: `${f.y}%`, transform: "translateY(-50%)" }}>
                        <Body size={34} color={V.bone}>{f.n}</Body>
                      </div>
                      <div style={{ position: "absolute", right: "24.5%", top: `${f.y}%`, transform: "translateY(-50%)" }}>
                        <Num size={46} color={i === 0 ? V.amber : V.volt}>{f.v}</Num>
                      </div>
                    </div>
                  );
                })}
                {/* el subrayado arranca en la primera línea cuando Claudio empieza a enumerarlas */}
                <div style={{
                  position: "absolute", left: "23%", top: `${FILAS[0].y + 2.6}%`,
                  width: `${(53 * subrayado).toFixed(1)}%`, height: 4, borderRadius: 2,
                  background: rgba(V.amber, 0.9), boxShadow: `0 0 18px ${rgba(V.amber, 0.7)}`,
                }} />
              </div>
            </Plane>
          )}
          {/* EL TOTAL — nace sobre la pantalla de la estación y termina SOLO, ámbar bajo */}
          <Plane z={190}>
            <div style={{ opacity: totOp }}>
              <Readout value="3,0" unit="kWh" label="LA CASA DE ERNESTO PIDE" at={L(1330)}
                x={totX} y={totY} size={totS} color={totC} />
            </div>
            {g >= 1470 && (
              <Readout value="3" at={L(1472)} x={50} y={49} size={300} color={V.amber} />
            )}
          </Plane>
        </Stage>
      </Layers>

      {/* LA BRASA ÁMBAR — capa de pantalla continua: la casa que se apaga → la cocina de noche */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        background: `radial-gradient(${emR.toFixed(1)}% ${(emR * 0.8).toFixed(1)}% at ${emX.toFixed(1)}% ${emY.toFixed(1)}%, ${rgba(V.amber, emA)} 0%, rgba(0,0,0,0) 64%)`,
      }} />

      {/* F1 · MATCH-MOVE: la ranura de luz de la partición BARRE EL LENTE mientras la cámara cruza */}
      {cruceT > 0 && cruceT < 1 && (
        <AbsoluteFill style={{
          pointerEvents: "none", mixBlendMode: "screen",
          background: `linear-gradient(97deg, rgba(0,0,0,0) ${(cruceX - 15).toFixed(1)}%, ${rgba(V.volt, 0.36 * cruceA)} ${cruceX.toFixed(1)}%, rgba(0,0,0,0) ${(cruceX + 17).toFixed(1)}%)`,
        }} />
      )}

      {/* F2 · OCLUSIÓN con la CHAPA del generador (color = la materia que cruza, NUNCA el fondo) */}
      <SeamOcclude at={L(764)} dur={20} color={V.steel} angle={9} />

      {/* TITULARES — una idea de texto por acto, entran y salen por barrido */}
      <Titular g={g} inAt={196} outAt={296} w={880}>
        <Kick>EL PICO Y EL PROMEDIO</Kick>
        <div style={{ height: 10 }} />
        <Head size={74}>DOS PREGUNTAS <Em>DISTINTAS</Em></Head>
      </Titular>

      <Titular g={g} inAt={404} outAt={704} w={820}>
        <Kick>EL PEOR INSTANTE</Kick>
        <div style={{ height: 10 }} />
        <Head size={74}>SI NO DA, <Em color={V.amber}>SE APAGA</Em></Head>
        {g > 552 && (
          <div style={{
            marginTop: 14,
            clipPath: `inset(0px ${((1 - ez(clamp01((g - 552) / 22), "o")) * 100).toFixed(1)}% 0px 0px)`,
          }}>
            <Body size={32}>Por eso te lo venden grande.</Body>
          </div>
        )}
      </Titular>

      <Titular g={g} inAt={806} outAt={1082} w={980}>
        <Kick color={V.torch}>LA ESTACIÓN DE ENERGÍA</Kick>
        <div style={{ height: 10 }} />
        <Head size={74}>SE LO COME <Em>SIN DESPEINARSE</Em></Head>
      </Titular>

      <Titular g={g} inAt={1246} outAt={1438} w={840}>
        <Kick color={V.amber}>UN APAGÓN REAL</Kick>
        <div style={{ height: 10 }} />
        <Head size={74}>TRES <Em color={V.amber}>KILOVATIOS HORA</Em></Head>
      </Titular>

      {/* viñeta: la misma piel de imagen en los cuatro actos */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(128% 96% at 50% 46%, rgba(0,0,0,0) 46%, ${rgba(V.ink0, 0.72)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
