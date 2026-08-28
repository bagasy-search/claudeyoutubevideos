// MovCierre.tsx — S11 · UN MOVIMIENTO CONTINUO de 62 s (1860 frames @30fps) · EL CIERRE + EL CTA
// «Mídelo. Y si quieres el atajo, la guía con los sesenta aparatos medidos. QR nueve segundos.»
//
// Viene de `MovCuenta`: ámbar cálido bajo en el patio, LA LOSA VACÍA. Sobre esa losa aterrizan las dos
// herramientas; la mesa se vuelve la hoja de la guía; la cámara se desliza de una hoja a la siguiente;
// una hoja de papel cruza el cuadro y detrás ya está la reseña de Óscar; y el QR entra UNA vez, se
// clava, y NO SE MUEVE MÁS — ni siquiera en el corte del acto 5. El QR es la materia que cruza el
// último corte.
//
// LA LUZ EVOLUCIONA de punta a punta: ámbar bajo del patio al anochecer (S11, keyFrom .80) → la
// LÁMPARA DE MESA del taller que se enciende sobre las hojas (torch, keyFrom .44, intensity 1.28).
// Nunca salta: es una sola rampa continua de `light()` + un charco de lámpara que crece.
//
// ⛔ NI PRECIOS NI URLS DE LA GUÍA EN PANTALLA. La guía se nombra por lo que trae.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  CAM z≈-40, pan 0, casi quieta (heredada de MovCuenta) · LUZ ámbar cálido bajo,
//                       key a la derecha (keyFrom .80), intensity .58, floor .66 · MATERIA: LA LOSA
//                       DE CONCRETO VACÍA (`PadPlane`), lo último que dejó MovCuenta.
//                EXIT   CAM z≈+62 empujando y bajando sobre la mesa · LUZ ámbar subiendo hacia torch
//                       (la lámpara del taller entrando, key viajando .80→.63) · MATERIA: EL RECTÁNGULO
//                       DE LA MESA, ya deformándose hacia vertical.
//
// acto 2 · f360  ENTER  CAM z≈+50 (la MISMA que salía del acto 1, sin reinicio) · LUZ ámbar/torch,
//                       key .62 · MATERIA: EL MISMO RECTÁNGULO, ahora LA HOJA DE LOS 60 APARATOS
//                       (mismo x/y/rot al frame del cambio: la mesa SE VOLVIÓ la hoja).
//                EXIT   CAM z≈+30, pan lateral iniciado hacia la derecha de la mesa · LUZ torch, la
//                       lámpara al 60% · MATERIA: LA MESA con las DOS hojas apoyadas, viajando.
//
// acto 3 · f780  ENTER  CAM z≈+30 con el pan lateral en curso (la misma inercia) · LUZ torch, lámpara
//                       al 60% · MATERIA: LA MESA, que trae la SEGUNDA HOJA (las 14 acciones) al centro.
//                EXIT   CAM z≈+150, cerca y cenital sobre el papel · LUZ torch plena + ámbar en la tira
//                       de las once gratis · MATERIA: LA HOJA DE LAS 14 ACCIONES (sobrevive la
//                       oclusión: en el acto 4 es la hoja sobre la que se apoya la reseña).
//
// acto 4 · f1200 ENTER  CAM z≈-60 (retrocede DENTRO de la oclusión, tapada al 100%) · LUZ torch plena
//                       desde arriba, lámpara al 85% · MATERIA: LA HOJA DE LAS 14 ACCIONES, ahora en
//                       las manos de Claudio y después apoyada en la mesa con la reseña encima.
//                EXIT   CAM z≈+66 asentada, deriva mínima · LUZ lámpara de mesa cálida y ESTABLE ·
//                       MATERIA: EL QR, clavado en pantalla desde f1358, quieto al pixel.
//
// acto 5 · f1620 ENTER  CAM z≈+66 EXACTA (encuadre, escala y luz calzan: por eso el corte es seco) ·
//                       LUZ lámpara de mesa cálida y estable · MATERIA: EL QR — el único elemento que
//                       atraviesa el corte sin moverse un pixel.
//                EXIT   CAM z≈+84, quieta · LUZ luz de mesa cálida y estable sobre la guía y el QR ·
//                       MATERIA: LA HOJA DE LA GUÍA CON EL QR  → así entrega el video.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f336        frontera 1→2 : MATCH-SHAPE. El rectángulo de la mesa (1180×520, x50 y46, rot −1.4) se
//                            deforma en la hoja vertical (700×930, x36 y50, rot 2.0) entre f330 y f402,
//                            y el CONTENIDO cambia EN SECO en f336, cuando la geometría de las dos
//                            imágenes es idéntica. La mesa SE VUELVE la hoja. Sin opacidad de por medio.
// f742→f838   frontera 2→3 : MATCH-MOVE. La cámara sigue su vector y se desliza 68% de cuadro a lo
//                            largo de la mesa: la hoja A sale por izquierda y la hoja B, que YA estaba
//                            apoyada fuera de campo, entra por derecha. Es el mismo plano, la misma
//                            mesa y la misma luz: lo único que cambia es el encuadre.
// f1188 (18)  frontera 3→4 : OCLUSIÓN con `V.paper` — una hoja de la guía cruza y tapa el 100%. Es el
//                            color de LA MATERIA que cruza (el papel), ⛔ nunca el del fondo. Dentro de
//                            la tapada la cámara retrocede de golpe.
// f1620       frontera 4→5 : CORTE EN EL BEAT, en «suscríbete». Corte seco: la cámara NO salta, la luz
//                            NO cambia y el QR queda idéntico; lo único que cambia es la mitad izquierda
//                            del cuadro. Por eso se lee como corte y no como salto.
// (cuatro fronteras, cuatro costuras distintas, ninguna es un fade)
//
// ⛔ EL QR: `img/cmegenerador/cmeg_qr.png`, 470×470 px dentro de un panel de papel claro de 640×640
//    (zona de silencio de 85 px). Vive FUERA de `<Layers>`, así que la cámara NO lo toca: sin parallax,
//    sin rotación, sin deriva, sin nada encima. Entra deslizándose desde fuera de cuadro entre f1326 y
//    f1358 y desde f1358 es LITERALMENTE constante hasta f1860 → 502 frames = 16,7 s quieto.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Em, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EZ = Easing.bezier(0.21, 0.64, 0.24, 1);
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// ── FRAMES MAESTROS ─────────────────────────────────────────────────────────────────────────
const A2 = 360;
const A3 = 780;
const A4 = 1200;
const A5 = 1620;
const SEAM_SHAPE = 336;   // MATCH-SHAPE  (la materia cambia EN SECO acá)
const RAIL_IN = 742;      // MATCH-MOVE   (arranca el deslizamiento por la mesa)
const RAIL_OUT = 838;
const SEAM_OCC = 1188;    // OCLUSIÓN con V.paper
const QR_IN = 1326;       // el QR empieza a entrar
const QR_LOCK = 1358;     // ⛔ desde acá el QR NO se mueve NUNCA MÁS

// ── ASSETS (⛔ literales, sólo los de la ficha) ──────────────────────────────────────────────
const SRC_TOOLS = "img/cmegenerador/cmeg_mv_cier1.png";        // pinza + medidor de enchufe en la mesa
const SRC_CLAUDIO = "img/cmegenerador/cmeg_mv_cier2.png";      // Claudio con la hoja impresa en la mano
const SRC_LAM_60 = "img/cmegenerador/cmeg_lam_60b_medio.png";  // página real: los 60 aparatos
const SRC_LAM_14 = "img/cmegenerador/cmeg_lam_14acciones.png"; // página real: las 14 acciones
const SRC_QR = "img/cmegenerador/cmeg_qr.png";
const IC_PINZA = "img/cmegenerador/cmeg_ic_pinza.png";
const IC_LUPA = "img/cmegenerador/cmeg_ic_lupa.png";
const IC_BILLETE = "img/cmegenerador/cmeg_ic_billete.png";

// ── KEN-BURNS: empuje lento sobre material real (la foto respira como respira un clip) ──────
const KB: React.FC<{ k: number; ox: number; oy: number; children: React.ReactNode }> = ({
  k, ox, oy, children,
}) => (
  <AbsoluteFill style={{
    transform: `scale(${k.toFixed(4)})`, transformOrigin: `${ox}% ${oy}%`, transformStyle: "preserve-3d",
  }}>{children}</AbsoluteFill>
);

// ── EL CHARCO DE LA LÁMPARA DE MESA — la luz que se enciende sobre las hojas ────────────────
const LampPool: React.FC<{ x: number; y: number; power: number; tone: string }> = ({ x, y, power, tone }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{
      background: `radial-gradient(58% 52% at ${x.toFixed(1)}% ${y.toFixed(1)}%, ${rgba(tone, 0.30 * power)} 0%, ${rgba(tone, 0.10 * power)} 42%, rgba(0,0,0,0) 74%)`,
      mixBlendMode: "screen",
    }} />
    <AbsoluteFill style={{
      background: `radial-gradient(22% 18% at ${x.toFixed(1)}% ${(y - 6).toFixed(1)}%, ${rgba(V.torch, 0.16 * power)} 0%, rgba(0,0,0,0) 70%)`,
      mixBlendMode: "screen",
    }} />
  </AbsoluteFill>
);

// ── LA BARRA QUE LEE LA HOJA (estructura gráfica, no un objeto falso) ───────────────────────
const ScanBar: React.FC<{ x: number; w: number; yTop: number; yBot: number; t: number; tone: string }> = ({
  x, w, yTop, yBot, t, tone,
}) => {
  if (t <= 0) return null;
  const y = lerp(yTop, yBot, clamp01(t));
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: y, width: w, height: 46, marginLeft: -w / 2,
      background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(tone, 0.30)} 46%, ${rgba(tone, 0.06)} 100%)`,
      boxShadow: `0 0 26px ${rgba(tone, 0.34)}`, borderTop: `2px solid ${rgba(tone, 0.72)}`,
    }} />
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
export const MovCierre: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: sólo es red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : [0, 0, A2, A3, A4, A5][Math.max(1, Math.min(5, acto || 1))];
  // los helpers del Stage (`Readout`, `SeamOcclude`, `sheenAt`) miden con useCurrentFrame:
  // `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, jamás vuelve a 0 ─────────────────────────────────
  const base = gcam(g, { z0: -40, z1: 150, panX: -96, panY: -54, ry: 4.4, rx: -1.8, dur: 1700 });
  const KF = [0, 150, 330, 402, 640, RAIL_IN, RAIL_OUT, 1050, 1194, 1200, 1330, 1470, A5, 1860];
  const kz = interpolate(g, KF, [0, 22, 62, -34, -6, 18, 24, 76, 132, -84, -22, 4, 16, 30], { easing: EZ, ...CLAMP });
  const kx = interpolate(g, KF, [0, -6, -18, 22, 12, 2, -10, -26, -34, 30, 12, 2, -4, -10], { easing: EZ, ...CLAMP });
  const ky = interpolate(g, KF, [0, -5, -16, 6, 16, 22, 20, 6, -2, -14, -4, 2, 6, 10], { easing: EZ, ...CLAMP });
  const kry = interpolate(g, KF, [0, 0.4, 1.2, -0.8, -0.3, 0.3, 1.1, 1.5, 1.7, -0.5, 0.1, 0.4, 0.6, 0.8], { easing: EZ, ...CLAMP });
  const krx = interpolate(g, KF, [0, -0.2, -0.6, 0.5, 0.8, 0.9, 0.7, 0.3, 0.05, -0.4, -0.15, 0.1, 0.25, 0.35], { easing: EZ, ...CLAMP });
  const camZ = base.z + kz;
  const camK =
    "translateZ(" + kz.toFixed(2) + "px) translate3d(" + kx.toFixed(2) + "px, " + ky.toFixed(2) + "px, 0) " +
    "rotateY(" + kry.toFixed(3) + "deg) rotateX(" + krx.toFixed(3) + "deg)";
  // el plano de tipografía compensa el empuje: el titular nunca se sale de la safe area de 60 px
  const zText = -camZ * 0.94;

  // ── LA LUZ QUE EVOLUCIONA (una sola rampa continua: patio ámbar → lámpara de mesa) ───────
  const keyCol = light(seg(g, 210, 1240), "amber", "torch");
  const key2 = light(seg(g, 480, 1500), "amber", "paper");
  const keyFrom = interpolate(g, [0, A2, A3, A4, 1860], [0.80, 0.63, 0.54, 0.46, 0.44], CLAMP);
  const inten = interpolate(g, [0, 200, 700, 1200, 1500, 1860], [0.58, 0.72, 0.92, 1.16, 1.28, 1.24], CLAMP);
  const flr = interpolate(g, [0, 700, 1200, 1860], [0.66, 0.54, 0.42, 0.38], CLAMP);
  const lampPow = interpolate(g, [0, 200, 620, 1050, 1330, 1860], [0.10, 0.28, 0.60, 0.86, 1.0, 1.0], CLAMP);
  const lampX = interpolate(g, [0, A2, A3, A4, A5, 1860], [50, 40, 38, 44, 42, 42], CLAMP);
  const lampY = interpolate(g, [0, A2, A4, 1860], [56, 50, 46, 46], CLAMP);
  const bgDim = interpolate(g, [0, 400, 1200, 1860], [0.80, 0.74, 0.70, 0.72], CLAMP);

  // ── EL RIEL DE LA MESA (la MATCH-MOVE del acto 2 al 3) ──────────────────────────────────
  const shift = -68 * ez(g, RAIL_IN, RAIL_OUT);

  // ═══ ACTO 1 → ACTO 2 · el MISMO rectángulo: la mesa se deforma en la hoja (MATCH-SHAPE) ══
  const rW = interpolate(g, [330, 402], [1180, 700], CLAMP);
  const rH = interpolate(g, [330, 402], [520, 930], CLAMP);
  const rXb = interpolate(g, [330, 402], [50, 36], CLAMP);
  const rY = interpolate(g, [6, 56, 330, 402], [12, 46, 46, 50], { easing: EZ, ...CLAMP });
  const rRot = interpolate(g, [330, 402], [-1.4, 2.0], CLAMP);
  const rRy = interpolate(g, [330, 402], [0, -12], CLAMP);
  const rZ = interpolate(g, [330, 402], [10, -60], CLAMP);
  const esMesa = g < SEAM_SHAPE;                       // ⛔ el cambio de materia es EN SECO acá
  const hojaViva = g >= SEAM_SHAPE && g < 866;

  // ═══ ACTO 3 · la hoja de las 14 acciones, que después cruza la oclusión ══════════════════
  const bX = 104 + shift;                               // 104% (fuera de campo) → 36%
  const scanT = seg(g, 880, 1140);

  // ═══ ACTO 4 · Claudio con la hoja, la reseña de Óscar, el QR entrando ════════════════════
  const clW = interpolate(g, [1194, 1268, 1322], [1080, 1080, 760], { easing: EZ, ...CLAMP });
  const clH = interpolate(g, [1194, 1268, 1322], [620, 620, 436], { easing: EZ, ...CLAMP });
  const clX = interpolate(g, [1194, 1268, 1322], [40, 40, -18], { easing: EZ, ...CLAMP });
  const clY = interpolate(g, [1194, 1268, 1322], [48, 48, 56], { easing: EZ, ...CLAMP });
  const hojaW = interpolate(g, [1262, 1336], [300, 500], { easing: EZ, ...CLAMP });
  const hojaH = interpolate(g, [1262, 1336], [380, 620], { easing: EZ, ...CLAMP });
  const hojaX = interpolate(g, [1262, 1336], [41, 38], { easing: EZ, ...CLAMP });
  const hojaY = interpolate(g, [1262, 1336], [47, 42], { easing: EZ, ...CLAMP });

  // ═══ EL QR ══════════════════════════════════════════════════════════════════════════════
  // 640×640 de papel claro con el QR de 470×470 centrado (zona de silencio de 85 px).
  // Desde QR_LOCK el valor es CONSTANTE: ni deriva, ni escala, ni rotación, ni opacidad.
  const qrCx = g >= QR_LOCK ? 1370 : lerp(2110, 1370, ez(g, QR_IN, QR_LOCK));
  const qrCy = 520;
  const qrPanel = 640;
  const qrSize = 470;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ─────────────────── */}
      <VoltAtmos tint={keyCol} tint2={key2} keyFrom={keyFrom} intensity={inten} floor={flr} />
      <LampPool x={lampX} y={lampY} power={lampPow} tone={key2} />

      <Layers cam={base.transform + " " + camK}>
        {/* PLANO 1 · z −760 — el taller detrás, en penumbra: la cama de foto de todo el movimiento */}
        <Plane z={-760}>
          <PhotoPlane src={SRC_CLAUDIO} kind="photo" z={0} scale={1.3} dim={bgDim} tint={keyCol} />
        </Plane>

        {/* PLANO 2 · z −430 — LA LOSA VACÍA que deja MovCuenta, y que se vuelve la mesa de trabajo */}
        <Plane z={-430}>
          <PadPlane
            y={interpolate(g, [0, A2, A4], [72, 78, 86], CLAMP)}
            w={1420} h={320}
            rx={interpolate(g, [0, A3, 1860], [62, 66, 70], CLAMP)}
            lit={interpolate(g, [0, 300, 900, 1860], [1, 0.86, 0.6, 0.44], CLAMP)}
            z={0}
          />
        </Plane>

        {/* PLANO 3 · z −150 — EL CICLO, la firma del video: ocho celdas de cada treinta */}
        {g >= 150 && g < SEAM_SHAPE && (
          <Plane z={-150}>
            <DutyField duty={8 / 30} cells={30} on={0.34 * ez(g, 150, 190)} tint={V.volt}
              y={71} w={1240} h={26} cycle={140} />
          </Plane>
        )}

        {/* ═══════════ PLANO 4 · z 0 — EL MATERIAL REAL: el protagonista de cada acto ═══════ */}
        <Plane z={0}>
          {/* ACTO 1 → ACTO 2 · EL MISMO RECTÁNGULO: la mesa con las herramientas SE VUELVE la hoja */}
          {g < 866 && (
            <KB k={1 + 0.05 * seg(g, 0, 330)} ox={48} oy={52}>
              <MediaCard
                src={esMesa ? SRC_TOOLS : SRC_LAM_60}
                kind="photo"
                w={rW} h={rH} x={rXb + (esMesa ? 0 : shift)} y={rY} z={rZ}
                ry={rRy} rot={rRot} radius={esMesa ? 16 : 6}
                lit={interpolate(g, [0, 300, 480, 800], [0.72, 1, 1, 0.86], CLAMP)}
                litColor={esMesa ? V.amber : V.torch}
                sheenAt={at(esMesa ? 34 : 430)}
                grade={esMesa}
              />
            </KB>
          )}

          {/* ACTO 2 → ACTO 3 · la SEGUNDA hoja, que ya estaba apoyada en la mesa fuera de campo */}
          {g >= RAIL_IN - 30 && g < 1194 && (
            <MediaCard
              src={SRC_LAM_14} kind="photo"
              w={620} h={860} x={bX} y={50} z={90}
              ry={2} rx={6} rot={-1.1} radius={6}
              lit={interpolate(g, [RAIL_IN, 900, 1188], [0.8, 1, 1], CLAMP)}
              litColor={V.torch} sheenAt={at(870)} grade={false}
            />
          )}

          {/* ACTO 4 · la oclusión de papel abre sobre Claudio golpeando la hoja impresa */}
          {g >= 1194 && g < 1330 && (
            <KB k={1 + 0.07 * seg(g, 1194, 1330)} ox={44} oy={48}>
              <MediaCard
                src={SRC_CLAUDIO} kind="photo"
                w={clW} h={clH} x={clX} y={clY} z={-30}
                ry={2.4} rot={-0.6} radius={14}
                lit={1} litColor={V.torch} sheenAt={at(1214)}
              />
            </KB>
          )}

          {/* ACTO 4 · LA HOJA DE LAS 14 ACCIONES otra vez — la misma materia que cruzó la oclusión,
              ahora apoyada en la mesa: es la hoja SOBRE la que se apoya la reseña de Óscar */}
          {g >= 1262 && g < A5 && (
            <MediaCard
              src={SRC_LAM_14} kind="photo"
              w={hojaW} h={hojaH} x={hojaX} y={hojaY} z={40}
              ry={-5} rx={10} rot={2.6} radius={6}
              lit={1} litColor={V.torch} sheenAt={at(1352)} grade={false}
            />
          )}

          {/* ACTO 5 · CORTE EN SECO: la guía, de pie, detrás del QR */}
          {g >= A5 && (
            <MediaCard
              src={SRC_LAM_14} kind="photo"
              w={460} h={620} x={25} y={44} z={20}
              ry={7} rx={1} rot={-1.6} radius={6}
              lit={1} litColor={V.torch} sheenAt={at(1664)} grade={false}
            />
          )}
        </Plane>

        {/* ═══════════ PLANO 5 · z +150 — objetos sueltos y estructura gráfica ══════════════ */}
        <Plane z={150}>
          {g >= 40 && g < 330 && (
            <IconPng src={IC_PINZA} x={22} y={70} size={104} z={0}
              opacity={0.9 * ez(g, 40, 74)} rot={-9} glow={V.ink0} />
          )}
          {g >= A2 + 40 && g < RAIL_IN + 40 && (
            <IconPng src={IC_LUPA} x={44 + shift} y={30} size={112} z={0}
              opacity={0.94 * ez(g, A2 + 40, A2 + 78)} rot={11} glow={V.ink0} />
          )}
          {g >= 900 && g < 1188 && (
            <IconPng src={IC_BILLETE} x={30} y={76} size={116} z={0}
              opacity={0.94 * ez(g, 900, 940)} rot={-7} glow={V.ink0} />
          )}
          {/* la barra que LEE la hoja de las 14 acciones (estructura, no objeto falso) */}
          {g >= 880 && g < 1180 && (
            <ScanBar x={36} w={600} yTop={190} yBot={880} t={scanT} tone={V.torch} />
          )}
        </Plane>

        {/* ═══════════ PLANO 6 · z +330 — primer plano fuera de foco: el polvo del taller ═══ */}
        <Plane z={330}>
          {Array.from({ length: 8 }, (_, i) => {
            const sp = 0.18 + rnd(i * 4.7) * 0.5;
            const yy = (((rnd(i * 2.9) * 130 - (g * sp) / 12) % 130) + 130) % 130 - 12;
            const s = 26 + rnd(i * 8.3) * 52;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 6.1) * 108 - 4).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: `radial-gradient(circle, ${rgba(key2, 0.16)}, rgba(0,0,0,0) 68%)`,
                filter: "blur(9px)",
              }} />
            );
          })}
        </Plane>

        {/* ═══════════ PLANO DE TIPOGRAFÍA (compensa el empuje: safe area 60 px garantizada) ═ */}
        <Plane z={zText}>
          {/* ACTO 1 · las dos herramientas y lo que cuestan */}
          {g < 344 && (
            <>
              <Readout value="$30" label="LA PINZA" at={at(30)} x={27} y={16} size={104} color={V.volt} />
              <Readout value="$20" label="EL MEDIDOR DE ENCHUFE" at={at(86)} x={71} y={16} size={104} color={V.amber} />
              <div style={{ position: "absolute", left: 70, top: 794, width: 880, opacity: ez(g, 8, 40) }}>
                <Bed w={860}>
                  <Kick color={V.amber}>LAS DOS HERRAMIENTAS</Kick>
                  <div style={{ height: 10 }} />
                  <Head size={78}>TREINTA Y VEINTE DÓLARES</Head>
                  {g >= 150 && (
                    <div style={{ marginTop: 12, opacity: ez(g, 150, 186) }}>
                      <Body>En una tarde tienes <Em>los tres números de tu casa</Em> escritos en un papel.</Body>
                    </div>
                  )}
                </Bed>
              </div>
            </>
          )}

          {/* ACTO 2 · la hoja de los sesenta aparatos */}
          {hojaViva && (
            <div style={{
              position: "absolute", left: `${58 + shift}%`, top: 306, width: 700,
              opacity: ez(g, SEAM_SHAPE, 386),
            }}>
              <Bed w={680}>
                <Kick color={V.torch}>LA GUÍA DEL CANAL</Kick>
                <div style={{ height: 10 }} />
                <Head size={76}>SESENTA APARATOS MEDIDOS</Head>
                <div style={{ marginTop: 14 }}>
                  <Body>Uno por uno, con su pico y su promedio.</Body>
                  <div style={{ height: 6 }} />
                  <Body size={30}>Más la tabla de cable y fusible, y las <Em color={V.amber}>siete conexiones</Em> que no se hacen nunca.</Body>
                </div>
              </Bed>
            </div>
          )}

          {/* ACTO 3 · las catorce acciones, once gratis */}
          {g >= RAIL_IN && g < 1188 && (
            <>
              <div style={{
                position: "absolute", left: `${126 + shift}%`, top: 262, width: 700,
                opacity: ez(g, RAIL_IN, RAIL_OUT),
              }}>
                <Bed w={680}>
                  <Kick color={V.amber}>LA HOJA QUE MÁS ME PIDEN</Kick>
                  <div style={{ height: 10 }} />
                  <Head size={74}>CATORCE COSAS, ONCE GRATIS</Head>
                  <div style={{ marginTop: 14 }}>
                    <Body>Ordenadas por lo que te devuelven cada mes. <Em color={V.amber}>Once no cuestan nada.</Em></Body>
                  </div>
                </Bed>
              </div>
              {/* la tira del ciclo, releída como las catorce filas: once encendidas en ámbar */}
              <div style={{ position: "absolute", left: `${126 + shift}%`, top: 0, width: 700, height: "100%" }}>
                <DutyField duty={11 / 14} cells={14} on={ez(g, 860, 910)} tint={V.amber}
                  y={62} w={640} h={34} cycle={120} />
              </div>
            </>
          )}

          {/* ACTO 4 · Óscar */}
          {g >= 1204 && g < A5 && (
            <>
              {g >= 1246 && (
                <Readout value="−$41" label="EL PRIMER MES" at={at(1252)} x={17} y={32} size={112} color={V.amber} />
              )}
              <div style={{ position: "absolute", left: 70, top: 780, width: 900, opacity: ez(g, 1204, 1240) }}>
                <Bed w={880}>
                  <Kick color={V.amber}>LA RESEÑA QUE MÁS ME GUSTA</Kick>
                  <div style={{ height: 10 }} />
                  <Head size={76}>ÓSCAR, CINCUENTA Y DOS</Head>
                  <div style={{ marginTop: 12 }}>
                    <Body>Hizo <Em>cuatro</Em> de las catorce. Nada más.</Body>
                  </div>
                </Bed>
              </div>
              {/* el beat de «suscríbete», justo antes del corte */}
              {g >= 1566 && (
                <div style={{
                  position: "absolute", left: 70, top: 690, opacity: ez(g, 1566, 1596),
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 54, letterSpacing: 5,
                  color: V.volt, textShadow: `0 0 34px ${rgba(V.volt, 0.4)}, 0 6px 26px rgba(0,0,0,0.92)`,
                }}>SUSCRÍBETE</div>
              )}
            </>
          )}

          {/* ACTO 5 · el cierre */}
          {g >= A5 && (
            <div style={{ position: "absolute", left: 70, top: 806, width: 900, opacity: ez(g, A5, A5 + 26) }}>
              <Bed w={880}>
                <Kick color={V.torch}>CLAUDIO MENDOZA CONSTRUCTOR</Kick>
                <div style={{ height: 10 }} />
                <Head size={76}>NOS VEMOS EN EL PRÓXIMO</Head>
                <div style={{ marginTop: 12 }}>
                  <Body size={30}>El que viene lo grabo con <Em>el medidor puesto</Em>, un apagón entero de punta a punta.</Body>
                </div>
              </Bed>
            </div>
          )}
        </Plane>
      </Layers>

      {/* ── COSTURA 3→4 · OCLUSIÓN con el color de LA MATERIA que cruza: EL PAPEL ─────────── */}
      <SeamOcclude at={at(SEAM_OCC)} dur={18} color={V.paper} angle={-6} />

      {/* ══════════════════════════════════════════════════════════════════════════════════
          EL QR — fuera de <Layers>: la cámara NO lo toca. Sin parallax, sin rotación, sin
          deriva y sin nada encima. Desde f1358 los valores son CONSTANTES hasta f1860.
          ══════════════════════════════════════════════════════════════════════════════════ */}
      {g >= QR_IN && (
        <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
          {/* el panel de papel claro: la zona de silencio de 85 px alrededor del código */}
          <div style={{
            position: "absolute",
            left: qrCx - qrPanel / 2, top: qrCy - qrPanel / 2,
            width: qrPanel, height: qrPanel, borderRadius: 10,
            background: "linear-gradient(168deg, #FEFDF9 0%, #F7F4EA 62%, #EFEADC 100%)",
            boxShadow: "0 26px 60px rgba(0,0,0,0.72), 0 6px 18px rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Img src={staticFile(SRC_QR)} style={{ width: qrSize, height: qrSize, display: "block" }} />
          </div>
          {/* rótulo DEBAJO del panel — ⛔ nada encima del código, y ⛔ ninguna URL */}
          <div style={{
            position: "absolute", left: qrCx - 340, top: qrCy + qrPanel / 2 + 26, width: 680,
            textAlign: "center", fontFamily: F_BODY, fontWeight: 700, fontSize: 30, letterSpacing: 2.4,
            color: V.bone, textTransform: "uppercase", textShadow: "0 4px 18px rgba(0,0,0,0.9)",
          }}>Enlace también en la descripción</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
