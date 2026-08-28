// MovTresContra.tsx — S1 · UN MOVIMIENTO CONTINUO de 46 s (1380 frames @30fps · 48,0 s → 94,0 s)
// «Las tres cifras de la tapa se enfrentan a las tres de la pinza. Nace el PromiseGap.»
//
// Hereda de `MovCaja` el MACRO DE LA ETIQUETA PLATEADA llenando el cuadro, en luz `white` dura, con la
// cámara YA empujando hacia adentro del panel — y entrega a `MovEscudo` LAS TRES BARRAS suspendidas en
// el aire, cámara girada 12° a la derecha, la luz ya cayendo al `volt`.
// UNA sola `VoltAtmos` montada arriba de todo (jamás se remonta), UNA sola `gcam(g, …)` sobre el frame
// GLOBAL (el acto 3 hereda posición, zoom e inercia del 2), la luz EVOLUCIONA con `light()` y hay una
// MATERIA que cruza cada frontera y se transforma en lo siguiente.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈+215 (heredada de MovCaja, ya empujando), pan 0, ry 0 · luz `white` dura,
//                       key arriba-izquierda (keyFrom .20) · materia: LA ETIQUETA PLATEADA EN MACRO,
//                       a sangre, con el «100 W» impreso.
//                EXIT   cám z≈+80 (retrocedió tras la oclusión de plata), panY −40, ry≈+3 · luz `white`,
//                       contra ya NARANJA TEMU (lo que promete) · materia: LA COLUMNA VERDE DEL
//                       PromiseGap 100/89, consolidada en una sola barra.
//
// acto 2 · f359  ENTER  cám z≈+95 heredada, panX empezando a +70, ry≈+4 · misma luz `white`/naranja ·
//                       materia: LA BARRA VERDE ACOSTADA = EL BORDE SUPERIOR DE LA ESTACIÓN, de donde
//                       la estación se desenrolla hacia abajo.
//                EXIT   cám z≈+240 y subiendo (entra en el enchufe), panX +70 → −50, ry≈+8 · luz
//                       `white` con el volt asomando · materia: EL ENCHUFE DE LA ESTACIÓN (63 %/57 %),
//                       por donde la cámara ATRAVIESA.
//
// acto 3 · f718  ENTER  cám z≈+350 (sale del portal, escala 2,2 → 1), panY +60, ry≈+9 · luz `white` con
//                       el volt entrando por el display · materia: EL RENGLÓN CHIQUITO DE LA CAJA, que
//                       es lo que había del otro lado del enchufe.
//                EXIT   cám z≈+245 asentada, empezando a retroceder · luz `white`→`volt` a mitad de
//                       camino · materia: EL PromiseGap 3000/340, que NO se corta: encoge y viaja.
//
// acto 4 · f1076 ENTER  cám z≈+200 retrocediendo a plano general (−140), panX +150, ry→12° · luz `volt`
//                       ganando, key ya a la derecha (keyFrom .66) · materia: EL PromiseGap 3000/340
//                       hecho miniatura, sobre el hormigón del garaje revelado por la escala.
//                EXIT   cám z≈−140, ry 12° exactos, deriva viva · luz `volt` baja (intensity .90 → .78)
//                       · materia: LAS TRES BARRAS ALEJÁNDOSE (translateZ −200)  → así arranca
//                       `MovEscudo`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f156  INTERNA acto 1 : OCLUSIÓN con `V.silver` (la propia etiqueta plateada pasa pegada al lente).
//                        Bajo la cobertura total (f163) el macro a sangre se vuelve el plano-producto
//                        de 1180×680: cambio de ESCALA sin un solo frame de fundido.
// f330  frontera 1→2   : MORFO. Los listones verdes del PromiseGap se consolidan en UNA barra (760×267)
//                        que SE ACUESTA (1320×12) y aterriza en el 22 % del cuadro; de esa barra se
//                        desenrolla hacia abajo la estación de energía (h 8 → 700), que tapa el plano
//                        del acto 1 por geometría, no por opacidad.
// f700  frontera 2→3   : PORTAL / `zoomThrough` (dur 22, fx 63 / fy 57 = el enchufe de la estación).
//                        La cámara entra en el enchufe; del otro lado ya está el macro del renglón
//                        chiquito, saliendo a escala 2,2 → 1. Chispa `SeamFlash` volt de 5 frames.
// f1064 frontera 3→4   : ESCALA. El macro a sangre (2280×1300) encoge a tarjeta de 420×250 y viaja al
//                        77 %/57 %; al encoger DESTAPA el hormigón del garaje que ya estaba montado
//                        detrás desde f980. Su PromiseGap encoge con él y se pone en fila con los otros
//                        dos, que entran DESLIZÁNDOSE desde fuera de cuadro (nunca por opacidad).
// (OCLUSIÓN · MORFO · PORTAL · ESCALA — cuatro distintas, ninguna repetida, ninguna es un fade)
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, PhotoPlane,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros
const SEAM_OCC = 156;    // costura interna del acto 1 (oclusión de plata)
const GAP1_IN = 176;
const SEAM_MORFO = 330;  // frontera 1→2
const F_A2 = 359;
const GAP2_IN = 430;
const SEAM_PORTAL = 700; // frontera 2→3
const F_A3 = 718;
const GAP3_IN = 806;
const HERO_IN = 826;
const SEAM_ESCALA = 1064; // frontera 3→4
const F_A4 = 1076;

// ── EL HAZ DEL PORTÓN — la fuente dura del mediodía, nunca se va del cuadro ──────────────────
const Vano: React.FC<{ x: number; y: number; ang: number; power: number; color: string }> = ({
  x, y, ang, power, color,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 1860, height: 900, marginTop: -450, transformOrigin: "0% 50%",
      transform: `rotate(${ang.toFixed(2)}deg)`,
      background: `linear-gradient(90deg, ${rgba(color, 0.26 * power)} 0%, ${rgba(color, 0.11 * power)} 38%, rgba(0,0,0,0) 80%)`,
      clipPath: "polygon(0% 44%, 100% 0%, 100% 100%, 0% 56%)",
      mixBlendMode: "screen",
    }} />
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 520, height: 520, marginLeft: -260, marginTop: -260, borderRadius: "50%",
      background: `radial-gradient(circle, ${rgba(color, 0.46 * power)} 0%, ${rgba(color, 0.13 * power)} 36%, rgba(0,0,0,0) 72%)`,
      mixBlendMode: "screen",
    }} />
  </AbsoluteFill>
);

// ── TITULAR (una idea de texto por acto, sobre cama oscura) ──────────────────────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 70, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 24)) * 28;
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
export const MovTresContra: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 4) - 1) * 345);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamFlash`, `sheenAt`, el `grow` del PromiseGap)
  // miden con useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: 215, z1: 250, panX: -60, panY: 40, ry: 12, rx: -1.6, dur: 1330 });
  const zAcc =
    eio(0, -150, seg(g, 150, 262)) +            // retrocede tras la oclusión de plata (macro → producto)
    eio(0, 90, seg(g, 344, 438)) +              // el morfo empuja hacia la estación
    eio(0, 190, seg(g, SEAM_PORTAL, 792)) +     // el PORTAL: la cámara ENTRA en el enchufe
    eio(0, -130, seg(g, 800, 940)) +            // y frena adentro del renglón chiquito
    eio(0, -300, seg(g, SEAM_ESCALA, 1230)) +   // la ESCALA: se va a plano general
    eio(0, -90, seg(g, 1290, 1378));            // y sigue alejándose (handoff a MovEscudo)
  const pxAcc =
    eio(0, 70, seg(g, 344, 470)) + eio(0, -120, seg(g, SEAM_PORTAL, 820)) +
    eio(0, 150, seg(g, SEAM_ESCALA, 1240));
  const pyAcc =
    eio(0, -40, seg(g, 150, 300)) + eio(0, 60, seg(g, SEAM_PORTAL, 830)) +
    eio(0, -70, seg(g, SEAM_ESCALA, 1250));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta. white (mediodía duro) → volt (lo medido) ─────────────────
  const cKey = light(seg(g, 620, 1310), "white", "volt");
  const cContra = light(seg(g, 40, 560), "amber", "orange"); // lo que PROMETE entra en naranja Temu
  const keyFrom = 0.20 + eio(0, 0.30, seg(g, 0, 380)) + eio(0, 0.16, seg(g, 900, 1300));
  const intensity =
    0.52 + eio(0, 0.40, seg(g, 0, 14))          // rampa de entrada del ambiente: 14 frames
    + eio(0, -0.12, seg(g, 660, 900))
    + eio(0, 0.10, seg(g, 1080, 1300))
    + eio(0, -0.12, seg(g, 1300, 1378));

  // el haz del portón: barre de izquierda a derecha con la cámara y se acuesta al final
  const flick = 0.96 + 0.04 * rnd(Math.floor(g / 5) * 1.7) + Math.sin(g / 17) * 0.015;
  const vanoX = 4 + eio(0, 16, seg(g, 20, 320)) + eio(0, 10, seg(g, 720, 1080)) + eio(0, 8, seg(g, 1120, 1360));
  const vanoY = 16 + eio(0, 14, seg(g, 20, 300)) + eio(0, -8, seg(g, SEAM_PORTAL, 840)) + eio(0, 26, seg(g, 1080, 1340));
  const vanoA = 24 + eio(0, -14, seg(g, 20, 320)) + eio(0, 18, seg(g, 1080, 1350));
  const vanoP = (0.46 + eio(0, 0.40, seg(g, 0, 90)) + eio(0, -0.16, seg(g, 640, 900))
    + eio(0, 0.14, seg(g, 1080, 1260)) + eio(0, -0.26, seg(g, 1300, 1378))) * flick;

  // ── ACTO 1 · la etiqueta plateada: macro a sangre → plano producto ────────────────────────
  const k1 = clamp01((g - 160) / 7);                       // el cambio ocurre BAJO la cobertura total
  const etiqW = Math.round(lerp(2240, 1180, k1));
  const etiqH = Math.round(lerp(1260, 680, k1));
  const etiqY = lerp(48, 54, k1);
  const etiqR = Math.round(lerp(0, 16, k1));
  const a1On = g < F_A2 + 75;

  // ── FRONTERA 1→2 · MORFO: la barra verde se acuesta y se vuelve el borde de la estación ───
  const mK = ez(g, SEAM_MORFO, 396);
  const mbW = Math.round(lerp(760, 1320, mK));
  const mbH = Math.round(lerp(267, 12, mK));
  const mbX = lerp(50, 50, mK);
  const mbY = lerp(55.5, 22.4, mK);
  const mbRot = lerp(1.6, 0, mK);
  const mbA = ez(g, 320, 334) * (1 - 0.7 * ez(g, 470, 570)) * (1 - ez(g, 690, 712));

  // ── ACTO 2 · la estación se DESENROLLA desde esa barra ────────────────────────────────────
  const unroll = ez(g, 348, 424);
  const estH = Math.round(lerp(8, 700, unroll));
  const estY = 22 + (estH / 2 / 1080) * 100;
  const estR = Math.round(lerp(0, 16, ez(g, 392, 444)));
  const a2On = g >= SEAM_MORFO + 14 && g < F_A3 + 24;
  const zt = zoomThrough(g, SEAM_PORTAL, 22, 63, 57);      // el PORTAL por el enchufe

  // ── ACTO 3 · el renglón chiquito de la caja; y su ESCALA hacia la fila de tres ─────────────
  const s3 = ez(g, 702, 784);                              // sale del portal: escala 2,2 → 1
  const k4 = ez(g, SEAM_ESCALA, 1200);                     // la ESCALA de la frontera 3→4
  const cajW = Math.round(lerp(2280, 420, k4));
  const cajH = Math.round(lerp(1300, 250, k4));
  const cajX = lerp(50, 77, k4);
  const cajY = lerp(50, 57, k4);
  const cajR = Math.round(lerp(0, 14, k4));
  const heroX = 122 + eio(0, -42, seg(g, HERO_IN, 902)) + eio(0, 44, seg(g, 1046, 1106));

  // ── ACTO 4 · las tres juntas sobre el hormigón; entran DESLIZÁNDOSE, jamás por opacidad ───
  const c1X = lerp(-24, 17, ez(g, 1118, 1216));
  const c2Y = lerp(126, 57, ez(g, 1140, 1246));
  const gapZBack = eio(0, -200, seg(g, 1290, 1378));       // «las tres barras alejándose»

  // ── LOS TRES CAMPOS FIRMA (una sola instancia por cifra: la del inversor CRUZA la frontera) ─
  const onPanel = g < 1100 ? ez(g, GAP1_IN + 4, GAP1_IN + 26) * (1 - ez(g, 322, 352)) : 1;
  const g1W = g < 1100 ? 760 : 280;
  const g1H = g < 1100 ? 300 : 170;
  const g1X = g < 1100 ? 50 : lerp(-24, 17, ez(g, 1118, 1216));
  const g1Y = g < 1100 ? 54 : 27;
  const onEst = g < 1100 ? ez(g, GAP2_IN + 4, GAP2_IN + 26) * (1 - ez(g, 682, 708)) : 1;
  const g2W = g < 1100 ? 820 : 280;
  const g2H = g < 1100 ? 300 : 170;
  const g2X = g < 1100 ? 47 : 47;
  const g2Y = g < 1100 ? 56 : lerp(126, 27, ez(g, 1140, 1246));
  // el del inversor NO se corta: encoge y viaja — es la materia de la frontera 3→4
  const g3W = Math.round(lerp(900, 280, k4));
  const g3H = Math.round(lerp(320, 170, k4));
  const g3X = lerp(50, 77, k4);
  const g3Y = lerp(52, 27, k4);

  const gapWrap: React.CSSProperties = {
    position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
    transform: `translateZ(${gapZBack.toFixed(1)}px)`, transformStyle: "preserve-3d",
  };
  const gap2Wrap: React.CSSProperties = g < F_A3 + 24
    ? { position: "absolute", left: 0, top: 0, right: 0, bottom: 0, transform: zt.out, transformOrigin: "63% 57%", opacity: clamp01(zt.opacity) }
    : gapWrap;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cContra} keyFrom={keyFrom} intensity={intensity} floor={0.5} />

      <Layers cam={cam}>
        {/* P1 · el hormigón del garaje con el portón al patio: la CAMA DE FOTO de todo el movimiento */}
        <PhotoPlane
          src="img/cmetemu/cmet_mv_tres4.jpg"
          kind="photo" z={-640}
          scale={lerp(1.40, 1.06, ez(g, 40, 1300))}
          dim={lerp(0.86, 0.44, ez(g, SEAM_ESCALA, 1240))}
          tint={cKey}
        />

        {/* P2 · el haz del portón + la losa de hormigón sobre la que aterriza todo */}
        <Plane z={-430}>
          <Vano x={vanoX} y={vanoY} ang={vanoA} power={clamp01(vanoP)} color={cKey} />
          <PadPlane y={78} w={1520} h={330} rx={62} lit={0.35 + 0.65 * ez(g, SEAM_ESCALA, 1250)} z={-40} />
        </Plane>

        {/* P3-P4 · EL MATERIAL REAL — las tarjetas protagonistas ── */}
        <Plane z={0}>
          {/* ACTO 4 · el hormigón del garaje EN CLIP, montado ANTES (f980) y tapado al 100 % por el
              macro del acto 3. La ESCALA lo DESTAPA: revelado por geometría, cero opacidad. */}
          {g >= 980 && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_tres4.mp4" kind="video"
              w={2160} h={1215} x={50} y={50} z={-40} radius={0}
              startFrom={6} lit={0.58 + 0.38 * ez(g, SEAM_ESCALA, 1240)} litColor={cKey}
              sheenAt={at(1214)}
            />
          )}

          {/* ACTO 1 — LA ETIQUETA PLATEADA. Macro a sangre heredado de MovCaja; bajo la oclusión de
              plata (f163) pasa a plano producto sin un solo frame de fundido. */}
          {a1On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_tres1.mp4" kind="video"
              w={etiqW} h={etiqH} x={50} y={etiqY} z={40}
              ry={lerp(-4, 0.6, ez(g, 0, 300))} rx={lerp(1.6, 0, ez(g, 0, 240))}
              radius={etiqR} startFrom={5}
              lit={0.86 + 0.14 * ez(g, 20, 140)} litColor={cKey}
              label={k1 > 0.9 ? "DORSO DEL PANEL · PLACA DE DATOS" : undefined}
              sheenAt={at(212)}
            />
          )}

          {/* ACTO 2 — LA ESTACIÓN se DESENROLLA desde la barra verde acostada (h 8 → 700) y tapa el
              plano del acto 1 por geometría. Sale por el PORTAL del enchufe. */}
          {a2On && (
            <AbsoluteFill style={{ transform: zt.out, transformOrigin: "63% 57%", opacity: clamp01(zt.opacity) }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_tres2.mp4" kind="video"
                w={1320} h={estH} x={50} y={estY} z={90}
                ry={lerp(0, 5.5, ez(g, 430, 690))} radius={estR} startFrom={9}
                lit={0.9} litColor={cKey}
                label={unroll > 0.85 ? "ESTACIÓN PORTÁTIL · 600 Wh EN LA TAPA" : undefined}
                sheenAt={at(452)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 3 — EL RENGLÓN CHIQUITO, del otro lado del enchufe. Sale a escala 2,2 → 1 y en la
              frontera 3→4 ENCOGE hasta ser la tercera tarjeta de la fila. */}
          {g >= SEAM_PORTAL + 2 && (
            <AbsoluteFill style={{
              transform: `scale(${lerp(2.2, 1, s3).toFixed(3)})`, transformOrigin: "63% 57%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_tres3.mp4" kind="video"
                w={cajW} h={cajH} x={cajX} y={cajY} z={60}
                ry={lerp(-3, 4, ez(g, 760, 1040))} radius={cajR} startFrom={7}
                lit={0.92} litColor={light(seg(g, 780, 1200), "white", "volt")}
                label={k4 > 0.62 ? "EL INVERSOR" : undefined}
                sheenAt={at(772)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 3 — Claudio con la etiqueta en la mano (f812 de la locución). Entra y sale
              DESLIZÁNDOSE desde fuera de cuadro, nunca por opacidad. */}
          {g >= HERO_IN && g < F_A4 + 36 && (
            <MediaCard
              src="img/cmetemu/cmet_h05.jpg" kind="photo"
              w={380} h={214} x={heroX} y={20} z={70}
              ry={-7} rot={-1.2} radius={12} lit={0.94} litColor={cKey}
              label="LA ETIQUETA EN LA MANO" sheenAt={at(880)}
            />
          )}

          {/* ACTO 4 — las otras dos tarjetas de la fila: entran deslizándose (izquierda y abajo) */}
          {g >= F_A4 + 36 && (
            <MediaCard
              src="img/cmetemu/cmet_mv_tres1.jpg" kind="photo"
              w={420} h={250} x={c1X} y={57} z={30}
              ry={6} radius={14} lit={0.88} litColor={cKey}
              label="EL PANEL" sheenAt={at(1232)}
            />
          )}
          {g >= F_A4 + 58 && (
            <MediaCard
              src="img/cmetemu/cmet_mv_tres2.jpg" kind="photo"
              w={420} h={250} x={47} y={c2Y} z={30}
              ry={0.5} radius={14} lit={0.9} litColor={cKey}
              label="LA ESTACIÓN" sheenAt={at(1262)}
            />
          )}
        </Plane>

        {/* P5 · EL GRÁFICO: los tres PromiseGap, la barra del morfo y la cifra de la tapa ── */}
        <Plane z={140}>
          {/* LA BARRA DEL MORFO: los listones verdes se consolidan, la barra SE ACUESTA y aterriza
              como el borde superior de la estación. Es la materia de la frontera 1→2. */}
          {mbA > 0.01 && (
            <div style={{
              position: "absolute", left: `${mbX.toFixed(2)}%`, top: `${mbY.toFixed(2)}%`,
              width: mbW, height: mbH, marginLeft: -mbW / 2, marginTop: -mbH / 2,
              borderRadius: Math.round(lerp(3, 2, mK)), opacity: mbA,
              transform: `rotate(${mbRot.toFixed(2)}deg)`,
              background: `linear-gradient(90deg, ${rgba(V.volt, 0.16)} 0%, ${rgba(V.volt, 0.95)} 20%, ${rgba(V.volt, 0.95)} 80%, ${rgba(V.volt, 0.16)} 100%)`,
              boxShadow: `0 0 ${Math.round(lerp(38, 20, mK))}px ${rgba(V.volt, 0.55)}`,
            }} />
          )}

          {/* la cifra que DICE LA TAPA, sobre la etiqueta plateada en macro (nunca sobre fondo plano) */}
          {g >= 60 && g < 170 && (
            <Readout value="100" unit="W" label="LO QUE DICE LA TAPA" at={at(60)}
              x={64} y={29} size={168} color={V.orange} />
          )}

          {/* PromiseGap 1 · EL PANEL 100/89 — nace en el acto 1 y VUELVE en la fila del acto 4 */}
          <Sequence from={at(GAP1_IN)} layout="none">
            <div style={gapWrap}>
              <PromiseGap promise={100} measured={89} unit="W" slats={g < 1100 ? 26 : 14}
                x={g1X} y={g1Y} w={g1W} h={g1H} on={onPanel}
                label={g < 1100 ? "EL PANEL · TAPA CONTRA PINZA" : "EL PANEL"} />
            </div>
          </Sequence>

          {/* PromiseGap 2 · LA ESTACIÓN 600/431 — atraviesa el PORTAL con la estación */}
          <Sequence from={at(GAP2_IN)} layout="none">
            <div style={gap2Wrap}>
              <PromiseGap promise={600} measured={431} unit="Wh" slats={g < 1100 ? 26 : 14}
                x={g2X} y={g2Y} w={g2W} h={g2H} on={onEst}
                label={g < 1100 ? "LA ESTACIÓN · TAPA CONTRA PINZA" : "LA ESTACIÓN"} />
            </div>
          </Sequence>

          {/* PromiseGap 3 · EL INVERSOR 3000/340 — NO se corta en la frontera 3→4: encoge y viaja */}
          <Sequence from={at(GAP3_IN)} layout="none">
            <div style={gapWrap}>
              <PromiseGap promise={3000} measured={340} unit="W" slats={g < 1100 ? 26 : 14}
                x={g3X} y={g3Y} w={g3W} h={g3H} on={ez(g, GAP3_IN + 4, GAP3_IN + 26)}
                label={k4 > 0.5 ? "EL INVERSOR" : "EL INVERSOR · TAPA CONTRA PINZA"} />
            </div>
          </Sequence>
        </Plane>

        {/* P6 · primer plano: polvo del taller en el haz (hold VIVO, nunca un cuadro quieto) */}
        <Plane z={230}>
          {Array.from({ length: 15 }, (_, i) => {
            const sp = 0.4 + rnd(i * 4.7) * 1.1;
            const yy = (((rnd(i * 8.3) * 130 - (g * sp) / 24) % 130) + 130) % 130 - 12;
            const s = 2 + rnd(i * 2.9) * 3.2;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(7 + rnd(i * 6.1) * 86).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, (0.09 + rnd(i * 3.7) * 0.22) * clamp01(vanoP)),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.2 * clamp01(vanoP))}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo, nunca un fade) ── */}
      {/* f156 · OCLUSIÓN interna del acto 1: la PLATA de la etiqueta cruza pegada al lente */}
      <SeamOcclude at={at(SEAM_OCC)} dur={14} color={V.silver} angle={-7} />
      {/* f712 · la chispa del PORTAL, cuando la cámara atraviesa el enchufe */}
      <SeamFlash at={at(712)} color={V.volt} dur={5} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={64} outF={318} kick="NÚMERO UNO · EL PANEL"
          head="CIEN. OCHENTA Y NUEVE." size={72}
          sub="La tapa promete el vatio del laboratorio." kickColor={V.orange} />
        <Titular g={g} inF={452} outF={676} kick="NÚMERO DOS · LA ESTACIÓN"
          head="SEISCIENTOS. CUATROCIENTOS TREINTA Y UNO." size={56}
          sub="Vatios hora de celda, no de enchufe." kickColor={V.orange} />
        <Titular g={g} inF={828} outF={1046} kick="NÚMERO TRES · EL INVERSOR"
          head="TRES MIL. TRESCIENTOS CUARENTA." size={66}
          sub="Tres mil vatios que duran un segundo." kickColor={V.orange} />
        <Titular g={g} inF={1150} outF={1368} kick="LOS TRES NÚMEROS DE LA CAJA"
          head="ESO NO ES UNA UNIDAD FALLADA" size={62}
          sub="Es exactamente lo que te van a mandar a ti." />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
