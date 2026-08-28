// MovFaltan.tsx — S5 · UN MOVIMIENTO CONTINUO de 52 s (1560 frames @30fps) · arranca en 540.0 s
// ─────────────────────────────────────────────────────────────────────────────────────────────
// LA ESPINA: lo que NO entra en una batería — el aire, la secadora, la hornilla, el calentador.
// El tono NO es de derrota: es el tipo que te dice la verdad de frente. Y el último acto gira
// hacia la bomba de pozo, que SÍ se resuelve: ahí la luz baja y se pone cálida.
//
// ═════════════════════════ TABLA DE HANDOFF (el acto N+1 arranca EXACTAMENTE en el exitTo del N)
//
// ACTO 1 · f0 → f360 · "CINCO MIL VATIOS"
//   enterFrom  cám: z −150, alta, empujando hacia adelante-izquierda (hereda el vector de MovSuma)
//              luz: FRÍA DURA DESDE ARRIBA (sky→volt, keyFrom .15, floor .66) — la máquina apagada
//              materia: la CHAPA DE ACERO del generador terminando su barrido (SeamOcclude V.steel
//                       arrancado en MovSuma, at −14: en mi f0 va por la mitad y despeja en f14)
//   exitTo     cám: z +148 lanzada a la izquierda, METIDA dentro del anillo
//              luz: todavía fría, key corrida a .20
//              materia: el RAIL DE ACERO del carrusel (la chapa se volvió rail) + la tarjeta del aire
//
// ACTO 2 · f360 → f720 · "DOCE MIL EN UN INSTANTE"
//   enterFrom  cám: z +148 lateral izquierda, en pleno vector           ← == exitTo de 1
//              luz: fría, key .20                                        ← == exitTo de 1
//              materia: rail de acero + tarjeta del aire                 ← == exitTo de 1
//   exitTo     cám: z +40 retrocediendo hacia la derecha, rotateX +1.1°
//              luz: empieza a entibiar (warm .05), key .34
//              materia: el rail se cerró sobre la reja del ventilador, acelera y se desdibuja;
//                       de ahí sale el ASPA BLANCA (V.blade) que cruza el cuadro
//
// ACTO 3 · f720 → f1140 · "AGUA TIBIA DOCE HORAS"
//   enterFrom  cám: z +40 a la derecha, rotateX +1.1°                    ← == exitTo de 2
//              luz: tibia naciente, key .34                              ← == exitTo de 2
//              materia: el aspa blanca → se vuelve la TIRA BLANCA del termómetro pegada al tanque
//   exitTo     cám: z +150 craneando hacia abajo, rotateX +2.0°
//              luz: ÁMBAR (warm .60), key .62, floor .50 — la buena noticia ya entibió el cuadro
//              materia: el TANQUE estrechándose hasta ser el TUBO del pozo
//
// ACTO 4 · f1140 → f1560 · "ESA SÍ HAY QUE RESOLVERLA"
//   enterFrom  cám: z +150 bajando, rotateX +2.0°                        ← == exitTo de 3
//              luz: ámbar, key .62                                       ← == exitTo de 3
//              materia: el tubo del pozo (ex tanque)                     ← == exitTo de 3
//   exitTo     cám: BAJA Y CERCA (z +8, rotateX +4.6°, mirando desde abajo), la bomba sola
//              luz: CÁLIDA BAJA (amber/torch, key .84, floor .40, lavado ámbar desde abajo)
//              materia: el AGUA de la bomba (gotas + charco tibio) → se la entrega a MovCiclo,
//                       que la evapora y deja el negro del laboratorio
//
// ═════════════════════════ COSTURAS (una distinta por frontera · ninguna es un fade)
//   entrada  f−14  OCLUSIÓN heredada  · V.steel  (la chapa de MovSuma termina de cruzar)
//   1 → 2    f344  MATCH-MOVE         · la cámara sigue su vector a la izquierda y ENTRA en el
//                                       anillo; la tarjeta del aire crece desde su posición EXACTA
//                                       en el carrusel (misma x/y/z/ry/lit) hasta llenar el cuadro
//   2 → 3    f713  OCLUSIÓN           · V.blade — el aspa del ventilador tapa el 100% (f713→f723)
//   3 → 4    f1096 MATCH-SHAPE        · el tanque (600×790) se estrecha hasta ser el tubo (132×950)
//
// ═════════════════════════ ASSETS (SOLO los de la ficha, como literal string)
//   img/cmegenerador/cmeg_mv_falt1.png · broll/cmegenerador/cmeg_mv_falt1.mp4  (aire acondicionado)
//   img/cmegenerador/cmeg_mv_falt2.png · broll/cmegenerador/cmeg_mv_falt2.mp4  (secadora)
//   img/cmegenerador/cmeg_mv_falt3.png · broll/cmegenerador/cmeg_mv_falt3.mp4  (hornilla)
//   img/cmegenerador/cmeg_mv_falt4.png · broll/cmegenerador/cmeg_mv_falt4.mp4  (calentador+termómetro)
//   img/cmegenerador/cmeg_mv_falt5.png · broll/cmegenerador/cmeg_mv_falt5.mp4  (bomba de pozo)
//   img/cmegenerador/cmeg_ic_rayo.png · cmeg_ic_termometro.png · cmeg_ic_medidor.png
//
// NOTA TÉCNICA: los helpers del Stage (`Readout`, `SeamOcclude`, `MediaCard sheenAt`, `DutyField`)
// leen `useCurrentFrame()`, que NO es `gFrame`. Por eso todo `at`/`sheenAt` va con `+ OFF`.
// Ningún clip queda en pantalla más de 150 frames (los mp4 duran 5,1 s = 153): cada relevo cae
// dentro de un cambio de encuadre + barrido especular, nunca en un fundido.
// ─────────────────────────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, Carousel3D, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Bed,
} from "./VoltStage";

// ── helpers puros ────────────────────────────────────────────────────────────────────────────
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));
const ki = (f: number, xs: number[], ys: number[], ez: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(f, xs, ys, { easing: ez, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ease = (t: number) => interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.24, 0.62, 0.24, 1) });

// ── frames de los actos ──────────────────────────────────────────────────────────────────────
const A2 = 360, A3 = 720, A4 = 1140, END = 1560;
// geometría del anillo (acto 1)
const RAD = 640, CW = 470, CH = 282, RING_Y = 47;

const RING = [
  { src: "img/cmegenerador/cmeg_mv_falt1.png", kind: "photo" as const, label: "AIRE CENTRAL" },
  { src: "img/cmegenerador/cmeg_mv_falt2.png", kind: "photo" as const, label: "SECADORA" },
  { src: "img/cmegenerador/cmeg_mv_falt3.png", kind: "photo" as const, label: "HORNILLA" },
  { src: "img/cmegenerador/cmeg_mv_falt4.png", kind: "photo" as const, label: "CALENTADOR" },
];

// bloque de titular: kicker + titular sobre cama oscura (tipografía del canal, nada inventado)
const Titular: React.FC<{ a: number; kicker: string; text: string; top: string; color?: string }> = ({
  a, kicker, text, top, color = V.white,
}) => {
  if (a <= 0.002) return null;
  return (
    <div style={{
      position: "absolute", left: 96, top, width: 780,
      opacity: a, transform: `translateY(${((1 - a) * 26).toFixed(1)}px)`,
    }}>
      <Bed w={760} pad={28}>
        <div style={{ transform: "scale(1.18)", transformOrigin: "left center", marginBottom: 16 }}>
          <Kick>{kicker}</Kick>
        </div>
        <Head size={80} color={color}>{text}</Head>
      </Bed>
    </div>
  );
};

export const MovFaltan: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  // los helpers del Stage viven en el frame de la composición; `OFF` los traduce a MI gFrame.
  const OFF = useCurrentFrame() - gFrame;
  const f = Math.min(END + 40, Math.max(-40, gFrame));
  // `acto` (1..4) es sólo informativo: el build monta acto a acto, pero TODO el dibujo es función
  // de gFrame para que los 60 chunks paralelos del farm den exactamente el mismo pixel.

  // ══ LA CÁMARA — UNA sola, función de gFrame, jamás vuelve a 0 ══════════════════════════════
  const g = gcam(f, { z0: -150, z1: 70, panX: -64, panY: -26, ry: -5.2, rx: 1.3, dur: 1560 });
  const camZ = ki(f, [0, 250, 372, 470, 560, 720, 860, 1050, 1150, 1300, 1440, 1560],
    [-30, 10, 148, 108, 74, 40, 96, 132, 150, 108, 46, 8]);
  const camX = ki(f, [0, 250, 372, 520, 720, 900, 1050, 1150, 1330, 1560],
    [16, -18, -86, -52, -8, 22, 40, 54, 22, -14]);
  const camY = ki(f, [0, 360, 720, 900, 1060, 1140, 1330, 1470, 1560],
    [-6, -18, -30, -38, -46, -34, 18, 62, 84]);
  const camRoll = ki(f, [0, 372, 720, 1140, 1560], [0.4, -1.5, 0.3, 1.1, 2.0]);
  const camTilt = ki(f, [0, 720, 1140, 1400, 1560], [0, 1.1, 2.0, 3.4, 4.6]);
  const cam =
    `${g.transform} translate3d(${camX.toFixed(2)}px, ${camY.toFixed(2)}px, ${camZ.toFixed(2)}px) ` +
    `rotateX(${camTilt.toFixed(3)}deg) rotateZ(${camRoll.toFixed(3)}deg)`;

  // ══ LA LUZ — evoluciona, no salta: fría dura arriba → ámbar baja sobre la bomba ════════════
  const warm = ki(f, [0, 640, 840, 900, 1080, 1180, 1400, 1560],
    [0, 0.05, 0.14, 0.36, 0.46, 0.60, 0.90, 1], Easing.inOut(Easing.sin));
  const tintA = light(warm, "sky", "amber");
  const tintB = light(clamp01(warm * 1.2), "volt", "torch");
  const keyFrom = ki(f, [0, 360, 720, 1140, 1560], [0.15, 0.20, 0.34, 0.62, 0.84]);
  const atmInt = ki(f, [0, 300, 720, 1140, 1560], [1.05, 0.92, 0.86, 0.94, 1.0]);
  const atmFloor = ki(f, [0, 720, 1140, 1560], [0.66, 0.60, 0.50, 0.40]);
  const bajoCalido = ramp(f, 1120, 1520) * 0.55;

  // ══ ACTO 1 · el anillo de lo que NO entra ═════════════════════════════════════════════════
  // una vuelta entera (los cuatro aparatos) que frena con el CALENTADOR al frente y ahí se queda.
  const spin = interpolate(f, [8, 352, 520], [0, -1, -1.75], {
    easing: Easing.bezier(0.34, 0.03, 0.24, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ringPlaneZ = ki(f, [352, 500], [0, -520]);
  const verAnillo = f >= -2 && f < 716;

  // posición EXACTA de la tarjeta del aire dentro del carrusel (i = 0) en ESTE frame:
  // de acá arranca el héroe del acto 2 → el match es perfecto, no hay salto.
  const a0 = spin * 360;
  const r0 = (a0 * Math.PI) / 180;
  const acZ = Math.cos(r0) * RAD;
  const acPct = 50 + ((Math.sin(r0) * RAD) / 1920) * 100;
  const acDepth = (acZ + RAD) / (2 * RAD);

  // el RAIL DE ACERO: nace de la chapa que cruza en f0, es la órbita del carrusel y termina
  // cerrándose sobre la reja del ventilador del aire (y acelerando hasta desdibujarse).
  const railA = clamp01(Math.min(ramp(f, 6, 30), 1 - ramp(f, 684, 712)));
  const railTilt = ki(f, [0, 340, 440], [74, 74, 14]);
  const railW = ki(f, [0, 340, 440], [1500, 1500, 640]);
  const railY = ki(f, [0, 340, 440], [63, 63, 47]);
  const railZ = ki(f, [0, 340, 440], [-90, -90, 300]);
  const fanRev = interpolate(f, [430, 620, 713], [0, 0.5, 7.5], {
    easing: Easing.in(Easing.quad), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const railSpin = ki(f, [0, 430], [0, 34]) + fanRev * 360;
  const fanA = ramp(f, 600, 690) * 0.9 * (1 - ramp(f, 702, 714));

  // ══ ACTO 2 · el aire arrancando — 12.000 por un instante ═══════════════════════════════════
  const hE = ease((f - (A2 - 16)) / 76);
  const hwL = ki(f, [420, 486, 560, 640, 713], [1360, 1330, 1180, 1240, 1420]);
  const hhL = ki(f, [420, 486, 560, 640, 713], [766, 750, 700, 736, 800]);
  const hxL = ki(f, [420, 486, 560, 640, 713], [50, 50, 52, 51, 50]);
  const hyL = ki(f, [420, 486, 560, 640, 713], [48, 46, 44, 45, 46]);
  const hzL = ki(f, [420, 486, 560, 640, 713], [150, 150, 130, 140, 190]);
  const hrL = ki(f, [420, 486, 560, 640, 713], [0, 0, -4, -2, 0]);
  const heroW = lerp(CW, hwL, hE), heroH = lerp(CH, hhL, hE);
  const heroX = lerp(acPct, hxL, hE), heroY = lerp(RING_Y, hyL, hE);
  const heroZ = lerp(acZ + ringPlaneZ, hzL, hE), heroRy = lerp(-a0, hrL, hE);
  const heroLit = lerp(0.35 + 0.65 * acDepth, 1, hE);
  const verHeroe = f >= A2 - 16 && f < A3 - 4;
  const heroVideo = f < 486 || f >= 640;         // relevo de material: clip → foto → clip
  const heroSheen = f < 560 ? 486 : 640;

  // satélites: los dos aparatos que SE POSPONEN (entran por abajo, sobre la losa)
  const s2In = ease(ramp(f, 412, 430)), s2Out = ramp(f, 548, 562);
  const s2A = clamp01(Math.min(s2In, 1 - s2Out));
  const s2Y = lerp(97, 74, s2In) + s2Out * 22;
  const s3In = ease(ramp(f, 545, 563)), s3Out = ramp(f, 676, 690);
  const s3A = clamp01(Math.min(s3In, 1 - s3Out));
  const s3Y = lerp(97, 74, s3In) + s3Out * 22;

  // ══ ACTO 3 · el tanque · y el MATCH-SHAPE hacia el tubo del pozo ═══════════════════════════
  // arranca EXACTAMENTE en la tarjeta del calentador parada al frente del anillo (x50 / z RAD+plano)
  const tE = ease((f - 706) / 66);
  const twL = ki(f, [772, 870, 1010, 1096, 1152, 1560], [600, 1150, 1300, 720, 132, 118]);
  const thL = ki(f, [772, 870, 1010, 1096, 1152, 1560], [790, 600, 690, 810, 950, 980]);
  const txL = ki(f, [772, 870, 1010, 1096, 1152, 1560], [38, 46, 47, 34, 30, 28]);
  const tyL = ki(f, [772, 870, 1010, 1096, 1152, 1560], [50, 46, 45, 48, 47, 48]);
  const tzL = ki(f, [772, 870, 1010, 1096, 1152, 1560], [140, 170, 200, 180, 160, 120]);
  const trL = ki(f, [772, 870, 1010, 1096, 1152, 1560], [7, -5, -3, 2, 1, 0]);
  const tkW = lerp(CW, twL, tE), tkH = lerp(CH, thL, tE);
  const tkX = lerp(50, txL, tE), tkY = lerp(RING_Y, tyL, tE);
  const tkZ = lerp(RAD + ringPlaneZ, tzL, tE), tkRy = lerp(0, trL, tE);
  const verTanque = f >= A3 - 16;
  const tanqueVideo = f < 840;
  // la TIRA BLANCA del termómetro: el aspa que cruzó se deposita acá (la materia sigue viva)
  const tiraA = clamp01(Math.min(ramp(f, 720, 742), 1 - ramp(f, 1090, 1118)));

  // ══ ACTO 4 · la bomba de pozo — la única que SÍ hay que resolver ═══════════════════════════
  const pE = ease((f - 1146) / 72);
  const pwL = ki(f, [1218, 1296, 1418, 1560], [980, 1060, 1240, 1180]);
  const phL = ki(f, [1218, 1296, 1418, 1560], [560, 600, 700, 680]);
  const pxL = ki(f, [1218, 1296, 1418, 1560], [56, 54, 50, 48]);
  const pyL = ki(f, [1218, 1296, 1418, 1560], [56, 54, 52, 46]);
  const pzL = ki(f, [1218, 1296, 1418, 1560], [200, 220, 260, 300]);
  const prL = ki(f, [1218, 1296, 1418, 1560], [-8, -6, -3, 0]);
  const puW = lerp(150, pwL, pE), puH = lerp(96, phL, pE);
  const puX = lerp(30, pxL, pE), puY = lerp(88, pyL, pE);
  const puZ = lerp(140, pzL, pE), puRy = lerp(0, prL, pE);
  const verBomba = f >= A4 + 4;
  const bombaVideo = f < 1294 || f >= 1418;
  const puSheen = f < 1360 ? 1294 : 1418;
  const aguaA = ramp(f, 1286, 1360);

  // ══ ventanas de la capa de datos (el Readout no tiene salida propia: la pongo yo) ══════════
  const w1 = clamp01(Math.min(ramp(f, 44, 58), 1 - ramp(f, 296, 314)));
  const w2 = clamp01(Math.min(ramp(f, 400, 412), 1 - ramp(f, 630, 650)));
  const w3 = clamp01(Math.min(ramp(f, 736, 748), 1 - ramp(f, 840, 858)));
  const w4 = clamp01(Math.min(ramp(f, 884, 898), 1 - ramp(f, 1090, 1112)));
  const w5 = clamp01(Math.min(ramp(f, 1218, 1232), 1 - ramp(f, 1452, 1476)));
  const w6 = clamp01(Math.min(ramp(f, 1308, 1322), 1 - ramp(f, 1452, 1476)));
  const wDuty = clamp01(Math.min(ramp(f, 1050, 1070), 1 - ramp(f, 1104, 1126)));

  const t1 = clamp01(Math.min(ramp(f, 26, 44), 1 - ramp(f, 300, 322)));
  const t2 = clamp01(Math.min(ramp(f, 374, 392), 1 - ramp(f, 676, 696)));
  const t3 = clamp01(Math.min(ramp(f, 848, 868), 1 - ramp(f, 1096, 1118)));
  const k4 = clamp01(Math.min(ramp(f, 1168, 1186), 1 - ramp(f, 1320, 1342)));
  const t4 = ramp(f, 1494, 1516);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez para los cuatro actos y nunca se remonta ────────── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={atmInt} floor={atmFloor} />

      {/* ── EL MUNDO: una sola cámara, siete estratos de profundidad ───────────────────────── */}
      <Layers cam={cam}>
        {/* z −820 · fondo a sangre (relevo escondido bajo el aspa, en f720) */}
        <Plane z={-820}>
          {f < A3
            ? <PhotoPlane src="img/cmegenerador/cmeg_mv_falt1.png" z={0} scale={1.24} dim={0.66} tint={V.sky} />
            : <PhotoPlane src="img/cmegenerador/cmeg_mv_falt5.png" z={0} scale={1.2} dim={0.62} tint={tintA} />}
        </Plane>

        {/* z −540 · bruma + polvo lejano (parallax propio) */}
        <Plane z={-540}>
          <AbsoluteFill style={{
            background: `radial-gradient(78% 54% at ${(30 + keyFrom * 40).toFixed(1)}% 22%, ${rgba(tintA, 0.12 * atmInt)} 0%, rgba(0,0,0,0) 62%)`,
          }} />
          {Array.from({ length: 14 }, (_, i) => {
            const sp = 0.2 + rnd(i * 8.3) * 0.5;
            const yy = ((rnd(i * 3.9) * 112 - (f * sp) / 26) % 112 + 112) % 112 - 6;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 5.1) * 100).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: 3 + rnd(i * 2.2) * 4, height: 3 + rnd(i * 2.2) * 4, borderRadius: "50%",
                background: rgba(V.white, 0.05 + rnd(i * 6.1) * 0.07),
              }} />
            );
          })}
        </Plane>

        {/* z −300 · LA LOSA del patio: el suelo donde aterrizan todas las sombras */}
        <Plane z={-300}>
          <PadPlane y={76} w={1420} h={320} rx={64} z={0} lit={ki(f, [0, 720, 1140, 1560], [0.9, 0.75, 0.9, 1.15])} />
        </Plane>

        {/* z 0 · LA MATERIA: rail de acero, anillo, tarjetas, tubo, bomba */}
        <Plane z={0}>
          {/* EL RAIL DE ACERO — chapa → órbita del carrusel → reja del ventilador */}
          {railA > 0.01 && (
            <div style={{
              position: "absolute", left: "50%", top: `${railY.toFixed(2)}%`,
              width: railW, height: railW, marginLeft: -railW / 2, marginTop: -railW / 2,
              transform: `translateZ(${railZ.toFixed(1)}px) rotateX(${railTilt.toFixed(2)}deg) rotate(${railSpin.toFixed(2)}deg)`,
              borderRadius: "50%",
              border: `${(2 + fanA * 4).toFixed(1)}px solid ${rgba(V.steel, 0.72 * railA)}`,
              boxShadow: `0 0 70px ${rgba(V.steel, 0.16 * railA)}, inset 0 0 90px ${rgba(V.ink0, 0.5)}`,
              background: fanA > 0.01
                ? `conic-gradient(from 0deg, ${rgba(V.blade, 0)} 0deg, ${rgba(V.blade, 0.15 * fanA)} 24deg, ${rgba(V.blade, 0)} 60deg, ${rgba(V.blade, 0)} 90deg, ${rgba(V.blade, 0.15 * fanA)} 114deg, ${rgba(V.blade, 0)} 150deg, ${rgba(V.blade, 0)} 180deg, ${rgba(V.blade, 0.15 * fanA)} 204deg, ${rgba(V.blade, 0)} 240deg, ${rgba(V.blade, 0)} 270deg, ${rgba(V.blade, 0.15 * fanA)} 294deg, ${rgba(V.blade, 0)} 330deg)`
                : "none",
            }} />
          )}

          {/* ACTO 1 — el carrusel 3D real de lo que NO entra */}
          {verAnillo && (
            <Plane z={ringPlaneZ}>
              <Carousel3D
                items={RING} spin={spin} radius={RAD} cardW={CW} cardH={CH}
                y={RING_Y} focus={0} litColor={tintB}
              />
            </Plane>
          )}

          {/* ACTO 2 — el héroe: la unidad exterior del aire (crece DESDE la tarjeta del anillo) */}
          {verHeroe && (
            heroVideo ? (
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_falt1.mp4" kind="video"
                w={heroW} h={heroH} x={heroX} y={heroY} z={heroZ} ry={heroRy}
                lit={heroLit} litColor={tintB} radius={16}
                startFrom={f >= 640 ? 10 : 0} sheenAt={heroSheen + OFF}
              />
            ) : (
              <MediaCard
                src="img/cmegenerador/cmeg_mv_falt1.png" kind="photo"
                w={heroW} h={heroH} x={heroX} y={heroY} z={heroZ} ry={heroRy}
                lit={heroLit} litColor={tintB} radius={16} sheenAt={heroSheen + OFF}
              />
            )
          )}

          {/* ACTO 2 — los dos que se posponen, aterrizados sobre la losa */}
          {f >= 410 && f < 566 && s2A > 0.01 && (
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_falt2.mp4" kind="video"
              w={400} h={236} x={30} y={s2Y} z={330} ry={12} rot={-1.2}
              lit={0.95} litColor={V.sky} opacity={s2A} label="SECADORA · 5.000 W" radius={12}
            />
          )}
          {f >= 543 && f < 694 && s3A > 0.01 && (
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_falt3.mp4" kind="video"
              w={400} h={236} x={70} y={s3Y} z={330} ry={-12} rot={1.2}
              lit={0.95} litColor={V.amber} opacity={s3A} label="HORNILLA · 2.000 W" radius={12}
            />
          )}

          {/* ACTO 3 → 4 — EL TANQUE que se vuelve el TUBO del pozo (MATCH-SHAPE, sigue vivo en el 4) */}
          {verTanque && (
            tanqueVideo ? (
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_falt4.mp4" kind="video"
                w={tkW} h={tkH} x={tkX} y={tkY} z={tkZ} ry={tkRy}
                lit={1} litColor={tintB} radius={14} startFrom={0} sheenAt={840 + OFF}
              />
            ) : (
              <MediaCard
                src="img/cmegenerador/cmeg_mv_falt4.png" kind="photo"
                w={tkW} h={tkH} x={tkX} y={tkY} z={tkZ} ry={tkRy}
                lit={1} litColor={tintB} radius={14} sheenAt={840 + OFF}
              />
            )
          )}
          {/* la TIRA BLANCA del termómetro: lo que dejó el aspa al cruzar */}
          {tiraA > 0.01 && (
            <div style={{
              position: "absolute", left: `${(tkX + (tkW / 1920) * 100 * 0.30).toFixed(2)}%`,
              top: `${(tkY - 6).toFixed(2)}%`,
              width: Math.max(14, tkW * 0.05), height: Math.max(60, tkH * 0.30),
              marginLeft: -7, transform: `translateZ(${(tkZ + 26).toFixed(1)}px) rotateY(${tkRy.toFixed(2)}deg)`,
              background: `linear-gradient(180deg, ${rgba(V.blade, 0.92)} 0%, ${rgba(V.blade, 0.58)} 100%)`,
              boxShadow: `0 6px 18px ${rgba(V.ink0, 0.7)}`, borderRadius: 3, opacity: tiraA,
            }} />
          )}

          {/* ACTO 4 — la bomba de pozo y el tanque de presión */}
          {verBomba && (
            bombaVideo ? (
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_falt5.mp4" kind="video"
                w={puW} h={puH} x={puX} y={puY} z={puZ} ry={puRy}
                lit={1} litColor={tintA} radius={16}
                startFrom={f >= 1418 ? 6 : 0} sheenAt={puSheen + OFF}
              />
            ) : (
              <MediaCard
                src="img/cmegenerador/cmeg_mv_falt5.png" kind="photo"
                w={puW} h={puH} x={puX} y={puY} z={puZ} ry={puRy}
                lit={1} litColor={tintA} radius={16} sheenAt={puSheen + OFF}
              />
            )
          )}

          {/* íconos PNG como objetos de la escena — uno por acto, nunca dos */}
          {w2 > 0.02 && <IconPng src="img/cmegenerador/cmeg_ic_rayo.png" x={69} y={19} size={104} z={420} opacity={w2 * 0.95} rot={-7} glow={V.ink0} />}
          {tiraA > 0.02 && <IconPng src="img/cmegenerador/cmeg_ic_termometro.png" x={62} y={27} size={98} z={400} opacity={tiraA * 0.9} rot={6} glow={V.ink0} />}
          {w5 > 0.02 && <IconPng src="img/cmegenerador/cmeg_ic_medidor.png" x={72} y={72} size={100} z={430} opacity={w5 * 0.9} rot={-4} glow={V.ink0} />}
        </Plane>

        {/* z +430 · EL AGUA de la bomba (la materia que le entrego a MovCiclo) + grano en primer plano */}
        <Plane z={430}>
          {aguaA > 0.01 && Array.from({ length: 14 }, (_, i) => {
            const sd = rnd(i * 4.1);
            const per = 46 + sd * 54;
            const ph = ((((f - 1286) * (0.6 + sd * 0.7)) % per) + per) % per;
            const t = ph / per;
            const yy = 56 + rnd(i * 2.3) * 9 + t * 30;
            const len = 10 + t * 36;
            const a = aguaA * Math.sin(t * Math.PI) * 0.85;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(31 + rnd(i * 7.7) * 28).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: 3, height: len, marginLeft: -1.5, borderRadius: 2,
                background: `linear-gradient(180deg, ${rgba(V.torch, 0)} 0%, ${rgba(V.torch, 0.75 * a)} 58%, ${rgba(V.white, 0.9 * a)} 100%)`,
                boxShadow: `0 0 12px ${rgba(V.amber, 0.5 * a)}`,
              }} />
            );
          })}
          {aguaA > 0.01 && (
            <AbsoluteFill style={{
              background: `radial-gradient(38% 13% at 44% 90%, ${rgba(V.torch, 0.24 * aguaA)} 0%, ${rgba(V.amber, 0.10 * aguaA)} 46%, rgba(0,0,0,0) 74%)`,
            }} />
          )}
          {Array.from({ length: 16 }, (_, i) => {
            const sp = 0.6 + rnd(i * 11.3) * 1.6;
            const yy = ((rnd(i * 1.7) * 130 - (f * sp) / 12) % 130 + 130) % 130 - 12;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 13.9) * 100).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: 2 + rnd(i * 4.4) * 3, height: 2 + rnd(i * 4.4) * 3, borderRadius: "50%",
                background: rgba(V.white, 0.06 + rnd(i * 9.2) * 0.1),
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── LUZ CÁLIDA DESDE ABAJO: el arco entero aterriza acá (la bomba sola, en tibio) ────── */}
      {bajoCalido > 0.005 && (
        <AbsoluteFill style={{
          background: `radial-gradient(96% 62% at 42% 118%, ${rgba(V.amber, 0.30 * bajoCalido)} 0%, ${rgba(V.torch, 0.10 * bajoCalido)} 44%, rgba(0,0,0,0) 74%)`,
          pointerEvents: "none",
        }} />
      )}

      {/* ── COSTURAS ─────────────────────────────────────────────────────────────────────────
          f−14  la CHAPA de MovSuma termina de cruzar (entra ya en movimiento, despeja en f14)
          f713  el ASPA blanca del ventilador tapa el 100% entre f713 y f723 → adentro cambia todo */}
      <SeamOcclude at={-14 + OFF} dur={28} color={V.steel} angle={9} />
      <SeamOcclude at={713 + OFF} dur={24} color={V.blade} angle={-13} />

      {/* ── LA CAPA DE DATOS (sigue a la cámara con una fracción, no está muerta) ───────────── */}
      <AbsoluteFill style={{
        transform: `translate3d(${(camX * 0.16).toFixed(2)}px, ${(camY * 0.1).toFixed(2)}px, 0)`,
        pointerEvents: "none",
      }}>
        <Titular a={t1} kicker="AIRE ACONDICIONADO CENTRAL" text="CINCO MIL VATIOS" top="13%" />
        <Titular a={t2} kicker="EL ARRANQUE DEL COMPRESOR" text="DOCE MIL EN UN INSTANTE" top="13%" />
        <Titular a={t3} kicker="SI EL TANQUE YA ESTABA CALIENTE" text="AGUA TIBIA DOCE HORAS" top="64%" color={V.white} />
        <Titular a={t4} kicker="LA BOMBA DE POZO" text="ESA SÍ HAY QUE RESOLVERLA" top="64%" color={V.white} />

        {k4 > 0.01 && (
          <div style={{ position: "absolute", left: 96, top: "68%", opacity: k4, transform: `translateY(${((1 - k4) * 18).toFixed(1)}px)` }}>
            <Bed w={620} pad={22}>
              <div style={{ transform: "scale(1.24)", transformOrigin: "left center" }}>
                <Kick color={V.amber}>LA ÚNICA ESENCIAL DE VERDAD</Kick>
              </div>
            </Bed>
          </div>
        )}

        {w1 > 0.01 && (
          <div style={{ opacity: w1 }}>
            <Readout value="5.000" unit="W" label="AIRE CENTRAL · ANDANDO" at={44 + OFF} x={76} y={28} size={132} color={V.volt} />
          </div>
        )}
        {w2 > 0.01 && (
          <div style={{ opacity: w2 }}>
            <Readout value="12.000" unit="W" label="PICO DE ARRANQUE" at={400 + OFF} x={74} y={30} size={152} color={V.volt} />
          </div>
        )}
        {w3 > 0.01 && (
          <div style={{ opacity: w3 }}>
            <Readout value="4.500" unit="W" label="CALENTADOR ELÉCTRICO" at={736 + OFF} x={75} y={26} size={130} color={V.volt} />
          </div>
        )}
        {w4 > 0.01 && (
          <div style={{ opacity: w4 }}>
            <Readout value="0" unit="W" label="MIENTRAS TE DURA EL AGUA" at={884 + OFF} x={75} y={27} size={168} color={V.amber} />
          </div>
        )}
        {w5 > 0.01 && (
          <div style={{ opacity: w5 }}>
            <Readout value="750" unit="W" label="LA BOMBA, ANDANDO" at={1218 + OFF} x={23} y={22} size={126} color={V.amber} />
          </div>
        )}
        {w6 > 0.01 && (
          <div style={{ opacity: w6 }}>
            <Readout value="2.300" unit="W" label="LA BOMBA, EN EL ARRANQUE" at={1308 + OFF} x={23} y={41} size={126} color={V.volt} />
          </div>
        )}

        {/* la firma del video puesta al servicio del reloj: 4 de las 12 horas de agua tibia */}
        {wDuty > 0.01 && (
          <>
            <div style={{
              position: "absolute", left: "50%", top: "82%", transform: "translateX(-50%)",
              opacity: wDuty,
            }}>
              <div style={{ transform: "scale(1.2)", transformOrigin: "center" }}>
                <Kick color={V.amber}>CUATRO HORAS DE APAGÓN</Kick>
              </div>
            </div>
            <DutyField duty={4 / 12} cells={12} on={wDuty} tint={V.amber} y={89.5} w={860} h={44} cycle={190} />
          </>
        )}
      </AbsoluteFill>

      {/* viñeta final: la cámara baja y todo lo que no es la bomba se apaga */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(112% 92% at 50% 46%, rgba(0,0,0,0) 58%, ${rgba(V.ink0, 0.5 + ramp(f, 1400, 1560) * 0.22)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
