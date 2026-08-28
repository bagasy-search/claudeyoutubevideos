// MovEscudo.tsx — S2 · UN MOVIMIENTO CONTINUO de 45 s (1350 frames @30fps)
// «Las tres cosas que esto NO es, dichas al minuto tres y no escondidas en el veinte.»
//
// EL ESCUDO DE HONESTIDAD. Viene de `MovTresContra` con las TRES BARRAS del `PromiseGap` suspendidas
// en el aire y la cámara girada 12° a la derecha, y las entrega ALEJÁNDOSE mientras aparece detrás el
// primer mito. De ahí el movimiento tacha tres promesas ajenas —el motor de imanes, la desconexión de
// la compañía, el aire acondicionado— y termina metiéndose al garaje por el vano del portón, en
// contraluz blanco, que es exactamente donde arranca `MovCinco`.
//
// UNA sola atmósfera (`VoltAtmos`) montada arriba de todo y NUNCA remontada · UNA sola cámara
// `gcam(g, …)` que jamás vuelve a cero (el acto 3 hereda posición, zoom e inercia del 2) · la luz
// EVOLUCIONA `volt` (bajo) → `white` (contraluz del portón) sin un solo salto · y una MATERIA cruza
// CADA frontera: la goma del cable, el disco del medidor y el disco ya detenido convertido en reloj.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈+60, ry +12° (heredada tal cual de `MovTresContra`), rx +1.8, deriva viva ·
//                       luz VOLT BAJO (intensity .55, key arriba-izquierda) · materia: LAS TRES BARRAS
//                       DEL `PromiseGap` (100/89 · 600/431 · 3000/340) suspendidas en el aire.
//                EXIT   cám z≈-95 (retrocedió con las barras alejándose), ry ≈ +6.5° · luz volt→blanco
//                       naciente · materia: LA GOMA NEGRA DEL CABLE, que ya está barriendo el cuadro.
//
// acto 2 · f378  ENTER  cám z≈-95 ry ≈+6.4° (la misma, sin reinicio; empieza a empujar) · luz volt tibio ·
//                       materia: LA GOMA DEL CABLE, que sale de la oclusión y aterriza enchufada al
//                       medidor de la compañía (la misma goma de los dos lados de la costura).
//                EXIT   cám z≈+25, pan −60 · luz blanco a media asta · materia: EL DISCO DEL MEDIDOR
//                       girando (12 marcas finas).
//
// acto 3 · f756  ENTER  cám z≈+25 (hereda el empuje del acto 2) · luz blanco a media asta · materia:
//                       EL MISMO DISCO, que engorda a 5 aspas y ES la turbina del condensador — y que
//                       en f900 se FRENA hasta quedar quieto (el aire no se mueve).
//                EXIT   cám z≈+110, pan +150 (el paneo ya arrancó, la cámara viaja) · luz blanco pleno
//                       entrando por el vano · materia: LA TURBINA DETENIDA.
//
// acto 4 · f1107 ENTER  cám z≈+110 → +540 (la INERCIA la mete adentro del garaje), pan volviendo al
//                       centro, ry +4.6° → 0 · luz WHITE en contraluz, intensidad al alza · materia:
//                       LA TURBINA DETENIDA, que adelgaza y se vuelve EL RELOJ del minuto tres.
//                EXIT   cám CENTRADA (ry 0, pan 0), asentada y todavía derivando · luz BLANCA de
//                       contraluz del portón abierto de par en par · materia: EL VANO DEL PORTÓN a
//                       sangre, ya como decorado  → así arranca `MovCinco`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f370   frontera 1→2 : OCLUSIÓN con `V.ink2` (LA GOMA DEL CABLE), dur 16 → cobertura total en f378.
//                        La misma goma entra en cuadro desde f322 y sale enchufada al medidor: no es
//                        un telón, es un objeto que pasa.
// f756   frontera 2→3 : MORFO — el disco del medidor (12 marcas finas girando a 3,2°/frame) engorda
//                        a 5 aspas y se convierte en la turbina del condensador. La forma NUNCA se
//                        interrumpe: lo que se va es la tarjeta del medidor (escala 1→2,3 hacia el eje
//                        del disco), lo que llega crece detrás del mismo disco. Ventana 720 → 812.
// f1107  frontera 3→4 : INERCIA — la cámara sigue su paneo (pan +150 acumulado) y el decorado cambia
//                        detrás: el condensador sale de cuadro a velocidad (−1500 px en 42 frames) y
//                        el portón ya está ahí, a tamaño de decorado. Estelas de velocidad, cero fade.
// (ninguna se repite · ninguna es un fundido · ninguna es `opacity 0→1` sobre el cuadro entero)
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame: el farm rinde en 60 chunks) ─────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros
const F_A2 = 378;
const F_A3 = 756;
const F_A4 = 1107;
const SEAM_OCC = 370;    // frontera 1→2 · OCLUSIÓN con la goma del cable (V.ink2)
const SEAM_MORFO = 756;  // frontera 2→3 · MORFO disco → turbina
const SEAM_INER = 1107;  // frontera 3→4 · INERCIA

// ── EL DISCO — la materia que cruza DOS fronteras ────────────────────────────────────────────
// Nace como el disco del medidor de la compañía (12 marcas finas girando), engorda a las 5 aspas del
// condensador (`m1`), se frena hasta quedar quieto, y adelgaza otra vez para ser el RELOJ del minuto
// tres (`m2`). Es estructura gráfica sobre material real, nunca un objeto dibujado que reemplace algo.
const Disco: React.FC<{
  x: number; y: number; size: number; ang: number; m1: number; m2: number; op: number; color: string;
}> = ({ x, y, size, ang, m1, m2, op, color }) => {
  if (op <= 0.005) return null;
  const N = 12;
  const bw = lerp(lerp(3.6, size * 0.155, m1), 4.6, m2);
  const bh = lerp(lerp(size * 0.40, size * 0.44, m1), size * 0.10, m2);
  const rr = lerp(lerp(size * 0.29, size * 0.26, m1), size * 0.40, m2);
  const oddOp = clamp01(1 - m1 + m2);          // las marcas impares se van con las aspas y vuelven en el reloj
  const rim = lerp(2, 6, m1) * (1 - 0.5 * m2);
  return (
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, opacity: op,
    }}>
      {/* la carcasa: anillo metálico con su bisel — el disco vive DENTRO del material real */}
      <div style={{
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: "50%",
        border: `${rim.toFixed(1)}px solid ${rgba(color, 0.44 + 0.26 * m1)}`,
        background: `radial-gradient(circle at 34% 28%, ${rgba(V.ink0, 0.30)} 0%, ${rgba(V.ink0, 0.62)} 62%, ${rgba(V.ink0, 0.82)} 100%)`,
        boxShadow: `inset 0 2px 0 ${rgba(V.white, 0.22)}, 0 0 ${Math.round(size * 0.16)}px ${rgba(color, 0.32)}`,
      }} />
      {/* la rejilla del condensador (sólo cuando ES turbina) */}
      {m1 > 0.02 && (1 - m2) > 0.02 && (
        <>
          <div style={{
            position: "absolute", left: "12%", top: "12%", width: "76%", height: "76%",
            borderRadius: "50%", border: `2px solid ${rgba(V.silver, 0.30 * m1 * (1 - m2))}`,
          }} />
          <div style={{
            position: "absolute", left: "27%", top: "27%", width: "46%", height: "46%",
            borderRadius: "50%", border: `2px solid ${rgba(V.silver, 0.24 * m1 * (1 - m2))}`,
          }} />
        </>
      )}
      {/* las marcas / aspas */}
      {Array.from({ length: N }, (_, i) => {
        const par = i % 2 === 0;
        const a = i * (360 / N) + ang;
        const w = par ? bw : lerp(bw, 3.4, m1) * (1 - 0.35 * m1);
        const h = par ? bh : bh * (1 - 0.42 * m1);
        return (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%", width: w, height: h,
            marginLeft: -w / 2, marginTop: -h / 2, borderRadius: lerp(2, size * 0.05, m1) * (1 - 0.7 * m2),
            transform: `rotate(${a.toFixed(2)}deg) translateY(${(-rr).toFixed(2)}px)`,
            background: par
              ? `linear-gradient(180deg, ${rgba(color, 0.92)} 0%, ${rgba(color, 0.46)} 100%)`
              : rgba(color, 0.72 * oddOp),
            opacity: par ? 1 : oddOp,
            boxShadow: `0 0 ${Math.round(8 + size * 0.05)}px ${rgba(color, 0.34)}`,
          }} />
        );
      })}
      {/* la marca roja del disco del medidor (se va cuando el disco se vuelve turbina) */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: 5, height: size * 0.30,
        marginLeft: -2.5, marginTop: -size * 0.15, borderRadius: 2,
        transform: `rotate(${(ang * 1.0 + 40).toFixed(2)}deg) translateY(${(-size * 0.16).toFixed(1)}px)`,
        background: rgba(V.orange, 0.9 * (1 - m1)), opacity: 1 - m1,
        boxShadow: `0 0 14px ${rgba(V.orange, 0.6 * (1 - m1))}`,
      }} />
      {/* el cubo central */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: size * 0.13, height: size * 0.13,
        marginLeft: -size * 0.065, marginTop: -size * 0.065, borderRadius: "50%",
        background: `radial-gradient(circle at 36% 30%, ${rgba(V.silver, 0.8)} 0%, ${rgba(V.ink1, 0.95)} 76%)`,
        boxShadow: `0 3px 12px ${rgba(V.ink0, 0.9)}`,
      }} />
      {/* EL RELOJ: la aguja del minuto tres y la marca fantasma del minuto veinte */}
      {m2 > 0.02 && (
        <>
          <div style={{
            position: "absolute", left: "50%", top: "50%", width: 4, height: size * 0.34,
            marginLeft: -2, marginTop: -size * 0.34, transformOrigin: "50% 100%",
            transform: "rotate(18deg)", borderRadius: 2,
            background: `linear-gradient(180deg, ${rgba(V.volt, 0.95)} 0%, ${rgba(V.volt, 0.45)} 100%)`,
            opacity: m2, boxShadow: `0 0 16px ${rgba(V.volt, 0.7)}`,
          }} />
          <div style={{
            position: "absolute", left: "50%", top: "50%", width: 3, height: size * 0.20,
            marginLeft: -1.5, marginTop: -size * 0.20, transformOrigin: "50% 100%",
            transform: "rotate(120deg)", borderRadius: 2,
            background: rgba(V.orange, 0.55 * m2), opacity: m2 * 0.8,
          }} />
        </>
      )}
    </div>
  );
};

// ── ESTELAS DE VELOCIDAD — la INERCIA de la frontera 3→4 se VE ────────────────────────────────
const Estelas: React.FC<{ g: number; at: number; color: string }> = ({ g, at, color }) => {
  const a = Math.sin(Math.PI * clamp01((g - (at - 30)) / 86));
  if (a <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 14 }, (_, i) => {
        const yy = 6 + rnd(i * 4.3) * 88;
        const sp = 0.55 + rnd(i * 7.9) * 0.8;
        const w = 260 + rnd(i * 2.1) * 700;
        const xx = 130 - ((g - (at - 30)) * sp * 4.6 + rnd(i * 9.7) * 220) / 19.2;
        return (
          <div key={i} style={{
            position: "absolute", top: `${yy.toFixed(2)}%`, left: `${xx.toFixed(2)}%`,
            width: w, height: 1 + rnd(i * 5.5) * 2.6,
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(color, 0.34 * a)} 42%, rgba(0,0,0,0) 100%)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── TITULAR (una idea de texto por acto, sobre cama oscura, safe area 60 px) ──────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 72, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 15), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 66, maxWidth: 1040,
      opacity: a, transform: `translateY(${dy.toFixed(1)}px)`,
    }}>
      <Bed pad={28}>
        <div style={{ marginBottom: 10 }}><Kick color={kickColor}>{kick}</Kick></div>
        <Head size={size}>{head}</Head>
        {sub ? <div style={{ marginTop: 12 }}><Body size={31}>{sub}</Body></div> : null}
      </Bed>
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovEscudo: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 4) - 1) * 340);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `sheenAt`) miden con useCurrentFrame;
  // `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: 60, z1: 300, panX: 66, panY: -44, rx: 1.8, dur: 1240 });
  const zAcc =
    eio(0, -170, seg(g, 0, 170)) +            // acto 1: las tres barras se alejan (la cámara retrocede)
    eio(0, 120, seg(g, 372, 540)) +           // acto 2: entra al medidor
    eio(0, 85, seg(g, 752, 910)) +            // acto 3: se acerca al condensador
    eio(0, 430, seg(g, 1080, 1330));          // acto 4: INERCIA — se mete al garaje por el portón
  const pxAcc =
    eio(0, -60, seg(g, 372, 560)) +
    eio(0, 150, seg(g, 900, 1120)) +          // el paneo que ARRASTRA la costura 3
    eio(0, -150, seg(g, 1120, 1330));         // y vuelve al centro para entregarle a MovCinco
  const pyAcc =
    eio(0, 30, seg(g, 0, 200)) + eio(0, -46, seg(g, 980, 1200)) + eio(0, 16, seg(g, 1200, 1345));
  // 12° heredados de MovTresContra que se desenroscan hasta la cámara CENTRADA de la salida
  const ryAcc = 12 - eio(0, 7.4, seg(g, 60, 540)) - eio(0, 4.6, seg(g, 900, 1300));
  const cam =
    `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px) ` +
    `rotateY(${ryAcc.toFixed(3)}deg)`;

  // ── LA LUZ: evoluciona, no salta. volt (bajo) → white (contraluz del portón) ───────────────
  const cKey = light(seg(g, 40, 1160), "volt", "white");
  const cWarm = light(seg(g, 200, 1260), "amber", "torch");
  const keyFrom = 0.26 + eio(0, 0.10, seg(g, 0, 420)) + eio(0, 0.16, seg(g, 1050, 1340));
  const intensity =
    0.55 + eio(0, 0.22, seg(g, 0, 90)) + eio(0, 0.14, seg(g, 700, 1000)) + eio(0, 0.32, seg(g, 1090, 1340));
  const floor = 0.60 - 0.20 * ez(g, 1090, 1330);

  // ── ACTO 1 · las tres barras heredadas se alejan y detrás queda EL MITO ────────────────────
  // se van por PROFUNDIDAD (encogen y retroceden), no por un fundido del cuadro
  const barZ = lerp(-30, -720, ez(g, 8, 150));
  const barS = lerp(1, 0.42, ez(g, 8, 150));
  const barOp = 1 - ez(g, 96, 168);
  const motorW = Math.round(lerp(1010, 1120, ez(g, 20, 300)));
  const motorH = Math.round(motorW * 0.5625);
  const tach = ez(g, 132, 186);                     // la barra volt que TACHA el motor
  const panelOp = ez(g, 214, 250) * (1 - ez(g, 352, 372));

  // ── el CABLE: la materia de la frontera 1→2 (entra en el acto 1, sale enchufado en el 2) ───
  const cabIn = ez(g, 322, 380);
  const cabX = lerp(-16, 118, cabIn);
  const cabRot = lerp(-46, 26, cabIn);
  const cabOut = ez(g, 384, 430);                   // ya del otro lado: aterriza en el medidor
  const cabOp = (g >= 316 && g < 620) ? Math.min(1, ez(g, 316, 344)) * (1 - ez(g, 560, 618)) : 0;

  // ── ACTO 2 · el medidor de la compañía · el disco que gira ────────────────────────────────
  const a2On = g >= F_A2 - 10 && g < SEAM_MORFO + 56;
  const medW = Math.round(lerp(1060, 1150, ez(g, F_A2, 640)));
  const medH = Math.round(medW * 0.5625);
  const morfo = ez(g, 720, 812);                    // MORFO disco → turbina
  const medScale = lerp(1, 2.3, morfo);
  const medOp = 1 - clamp01((morfo - 0.42) / 0.44);
  const redOp = ez(g, 470, 520) * (1 - ez(g, 690, 740));   // la línea al poste: "seguís conectado"

  // ── ACTO 3 · el condensador quieto ────────────────────────────────────────────────────────
  const a3On = g >= F_A3 - 50 && g < SEAM_INER + 46;
  const condW = Math.round(lerp(1180, 1280, ez(g, 760, 1000)));
  const condH = Math.round(condW * 0.5625);
  const condX = 50 + lerp(0, -78, ez(g, SEAM_INER - 4, SEAM_INER + 38));
  const condScale = lerp(0.86, 1, ez(g, 720, 830));
  const clipBar = clamp01((g - 900) / 120) * (g < 1022 ? 1 : 0);   // 4 s exactos y CORTA

  // ── ACTO 4 · el portón abierto en contraluz: la tarjeta se vuelve DECORADO (escala) ───────
  const a4On = g >= F_A4 - 29;
  const porW = Math.round(lerp(1460, 2180, ez(g, 1092, 1320)));
  const porH = Math.round(porW * 0.5625);
  const porRad = Math.round(lerp(18, 0, ez(g, 1120, 1300)));
  const contra = ez(g, 1090, 1290);                 // el contraluz que gana el cuadro

  // ── EL DISCO: nace en el medidor, es turbina, se frena, y termina siendo el RELOJ ──────────
  const spinDeg = (() => {
    const s0 = 400;
    if (g <= 790) return 3.2 * Math.max(0, g - s0);
    const u = clamp01((g - 790) / 132);             // frenada suave: derivada continua y llega a 0
    return 3.2 * (790 - s0) + 3.2 * 132 * (u - (u * u) / 2);
  })();
  const m2 = ez(g, 1096, 1200);                     // turbina → reloj del minuto tres
  const discoOp = ez(g, 430, 486) * (1 - ez(g, 1332, 1350));
  const discoX = lerp(lerp(48.6, 52, morfo), 80, m2);
  const discoY = lerp(lerp(44, 49, morfo), 22, m2);
  const discoSize = Math.round(lerp(lerp(238, 430, morfo), 176, m2));
  const discoColor = light(seg(g, 700, 1180), "volt", "silver");

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cWarm} keyFrom={keyFrom} intensity={intensity} floor={floor} />

      <Layers cam={cam}>
        {/* P1 · el garaje de Claudio, plano profundo: el LUGAR nunca cambia en los 45 s */}
        <PhotoPlane
          src="img/cmetemu/cmet_h02.jpg"
          kind="photo" z={-680} scale={1.3}
          dim={lerp(0.80, 0.62, ez(g, 1080, 1320))} tint={cKey}
        />

        {/* P2 · el hormigón que corre del garaje al patio + la línea a la red */}
        <Plane z={-420}>
          <PadPlane y={77} w={1500} h={330} rx={62} lit={0.5 + 0.5 * ez(g, 380, 900)} z={-40} />
          {redOp > 0.01 && (
            <svg viewBox="0 0 1920 1080" style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
            }}>
              <path
                d="M 1060 560 C 1320 520, 1520 430, 1748 336"
                fill="none" stroke={rgba(cKey, 0.42 * redOp)} strokeWidth={3}
                strokeDasharray="16 13"
                strokeDashoffset={(-g * 1.6).toFixed(1)}
              />
            </svg>
          )}
        </Plane>

        {/* P3 · el contraluz del portón, que nace detrás del material y termina bañando el cuadro */}
        <Plane z={-250}>
          {contra > 0.01 && (
            <>
              <div style={{
                position: "absolute", left: "50%", top: "48%", width: 1280, height: 900,
                marginLeft: -640, marginTop: -450, borderRadius: 40,
                background: `radial-gradient(62% 58% at 50% 46%, ${rgba(V.white, 0.42 * contra)} 0%, ${rgba(V.white, 0.14 * contra)} 46%, rgba(0,0,0,0) 74%)`,
                mixBlendMode: "screen",
              }} />
              <div style={{
                position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
                background: `linear-gradient(4deg, rgba(0,0,0,0) 42%, ${rgba(V.white, 0.10 * contra)} 100%)`,
                mixBlendMode: "screen",
              }} />
            </>
          )}
        </Plane>

        {/* P4 · EL MATERIAL REAL: las tarjetas protagonistas (una por acto) ── */}
        <Plane z={40}>
          {/* ACTO 1 — el motor de imanes casero. Es el MITO: entra tachado por la barra volt. */}
          {g < SEAM_OCC + 18 && (
            <>
              <MediaCard
                src="broll/cmetemu/cmet_mv_escudo1.mp4" kind="video"
                w={motorW} h={motorH} x={49} y={45} z={0}
                ry={lerp(-7, 1.5, ez(g, 10, 260))} rx={lerp(2.4, 0, ez(g, 10, 260))}
                radius={16} startFrom={6} lit={0.62 + 0.34 * ez(g, 20, 150)}
                litColor={cKey} label="MOTOR DE IMANES · NO EXISTE" sheenAt={at(104)}
              />
              {/* el pequeño hecho HONESTO que desmiente al mito (material real, no un vector) */}
              {panelOp > 0.01 && (
                <div style={{ opacity: panelOp }}>
                  <MediaCard
                    src="img/cmetemu/cmet_h05.jpg" kind="photo"
                    w={352} h={202} x={79} y={73} z={30}
                    ry={-8} radius={12} lit={0.95} litColor={cKey}
                    label="UN PANEL DE VERDAD" sheenAt={at(238)}
                  />
                </div>
              )}
            </>
          )}

          {/* ACTO 2 — el medidor de la compañía. Sale por MORFO: escala hacia el eje del disco. */}
          {a2On && (
            <div style={{
              transform: `scale(${medScale.toFixed(3)})`, transformOrigin: "48.6% 44%",
              opacity: clamp01(medOp),
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_escudo2.mp4" kind="video"
                w={medW} h={medH} x={48.6} y={44} z={0}
                ry={lerp(6, -1.5, ez(g, F_A2, 620))} radius={16} startFrom={9}
                lit={0.92} litColor={cKey} label="EL MEDIDOR DE LA COMPAÑÍA" sheenAt={at(404)}
              />
            </div>
          )}

          {/* ACTO 3 — el condensador quieto. Sale por INERCIA: se va de cuadro a velocidad. */}
          {a3On && (
            <div style={{
              transform: `translateX(${((condX - 50) * 19.2).toFixed(1)}px) scale(${condScale.toFixed(3)})`,
              transformOrigin: "52% 49%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_escudo3.mp4" kind="video"
                w={condW} h={condH} x={52} y={49} z={0}
                ry={lerp(-5, 2, ez(g, 760, 1060))} radius={16} startFrom={5}
                lit={0.94} litColor={cKey} label="CONDENSADOR · 3.500 W DE ARRANQUE" sheenAt={at(772)}
              />
            </div>
          )}

          {/* ACTO 4 — el portón: la tarjeta CRECE hasta ser el decorado (y el vano queda a sangre) */}
          {a4On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_escudo4.mp4" kind="video"
              w={porW} h={porH} x={50} y={50} z={0}
              ry={lerp(5, 0, ez(g, 1092, 1300))} rx={lerp(1.6, 0, ez(g, 1092, 1300))}
              radius={porRad} startFrom={3} lit={0.96} litColor={V.white}
              grade={false} sheenAt={at(1136)}
            />
          )}
        </Plane>

        {/* P5 · GRÁFICO Y OBJETOS DE PRIMER PLANO: las barras heredadas, la tachadura, el cable, el disco ── */}
        <Plane z={120}>
          {/* LAS TRES BARRAS heredadas de MovTresContra: están DELANTE (suspendidas en el aire) y se
              van por PROFUNDIDAD, atravesando el plano del material — no por un fundido del cuadro */}
          {barOp > 0.01 && (
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
              transform: `translateZ(${barZ.toFixed(1)}px) scale(${barS.toFixed(3)})`,
              transformOrigin: "50% 44%", opacity: barOp,
            }}>
              {/* llegan YA crecidas (el reloj interno del campo arranca 64 cuadros antes): no se
                  vuelven a construir, es el mismo objeto que el movimiento anterior soltó */}
              <Sequence from={-64} layout="none">
                <PromiseGap promise={100} measured={89} unit="W" x={20} y={40} w={380} h={210}
                  slats={18} nums={false} label="PANEL" />
                <PromiseGap promise={600} measured={431} unit="Wh" x={50} y={40} w={380} h={210}
                  slats={18} nums={false} label="ESTACIÓN" />
                <PromiseGap promise={3000} measured={340} unit="W" x={80} y={40} w={380} h={210}
                  slats={18} nums={false} label="INVERSOR" />
              </Sequence>
            </div>
          )}

          {/* la barra VOLT que tacha el mito del acto 1 */}
          {tach > 0.01 && g < SEAM_OCC + 12 && (
            <div style={{
              position: "absolute", left: "49%", top: "45%", width: 1080, height: 15,
              marginLeft: -540, marginTop: -7.5, borderRadius: 3,
              transform: `rotate(-9deg) scaleX(${tach.toFixed(3)})`, transformOrigin: "6% 50%",
              background: `linear-gradient(90deg, ${rgba(V.volt, 0.25)} 0%, ${V.volt} 14%, ${V.volt} 86%, ${rgba(V.volt, 0.25)} 100%)`,
              boxShadow: `0 0 30px ${rgba(V.volt, 0.72)}, 0 6px 22px ${rgba(V.ink0, 0.9)}`,
            }} />
          )}

          {/* EL CABLE — la MATERIA de la frontera 1→2: barre el cuadro y sale enchufado al medidor */}
          {cabOp > 0.01 && (
            <IconPng
              src="img/cmetemu/cmet_ic_cable.png"
              x={g < SEAM_OCC + 8 ? cabX : lerp(120, 16, cabOut)}
              y={g < SEAM_OCC + 8 ? lerp(78, 40, cabIn) : lerp(38, 68, cabOut)}
              size={Math.round(lerp(300, 210, Math.max(cabIn * 0.5, cabOut)))}
              z={60} opacity={cabOp}
              rot={g < SEAM_OCC + 8 ? cabRot : lerp(30, -6, cabOut)}
              glow={V.ink0}
            />
          )}

          {/* el poste de la calle: no te desconectás de eso */}
          {redOp > 0.01 && (
            <IconPng src="img/cmetemu/cmet_ic_poste.png" x={91} y={17} size={126} z={20}
              opacity={redOp * 0.95} glow={V.ink0} />
          )}

          {/* EL DISCO: medidor → turbina → reloj. Cruza las fronteras 2→3 y 3→4 sin cortarse. */}
          <Disco x={discoX} y={discoY} size={discoSize} ang={spinDeg} m1={morfo} m2={m2}
            op={discoOp} color={discoColor} />

          {/* los 4 segundos del clip que te muestran… y corta */}
          {clipBar > 0.005 && (
            <div style={{
              position: "absolute", left: "22%", top: "34%", width: 460, height: 9,
              marginLeft: -230, borderRadius: 4, background: rgba(V.ink0, 0.72),
              boxShadow: `inset 0 0 0 1px ${rgba(V.orange, 0.35)}`,
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: `${(clipBar * 100).toFixed(1)}%`,
                borderRadius: 4, background: `linear-gradient(90deg, ${rgba(V.orange, 0.6)} 0%, ${V.orange} 100%)`,
                boxShadow: `0 0 18px ${rgba(V.orange, 0.6)}`,
              }} />
            </div>
          )}
        </Plane>

        {/* P6 · primer plano: polvo del garaje cruzando el haz (hold VIVO permanente) */}
        <Plane z={260}>
          {Array.from({ length: 15 }, (_, i) => {
            const sp = 0.4 + rnd(i * 4.7) * 1.1;
            const yy = (((rnd(i * 8.3) * 130 - (g * sp) / 21) % 130) + 130) % 130 - 12;
            const s = 2 + rnd(i * 2.9) * 3.2;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(7 + rnd(i * 6.1) * 86).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, 0.1 + rnd(i * 3.7) * 0.2),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.2)}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo · ninguna es un fade) ── */}
      {/* f370 · frontera 1→2 · OCLUSIÓN con la GOMA DEL CABLE (V.ink2, materia oscura llevada a
          luminancia media por el Stage: ni fundido a negro ni flash blanco) */}
      <SeamOcclude at={at(SEAM_OCC)} dur={16} color={V.ink2} angle={11} lit={0.30} />
      {/* f1107 · frontera 3→4 · INERCIA: la cámara sigue su vector y el decorado cambia detrás */}
      <Estelas g={g} at={SEAM_INER} color={V.white} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={34} outF={330} kick="LO QUE ESTO NO ES · 1"
          head="NO ES ENERGÍA GRATIS"
          sub="Produce cuando hay sol. Cuando no hay, no produce." />
        <Titular g={g} inF={402} outF={700} kick="LO QUE ESTO NO ES · 2"
          head="NO TE DESCONECTA"
          sub="Sigues enchufado y sigues pagando." />
        <Titular g={g} inF={782} outF={1052} kick="LO QUE ESTO NO ES · 3"
          head="NI DE CERCA MUEVE EL AIRE" size={66}
          sub="Ni la secadora, ni el calentador del agua." />
        <Titular g={g} inF={1132} outF={1298} kick="EL TRATO" head="AL MINUTO TRES"
          sub="No escondido en el minuto veinte." kickColor={V.white} />

        {/* la cifra del clip trucado: entra sobre el material real, nunca sobre fondo plano */}
        {g >= 898 && g < 1030 && (
          <Readout value="4" unit="s" label="EL CLIP QUE TE MUESTRAN" at={at(900)}
            x={22} y={26} size={132} color={V.orange} />
        )}
        {/* el reloj ya es reloj: la cifra se lee bajo la esfera detenida */}
        {g >= 1168 && (
          <Readout value="3" unit="min" label="LO DIGO ACÁ" at={at(1170)}
            x={80} y={38} size={104} color={V.volt} />
        )}

        {/* remate del acto 3 sobre la turbina detenida (dato corto, no una segunda idea) */}
        {g >= 812 && g < 1064 && (
          <div style={{
            position: "absolute", right: 66, top: 104, width: 400, textAlign: "right",
            opacity: Math.min(ez(g, 812, 846), 1 - ez(g, 1030, 1064)),
          }}>
            <Bed pad={22}>
              <Kick color={V.orange}>ARRANQUE DEL COMPRESOR</Kick>
              <div style={{ marginTop: 8 }}>
                <Body size={31}>Diez veces lo que da esta caja.</Body>
              </div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* la firma tipográfica del canal en la entrega: nada, el cuadro sale limpio para MovCinco */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `linear-gradient(180deg, rgba(0,0,0,0) 62%, ${rgba(V.ink0, 0.34 * (1 - ez(g, 1150, 1330)))} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
