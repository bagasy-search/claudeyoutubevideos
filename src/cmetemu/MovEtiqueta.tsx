// MovEtiqueta.tsx — S4 · UN MOVIMIENTO CONTINUO de 58 s (1740 frames @30fps) · 306,2 s → 364,2 s
// «STC: los cien vatios de la caja son de un día que en tu patio no existe.»
//
// EL SOL VERTICAL Y EL CALOR (tramo `white` → `volt` del arco del video). Una sola atmósfera montada
// arriba de todo que NUNCA se remonta, UNA cámara función de `gFrame` que jamás vuelve a cero (sube al
// dorso del panel, entra en la etiqueta, sale por el disco del sol, y desde ahí BAJA hasta acostarse a
// ras del panel caliente), la luz evoluciona sin saltos y hay MATERIA que cruza CADA frontera.
// El remate es el DELTA: la norma dice 25 en la celda, el infrarrojo marca 52,3.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈-40, casi la misma inercia con la que terminó `MovCinco` (primer plano
//                       corto, deriva viva) · luz `white` alta, key a la izquierda (keyFrom .24) ·
//                       materia: LA BOLSITA DE PLÁSTICO del controlador, desenfocada, CAYENDO fuera de
//                       cuadro entre f0 y f34 — se va por movimiento, no por opacidad.
//                EXIT   cám z≈+160 (ya metida dentro de la etiqueta) · luz `white` con la key subida a
//                       .35 · materia: LA ETIQUETA PLATEADA del dorso, escalada ×2,9 hasta llenar el
//                       cuadro: deja de ser un objeto y pasa a ser LA SUPERFICIE del acto siguiente.
//
// acto 2 · f348  ENTER  cám z≈+160 heredada (ningún reset) · luz `white`, key .29 · materia: LA MISMA
//                       ETIQUETA PLATEADA, ahora en macro y a escala de mesa (match de encuadre exacto).
//                EXIT   cám z≈+250, pan −60 · luz `white`→`volt` a media temperatura (key .40) ·
//                       materia: EL PRIMER RENGLÓN de la etiqueta, ya desplegado como ficha con el
//                       clip del sol adentro, deformándose a disco perfecto.
//
// acto 3 · f696  ENTER  cám z≈+250, pan −60 (la ficha 1 sigue en pantalla: no hay corte) · luz `volt`
//                       entrando, key .48 · materia: EL DISCO DEL SOL (la ficha 1 vuelta círculo).
//                EXIT   cám z≈+250 empezando a BAJAR (pan Y +132) · luz `volt` dominante · materia: EL
//                       DISCO que se queda arriba en el cielo + LA GRILLA DE UN METRO que se apaga en
//                       el pasto mientras el panel real sube desde abajo.
//
// acto 4 · f1079 ENTER  cám bajando (z≈+90, pan Y +132): la MISMA bajada que arrancó en f1050, sin
//                       cortarse · luz `volt` · materia: EL PANEL REAL que entra por abajo del cuadro
//                       con el infrarrojo apuntándole, y la ficha 2 (25 °C) que aterriza en la columna.
//                EXIT   cám z≈+20, ya acostada · luz `volt` plena · materia: LA CIFRA 52,3 (viaja) y LA
//                       ETIQUETA PLATEADA que cruza el cuadro tapando el 100 %.
//
// acto 5 · f1462 ENTER  (el relevo de material cae en f1463, el frame de cobertura TOTAL del occluder)
//                       cám z≈+20 bajando a rasante (pan Y +56) · luz `volt` plena, key baja (.42) ·
//                       materia: LA SUPERFICIE DEL PANEL a ras, con el calor temblando encima.
//                EXIT   cám asentada a ras, sigue bajando · luz `volt` · materia: LA SUPERFICIE
//                       CALIENTE DEL PANEL, rasante  → así arranca `MovAngulo`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f346  frontera 1→2 : ESCALA — la etiqueta del dorso crece ×2,9 (origen 48%/54%) hasta que su plata
//                      llena el cuadro, y en f346 el macro de la etiqueta entra EN EL MISMO ENCUADRE
//                      (match de escala al pixel). Lo que era un detalle del objeto es ahora la mesa.
// f688  frontera 2→3 : MORFO — el primer renglón de la etiqueta (ficha de 560×150 con el clip del sol
//                      adentro) se deforma a disco perfecto de 520×520 (radius 14 → 260) y ES el sol
//                      del acto 3. La misma tarjeta, el mismo material, sin corte.
// f1072 frontera 3→4 : INERCIA — la cámara sigue el vector que empezó en f1050 (baja 132 px y retrocede
//                      210) y el decorado cambia detrás: el disco se va por arriba, la grilla se apaga
//                      y el panel real sube desde abajo del cuadro.
// f1456 frontera 4→5 : OCLUSIÓN con `V.silver` (la etiqueta plateada, la materia firma del video),
//                      dur 14 → cobertura total en f1463; detrás ya está el plano rasante del panel.
// (ninguna se repite, ninguna es un fade, ninguna dos veces seguidas)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame: el farm rinde en 60 chunks) ─────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros (los de la ficha)
const F_A2 = 348;
const F_A3 = 696;
const F_A4 = 1079;
const F_A5 = 1462;
const SEAM_ESCALA = 346;
const SEAM_MORFO = 688;
const SEAM_INERCIA = 1072;
const SEAM_OCC = 1456;

// geometría de la columna de temperatura (acto 4): 20 °C abajo, 60 °C arriba
const COL_H = 498;
const tempY = (t: number) => COL_H * clamp01((t - 20) / 40);

// ── EL SOL: el brillo volumétrico que nace en el acto 3 y queda de CALOR hasta el final ──────
const SolHaz: React.FC<{ x: number; y: number; power: number; color: string }> = ({ x, y, power, color }) => {
  if (power <= 0.004) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
        width: 1500, height: 1500, marginLeft: -750, marginTop: -750, borderRadius: "50%",
        background: `radial-gradient(circle, ${rgba(color, 0.42 * power)} 0%, ${rgba(color, 0.15 * power)} 22%, ${rgba(V.amber, 0.07 * power)} 44%, rgba(0,0,0,0) 70%)`,
        mixBlendMode: "screen",
      }} />
      <div style={{
        position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
        width: 1900, height: 26, marginLeft: -950, marginTop: -13,
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(color, 0.26 * power)} 46%, ${rgba(color, 0.26 * power)} 54%, rgba(0,0,0,0) 100%)`,
        mixBlendMode: "screen",
      }} />
    </AbsoluteFill>
  );
};

// ── TITULAR (una sola idea de texto por acto, sobre cama oscura, fuera de la perspectiva) ────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 72, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 66, maxWidth: 1030,
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
export const MovEtiqueta: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build; red de seguridad por si `gFrame` llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 5) - 1) * 348);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamFlash`, `sheenAt`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: -40, z1: 300, panX: -70, panY: -60, ry: -6.5, rx: 2.4, dur: 1660 });
  const zAcc =
    eio(0, 120, seg(g, 292, 352)) +            // ESCALA: entramos en la etiqueta
    eio(0, 90, seg(g, 664, 744)) +             // MORFO: seguimos entrando, ahora al disco
    eio(0, -210, seg(g, 1050, 1210)) +         // INERCIA: la cámara baja y se abre al patio
    eio(0, -70, seg(g, SEAM_OCC, 1620));       // el rasante final
  const pxAcc = eio(0, -60, seg(g, 664, 780)) + eio(0, 74, seg(g, 1300, 1520));
  const pyAcc =
    eio(0, -34, seg(g, 24, 240)) +             // acto 1: la cámara SUBE al dorso del panel
    eio(0, 26, seg(g, 300, 400)) +
    eio(0, 132, seg(g, 1050, 1240)) +          // INERCIA: bajando al pasto
    eio(0, 56, seg(g, 1440, 1690));            // se acuesta a ras
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta. white (mediodía del patio) → volt (el calor medido) ──────
  const cKey = light(seg(g, 60, 1380), "white", "volt");
  const cWarm = light(seg(g, 400, 1500), "amber", "orange");
  const keyFrom = 0.24 + eio(0, 0.34, seg(g, 0, 700)) + eio(0, -0.16, seg(g, 1100, 1620));
  const intensity =
    0.78 + eio(0, 0.26, seg(g, 0, 13)) +       // rampa de entrada del ambiente: 13 frames
    eio(0, 0.10, seg(g, 700, 1000)) + eio(0, -0.14, seg(g, 1520, 1730));

  // el brillo del sol: prende con el disco y se queda como CALOR sobre el panel
  const solPow = eio(0, 1, seg(g, 690, 780)) - eio(0, 0.46, seg(g, 1090, 1300));
  const solX = 50 + eio(0, -6, seg(g, 1050, 1260));
  const solY = lerp(29, -14, ez(g, 1050, 1230));

  // ── ACTO 1 · la bolsita que se va, el dorso del panel, la etiqueta que crece ───────────────
  const bolsa = ez(g, 0, 34);
  const a1On = g < SEAM_ESCALA;
  const escala = ez(g, 292, SEAM_ESCALA);
  const a1Scale = lerp(1, 2.9, escala);   // hasta que la plata de la etiqueta llena el cuadro
  const a1W = Math.round(lerp(1210, 1300, ez(g, 30, 280)));
  const a1H = Math.round(a1W * 0.5625);
  // el recuadro que le pone el ojo a la etiqueta dentro del dorso (estructura, no objeto)
  const marcoOp = ez(g, 96, 132) * (1 - ez(g, 268, 300));

  // ── ACTO 2 · el macro de la etiqueta = la mesa; la sigla; los tres renglones ───────────────
  const a2On = g >= SEAM_ESCALA && g < 738;
  const a2W = Math.round(lerp(1880, 1420, ez(g, F_A2 + 40, 560)));
  const a2H = Math.round(a2W * 0.5625);
  const a2Y = lerp(50, 46, ez(g, F_A2 + 40, 560)) + 62 * ez(g, SEAM_MORFO, 736);  // se va por MOVIMIENTO
  const stcOp = ez(g, 466, 496) * (1 - ez(g, 664, 700));

  // ── LOS TRES RENGLONES → FICHAS (nacen del renglón, con material real adentro) ─────────────
  const fichaIn = (i: number) => ez(g, 604 + i * 22, 646 + i * 22);
  const morfo = ez(g, SEAM_MORFO, 772);                        // ficha 1 → disco del sol
  // ficha 1: la que se vuelve el sol
  const f1W = Math.round(lerp(560, 520, morfo));
  const f1H = Math.round(lerp(150, 520, morfo));
  const f1R = Math.round(lerp(14, 260, morfo));
  const f1X = lerp(46, 50, morfo);
  const f1Y = lerp(34, 29, morfo) + lerp(0, -43, ez(g, 1050, 1230));   // se va con el sol, arriba
  // ficha 2 (25 °C): viaja a la derecha y en el acto 4 aterriza en la columna
  const f2Trip = ez(g, SEAM_MORFO, 800);
  const f2Land = ez(g, 1096, 1220);
  const f2X = lerp(lerp(46, 86, f2Trip), 87, f2Land);
  const f2Y = lerp(lerp(50, 34, f2Trip), 74, f2Land);
  const f2W = Math.round(lerp(lerp(560, 330, f2Trip), 290, f2Land));
  // ficha 3 (perpendicular): vive el acto 3 y se va por arriba con la inercia
  const f3Trip = ez(g, SEAM_MORFO + 16, 816);
  const f3X = lerp(46, 86, f3Trip);
  const f3Y = lerp(66, 60, f3Trip) - 84 * ez(g, 1046, 1140);
  const f3W = Math.round(lerp(560, 330, f3Trip));

  // ── ACTO 3 · la grilla de un metro y la perpendicular ──────────────────────────────────────
  const gridOp = ez(g, F_A3 + 24, 800) * (1 - ez(g, SEAM_INERCIA + 4, 1180));
  const perpOp = ez(g, 924, 962) * (1 - ez(g, SEAM_INERCIA - 28, SEAM_INERCIA + 24));

  // ── ACTO 4 · el panel real sube por la inercia; la columna de temperatura ──────────────────
  const a4On = g >= F_A4 - 33 && g < SEAM_OCC + 8;
  const a4Y = lerp(126, 54, ez(g, 1056, 1206));
  const a4W = Math.round(lerp(1120, 1250, ez(g, 1056, 1260)));
  const a4H = Math.round(a4W * 0.5625);
  const colOp = ez(g, 1132, 1186) * (1 - ez(g, 1416, 1454));
  const hNorma = tempY(lerp(20, 25, ez(g, 1150, 1214)));
  const hReal = tempY(lerp(25, 52.3, ez(g, 1300, 1412)));

  // la cifra 52,3 VIAJA: nace en la pantallita del infrarrojo y sobrevive la oclusión
  const r523 = ez(g, 1476, 1580);
  const r523X = lerp(30, 21, r523);
  const r523Y = lerp(31, 19, r523);
  const r523S = Math.round(lerp(168, 106, r523));

  // ── ACTO 5 · el panel a ras y el calor temblando ───────────────────────────────────────────
  const a5On = g >= SEAM_OCC + 7;
  const a5Kb = lerp(1.0, 1.07, ez(g, SEAM_OCC + 7, 1740));
  const gapGrow = ez(g, F_A5 + 54, F_A5 + 154);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cWarm} keyFrom={keyFrom} intensity={intensity} floor={0.56} />

      <Layers cam={cam}>
        {/* P1 · fondo profundo. Sólo cambia DEBAJO de una costura que ya tapa (MORFO y OCLUSIÓN),
            nunca en la INERCIA: ahí el patio tiene que seguir siendo el mismo patio. */}
        {g < SEAM_MORFO && (
          <PhotoPlane src="img/cmetemu/cmet_mv_etiq1.jpg" kind="photo" z={-640} scale={1.30}
            dim={lerp(0.52, 0.70, ez(g, 60, 320))} tint={V.white} />
        )}
        {g >= SEAM_MORFO && g < SEAM_OCC && (
          <PhotoPlane src="img/cmetemu/cmet_mv_etiq3.jpg" kind="photo" z={-640} scale={1.26}
            dim={lerp(0.46, 0.64, ez(g, 700, 1300))} tint={V.volt} />
        )}
        {g >= SEAM_OCC && (
          <PhotoPlane src="img/cmetemu/cmet_mv_etiq4.jpg" kind="photo" z={-640} scale={1.34}
            dim={0.68} tint={V.volt} />
        )}

        {/* P2 · el sol volumétrico: nace en el acto 3 y queda como CALOR hasta el final */}
        <Plane z={-420}>
          <SolHaz x={solX} y={solY} power={clamp01(solPow)} color={cKey} />
        </Plane>

        {/* P3 · el suelo del garaje/patio: el único plano que cruza LOS CINCO actos */}
        <Plane z={-250}>
          <PadPlane
            y={lerp(76, 82, ez(g, 1050, 1300))}
            w={1460} h={330} rx={62}
            lit={0.92 - 0.66 * ez(g, 660, 800) + 0.40 * ez(g, 1090, 1300)}
            z={-40}
          />
          {/* LA GRILLA DE UN METRO: estructura pintada en el pasto (acto 3) */}
          {gridOp > 0.01 && (
            <div style={{
              position: "absolute", left: "50%", top: "56%", width: 1680, height: 520, marginLeft: -840,
              transform: "translateZ(-40px) rotateX(68deg)", transformOrigin: "50% 0%",
              opacity: gridOp,
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.white, 0.20)} 0 2px, rgba(0,0,0,0) 2px 150px), ` +
                `repeating-linear-gradient(0deg, ${rgba(V.white, 0.20)} 0 2px, rgba(0,0,0,0) 2px 150px)`,
            }}>
              <div style={{
                position: "absolute", left: 765, top: 152, width: 150, height: 150,
                border: `3px solid ${rgba(V.orange, 0.92)}`,
                background: `linear-gradient(180deg, ${rgba(V.orange, 0.20)} 0%, ${rgba(V.orange, 0.05)} 100%)`,
                boxShadow: `0 0 34px ${rgba(V.orange, 0.5)}`,
              }}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: 48, textAlign: "center",
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 46, color: V.orange,
                  textShadow: `0 3px 14px ${rgba(V.ink0, 0.9)}`,
                }}>1 m²</div>
              </div>
            </div>
          )}
        </Plane>

        {/* P4 · GRÁFICOS: la sigla, la perpendicular, la columna de temperatura, las cifras */}
        <Plane z={-60}>
          {/* la PERPENDICULAR: del disco del sol a la celda marcada, con su ángulo recto */}
          {perpOp > 0.01 && (
            <svg viewBox="0 0 1920 1080" style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
              opacity: perpOp,
            }}>
              {/* el rayo sale del disco del sol (que lo tapa hasta su borde) y cae a plomo */}
              <path d="M 960 320 L 960 662" fill="none" stroke={rgba(V.volt, 0.75)} strokeWidth={4}
                strokeDasharray="16 12" strokeLinecap="round" />
              <path d="M 908 662 L 908 614 L 960 614" fill="none" stroke={rgba(V.volt, 0.85)} strokeWidth={4} />
              <circle cx={960} cy={662} r={9} fill={V.volt} />
            </svg>
          )}

          {/* LA COLUMNA DE TEMPERATURA (acto 4): la norma abajo en naranja, lo medido arriba en volt */}
          {colOp > 0.01 && (
            <div style={{
              position: "absolute", left: "70%", top: "28%", width: 26, height: COL_H, marginLeft: -13,
              opacity: colOp,
              background: `linear-gradient(180deg, ${rgba(V.white, 0.10)} 0%, ${rgba(V.white, 0.04)} 100%)`,
              border: `1px solid ${rgba(V.white, 0.22)}`, borderRadius: 4,
            }}>
              {/* lo que dice la norma: 25 °C, en naranja (viene de la caja) */}
              <div style={{
                position: "absolute", left: 2, right: 2, bottom: 2, height: Math.max(0, hNorma),
                background: `linear-gradient(180deg, ${rgba(V.orange, 0.9)} 0%, ${rgba(V.orange, 0.55)} 100%)`,
                borderRadius: 3,
              }} />
              {/* lo que marcó el infrarrojo, en volt, apilado encima */}
              <div style={{
                position: "absolute", left: 2, right: 2, bottom: 2 + hNorma, height: Math.max(0, hReal - hNorma),
                background: `linear-gradient(180deg, ${rgba(V.volt, 0.95)} 0%, ${rgba(V.volt, 0.5)} 100%)`,
                boxShadow: `0 0 26px ${rgba(V.volt, 0.55)}`, borderRadius: 3,
              }} />
              {/* las dos marcas, siempre a la IZQUIERDA de la columna (safe area de la derecha) */}
              <div style={{
                position: "absolute", right: 44, bottom: hNorma - 16, width: 420, textAlign: "right",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 2.2,
                color: V.orange, textShadow: `0 3px 16px ${rgba(V.ink0, 0.95)}`,
              }}>25° · LO QUE DICE LA NORMA</div>
              <div style={{
                position: "absolute", right: 44, bottom: hReal - 18, width: 420, textAlign: "right",
                opacity: ez(g, 1320, 1364),
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 2.2,
                color: V.volt, textShadow: `0 3px 16px ${rgba(V.ink0, 0.95)}`,
              }}>52,3° · LO QUE MARCA EL PANEL</div>
              {/* el ícono del instrumento, coronando la columna */}
              <div style={{ position: "absolute", left: 13, top: -74, width: 0 }}>
                <IconPng src="img/cmetemu/cmet_ic_termometro.png" x={0} y={0} size={78} z={0} glow={V.ink0} />
              </div>
            </div>
          )}

          {/* ── LAS CIFRAS ── */}
          {/* 1.000 W/m²: es LO QUE PROMETE LA NORMA → naranja (acto 3) */}
          {g >= 758 && g < 1086 && (
            <>
              <Readout value="1.000" unit="W/m²" label="SOL DE LABORATORIO" at={at(758)}
                x={25} y={52} size={128} color={V.orange} />
              <div style={{ position: "absolute", left: "12.5%", top: "37%" }}>
                <IconPng src="img/cmetemu/cmet_ic_sol.png" x={0} y={0} size={96} z={0} glow={V.ink0}
                  opacity={ez(g, 774, 812)} />
              </div>
            </>
          )}
          {/* 52 redondo: la primera lectura del infrarrojo (f1298 «está a cincuenta y dos») */}
          {g >= 1308 && g < 1430 && (
            <Readout value="52" unit="°C" label="AL SOL DEL MEDIODÍA" at={at(1308)}
              x={30} y={31} size={126} color={V.volt} />
          )}
          {/* 52,3 exacto: nace en la pantallita, CRUZA la oclusión y se queda en el acto 5 */}
          {g >= 1430 && g < 1690 && (
            <Readout value="52,3" unit="°C" label="MEDIDO CON EL INFRARROJO" at={at(1430)}
              x={r523X} y={r523Y} size={r523S} color={V.volt} />
          )}

          {/* EL CAMPO FIRMA: lo que promete la caja contra lo que deja el calor (acto 5) */}
          {g >= 1512 && (
            <PromiseGap
              promise={100} measured={88 * gapGrow} unit="W"
              x={72} y={44} w={460} h={236} slats={20}
              on={ez(g, 1512, 1548)} label="SOLO POR EL CALOR" />
          )}
        </Plane>

        {/* P5 · EL MATERIAL REAL: las tarjetas protagonistas (una por acto) ── */}
        <Plane z={40}>
          {/* ACTO 1 — el dorso del panel dado vuelta. Sale por ESCALA: la etiqueta se vuelve la mesa. */}
          {a1On && (
            <AbsoluteFill style={{
              transform: `scale(${a1Scale.toFixed(3)})`, transformOrigin: "48% 54%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_etiq1.mp4" kind="video"
                w={a1W} h={a1H} x={50} y={48} z={0}
                ry={lerp(10, 0.6, ez(g, 20, 260))} rx={lerp(-4, 0, ez(g, 20, 260))}
                radius={16} startFrom={3} lit={0.62 + 0.38 * ez(g, 10, 140)}
                litColor={cKey} sheenAt={at(88)}
                label={escala > 0.02 ? undefined : "EL DORSO DEL PANEL PLEGABLE"}
              />
              {/* el ojo sobre la etiqueta: estructura gráfica, no un objeto dibujado */}
              {marcoOp > 0.01 && (
                <div style={{
                  position: "absolute", left: "48%", top: "54%", width: 330, height: 190,
                  marginLeft: -165, marginTop: -95, opacity: marcoOp,
                  border: `2px solid ${rgba(V.silver, 0.9)}`, borderRadius: 6,
                  boxShadow: `0 0 30px ${rgba(V.silver, 0.4)}, inset 0 0 40px ${rgba(V.silver, 0.16)}`,
                }} />
              )}
            </AbsoluteFill>
          )}

          {/* ACTO 2 — MATCH DE ESCALA: el macro de la etiqueta entra en el mismo encuadre y es la mesa */}
          {a2On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_etiq2.mp4" kind="video"
              w={a2W} h={a2H} x={50} y={a2Y} z={0}
              ry={lerp(0, 5, ez(g, 400, 660))} rx={lerp(0, -2.4, ez(g, 400, 660))}
              radius={14} startFrom={6} lit={0.98} litColor={cKey}
              label="ETIQUETA DEL DORSO · LA QUE MIRA EL QUE CERTIFICA" sheenAt={at(372)}
            />
          )}

          {/* la SIGLA marcada sobre la etiqueta (estructura sobre material real) */}
          {stcOp > 0.01 && (
            <div style={{
              position: "absolute", left: "50%", top: "22%", width: 620, height: 128,
              marginLeft: -310, marginTop: -64, opacity: stcOp,
              border: `3px solid ${rgba(V.volt, 0.92)}`, borderRadius: 8,
              boxShadow: `0 0 46px ${rgba(V.volt, 0.45)}, inset 0 0 60px ${rgba(V.volt, 0.14)}`,
            }}>
              <div style={{
                position: "absolute", left: -2, top: 128, width: 3, height: 150 * ez(g, 500, 552),
                background: `linear-gradient(180deg, ${rgba(V.volt, 0.9)} 0%, ${rgba(V.volt, 0.1)} 100%)`,
              }} />
            </div>
          )}

          {/* ── LAS TRES CONDICIONES: renglones de la etiqueta desplegados como FICHAS con
                MATERIAL REAL adentro. La ficha 1 es la que se MORFA en el disco del sol. ── */}
          {g >= 600 && g < 1266 && (
            <AbsoluteFill style={{
              transform: `scaleY(${(0.08 + 0.92 * fichaIn(0)).toFixed(3)})`, transformOrigin: "50% 34%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_etiq3.mp4" kind="video"
                w={f1W} h={f1H} x={f1X} y={f1Y} z={lerp(0, 60, morfo)}
                ry={lerp(-7, 0, morfo)} radius={f1R} startFrom={2}
                lit={0.7 + 0.3 * morfo} litColor={cKey}
                label={morfo > 0.35 ? undefined : "MIL VATIOS POR METRO CUADRADO"}
                sheenAt={at(628)}
              />
            </AbsoluteFill>
          )}
          {g >= 622 && g < SEAM_OCC + 7 && (
            <AbsoluteFill style={{
              transform: `scaleY(${(0.08 + 0.92 * fichaIn(1)).toFixed(3)})`, transformOrigin: "50% 50%",
            }}>
              <MediaCard
                src="img/cmetemu/cmet_mv_etiq4.jpg" kind="photo"
                w={f2W} h={Math.round(f2W * 0.5625)} x={f2X} y={f2Y} z={0}
                ry={lerp(-7, 6, f2Trip)} radius={12}
                lit={0.55 + 0.45 * ez(g, 830, 900)} litColor={V.volt}
                label="25 °C EN LA CELDA" sheenAt={at(838)}
              />
            </AbsoluteFill>
          )}
          {g >= 644 && g < 1152 && (
            <AbsoluteFill style={{
              transform: `scaleY(${(0.08 + 0.92 * fichaIn(2)).toFixed(3)})`, transformOrigin: "50% 66%",
            }}>
              <MediaCard
                src="img/cmetemu/cmet_h07.jpg" kind="photo"
                w={f3W} h={Math.round(f3W * 0.5625)} x={f3X} y={f3Y} z={0}
                ry={lerp(-7, 6, f3Trip)} radius={12}
                lit={0.5 + 0.5 * ez(g, 916, 986)} litColor={V.volt}
                label="SOL PERPENDICULAR, SIN NUBES" sheenAt={at(920)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 4 — el panel real SUBE desde abajo del cuadro con la inercia de la cámara */}
          {a4On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_etiq4.mp4" kind="video"
              w={a4W} h={a4H} x={lerp(50, 42, ez(g, 1150, 1330))} y={a4Y} z={0}
              ry={lerp(6, -3, ez(g, 1056, 1300))} rx={lerp(6, 0, ez(g, 1056, 1240))}
              radius={16} startFrom={4} lit={0.96} litColor={V.volt}
              label="TERMÓMETRO INFRARROJO SOBRE LA CELDA" sheenAt={at(1290)}
            />
          )}

          {/* ACTO 5 — el panel A RAS: otro encuadre, claramente otro (tira rasante, no plano medio) */}
          {a5On && (
            <AbsoluteFill style={{ transform: `scale(${a5Kb.toFixed(4)})`, transformOrigin: "50% 62%" }}>
              <MediaCard
                src="img/cmetemu/cmet_mv_etiq4.jpg" kind="photo"
                w={1700} h={556} x={48} y={lerp(66, 61, ez(g, 1470, 1700))} z={0}
                ry={lerp(3, -1.5, ez(g, 1470, 1720))} rx={lerp(10, 5, ez(g, 1470, 1660))}
                radius={10} lit={1} litColor={V.volt}
                label="LA SUPERFICIE, A LAS DOS DE LA TARDE" sheenAt={at(1498)}
              />
            </AbsoluteFill>
          )}
        </Plane>

        {/* P6 · primer plano: la bolsita que se va, el polvo del patio, el calor temblando */}
        <Plane z={230}>
          {/* la MATERIA que hereda de `MovCinco`: la bolsita desenfocada CAE fuera de cuadro */}
          {bolsa < 1 && (
            <div style={{
              position: "absolute", left: "39%", top: `${lerp(42, 138, bolsa).toFixed(2)}%`,
              width: 1020, height: 780, marginLeft: -510, marginTop: -390,
              transform: `rotate(${lerp(-7, 16, bolsa).toFixed(2)}deg)`,
              background:
                `radial-gradient(58% 52% at 44% 40%, ${rgba(V.white, 0.30)} 0%, ${rgba(V.silver, 0.15)} 42%, rgba(0,0,0,0) 74%)`,
              filter: "blur(26px)",
            }} />
          )}
          {/* polvo del taller atravesando el haz: hold VIVO, nunca hay un cuadro quieto */}
          {Array.from({ length: 16 }, (_, i) => {
            const sp = 0.4 + rnd(i * 4.7) * 1.1;
            const yy = ((rnd(i * 8.3) * 130 - (g * sp) / 24) % 130 + 130) % 130 - 12;
            const s = 2 + rnd(i * 2.9) * 3.2;
            return (
              <div key={`d${i}`} style={{
                position: "absolute", left: `${(8 + rnd(i * 6.1) * 84).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, 0.1 + rnd(i * 3.7) * 0.22),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.2)}`,
              }} />
            );
          })}
          {/* EL CALOR TEMBLANDO sobre el panel (acto 5): bandas que ondulan, nunca quietas */}
          {g >= F_A5 + 4 && Array.from({ length: 20 }, (_, i) => {
            const a = ez(g, 1470, 1560) * (0.4 + rnd(i * 1.9) * 0.6);
            const yy = 50 + rnd(i * 5.7) * 30;
            const w = 180 + rnd(i * 2.3) * 420;
            const dx = Math.sin(g / (9 + rnd(i * 7.1) * 7) + i * 1.7) * (8 + rnd(i * 3.9) * 12);
            return (
              <div key={`h${i}`} style={{
                position: "absolute", left: `${(6 + rnd(i * 4.1) * 82).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: w, height: 3 + rnd(i * 6.3) * 4,
                transform: `translateX(${dx.toFixed(2)}px)`,
                background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.white, 0.16 * a)} 40%, ${rgba(V.volt, 0.12 * a)} 62%, rgba(0,0,0,0) 100%)`,
                mixBlendMode: "screen",
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS Y LUZ DE EVENTO (encima de todo, nunca un fade) ── */}
      {/* f1456 · frontera 4→5: la ETIQUETA PLATEADA cruza y tapa el 100 % en f1463 */}
      <SeamOcclude at={at(SEAM_OCC)} dur={14} color={V.silver} angle={7} />
      {/* f762 · NO es costura (cae 74 frames DESPUÉS de la frontera, dentro del acto 3): es la luz del
          evento, el sol prendiendo cuando el renglón termina de cerrarse en disco. Ámbar y 6 frames. */}
      <SeamFlash at={at(762)} color={V.amber} dur={6} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={36} outF={300} kick="EL DORSO" head="DALE VUELTA AL PANEL"
          sub="La etiqueta plateada es la que mira el que certifica." kickColor={V.silver} />
        <Titular g={g} inF={468} outF={648} kick="LA SIGLA QUE DECIDE TODO" head="STC" size={104}
          sub="Condiciones estándar de prueba." kickColor={V.silver} />
        <Titular g={g} inF={748} outF={1032} kick="CONDICIÓN UNO" head="MIL VATIOS POR METRO CUADRADO"
          size={62} sub="Un sol de laboratorio, perfecto, sin una nube." kickColor={V.orange} />
        <Titular g={g} inF={1118} outF={1424} kick="MEDIDO CON EL INFRARROJO"
          head="CINCUENTA Y DOS COMA TRES" size={64}
          sub="Veinticinco en la celda no son veinticinco de ambiente." />
        <Titular g={g} inF={1494} outF={1682} kick="EL DÍA DE LA ETIQUETA"
          head="ESE DÍA, EN TU PATIO, NO EXISTE" size={60}
          sub="Cada grado por encima de veinticinco te cuesta medio por ciento." />

        {/* el dato del acto 5, arriba a la derecha, sobre cama (nunca sobre fondo plano) */}
        {g >= 1566 && g < 1724 && (
          <div style={{
            position: "absolute", right: 66, top: 96, width: 430, textAlign: "right",
            opacity: Math.min(ez(g, 1566, 1600), 1 - ez(g, 1700, 1724)),
          }}>
            <Bed pad={22}>
              <Kick color={V.orange}>POR CADA GRADO DE MÁS</Kick>
              <div style={{ marginTop: 8 }}><Body size={31}>Entre cuatro y cinco décimas de por ciento.</Body></div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
