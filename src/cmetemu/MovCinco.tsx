// MovCinco.tsx — S3 · UN MOVIMIENTO CONTINUO de 57 s (1710 frames @30fps)
// «Lo que llegó no es lo que estaba en la foto, y la pieza que decide todo viene en una bolsita.»
//
// MEDIODÍA DURO en el patio (arco S1–S3, `sky → white`): entramos en el CONTRALUZ DEL PORTÓN que nos
// dejó `MovEscudo`, bajamos al hormigón, y de ahí el movimiento no vuelve a levantar la cámara hasta
// el macro de la bolsita con el que arranca `MovEtiqueta`. UNA sola `VoltAtmos` montada arriba de todo
// (nunca se remonta), UNA sola `gcam(g, …)` acumulativa (ningún acto la reinicia), la luz evoluciona
// white → sky → white, y hay MATERIA que sobrevive a CADA frontera.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈-40 centrada, BAJANDO AL PISO (panY -96 + descenso extra f24-190) ·
//                       luz `white` plena, key CENTRADA (keyFrom .50), intensity .86 · materia:
//                       EL VANO DEL PORTÓN EN CONTRALUZ, heredado de `MovEscudo` a tamaño completo.
//                EXIT   cám z≈+56, encuadre cerrado sobre el teléfono en la mano · luz white con la
//                       contra NARANJA por abajo (la promesa) · materia: EL RECTÁNGULO PUNTEADO
//                       NARANJA del panel RÍGIDO que promete la foto, ya despegado de la pantalla.
//
// acto 2 · f376  ENTER  cám z≈+120 (hereda el empuje del morfo: +96 acumulados f344-424) ·
//                       luz white enfriándose hacia `sky` (el hormigón a la sombra del portón) ·
//                       materia: EL MISMO RECTÁNGULO, ahora opaco, de tela, abriéndose en DOS HOJAS.
//                EXIT   cám z≈+200 empujando al pliegue · luz `sky`, key corriéndose a la derecha ·
//                       materia: LA LÍNEA DEL PLIEGUE (la costura de la tela), vertical y encendida.
//
// acto 3 · f752  ENTER  cám z≈+270 saliendo del pliegue (escala 1.14 → 1: la inercia del portal) ·
//                       luz `sky` fría, la pantalla es la única fuente · materia: LA MISMA LÍNEA,
//                       que rota 90°→0° al atravesarla y aterriza de subrayado del último renglón.
//                EXIT   cám z≈+270 · luz `sky` con la key ya corrida a la derecha (keyFrom ≈.84) ·
//                       materia: LA ETIQUETA PLATEADA que entra por delante y tapa el 100 %.
//
// acto 4 · f1094 ENTER  cám z≈+80 retrocediendo del macro al producto (-210 acumulados f1090-1226) ·
//                       luz volviendo a `white`, intensity subiendo · materia: LA ETIQUETA PLATEADA
//                       que sale de la oclusión pegada TORCIDA a la bolsita.
//                EXIT   cám z≈+230 empujando dentro de la bolsita · luz white plena · materia:
//                       LA BOLSITA DE PLÁSTICO, que crece de tarjeta (900 px) a decorado (2240 px).
//
// acto 5 · f1471 ENTER  cám z≈+300 ya dentro del macro (LA MISMA tarjeta, sin corte) · luz `white`
//                       plena, el vano ancho por la derecha · materia: LA BOLSITA a sangre.
//                EXIT   cám z≈+330 asentada y VIVA (deriva de gcam + polvo) · luz white ·
//                       materia: LA BOLSITA en macro, la etiqueta torcida a foco y el resto en
//                       viñeta, EMPEZANDO A RESBALAR hacia abajo → así arranca `MovEtiqueta`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f376  frontera 1→2 : MORFO — el rectángulo punteado naranja del panel RÍGIDO del anuncio se despega
//                       de la pantalla, se vuelve materia opaca (f326-366), crece hasta 1360×765 y se
//                       ABRE EN DOS HOJAS desde el pliegue (f364-436) revelando el clip del panel de
//                       tela real. La cobertura total sobre la tarjeta del acto 1 cae en f376-384.
// f752  frontera 2→3 : PORTAL / ZOOM-THROUGH (`zoomThrough`, at 736, dur 22, fx 50 / fy 52) — la
//                       cámara entra en el pliegue de la tela y sale en el macro de la ficha técnica.
// f1094 frontera 3→4 : OCLUSIÓN con `V.silver` (`SeamOcclude` at 1086, dur 16 → cobertura total en
//                       f1094, que es donde cambia la materia) — la etiqueta plateada pasa delante.
// f1471 frontera 4→5 : ESCALA — la bolsita deja de ser tarjeta flotante (900 px) y se vuelve el
//                       decorado a sangre (2240 px) en un crecimiento continuo f1430-1548.
// (ninguna se repite en fronteras seguidas · ninguna es un fade · ninguna baja a negro)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros (los actos de la ficha)
const F_A2 = 376;
const F_A3 = 752;
const F_A4 = 1094;
const F_A5 = 1471;
// las costuras
const SEAM_MORFO = 376;    // MORFO   (span 326 → 436)
const SEAM_PORTAL = 736;   // PORTAL  (zoomThrough dur 22 → atravesado en 752)
const SEAM_OCC = 1086;     // OCLUSIÓN silver (dur 16 → cobertura total en 1094)
const SEAM_SCALE = 1471;   // ESCALA  (span 1430 → 1548)

// ── EL VANO DEL PORTÓN — la fuente en contraluz que hereda de `MovEscudo` ───────────────────
// Es LUZ, no un objeto dibujado: el trapecio del contraluz, su halo y su derrame en el hormigón.
// Sobrevive el movimiento entero (baja de potencia cuando entramos en las pantallas y vuelve a
// subir sobre la bolsita), y es lo que le pasa la forma rectangular a la pantalla del teléfono.
const Vano: React.FC<{ x: number; y: number; w: number; h: number; power: number; color: string }> = ({
  x, y, w, h, power, color,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {/* el hueco del portón: núcleo duro de contraluz */}
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
      background: `linear-gradient(178deg, ${rgba(color, 0.60 * power)} 0%, ${rgba(color, 0.38 * power)} 62%, ${rgba(color, 0.15 * power)} 100%)`,
      clipPath: "polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)",
      mixBlendMode: "screen",
    }} />
    {/* el halo: el aire del patio comiéndose el borde del vano */}
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: w * 1.9, height: h * 1.8, marginLeft: -w * 0.95, marginTop: -h * 0.9,
      background: `radial-gradient(circle, ${rgba(color, 0.28 * power)} 0%, ${rgba(color, 0.10 * power)} 38%, rgba(0,0,0,0) 72%)`,
      mixBlendMode: "screen",
    }} />
    {/* el derrame sobre el hormigón: el piso corre sin corte del garaje al patio */}
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${(y + (h / 1080) * 50).toFixed(2)}%`,
      width: w * 1.25, height: 430, marginLeft: -w * 0.625,
      background: `linear-gradient(180deg, ${rgba(color, 0.21 * power)} 0%, rgba(0,0,0,0) 78%)`,
      clipPath: "polygon(14% 0%, 86% 0%, 100% 100%, 0% 100%)",
      mixBlendMode: "screen",
    }} />
  </AbsoluteFill>
);

// ── POLVO — dos capas a distinta profundidad (hold VIVO: nada quieto más de 1,5 s) ───────────
const Polvo: React.FC<{ g: number; n: number; speed: number; size: number; alpha: number; color: string }> = ({
  g, n, speed, size, alpha, color,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const sp = 0.4 + rnd(i * 4.7) * 1.2;
      const yy = ((rnd(i * 8.3) * 132 - (g * sp) / speed) % 132 + 132) % 132 - 13;
      const s = size * (0.6 + rnd(i * 2.9) * 1.1);
      return (
        <div key={i} style={{
          position: "absolute", left: `${(6 + rnd(i * 6.1) * 88).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
          width: s, height: s, borderRadius: "50%",
          background: rgba(color, alpha * (0.4 + rnd(i * 3.7) * 0.9)),
          boxShadow: `0 0 ${Math.round(5 + s * 3)}px ${rgba(color, alpha * 0.7)}`,
        }} />
      );
    })}
  </AbsoluteFill>
);

// ── TITULAR (una idea de texto por acto, sobre cama oscura, safe area 60 px) ─────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 70, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 24)) * 28;
  return (
    <div style={{
      position: "absolute", left: 64, bottom: 68, maxWidth: 1010,
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
export const MovCinco: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 5) - 1) * 342);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamFlash`, `sheenAt`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: -40, z1: 260, panX: -70, panY: -96, ry: -6.5, rx: 2.4, dur: 1560 });
  const zAcc =
    eio(0, 96, seg(g, 344, 424)) +        // MORFO: el panel viene hacia cámara
    eio(0, 150, seg(g, 730, 806)) +       // PORTAL: quedamos adentro de la pantalla
    eio(0, -210, seg(g, 1090, 1226)) +    // OCLUSIÓN: del macro al producto
    eio(0, 250, seg(g, 1436, 1608));      // ESCALA: entramos en la bolsita
  const pxAcc =
    eio(0, 58, seg(g, 352, 452)) +
    eio(0, -74, seg(g, 742, 848)) +
    eio(0, 92, seg(g, 1096, 1240)) +
    eio(0, -44, seg(g, 1452, 1650));
  const pyAcc =
    eio(0, -64, seg(g, 24, 190)) +        // el descenso al piso que declara la ficha
    eio(0, 52, seg(g, 352, 452)) +
    eio(0, -30, seg(g, 742, 848)) +
    eio(0, 36, seg(g, 1096, 1240)) +
    eio(0, 26, seg(g, 1452, 1660));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta. white (mediodía duro) → sky (sombra del garaje) → white ──
  const tCool = clamp01(ez(g, 70, 700) - ez(g, 1120, 1470));
  const cKey = light(tCool, "white", "sky");
  const cWarm = light(seg(g, 40, 1180), "orange", "amber");   // la contra: LO QUE PROMETEN
  const keyFrom = 0.50 + eio(0, -0.24, seg(g, 30, 330)) + eio(0, 0.58, seg(g, 740, 1090))
    + eio(0, -0.22, seg(g, 1440, 1690));
  const intensity = 0.86 + eio(0, -0.16, seg(g, 60, 640)) + eio(0, 0.24, seg(g, 1100, 1520));

  // el VANO: potencia y geometría continuas de punta a punta
  const vanoP = 0.95 + eio(0, -0.55, seg(g, 60, 300)) + eio(0, -0.24, seg(g, 640, 780))
    + eio(0, 0.44, seg(g, 1180, 1520));
  const vanoX = 50 + eio(0, 9, seg(g, 0, 300)) + eio(0, 15, seg(g, 1100, 1520));
  const vanoY = 40 + eio(0, -26, seg(g, 0, 260)) + eio(0, -9, seg(g, 700, 900));
  const vanoW = lerp(1180, 430, ez(g, 0, 300));
  const vanoH = lerp(780, 310, ez(g, 0, 300));

  // el hormigón: se apaga cuando entramos en las pantallas y vuelve bajo la bolsita
  const losaLit = 0.95 + eio(0, -0.55, seg(g, 620, 800)) + eio(0, 0.42, seg(g, 1100, 1300));

  // ── ACTO 1 · el teléfono con la foto del anuncio, al lado del panel real ───────────────────
  const a1On = g < 384;
  const cardK = ez(g, 250, 360);                       // el encuadre se cierra sobre el teléfono
  const a1W = Math.round(lerp(1020, 640, cardK));
  const a1H = Math.round(a1W * 0.5625);
  const a1X = lerp(50, 43.5, cardK);
  const a1Y = lerp(45, 44, cardK);
  const a1Op = ez(g, 26, 62);

  // ── LA MATERIA QUE CRUZA LA FRONTERA 1→2: el rectángulo del panel ─────────────────────────
  // Empieza punteado en NARANJA sobre la pantalla (el panel RÍGIDO que promete la foto), se
  // despega, se vuelve materia opaca de tela y se abre en dos hojas: ES el panel real.
  const mo = ez(g, 340, 436);
  const prW = Math.round(lerp(lerp(372, 236, cardK), 1360, mo));
  const prH = Math.round(lerp(lerp(232, 148, cardK), 765, mo));
  const prX = lerp(lerp(46.5, 42.2, cardK), 50, mo);
  const prY = lerp(lerp(42.0, 42.6, cardK), 52, mo);
  const prFill = ez(g, 326, 366);                      // la materia se vuelve opaca
  const prDot = ez(g, 96, 130) * (1 - ez(g, 396, 440));
  const open = ez(g, 364, 436);                        // las dos hojas se abren desde el pliegue
  const leafPct = (1 - open) * 50;

  // ── ACTO 2 · el panel plegable de tela abierto sobre el hormigón ───────────────────────────
  const a2On = g >= 320 && g < 762;
  const a2Ry = lerp(7, 0, ez(g, 380, 560));
  const zt = zoomThrough(g, SEAM_PORTAL, 22, 50, 52);

  // ── LA MATERIA QUE CRUZA LA FRONTERA 2→3: la línea del pliegue ────────────────────────────
  // Vertical en la tela (la costura), se ensancha cuando la atravesamos, rota 90°→0° y aterriza
  // de subrayado del último renglón de la ficha técnica.
  const plOn = g >= 390 && g < 1092;
  const plPass = clamp01(1 - Math.abs(seg(g, 722, 786) - 0.5) * 2);   // el instante en que la cruzamos
  const plRot = lerp(90, 0, ez(g, 754, 812));
  const plLen = lerp(560, 430, ez(g, 754, 830));
  const plThick = lerp(6, 3, ez(g, 754, 830));
  const plY = 52 + eio(0, 20.5, seg(g, 758, 826));
  const plA = ez(g, 392, 436) * (0.42 + 0.58 * plPass + 0.30 * ez(g, 448, 560)) * (1 - 0.6 * ez(g, 1000, 1080));

  // ── ACTO 3 · el macro de la ficha técnica, al fondo de la página ───────────────────────────
  const a3On = g >= 744 && g < 1094;
  const a3W = Math.round(lerp(1620, 1420, ez(g, 760, 1000)));
  const a3H = Math.round(a3W * 0.5625);
  const a3Sc = lerp(1.14, 1, ez(g, 744, 846));         // la inercia con la que salimos del portal
  // la barra de scroll que SE ZAMBULLE hasta abajo de todo
  // (las coordenadas están calculadas SOBRE el tamaño ya escalado por la perspectiva: en el acto 3
  //  la cámara magnifica ×1,38, así que la banda visible de este plano es y ∈ [24 %, 92 %].)
  const scT = ez(g, 786, 962);
  const scBump = g > 962 ? Math.sin((g - 962) / 5) * 0.32 * clamp01(1 - (g - 962) / 34) : 0;
  const scY = lerp(27, 80, scT) + scBump;
  const scOp = ez(g, 776, 812) * (1 - ez(g, 1040, 1082));
  const rowOp = ez(g, 930, 972) * (1 - ez(g, 1044, 1082));

  // ── ACTO 4 · la bolsita con el controlador: sin caja y sin manual ──────────────────────────
  const a4On = g >= 1088;
  const bagW = Math.round(lerp(900, 2240, ez(g, 1430, 1548)));
  const bagH = Math.round(bagW * 0.5625);
  const bagX = lerp(51, 50, ez(g, 1430, 1548));
  const bagY = lerp(50, 51, ez(g, 1430, 1548));
  const bagRy = lerp(-7, 0, ez(g, 1094, 1240));

  // ── ACTO 5 · macro: la etiqueta torcida a foco, el resto en viñeta ─────────────────────────
  const focus = ez(g, 1478, 1600);
  const slip = ez(g, 1672, 1710);                      // la bolsita EMPIEZA a resbalar → MovEtiqueta

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cWarm} keyFrom={keyFrom} intensity={intensity} floor={0.52} />

      <Layers cam={cam}>
        {/* P1 · z-680 · el garaje de Claudio con el portón al patio: siempre hay imagen real */}
        <PhotoPlane
          src="img/cmetemu/cmet_h04.jpg"
          kind="photo" z={-680} scale={1.32}
          dim={lerp(0.46, 0.74, ez(g, 60, 760))} tint={V.sky}
        />

        {/* P2 · z-430 · EL VANO DEL PORTÓN EN CONTRALUZ — la materia que hereda de `MovEscudo` */}
        <Plane z={-430}>
          <Vano x={vanoX} y={vanoY} w={vanoW} h={vanoH} power={clamp01(vanoP)} color={cKey} />
        </Plane>

        {/* P3 · z-260 · el hormigón que corre sin corte del garaje al patio */}
        <Plane z={-260}>
          <PadPlane y={77} w={1480} h={330} rx={63} lit={clamp01(losaLit)} z={-40} />
        </Plane>

        {/* P4 · z-140 · el polvo hondo del taller (parallax propio, más lento y más grande) */}
        <Plane z={-140}>
          <Polvo g={g} n={12} speed={34} size={5.2} alpha={0.10 * clamp01(vanoP)} color={cKey} />
        </Plane>

        {/* ══ P5 · z+40 · EL MATERIAL REAL + su estructura gráfica ══
            El orden del DOM ES el orden de pintado dentro del plano: la bolsita abajo (la tapa el
            macro de la ficha hasta que la oclusión cubre el 100 %), después la ficha, después el
            teléfono, y arriba de todo el grupo del MORFO/PORTAL, que es el que tapa a los otros. */}
        <Plane z={40}>
          {/* ACTOS 4+5 — LA BOLSITA: nace tapada por la oclusión plateada y crece hasta ser el
              decorado. Es UNA SOLA tarjeta de 1088 a 1710: la frontera 4→5 es puro cambio de ESCALA. */}
          {a4On && (
            <div style={{ transform: `translateY(${(slip * 62).toFixed(1)}px) rotate(${(slip * 2.4).toFixed(2)}deg)` }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_cinco4.mp4" kind="video"
                w={bagW} h={bagH} x={bagX} y={bagY} z={0}
                ry={bagRy} radius={g > SEAM_SCALE ? 0 : 14} startFrom={5}
                lit={0.94} litColor={cKey} sheenAt={at(1108)}
              />
            </div>
          )}

          {/* ACTO 3 — el macro de la ficha técnica (salimos del pliegue con su inercia) */}
          {a3On && (
            <AbsoluteFill style={{ transform: `scale(${a3Sc.toFixed(3)})`, transformOrigin: "50% 52%" }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_cinco3.mp4" kind="video"
                w={a3W} h={a3H} x={50} y={47} z={0}
                ry={lerp(3, 0, ez(g, 760, 900))} radius={12} startFrom={8}
                lit={0.96} litColor={cKey} sheenAt={at(772)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 1 — el teléfono con la foto del anuncio, al lado del panel plegable real */}
          {a1On && (
            <div style={{ opacity: a1Op }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_cinco1.mp4" kind="video"
                w={a1W} h={a1H} x={a1X} y={a1Y} z={0}
                ry={lerp(10, 1, ez(g, 26, 200))} rx={lerp(-3, 0, ez(g, 26, 200))}
                radius={16} startFrom={4} lit={0.62 + 0.38 * ez(g, 26, 130)}
                litColor={cKey} sheenAt={at(104)}
              />
            </div>
          )}

          {/* ── MORFO 1→2 · el mismo rectángulo: promesa punteada → tela opaca → DOS HOJAS.
                 El PORTAL 2→3 se aplica a ESTE mismo grupo: la cámara entra en el pliegue. ── */}
          <AbsoluteFill style={{ transform: zt.out, transformOrigin: "50% 52%", opacity: clamp01(zt.opacity) }}>
            {a2On && (
              <div style={{
                position: "absolute", left: `${prX.toFixed(2)}%`, top: `${prY.toFixed(2)}%`,
                width: prW, height: prH, marginLeft: -prW / 2, marginTop: -prH / 2,
                transform: `rotateY(${a2Ry.toFixed(2)}deg)`, transformStyle: "preserve-3d",
                boxShadow: `0 ${Math.round(prH * 0.16)}px ${Math.round(prH * 0.24)}px ${rgba(V.ink0, 0.72 * prFill)}`,
              }}>
                {/* la tela plegada: materia opaca, con tejido y canto iluminado (nunca un plano) */}
                <div style={{
                  position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: prFill,
                  borderRadius: 6,
                  background: `linear-gradient(172deg, ${rgba(V.ink2, 0.98)} 0%, ${rgba(V.ink1, 1)} 58%, ${rgba(V.ink0, 1)} 100%)`,
                  boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.20)}, inset 0 0 90px ${rgba(V.ink0, 0.9)}`,
                }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: 0.2,
                    backgroundImage: "repeating-linear-gradient(46deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 6px), repeating-linear-gradient(-46deg, rgba(255,255,255,.35) 0 1px, rgba(0,0,0,0) 1px 6px)",
                    mixBlendMode: "overlay",
                  }} />
                </div>

                {/* EL MATERIAL REAL adentro: se revela DESDE EL PLIEGUE hacia afuera */}
                {g >= 344 && (
                  <div style={{
                    position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                    clipPath: `inset(0% ${leafPct.toFixed(2)}% 0% ${leafPct.toFixed(2)}%)`,
                  }}>
                    <MediaCard
                      src="broll/cmetemu/cmet_mv_cinco2.mp4" kind="video"
                      w={prW} h={prH} x={50} y={50} z={0}
                      radius={6} startFrom={6} lit={0.92} litColor={cKey} sheenAt={at(452)}
                    />
                  </div>
                )}

                {/* LAS DOS HOJAS: se retiran hacia los bordes, no se funden */}
                {prFill > 0.01 && open < 0.999 && (
                  <>
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0, width: `${leafPct.toFixed(2)}%`,
                      opacity: prFill, borderRadius: "6px 0 0 6px",
                      background: `linear-gradient(96deg, ${rgba(V.ink1, 1)} 0%, ${rgba(V.ink2, 1)} 78%, ${rgba(V.silver, 0.5)} 100%)`,
                    }} />
                    <div style={{
                      position: "absolute", right: 0, top: 0, bottom: 0, width: `${leafPct.toFixed(2)}%`,
                      opacity: prFill, borderRadius: "0 6px 6px 0",
                      background: `linear-gradient(-96deg, ${rgba(V.ink1, 1)} 0%, ${rgba(V.ink2, 1)} 78%, ${rgba(V.silver, 0.5)} 100%)`,
                    }} />
                  </>
                )}
              </div>
            )}
          </AbsoluteFill>

          {/* ══ ESTRUCTURA GRÁFICA — va SOBRE el material (mismo plano, después en el DOM).
                 Son ejes, marcas y líneas: ninguna hace de objeto real. ══ */}

          {/* ACTO 1 · el rectángulo PUNTEADO NARANJA: el panel RÍGIDO que promete la foto */}
          {prDot > 0.01 && (
            <div style={{
              position: "absolute", left: `${prX.toFixed(2)}%`, top: `${prY.toFixed(2)}%`,
              width: prW, height: prH, marginLeft: -prW / 2, marginTop: -prH / 2,
              border: `${Math.round(lerp(2, 5, mo))}px dashed ${rgba(V.orange, 0.92)}`,
              borderRadius: 6, opacity: prDot,
              boxShadow: `0 0 ${Math.round(lerp(12, 40, mo))}px ${rgba(V.orange, 0.34)}`,
            }} />
          )}

          {/* ACTO 1 · el conector que SUBE DESDE ABAJO hasta la cifra prometida (regla de luz:
              lo que dice la caja entra desde abajo y en naranja) */}
          {g >= 148 && g < 352 && (() => {
            // crece HACIA ARRIBA: se ancla abajo (top 70 % + marginTop -h) y sube hasta la cifra
            const h = 150 * ez(g, 148, 176) * (1 - ez(g, 322, 350));
            return (
              <div style={{
                position: "absolute", left: "72%", top: "70%", width: 3, height: h, marginTop: -h,
                background: `linear-gradient(0deg, ${rgba(V.orange, 0.06)} 0%, ${rgba(V.orange, 0.85)} 100%)`,
                boxShadow: `0 0 16px ${rgba(V.orange, 0.5)}`,
              }} />
            );
          })()}
          {g >= 152 && g < 352 && (
            <Readout value="100" unit="W" label="LO QUE DICE EL ANUNCIO" at={at(156)}
              x={72} y={64} size={150} color={V.orange} />
          )}

          {/* LA LÍNEA DEL PLIEGUE: costura de la tela → subrayado del último renglón chiquito */}
          {plOn && plA > 0.01 && (
            <div style={{
              position: "absolute", left: "50%", top: `${plY.toFixed(2)}%`,
              width: plLen, height: plThick, marginLeft: -plLen / 2, marginTop: -plThick / 2,
              transform: `rotate(${plRot.toFixed(2)}deg) scaleY(${(1 + 1.3 * plPass).toFixed(3)})`,
              borderRadius: 2, opacity: clamp01(plA),
              background: `linear-gradient(90deg, ${rgba(V.white, 0.05)} 0%, ${rgba(V.white, 0.92)} 20%, ${rgba(V.white, 0.92)} 80%, ${rgba(V.white, 0.05)} 100%)`,
              boxShadow: `0 0 ${Math.round(14 + 30 * plPass)}px ${rgba(V.white, 0.30 + 0.34 * plPass)}`,
            }} />
          )}

          {/* ACTO 3 · LA BARRA DE SCROLL: la ficha está ABAJO DE TODO */}
          {scOp > 0.01 && (
            <>
              <div style={{
                position: "absolute", left: "80%", top: "26%", width: 8, height: 660,
                borderRadius: 4, opacity: scOp * 0.5, background: rgba(V.white, 0.16),
              }} />
              <div style={{
                position: "absolute", left: "80%", top: `${scY.toFixed(2)}%`, width: 8,
                height: lerp(120, 54, scT), borderRadius: 4, opacity: scOp,
                background: rgba(V.white, 0.88), boxShadow: `0 0 20px ${rgba(V.white, 0.45)}`,
              }} />
            </>
          )}

          {/* ACTO 3 · el marco del ÚLTIMO renglón: la letra pensada para que no la leas */}
          {rowOp > 0.01 && (
            <div style={{
              position: "absolute", left: "50%", top: "68%", width: 880, height: 54,
              marginLeft: -440, marginTop: -27, borderRadius: 4, opacity: rowOp,
              border: `2px solid ${rgba(V.white, 0.62)}`,
              boxShadow: `0 0 34px ${rgba(V.white, 0.22)}, inset 0 0 26px ${rgba(V.white, 0.1)}`,
            }} />
          )}

          {/* ACTO 3 · la LUPA aterriza sobre ese renglón (ícono PNG como objeto de la escena) */}
          {g >= 946 && g < 1082 && (
            <div style={{ opacity: ez(g, 946, 986) * (1 - ez(g, 1044, 1080)) }}>
              <IconPng src="img/cmetemu/cmet_ic_lupa.png"
                x={lerp(66, 56, ez(g, 946, 1010))} y={lerp(50, 63, ez(g, 946, 1010))}
                size={128} z={0} rot={lerp(-16, -6, ez(g, 946, 1010))} glow={V.ink0} />
            </div>
          )}

          {/* ACTO 4 · lo que NO vino: la caja y el manual, tachados en el naranja de la promesa */}
          {g >= 1196 && g < 1452 && (
            <>
              {[
                { ic: "img/cmetemu/cmet_ic_caja.png", y: 26, d: 0 },
                { ic: "img/cmetemu/cmet_ic_cuaderno.png", y: 43, d: 44 },
              ].map((it, i) => {
                const a = ez(g, 1196 + it.d, 1244 + it.d) * (1 - ez(g, 1404, 1452));
                if (a <= 0.01) return null;
                return (
                  <div key={i} style={{ opacity: a }}>
                    <IconPng src={it.ic} x={22} y={it.y} size={104} z={0} opacity={0.6} glow={V.ink0} />
                    <div style={{
                      position: "absolute", left: "22%", top: `${(it.y + 2.4).toFixed(2)}%`,
                      width: 130 * a, height: 5, marginLeft: -65, borderRadius: 3,
                      transform: "rotate(-15deg)", background: rgba(V.orange, 0.92),
                      boxShadow: `0 0 18px ${rgba(V.orange, 0.55)}`,
                    }} />
                  </div>
                );
              })}
            </>
          )}

          {/* ACTO 5 · EL RESTO FUERA DE FOCO: viñeta cerrada sobre la etiqueta torcida + el
              anillo de foco del macro (marca de instrumento, no un objeto dibujado) */}
          {focus > 0.01 && (
            <AbsoluteFill style={{ pointerEvents: "none" }}>
              <AbsoluteFill style={{
                background: `radial-gradient(46% 54% at 47% 48%, rgba(0,0,0,0) 36%, ${rgba(V.ink0, 0.5 * focus)} 74%, ${rgba(V.ink0, 0.84 * focus)} 100%)`,
              }} />
              <AbsoluteFill style={{
                background: `radial-gradient(30% 34% at 47% 48%, ${rgba(V.white, 0.1 * focus)} 0%, rgba(0,0,0,0) 70%)`,
                mixBlendMode: "soft-light",
              }} />
              <div style={{
                position: "absolute", left: "47%", top: "48%", width: 440, height: 440,
                marginLeft: -220, marginTop: -220, borderRadius: "50%",
                border: `2px solid ${rgba(V.white, 0.26 * focus)}`,
                opacity: 0.72 + 0.28 * Math.sin(g / 29),
              }} />
            </AbsoluteFill>
          )}
        </Plane>

        {/* P6 · z+230 · el polvo de primer plano cruzando el haz del portón (hold VIVO) */}
        <Plane z={230}>
          <Polvo g={g} n={16} speed={21} size={3.4} alpha={0.16 * clamp01(vanoP)} color={cKey} />
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo, nunca un fade) ── */}
      {/* f1094 · OCLUSIÓN: la ETIQUETA PLATEADA pasa por delante y tapa el 100 % */}
      <SeamOcclude at={at(SEAM_OCC)} dur={16} color={V.silver} angle={-9} />
      {/* f376 · el beat del MORFO: destello óptico de 5 frames cuando el panel se abre */}
      <SeamFlash at={at(SEAM_MORFO)} color={V.orange} dur={5} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={96} outF={312} kick="LO QUE COMPRÉ" head="LA FOTO ES UNA SUGERENCIA"
          sub="Según el anuncio: un panel rígido de cien vatios." kickColor={V.orange} />
        <Titular g={g} inF={F_A2 + 52} outF={690} kick="LO QUE LLEGÓ" head="LLEGÓ PLEGABLE, DE TELA"
          sub="Dos hojas cosidas. No es peor, pero no es lo de la foto." />
        <Titular g={g} inF={F_A3 + 54} outF={1036} kick="AL PIE DE LA PÁGINA"
          head="LA FICHA ESTÁ ABAJO DE TODO"
          sub="En un tamaño de letra pensado para que no la leas." size={64} />
        <Titular g={g} inF={F_A4 + 62} outF={1408} kick="EL CONTROLADOR" head="SIN CAJA, SIN MANUAL"
          sub="La pieza que decide todo, en una bolsita de plástico." />
        <Titular g={g} inF={F_A5 + 42} outF={1664} kick="LA ETIQUETA PEGADA TORCIDA"
          head="GUÁRDATELO EN LA CABEZA" sub="Esta bolsita vuelve al final del video." />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
